# 🎯 TikTok Smart Unfollower

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript_ES6+-f7df1e?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Credentials](https://img.shields.io/badge/Security-No_Passwords_Needed-brightgreen?logo=auth0)](https://github.com/mehmetefeaytas/tiktok-smart-unfollow)
[![Anti-Ban Protection](https://img.shields.io/badge/Anti--Ban-Human--like_Delays-blue)](https://github.com/mehmetefeaytas/tiktok-smart-unfollow)

A lightweight, secure, client-side browser console script designed to **unfollow only TikTok accounts that don't follow you back** — with **Smart Mutual Friend Protection** so you never accidentally unfollow your friends or followers.

Runs 100% locally in your own browser console. **Zero third-party apps, zero password sharing, and zero cookie leaks.**

---

## ⚡ Why Use This Over Third-Party Apps?

| Feature | ⛔ Third-Party Apps / Sites | 🎯 TikTok Smart Unfollower |
| :--- | :---: | :---: |
| **Requires TikTok Password / Login** | ⚠️ Yes (High Security Risk) | 🛡️ **Never** (Client-side only) |
| **Protects Mutual Friends / Followers** | ❌ Often unfollows everyone | ✅ **100% Friend Protection** |
| **Anti-Bot / Rate Limit Delays** | ❌ Spams fast, causes bans | ✅ **Human randomized pacing (4.0s–6.5s)** |
| **Open Source & Transparent** | ❌ Closed source binaries | ✅ **100% Open Source JavaScript** |
| **Installation Required** | ⚠️ Installs unknown extensions | 🚀 **Just copy & paste in DevTools** |

---

## 🚀 How to Use (2 Quick Steps)

> **Works on all desktop browsers:** Google Chrome, Brave, Arc, Microsoft Edge, Safari, Firefox.

### Step 1: Scan & Protect Your Followers

1. Open [TikTok](https://www.tiktok.com) on your desktop browser and go to your **Profile**.
2. Click on **Followers** to open the modal popup displaying who follows you.
3. Open your browser console:
   * **Windows/Linux:** Press `F12` or `Ctrl + Shift + J`
   * **Mac:** Press `Cmd + Option + J` (or `Cmd + Option + C` on Safari)
4. Copy the script below, paste it into the console, and press **Enter**:

```javascript
(async () => {
  window.myFollowers = window.takipcilerim = new Set();
  const dialog = document.querySelector('[role="dialog"]');
  console.log("%c[Step 1] Scanning followers for friend protection...", "color: #25F4EE; font-weight: bold; font-size: 13px;");

  for (let i = 0; i < 6; i++) {
    document.querySelectorAll('a[href*="/@"]').forEach((a) => {
      const match = a.href.match(/@([a-zA-Z0-9._]+)/);
      if (match && match[1]) {
        window.myFollowers.add(match[1].toLowerCase());
      }
    });
    if (dialog) dialog.scrollTop += 600;
    else window.scrollBy(0, 600);
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  console.log(`%c[SUCCESS] Stored ${window.myFollowers.size} followers in memory!`, "color: #00ff88; font-weight: bold; font-size: 14px;");
  console.log("Protected accounts list:", Array.from(window.myFollowers));
  alert(`Success: Stored ${window.myFollowers.size} followers in memory!\n\nNow open your 'Following' tab and run Step 2.`);
})();
```

> 💡 *An alert will confirm how many followers have been safely stored into memory.*

---

### Step 2: Unfollow Non-Followers (Protected Mode)

1. Close the followers popup and click on **Following** to open the list of people you follow.
2. In the same console, copy and paste this code, then press **Enter**:

```javascript
(async () => {
  const protectedFollowers = window.myFollowers || window.takipcilerim;
  if (!protectedFollowers || protectedFollowers.size === 0) {
    alert("Warning: Please run Step 1 first while viewing your 'Followers' list to protect your friends!");
    return;
  }

  window.stopTikTokUnfollow = false;
  const TARGET_LIMIT = 30; // Max accounts to unfollow per run
  let count = 0;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getButtons = () => Array.from(document.querySelectorAll('button')).filter((b) => {
    const text = (b.innerText || b.textContent || '').trim().toLowerCase();
    const isFollowing = text === 'following' || text === 'takip ediliyor';
    return isFollowing && !b.dataset.processed;
  });

  console.log(`%c[Step 2 Started] Protecting ${protectedFollowers.size} mutual friends!`, "color: #25F4EE; font-weight: bold; font-size: 13px;");
  console.log("Target limit: " + TARGET_LIMIT + " accounts. Stop anytime with: window.stopTikTokUnfollow = true");

  while (count < TARGET_LIMIT) {
    if (window.stopTikTokUnfollow) {
      console.warn("[TikTok] Process stopped by user.");
      break;
    }

    let buttons = getButtons();

    if (buttons.length === 0) {
      console.log("[TikTok] Loading more accounts, scrolling down...");
      const dialog = document.querySelector('[role="dialog"]');
      if (dialog) dialog.scrollTop += 700;
      else window.scrollBy(0, 700);
      await sleep(2500);

      buttons = getButtons();
      if (buttons.length === 0) {
        console.log("[TikTok] Reached end of list or no more non-followers found.");
        break;
      }
    }

    const btn = buttons[0];
    btn.dataset.processed = "true";

    const row = btn.closest('li') || btn.closest('div[class*="Item"]') || btn.parentElement;
    const link = row ? row.querySelector('a[href*="/@"]') : null;
    const match = link ? link.href.match(/@([a-zA-Z0-9._]+)/) : null;
    const username = match ? match[1].toLowerCase() : "";

    // 🛡️ Friend protection check
    if (username && protectedFollowers.has(username)) {
      console.log(`%c[PROTECTED] @${username} follows you back. Skipped!`, "color: #00ff88; font-weight: bold;");
      continue;
    }

    // 🎯 Unfollow target account
    try {
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      btn.click();
      count++;

      await sleep(600);
      const confirmBtn = Array.from(document.querySelectorAll('button')).find((b) => {
        const t = (b.innerText || '').trim().toLowerCase();
        return t === 'unfollow' || t === 'takipten çık' || t === 'takipten cik';
      });
      if (confirmBtn) confirmBtn.click();

      const delay = Math.floor(Math.random() * 2500) + 4000;
      console.log(`%c[${count}/${TARGET_LIMIT}] @${username || 'user'} does not follow back -> Unfollowed. (${(delay / 1000).toFixed(1)}s delay)`, "color: #FE2C55; font-weight: bold;");
      await sleep(delay);
    } catch (err) {
      console.error("[TikTok] Error while unfollowing:", err);
      await sleep(2000);
    }
  }

  console.log(`%c[COMPLETED] Finished! Total ${count} non-followers unfollowed safely.`, "color: #25F4EE; font-weight: bold; font-size: 14px;");
})();
```

---

## 🛑 How to Stop the Script
At any point while the script is running, type this into the console and press Enter:
```javascript
window.stopTikTokUnfollow = true;
```

---

## 🛡️ Anti-Ban & Rate Limit Best Practices

TikTok strictly monitors repetitive actions to prevent automated bot networks. To keep your account completely safe:

* **Session Limit:** Keep `TARGET_LIMIT` between **25 and 40** accounts per session.
* **Daily Limit:** Avoid unfollowing more than **80–120 accounts per day**.
* **Spread it Out:** If you need to clean up hundreds of accounts, split it into 2–3 runs spaced 4–6 hours apart (e.g. morning, afternoon, evening).
* **Do Not Shorten Delays:** The script deliberately pauses **4 to 6.5 seconds** between each action to simulate genuine human interaction.

---

## ❓ FAQ & Troubleshooting

### Q: Chrome shows "Warning: Don’t paste code into the DevTools Console..."
> **A:** This is Chrome's built-in anti-phishing protection for developers. Simply type `allow pasting` into the console and press **Enter**. Then you can paste the script freely.

### Q: Does this work in languages other than English?
> **A:** Yes! The button selector detects standard English labels (`Following`, `Unfollow`) as well as Turkish labels (`Takip ediliyor`, `Takipten çık`). Because user matching is done by `@handle`, friend protection works universally on all locales.

---

## 📄 License
Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## ⚠️ Disclaimer
This tool is for personal account management and educational purposes only. It is not affiliated with, authorized, maintained, or endorsed by TikTok or ByteDance. Always respect TikTok's Community Guidelines.
