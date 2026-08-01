/**
 * Motion mode — mirrors piyaz getMotionMode / calm vs full.
 * localStorage key "pyz-motion" === "full" overrides prefers-reduced-motion.
 */
(function (global) {
  "use strict";

  const KEY = "pyz-motion";
  const FULL = "full";
  const HINT = "pyz-motion-hint";
  const listeners = new Set();
  let mq = null;
  let overrideCache = null;

  function notify() {
    for (const fn of listeners) fn();
  }

  function ensureMq() {
    if (!mq) {
      mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", () => {
        syncMotionClass();
        notify();
      });
    }
    return mq;
  }

  function hasFullOverride() {
    if (overrideCache !== null) return overrideCache;
    try {
      return localStorage.getItem(KEY) === FULL;
    } catch {
      return false;
    }
  }

  function getMotionMode() {
    ensureMq();
    if (mq.matches) return hasFullOverride() ? "full" : "calm";
    return "full";
  }

  function useCalmMotion() {
    return getMotionMode() === "calm";
  }

  function syncMotionClass() {
    const full = getMotionMode() === "full";
    document.documentElement.classList.toggle("pyz-motion-full", full);
    document.documentElement.classList.toggle("pyz-motion-calm", !full);
  }

  function setFullMotionOverride(on) {
    overrideCache = !!on;
    try {
      if (on) localStorage.setItem(KEY, FULL);
      else localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    syncMotionClass();
    notify();
  }

  function isMotionHintDismissed() {
    try {
      return localStorage.getItem(HINT) === "1";
    } catch {
      return false;
    }
  }

  function dismissMotionHint() {
    try {
      localStorage.setItem(HINT, "1");
    } catch {
      /* ignore */
    }
    notify();
  }

  function subscribeMotion(fn) {
    ensureMq();
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  // Early class sync (also run from head snippet when present).
  syncMotionClass();
  ensureMq();

  global.PyzMotion = {
    getMotionMode,
    useCalmMotion,
    setFullMotionOverride,
    isMotionHintDismissed,
    dismissMotionHint,
    subscribeMotion,
  };
})(typeof window !== "undefined" ? window : globalThis);
