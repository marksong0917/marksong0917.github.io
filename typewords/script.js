'use strict';
/* 打字背单词 · TypeWords
   A typing vocabulary trainer: type each English word letter by letter,
   hear it spoken (pre-generated neural voice clips), learn its Chinese
   meaning and an example sentence. Words missed join a review round.
   Four levels x 30 words: Primary / Middle School / High School / CET-4.
   Bilingual UI (中文 default / English). Our own implementation, MIT. */

/* ---------- data ----------
   w: word · ph: phonetic (simple IPA) · zh: Chinese meaning
   ex: English example · exZh: example translation */
const LEVELS = [
  { id:'primary', zh:'小学', en:'Primary School', tagZh:'基础词', tagEn:'Basics', words:[
    {w:'apple', ph:'/ˈæp.əl/', zh:'苹果', ex:'I eat an apple every day.', exZh:'我每天吃一个苹果。'},
    {w:'family', ph:'/ˈfæm.əl.i/', zh:'家庭；家人', ex:'My family lives in a big house.', exZh:'我的家人住在一所大房子里。'},
    {w:'weather', ph:'/ˈweð.ər/', zh:'天气', ex:'The weather is sunny today.', exZh:'今天天气晴朗。'},
    {w:'school', ph:'/skuːl/', zh:'学校', ex:'We walk to school together.', exZh:'我们一起走路去学校。'},
    {w:'friend', ph:'/frend/', zh:'朋友', ex:'Tom is my best friend.', exZh:'汤姆是我最好的朋友。'},
    {w:'water', ph:'/ˈwɔː.tər/', zh:'水', ex:'Please drink some water.', exZh:'请喝一些水。'},
    {w:'happy', ph:'/ˈhæp.i/', zh:'开心的；高兴的', ex:'The children are very happy.', exZh:'孩子们非常开心。'},
    {w:'animal', ph:'/ˈæn.ɪ.məl/', zh:'动物', ex:'A dog is a friendly animal.', exZh:'狗是一种友善的动物。'},
    {w:'book', ph:'/bʊk/', zh:'书', ex:'She reads a book before bed.', exZh:'她睡前读一本书。'},
    {w:'morning', ph:'/ˈmɔːr.nɪŋ/', zh:'早晨；上午', ex:'I get up early in the morning.', exZh:'我早上起得很早。'},
    {w:'color', ph:'/ˈkʌl.ər/', zh:'颜色', ex:'What color is your bag?', exZh:'你的书包是什么颜色？'},
    {w:'banana', ph:'/bəˈnɑː.nə/', zh:'香蕉', ex:'I like this sweet banana.', exZh:'我喜欢这根甜香蕉。'},
    {w:'teacher', ph:'/ˈtiː.tʃər/', zh:'老师', ex:'Our teacher is very kind.', exZh:'我们的老师非常亲切。'},
    {w:'mother', ph:'/ˈmʌð.ər/', zh:'母亲；妈妈', ex:'My mother cooks dinner for us.', exZh:'我妈妈为我们做晚饭。'},
    {w:'father', ph:'/ˈfɑː.ðər/', zh:'父亲；爸爸', ex:'His father drives a bus.', exZh:'他的爸爸开公交车。'},
    {w:'sister', ph:'/ˈsɪs.tər/', zh:'姐姐；妹妹', ex:'My sister is ten years old.', exZh:'我的妹妹十岁了。'},
    {w:'brother', ph:'/ˈbrʌð.ər/', zh:'哥哥；弟弟', ex:'My brother plays football.', exZh:'我的哥哥踢足球。'},
    {w:'window', ph:'/ˈwɪn.dəʊ/', zh:'窗户', ex:'Please open the window.', exZh:'请打开窗户。'},
    {w:'garden', ph:'/ˈɡɑːr.dən/', zh:'花园', ex:'Flowers grow in the garden.', exZh:'花儿在花园里生长。'},
    {w:'yellow', ph:'/ˈjel.əʊ/', zh:'黄色的；黄色', ex:'The sun is bright and yellow.', exZh:'太阳又亮又黄。'},
    {w:'winter', ph:'/ˈwɪn.tər/', zh:'冬天', ex:'It snows a lot in winter.', exZh:'冬天下很多雪。'},
    {w:'summer', ph:'/ˈsʌm.ər/', zh:'夏天', ex:'We swim in the river in summer.', exZh:'我们夏天在河里游泳。'},
    {w:'bread', ph:'/bred/', zh:'面包', ex:'I eat bread for breakfast.', exZh:'我早餐吃面包。'},
    {w:'milk', ph:'/mɪlk/', zh:'牛奶', ex:'She drinks milk every morning.', exZh:'她每天早上喝牛奶。'},
    {w:'house', ph:'/haʊs/', zh:'房子', ex:'They live in a small house.', exZh:'他们住在一所小房子里。'},
    {w:'tree', ph:'/triː/', zh:'树', ex:'A tall tree stands by the river.', exZh:'河边有一棵大树。'},
    {w:'flower', ph:'/ˈflaʊ.ər/', zh:'花', ex:'This flower smells sweet.', exZh:'这朵花闻起来很香。'},
    {w:'rain', ph:'/reɪn/', zh:'雨；下雨', ex:'It will rain tomorrow.', exZh:'明天会下雨。'},
    {w:'sun', ph:'/sʌn/', zh:'太阳', ex:'The sun rises in the east.', exZh:'太阳从东方升起。'},
    {w:'play', ph:'/pleɪ/', zh:'玩；玩耍', ex:'The children play in the park.', exZh:'孩子们在公园里玩耍。'}
  ]},
  { id:'middle', zh:'初中', en:'Middle School', tagZh:'常用词', tagEn:'Everyday', words:[
    {w:'important', ph:'/ɪmˈpɔːr.tənt/', zh:'重要的', ex:'English is important for us.', exZh:'英语对我们很重要。'},
    {w:'different', ph:'/ˈdɪf.ər.ənt/', zh:'不同的', ex:'We have different ideas about it.', exZh:'我们对此有不同的想法。'},
    {w:'language', ph:'/ˈlæŋ.ɡwɪdʒ/', zh:'语言', ex:'Chinese is a beautiful language.', exZh:'汉语是一门美丽的语言。'},
    {w:'exercise', ph:'/ˈek.sər.saɪz/', zh:'锻炼；练习', ex:'Exercise keeps us healthy.', exZh:'锻炼让我们保持健康。'},
    {w:'homework', ph:'/ˈhəʊm.wɜːrk/', zh:'家庭作业', ex:'I finish my homework before dinner.', exZh:'我在晚饭前做完作业。'},
    {w:'library', ph:'/ˈlaɪ.brər.i/', zh:'图书馆', ex:'We borrow books from the library.', exZh:'我们从图书馆借书。'},
    {w:'journey', ph:'/ˈdʒɜːr.ni/', zh:'旅行；旅程', ex:'The journey took three days.', exZh:'这趟旅程花了三天。'},
    {w:'science', ph:'/ˈsaɪ.əns/', zh:'科学', ex:'Science helps us understand the world.', exZh:'科学帮助我们理解世界。'},
    {w:'history', ph:'/ˈhɪs.tər.i/', zh:'历史', ex:'He is good at history.', exZh:'他擅长历史。'},
    {w:'music', ph:'/ˈmjuː.zɪk/', zh:'音乐', ex:'Music makes me feel relaxed.', exZh:'音乐让我感到放松。'},
    {w:'visit', ph:'/ˈvɪz.ɪt/', zh:'参观；拜访', ex:'We will visit the museum on Sunday.', exZh:'我们周日去参观博物馆。'},
    {w:'build', ph:'/bɪld/', zh:'建造', ex:'They will build a new school here.', exZh:'他们要在这里建一所新学校。'},
    {w:'grow', ph:'/ɡrəʊ/', zh:'生长；种植', ex:'Farmers grow rice in the south.', exZh:'农民在南方种植水稻。'},
    {w:'decide', ph:'/dɪˈsaɪd/', zh:'决定', ex:'We must decide before Friday.', exZh:'我们必须在周五之前做决定。'},
    {w:'invite', ph:'/ɪnˈvaɪt/', zh:'邀请', ex:'Did you invite him to the party?', exZh:'你邀请他来参加聚会了吗？'},
    {w:'collect', ph:'/kəˈlekt/', zh:'收集', ex:'My hobby is to collect stamps.', exZh:'我的爱好是集邮。'},
    {w:'protect', ph:'/prəˈtekt/', zh:'保护', ex:'We should protect the environment.', exZh:'我们应该保护环境。'},
    {w:'believe', ph:'/bɪˈliːv/', zh:'相信', ex:'I believe you can do it.', exZh:'我相信你能做到。'},
    {w:'prepare', ph:'/prɪˈpeər/', zh:'准备', ex:'Let us prepare for the test.', exZh:'让我们为考试做准备。'},
    {w:'practice', ph:'/ˈpræk.tɪs/', zh:'练习', ex:'Practice makes perfect.', exZh:'熟能生巧。'},
    {w:'neighbor', ph:'/ˈneɪ.bər/', zh:'邻居', ex:'Our neighbor is a friendly old man.', exZh:'我们的邻居是一位友善的老人。'},
    {w:'comfortable', ph:'/ˈkʌmf.tə.bəl/', zh:'舒适的', ex:'This chair is very comfortable.', exZh:'这把椅子非常舒服。'},
    {w:'dangerous', ph:'/ˈdeɪn.dʒər.əs/', zh:'危险的', ex:'It is dangerous to swim there.', exZh:'在那里游泳很危险。'},
    {w:'popular', ph:'/ˈpɒp.jə.lər/', zh:'受欢迎的', ex:'This song is popular with young people.', exZh:'这首歌很受年轻人欢迎。'},
    {w:'healthy', ph:'/ˈhel.θi/', zh:'健康的', ex:'Eating vegetables is healthy.', exZh:'吃蔬菜有益健康。'},
    {w:'problem', ph:'/ˈprɒb.ləm/', zh:'问题；难题', ex:'Can you solve this problem?', exZh:'你能解决这个问题吗？'},
    {w:'question', ph:'/ˈkwes.tʃən/', zh:'问题', ex:'May I ask a question?', exZh:'我可以问一个问题吗？'},
    {w:'remember', ph:'/rɪˈmem.bər/', zh:'记得；记住', ex:'Do you remember his name?', exZh:'你记得他的名字吗？'},
    {w:'forget', ph:'/fərˈɡet/', zh:'忘记', ex:'Do not forget to bring your book.', exZh:'别忘了带你的书。'},
    {w:'wonderful', ph:'/ˈwʌn.dər.fəl/', zh:'精彩的；极好的', ex:'We had a wonderful time in Beijing.', exZh:'我们在北京度过了一段美好的时光。'}
  ]},
  { id:'high', zh:'高中', en:'High School', tagZh:'进阶词', tagEn:'Advanced', words:[
    {w:'achieve', ph:'/əˈtʃiːv/', zh:'实现；达到', ex:'You can achieve your goal with hard work.', exZh:'努力就能实现你的目标。'},
    {w:'attitude', ph:'/ˈæt.ɪ.tjuːd/', zh:'态度', ex:'A positive attitude changes everything.', exZh:'积极的态度能改变一切。'},
    {w:'challenge', ph:'/ˈtʃæl.ɪndʒ/', zh:'挑战', ex:'Learning a new language is a challenge.', exZh:'学习一门新语言是一种挑战。'},
    {w:'consider', ph:'/kənˈsɪd.ər/', zh:'考虑', ex:'Please consider my advice carefully.', exZh:'请认真考虑我的建议。'},
    {w:'culture', ph:'/ˈkʌl.tʃər/', zh:'文化', ex:'We should respect every culture.', exZh:'我们应该尊重每一种文化。'},
    {w:'develop', ph:'/dɪˈvel.əp/', zh:'发展；培养', ex:'Reading helps develop your mind.', exZh:'阅读有助于培养你的思维。'},
    {w:'education', ph:'/ˌedʒ.ʊˈkeɪ.ʃən/', zh:'教育', ex:'Education opens many doors.', exZh:'教育打开许多扇门。'},
    {w:'environment', ph:'/ɪnˈvaɪ.rən.mənt/', zh:'环境', ex:'Everyone must protect the environment.', exZh:'每个人都必须保护环境。'},
    {w:'experience', ph:'/ɪkˈspɪə.ri.əns/', zh:'经验；经历', ex:'That trip was a great experience.', exZh:'那次旅行是一段美好的经历。'},
    {w:'government', ph:'/ˈɡʌv.ərn.mənt/', zh:'政府', ex:'The government built a new hospital.', exZh:'政府建了一所新医院。'},
    {w:'knowledge', ph:'/ˈnɒl.ɪdʒ/', zh:'知识', ex:'Knowledge comes from books and practice.', exZh:'知识来自书本和实践。'},
    {w:'opportunity', ph:'/ˌɒp.ərˈtjuː.nə.ti/', zh:'机会', ex:'This is a good opportunity to learn.', exZh:'这是一个学习的好机会。'},
    {w:'patient', ph:'/ˈpeɪ.ʃənt/', zh:'耐心的', ex:'Teachers should be patient with students.', exZh:'老师应该对学生有耐心。'},
    {w:'population', ph:'/ˌpɒp.jəˈleɪ.ʃən/', zh:'人口', ex:'The city has a population of two million.', exZh:'这座城市有两百万人口。'},
    {w:'quality', ph:'/ˈkwɒl.ə.ti/', zh:'质量', ex:'Quality matters more than price.', exZh:'质量比价格更重要。'},
    {w:'responsibility', ph:'/rɪˌspɒn.səˈbɪl.ə.ti/', zh:'责任', ex:'It is your responsibility to finish it.', exZh:'完成它，是你的责任。'},
    {w:'succeed', ph:'/səkˈsiːd/', zh:'成功', ex:'She worked hard and finally succeeded.', exZh:'她努力工作，最终成功了。'},
    {w:'technology', ph:'/tekˈnɒl.ə.dʒi/', zh:'技术；科技', ex:'Technology changes our lives every day.', exZh:'技术每天都在改变我们的生活。'},
    {w:'tradition', ph:'/trəˈdɪʃ.ən/', zh:'传统', ex:'Spring Festival is an old tradition in China.', exZh:'春节是中国的一个古老传统。'},
    {w:'volunteer', ph:'/ˌvɒl.ənˈtɪər/', zh:'志愿者；自愿做', ex:'He works as a volunteer at the hospital.', exZh:'他在医院做志愿者。'},
    {w:'adventure', ph:'/ədˈven.tʃər/', zh:'冒险', ex:'The book tells of an adventure in Africa.', exZh:'这本书讲述了一场非洲冒险。'},
    {w:'behavior', ph:'/bɪˈheɪ.vjər/', zh:'行为', ex:'His behavior surprised everyone.', exZh:'他的行为让大家都很惊讶。'},
    {w:'communicate', ph:'/kəˈmjuː.nɪ.keɪt/', zh:'交流；沟通', ex:'We communicate by email every week.', exZh:'我们每周通过电子邮件交流。'},
    {w:'concentrate', ph:'/ˈkɒn.sən.treɪt/', zh:'专心；集中注意力', ex:'Concentrate on your work, please.', exZh:'请专心于你的工作。'},
    {w:'curious', ph:'/ˈkjʊə.ri.əs/', zh:'好奇的', ex:'Children are curious about everything.', exZh:'孩子们对一切都感到好奇。'},
    {w:'generous', ph:'/ˈdʒen.ər.əs/', zh:'慷慨的；大方的', ex:'She is generous with her time.', exZh:'她乐于付出自己的时间。'},
    {w:'grateful', ph:'/ˈɡreɪt.fəl/', zh:'感激的', ex:'I am grateful for your help.', exZh:'我很感激你的帮助。'},
    {w:'independent', ph:'/ˌɪn.dɪˈpen.dənt/', zh:'独立的', ex:'She is an independent young woman.', exZh:'她是一位独立的年轻女性。'},
    {w:'precious', ph:'/ˈpreʃ.əs/', zh:'珍贵的', ex:'Time is precious, so use it well.', exZh:'时间很宝贵，要好好利用。'},
    {w:'confident', ph:'/ˈkɒn.fɪ.dənt/', zh:'自信的', ex:'Be confident when you speak English.', exZh:'说英语时要有自信。'}
  ]},
  { id:'cet4', zh:'大学四级', en:'CET-4', tagZh:'四级核心', tagEn:'CET-4 Core', words:[
    {w:'approximately', ph:'/əˈprɒk.sɪ.mət.li/', zh:'大约；近似地', ex:'The trip takes approximately three hours.', exZh:'这趟旅程大约需要三个小时。'},
    {w:'consequently', ph:'/ˈkɒn.sɪ.kwənt.li/', zh:'因此；结果', ex:'It rained heavily; consequently, the match was cancelled.', exZh:'雨下得很大，因此比赛取消了。'},
    {w:'significant', ph:'/sɪɡˈnɪf.ɪ.kənt/', zh:'重要的；显著的', ex:'This is a significant discovery.', exZh:'这是一个重要的发现。'},
    {w:'phenomenon', ph:'/fɪˈnɒm.ɪ.nən/', zh:'现象', ex:'This is a natural phenomenon.', exZh:'这是一种自然现象。'},
    {w:'contribute', ph:'/kənˈtrɪb.juːt/', zh:'贡献；促成', ex:'Everyone can contribute to the project.', exZh:'每个人都能为这个项目做贡献。'},
    {w:'efficient', ph:'/ɪˈfɪʃ.ənt/', zh:'高效的', ex:'This is an efficient way to save time.', exZh:'这是节省时间的高效方法。'},
    {w:'essential', ph:'/ɪˈsen.ʃəl/', zh:'必不可少的', ex:'Sleep is essential for health.', exZh:'睡眠对健康必不可少。'},
    {w:'eventually', ph:'/ɪˈven.tʃu.ə.li/', zh:'最终；终于', ex:'He eventually passed the exam.', exZh:'他最终通过了考试。'},
    {w:'particularly', ph:'/pərˈtɪk.jə.lər.li/', zh:'特别地；尤其', ex:'I particularly like this song.', exZh:'我特别喜欢这首歌。'},
    {w:'circumstance', ph:'/ˈsɜːr.kəm.stɑːns/', zh:'环境；情况', ex:'Under no circumstance should you give up.', exZh:'在任何情况下你都不应该放弃。'},
    {w:'consequence', ph:'/ˈkɒn.sɪ.kwəns/', zh:'结果；后果', ex:'Every choice has a consequence.', exZh:'每一个选择都有其后果。'},
    {w:'emphasize', ph:'/ˈem.fə.saɪz/', zh:'强调', ex:'The teacher emphasized the importance of reading.', exZh:'老师强调了阅读的重要性。'},
    {w:'participate', ph:'/pɑːrˈtɪs.ɪ.peɪt/', zh:'参加；参与', ex:'All students may participate in the contest.', exZh:'所有学生都可以参加比赛。'},
    {w:'perspective', ph:'/pərˈspek.tɪv/', zh:'观点；视角', ex:'Try to see it from a different perspective.', exZh:'试着从不同的角度看待它。'},
    {w:'potential', ph:'/pəˈten.ʃəl/', zh:'潜在的；潜力', ex:'She has great potential as a writer.', exZh:'她有成为作家的巨大潜力。'},
    {w:'previous', ph:'/ˈpriː.vi.əs/', zh:'以前的；先前的', ex:'His previous job was in Beijing.', exZh:'他以前的工作在北京。'},
    {w:'primarily', ph:'/praɪˈmer.əl.i/', zh:'主要地', ex:'The course is primarily for beginners.', exZh:'这门课主要面向初学者。'},
    {w:'reliable', ph:'/rɪˈlaɪ.ə.bəl/', zh:'可靠的；可信赖的', ex:'He is a reliable friend.', exZh:'他是一个可靠的朋友。'},
    {w:'sufficient', ph:'/səˈfɪʃ.ənt/', zh:'足够的；充足的', ex:'We have sufficient time to finish it.', exZh:'我们有足够的时间完成它。'},
    {w:'tendency', ph:'/ˈten.dən.si/', zh:'趋势；倾向', ex:'There is a tendency to work from home now.', exZh:'如今有居家办公的趋势。'},
    {w:'neglect', ph:'/nɪˈɡlekt/', zh:'忽视；疏忽', ex:'Do not neglect your health.', exZh:'不要忽视你的健康。'},
    {w:'obstacle', ph:'/ˈɒb.stə.kəl/', zh:'障碍', ex:'Fear is the biggest obstacle to success.', exZh:'恐惧是成功最大的障碍。'},
    {w:'obtain', ph:'/əbˈteɪn/', zh:'获得；得到', ex:'You can obtain the book from the library.', exZh:'你可以从图书馆获得这本书。'},
    {w:'temporary', ph:'/ˈtem.pər.ər.i/', zh:'临时的；暂时的', ex:'This is only a temporary problem.', exZh:'这只是一个暂时的问题。'},
    {w:'transfer', ph:'/trænsˈfɜːr/', zh:'转移；转学', ex:'He will transfer to another school.', exZh:'他将转到另一所学校。'},
    {w:'various', ph:'/ˈveə.ri.əs/', zh:'各种各样的', ex:'The shop sells various kinds of fruit.', exZh:'这家商店出售各种水果。'},
    {w:'approach', ph:'/əˈprəʊtʃ/', zh:'方法；接近', ex:'We need a new approach to the problem.', exZh:'我们需要一种解决这个问题的新方法。'},
    {w:'available', ph:'/əˈveɪ.lə.bəl/', zh:'可获得的；有空的', ex:'The room is available this weekend.', exZh:'这个周末这间房有空。'},
    {w:'benefit', ph:'/ˈben.ɪ.fɪt/', zh:'好处；益处', ex:'Exercise is of great benefit to health.', exZh:'锻炼对健康大有益处。'},
    {w:'capacity', ph:'/kəˈpæs.ə.ti/', zh:'容量；能力', ex:'The hall has a capacity of five hundred.', exZh:'这个大厅能容纳五百人。'}
  ]}
];

