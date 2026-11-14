
const API = "https://ce.judge0.com/submissions";

const languages = {
    "71": {
        name: "Python 3",
        mode: "python",
        file: "main.py",
        code: `name = input("Enter your name: ")
print("Welcome to NEXUS CODE", name)`
    },
    "54": {
        name: "C++",
        mode: "cpp",
        file: "main.cpp",
        code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, NEXUS CODE!" << endl;
    return 0;
}`
    },
    "50": {
        name: "C",
        mode: "c",
        file: "main.c",
        code: `#include <stdio.h>

int main() {
    printf("Hello, NEXUS CODE!\\n");
    return 0;
}`
    },
    "62": {
        name: "Java",
        mode: "java",
        file: "Main.java",
        code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, NEXUS CODE!");
    }
}`
    },
    "63": {
        name: "JavaScript",
        mode: "javascript",
        file: "main.js",
        code: `console.log("Hello, NEXUS CODE!");`
    },
    "51": {
        name: "C#",
        mode: "csharp",
        file: "main.cs",
        code: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, NEXUS CODE!");
    }
}`
    },
    "68": {
        name: "PHP",
        mode: "php",
        file: "main.php",
        code: `<?php
echo "Hello, NEXUS CODE!";
?>`
    },
    "72": {
        name: "Ruby",
        mode: "ruby",
        file: "main.rb",
        code: `puts "Hello, NEXUS CODE!"`
    },
    "60": {
        name: "Go",
        mode: "go",
        file: "main.go",
        code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, NEXUS CODE!")
}`
    },
    "73": {
        name: "Rust",
        mode: "rust",
        file: "main.rs",
        code: `fn main() {
    println!("Hello, NEXUS CODE!");
}`
    }
};

let editor;
let currentLanguage = "71";
let isRunning = false;

const $ = id => document.getElementById(id);


// BASE64 ENCODING

