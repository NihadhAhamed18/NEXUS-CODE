const KEY="nexusPracticeProgressV1";
const $=id=>document.getElementById(id);
const EMPTY={solved:[],attempts:0,correct:0,perfect:0,activity:{},lastActive:"",streak:0,bestStreak:0};
let data;
try{data={...EMPTY,...JSON.parse(localStorage.getItem(KEY)||"{}")};data.activity=data.activity||{};data.solved=data.solved||[]}catch(e){data={...EMPTY}}
const challengeXP={even:10,largest:15,vowels:20,palindrome:30,factorial:35,duplicates:40};
const totalChallenges=6;
function todayKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function recordActivity(){
 const today=todayKey();
 if(!data.activity[today])data.activity[today]=0;
 // dashboard visits do not create activity; only show activity recorded by practice actions.
}
function xp(){return data.solved.reduce((sum,id)=>sum+(challengeXP[id]||0),0)+data.perfect*10}
function streak(){
 const dates=Object.keys(data.activity).filter(k=>data.activity[k]>0).sort();
 if(!dates.length)return {current:0,best:data.bestStreak||0};
 let best=1,run=1;
 for(let i=1;i<dates.length;i++){let prev=new Date(dates[i-1]+"T12:00:00"),cur=new Date(dates[i]+"T12:00:00");let diff=Math.round((cur-prev)/86400000);if(diff===1){run++;best=Math.max(best,run)}else run=1}
 let current=0, cursor=new Date();cursor.setHours(12,0,0,0);
 let key=todayKey(cursor);
 if(!data.activity[key]){cursor.setDate(cursor.getDate()-1);key=todayKey(cursor)}
 while(data.activity[key]){current++;cursor.setDate(cursor.getDate()-1);key=todayKey(cursor)}
 data.bestStreak=Math.max(data.bestStreak||0,best);
 return {current,best:data.bestStreak};
}
function drawCalendar(){
 const box=$("activityCalendar");box.innerHTML="";
 const today=new Date();today.setHours(12,0,0,0);
 for(let i=34;i>=0;i--){let d=new Date(today);d.setDate(today.getDate()-i);let key=todayKey(d),count=data.activity[key]||0,cell=document.createElement("div");cell.className="day-cell "+(count>=4?"l3":count>=2?"l2":count>=1?"l1":"l0")+(i===0?" today":"");cell.title=`${key}: ${count} learning activities`;box.appendChild(cell)}
}
const badges=[
{id:"first",icon:"🚀",name:"First Steps",desc:"Solve your first challenge",test:()=>data.solved.length>=1},
{id:"quiz",icon:"🧠",name:"Quiz Starter",desc:"Answer 5 quiz questions",test:()=>data.attempts>=5},
{id:"perfect",icon:"🎯",name:"Perfect Run",desc:"Complete a perfect quiz",test:()=>data.perfect>=1},
{id:"builder",icon:"🛠️",name:"Problem Solver",desc:"Solve 3 challenges",test:()=>data.solved.length>=3},
{id:"streak",icon:"🔥",name:"Consistency",desc:"Build a 3-day streak",test:()=>streak().best>=3},
{id:"master",icon:"👑",name:"Challenge Master",desc:"Solve all 6 challenges",test:()=>data.solved.length>=6}
];
function render(){
 const s=streak(),accuracy=data.attempts?Math.round(data.correct/data.attempts*100):0,earned=xp();
 $("solvedCount").textContent=data.solved.length;$("accuracy").textContent=accuracy+"%";$("quizAttempts").textContent=data.attempts+" answers submitted";$("currentStreak").textContent=s.current;$("bestStreak").textContent="Best: "+s.best+" days";$("xpTotal").textContent=earned;
 const pct=Math.round(data.solved.length/totalChallenges*100);$("progressPercent").textContent=pct+"%";$("progressRing").style.background=`conic-gradient(var(--cyan) ${pct*3.6}deg,#26334d 0deg)`;$("progressFill").style.width=pct+"%";$("completedText").textContent=`${data.solved.length} of ${totalChallenges} challenges completed`;$("remainingText").textContent=(totalChallenges-data.solved.length)+" remaining";
 $("progressTitle").textContent=pct===100?"Outstanding! You completed every challenge.":pct>=50?"You're making excellent progress.":"A great journey begins with one step.";$("progressDescription").textContent=pct===100?"Keep learning and explore more advanced programming topics.":"Complete lessons and solve challenges to build your learning record.";
 const rank=earned>=100?"Code Legend":earned>=60?"Rising Developer":earned>=30?"Code Explorer":"Rookie Coder";$("rankLabel").textContent=rank;$("rankSub").textContent=earned+" XP earned";
 $("streakMessage").textContent=s.current?`🔥 You're on a ${s.current}-day learning streak. Keep it alive!`:"Start a quiz or solve a challenge to begin your streak.";
 drawCalendar();
 let count=0;$("badgeGrid").innerHTML="";badges.forEach(b=>{let unlocked=b.test();if(unlocked)count++;let card=document.createElement("div");card.className="badge-card "+(unlocked?"unlocked":"");card.innerHTML=`<div class="medal">${b.icon}</div><b>${b.name}</b><small>${unlocked?"Achievement unlocked":b.desc}</small>`;$("badgeGrid").appendChild(card)});$("badgeCount").textContent=`${count} / ${badges.length} unlocked`;
 const allowed=data.solved.length>=3;$("certificateBtn").disabled=!allowed;$("certificateNote").textContent=allowed?"Milestone unlocked! Enter your name to generate your certificate.":"Complete at least 3 coding challenges to unlock your certificate.";
}
function certificate(name){
 const w=window.open("","_blank");if(!w){$("certificateNote").textContent="Please allow pop-ups to generate your certificate.";return}
 const safe=name.replace(/[<>&"']/g,"");const date=new Date().toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"});
 w.document.write(`<!doctype html><html><head><title>NEXUS ACADEMY Certificate</title><style>*{box-sizing:border-box}body{margin:0;padding:35px;background:#eef3fb;font-family:Georgia,serif;color:#182747}.sheet{max-width:1000px;min-height:680px;margin:auto;padding:60px;border:12px double #527ca8;background:#fff;text-align:center;position:relative}.brand{font: bold 15px Arial;letter-spacing:5px;color:#187eaa}.mark{font:60px Arial;color:#2789b8;margin:35px 0 5px}.kicker{font:12px Arial;letter-spacing:5px;color:#71819b}.title{font-size:48px;margin:14px 0;color:#17345a}.copy{font:18px Arial;color:#53627a;margin:20px}.name{font-size:38px;color:#137eaa;border-bottom:1px solid #9aabc0;display:inline-block;padding:8px 50px;margin:20px}.detail{font:15px Arial;color:#596b84;line-height:1.8}.footer{display:flex;justify-content:space-between;margin-top:55px;font:12px Arial;color:#53627a}.seal{position:absolute;right:55px;bottom:65px;border:3px solid #4a9ac0;border-radius:50%;width:90px;height:90px;display:grid;place-items:center;color:#2789b8;font:30px Arial}@media print{body{padding:0;background:white}.sheet{min-height:95vh}}</style></head><body><div class="sheet"><div class="brand">NEXUS ACADEMY</div><div class="mark">✦</div><div class="kicker">CERTIFICATE OF ACHIEVEMENT</div><div class="title">Learning Milestone</div><div class="copy">This certificate is proudly presented to</div><div class="name">${safe}</div><div class="detail">for successfully completing at least three coding challenges<br>in the NEXUS ACADEMY Practice Lab.<br><br>Keep learning. Keep building. Keep innovating.</div><div class="footer"><span>Issued: ${date}</span><span>Learning achievement · NEXUS ACADEMY</span></div><div class="seal">✦</div></div><script>window.onload=()=>setTimeout(()=>window.print(),350)<\/script></body></html>`);
 w.document.close();
}
$("certificateBtn").addEventListener("click",()=>{let name=$("studentName").value.trim();if(!name){$("certificateNote").textContent="Please enter your name first.";return}if(data.solved.length<3)return;certificate(name)});
$("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.setItem("nexusPracticeTheme",document.body.classList.contains("light")?"light":"dark")});
if(localStorage.getItem("nexusPracticeTheme")==="light")document.body.classList.add("light");
recordActivity();render();