/* ---------- i18n ---------- */
const STR = {
  zh:{ title:'打字背单词', tagline:'一个字母一个字母敲，敲完就记住',
    intro:'选一个词库，把每个单词亲手敲一遍。敲完会听到发音，看到中文意思和例句；打错的词最后会再来一轮，直到记住为止。',
    orderSeq:'顺序', orderRand:'随机', back:'词库', restart:'重开本轮',
    progress:'进度', accuracy:'正确率', speedUnit:'字母/分钟', time:'用时',
    hint:'提示（看中文意思）', kbdTip:'点击单词卡后开始打字 · 请使用英文输入法',
    next:'下一个', doneTitle:'这一轮完成了', mastered:'已掌握', again:'再来一轮', backToShelf:'换词库',
    more:'更多作品', credit:'我们自己的原创实现，开源（MIT）', creditBy:'作者',
    start:'开始练习', continue:'继续练习', reset:'重置', notStarted:'未开始', levelDone:'已学完',
    phaseMain:'正式练习', phaseReview:'错词复习', words:'个单词' },
  en:{ title:'TypeWords', tagline:'Type every letter — and remember the word',
    intro:'Pick a word list and type every word yourself. When you finish a word you hear it spoken and see its meaning and an example sentence. Words you miss come back in a review round until they stick.',
    orderSeq:'In order', orderRand:'Shuffle', back:'Levels', restart:'Restart round',
    progress:'Progress', accuracy:'Accuracy', speedUnit:'Letters/min', time:'Time',
    hint:'Hint (show meaning)', kbdTip:'Tap the word card, then type · use an English keyboard layout',
    next:'Next', doneTitle:'Round complete', mastered:'Mastered', again:'Another round', backToShelf:'Change level',
    more:'More projects', credit:'Our own original implementation, open source (MIT)', creditBy:'By',
    start:'Start', continue:'Continue', reset:'Reset', notStarted:'Not started', levelDone:'Completed',
    phaseMain:'Practice', phaseReview:'Mistake review', words:'words' }
};
let lang = localStorage.getItem('typewords_lang') || 'zh';
const t = k => STR[lang][k];

