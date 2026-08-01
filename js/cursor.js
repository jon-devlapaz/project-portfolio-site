/**
 * Custom cursor overlay — piyaz dialect (fine pointer + full motion only).
 * Modes: default ring (+ graph magnet), link, text, cta.
 * Graph magnet via window.__ambientGraphNearest(clientX, clientY).
 */
(function (global) {
  "use strict";

  const DOMAIN = {
    clinical: "#55b3ff",
    operational: "#ffbc33",
    technical: "#5fb87a",
  };

  function initCursor() {
    const Motion = global.PyzMotion;
    if (!Motion) return;

    const fine = window.matchMedia("(pointer: fine)");
    let canvas = document.getElementById("cursor-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "cursor-canvas";
      canvas.setAttribute("aria-hidden", "true");
      document.body.appendChild(canvas);
    }
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "60",
    });

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = {
      x: 0,
      y: 0,
      rawX: 0,
      rawY: 0,
      speed: 0,
      heading: 0,
      radius: 5,
      magnetT: 0,
      magnetId: null,
      magnetLabel: null,
      magnetColor: "#868a90",
      mode: "default",
      rect: null,
      down: false,
      seen: false,
    };

    let dpr = 1;
    let w = 0;
    let h = 0;
    let raf = 0;
    let active = false;
    let lastT = performance.now();
    let lastX = 0;
    let lastY = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function shouldRun() {
      return fine.matches && Motion.getMotionMode() === "full";
    }

    function syncActive() {
      const next = shouldRun();
      document.documentElement.classList.toggle("pyz-hide-cursor", next);
      canvas.style.display = next ? "block" : "none";
      if (next && !active) {
        active = true;
        lastT = performance.now();
        raf = requestAnimationFrame(frame);
      }
      if (!next && active) {
        active = false;
        cancelAnimationFrame(raf);
        ctx.clearRect(0, 0, w, h);
      }
    }

    function hitMode(el) {
      if (!el || el === document.documentElement || el === document.body) {
        return { mode: "default", rect: null };
      }
      const cursorAttr = el.closest?.("[data-cursor]")?.getAttribute("data-cursor");
      if (cursorAttr === "text") return { mode: "text", rect: null };
      if (cursorAttr === "cta" || el.closest?.(".btn-primary, .nav-links .btn-primary")) {
        const target = el.closest?.(".btn-primary, [data-cursor='cta']") || el;
        return { mode: "cta", rect: target.getBoundingClientRect() };
      }
      if (
        el.closest?.(
          "a, button, .expand-btn, .mobile-menu-toggle, [role='button']"
        )
      ) {
        return { mode: "link", rect: null };
      }
      if (el.closest?.("p, h1, h2, h3, li, .lede, .hero-subtitle, .about-text-column")) {
        return { mode: "text", rect: null };
      }
      return { mode: "default", rect: null };
    }

    function onMove(e) {
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      state.speed = Math.hypot(dx, dy) / (dt / 16);
      state.heading = Math.atan2(dy, dx);
      lastT = now;
      lastX = e.clientX;
      lastY = e.clientY;
      state.rawX = e.clientX;
      state.rawY = e.clientY;
      state.seen = true;

      const under = document.elementFromPoint(e.clientX, e.clientY);
      const hit = hitMode(under);
      state.mode = hit.mode;
      state.rect = hit.rect;

      if (state.mode === "default" && typeof global.__ambientGraphNearest === "function") {
        const near = global.__ambientGraphNearest(e.clientX, e.clientY);
        if (near && near.dist < 56) {
          state.magnetId = near.id;
          state.magnetLabel = near.label;
          state.magnetColor = near.color || DOMAIN[near.group] || "#868a90";
        } else {
          state.magnetId = null;
          state.magnetLabel = null;
        }
      } else {
        state.magnetId = null;
        state.magnetLabel = null;
      }
    }

    function roundRect(c, x, y, rw, rh, rad) {
      c.beginPath();
      c.moveTo(x + rad, y);
      c.arcTo(x + rw, y, x + rw, y + rh, rad);
      c.arcTo(x + rw, y + rh, x, y + rh, rad);
      c.arcTo(x, y + rh, x, y, rad);
      c.arcTo(x, y, x + rw, y, rad);
      c.closePath();
    }

    function frame() {
      if (!active) return;
      raf = requestAnimationFrame(frame);

      const magnetPos =
        state.magnetId && typeof global.__ambientGraphNodeScreen === "function"
          ? global.__ambientGraphNodeScreen(state.magnetId)
          : null;

      const targetX = magnetPos
        ? state.rawX * 0.35 + magnetPos.x * 0.65
        : state.rawX;
      const targetY = magnetPos
        ? state.rawY * 0.35 + magnetPos.y * 0.65
        : state.rawY;

      let tx = state.rawX;
      let ty = state.rawY;
      if (magnetPos) {
        tx = state.rawX * 0.4 + magnetPos.x * 0.6;
        ty = state.rawY * 0.4 + magnetPos.y * 0.6;
        state.magnetT += (1 - state.magnetT) * 0.12;
      } else {
        if (state.magnetId && !magnetPos) {
          state.magnetId = null;
          state.magnetLabel = null;
        }
        state.magnetT += (0 - state.magnetT) * 0.15;
      }

      state.x += (tx - state.x) * 0.28;
      state.y += (ty - state.y) * 0.28;

      ctx.clearRect(0, 0, w, h);
      if (!state.seen) return;

      if (state.mode === "cta" && state.rect) {
        const r = state.rect;
        ctx.strokeStyle = "#976b68";
        ctx.lineWidth = 1;
        roundRect(ctx, r.x + 2, r.y + 2, r.width - 4, r.height - 4, 8);
        ctx.stroke();
        ctx.fillStyle = "#f9f9f9";
        ctx.beginPath();
        ctx.arc(state.rawX, state.rawY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      if (state.mode === "link") {
        ctx.fillStyle = "#c2a4a1";
        ctx.beginPath();
        ctx.arc(state.rawX, state.rawY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      if (state.mode === "text") {
        ctx.strokeStyle = "#868a90";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(state.rawX, state.rawY - 7);
        ctx.lineTo(state.rawX, state.rawY + 7);
        ctx.stroke();
        return;
      }

      // default ring + optional magnet stretch
      ctx.save();
      ctx.translate(state.x, state.y);
      if (!state.magnetId && state.speed > 1) {
        const stretch = 1 + Math.min(0.5, state.speed / 45);
        ctx.rotate(state.heading);
        ctx.scale(stretch, 1 / stretch);
        ctx.rotate(-state.heading);
      }
      ctx.strokeStyle = state.magnetId ? state.magnetColor : "#868a90";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, state.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (state.magnetId && state.magnetLabel) {
        ctx.globalAlpha = Math.max(0, Math.min(1, state.magnetT));
        ctx.font = '11px "Geist Mono", ui-monospace, monospace';
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#cecece";
        ctx.fillText(
          state.magnetLabel,
          state.x + state.radius + 10,
          state.y
        );
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = "#cecece";
        ctx.beginPath();
        ctx.arc(state.x, state.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    resize();
    syncActive();
    window.addEventListener("resize", () => {
      resize();
      syncActive();
    });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener(
      "pointerdown",
      () => {
        state.down = true;
      },
      { passive: true }
    );
    window.addEventListener(
      "pointerup",
      () => {
        state.down = false;
      },
      { passive: true }
    );
    fine.addEventListener("change", syncActive);
    Motion.subscribeMotion(syncActive);
  }

  global.initCursor = initCursor;
})(typeof window !== "undefined" ? window : globalThis);
