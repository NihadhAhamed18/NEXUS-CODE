
const courses = [
    {id:"python", name:"Python Programming", icon:"🐍", description:"Learn Python from your first program to object-oriented programming.", color:"#398cff", level:"BEGINNER TO ADVANCED", available:true},
    {id:"cpp", name:"C++ Programming", icon:"⚙️", description:"Master C++ syntax, pointers, classes and algorithms.", color:"#58a6ff"},
    {id:"c", name:"C Programming", icon:"💻", description:"Understand programming fundamentals and memory management.", color:"#a78bfa"},
    {id:"java", name:"Java Programming", icon:"☕", description:"Learn Java, OOP, collections and application development.", color:"#ff9b55"},
    {id:"javascript", name:"JavaScript", icon:"🌐", description:"Build interactive websites and modern web applications.", color:"#f0cf56"},
    {id:"csharp", name:"C# Programming", icon:"🟣", description:"Explore C#, object-oriented programming and .NET.", color:"#a78bfa"},
    {id:"php", name:"PHP Development", icon:"🐘", description:"Learn server-side programming and dynamic websites.", color:"#8299ff"},
    {id:"ruby", name:"Ruby Programming", icon:"💎", description:"Learn Ruby fundamentals and application development.", color:"#ff697d"},
    {id:"go", name:"Go Programming", icon:"🚀", description:"Build efficient applications with Google's Go language.", color:"#4ad5df"},
    {id:"rust", name:"Rust Programming", icon:"🦀", description:"Learn safe systems programming with Rust.", color:"#ff9b55"}
];

const pythonLessons = [
    {
        title:"Introduction to Programming",
        level:"BEGINNER",
        content:`
            <h3>What is programming?</h3>
            <p>Programming is the process of giving instructions to a computer to perform a particular task.</p>
            <p>These instructions are written using programming languages such as Python, C, C++ and Java.</p>
            <h3>Why learn Python?</h3>
            <ul>
                <li>Easy-to-understand syntax.</li>
                <li>Useful for automation and data science.</li>
                <li>Widely used in artificial intelligence.</li>
                <li>Suitable for beginners.</li>
            </ul>
            <h3>Your first Python program</h3>
            <p>The <strong>print()</strong> function displays information on the screen.</p>
        `,
        code:`print("Hello, World!")
print("Welcome to NEXUS CODE!")`
    },
    {
        title:"Variables and Data Types",
        level:"BEGINNER",
        content:`
            <h3>What is a variable?</h3>
            <p>A variable is a named storage location used to hold information.</p>
            <p>Python creates variables when you assign values to them.</p>
            <h3>Common data types</h3>
            <ul>
                <li><strong>int:</strong> Whole numbers, such as 25.</li>
                <li><strong>float:</strong> Decimal numbers, such as 3.14.</li>
                <li><strong>str:</strong> Text, such as "Ahamed".</li>
                <li><strong>bool:</strong> True or False.</li>
            </ul>
            <h3>Example</h3>
            <p>You can use the type() function to identify a variable's data type.</p>
        `,
        code:`name = "Ahamed"
age = 22
height = 1.75
is_student = True

print(name)
print(age)
print(type(height))
print(is_student)`
    },
    {
        title:"Input and Output",
        level:"BEGINNER",
        content:`
            <h3>Getting information from users</h3>
            <p>The input() function allows a program to receive information from a user.</p>
            <p>The print() function displays the result.</p>
            <h3>Important concept</h3>
            <p>input() returns text by default. Use int() or float() when numerical calculations are needed.</p>
        `,
        code:`name = input("Enter your name: ")

age = int(input("Enter your age: "))

print("Welcome", name)
print("Your age is", age)`
    },
    {
        title:"Operators",
        level:"BEGINNER",
        content:`
            <h3>What are operators?</h3>
            <p>Operators perform calculations and comparisons.</p>
            <ul>
                <li><strong>+</strong> Addition</li>
                <li><strong>-</strong> Subtraction</li>
                <li><strong>*</strong> Multiplication</li>
                <li><strong>/</strong> Division</li>
                <li><strong>//</strong> Floor division</li>
                <li><strong>%</strong> Modulus (remainder)</li>
                <li><strong>**</strong> Power</li>
            </ul>
        `,
        code:`a = 15
b = 4

print("Addition:", a + b)
print("Subtraction:", a - b)
print("Multiplication:", a * b)
print("Division:", a / b)
print("Remainder:", a % b)
print("Power:", a ** b)`
    },
    {
        title:"Conditional Statements",
        level:"BEGINNER",
        content:`
            <h3>Making decisions</h3>
            <p>Conditional statements allow a program to make decisions based on conditions.</p>
            <ul>
                <li>if</li>
                <li>elif</li>
                <li>else</li>
            </ul>
            <p>Python uses indentation to define blocks of code. Proper indentation is important.</p>
        `,
        code:`mark = int(input("Enter your mark: "))

if mark >= 75:
    print("Distinction")
elif mark >= 50:
    print("Pass")
else:
    print("Fail")`
    },
    {
        title:"Loops",
        level:"BEGINNER",
        content:`
            <h3>Why use loops?</h3>
            <p>Loops repeat a block of instructions without writing the same code many times.</p>
            <h3>Types of loops</h3>
            <ul>
                <li><strong>for loop:</strong> Repeats over a sequence.</li>
                <li><strong>while loop:</strong> Repeats while a condition is true.</li>
            </ul>
        `,
        code:`# For loop

for number in range(1, 6):
    print(number)

# While loop

count = 1

while count <= 5:
    print(count)
    count += 1`
    },
    {
        title:"Functions",
        level:"INTERMEDIATE",
        content:`
            <h3>What is a function?</h3>
            <p>A function is a reusable block of code designed to perform a specific task.</p>
            <p>Functions are created using the <strong>def</strong> keyword.</p>
            <h3>Advantages</h3>
            <ul>
                <li>Reduces repeated code.</li>
                <li>Makes programs easier to understand.</li>
                <li>Improves code organization.</li>
            </ul>
        `,
        code:`def calculate_area(length, width):
    return length * width

area = calculate_area(10, 5)

print("Area:", area)`
    },
    {
        title:"Object-Oriented Programming",
        level:"INTERMEDIATE",
        content:`
            <h3>Introduction to OOP</h3>
            <p>Object-oriented programming organizes programs using classes and objects.</p>
            <ul>
                <li><strong>Class:</strong> A blueprint for creating objects.</li>
                <li><strong>Object:</strong> An instance of a class.</li>
                <li><strong>Attribute:</strong> Data associated with an object.</li>
                <li><strong>Method:</strong> A function defined inside a class.</li>
            </ul>
            <p>Later, learn inheritance, encapsulation and polymorphism.</p>
        `,
        code:`class Student:

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        print("My name is", self.name)
        print("My age is", self.age)

student = Student("Ahamed", 22)

student.introduce()`
    }
];

