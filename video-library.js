(() => {
 const resources = [
  {id:"python",name:"Python",level:"Beginner → Advanced",provider:"freeCodeCamp.org + Corey Schafer",title:"Python full course and in-depth tutorial series",topics:"Syntax, functions, OOP, modules, files, projects",q:"freeCodeCamp Python full course for beginners Corey Schafer Python tutorials"},
  {id:"c",name:"C Programming",level:"Beginner → Intermediate",provider:"freeCodeCamp.org + CS50",title:"C programming full course and computer science lectures",topics:"Pointers, arrays, memory, functions, data structures",q:"freeCodeCamp C programming tutorial full course pointers memory CS50"},
  {id:"cpp",name:"C++",level:"Beginner → Advanced",provider:"freeCodeCamp.org + The Cherno",title:"C++ beginner-to-advanced full course",topics:"OOP, STL, pointers, memory, templates, modern C++",q:"freeCodeCamp C++ tutorial beginner to advanced The Cherno C++ playlist"},
  {id:"java",name:"Java",level:"Beginner → Advanced",provider:"Bro Code + freeCodeCamp.org",title:"Java full course and practical programming tutorials",topics:"Classes, OOP, collections, exceptions, projects",q:"Bro Code Java full course beginners freeCodeCamp Java advanced tutorials"},
  {id:"javascript",name:"JavaScript",level:"Beginner → Advanced",provider:"freeCodeCamp.org + Web Dev Simplified",title:"JavaScript full course and modern language concepts",topics:"DOM, functions, async, promises, APIs, projects",q:"freeCodeCamp JavaScript full course Web Dev Simplified JavaScript concepts"},
  {id:"csharp",name:"C#",level:"Beginner → Advanced",provider:"freeCodeCamp.org + IAmTimCorey",title:"C# full course and advanced .NET tutorials",topics:"Types, OOP, LINQ, async, .NET application development",q:"freeCodeCamp C sharp full course IAmTimCorey C# advanced tutorials"},
  {id:"php",name:"PHP",level:"Beginner → Intermediate",provider:"freeCodeCamp.org + Traversy Media",title:"PHP full course and practical backend tutorials",topics:"Syntax, arrays, OOP, forms, databases, CRUD",q:"freeCodeCamp PHP programming language full course Traversy Media PHP"},
  {id:"ruby",name:"Ruby",level:"Beginner → Intermediate",provider:"freeCodeCamp.org + Ruby community tutorials",title:"Ruby programming full course",topics:"Syntax, collections, blocks, classes, modules, Rails foundations",q:"Ruby programming full course for beginners freeCodeCamp Ruby tutorial"},
  {id:"go",name:"Go",level:"Beginner → Advanced",provider:"freeCodeCamp.org + Go team",title:"Go programming full course and official talks",topics:"Goroutines, channels, interfaces, errors, web services",q:"Go programming full course freeCodeCamp Go official tutorials goroutines"},
  {id:"rust",name:"Rust",level:"Beginner → Advanced",provider:"freeCodeCamp.org + Rust official",title:"Rust full course and systems programming tutorials",topics:"Ownership, borrowing, lifetimes, traits, concurrency",q:"Rust programming full course freeCodeCamp Rust official learning tutorial"}
 ];
 const grid=document.getElementById("video-resource-grid");
 const filter=document.getElementById("video-language-filter");
 if(!grid||!filter)return;
 const render=()=>{
  const chosen=filter.value;
  const items=resources.filter(r=>chosen==="all"||r.id===chosen);
  grid.innerHTML=items.map(r=>`
   <article class="video-resource-card">
    <div class="video-card-top"><span class="video-play-icon">▶</span><span class="video-level">${r.level}</span></div>
    <div class="video-card-content">
     <div class="video-provider">${r.provider}</div>
     <h3>${r.name}</h3><h4>${r.title}</h4>
     <p>${r.topics}</p>
     <a class="video-watch-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(r.q)}" target="_blank" rel="noopener noreferrer">Find learning videos <span>↗</span></a>
    </div>
   </article>`).join("");
 };
 filter.addEventListener("change",render);
 render();
})();
