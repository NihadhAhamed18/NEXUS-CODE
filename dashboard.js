(() => {
"use strict";
const KEY = "nexusPracticeProgressV1";
const COURSE_KEY = "nexusAcademyStage4Progress";
const $ = id => document.getElementById(id);
const EMPTY = {solved:[],attempts:0,correct:0,perfect:0,activity:{},bestStreak:0};
const CHALLENGE_XP = {even:10,largest:15,vowels:20,palindrome:30,factorial:35,duplicates:40};
const COURSES = [
  ["python","Python"],["c","C"],["cpp","C++"],["java","Java"],["javascript","JavaScript"],
  ["csharp","C#"],["php","PHP"],["ruby","Ruby"],["go","Go"],["rust","Rust"]
];
const LESSONS_PER_COURSE = 11;
const TOTAL_CHALLENGES = 6, TOTAL_LESSONS = COURSES.length * LESSONS_PER_COURSE;
let data, courseRows = [], user = null, db = null, cloudDates = {};

function readJSON(key, fallback) {
  try { return {...fallback, ...JSON.parse(localStorage.getItem(key) || "{}")}; }
  catch { return {...fallback}; }
}
data = readJSON(KEY, EMPTY);
data.solved = Array.isArray(data.solved) ? data.solved : [];
data.activity = data.activity && typeof data.activity === "object" ? data.activity : {};
let localCourse = readJSON(COURSE_KEY, {});
function todayKey(d=new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function localLessonRows() {
  return Object.entries(localCourse).filter(([k,v]) => v && v.completed).map(([key,v]) => {
    const split = key.lastIndexOf("_");
    return {language_id:key.slice(0,split), lesson_index:Number(key.slice(split+1)), completed:true,
      quiz_score:v.quiz_score || 100, xp:v.xp || 20, updated_at:v.updated_at || null};
  });
}
function uniqueLessons(rows) {
  const map = new Map();
  for (const row of rows || []) if (row.completed) map.set(`${row.language_id}_${row.lesson_index}`, row);
  return [...map.values()];
}
function challengeXP() {
  return data.solved.reduce((sum,id)=>sum+(CHALLENGE_XP[id]||0),0) + (Number(data.perfect)||0)*10;
}
function completedChallengeCount(){return new Set(data.solved).size;}
function mergedActivity() {
  const result = {...data.activity};
  for (const [day,count] of Object.entries(cloudDates)) result[day] = (result[day]||0) + count;
  // Course completion dates from local-only progress are included as well.
  for (const row of localLessonRows()) {
    if (row.updated_at) {
      const day = new Date(row.updated_at).toLocaleDateString("en-CA");
      result[day] = (result[day]||0) + 1;
    }
  }
  return result;
}
function streakInfo(activity) {
  const dates = Object.keys(activity).filter(k=>activity[k]>0).sort();
  if (!dates.length) return {current:0,best:Number(data.bestStreak)||0};
  let best=1,run=1;
  for(let i=1;i<dates.length;i++){
    const prev=new Date(dates[i-1]+"T12:00:00"),cur=new Date(dates[i]+"T12:00:00");
    if(Math.round((cur-prev)/86400000)===1){run++;best=Math.max(best,run);} else run=1;
  }
  let current=0,cursor=new Date();cursor.setHours(12,0,0,0);
  let key=todayKey(cursor);
  if(!activity[key]){cursor.setDate(cursor.getDate()-1);key=todayKey(cursor);}
  while(activity[key]){current++;cursor.setDate(cursor.getDate()-1);key=todayKey(cursor);}
  return {current,best:Math.max(best,Number(data.bestStreak)||0)};
}
function renderCalendar(activity) {
  const box=$("activityCalendar"); if(!box)return; box.innerHTML="";
  const today=new Date();today.setHours(12,0,0,0);
  for(let i=34;i>=0;i--){
    const d=new Date(today);d.setDate(today.getDate()-i);
    const key=todayKey(d),count=activity[key]||0,cell=document.createElement("div");
    cell.className="day-cell "+(count>=4?"l3":count>=2?"l2":count>=1?"l1":"l0")+(i===0?" today":"");
    cell.title=`${key}: ${count} learning activities`;box.appendChild(cell);
  }
}
function renderCourses(rows) {
  const completed=uniqueLessons(rows), total=TOTAL_LESSONS, pct=Math.round(completed.length/total*100);
  $("courseLessonCount").textContent=`${completed.length} / ${total}`;
  $("courseProgressPercent").textContent=pct+"%";
  $("courseProgressFill").style.width=pct+"%";
  const grid=$("courseLanguageGrid");
  grid.innerHTML=COURSES.map(([id,name])=>{
    const count=completed.filter(r=>r.language_id===id).length,percent=Math.round(count/LESSONS_PER_COURSE*100);
    return `<div class="course-language"><b>${name}</b><small>${count} of ${LESSONS_PER_COURSE} lessons · ${percent}%</small><div class="mini-track"><span style="width:${percent}%"></span></div></div>`;
  }).join("");
}
const badges = [
  {icon:"🚀",name:"First Steps",desc:"Complete your first learning task",test:(c,l)=>c>=1||l>=1},
  {icon:"🧠",name:"Quiz Starter",desc:"Answer 5 Practice Lab questions",test:()=>data.attempts>=5},
  {icon:"🎯",name:"Perfect Run",desc:"Complete a perfect quiz",test:()=>data.perfect>=1},
  {icon:"🛠️",name:"Problem Solver",desc:"Solve 3 coding challenges",test:c=>c>=3},
  {icon:"🔥",name:"Consistency",desc:"Build a 3-day learning streak",test:(c,l,s)=>s.best>=3},
  {icon:"👑",name:"Challenge Master",desc:"Solve all 6 Practice Lab challenges",test:c=>c>=6},
  {icon:"📚",name:"Course Explorer",desc:"Complete 10 course lessons",test:(c,l)=>l>=10},
  {icon:"🏆",name:"Course Finisher",desc:"Complete all 110 guided lessons",test:(c,l)=>l>=30}
];
function render() {
  const lessons=uniqueLessons([...courseRows,...localLessonRows()]);
  const lessonXP=lessons.reduce((sum,r)=>sum+(Number(r.xp)||20),0);
  const earned=challengeXP()+lessonXP;
  const courseQuizAttempts=lessons.length;
  const courseCorrect=lessons.reduce((sum,r)=>sum+(Number(r.quiz_score)||100),0)/100;
  const attempts=(Number(data.attempts)||0)+courseQuizAttempts;
  const correct=(Number(data.correct)||0)+courseCorrect;
  const accuracy=attempts?Math.round(correct/attempts*100):0;
  const activity=mergedActivity(), streak=streakInfo(activity);
  const solved=completedChallengeCount();
  $("solvedCount").textContent=solved;
  $("accuracy").textContent=accuracy+"%";
  $("quizAttempts").textContent=`${attempts} quiz answers recorded`;
  $("currentStreak").textContent=streak.current;
  $("bestStreak").textContent="Best: "+streak.best+" days";
  $("xpTotal").textContent=earned;
  const done=solved+lessons.length, total=TOTAL_CHALLENGES+TOTAL_LESSONS, pct=Math.round(done/total*100);
  $("progressPercent").textContent=pct+"%";
  $("progressRing").style.background=`conic-gradient(var(--cyan) ${pct*3.6}deg,#26334d 0deg)`;
  $("progressFill").style.width=pct+"%";
  $("completedText").textContent=`${done} of ${total} learning tasks completed`;
  $("remainingText").textContent=(total-done)+" remaining";
  $("progressTitle").textContent=pct===100?"Outstanding! You completed every starter task.":pct>=50?"You're making excellent progress.":"A great journey begins with one step.";
  $("progressDescription").textContent=`${lessons.length} course lessons and ${solved} coding challenges completed. Keep learning across all ten languages.`;
  const rank=earned>=500?"Code Legend":earned>=250?"Rising Developer":earned>=100?"Code Explorer":"Rookie Coder";
  $("rankLabel").textContent=rank;$("rankSub").textContent=earned+" XP earned";
  $("streakMessage").textContent=streak.current?`🔥 You're on a ${streak.current}-day learning streak. Keep it alive!`:"Complete a lesson, quiz or challenge to begin your streak.";
  renderCalendar(activity);
  let count=0;$("badgeGrid").innerHTML="";
  badges.forEach(b=>{
    const unlocked=!!b.test(solved,lessons.length,streak);if(unlocked)count++;
    const card=document.createElement("div");card.className="badge-card "+(unlocked?"unlocked":"");
    card.innerHTML=`<div class="medal">${b.icon}</div><b>${b.name}</b><small>${unlocked?"Achievement unlocked":b.desc}</small>`;
    $("badgeGrid").appendChild(card);
  });
  $("badgeCount").textContent=`${count} / ${badges.length} unlocked`;
  $("certificateNote").textContent="Eligibility is based on completed lessons and challenges shown above. Enter your full name to generate an unlocked certificate.";
  renderCourses(lessons);
  renderCertificateHub(lessons);
}
function setCloud(title,message,state,kind="") {
  $("cloudTitle").textContent=title;$("cloudMessage").textContent=message;
  const badge=$("cloudState");badge.textContent=state;badge.className="cloud-state "+kind;
}
async function initCloud() {
  const configured=window.NEXUS_SUPABASE_URL && window.NEXUS_SUPABASE_ANON_KEY &&
    !String(window.NEXUS_SUPABASE_URL).includes("YOUR_") && !String(window.NEXUS_SUPABASE_ANON_KEY).includes("YOUR_");
  if(!configured || !window.supabase?.createClient) {
    setCloud("Cloud sync is not configured","Local Practice Lab progress is shown. Add your existing Supabase settings to supabase-config.js to load cloud course progress.","LOCAL ONLY","offline");
    return;
  }
  try {
    db=window.supabase.createClient(window.NEXUS_SUPABASE_URL,window.NEXUS_SUPABASE_ANON_KEY);
    const {data:sessionData,error:sessionError}=await db.auth.getSession();
    if(sessionError) throw sessionError;
    user=sessionData.session?.user||null;
    if(!user) {
      // Guest dashboard is intentionally blank after sign-out.
      data = {...EMPTY, solved:[], activity:{}};
      localCourse = {};
      courseRows = [];
      cloudDates = {};
      setCloud("Sign in to see your learning progress","Your dashboard is reset while signed out. Your account progress remains saved securely for your next login.","NOT SIGNED IN","offline");
      return;
    }
    setCloud("Student account connected",`Signed in as ${user.email}. Loading your completed lessons from Supabase…`,"SYNCING");
    const {data,error}=await db.from("nexus_lesson_progress")
      .select("language_id,lesson_index,completed,quiz_score,xp,updated_at")
      .eq("user_id",user.id);
    if(error) throw error;
    courseRows=data||[];
    cloudDates = {};
    for(const row of courseRows) {
      if(row.updated_at) {
        const day=new Date(row.updated_at).toLocaleDateString("en-CA");
        cloudDates[day]=(cloudDates[day]||0)+1;
      }
    }
    setCloud("Cloud sync connected",`Signed in as ${user.email}. Course lessons, quiz results and XP are included in this dashboard.`,"CONNECTED");
    render();
    db.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null;
      if (nextUser?.id === user?.id) return;
      user = nextUser;
      data = {...EMPTY, solved:[], activity:{}};
      localCourse = {};
      courseRows = [];
      cloudDates = {};
      if (!user) {
        setCloud("Sign in to see your learning progress","Your dashboard is reset while signed out. Your account progress remains saved securely for your next login.","NOT SIGNED IN","offline");
        render();
        return;
      }
      setCloud("Student account connected",`Signed in as ${user.email}. Loading your completed lessons from Supabase…`,"SYNCING");
      db.from("nexus_lesson_progress")
        .select("language_id,lesson_index,completed,quiz_score,xp,updated_at")
        .eq("user_id",user.id)
        .then(({data:rows,error:loadError}) => {
          if (user?.id !== nextUser.id) return;
          if (loadError) {
            setCloud("Could not load cloud progress",loadError.message||"Check your Supabase table permissions.","SYNC ERROR","error");
            render();
            return;
          }
          courseRows = rows || [];
          cloudDates = {};
          for (const row of courseRows) if (row.updated_at) {
            const day = new Date(row.updated_at).toLocaleDateString("en-CA");
            cloudDates[day] = (cloudDates[day] || 0) + 1;
          }
          setCloud("Cloud sync connected",`Signed in as ${user.email}. Course lessons, quiz results and XP are included in this dashboard.`,"CONNECTED");
          render();
        });
    });
  } catch(err) {
    setCloud("Could not load cloud progress",err?.message||"Check your Supabase settings and table permissions.","SYNC ERROR","error");
  }
}
function openCertificate(type, name, courseName="") {
  const params = new URLSearchParams({type, name});
  if (courseName) params.set("course", courseName);
  window.location.href = "certificate.html?" + params.toString();
}
function renderCertificateHub(lessons) {
  const nameInput = $("studentName");
  const courseList = $("courseCertificateList");
  const academyStatus = $("academyCertificateStatus");
  const academyButton = $("academyCertificateBtn");
  if (!courseList || !academyStatus || !academyButton) return;

  courseList.innerHTML = COURSES.map(([id, name]) => {
    const count = lessons.filter(row => row.language_id === id).length;
    const eligible = count >= LESSONS_PER_COURSE;
    const courseTitle = name + " Foundations";
    return `<div class="nexus-cert-course-row">
      <div><b>${name}</b><small>${count}/${LESSONS_PER_COURSE} lessons completed · ${eligible ? "Certificate unlocked" : `Complete all ${LESSONS_PER_COURSE} lessons`}</small></div>
      <button type="button" data-course="${id}" ${eligible ? "" : "disabled"}>${eligible ? "Get certificate ↗" : "Locked"}</button>
    </div>`;
  }).join("");

  courseList.querySelectorAll("button[data-course]").forEach(button => {
    button.addEventListener("click", () => {
      const name = nameInput.value.trim();
      if (!name) { nameInput.focus(); $("certificateNote").textContent = "Enter your full name before generating a certificate."; return; }
      const course = COURSES.find(item => item[0] === button.dataset.course);
      if (!course) return;
      openCertificate("course", name, course[1] + " Foundations");
    });
  });

  const allLessonsDone = lessons.length >= TOTAL_LESSONS;
  const allChallengesDone = completedChallengeCount() >= TOTAL_CHALLENGES;
  const academyEligible = allLessonsDone && allChallengesDone;
  academyStatus.className = "nexus-cert-status " + (academyEligible ? "unlocked" : "locked");
  academyStatus.textContent = academyEligible
    ? "✦ Academy milestone unlocked — all 110 lessons and all 6 coding challenges are complete."
    : `Locked · ${lessons.length}/${TOTAL_LESSONS} lessons and ${completedChallengeCount()}/6 challenges completed.`;
  academyButton.disabled = !academyEligible;
  academyButton.onclick = () => {
    const name = nameInput.value.trim();
    if (!name) { nameInput.focus(); $("certificateNote").textContent = "Enter your full name before generating a certificate."; return; }
    if (academyEligible) openCertificate("academy", name);
  };
}
$("themeToggle").addEventListener("click",()=>{
  document.body.classList.toggle("light");
  localStorage.setItem("nexusPracticeTheme",document.body.classList.contains("light")?"light":"dark");
});
if(localStorage.getItem("nexusPracticeTheme")==="light")document.body.classList.add("light");
(async function start(){
  await initCloud();
  render();
})();

})();
