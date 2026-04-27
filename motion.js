// Motion utilities — IntersectionObserver reveals, counter, back-to-top, parallax.
// Initialized once on mount; re-runs when DOM changes (MutationObserver light).
(function() {
  if (window.__motionInitialized) return;
  window.__motionInitialized = true;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ====== Reveal observer ======
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  const observeReveals = () => {
    document.querySelectorAll('.reveal:not(.is-visible), .reveal-stagger:not(.is-visible), .reveal-left:not(.is-visible), .reveal-right:not(.is-visible), .reveal-zoom:not(.is-visible)').forEach(el => {
      revealIO.observe(el);
    });
  };

  // ====== Counter animation ======
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.counterTo);
      const dur = parseInt(el.dataset.counterDur || '1400', 10);
      const decimals = parseInt(el.dataset.counterDecimals || '0', 10);
      const prefix = el.dataset.counterPrefix || '';
      const suffix = el.dataset.counterSuffix || '';
      const useGrouping = el.dataset.counterGroup !== 'false';
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const v = target * eased;
        el.textContent = prefix + v.toLocaleString('es-CL', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping }) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.4 });

  const observeCounters = () => {
    document.querySelectorAll('[data-counter-to]:not([data-counter-done])').forEach(el => {
      el.dataset.counterDone = '1';
      el.classList.add('counter-num');
      el.textContent = (el.dataset.counterPrefix || '') + '0' + (el.dataset.counterSuffix || '');
      counterIO.observe(el);
    });
  };

  // ====== Back to top button ======
  const setupBackToTop = () => {
    if (document.querySelector('.btt')) return;
    const btn = document.createElement('button');
    btn.className = 'btt';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    btn.addEventListener('click', () => {
      // Try to scroll the closest scroll container if window is locked
      const scrollEl = document.scrollingElement || document.documentElement;
      scrollEl.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
    document.body.appendChild(btn);
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      btn.classList.toggle('is-visible', y > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  // ====== Parallax (subtle) ======
  const parallaxEls = () => document.querySelectorAll('.parallax-slow');
  const onParallaxScroll = () => {
    if (reduced) return;
    const y = window.scrollY || 0;
    parallaxEls().forEach(el => {
      const speed = parseFloat(el.dataset.parallaxSpeed || '0.15');
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
  };
  let parallaxRaf = null;
  window.addEventListener('scroll', () => {
    if (parallaxRaf) return;
    parallaxRaf = requestAnimationFrame(() => { onParallaxScroll(); parallaxRaf = null; });
  }, { passive: true });

  // ====== Init + observe DOM mutations (React rerenders) ======
  const init = () => {
    observeReveals();
    observeCounters();
    setupBackToTop();
  };

  // Initial pass when DOM ready (and after React mounts)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Watch for new reveal/counter elements added by React route changes
  const mo = new MutationObserver(() => {
    observeReveals();
    observeCounters();
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // Helper exposed for components that want to split a headline into words
  window.splitWords = (text, baseDelay = 0) => {
    return text.split(/\s+/).map((w, i) => ({
      word: w,
      style: { animationDelay: `${baseDelay + i * 0.08}s` }
    }));
  };

  // ====== Spotlight cursor on .spot-card ======
  document.addEventListener('mousemove', (e) => {
    if (reduced) return;
    const target = e.target.closest('.spot-card');
    if (!target) return;
    const r = target.getBoundingClientRect();
    target.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    target.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  // ====== Big cursor spotlight on .cat-grid-spot ======
  document.addEventListener('mousemove', (e) => {
    if (reduced) return;
    const target = e.target.closest('.cat-grid-spot');
    if (!target) return;
    const r = target.getBoundingClientRect();
    target.style.setProperty('--spot-x', (e.clientX - r.left) + 'px');
    target.style.setProperty('--spot-y', (e.clientY - r.top) + 'px');
  });

  // ====== Magnetic hover on [data-magnetic] ======
  let magnetTarget = null;
  let magnetRect = null;
  document.addEventListener('mouseover', (e) => {
    if (reduced) return;
    const t = e.target.closest('[data-magnetic]');
    if (!t || t === magnetTarget) return;
    magnetTarget = t;
    magnetRect = t.getBoundingClientRect();
  });
  document.addEventListener('mousemove', (e) => {
    if (reduced || !magnetTarget) return;
    const r = magnetRect;
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    const strength = parseFloat(magnetTarget.dataset.magnetic) || 8;
    magnetTarget.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  });
  document.addEventListener('mouseout', (e) => {
    if (!magnetTarget) return;
    if (e.target === magnetTarget || (magnetTarget.contains && !magnetTarget.contains(e.relatedTarget))) {
      magnetTarget.style.transform = '';
      magnetTarget = null;
      magnetRect = null;
    }
  });

  // ====== Promo countdown timer (handled in React) ======
})();
