# NEXUS CODE — Stage 1

A static online coding workspace using Monaco Editor and the public Judge0 CE execution endpoint.

## Included
- Monaco code editor
- Python 3, C, C++, Java, JavaScript, C#, PHP, Ruby, Go and Rust
- Real remote code execution through Judge0 CE
- Custom standard input (stdin)
- Output, compile errors and runtime errors
- Dark/light theme toggle
- Responsive layout
- Download current source file
- Ctrl/Cmd + Enter to run

## Deploy to GitHub Pages

1. Sign in to GitHub and create a new **public** repository named `nexus-code`.
2. Download and extract this ZIP file.
3. Open the repository and choose **Add file → Upload files**.
4. Upload `index.html`, `style.css`, `script.js` and `README.md` (upload the files, not the containing folder).
5. Commit the changes to the `main` branch.
6. Open **Settings → Pages**.
7. Under **Build and deployment**, choose **Deploy from a branch**.
8. Select branch `main`, folder `/ (root)`, then click **Save**.
9. Wait a minute or two. Your site will be available at:
   `https://YOUR-GITHUB-USERNAME.github.io/nexus-code/`

## Run locally
Open `index.html` through a local web server (recommended), such as VS Code Live Server. Monaco workers may not work reliably from a `file://` URL.

## Execution API
This project currently calls:
`https://ce.judge0.com/submissions?base64_encoded=true&wait=true`

The browser sends source code and stdin to Judge0 CE and displays the returned output. Judge0 is a separate service; GitHub Pages does not execute programs.

**Important:** the public Judge0 CE instance is a shared demo service. Availability, rate limits, supported language versions and response times can change. It is not a guaranteed production backend. Do not submit passwords, secrets or private data. The sandbox is intended to isolate execution, but use the service responsibly.

If the public endpoint becomes unavailable or starts requiring credentials, replace the `API` constant in `script.js` with an execution provider you control. Never put a private API key in front-end JavaScript: anyone can view it.

## Notes
- Monaco Editor is the browser editor that powers VS Code's editing experience. It is not the full VS Code application.
- Mobile layout is responsive, but Monaco's official documentation notes that mobile browsers are not officially supported; a compact touchscreen experience may vary by device.
- Stage 1 uses single-file submissions. Multi-file projects, saving projects/accounts, and collaboration can be added in later stages.
