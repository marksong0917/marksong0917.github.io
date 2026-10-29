#!/usr/bin/env bash
# ============================================================================
# Home Server Guide - one-click installer
# https://marksong0917.github.io/home-server-guide/
#
# Sets up Xray (VLESS + REALITY, TCP 443) and Hysteria2 (UDP 443) as systemd
# services on a Debian/Ubuntu machine, with every secret generated fresh on
# YOUR server during the run. Nothing is hardcoded, nothing is sent anywhere.
#
# Usage:
#   sudo bash install.sh              install / re-run (regenerates secrets)
#   sudo bash install.sh uninstall    stop and remove services and configs
#
# Optional environment overrides:
#   REALITY_DEST   camouflage site for REALITY      (default: www.microsoft.com)
#   REALITY_SNI    SNI / server name                (default: same as REALITY_DEST)
#   HY2_DOMAIN     use your own domain for Hysteria2 instead of the server IP
#   HY2_CERT       path to an existing TLS cert for Hysteria2 (fullchain)
#   HY2_KEY        path to the matching TLS private key
#
# Re-running the installer is safe: it rewrites both configs with FRESH
# secrets, so any client links you imported before will stop working and
# must be re-imported from the new summary printed at the end.
# Read this file before running it - that is the whole point of open scripts.
# ============================================================================
set -euo pipefail

XRAY_CONFIG_DIR="/usr/local/etc/xray"
XRAY_CONFIG="${XRAY_CONFIG_DIR}/config.json"
HY2_CONFIG_DIR="/etc/hysteria"
HY2_CONFIG="${HY2_CONFIG_DIR}/config.yaml"

REALITY_DEST="${REALITY_DEST:-www.microsoft.com}"
REALITY_SNI="${REALITY_SNI:-$REALITY_DEST}"
HY2_SNI="${HY2_DOMAIN:-$REALITY_SNI}"

log()  { printf '\n==> %s\n' "$*"; }
warn() { printf '!!  %s\n' "$*" >&2; }
die()  { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

# ---------------------------------------------------------------- uninstall
uninstall() {
  log "Stopping and disabling services"
  systemctl disable --now xray 2>/dev/null || true
  systemctl disable --now hysteria-server 2>/dev/null || true

  log "Removing Xray (official uninstall)"
  if command -v xray >/dev/null 2>&1 || [ -f /usr/local/bin/xray ]; then
    bash -c "$(curl -fsSL https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ remove || true
  fi

  log "Removing Hysteria2"
  rm -f /usr/local/bin/hysteria
  rm -f /etc/systemd/system/hysteria-server.service
  rm -rf "$HY2_CONFIG_DIR" "$XRAY_CONFIG_DIR"
  systemctl daemon-reload || true
  echo "Done. Firewall rules (if any were added) were left as-is; remove them with: ufw delete allow 443/tcp ; ufw delete allow 443/udp"
}

# ------------------------------------------------------------- pre-flight
[ "${EUID:-$(id -u)}" -eq 0 ] || die "Run as root: sudo bash install.sh"
if [ "${1:-}" = "uninstall" ]; then uninstall; exit 0; fi

command -v apt-get >/dev/null 2>&1 || die "This installer supports Debian/Ubuntu (apt) only. On other systems, follow the manual setup in the guide."
. /etc/os-release 2>/dev/null || true
case "${ID:-} ${ID_LIKE:-}" in
  *debian*|*ubuntu*) : ;;
  *) warn "OS not detected as Debian/Ubuntu (${PRETTY_NAME:-unknown}) - continuing anyway, apt is present." ;;
esac

log "Installing prerequisites (curl, openssl)"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl openssl ca-certificates >/dev/null

# --------------------------------------------------------------- Xray core
log "Installing Xray-core (official XTLS install script)"
bash -c "$(curl -fsSL https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install

# -------------------------------------------------------------- Hysteria2
log "Installing Hysteria2 (official install script)"
bash -c "$(curl -fsSL https://get.hy2.sh/)"

# -------------------------------------------------------- generate secrets
log "Generating fresh secrets on this server"
UUID="$(cat /proc/sys/kernel/random/uuid)"
KEYS="$(xray x25519)"
REALITY_PRIVATE="$(printf '%s\n' "$KEYS" | grep -i 'private' | awk -F': ' '{print $2}' | tr -d '[:space:]')"
REALITY_PUBLIC="$(printf '%s\n' "$KEYS" | grep -i 'public' | awk -F': ' '{print $2}' | tr -d '[:space:]')"
[ -n "$REALITY_PRIVATE" ] && [ -n "$REALITY_PUBLIC" ] || die "Could not parse the xray x25519 output - aborting before writing configs."
SHORT_ID="$(openssl rand -hex 8)"
HY2_PASSWORD="$(openssl rand -hex 24)"
HY2_OBFS_PASSWORD="$(openssl rand -hex 24)"

# ------------------------------------------------------------ Xray config
log "Writing Xray config: VLESS + REALITY on TCP 443"
mkdir -p "$XRAY_CONFIG_DIR"
cat > "$XRAY_CONFIG" <<EOF
{
  "log": { "loglevel": "warning" },
  "inbounds": [{
    "listen": "0.0.0.0",
    "port": 443,
    "protocol": "vless",
    "settings": {
      "clients": [{ "id": "${UUID}", "flow": "xtls-rprx-vision" }],
      "decryption": "none"
    },
    "streamSettings": {
      "network": "tcp",
      "security": "reality",
      "realitySettings": {
        "show": false,
        "dest": "${REALITY_DEST}:443",
        "xver": 0,
        "serverNames": ["${REALITY_SNI}"],
        "privateKey": "${REALITY_PRIVATE}",
        "shortIds": ["${SHORT_ID}"]
      }
    },
    "sniffing": { "enabled": true, "destOverride": ["http", "tls"] }
  }],
  "outbounds": [{ "protocol": "freedom", "tag": "direct" }]
}
EOF
xray run -test -config "$XRAY_CONFIG" >/dev/null && echo "Xray config OK" || die "Xray config failed validation."

