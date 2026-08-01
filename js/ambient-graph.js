/**
 * Ambient Graph — ForceGraph (vasturiano) backdrop with portfolio Skill Content.
 *
 * Library handles physics + render. We own: section director camera, pointer
 * aliveness, calm demotion, cursor-magnet hooks. Canvas stays non-blocking
 * (pointer-events: none); pointer is read from window.
 */
(function (global) {
  "use strict";

  const DOMAIN = {
    clinical: "#55b3ff",
    operational: "#ffbc33",
    technical: "#5fb87a",
  };
  const NOTE_COLOR = {
    reference: "#55b3ff",
    guidance: "#ffbc33",
    knowledge: "#9a7bc4",
  };
  const RELATES = "#9a7bc4";
  const SURFACE = "rgba(7, 8, 10, 0.9)";

  const HUBS = new Set([
    "Python",
    "PA Operations",
    "Workflow Translation",
    "RAG / AI Agents",
    "Clinical Policy",
  ]);
  const BRIDGE = new Set([
    "PA Operations",
    "RAG / AI Agents",
    "Workflow Translation",
  ]);

  const SECTION_CAMERA = {
    home: "hero",
    about: "clinical-ops",
    experience: "clinical-ops",
    projects: "bridge",
    skills: "whole-tight",
    contact: "settle",
  };

  const GRAPH = {
    nodes: [
      { id: "RN License", group: "clinical" },
      { id: "PA Operations", group: "clinical" },
      { id: "UM Review", group: "clinical" },
      { id: "Clinical Policy", group: "clinical" },
      { id: "MCO Workflows", group: "clinical" },
      { id: "CMS Regs", group: "clinical" },
      { id: "Prior Auth Criteria", group: "clinical", kind: "sat", hollow: true },
      { id: "TMPPM", group: "clinical", kind: "sat" },
      { id: "DME Review", group: "clinical", kind: "sat", hollow: true },
      { id: "PDN Review", group: "clinical", kind: "sat", hollow: true },
      { id: "Python", group: "technical" },
      { id: "Flask", group: "technical" },
      { id: "RAG / AI Agents", group: "technical" },
      { id: "Prompt Eng", group: "technical" },
      { id: "Context Engineering", group: "technical" },
      { id: "Agent Harnesses", group: "technical" },
      { id: "Evals", group: "technical" },
      { id: "RPA / Automation", group: "technical" },
      { id: "Data Viz", group: "technical" },
      { id: "Copilot Studio", group: "technical", kind: "sat" },
      { id: "Power Automate", group: "technical", kind: "sat", hollow: true },
      { id: "Excel Automation", group: "technical", kind: "sat", hollow: true },
      { id: "PySimpleGUI", group: "technical", kind: "sat", hollow: true },
      { id: "Algorithm Design", group: "technical", kind: "sat" },
      { id: "Local Models", group: "technical", kind: "sat" },
      { id: "LLM Wikis", group: "technical", kind: "sat" },
      { id: "Coding Agents", group: "technical", kind: "sat" },
      { id: "MCP / Tool Use", group: "technical", kind: "sat", hollow: true },
      { id: "Multi-Agent Workflows", group: "technical", kind: "sat" },
      { id: "Agent Memory", group: "technical", kind: "sat", hollow: true },
      { id: "Team Supervision", group: "operational" },
      { id: "Process Design", group: "operational" },
      { id: "SLA Management", group: "operational" },
      { id: "Workflow Translation", group: "operational" },
      { id: "Training Dev", group: "operational" },
      { id: "Quality Review", group: "operational", kind: "sat" },
      { id: "Escalation Routing", group: "operational", kind: "sat", hollow: true },
      { id: "Staffing Models", group: "operational", kind: "sat" },
      { id: "Adoption Coaching", group: "operational", kind: "sat", hollow: true },
      { id: "TMPPM Notes", group: "clinical", kind: "note", noteType: "reference" },
      { id: "PA Playbook", group: "operational", kind: "note", noteType: "guidance" },
      { id: "Agent Guardrails", group: "technical", kind: "note", noteType: "knowledge" },
      { id: "PHI Boundary", group: "technical", kind: "note", noteType: "guidance" },
    ],
    links: [
      { source: "RN License", target: "PA Operations", value: 1 },
      { source: "PA Operations", target: "MCO Workflows", value: 1 },
      { source: "PA Operations", target: "UM Review", value: 1 },
      { source: "Clinical Policy", target: "CMS Regs", value: 1 },
      { source: "Clinical Policy", target: "TMPPM", value: 1 },
      { source: "UM Review", target: "Prior Auth Criteria", value: 1 },
      { source: "UM Review", target: "DME Review", value: 1 },
      { source: "UM Review", target: "PDN Review", value: 1 },
      { source: "Python", target: "RAG / AI Agents", value: 1 },
      { source: "Python", target: "RPA / Automation", value: 1 },
      { source: "Python", target: "Flask", value: 1 },
      { source: "Python", target: "Algorithm Design", value: 1 },
      { source: "Flask", target: "Data Viz", value: 1 },
      { source: "Flask", target: "PySimpleGUI", value: 1 },
      { source: "RAG / AI Agents", target: "Prompt Eng", value: 1 },
      { source: "RAG / AI Agents", target: "Copilot Studio", value: 1 },
      { source: "RAG / AI Agents", target: "Context Engineering", value: 1 },
      { source: "RAG / AI Agents", target: "Agent Harnesses", value: 1 },
      { source: "RAG / AI Agents", target: "Evals", value: 1 },
      { source: "RAG / AI Agents", target: "Local Models", value: 1 },
      { source: "RAG / AI Agents", target: "LLM Wikis", value: 1 },
      { source: "RAG / AI Agents", target: "Coding Agents", value: 1 },
      { source: "RAG / AI Agents", target: "MCP / Tool Use", value: 1 },
      { source: "RAG / AI Agents", target: "Multi-Agent Workflows", value: 1 },
      { source: "RAG / AI Agents", target: "Agent Memory", value: 1 },
      { source: "Prompt Eng", target: "Context Engineering", value: 1 },
      { source: "Python", target: "Coding Agents", value: 1 },
      { source: "Context Engineering", target: "Agent Memory", value: 1 },
      { source: "Agent Harnesses", target: "Evals", value: 1 },
      { source: "Agent Harnesses", target: "MCP / Tool Use", value: 1 },
      { source: "RPA / Automation", target: "Power Automate", value: 1 },
      { source: "RPA / Automation", target: "Excel Automation", value: 1 },
      { source: "Process Design", target: "Workflow Translation", value: 1 },
      { source: "Team Supervision", target: "SLA Management", value: 1 },
      { source: "Team Supervision", target: "Quality Review", value: 1 },
      { source: "Team Supervision", target: "Escalation Routing", value: 1 },
      { source: "Team Supervision", target: "Staffing Models", value: 1 },
      { source: "Training Dev", target: "Adoption Coaching", value: 1 },
      { source: "PA Operations", target: "Python", value: 2 },
      { source: "PA Operations", target: "RAG / AI Agents", value: 2 },
      { source: "PA Operations", target: "RPA / Automation", value: 2 },
      { source: "Clinical Policy", target: "RAG / AI Agents", value: 2 },
      { source: "Clinical Policy", target: "Prompt Eng", value: 1 },
      { source: "RN License", target: "Data Viz", value: 1 },
      { source: "UM Review", target: "Python", value: 1 },
      { source: "MCO Workflows", target: "Flask", value: 1 },
      { source: "Python", target: "Process Design", value: 2 },
      { source: "Python", target: "SLA Management", value: 1 },
      { source: "RAG / AI Agents", target: "Training Dev", value: 1 },
      { source: "RPA / Automation", target: "Workflow Translation", value: 2 },
      { source: "Data Viz", target: "Team Supervision", value: 1 },
      { source: "Flask", target: "SLA Management", value: 1 },
      { source: "PA Operations", target: "Team Supervision", value: 2 },
      { source: "PA Operations", target: "Workflow Translation", value: 2 },
      { source: "CMS Regs", target: "Process Design", value: 1 },
      { source: "Clinical Policy", target: "Training Dev", value: 1 },
      { source: "UM Review", target: "Workflow Translation", value: 1 },
      { source: "Copilot Studio", target: "Clinical Policy", value: 2 },
      { source: "Staffing Models", target: "Python", value: 2 },
      { source: "Quality Review", target: "Data Viz", value: 1 },
      { source: "TMPPM Notes", target: "Clinical Policy", value: 1 },
      { source: "PA Playbook", target: "PA Operations", value: 1 },
      { source: "Agent Guardrails", target: "RAG / AI Agents", value: 1 },
      { source: "PHI Boundary", target: "RPA / Automation", value: 1 },
      { source: "PHI Boundary", target: "PA Operations", value: 2 },
    ],
  };

  function detectTier() {
    const calm =
      typeof global.PyzMotion !== "undefined"
        ? global.PyzMotion.useCalmMotion()
        : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    return { calm, coarse, narrow, live: !calm };
  }

  function nodeColor(n) {
    if (n.kind === "note") return NOTE_COLOR[n.noteType] || NOTE_COLOR.reference;
    return DOMAIN[n.group] || "#868a90";
  }

  function nodeRadius(n, counts) {
    if (n.kind === "sat" || n.kind === "note") return 5;
    const c = counts.get(n.id) || 0;
    if (c >= 7 || HUBS.has(n.id)) return 11;
    if (c >= 4) return 8;
    return 6;
  }

  function initAmbientGraph() {
    if (typeof ForceGraph === "undefined") return;

    let el = document.getElementById("ambient-graph");
    if (!el) {
      // Back-compat: replace legacy canvas if present.
      const legacy = document.getElementById("ambient-graph-canvas");
      el = document.createElement("div");
      el.id = "ambient-graph";
      el.setAttribute("aria-hidden", "true");
      if (legacy && legacy.parentNode) {
        legacy.parentNode.replaceChild(el, legacy);
      } else {
        document.body.prepend(el);
      }
    }

    Object.assign(el.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      zIndex: "0",
      pointerEvents: "none",
    });

    let tier = detectTier();
    let hoverId = null;
    let neighborIds = new Set();
    let pointer = { x: 0, y: 0, active: false };
    let targetCam = {
      focus: null,
      dim: false,
      zoom: 1.05,
      offsetX: 0.26,
      offsetY: 0.04,
    };
    let story = { pathLit: 0, decayT: 0, edgeFade: 0, progress: 0 };
    let width = window.innerWidth;
    let height = window.innerHeight;
    let counts = new Map();
    let adj = new Map();

    const data = {
      nodes: GRAPH.nodes.map((n) => ({ ...n })),
      links: GRAPH.links.map((l) => ({ ...l })),
    };

    function rebuildMeta() {
      counts = new Map();
      adj = new Map();
      for (const l of data.links) {
        const s = typeof l.source === "object" ? l.source.id : l.source;
        const t = typeof l.target === "object" ? l.target.id : l.target;
        counts.set(s, (counts.get(s) || 0) + 1);
        counts.set(t, (counts.get(t) || 0) + 1);
        if (!adj.has(s)) adj.set(s, new Set());
        if (!adj.has(t)) adj.set(t, new Set());
        adj.get(s).add(t);
        adj.get(t).add(s);
      }
    }
    rebuildMeta();

    let graph = null;

    function linkIsHot(l) {
      const s = typeof l.source === "object" ? l.source.id : l.source;
      const t = typeof l.target === "object" ? l.target.id : l.target;
      return (
        !!hoverId &&
        (s === hoverId ||
          t === hoverId ||
          (neighborIds.has(s) && neighborIds.has(t)))
      );
    }

    function particleCountFor(l) {
      if (!tier.live) return 0;
      if (linkIsHot(l)) return l.value === 2 ? 5 : 3;
      if (l.value === 2) return story.pathLit > 0.2 ? 3 : 1;
      return 0;
    }

    function particleSpeedFor(l) {
      if (linkIsHot(l)) return 0.012;
      return 0.004;
    }

    function paintNode(n, ctx, globalScale) {
      if (!Number.isFinite(n.x) || !Number.isFinite(n.y)) return;
      const isFocus = n.id === hoverId;
      const pulse =
        isFocus && tier.live
          ? 1 + 0.07 * Math.sin(performance.now() * 0.0055)
          : 1;
      const r = Math.max(
        0.5,
        nodeRadius(n, counts) *
          (isFocus ? 1.22 : neighborIds.has(n.id) ? 1.1 : 1) *
          pulse
      );
      const color = nodeColor(n);
      const inFocus =
        !targetCam.focus ||
        !targetCam.focus.length ||
        targetCam.focus.includes(n.id) ||
        (targetCam.focus &&
          targetCam.focus.some((id) => adj.get(id)?.has(n.id)));
      let alpha = 1;
      if (targetCam.dim && !inFocus) alpha *= 0.22;
      if (story.decayT > 0 && !inFocus) alpha *= 1 - story.decayT * 0.45;
      if (hoverId && n.id !== hoverId && !neighborIds.has(n.id)) alpha *= 0.35;

      ctx.save();
      ctx.globalAlpha = Math.max(0.08, alpha);

      if (tier.live && n.kind !== "sat" && n.kind !== "note") {
        const haloR = r * (isFocus ? 3.8 : 3.2);
        const g = ctx.createRadialGradient(n.x, n.y, r * 0.2, n.x, n.y, haloR);
        g.addColorStop(0, color + (isFocus ? "55" : "33"));
        g.addColorStop(1, color + "00");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, haloR, 0, Math.PI * 2);
        ctx.fill();
      }

      if (n.kind === "note") {
        const side = r * 1.8;
        const x = n.x - side / 2;
        const y = n.y - side / 2;
        const rad = Math.min(2.5 / globalScale, side / 2);
        ctx.beginPath();
        ctx.moveTo(x + rad, y);
        ctx.arcTo(x + side, y, x + side, y + side, rad);
        ctx.arcTo(x + side, y + side, x, y + side, rad);
        ctx.arcTo(x, y + side, x, y, rad);
        ctx.arcTo(x, y, x + side, y, rad);
        ctx.closePath();
        ctx.fillStyle = color + "99";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1 / globalScale;
        ctx.stroke();
      } else if (n.hollow) {
        ctx.beginPath();
        ctx.fillStyle = color + "14";
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.setLineDash([2 / globalScale, 3 / globalScale]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.25 / globalScale;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(n.x, n.y, r * 0.28, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const body = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r);
        body.addColorStop(0, color + "cc");
        body.addColorStop(1, color + "22");
        ctx.beginPath();
        ctx.fillStyle = body;
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1 / globalScale;
        ctx.stroke();
        if (!n.kind) {
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.arc(n.x, n.y, r * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const showLabel =
        n.id === hoverId ||
        neighborIds.has(n.id) ||
        HUBS.has(n.id) ||
        (targetCam.focus && targetCam.focus.includes(n.id));
      if (showLabel) {
        const fontSize =
          (n.kind === "sat" || n.kind === "note" ? 10 : 12) / globalScale;
        ctx.font = `500 ${fontSize}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.lineWidth = 3 / globalScale;
        ctx.strokeStyle = SURFACE;
        ctx.strokeText(n.id, n.x, n.y + r + 3 / globalScale);
        ctx.fillStyle = "#f9f9f9";
        ctx.fillText(n.id, n.x, n.y + r + 3 / globalScale);
      }
      ctx.restore();
    }

    graph = ForceGraph()(el)
      .width(width)
      .height(height)
      .backgroundColor("rgba(0,0,0,0)")
      .graphData(data)
      .nodeId("id")
      .nodeVal((n) => nodeRadius(n, counts))
      .nodeRelSize(1)
      .linkSource("source")
      .linkTarget("target")
      .enableZoomInteraction(false)
      .enablePanInteraction(false)
      .enableNodeDrag(false)
      .enablePointerInteraction(false)
      .warmupTicks(tier.calm ? 80 : 180)
      .cooldownTicks(tier.calm ? 0 : Infinity)
      .cooldownTime(tier.calm ? 0 : Infinity)
      .d3AlphaMin(tier.calm ? 0.001 : 0)
      .d3AlphaDecay(tier.calm ? 0.08 : 0.012)
      .d3VelocityDecay(tier.calm ? 0.4 : 0.25)
      .linkDirectionalArrowLength((l) => (l.value === 2 ? 4.5 : 0))
      .linkDirectionalArrowRelPos(1)
      .linkDirectionalParticles(particleCountFor)
      .linkDirectionalParticleWidth((l) => (linkIsHot(l) ? 2.2 : 1.6))
      .linkDirectionalParticleSpeed(particleSpeedFor)
      .linkDirectionalParticleColor((l) => {
        const s = typeof l.source === "object" ? l.source : { group: "clinical" };
        return DOMAIN[s.group] || RELATES;
      })
      .linkWidth((l) => {
        const hot = linkIsHot(l);
        const s = typeof l.source === "object" ? l.source.id : l.source;
        const t = typeof l.target === "object" ? l.target.id : l.target;
        const bridge =
          l.value === 2 && (BRIDGE.has(s) || BRIDGE.has(t)) ? story.pathLit : 0;
        return (l.value === 2 ? 1.5 : 0.9) + (hot ? 1.2 : 0) + bridge * 1.1;
      })
      .linkColor((l) => {
        const hot = linkIsHot(l);
        if (hoverId && !hot) return "rgba(154,123,196,0.12)";
        if (l.value === 2) {
          const src = typeof l.source === "object" ? l.source : null;
          const col = DOMAIN[src?.group] || "#55b3ff";
          return hot ? col : col + "99";
        }
        return hot ? RELATES : "rgba(154,123,196,0.45)";
      })
      .linkLineDash((l) => (l.value === 2 ? null : [4, 6]))
      .nodeCanvasObjectMode(() => "replace")
      .nodeCanvasObject(paintNode);

    // Softer forces for ambient density.
    graph.d3Force("charge")?.strength((n) =>
      n.kind === "sat" || n.kind === "note" ? -80 : -180
    );
    graph.d3Force("link")?.distance((l) => {
      const s = typeof l.source === "object" ? l.source : {};
      const t = typeof l.target === "object" ? l.target : {};
      if (s.kind === "sat" || s.kind === "note" || t.kind === "sat" || t.kind === "note")
        return 42;
      return l.value === 2 ? 90 : 70;
    });

    // Continuous ambient drift — slow wander so the graph never freezes.
    // Once alpha cools to a soft simmer, freeze decay so forces stay gently alive
    // without d3ReheatSimulation() jolts (this CDN build has no d3AlphaTarget).
    let simmerLocked = false;
    function unlockSimmer() {
      simmerLocked = false;
      if (graph && tier.live) graph.d3AlphaDecay(0.012);
    }

    graph.d3Force("drift", (alpha) => {
      if (!tier.live || !graph) return;
      if (!simmerLocked && alpha > 0 && alpha < 0.05) {
        simmerLocked = true;
        graph.d3AlphaDecay(0);
      }
      const t = performance.now() * 0.00012;
      const amp = 0.022 * Math.max(alpha, 0.04);
      for (const n of graph.graphData().nodes) {
        if (!Number.isFinite(n.x) || !Number.isFinite(n.y)) continue;
        const seed = (n.index ?? 0) * 1.618;
        n.vx += Math.sin(t + seed) * amp;
        n.vy += Math.cos(t * 1.13 + seed * 1.7) * amp;
      }
    });

    // Soft mouse gravity well — attract nearby nodes; release = spring rebound.
    graph.d3Force("pointer", (alpha) => {
      if (!pointer.active || !tier.live || !graph || !graphInteractive()) return;
      const a = Math.max(alpha, 0.04);
      const reach = 220;
      const reach2 = reach * reach;
      for (const n of graph.graphData().nodes) {
        if (!Number.isFinite(n.x) || !Number.isFinite(n.y)) continue;
        const dx = pointer.x - n.x;
        const dy = pointer.y - n.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > reach2 || d2 < 4) continue;
        const d = Math.sqrt(d2);
        const fall = 1 - d / reach;
        // Quadratic falloff keeps the well soft at the edges.
        const f = 0.1 * a * fall * fall;
        n.vx += (dx / d) * f * 32;
        n.vy += (dy / d) * f * 32;
      }
    });

    if (tier.live) {
      graph.d3ReheatSimulation();
    }

    function sections() {
      const withAttr = [...document.querySelectorAll("[data-camera]")];
      if (withAttr.length) return withAttr;
      return Object.keys(SECTION_CAMERA)
        .map((id) => document.getElementById(id))
        .filter(Boolean);
    }

    function cameraModeFor(el) {
      if (el?.dataset?.camera) return el.dataset.camera;
      return (el?.id && SECTION_CAMERA[el.id]) || "hero";
    }

    function isMidline(el) {
      const r = el.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      return r.top <= mid && r.bottom >= mid;
    }

    function easeProgress(o) {
      const t = Math.max(0, Math.min(1, o));
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function sectionProgress(el) {
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      return Math.max(0, Math.min(1, (mid - r.top) / Math.max(r.height, 1)));
    }

    // Exit dissolve: as #contact rises into view, fade the backdrop to nothing
    // so closing copy sits alone. Fully gone before the footer.
    function exitDissolveT() {
      const contact = document.getElementById("contact");
      if (!contact) return 0;
      const r = contact.getBoundingClientRect();
      const vh = window.innerHeight;
      // Contact top at ~88% vh → start; at ~42% vh → fully dissolved.
      const start = vh * 0.88;
      const end = vh * 0.42;
      let t;
      if (r.top >= start) t = 0;
      else if (r.top <= end) t = 1;
      else t = 1 - (r.top - end) / (start - end);
      if (tier.calm) return t > 0.35 ? 1 : 0;
      return easeProgress(t);
    }

    function applyExitDissolve() {
      const t = exitDissolveT();
      story.edgeFade = t;
      el.style.opacity = String(1 - t);
      if (t > 0.45) {
        // Graph is exiting — kill hover, magnet, and particles so nothing
        // remains interactive over the closing copy.
        if (hoverId) setHover(null);
        pointer.active = false;
        graph.linkDirectionalParticles(0);
      }
    }

    function graphInteractive() {
      return story.edgeFade < 0.45;
    }

    function focusIdsFor(mode) {
      if (mode === "clinical-ops") {
        return data.nodes
          .filter(
            (n) =>
              n.kind !== "sat" &&
              n.kind !== "note" &&
              (n.group === "clinical" || n.group === "operational") &&
              HUBS.has(n.id)
          )
          .map((n) => n.id);
      }
      if (mode === "bridge") return [...BRIDGE];
      return null;
    }

    function applyCameraFromMidline(ms) {
      const panels = sections();
      const active = panels.find(isMidline) || panels[0];
      const mode = cameraModeFor(active);
      const narrow = tier.narrow;
      const rawP = sectionProgress(active);
      const p = tier.calm ? (rawP > 0.5 ? 1 : 0) : easeProgress(rawP);

      let focus = null;
      let dim = false;
      let zoom = 1.05;
      let offsetX = 0.26;
      let offsetY = 0.04;
      let pathLit = 0;
      let decayT = 0;

      if (mode === "hero") {
        zoom = narrow ? 0.9 : 1.1;
        offsetX = narrow ? 0.06 : 0.28;
        offsetY = narrow ? 0.16 : 0.02;
      } else if (mode === "clinical-ops") {
        focus = focusIdsFor(mode);
        dim = true;
        zoom = narrow ? 1.35 : 1.65;
        offsetX = narrow ? 0.05 : 0.2;
        decayT = p;
      } else if (mode === "bridge") {
        focus = focusIdsFor(mode);
        dim = true;
        zoom = narrow ? 1.45 : 1.85;
        offsetX = narrow ? 0.04 : 0.16;
        pathLit = tier.calm ? 1 : p;
      } else if (mode === "whole-tight") {
        zoom = narrow ? 1.05 : 1.3;
        offsetX = narrow ? 0.05 : 0.18;
      } else if (mode === "settle") {
        zoom = 0.92;
        offsetX = narrow ? 0.04 : 0.16;
        offsetY = 0.08;
      }

      targetCam = { focus, dim, zoom, offsetX, offsetY };
      story = { pathLit, decayT, edgeFade: 0, progress: p };

      const nodes = graph.graphData().nodes;
      let pool = nodes;
      if (focus && focus.length) {
        const set = new Set(focus);
        const expanded = new Set(focus);
        for (const id of focus) {
          const ns = adj.get(id);
          if (ns) for (const n of ns) expanded.add(n);
        }
        pool = nodes.filter((n) => expanded.has(n.id));
        if (!pool.length) pool = nodes;
      }

      let cx = 0;
      let cy = 0;
      for (const n of pool) {
        cx += n.x || 0;
        cy += n.y || 0;
      }
      cx /= pool.length;
      cy /= pool.length;

      const dur = ms == null ? (tier.calm ? 0 : 650) : ms;
      const k = zoom;
      // Shift framing so copy sits in the left scrim.
      graph.centerAt(cx - (offsetX * width) / k, cy - (offsetY * height) / k, dur);
      graph.zoom(k, dur);
      applyExitDissolve();
      if (story.edgeFade <= 0.92) refreshParticles();
    }

    function refreshParticles() {
      if (!graph) return;
      if (!tier.live) {
        graph.linkDirectionalParticles(0);
        return;
      }
      graph.linkDirectionalParticles(particleCountFor);
      graph.linkDirectionalParticleSpeed(particleSpeedFor);
      graph.linkDirectionalParticleWidth((l) => (linkIsHot(l) ? 2.2 : 1.6));
    }

    function setHover(id) {
      if (hoverId === id) return;

      hoverId = id || null;
      neighborIds = new Set();
      if (id && adj.has(id)) {
        for (const n of adj.get(id)) neighborIds.add(n);
      }
      refreshParticles();
    }

    function onPointerMove(e) {
      if (!graphInteractive()) {
        pointer.active = false;
        setHover(null);
        return;
      }
      const pt = graph.screen2GraphCoords(e.clientX, e.clientY);
      pointer.x = pt.x;
      pointer.y = pt.y;
      pointer.active = tier.live && !tier.coarse;

      if (!pointer.active) {
        setHover(null);
        return;
      }

      let best = null;
      let bestD = 36;
      for (const n of graph.graphData().nodes) {
        const d = Math.hypot(n.x - pt.x, n.y - pt.y);
        const hit = nodeRadius(n, counts) + 22;
        if (d < bestD && d < hit) {
          bestD = d;
          best = n.id;
        }
      }
      setHover(best);
    }

    function resize() {
      tier = detectTier();
      width = window.innerWidth;
      height = window.innerHeight;
      graph.width(width).height(height);
      if (tier.live) {
        unlockSimmer();
        graph.d3AlphaMin(0);
        graph.d3ReheatSimulation();
        refreshParticles();
      } else {
        simmerLocked = false;
        graph.d3AlphaMin(0.001);
        graph.linkDirectionalParticles(0);
      }
      applyCameraFromMidline(0);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener(
      "pointerleave",
      () => {
        pointer.active = false;
        setHover(null);
      },
      { passive: true }
    );
    window.addEventListener(
      "scroll",
      () => applyCameraFromMidline(),
      { passive: true }
    );
    window.addEventListener("resize", resize);

    if (global.PyzMotion?.subscribeMotion) {
      global.PyzMotion.subscribeMotion(() => {
        tier = detectTier();
        resize();
      });
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener?.("change", resize);

    // First fit after warmup.
    window.setTimeout(() => applyCameraFromMidline(0), tier.calm ? 50 : 400);

    global.__ambientGraphNearest = function (clientX, clientY) {
      if (!graphInteractive()) return null;
      const pt = graph.screen2GraphCoords(clientX, clientY);
      let best = null;
      let bestD = 36;
      for (const n of graph.graphData().nodes) {
        const d = Math.hypot(n.x - pt.x, n.y - pt.y);
        const hit = nodeRadius(n, counts) + 18;
        if (d < bestD && d < hit) {
          bestD = d;
          best = {
            id: n.id,
            group: n.group,
            dist: d,
            color: nodeColor(n),
            label:
              n.kind === "note"
                ? `${n.id} · ${n.noteType || "reference"}`
                : `${n.id} · ${n.group}`,
          };
        }
      }
      return best;
    };

    global.__ambientGraphNodeScreen = function (id) {
      if (!graphInteractive()) return null;
      const n = graph.graphData().nodes.find((x) => x.id === id);
      if (!n) return null;
      return graph.graph2ScreenCoords(n.x, n.y);
    };

    return function destroyAmbientGraph() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      graph._destructor?.();
      delete global.__ambientGraphNearest;
      delete global.__ambientGraphNodeScreen;
    };
  }

  global.initAmbientGraph = initAmbientGraph;
})(typeof window !== "undefined" ? window : globalThis);