/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);
const store = {
  get(k, d){ try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)); }
};
const fmtTime = s => Math.floor(s/60) + ':' + String(s%60).padStart(2,'0');
const sanitize = w => w.toLowerCase().replace(/[^a-z]/g,'');
function shuffle(a){ for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function levelProgress(id){
  const all = store.get('typewords_progress', {});
  if (!all[id]) all[id] = { mastered: [], last: 0 };
  return all[id];
}
function saveLevelProgress(id, lp){
  const all = store.get('typewords_progress', {});
  all[id] = lp; store.set('typewords_progress', all);
}

/* ---------- voice ----------
   Pre-generated neural voice clips (tools/gen-audio.py), one per word.
   A single player; play() rejections (AbortError when a faster action
   takes over) are ignored — only a genuine media error falls back to
   the browser's speech synthesis. */
let voiceOn = store.get('typewords_voice', true);
let hintOn = store.get('typewords_hint', true);
let orderMode = store.get('typewords_order', 'seq');
const player = new Audio();
player.preload = 'auto';
let lastWord = null;
function clipURL(w){ return `audio/${sanitize(w)}.mp3`; }
function fallbackTTS(word){
  if (!window.speechSynthesis) return;
  const ut = new SpeechSynthesisUtterance(word);
  ut.lang = 'en-US'; ut.rate = 0.95;
  speechSynthesis.speak(ut);
}
player.addEventListener('error', () => { if (voiceOn && lastWord) { fallbackTTS(lastWord); lastWord = null; } });
function speakWord(word){
  if (!voiceOn) return;
  lastWord = word;
  player.src = clipURL(word);
  player.currentTime = 0;
  const p = player.play();
  if (p) p.catch(() => {});        // AbortError = superseded; stay silent
}
function preloadAhead(){
  if (!queue.length) return;
  for (let i = pos; i < Math.min(pos + 3, queue.length); i++) {
    const a = new Audio(); a.preload = 'auto'; a.src = clipURL(queue[i].w);
  }
}
function updateVoiceBtn(){ $('voiceBtn').textContent = voiceOn ? '🔊' : '🔇'; }
$('voiceBtn').addEventListener('click', () => {
  voiceOn = !voiceOn; store.set('typewords_voice', voiceOn);
  if (!voiceOn) player.pause();
  updateVoiceBtn();
});

/* ---------- session state ---------- */
let level = null, queue = [], pos = 0, phase = 'main', mistakes = [];
let slotPos = 0, wordErr = false, wordDone = false, finished = false;
let totalOk = 0, totalAll = 0, startT = 0, timer = null, advanceTimer = null;
const curWord = () => queue[pos];

/* ---------- shelf ---------- */
function renderShelf(){
  $('orderSeq').classList.toggle('active', orderMode === 'seq');
  $('orderRand').classList.toggle('active', orderMode === 'rand');
  $('shelfGrid').innerHTML = LEVELS.map(lv => {
    const lp = levelProgress(lv.id);
    const m = lp.mastered.length, total = lv.words.length;
    const pct = Math.round(m / total * 100);
    const state = m >= total ? `<span class="done-tag">${t('levelDone')}</span>`
      : m > 0 ? `${pct}%` : t('notStarted');
    const btnLabel = m > 0 && m < total ? t('continue') : t('start');
    const name = lang === 'zh' ? lv.zh : lv.en;
    const sub = (lang === 'zh' ? lv.en : lv.zh) + ' · ' + (lang === 'zh' ? lv.tagZh : lv.tagEn);
    return `<div class="level-card">
      <h3>${name}</h3>
      <p class="sub">${sub}</p>
      <div class="meta-row"><span class="level-tag">${total} ${t('words')}</span><span>${m}/${total} ${t('mastered')}</span><span>${state}</span></div>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="card-actions">
        <button class="primary-btn" type="button" data-start="${lv.id}">${btnLabel}</button>
        <button class="reset-btn" type="button" data-reset="${lv.id}">${t('reset')}</button>
      </div>
    </div>`;
  }).join('');
  document.querySelectorAll('[data-start]').forEach(b =>
    b.addEventListener('click', () => startLevel(LEVELS.find(x => x.id === b.dataset.start))));
  document.querySelectorAll('[data-reset]').forEach(b =>
    b.addEventListener('click', () => {
      saveLevelProgress(b.dataset.reset, { mastered: [], last: 0 });
      renderShelf();
    }));
}
$('orderSeq').addEventListener('click', () => { orderMode = 'seq'; store.set('typewords_order', 'seq'); renderShelf(); });
$('orderRand').addEventListener('click', () => { orderMode = 'rand'; store.set('typewords_order', 'rand'); renderShelf(); });

/* ---------- practice ---------- */
function startLevel(lv){
  clearInterval(timer); clearTimeout(advanceTimer);
  level = lv; phase = 'main'; mistakes = [];
  queue = lv.words.slice();
  if (orderMode === 'rand') shuffle(queue);
  pos = 0; slotPos = 0; wordErr = false; wordDone = false; finished = false;
  totalOk = 0; totalAll = 0; startT = 0;
  $('shelf').hidden = true; $('practice').hidden = false; $('doneOverlay').hidden = true;
  $('hintToggle').checked = hintOn;
  newWord();
  $('wordCard').classList.add('fresh');
  $('wordCard').focus();
}
function newWord(){
  slotPos = 0; wordErr = false; wordDone = false;
  renderWord(); preloadAhead();
  $('wordCard').focus({ preventScroll: true });
}
function renderWord(){
  const wd = curWord(); if (!wd) return;
  $('pTitle').textContent = lang === 'zh' ? level.zh : level.en;
  $('pPhase').textContent = phase === 'main' ? t('phaseMain') : t('phaseReview');
  $('slots').innerHTML = wd.w.split('').map((ch, i) => {
    const cls = ['slot'];
    if (wordDone || i < slotPos) cls.push('done');
    else if (i === slotPos) cls.push('current');
    const shown = (wordDone || i < slotPos) ? ch : '';
    return `<span class="${cls.join(' ')}">${shown}</span>`;
  }).join('');
  $('phonetic').textContent = wd.ph;
  const showMeaning = hintOn || wordDone;
  $('meaning').hidden = !showMeaning;
  $('meaning').textContent = wd.zh;
  $('reveal').hidden = !wordDone;
  if (wordDone) {
    $('revealMeaning').textContent = `${wd.w} — ${wd.zh}`;
    $('revealEx').textContent = wd.ex;
    $('revealExZh').textContent = wd.exZh;
  }
  renderStats();
}
function renderStats(){
  const total = queue.length || 1;
  const done = pos + (wordDone ? 1 : 0);
  $('stProgress').textContent = done + '/' + total;
  $('progressBar').style.width = Math.round(done / total * 100) + '%';
  $('stAcc').textContent = totalAll ? Math.round(totalOk / totalAll * 100) + '%' : '100%';
  const elapsed = startT ? Math.floor((Date.now() - startT) / 1000) : 0;
  $('stTime').textContent = fmtTime(elapsed);
  $('stSpeed').textContent = elapsed > 2 ? Math.round(totalOk / (elapsed / 60)) : 0;
}
function markMastered(wd){
  const lp = levelProgress(level.id);
  if (!lp.mastered.includes(wd.w)) lp.mastered.push(wd.w);
  if (phase === 'main') lp.last = pos + 1;
  saveLevelProgress(level.id, lp);
}
function completeWord(){
  const wd = curWord();
  wordDone = true;
  speakWord(wd.w);
  if (phase === 'main' && wordErr) mistakes.push(wd);
  else markMastered(wd);
  renderWord();
  advanceTimer = setTimeout(nextWord, 1600);
}
function nextWord(){
  clearTimeout(advanceTimer);
  pos++;
  if (pos >= queue.length) {
    if (phase === 'main' && mistakes.length) {
      phase = 'review'; queue = mistakes.slice(); pos = 0; newWord(); return;
    }
    finishSession(); return;
  }
  newWord();
}
function finishSession(){
  finished = true; clearInterval(timer);
  const elapsed = Math.max(1, Math.floor((Date.now() - startT) / 1000));
  const acc = totalAll ? Math.round(totalOk / totalAll * 100) : 100;
  $('dTime').textContent = fmtTime(elapsed);
  $('dAcc').textContent = acc + '%';
  $('dSpeed').textContent = Math.round(totalOk / (elapsed / 60));
  $('dMastered').textContent = levelProgress(level.id).mastered.length + '/' + level.words.length;
  $('doneLevelName').textContent = (lang === 'zh' ? level.zh : level.en) + ' · ' + level.words.length + ' ' + t('words');
  $('doneNote').textContent = mistakes.length
    ? (lang === 'zh' ? `本轮有 ${mistakes.length} 个词打错过，已经带你复习了一遍。` : `${mistakes.length} word(s) were missed this round and have been reviewed.`)
    : (lang === 'zh' ? '全部一次打对，太棒了。' : 'No mistakes at all — well done.');
  renderStats();
  $('doneOverlay').hidden = false;
}
function handleLetter(ch){
  if (!level || finished || wordDone || $('practice').hidden) return;
  const wd = curWord(); if (!wd) return;
  if (!startT) { startT = Date.now(); timer = setInterval(renderStats, 500); $('wordCard').classList.remove('fresh'); }
  totalAll++;
  if (ch === wd.w[slotPos]) {
    totalOk++; slotPos++;
    if (slotPos >= wd.w.length) { completeWord(); return; }
    renderWord();
  } else {
    wordErr = true;
    const slots = $('slots').children;
    if (slots[slotPos]) { slots[slotPos].classList.remove('err'); void slots[slotPos].offsetWidth; slots[slotPos].classList.add('err'); }
  }
  renderStats();
}
let lastKeyAt = 0;
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = e.target.tagName;
  if (tag === 'SELECT' || tag === 'BUTTON' || tag === 'INPUT') return;
  if (/^[a-zA-Z]$/.test(e.key)) { lastKeyAt = Date.now(); handleLetter(e.key.toLowerCase()); }
});
$('mobileInput').addEventListener('input', e => {
  if (Date.now() - lastKeyAt < 80) { e.target.value = ''; return; }
  const v = e.target.value; e.target.value = '';
  if (v) handleLetter(v.slice(-1).toLowerCase());
});
$('wordCard').addEventListener('click', e => {
  if (e.target.closest('button') || e.target.closest('label')) return;
  $('wordCard').focus(); $('mobileInput').focus({ preventScroll: true });
});
$('hintToggle').addEventListener('change', e => {
  hintOn = e.target.checked; store.set('typewords_hint', hintOn);
  if (level && !$('practice').hidden) renderWord();
});
$('nextBtn').addEventListener('click', () => { clearTimeout(advanceTimer); nextWord(); });
$('backBtn').addEventListener('click', () => {
  clearInterval(timer); clearTimeout(advanceTimer); player.pause();
  $('practice').hidden = true; $('shelf').hidden = false; renderShelf();
});
$('restartBtn').addEventListener('click', () => { if (level) startLevel(level); });
$('againBtn').addEventListener('click', () => { if (level) startLevel(level); });
$('shelfBtn').addEventListener('click', () => {
  $('doneOverlay').hidden = true; $('practice').hidden = true; $('shelf').hidden = false; renderShelf();
});

/* ---------- language ---------- */
function applyLang(){
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $('langBtn').textContent = lang === 'zh' ? 'EN' : '中文';
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  updateVoiceBtn();
  renderShelf();
  if (level && !$('practice').hidden && !finished) renderWord();
}
$('langBtn').addEventListener('click', () => {
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('typewords_lang', lang);
  applyLang();
});
applyLang();
