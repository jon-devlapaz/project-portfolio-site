/**
 * Smooth scroll — Lenis 1.3.25 when motion mode is "full" (piyaz SmoothScroll).
 * duration 1.1, ease 1 - 2^(-10t); hash links offset -80.
 */
(function (global) {
  "use strict";

  function initSmoothScroll() {
    const Motion = global.PyzMotion;
    if (!Motion || typeof Lenis === "undefined") return;

    let lenis = null;
    let raf = 0;
    let unsub = null;

    function destroy() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    }

    function onClick(e) {
      if (!lenis) return;
      const a = e.target?.closest?.('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      // Preserve native fragment focus for the skip link.
      if (a.classList.contains("skip-link")) return;
      e.preventDefault();
      history.pushState(null, "", href);
      lenis.scrollTo(el, { offset: -80 });
    }

    function start() {
      destroy();
      if (Motion.getMotionMode() !== "full") return;
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => 1 - Math.pow(2, -10 * t),
      });
      document.documentElement.classList.add("lenis", "lenis-smooth");
      const loop = (t) => {
        lenis.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      document.addEventListener("click", onClick);
    }

    function restart() {
      document.removeEventListener("click", onClick);
      start();
    }

    start();
    unsub = Motion.subscribeMotion(restart);

    global.__pyzDestroySmoothScroll = () => {
      if (unsub) unsub();
      document.removeEventListener("click", onClick);
      destroy();
    };
  }

  global.initSmoothScroll = initSmoothScroll;
})(typeof window !== "undefined" ? window : globalThis);
