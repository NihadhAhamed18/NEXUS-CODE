NEXUS CODE — MOBILE PERFORMANCE UPDATE

WHAT CHANGED
1. NEXUS AI no longer automatically opens the mobile keyboard when the chat panel opens.
2. The chat panel uses a more stable small-viewport height and mobile safe-area spacing.
3. Mobile chat scrolling is no longer forced into smooth scrolling, reducing viewport jumps.
4. Decorative background animations and expensive backdrop blur effects are reduced on small screens.
5. The compiler page now loads Monaco after the first page render, improving the initial mobile load.
6. Added .gitignore so node_modules and local Supabase cache are not uploaded to GitHub Pages.

DEPLOY
1. Extract this ZIP.
2. Open the extracted project folder.
3. Upload/replace the project files in your existing GitHub repository (main branch).
4. Do not delete your Supabase project or Edge Function.
5. Keep supabase-config.js as it is in your current project. It contains your public browser configuration; never put a service-role key or private API key in it.
6. Wait for GitHub Pages to deploy, then on your phone open the site in a private/incognito tab or clear the browser cache and test again.

IMPORTANT
- node_modules is intentionally excluded. It is not needed by the GitHub Pages website.
- The Supabase Edge Function source and SQL files are retained under supabase/.
- Your existing Gemini-powered NEXUS AI code is preserved.
