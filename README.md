# Browser Lock

**Browser Lock** is a free Chrome extension that locks your whole browser with a master password. Every open tab is covered by a lock screen until you type the password, and your pages come back exactly as they were when you unlock.

It works fully offline, needs no account, and never touches your Google account, cookies or Chrome Sync.

This repository is the **website** for Browser Lock. People can download the extension from it, learn how to install it, and try a live demo without installing anything. It is a static site, built to be hosted on GitHub Pages.

---
check browser lock site here : https://okdarshann.github.io/Browser-lock-site/ 
---

## What the website has

| Page | What it is for |
|------|----------------|
| **Home** (`index.html`) | The `Browser-Lock.zip` download button comes first. Below it are the three install steps (download, unzip, load in Chrome), the main features, and a short FAQ. |
| **Live demo** (`demo.html`) | A clickable Chrome window that looks and behaves like the real extension. You set a password, watch every tab lock, then unlock it. |
| **About the site** | The home page explains why the extension is shared as a zip, what it does, and what it cannot do. |

### About the live demo

The demo is a simulation that runs only in your browser. It copies the real extension's look: the black theme, the 3D steel padlock that follows your mouse, and the shackle that swings open on unlock. It also reproduces the real settings page and lock screen, including:

- Creating a master password and answering the 3 security questions
- Locking every tab, including new tabs you open
- Unlocking with the password, with the shake animation and attempts counter on a wrong password
- **Change Password** and **Forgot Password?** (answer the 3 questions, then set a new password or just unlock)
- The toolbar icon, the `LOCK` badge and the `Alt+L` shortcut

Nothing you type in the demo is saved or sent anywhere.

---

## About the extension

### Features

- **Locks every tab.** Open tabs and new tabs show the lock screen. Your original pages are restored when you unlock.
- **Animated 3D padlock.** The lock follows your mouse, and the shackle lifts and swings open when you unlock. It respects the system's reduce-motion setting.
- **True black theme.** A high-contrast dark design built for privacy and comfort.
- **Locks on startup.** Close all windows of your Chrome profile and reopen Chrome, and the lock screen is waiting.
- **Quick lock and auto-lock.** Press `Alt + L` or click the toolbar icon to lock at once, or set an idle timer in settings.
- **Change password** from the lock screen or the settings page.
- **Forgot password?** Answer your 3 security questions to get back in. No email and no internet.
- **No interference with your Chrome account.** It uses only local and session storage.

### The 3 security questions

| # | Question | Answer type |
|---|----------|-------------|
| 1 | What would your other name be, if you had the chance to name yourself? | Text |
| 2 | Approximately how many years will you live in this world? | Whole number (1 to 4 digits) |
| 3 | Who is your crush? | Text |

Text answers ignore capital letters and extra spaces. Number answers ignore leading zeros. After 3 wrong tries, recovery is locked for 5 minutes, and each further lockout doubles up to 60 minutes. Choose answers you will still remember in a year, because they cannot be shown again, only replaced.

### Privacy and security

- Your password and your security answers are stored only as salted hashes (`PBKDF2`, `SHA-256`, 100,000 iterations) in your own Chrome profile.
- There is no network use at all. Nothing is sent anywhere.
- Permissions: `storage`, `tabs` and `idle` only.
- **Honest limitation:** like any extension-based lock, it stops casual access, not someone who can open `chrome://extensions` and remove it. Treat it as a privacy screen, not a vault. Security answers are also easier to guess than a good password, so pick answers other people could not guess.

---

## How to install the extension

You do not need the Chrome Web Store. Download a zip, unzip it, and load it.

1. **Download** `Browser-Lock.zip` from the website's home page.
2. **Unzip** it. You get a folder called `Browser-Lock` with `manifest.json` inside. Keep this folder, because Chrome runs the extension from it.
3. **Load it in Chrome:**
   - Open `chrome://extensions`
   - Turn on **Developer mode** (top right)
   - Click **Load unpacked** and choose the `Browser-Lock` folder

On Edge or Brave, open `edge://extensions` or `brave://extensions` instead. The settings page opens by itself so you can create your password. Pin the extension from the puzzle icon for one-click locking.

If Chrome shows a "Disable developer mode extensions" pop-up when it starts, dismiss it without choosing Disable.

---

## License

This project is licensed under the **MIT License**.
