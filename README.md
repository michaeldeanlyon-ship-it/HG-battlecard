# HireGlobal Battlecard

Internal competitive-intel battlecard for the sales team. React + Vite, Firestore for content, Firebase Auth for the login gate, deployed on Vercel.

Content is ported verbatim from the `hireglobal_battlecard_3.html` prototype — all 34 content fields verified identical.

## How it works

- **Everyone signed in** can read every tab. Content syncs live via Firestore `onSnapshot`, so an edit lands on open tabs without a refresh.
- **Admins** get an `Edit` button on each tab. Viewers see no button, no disabled control, nothing — just the read-only battlecard.
- Roles live in `users/{uid}.role` and are granted **by hand in the Firestore console**. There is deliberately no in-app way to change a role, and the security rules block it (`allow update: if false` on `users`).

---

## Setup

### 1. Create the Firebase project

1. <https://console.firebase.google.com> → **Add project**. Google Analytics is not needed.
2. **Build → Authentication → Get started → Email/Password → Enable**. Leave "Email link (passwordless)" off.
3. **Build → Firestore Database → Create database** → production mode → pick a region near your team.
4. **Project settings (gear) → General → Your apps → Web (`</>`)** → register an app. Copy the `firebaseConfig` values from the snippet it shows.

### 2. Local environment

```bash
cp .env.example .env
```

Fill `.env` with the six values from that config snippet:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abc123
```

`.env` is gitignored. These are client-side keys and are not secret — access is controlled by the security rules, not by hiding the key.

```bash
npm install
```

### 3. Deploy the security rules

Rules must go up **before** the app is used, otherwise Firestore's default production rules deny everything.

```bash
npx firebase-tools login
```

```bash
npx firebase-tools use --add
```

Pick your project, alias it `default`. Then:

```bash
npx firebase-tools deploy --only firestore:rules
```

### 4. Seed the content

Firebase console → **Project settings → Service accounts → Generate new private key**. Save the downloaded file as `serviceAccountKey.json` in this project's root (gitignored).

```bash
npm run seed
```

This writes `competitors/{deel,rippling,remote,gusto,adp}` and `content/{hireglobal,objectionHandling,discovery}`. It uses `set()`, so re-running overwrites rather than duplicating — safe to run again if you ever want to reset to the original prototype copy.

Delete `serviceAccountKey.json` once you're done seeding if you'd rather not keep it around.

### 5. Create the team's accounts

Firebase console → **Authentication → Users → Add user**. Enter each person's email and a temporary password, one at a time (4–6 accounts including your own).

There's no signup flow and no password reset UI in the app by design — to reset someone's password, use the ⋮ menu next to their row in that same Users list.

### 6. Make yourself an admin

1. Run the app (`npm run dev`) and **sign in once with your own account**. That first login auto-creates `users/{your-uid}` with `role: "viewer"`.
2. Firebase console → **Firestore Database → `users` collection** → find the doc whose `email` is yours.
3. Change `role` from `viewer` to `admin` and save.

The app picks this up live — the Edit buttons appear without a re-login. Do the same for anyone else you want to grant edit access later.

Everyone else just signs in; their `users` doc is created as `viewer` automatically on first login.

### 7. Deploy to Vercel

```bash
npx vercel
```

Vercel auto-detects Vite (build `npm run build`, output `dist`) — no `vercel.json` needed.

Then add the six `VITE_FIREBASE_*` variables in **Vercel dashboard → your project → Settings → Environment Variables**, for Production, Preview, and Development. Vite inlines them at build time, so they must exist before the build runs.

```bash
npx vercel --prod
```

Finally, back in Firebase console → **Authentication → Settings → Authorized domains**, add your `*.vercel.app` domain (and any custom domain), or sign-in will be rejected from the deployed site.

---

## Editing content

Click **Edit** on any tab.

- **Competitor / HireGlobal tabs** — stats are label/value pairs (add and remove rows as needed). The list sections are plain textareas: **one bullet per line**, blank lines ignored.
- **Objection Handling / Discovery tabs** — one textarea of raw HTML. Use `<h2>` for the amber section headings, `<h3>` for sub-headings, `<ol>`/`<ul>` for steps, and `<span class="req">Required</span>` for the amber Required badge.

Save writes straight to Firestore and everyone's open tab updates. Cancel discards.

## Local development

```bash
npm run dev
```

## Layout

```
firestore.rules            role-based access, enforced server-side
scripts/seedData.js        prototype content, the re-seed source of truth
scripts/seed.js            one-time Firestore populate (firebase-admin)
src/firebase.js            env-var config + browserLocalPersistence
src/hooks/useAuth.js       user + live role
src/hooks/useBattlecard.js two onSnapshot listeners + save actions
src/components/            LoginScreen, TabBar, StatGrid, ProfilePanel, DocPanel
src/index.css              the prototype's styles, ported intact
```

`ProfilePanel` serves both competitor and HireGlobal tabs — they're structurally identical, differing only in section titles and accent colors, passed in as a `lists` prop from `App.jsx`.
