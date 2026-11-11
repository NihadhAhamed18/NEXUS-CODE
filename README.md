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


## Advanced Practice Lab update
- 10 language-specific quiz banks (Python, C, C++, Java, JavaScript, C#, PHP, Ruby, Go and Rust).
- 10 questions per language, including intermediate and advanced concepts (100 questions total).
- 18 coding challenges across beginner, intermediate and advanced levels, including binary search, balanced brackets, LRU cache design, linked-list cycle detection and sliding-window problems.
- Quiz length, progress bar, scoring and results are calculated dynamically.


## Creative visual refresh
All six page stylesheets now include a shared visual refresh: aurora lighting, layered glass panels, refined gradients, animated hover states, improved focus indicators, responsive adjustments, reduced-motion support, and light-theme surface overrides. Existing page structure and JavaScript functionality have been retained.


## Theme loading fix
Added `nexus-theme.css` as the final stylesheet on every HTML page with a versioned URL so browser caches refresh. This master override explicitly styles dark and light themes across all page types.


## Video Learning Library
Added a dedicated Video Learning Library to the Courses page with a language filter and ten curated resource cards (Python, C, C++, Java, JavaScript, C#, PHP, Ruby, Go, Rust). Each card opens a targeted YouTube search for full courses and deeper tutorials from reputable educators. These links are external and video availability is controlled by YouTube publishers.


## NEXUS AI Coding Assistant (new)

The project now includes a floating AI coding tutor on the Academy, Courses, Student Dashboard, Practice Lab and Compiler pages. It can explain programming concepts, draft code, help debug pasted code and errors, and create guided practice challenges. It requires a signed-in student account.

### Important: one-time secure setup required

The website is hosted on GitHub Pages, so the OpenAI API key must **never** be placed in browser JavaScript or committed to this repository. NEXUS AI calls a Supabase Edge Function, which keeps the AI key on the server. The chat will display a setup message until the function and secret are configured.

1. In the Supabase Dashboard, open **SQL Editor**, paste and run `supabase/nexus-ai-rate-limit.sql`. This enables a limit of 30 requests per student per hour.
2. In Supabase, open **Edge Functions** and deploy the function named `nexus-ai` using `supabase/functions/nexus-ai/index.ts`. You can deploy with the Supabase CLI from this project folder: `supabase functions deploy nexus-ai`.
3. In **Project Settings → Edge Functions → Secrets** (or the Edge Function secrets panel), add `OPENAI_API_KEY` with your own OpenAI API key. Optionally add `OPENAI_MODEL` (default: `gpt-4.1-mini`). Supabase provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions. Never expose the service-role key or OpenAI key in GitHub files.
4. Make sure the `nexus-ai` function has JWT verification enabled. The function independently validates the signed-in student session as well.
5. Push the updated website files to GitHub Pages. Hard-refresh the site (Ctrl+F5) after deployment.

### AI service costs and limits

OpenAI API usage is billed separately from ChatGPT subscriptions. The account owner must add billing/credits to the OpenAI API project. The included SQL limit allows up to 30 requests per student per hour; adjust the function or SQL if you want a different limit. Review usage and set provider spending limits before inviting students.

### Included files

- `ai-assistant.js` and `ai-assistant.css` — floating chat UI and student session handling.
- `supabase/functions/nexus-ai/index.ts` — server-side AI proxy using the OpenAI Responses API.
- `supabase/nexus-ai-rate-limit.sql` — per-student hourly request limit.

The AI assistant receives the current page name and the recent chat messages. Students should paste the relevant code and exact error message into the chat when requesting debugging help. It does not automatically read or modify the Monaco editor contents.
