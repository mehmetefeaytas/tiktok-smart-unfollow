/**
 * TikTok Smart Unfollower - Step 2: Unfollow Non-Followers
 * 
 * Instructions:
 * 1. Switch to your "Following" tab on TikTok profile.
 * 2. Open Developer Console (F12 or Option + Cmd + J -> Console).
 * 3. Paste this code and press Enter.
 */
(async () => {
  const protectedFollowers = window.myFollowers || window.takipcilerim;
  if (!protectedFollowers || protectedFollowers.size === 0) {
    alert("Warning: Please run Step 1 first while viewing your 'Followers' list to protect your friends!");
    return;
  }

  window.stopTikTokUnfollow = false;
  const TARGET_LIMIT = 50; // Maximum accounts to unfollow per session
  let count = 0;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Dynamically find the real scrollable container of the modal
  function getScrollBox() {
    const dialog = document.querySelector('[role="dialog"]') || document.body;
    const scrollable = Array.from(dialog.querySelectorAll('*')).find((el) => {
      const s = window.getComputedStyle(el);
      return (s.overflowY === 'auto' || s.overflowY === 'scroll') && (el.scrollHeight > el.clientHeight);
    });
    return scrollable || window;
  }

  const getButtons = () => Array.from(document.querySelectorAll('button')).filter((b) => {
    const text = (b.innerText || b.textContent || '').trim().toLowerCase();
    const isFollowing = text === 'following' || text === 'takip ediliyor';
    return isFollowing && !b.dataset.processed;
  });

  const scrollBox = getScrollBox();
  console.log(`%c[Step 2 Started] Protecting ${protectedFollowers.size} mutual friends!`, "color: #25F4EE; font-weight: bold; font-size: 13px;");
  console.log("Target limit: " + TARGET_LIMIT + " accounts. Stop anytime with: window.stopTikTokUnfollow = true");

  while (count < TARGET_LIMIT) {
    if (window.stopTikTokUnfollow) {
      console.warn("[TikTok] Process stopped by user.");
      break;
    }

    let buttons = getButtons();

    // If visible buttons are exhausted, scroll the real container to load next batch
    if (buttons.length === 0) {
      console.log("[TikTok] Loading more accounts, scrolling list...");
      if (scrollBox === window) {
        window.scrollBy(0, 800);
      } else {
        scrollBox.scrollTop = scrollBox.scrollHeight;
        scrollBox.dispatchEvent(new Event('scroll', { bubbles: true }));
      }
      await sleep(3000); // Allow TikTok server to fetch next page

      buttons = getButtons();
      if (buttons.length === 0) {
        // Retry once more with a small nudge in case of slow network
        if (scrollBox !== window) {
          scrollBox.scrollTop = scrollBox.scrollHeight;
          scrollBox.dispatchEvent(new Event('scroll', { bubbles: true }));
        }
        await sleep(2500);
        buttons = getButtons();
        if (buttons.length === 0) {
          console.log("[TikTok] Reached end of list or no more non-followers found.");
          break;
        }
      }
    }

    const btn = buttons[0];
    btn.dataset.processed = "true";

    // Extract handle from the card row
    const row = btn.closest('li') || btn.closest('div[class*="Item"]') || btn.parentElement;
    const link = row ? row.querySelector('a[href*="/@"]') : null;
    const match = link ? link.href.match(/@([a-zA-Z0-9._]+)/) : null;
    const username = match ? match[1].toLowerCase() : "";

    // 🛡️ Mutual friend protection check
    if (username && protectedFollowers.has(username)) {
      console.log(`%c[PROTECTED] @${username} follows you back. Skipped!`, "color: #00ff88; font-weight: bold;");
      continue;
    }

    // 🎯 Unfollow target account
    try {
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      btn.click();
      count++;

      // Automatically handle confirmation popups if they appear
      await sleep(600);
      const confirmBtn = Array.from(document.querySelectorAll('button')).find((b) => {
        const t = (b.innerText || '').trim().toLowerCase();
        return t === 'unfollow' || t === 'takipten çık' || t === 'takipten cik';
      });
      if (confirmBtn) confirmBtn.click();

      // Human-like randomized delay (4.0s to 6.5s) to avoid bot flags
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