function encodeBase64(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = "";

    bytes.forEach(byte => {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary);
}


// BASE64 DECODING

function decodeBase64(value) {
    if (!value) return "";

    const binary = atob(value);

    const bytes = Uint8Array.from(
        binary,
        char => char.charCodeAt(0)
    );

    return new TextDecoder().decode(bytes);
}


// NOTIFICATION

function toast(message) {
    const element = $("toast");

    element.textContent = message;
    element.classList.add("show");

    clearTimeout(toast.timer);

    toast.timer = setTimeout(() => {
        element.classList.remove("show");
    }, 2500);
}


// DISPLAY OUTPUT

function showOutput(text, status, type = "") {
    $("output").textContent = text;

    $("runStatus").textContent = status;

    $("runStatus").style.color =
        type === "success" ? "#35e6a0" :
        type === "error" ? "#ff7185" :
        "";
}


// CHANGE LANGUAGE

function changeLanguage(id, reset = true) {
    currentLanguage = id;

    const info = languages[id];

    $("fileName").textContent = info.file;

    $("editorMeta").textContent =
        info.name + " · Ready";

    if (editor) {
        if (reset) {
            editor.setValue(info.code);
        }

        monaco.editor.setModelLanguage(
            editor.getModel(),
            info.mode
        );
    }

    $("editorStatus").textContent = "● Ready";

    showOutput(
        "Language changed to " + info.name + ".",
        "READY"
    );
}


// WAIT FUNCTION

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// EXECUTION RESULT

function displayResult(result) {
    const compileOutput =
        decodeBase64(result.compile_output);

    const standardOutput =
        decodeBase64(result.stdout);

    const errorOutput =
        decodeBase64(result.stderr);

    const message =
        decodeBase64(result.message);

    const combined = [
        compileOutput,
        standardOutput,
        errorOutput,
        message
    ].filter(Boolean).join("\n").trim();

    const status =
        result.status?.description || "Finished";

    const success =
        result.status?.id === 3;

    showOutput(
        combined ||
        (success
            ? "Program executed successfully. No output."
            : "Execution finished with status: " + status),
        status.toUpperCase(),
        success ? "success" : "error"
    );

    $("execTime").textContent =
        "TIME: " +
        (result.time ? result.time + " s" : "—");

    $("memoryUsed").textContent =
        "MEMORY: " +
        (result.memory
            ? (result.memory / 1024).toFixed(1) + " MB"
            : "—");

    $("editorStatus").textContent =
        success ? "● Execution complete" : "● Execution finished";
}


// RUN PROGRAM

async function runCode() {
    if (!editor || isRunning) return;

    const sourceCode = editor.getValue();

    if (!sourceCode.trim()) {
        toast("Please write some code first.");
        return;
    }

    isRunning = true;

    const button = $("runBtn");

    button.disabled = true;
    button.innerHTML = "◌ COMPILING...";

    $("editorStatus").textContent = "● Executing";

    $("execTime").textContent = "TIME: —";
    $("memoryUsed").textContent = "MEMORY: —";

    showOutput(
        "Initializing compiler...\nSubmitting your program...",
        "COMPILING"
    );

    const startTime = performance.now();

    try {
        const response = await fetch(
            API + "?base64_encoded=true&wait=false",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    language_id: Number(currentLanguage),
                    source_code: encodeBase64(sourceCode),
                    stdin: encodeBase64($("stdin").value),
                    cpu_time_limit: 5,
                    wall_time_limit: 10,
                    memory_limit: 128000
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                "Submission failed: HTTP " + response.status
            );
        }

        const submission = await response.json();

        if (!submission.token) {
            throw new Error("No execution token received.");
        }

        showOutput(
            "Program submitted successfully.\nWaiting for execution result...",
            "RUNNING"
        );

        let result = null;

        for (let attempt = 0; attempt < 30; attempt++) {
            await delay(1000);

            const check = await fetch(
                API + "/" + encodeURIComponent(submission.token) +
                "?base64_encoded=true",
                {
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );

            if (!check.ok) {
                throw new Error(
                    "Unable to retrieve execution result: HTTP " +
                    check.status
                );
            }

            result = await check.json();

            const statusId = result.status?.id;

            if (statusId && statusId >= 3) {
                break;
            }

            showOutput(
                "Program is executing...\nPlease wait.",
                "RUNNING"
            );
        }

        if (!result || !result.status ||
            result.status.id < 3) {
            throw new Error(
                "Execution timed out. Please try again."
            );
        }

        displayResult(result);

        const elapsed =
            ((performance.now() - startTime) / 1000).toFixed(2);

        console.log(
            "NEXUS CODE execution completed in " +
            elapsed + " seconds."
        );

    } catch (error) {
        console.error(error);

        showOutput(
            "EXECUTION ERROR\n\n" +
            error.message +
            "\n\nPlease check your internet connection or try again later. The public execution service may be unavailable.",
            "ERROR",
            "error"
        );

        $("editorStatus").textContent =
            "● Execution failed";

    } finally {
        isRunning = false;

        button.disabled = false;

        button.innerHTML = "<span>▶</span> RUN CODE";
    }
}


// DOWNLOAD PROGRAM

function downloadCode() {
    if (!editor) return;

    const info = languages[currentLanguage];

    const blob = new Blob(
        [editor.getValue()],
        { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = info.file;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    toast("Code downloaded successfully!");
}


// RESET EDITOR

function resetEditor() {
    if (!editor) return;

    changeLanguage(currentLanguage);

    $("stdin").value = "";

    $("execTime").textContent = "TIME: —";
    $("memoryUsed").textContent = "MEMORY: —";

    showOutput(
        "Terminal cleared. Ready for your next program.",
        "READY"
    );

    toast("Editor reset!");
}


// CLEAR TERMINAL

function clearTerminal() {
    $("stdin").value = "";

    $("execTime").textContent = "TIME: —";
    $("memoryUsed").textContent = "MEMORY: —";

    showOutput(
        "Terminal cleared.",
        "READY"
    );
}


// MOBILE MONACO TOUCH SCROLL

function enableMobileEditorTouchScroll() {
    if (!editor) return;

    const editorNode = editor.getDomNode();

    if (!editorNode) return;

    let startX = 0;
    let startY = 0;
    let startScrollTop = 0;
    let startScrollLeft = 0;
    let gesture = null;

    editorNode.style.touchAction = "none";
    editorNode.style.overscrollBehavior = "contain";

    editorNode.addEventListener("touchstart", event => {
        if (event.touches.length !== 1) {
            gesture = null;
            return;
        }

        const touch = event.touches[0];

        startX = touch.clientX;
        startY = touch.clientY;

        startScrollTop = editor.getScrollTop();
        startScrollLeft = editor.getScrollLeft();

        gesture = null;

    }, { passive: true, capture: true });


    editorNode.addEventListener("touchmove", event => {
        if (!event.touches || event.touches.length !== 1) return;

        const touch = event.touches[0];

        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        if (
            !gesture &&
            Math.max(Math.abs(deltaX), Math.abs(deltaY)) > 8
        ) {
            gesture =
                Math.abs(deltaY) >= Math.abs(deltaX)
                    ? "vertical"
                    : "horizontal";
        }

        if (!gesture) return;

        if (event.cancelable) {
            event.preventDefault();
        }

        if (gesture === "vertical") {
            editor.setScrollTop(startScrollTop - deltaY);
        } else {
            editor.setScrollLeft(startScrollLeft - deltaX);
        }

    }, { passive: false, capture: true });


    const endTouch = () => {
        gesture = null;
    };

    editorNode.addEventListener(
        "touchend",
        endTouch,
        { passive: true, capture: true }
    );

    editorNode.addEventListener(
        "touchcancel",
        endTouch,
        { passive: true, capture: true }
    );
}


// INITIALIZE MONACO EDITOR

function initEditor() {
    if (typeof require === "undefined") {
        $("editor").textContent =
            "Unable to load Monaco Editor. Please refresh.";
        return;
    }

    window.MonacoEnvironment = {
        getWorkerUrl: function() {
            const worker = `
                self.MonacoEnvironment = {
                    baseUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/'
                };

                importScripts(
                    'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/base/worker/workerMain.min.js'
                );
            `;

            return "data:text/javascript;charset=utf-8," +
                encodeURIComponent(worker);
        }
    };

    require.config({
        paths: {
            vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
        }
    });

    require(
        ["vs/editor/editor.main"],

        function() {
            editor = monaco.editor.create(
                $("editor"),
                {
                    value: languages[currentLanguage].code,

                    language: "python",

                    theme: "vs-dark",

                    automaticLayout: true,

                    minimap: {
                        enabled: false
                    },

                    fontFamily:
                        "JetBrains Mono, monospace",

                    fontSize: 13,

                    lineHeight: 23,

                    tabSize: 4,

                    scrollBeyondLastLine: false,

                    padding: {
                        top: 18,
                        bottom: 18
                    },

                    roundedSelection: true,

                    smoothScrolling: true,

                    cursorBlinking: "smooth",

                    cursorSmoothCaretAnimation: "on",

                    wordWrap: "on",

                    suggestOnTriggerCharacters: true
                }
            );

            // Enable mobile touch scrolling.
            enableMobileEditorTouchScroll();


            // Cursor tracking

            editor.onDidChangeCursorPosition(event => {
                $("cursorPosition").textContent =
                    `Ln ${event.position.lineNumber}, Col ${event.position.column}`;
            });


            editor.onDidFocusEditorText(() => {
                $("editorStatus").textContent = "● Editing";
            });


            // Language selection

            $("language").addEventListener(
                "change",
                event => changeLanguage(event.target.value)
            );


            // Run code

            $("runBtn").addEventListener(
                "click",
                runCode
            );


            // Download

            $("downloadBtn").addEventListener(
                "click",
                downloadCode
            );


            // Reset

            $("resetBtn").addEventListener(
                "click",
                resetEditor
            );


            // Clear terminal

            $("clearOutput").addEventListener(
                "click",
                clearTerminal
            );


            // Dark / Light theme

            $("themeBtn").addEventListener(
                "click",
                () => {
                    const light =
                        document.body.classList.toggle("light");

                    monaco.editor.setTheme(
                        light ? "vs" : "vs-dark"
                    );

                    $("themeBtn").textContent =
                        light ? "☾" : "☼";

                    toast(
                        light
                            ? "Light mode enabled"
                            : "Dark mode enabled"
                    );
                }
            );


            // Ctrl + Enter to execute

            document.addEventListener(
                "keydown",
                event => {
                    if (
                        (event.ctrlKey || event.metaKey) &&
                        event.key === "Enter"
                    ) {
                        event.preventDefault();
                        runCode();
                    }
                }
            );

            $("language").value = currentLanguage;
        },

        function(error) {
            console.error(error);

            $("editor").textContent =
                "Monaco Editor could not load.";
        }
    );
}


// START APPLICATION

initEditor();
