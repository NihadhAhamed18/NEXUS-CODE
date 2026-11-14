
(() => {
"use strict";
const COURSE_DATA = [
{ id:"python",name:"Python",icon:"Py",level:"Beginner",description:"Learn readable, versatile programming with Python.",lessons:[
["Your first Python program","Understand what Python is and how a program runs.","Python is a high-level language known for clear syntax. A program is a set of instructions the computer follows. The <code>print()</code> function displays information.",'print("Hello, NEXUS!")',"What does print() do?",["Displays information","Repeats a loop","Creates a variable"],0],
["Variables and data types","Store information using variables.","A variable is a named place to store a value. Common types include <code>str</code> (text), <code>int</code> (whole number), <code>float</code> (decimal) and <code>bool</code> (True or False).",'name = "Ahamed"\nage = 21\nheight = 1.75\nis_student = True\nprint(name)',"Which type stores a whole number?",["str","int","bool"],1],
["Conditions and decisions","Make a program choose what to do.","An <code>if</code> statement runs code when a condition is true. Use <code>elif</code> for another condition and <code>else</code> as the fallback. Indentation defines the code block.",'mark = 75\nif mark >= 50:\n    print("Pass")\nelse:\n    print("Try again")',"Which keyword handles the alternative branch?",["for","else","def"],1]
]},
{ id:"c",name:"C",icon:"C",level:"Beginner",description:"Build a foundation in structured, procedural programming.",lessons:[
["First C program","Explore the structure of a simple C program.","C programs commonly include header files, a <code>main()</code> function and statements. <code>printf()</code> prints formatted output. The semicolon ends a statement.",'#include <stdio.h>\nint main(void) {\n    printf("Hello, NEXUS!\\n");\n    return 0;\n}',"Which function is the usual entry point in C?",["start()","main()","printf()"],1],
["Variables and types","Declare variables to store values.","C is statically typed. Declare a variable with its type before using it. Common types include <code>int</code>, <code>float</code>, <code>double</code> and <code>char</code>.",'int age = 21;\nfloat temperature = 28.5f;\nchar grade = \'A\';',"Which type is commonly used for a single character?",["char","int","float"],0],
["Decisions with if","Control the flow of a C program.","The <code>if</code>, <code>else if</code> and <code>else</code> statements let a program make decisions based on expressions that evaluate to true or false.",'int mark = 65;\nif (mark >= 50) {\n    printf("Pass");\n} else {\n    printf("Fail");\n}',"Which symbol means 'greater than or equal to'?",[">","=>",">="],2]
]},
{ id:"cpp",name:"C++",icon:"C+",level:"Beginner",description:"Start with modern C++ syntax and problem solving.",lessons:[
["Your first C++ program","Understand headers, main and output.","C++ is a general-purpose language. The <code>iostream</code> library provides input and output streams. <code>std::cout</code> writes output to the console.",'#include <iostream>\nint main() {\n    std::cout << "Hello, NEXUS!";\n    return 0;\n}',"Which stream is used for standard output?",["std::cin","std::cout","std::cerr"],1],
["Variables and types","Create variables with appropriate data types.","Use <code>int</code> for whole numbers, <code>double</code> for decimal values, <code>char</code> for characters and <code>std::string</code> for text.",'#include <string>\nint age = 21;\ndouble gpa = 3.5;\nstd::string name = "Ahamed";',"Which type is suitable for a decimal value?",["int","double","char"],1],
["Conditional statements","Use conditions to make decisions.","C++ supports <code>if</code>, <code>else if</code> and <code>else</code>. The condition inside parentheses determines which block executes.",'int score = 80;\nif (score >= 50) {\n    std::cout << "Pass";\n} else {\n    std::cout << "Fail";\n}',"Which keyword introduces a condition?",["if","loop","class"],0]
]},
{ id:"java",name:"Java",icon:"Jv",level:"Beginner",description:"Learn object-oriented programming fundamentals.",lessons:[
["Java program structure","Recognise classes and the main method.","Java code is organised into classes. A standard application starts in the <code>main</code> method. <code>System.out.println()</code> displays a line of output.",'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, NEXUS!");\n  }\}',"Where does a standard Java application begin?",["constructor","main method","package"],1],
["Variables and data types","Declare typed values in Java.","Java requires variable types. Common primitive types include <code>int</code>, <code>double</code>, <code>char</code> and <code>boolean</code>. <code>String</code> stores text.",'int age = 21;\ndouble price = 12.5;\nString name = "Ahamed";',"Which Java type stores text?",["String","boolean","char"],0],
["if and else","Make decisions in Java.","An <code>if</code> statement evaluates a boolean expression. If it is true, its block runs; otherwise an <code>else</code> block can run.",'int mark = 72;\nif (mark >= 50) {\n  System.out.println("Pass");\n} else {\n  System.out.println("Fail");\n}',"What type of value does an if condition evaluate to?",["String","boolean","double"],1]
]},
{ id:"javascript",name:"JavaScript",icon:"JS",level:"Beginner",description:"Add logic and interactivity to websites.",lessons:[
["JavaScript basics","Run your first JavaScript statement.","JavaScript adds behaviour to web pages and also runs on servers. Use <code>console.log()</code> to display a message in the developer console.",'console.log("Hello, NEXUS!");',"Which function prints a message to the console?",["print()","console.log()","echo()"],1],
["Variables with let and const","Store values using modern declarations.","Use <code>let</code> when a value may be reassigned and <code>const</code> when the variable binding should not be reassigned. JavaScript is dynamically typed.",'const course = "JavaScript";\nlet lessonsCompleted = 0;\nlessonsCompleted = 1;\nconsole.log(course, lessonsCompleted);',"Which declaration prevents reassignment?",["let","const","var only"],1],
["Conditions","Control which code runs.","Use <code>if</code>, <code>else if</code> and <code>else</code> to run different blocks based on a condition.",'const mark = 68;\nif (mark >= 50) {\n  console.log("Pass");\n} else {\n  console.log("Fail");\n}',"Which operator checks strict equality?",["=","===","!="],1]
]},
{ id:"csharp",name:"C#",icon:"C#",level:"Beginner",description:"Get started with C# and the .NET ecosystem.",lessons:[
["First C# application","Display output in a C# program.","C# is a strongly typed language commonly used with .NET. A simple console application can use <code>Console.WriteLine()</code> to display text.",'using System;\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, NEXUS!");\n  }\n}',"Which method writes a line to the console?",["Console.ReadLine()","Console.WriteLine()","WriteFile()"],1],
["Variables and types","Store typed data in C#.","C# includes types such as <code>int</code>, <code>double</code>, <code>char</code>, <code>bool</code> and <code>string</code>. Choose a type that matches the data.",'int age = 21;\ndouble voltage = 12.5;\nstring name = "Ahamed";',"Which type stores true or false?",["bool","string","double"],0],
["Conditional logic","Use if and else in C#.","A conditional statement selects a block based on a boolean expression. Curly braces group the statements belonging to each branch.",'int mark = 64;\nif (mark >= 50) {\n  Console.WriteLine("Pass");\n} else {\n  Console.WriteLine("Fail");\n}',"Which type of expression is used in an if condition?",["Boolean","String","Array"],0]
]},
{ id:"php",name:"PHP",icon:"PHP",level:"Beginner",description:"Learn server-side scripting for dynamic websites.",lessons:[
["PHP introduction","Write your first PHP statement.","PHP is widely used for server-side web development. PHP code is commonly placed between <code>&lt;?php</code> and <code>?&gt;</code> tags. <code>echo</code> outputs text.",'<?php\necho "Hello, NEXUS!";\n?>',"Which keyword can output text in PHP?",["echo","printline","console"],0],
["Variables","Create and use PHP variables.","PHP variables begin with a dollar sign. PHP is dynamically typed, so a variable can hold different kinds of values.",'<?php\n$name = "Ahamed";\n$age = 21;\necho $name;\n?>',"What symbol begins a PHP variable?",["#","$","@"],1],
["Conditions","Use if and else in PHP.","PHP supports familiar conditional statements. Use comparison operators to test values and braces to group statements.",'<?php\n$mark = 70;\nif ($mark >= 50) {\n  echo "Pass";\n} else {\n  echo "Fail";\n}\n?>',"Which keyword starts a conditional statement?",["when","if","check"],1]
]},
{ id:"ruby",name:"Ruby",icon:"Rb",level:"Beginner",description:"Explore expressive syntax with Ruby.",lessons:[
["Ruby first steps","Print your first message.","Ruby is designed to be readable and expressive. The <code>puts</code> method displays text followed by a newline.",'puts "Hello, NEXUS!"',"Which method prints a line in Ruby?",["puts","echo","Console.WriteLine"],0],
["Variables and values","Assign and use values in Ruby.","Ruby variables do not need an explicit type declaration. Use a clear name and assign a value with <code>=</code>.",'name = "Ahamed"\nage = 21\nputs name\nputs age',"Do Ruby variables require an explicit type declaration?",["Yes, always","No","Only for strings"],1],
["Conditional logic","Use if and else expressions.","Ruby uses <code>if</code> and <code>else</code> to select a code path. The block ends with <code>end</code>.",'mark = 75\nif mark >= 50\n  puts "Pass"\nelse\n  puts "Fail"\nend',"Which keyword closes this if block?",["stop","end","done"],1]
]},
{ id:"go",name:"Go",icon:"Go",level:"Beginner",description:"Build simple, efficient programs with Go.",lessons:[
["Go program basics","Understand packages and main.","Go programs are organised into packages. An executable program commonly uses <code>package main</code> and a <code>main()</code> function. <code>fmt.Println</code> prints output.",'package main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello, NEXUS!")\n}',"Which package provides Println in this example?",["math","fmt","os"],1],
["Variables","Declare values in Go.","Go is statically typed. You can declare variables with <code>var</code> or use <code>:=</code> inside a function for short declarations.",'package main\nfunc main() {\n  var age int = 21\n  course := "Go"\n  _, _ = age, course\n}',"Which operator is used for a short variable declaration?",["::"," :=","=="],1],
["if statements","Control program flow in Go.","Go uses <code>if</code> and <code>else</code> for decisions. Parentheses around the condition are optional, while braces are required.",'score := 80\nif score >= 50 {\n  println("Pass")\n} else {\n  println("Fail")\n}',"Are parentheses around Go if conditions required?",["Yes","No"],1]
]},
{ id:"rust",name:"Rust",icon:"Rs",level:"Beginner",description:"Discover safe systems programming with Rust.",lessons:[
["Rust program structure","Write and run a simple Rust program.","Rust executable programs commonly start with a <code>fn main()</code> function. The <code>println!</code> macro prints formatted output.",'fn main() {\n    println!("Hello, NEXUS!");\n}',"Which macro prints a line in this example?",["print_line!","println!","echo!"],1],
["Variables and mutability","Understand let and mut.","Rust variables are immutable by default. Use <code>mut</code> when you need to change a value after it is created.",'fn main() {\n    let course = "Rust";\n    let mut score = 0;\n    score = 10;\n    println!("{} {}", course, score);\n}',"Which keyword allows a variable to be changed?",["change","mut","var"],1],
["Conditions","Use if expressions in Rust.","Rust uses <code>if</code> and <code>else</code> to select a branch. The condition must be a boolean, and braces surround each block.",'fn main() {\n    let mark = 80;\n    if mark >= 50 {\n        println!("Pass");\n    } else {\n        println!("Fail");\n    }\n}',"What type must a Rust if condition produce?",["Integer","Boolean","String"],1]
]}
];

const $ = id => document.getElementById(id);
const validConfig = () => window.NEXUS_SUPABASE_URL && window.NEXUS_SUPABASE_ANON_KEY &&
 !window.NEXUS_SUPABASE_URL.includes("YOUR_") && !window.NEXUS_SUPABASE_ANON_KEY.includes("YOUR_");
let supabase = null, user = null, currentCourse = COURSE_DATA[0], currentLesson = null;
let progress = {}, selectedOption = null, answerChecked = false, signupMode = false, toastTimer;
if (validConfig() && window.supabase?.createClient) {
  supabase = window.supabase.createClient(window.NEXUS_SUPABASE_URL, window.NEXUS_SUPABASE_ANON_KEY);
}
const localKey = "nexusAcademyStage4Progress";
function loadLocal(){try{progress=JSON.parse(localStorage.getItem(localKey)||"{}")}catch{progress={}}}
function saveLocal(){localStorage.setItem(localKey,JSON.stringify(progress))}
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600)}
// Preserve the current viewport when lesson panels are swapped or updated.
function preserveCourseScroll(update){
 const x=window.scrollX, y=window.scrollY;
 update();
 requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(x,y)));
}
function updateLessonNavigation(){
 const prev=$("previous-lesson"), next=$("next-lesson");
 if(prev) prev.disabled=currentLesson<=0;
 if(next) next.disabled=currentLesson>=currentCourse.lessons.length-1;
}
function courseProgress(course){const done=course.lessons.filter(l=>progress[course.id+"_"+course.lessons.indexOf(l)]?.completed).length;return Math.round(done/course.lessons.length*100)}
function renderLanguages(){
