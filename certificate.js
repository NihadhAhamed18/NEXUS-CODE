const $ = id => document.getElementById(id);
const type = $("certificateType"), nameInput = $("studentName"), courseInput = $("courseName"), dateInput = $("completionDate"), idInput = $("certificateId");
function makeId(){const y=new Date().getFullYear();const part=()=>Math.random().toString(36).slice(2,6).toUpperCase();return `NXA-${y}-${part()}${part()}`;}
function localDate(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
dateInput.value=localDate(); idInput.value=makeId();
const incoming = new URLSearchParams(location.search);
if (incoming.get("type") === "academy" || incoming.get("type") === "course") type.value = incoming.get("type");
if (incoming.has("name")) nameInput.value = incoming.get("name").slice(0,70);
if (incoming.has("course")) courseInput.value = incoming.get("course").slice(0,90);
function update(){
  const isAcademy=type.value==="academy";
  $("courseField").style.display=isAcademy?"none":"block";
  $("certSubtitle").textContent=isAcademy?"ACADEMY ACHIEVEMENT":"COMPLETION";
  $("completionCopy").textContent=isAcademy?"for successfully completing the NEXUS ACADEMY learning programme":"for successfully completing the learning path";
  $("previewName").textContent=(nameInput.value.trim()||"STUDENT NAME").toUpperCase();
  $("previewCourse").textContent=isAcademy?"NEXUS ACADEMY · FULL LEARNING JOURNEY":(courseInput.value.trim()||"COURSE TITLE").toUpperCase();
  $("supportCopy").textContent=isAcademy?"for completing the academy learning milestones and demonstrating commitment to continuous learning.":"through NEXUS ACADEMY, demonstrating dedication, knowledge and practical skills.";
  const d=dateInput.value?new Date(dateInput.value+"T12:00:00"):new Date();
  $("previewDate").textContent=d.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  $("previewId").textContent=idInput.value;
  const qr=$("qrCode");qr.innerHTML="";
  const params=new URLSearchParams({id:idInput.value,name:nameInput.value.trim()||"Student",type:type.value,course:isAcademy?"NEXUS ACADEMY":courseInput.value.trim()||"Course",date:dateInput.value});
  const verifyUrl=new URL("verify.html?"+params.toString(),location.href).href;
  if(window.QRCode){new QRCode(qr,{text:verifyUrl,width:100,height:100,colorDark:"#07132c",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M});}
  else{qr.textContent="QR unavailable";}
}
["input","change"].forEach(evt=>{[type,nameInput,courseInput,dateInput].forEach(el=>el.addEventListener(evt,update));});
$("newId").addEventListener("click",()=>{idInput.value=makeId();update();});
$("certificateForm").addEventListener("submit",e=>{e.preventDefault();if(!nameInput.value.trim()){nameInput.focus();return;}if(type.value==="course"&&!courseInput.value.trim()){courseInput.focus();return;}update();});
$("downloadBtn").addEventListener("click",()=>{if(!nameInput.value.trim()){alert("Please enter the student's full name first.");nameInput.focus();return;}if(type.value==="course"&&!courseInput.value.trim()){alert("Please enter the course name first.");courseInput.focus();return;}update();window.print();});
update();