# --------------------------------------------------------- Hysteria2 setup
log "Preparing Hysteria2 TLS certificate"
mkdir -p "$HY2_CONFIG_DIR"
if [ -n "${HY2_CERT:-}" ] && [ -n "${HY2_KEY:-}" ]; then
  [ -f "$HY2_CERT" ] && [ -f "$HY2_KEY" ] || die "HY2_CERT / HY2_KEY were set but the files do not exist."
  HY2_CERT_PATH="$HY2_CERT"
  HY2_KEY_PATH="$HY2_KEY"
  echo "Using your certificate: $HY2_CERT_PATH"
  HY2_INSECURE=0
else
  # Self-signed cert, generated here on the spot. Clients must use
  # insecure=1 (the link printed at the end already includes it): the cert
  # proves nothing about identity, the password is what authenticates.
  HY2_CERT_PATH="${HY2_CONFIG_DIR}/cert.pem"
  HY2_KEY_PATH="${HY2_CONFIG_DIR}/key.pem"
  openssl req -x509 -nodes -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 \
    -keyout "$HY2_KEY_PATH" -out "$HY2_CERT_PATH" -days 3650 \
    -subj "/CN=${HY2_SNI}" 2>/dev/null
  chmod 600 "$HY2_KEY_PATH"
  HY2_INSECURE=1
  echo "Self-signed certificate generated (clients will use insecure=1)."
fi

log "Writing Hysteria2 config: UDP 443 with salamander obfuscation"
cat > "$HY2_CONFIG" <<EOF
listen: :443

tls:
  cert: ${HY2_CERT_PATH}
  key: ${HY2_KEY_PATH}

obfs:
  type: salamander
  salamander:
    password: ${HY2_OBFS_PASSWORD}

auth:
  type: password
  password: ${HY2_PASSWORD}

masquerade:
  type: proxy
  proxy:
    url: https://${REALITY_DEST}
    rewriteHost: true
EOF

# The official installer drops a unit template; make sure the service uses
# our config path, then enable it.
if [ -f /etc/systemd/system/hysteria-server.service ]; then
  sed -i "s|^ExecStart=.*|ExecStart=/usr/local/bin/hysteria server --config ${HY2_CONFIG}|" /etc/systemd/system/hysteria-server.service || true
fi

# --------------------------------------------------------------- firewall
if command -v ufw >/dev/null 2>&1 && ufw status | grep -qi "status: active"; then
  log "ufw is active - opening 443/tcp and 443/udp"
  ufw allow 443/tcp >/dev/null
  ufw allow 443/udp >/dev/null
else
  warn "ufw not active - if you use another firewall or a cloud panel, open 443/tcp and 443/udp there."
fi

# --------------------------------------------------------------- services
log "Enabling and starting services"
systemctl daemon-reload
systemctl enable --now xray
systemctl enable --now hysteria-server
sleep 2
systemctl is-active --quiet xray || die "Xray failed to start. Debug with: journalctl -u xray -e --no-pager"
systemctl is-active --quiet hysteria-server || die "Hysteria2 failed to start. Debug with: journalctl -u hysteria-server -e --no-pager"
echo "Both services are running."

# ---------------------------------------------------------------- summary
SERVER_IP="$(curl -fsSL https://api.ipify.org 2>/dev/null || curl -fsSL https://ifconfig.me 2>/dev/null || echo '<server-ip>')"
LINK_HOST="${HY2_DOMAIN:-$SERVER_IP}"
VLESS_LINK="vless://${UUID}@${SERVER_IP}:443?encryption=none&security=reality&sni=${REALITY_SNI}&fp=chrome&pbk=${REALITY_PUBLIC}&sid=${SHORT_ID}&type=tcp&flow=xtls-rprx-vision#Home-REALITY"
HY2_LINK="hy2://${HY2_PASSWORD}@${LINK_HOST}:443?obfs=salamander&obfs-password=${HY2_OBFS_PASSWORD}&insecure=${HY2_INSECURE}&sni=${HY2_SNI}#Home-HY2"

cat <<EOF

====================================================================
  DONE - your server is live. Save this summary somewhere private:
  these links are keys to your server. Do not post them in public.
====================================================================
Server IP : ${SERVER_IP}

[1] Xray - VLESS + REALITY (daily driver, TCP 443)
${VLESS_LINK}

[2] Hysteria2 (fast lane, UDP 443)
${HY2_LINK}

Import:
  Shadowrocket (iOS)   : + > scan QR / paste the link from clipboard
  v2rayN (Windows)     : Servers > Import bulk URL from clipboard
  v2rayNG (Android)    : + > Import config from clipboard
  sing-box             : add each link as an outbound (vless / hysteria2)

Test: connect, then open an IP-check site - it should show ${SERVER_IP}.
Re-running this installer regenerates ALL secrets; old links die.
Remove everything: sudo bash install.sh uninstall
====================================================================
EOF
