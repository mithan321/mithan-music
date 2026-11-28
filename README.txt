MITHAN MUSIC STUDIO — SETUP

Files:
- index.html
- style.css
- config.js
- script.js
- artists-setup.sql

IMPORTANT:
1. Keep this as a separate website/project. Do not copy these files into the public Mithan Music site.
2. Supabase project URL and publishable key are already set in config.js.
3. The public publishable key is intended for browser use. Never add a service_role or secret key.
4. In Supabase SQL Editor, run artists-setup.sql once to create the artist profiles table.
5. In Supabase Authentication > Users, ensure rathodmitranshu@gmail.com is an Auth user and use that account to sign in.
6. Deploy this folder as its own site (for example, a separate GitHub repository / Vercel project).
7. The existing songs table and mithan-music Storage bucket must remain as already configured.

NOTE:
The songs uploader assigns each selected file's filename as its title. All selected tracks share the entered artist, album and optional cover image. Edit individual titles later in Songs Library.
Artist profile uploads use the same public storage bucket.
