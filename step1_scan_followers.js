/**
 * TikTok Smart Unfollower - Step 1: Scan Followers
 * 
 * Instructions:
 * 1. Open your TikTok profile in any desktop browser (Chrome, Brave, Edge, Safari).
 * 2. Click "Followers" to open your followers popup modal.
 * 3. Open Developer Console (F12 or Option + Cmd + J -> Console).
 * 4. Paste this code and press Enter.
 */
(async () => {
  window.myFollowers = window.takipcilerim = new Set();
  
  // Find the exact inner scrollable element inside the modal
  const dialog = document.querySelector('[role="dialog"]') || document.body;
  const scrollBox = Array.from(dialog.querySelectorAll('*')).find((el) => {
    const s = window.getComputedStyle(el);
    return (s.overflowY === 'auto' || s.overflowY === 'scroll') && (el.scrollHeight > el.clientHeight);
  }) || window;

  console.log("%c[Step 1] Scanning followers for friend protection...", "color: #25F4EE; font-weight: bold; font-size: 13px;");

  // Scroll down smoothly to collect all visible follower handles
  for (let i = 0; i < 8; i++) {
    document.querySelectorAll('a[href*="/@"]').forEach((a) => {
      const match = a.href.match(/@([a-zA-Z0-9._]+)/);
      if (match && match[1]) {
        window.myFollowers.add(match[1].toLowerCase());
      }
    });
    
    if (scrollBox === window) {
      window.scrollBy(0, 800);
    } else {
      scrollBox.scrollTop = scrollBox.scrollHeight;
      scrollBox.dispatchEvent(new Event('scroll', { bubbles: true }));
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  console.log(`%c[SUCCESS] Stored ${window.myFollowers.size} followers in memory!`, "color: #00ff88; font-weight: bold; font-size: 14px;");
  console.log("Protected accounts list:", Array.from(window.myFollowers));
  alert(`Success: Stored ${window.myFollowers.size} followers in memory!\n\nNow open your 'Following' tab and run Step 2.`);
})();