const $ = id => document.getElementById(id);

let activeCourse = null;
let activeLesson = 0;

const storageKey = "nexusAcademyProgress";

function getProgress() {
    try {
        return JSON.parse(
            localStorage.getItem(storageKey) || "{}"
        );
    } catch {
        return {};
    }
}

function saveProgress(progress) {
    localStorage.setItem(
        storageKey,
        JSON.stringify(progress)
    );
}

function getCompleted(courseId) {
    const progress = getProgress();
    return progress[courseId] || [];
}

function getPercentage(courseId, total) {
    if (!total) return 0;

    return Math.round(
        getCompleted(courseId).length / total * 100
    );
}


// DISPLAY COURSE CARDS

function renderCourses() {

    const grid = $("courseGrid");

    grid.innerHTML = "";

    courses.forEach(course => {

        const progress = course.available
            ? getPercentage("python", pythonLessons.length)
            : 0;

        const card = document.createElement("div");

        card.className = "course-card";

        card.style.setProperty(
            "--card-color",
            course.color
        );

        card.innerHTML = `
            <div class="course-icon">${course.icon}</div>

            <h3>${course.name}</h3>

            <p>${course.description}</p>

            <span class="course-level">
                ${course.available ? "AVAILABLE NOW" : "COMING SOON"}
            </span>

            <div class="card-progress">
                <div style="width:${progress}%"></div>
            </div>

            <div style="
                display:flex;
                justify-content:space-between;
                margin-top:10px;
                font-size:10px;
                color:var(--muted);
            ">
                <span>${course.available ? "Your progress" : "Course preparation"}</span>
                <strong>${progress}%</strong>
            </div>
        `;

        card.addEventListener("click", () => {
            if (course.available) {
                openCourse(course.id);
            } else {
                alert(
                    course.name +
                    " will be added in a future update."
                );
            }
        });

        grid.appendChild(card);

    });
}


// OPEN COURSE

function openCourse(courseId) {

    activeCourse = courseId;
    activeLesson = 0;

    $("lessonArea").classList.remove("hidden");

    $("courseTitle").textContent =
        "Python Programming";

    $("courseDescription").textContent =
        "Learn Python step by step, from your first program to object-oriented programming.";

    renderLessonList();
    showLesson();

    $("lessonArea").scrollIntoView({
        behavior: "smooth"
    });
}


// LESSON LIST

