# Vumedi — Individual Development Plan

A self-contained development-planning web app: discover where to grow, build a focus-area plan with dated actions, track progress on a timeline, reflect in a dated journal, and export Lattice-ready summaries.

Data is stored in each visitor's own browser (localStorage). There are no accounts and no shared database — every person's data is private to their own browser on their own device.

---

## How to put this online (Vercel)

You do **not** need to change any code. These steps take about 15 minutes the first time.

### What you'll need
- A free **GitHub** account: https://github.com/signup
- A free **Vercel** account: https://vercel.com/signup (sign in *with* your GitHub account — it links them automatically)

### Step 1 — Put this project on GitHub
**Easiest (no command line):**
1. On GitHub, click **New repository**. Name it e.g. `inflection-idp`. Leave it Private if you like. Click **Create repository**.
2. On the new repo page, click **uploading an existing file**.
3. Drag in *all the files and folders from this project* (package.json, vite.config.js, index.html, the `src` folder, etc.) — but NOT the `node_modules` folder if one exists.
4. Click **Commit changes**.

### Step 2 — Deploy on Vercel
1. Go to https://vercel.com and click **Add New… → Project**.
2. Pick the GitHub repository you just created.
3. Vercel auto-detects this is a **Vite** app. Leave all settings as their defaults.
4. Click **Deploy**.
5. After ~1 minute you'll get a live URL like `https://inflection-idp.vercel.app`. Share that link with anyone.

### Updating it later
Any time the code changes in GitHub, Vercel automatically rebuilds and updates the live site. No extra steps.

---

## Running it on your own computer (optional, for developers)
```bash
npm install
npm run dev      # local preview at http://localhost:5173
npm run build    # production build into /dist
```

---

## Important notes
- **Browser storage:** data lives in localStorage. If a user clears their browser data or switches devices/browsers, their plan does not follow them. This is fine for a pilot; a future version with logins + a database would fix it.
- **No back-end:** there is no server, no login, no manager view, and no central place to see everyone's plans. Adding those is a separate, larger project (authentication + database).
- **AI suggestions:** the "Mastery in Current Role" focus area offers a copy-and-paste prompt for the user's own AI tool (Claude, ChatGPT, etc.) rather than calling an AI directly. No API key is needed or embedded.
