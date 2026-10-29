// View switching
const items = document.querySelectorAll('.menu-item');
items.forEach((btn) => {
  btn.addEventListener('click', () => {
    items.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
    document.getElementById('view-' + btn.dataset.view).classList.add('active');
  });
});

// Projects (sample data)
const projects = [
  { name: 'Chen Kitchen Reno', client: 'Chen Family', stage: 'Design approved', value: '$18,400', due: 'Nov 20', pct: 45, note: 'Full kitchen remodel. Cabinets are approved, materials are ordered, production starts Thursday.' },
  { name: 'Riverside Dental — Reception', client: 'Riverside Dental', stage: 'In production', value: '$12,900', due: 'Nov 14', pct: 70, note: 'Reception desk and wall panels. In production now, install booked for next week.' },
  { name: 'Aurora Bakery — Storage', client: 'Aurora Bakery', stage: 'Quote sent', value: '$6,300', due: '—', pct: 15, note: 'Walk-in storage shelving. Quote sent yesterday, waiting on the client.' },
  { name: 'North York Condo Closets', client: 'North York Condos', stage: 'Install', value: '$9,750', due: 'Nov 12', pct: 90, note: 'Six reach-in closets. Install crew on site, final day tomorrow.' },
  { name: 'Patel Family — Mudroom', client: 'Patel Family', stage: 'Measuring', value: '$5,100', due: 'Dec 2', pct: 25, note: 'Mudroom lockers and bench. Site measure done, design draft in progress.' },
];
const rows = document.getElementById('projectRows');
projects.forEach((p, i) => {
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${p.name}</td><td>${p.client}</td><td>${p.stage}</td><td>${p.value}</td><td>${p.due}</td>`;
  tr.addEventListener('click', () => showProject(i));
  rows.appendChild(tr);
});
function showProject(i) {
  const p = projects[i];
  document.getElementById('projectDetail').hidden = false;
  document.getElementById('detailTitle').textContent = p.name;
  document.getElementById('detailBody').textContent = p.note;
  document.getElementById('detailBar').style.width = p.pct + '%';
  document.getElementById('detailMeta').textContent = `${p.client} · ${p.stage} · ${p.value} · Due ${p.due} · ${p.pct}% complete`;
  document.getElementById('projectDetail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Fox chat (canned answers over the sample data)
const chat = document.getElementById('chat');
function foxAnswer(q) {
  const t = q.toLowerCase();
  if (t.includes('overdue')) return 'One invoice is overdue: #1039, Aurora Bakery, $1,275. I can draft a friendly reminder — in the full version I send it after your approval.';
  if (t.includes('month') || t.includes('revenue') || t.includes('going')) return 'November is at $31,260 so far, up 12% on last month. Eight open projects worth $52,450 in total.';
  if (t.includes('week') || t.includes('due')) return 'Due this week: North York Condo Closets install finishes Nov 12, Riverside Dental invoice #1042 is due in 2 days, and Chen Kitchen moves to production Thursday.';
  if (t.includes('project')) return 'There are 8 open projects. The biggest is Chen Kitchen Reno at $18,400 — design approved, production starts Thursday. Click Projects on the left to see them all.';
  if (t.includes('price') || t.includes('cost') || t.includes('buy')) return 'Foxuma is $99/month for your first user, and founding customers lock a flat rate for up to 10 users for 2 years. Details are at foxuma.com.';
  return 'In this demo I answer from the sample data: try asking what is overdue, what is due this week, or how this month is going. In the full version I work on your real projects, invoices and schedule.';
}
function addMsg(text, who) {
  const d = document.createElement('div');
  d.className = 'msg ' + who;
  d.textContent = text;
  chat.appendChild(d);
  d.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
document.getElementById('chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const q = input.value.trim();
  if (!q) return;
  addMsg(q, 'user');
  input.value = '';
  setTimeout(() => addMsg(foxAnswer(q), 'fox'), 350);
});
document.querySelectorAll('.chip').forEach((c) => {
  c.addEventListener('click', () => {
    addMsg(c.dataset.q, 'user');
    setTimeout(() => addMsg(foxAnswer(c.dataset.q), 'fox'), 350);
  });
});