function renderLessonList() {

    const list = $("lessonList");

    list.innerHTML = "";

    const completed = getCompleted(activeCourse);

    pythonLessons.forEach((lesson, index) => {

        const button = document.createElement("button");

        button.className = "lesson-item";

        if (index === activeLesson) {
            button.classList.add("active");
        }

        if (completed.includes(index)) {
            button.classList.add("done");
        }

        button.textContent =
            `${String(index + 1).padStart(2, "0")}. ${lesson.title}`;

        button.addEventListener("click", () => {

            activeLesson = index;

            showLesson();
            renderLessonList();

        });

        list.appendChild(button);

    });

}


// SHOW LESSON

function showLesson() {

    const lesson = pythonLessons[activeLesson];

    const completed = getCompleted(activeCourse);

    $("lessonTitle").textContent = lesson.title;

    $("lessonLevel").textContent = lesson.level;

    $("lessonNumber").textContent =
        "LESSON " + String(activeLesson + 1).padStart(2, "0");

    $("lessonBody").innerHTML =
        `<div class="lesson-copy">${lesson.content}</div>`;

    $("lessonCode").textContent = lesson.code;

    $("previousBtn").disabled = activeLesson === 0;

    $("previousBtn").style.opacity =
        activeLesson === 0 ? ".45" : "1";

    $("completeBtn").textContent =
        completed.includes(activeLesson)
            ? "Completed ✓"
            : "Mark as Completed →";

    updateProgress();

}


// PROGRESS TRACKING

function updateProgress() {

    const percentage = getPercentage(
        activeCourse,
        pythonLessons.length
    );

    $("progressText").textContent =
        percentage + "%";

    $("progressBar").style.width =
        percentage + "%";

}


// MARK LESSON COMPLETE

function completeLesson() {

    const progress = getProgress();

    if (!progress[activeCourse]) {
        progress[activeCourse] = [];
    }

    if (!progress[activeCourse].includes(activeLesson)) {

        progress[activeCourse].push(activeLesson);

        saveProgress(progress);

    }

    renderLessonList();
    showLesson();
    renderCourses();

    if (getPercentage(activeCourse, pythonLessons.length) === 100) {
        alert("Congratulations! You completed the Python starter course!");
    } else {
        toast("Lesson completed successfully!");
    }

}


// SIMPLE NOTIFICATION

function toast(message) {

    let notification = document.getElementById("academyToast");

    if (!notification) {

        notification = document.createElement("div");

        notification.id = "academyToast";

        notification.style.cssText = `
            position:fixed;
            bottom:25px;
            left:50%;
            transform:translateX(-50%);
            background:#17345b;
            color:white;
            padding:13px 20px;
            border:1px solid #398cff;
            border-radius:9px;
            z-index:100;
            font:12px Inter,sans-serif;
        `;

        document.body.appendChild(notification);

    }

    notification.textContent = message;

    notification.style.display = "block";

    clearTimeout(toast.timer);

    toast.timer = setTimeout(() => {
        notification.style.display = "none";
    }, 2500);

}


// COPY EXAMPLE CODE

async function copyExample() {

    const code = $("lessonCode").textContent;

    try {

        await navigator.clipboard.writeText(code);

        toast("Code copied successfully!");

    } catch {

        toast("Copy unavailable. Select and copy the code manually.");

    }

}


// PREVIOUS LESSON

function previousLesson() {

    if (activeLesson > 0) {

        activeLesson--;

        showLesson();
        renderLessonList();

    }

}


// BACK TO COURSES

function backToCourses() {

    $("lessonArea").classList.add("hidden");

    $("courses").scrollIntoView({
        behavior: "smooth"
    });

    renderCourses();

}


// THEME TOGGLE

function toggleTheme() {

    const light = document.body.classList.toggle("light");

    $("themeBtn").textContent =
        light ? "☾" : "☼";

    localStorage.setItem(
        "nexusAcademyTheme",
        light ? "light" : "dark"
    );

}


// RESTORE THEME

function restoreTheme() {

    const theme =
        localStorage.getItem("nexusAcademyTheme");

    if (theme === "light") {

        document.body.classList.add("light");

        $("themeBtn").textContent = "☾";

    }

}


// BUTTON EVENTS

$("completeBtn").addEventListener(
    "click",
    completeLesson
);

$("previousBtn").addEventListener(
    "click",
    previousLesson
);

$("backBtn").addEventListener(
    "click",
    backToCourses
);

$("copyCode").addEventListener(
    "click",
    copyExample
);

$("themeBtn").addEventListener(
    "click",
    toggleTheme
);


// INITIALIZE ACADEMY

restoreTheme();
renderCourses();
