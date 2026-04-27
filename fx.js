// ============================================================
// High-impact animations: fly-to-cart, 3D tilt, page transitions,
// scramble numbers, marquee brands
// ============================================================

(function() {
  if (window.__fxInitialized) return;
  window.__fxInitialized = true;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================================
  // FLY TO CART — enhance the existing flyToCart by spawning a
  // sparkle burst on the cart icon when it lands.
  // ============================================================
  const _origFly = window.flyToCart;
  window.flyToCart = function(event) {
    if (typeof _origFly === 'function') _origFly(event);
    if (reduced) return;
    setTimeout(() => {
      const cartIcon = document.getElementById('header-cart-btn') || document.querySelector('[data-cart-target]');
      if (cartIcon) spawnSparkles(cartIcon);
    }, 750);
  };

  function spawnSparkles(target) {
    const rect = target.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('div');
      const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.3;
      const dist = 28 + Math.random() * 14;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      s.className = 'fx-sparkle';
      s.style.left = cx + 'px';
      s.style.top = cy + 'px';
      s.style.setProperty('--dx', dx + 'px');
      s.style.setProperty('--dy', dy + 'px');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 700);
    }
  }

  // ============================================================
  // 3D TILT on product cards — DISABLED per user preference.
  // ============================================================
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (false && supportsHover && !reduced) {
    let tiltRaf = null;
    let lastEvent = null;
    document.addEventListener('mousemove', (e) => {
      lastEvent = e;
      if (tiltRaf) return;
      tiltRaf = requestAnimationFrame(() => {
        tiltRaf = null;
        const ev = lastEvent;
        if (!ev) return;
        const card = ev.target.closest && ev.target.closest('.card.lift, .spot-card');
        if (!card) return;
        const r = card.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width;
        const py = (ev.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -3;
        const ry = (px - 0.5) * 3;
        card.style.setProperty('--tilt-x', rx + 'deg');
        card.style.setProperty('--tilt-y', ry + 'deg');
        card.classList.add('is-tilting');
      });
    }, { passive: true });
    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest && e.target.closest('.card.lift, .spot-card');
      if (!card) return;
      if (!card.contains(e.relatedTarget)) {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.classList.remove('is-tilting');
      }
    });
  }

  // ============================================================
  // PAGE TRANSITIONS — fade/slide when route changes.
  // Triggered by app code via window.__triggerPageTransition()
  // ============================================================
  window.__triggerPageTransition = () => {
    if (reduced) return;
    const m = document.querySelector('main');
    if (!m) return;
    const fc = m.firstElementChild;
    if (!fc) return;
    fc.classList.remove('page-enter');
    void fc.offsetWidth;
    fc.classList.add('page-enter');
  };

  // ============================================================
  // SCRAMBLE NUMBERS — animate when [data-scramble] text changes
  // (price changes etc.). Uses MutationObserver on textContent.
  // ============================================================
  // (Lightweight: also exposed as window.scrambleTo for explicit calls.)
  window.scrambleTo = function(el, finalText, dur = 600) {
    if (reduced) { el.textContent = finalText; return; }
    const chars = '0123456789';
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      let out = '';
      for (let i = 0; i < finalText.length; i++) {
        const ch = finalText[i];
        if (/[0-9]/.test(ch) && t < 1 - i / finalText.length) {
          out += chars[Math.floor(Math.random() * chars.length)];
        } else {
          out += ch;
        }
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = finalText;
    };
    requestAnimationFrame(tick);
  };

})();
