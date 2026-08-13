document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  if (menuToggle && navLinks) {
    const pageMain = document.querySelector("main");
    const pageFooter = document.querySelector("footer");
    const setMenuOpen = (open, returnFocus = false) => {
      navLinks.classList.toggle("active", open);
      menuToggle.classList.toggle("active", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      document.body.style.overflow = open ? "hidden" : "";
      pageMain?.toggleAttribute("inert", open);
      pageFooter?.toggleAttribute("inert", open);
      if (returnFocus) menuToggle.focus();
    };

    menuToggle.addEventListener("click", () => {
      setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        setMenuOpen(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false, true);
      }
      if (event.key === "Tab" && menuToggle.getAttribute("aria-expanded") === "true") {
        const focusable = [menuToggle, ...navLinks.querySelectorAll("a[href], button:not([disabled])")];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 860 && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
      }
    });
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function wrapHeroWords() {
    document.querySelectorAll("[data-word-rise]").forEach((el) => {
      const nodes = [...el.childNodes];
      el.textContent = "";
      let wordIndex = 0;
      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const parts = node.textContent.split(/(\s+)/);
          parts.forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              el.appendChild(document.createTextNode(part));
              return;
            }
            const span = document.createElement("span");
            span.className = "pyz-rise-word";
            span.style.setProperty("--rise-delay", `${0.18 + wordIndex * 0.045}s`);
            span.textContent = part;
            el.appendChild(span);
            wordIndex += 1;
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const wrap = document.createElement("span");
          wrap.className = "pyz-rise-word";
          wrap.style.setProperty("--rise-delay", `${0.18 + wordIndex * 0.045}s`);
          // Keep brand-clip on the animated span (filter+clip don't nest well).
          if (node.classList && node.classList.contains("brand-clip")) {
            wrap.classList.add("brand-clip");
            wrap.textContent = node.textContent;
          } else {
            wrap.appendChild(node.cloneNode(true));
          }
          el.appendChild(wrap);
          wordIndex += 1;
        }
      });
    });
  }

  wrapHeroWords();

  const riseNodes = document.querySelectorAll(".pyz-rise, .pyz-rise-word");
  if (reduce) {
    riseNodes.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 }
    );
    riseNodes.forEach((el) => io.observe(el));

    // Hero words + blocks should play on load without waiting for scroll.
    document
      .querySelectorAll(".hero .pyz-rise, .hero .pyz-rise-word")
      .forEach((el) => {
        requestAnimationFrame(() => el.classList.add("is-visible"));
      });
  } else {
    riseNodes.forEach((el) => el.classList.add("is-visible"));
  }

  const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = sectionLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function setActiveNav() {
    if (!sections.length) return;
    const y = window.scrollY + 120;
    let current = null;
    for (const section of sections) {
      if (section.offsetTop <= y) current = section;
    }
    sectionLinks.forEach((a) => {
      const on = current && a.getAttribute("href") === `#${current.id}`;
      a.classList.toggle("is-active", on);
    });
  }

  if (sections.length) {
    setActiveNav();
    window.addEventListener("scroll", setActiveNav, { passive: true });
  }

  document.querySelectorAll(".expand-btn").forEach((btn, i) => {
    const expandable = btn.closest(".project-expandable");
    const details = expandable?.querySelector(".project-details");
    if (!details) return;
    if (!details.id) details.id = `project-details-${i + 1}`;
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", details.id);
    btn.addEventListener("click", function () {
      const open = details.classList.toggle("expanded");
      this.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        details.style.maxHeight = details.scrollHeight + 24 + "px";
        this.innerHTML = 'Show less <span class="expand-icon">-</span>';
      } else {
        details.style.maxHeight = "0px";
        this.innerHTML = 'Read more <span class="expand-icon">+</span>';
      }
    });
  });

  if (typeof initSmoothScroll === "function") {
    initSmoothScroll();
  }
  if (typeof initCursor === "function") {
    initCursor();
  }
  if (typeof initAmbientGraph === "function") {
    try {
      initAmbientGraph();
    } catch (err) {
      console.error("[ambient-graph]", err);
    }
  }

  // Motion hint when OS prefers reduce and override not set.
  const hint = document.getElementById("motion-hint");
  const Motion = window.PyzMotion;
  if (hint && Motion) {
    const show =
      Motion.getMotionMode() === "calm" && !Motion.isMotionHintDismissed();
    hint.hidden = !show;
    document.getElementById("motion-enable")?.addEventListener("click", () => {
      Motion.setFullMotionOverride(true);
      hint.hidden = true;
      // Re-init graph/scroll/cursor under full motion.
      location.reload();
    });
    document.getElementById("motion-dismiss")?.addEventListener("click", () => {
      Motion.dismissMotionHint();
      hint.hidden = true;
    });
  }
});
