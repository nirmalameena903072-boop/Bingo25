# Bingo 25 — Anlossa Group

A static-hosting SPA built with HTML, CSS, browser ES modules, and Firebase v10 CDN modules. There is no build step. Local bot play is available without Firebase or sign-in; all online features require a Firebase project.

## Run locally

Serve this directory over HTTP (ES modules do not load reliably from `file://`):

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. Deploy the directory as-is to GitHub Pages, Vercel static hosting, or another static host.

## Enable Firebase

1. Create a Firebase project, enable Google Authentication, and create a Realtime Database.
2. Replace the placeholder values at the top of `app.js` in `firebaseConfig`.
3. The primary owner UID is configured in `app.js` and `database.rules.json`; review it before deploying if this repository is forked. The owner profile is promoted by the app on sign-in, subject to the matching RTDB rule.
4. Publish the JSON rules in the Firebase Realtime Database Rules console. Restrict the authorized OAuth domain to the deployed site.

Never put Firebase Admin credentials in this static app. Firebase client API keys identify the project; authorization must come from RTDB rules.

## Important security boundary

This is a client-only static application. RTDB cannot securely provide all of the requested guarantees when clients run `runTransaction()` on an entire `/rooms/{roomId}` record: a transaction at that path requires participant read/write access to that path, which also exposes the nested board data and bypasses child-level rules beneath a granted parent. In addition, a browser client cannot be trusted to award RP, enforce opponent-farm limits, award disconnect forfeits, deliver redeem rewards, or append an audit entry immutably. The included rules are a restrictive starting point for the individual records, but the room transaction path and several client-mediated reward/staff flows need a trusted server (for example, callable Cloud Functions/Admin SDK) before this should be used for ranked or sensitive production play. Do not treat client-calculated wins, RP, or staff UI as authoritative.

The rules file contains the configured primary owner UID. Publish the updated rules to Firebase Realtime Database (the local JSON file does not change live Firebase rules by itself), then validate them with the Firebase Emulator Suite and test all intended user/staff cases.
