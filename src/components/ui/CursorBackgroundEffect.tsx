"use client";

import React, { useEffect, useRef, useState } from "react";

type Cell = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  spin: number;
  depth: number;
  kind: number;
};

export function CursorBackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let dark = document.documentElement.classList.contains("dark");
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
    let mx = mouse.x;
    let my = mouse.y;
    let t = 0;
    const rings: { x: number; y: number; r: number; life: number; kind: number }[] = [];
    let lastBeat = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let cells: Cell[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawnCells();
    };

    const spawnCells = () => {
      const n = Math.min(56, Math.floor((w * h) / 24000) + 28);
      cells = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        r: 5 + Math.random() * 18,
        hue: [168, 188, 262, 42][Math.floor(Math.random() * 4)],
        spin: Math.random() * Math.PI * 2,
        depth: 0.28 + Math.random() * 0.72,
        kind: Math.floor(Math.random() * 3),
      }));
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onPointer = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    const themeObs = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    resize();

    const field = (x: number, y: number, time: number) => {
      const a = Math.sin(x * 0.0026 + time * 0.55) + Math.cos(y * 0.003 + time * 0.41);
      const b = Math.sin((x * 0.7 + y) * 0.0017 + time * 0.68);
      const c = Math.sin(Math.hypot(x - mx, y - my) * 0.008 - time);
      return (a + b) * 0.5 + c * 0.25;
    };

    const drawPlasma = () => {
      const blobs = [
        { x: w * 0.18 + Math.sin(t * 0.33) * 90, y: h * 0.22 + Math.cos(t * 0.27) * 55, r: 250, c: dark ? "rgba(45,212,191,0.18)" : "rgba(13,148,136,0.16)" },
        { x: w * 0.78 + Math.cos(t * 0.21) * 100, y: h * 0.28 + Math.sin(t * 0.3) * 70, r: 280, c: dark ? "rgba(56,189,248,0.15)" : "rgba(2,132,199,0.13)" },
        { x: w * 0.52 + Math.sin(t * 0.16) * 130, y: h * 0.8 + Math.cos(t * 0.19) * 45, r: 260, c: dark ? "rgba(167,139,250,0.14)" : "rgba(99,102,241,0.12)" },
        { x: w * 0.08 + Math.cos(t * 0.14) * 40, y: h * 0.62, r: 180, c: dark ? "rgba(251,191,36,0.08)" : "rgba(245,158,11,0.08)" },
        { x: mx, y: my, r: 380, c: dark ? "rgba(52,211,153,0.14)" : "rgba(16,185,129,0.12)" },
      ];
      blobs.forEach((b) => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.c);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawCaustics = () => {
      ctx.save();
      ctx.globalCompositeOperation = dark ? "screen" : "multiply";
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        const y0 = ((t * 28 + i * 90) % (h + 160)) - 80;
        for (let x = 0; x <= w; x += 10) {
          const y =
            y0 +
            Math.sin(x * 0.012 + t * 1.4 + i) * 18 +
            Math.sin(x * 0.031 - t * 0.8 + i * 0.7) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = dark
          ? `rgba(125, 211, 252, ${0.05 + (i % 3) * 0.03})`
          : `rgba(14, 116, 144, ${0.06 + (i % 3) * 0.03})`;
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawHexBloom = () => {
      const size = 46;
      const near = 260;
      ctx.save();
      ctx.lineWidth = 1.1;
      for (let y = -size; y < h + size; y += size * 1.58) {
        const odd = Math.floor(y / (size * 1.58)) % 2 === 0 ? 0 : size * 0.9;
        for (let x = -size; x < w + size; x += size * 1.82) {
          const cx = x + odd + Math.sin(t * 0.28 + y * 0.012) * 5;
          const cy = y + Math.cos(t * 0.22 + x * 0.01) * 4;
          const d = Math.hypot(mx - cx, my - cy);
          const glow = (mouse.active ? Math.max(0, 1 - d / near) : 0.07) ** 1.2;
          if (glow < 0.06) continue;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const ang = (Math.PI / 3) * i + t * 0.04;
            const px = cx + Math.cos(ang) * size * 0.46;
            const py = cy + Math.sin(ang) * size * 0.46;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = dark
            ? `rgba(94, 234, 212, ${0.04 + glow * 0.55})`
            : `rgba(13, 148, 136, ${0.04 + glow * 0.42})`;
          ctx.stroke();
          if (glow > 0.55) {
            ctx.fillStyle = dark
              ? `rgba(45, 212, 191, ${glow * 0.08})`
              : `rgba(13, 148, 136, ${glow * 0.07})`;
            ctx.fill();
          }
        }
      }
      ctx.restore();
    };

    const drawDnaColumn = (cx: number, twist: number, amp: number, dir: number) => {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineWidth = 2.15;
      for (let i = 0; i < h + 90; i += 6) {
        const y = i - 50;
        const phase = i * 0.038 * dir + t * 1.55 + twist;
        const x1 = cx + Math.sin(phase) * amp;
        const x2 = cx + Math.sin(phase + Math.PI) * amp;
        const z = (Math.cos(phase) + 1) / 2;
        ctx.globalAlpha = 0.2 + z * 0.42;
        ctx.strokeStyle = dark ? "#5EEAD4" : "#0F766E";
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x1, y + 7);
        ctx.stroke();
        ctx.strokeStyle = dark ? "#7DD3FC" : "#0369A1";
        ctx.beginPath();
        ctx.moveTo(x2, y);
        ctx.lineTo(x2, y + 7);
        ctx.stroke();
        if (i % 18 === 0) {
          ctx.globalAlpha = 0.14 + z * 0.32;
          ctx.strokeStyle = dark ? "rgba(196, 181, 253, 0.9)" : "rgba(99, 102, 241, 0.62)";
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();
          ctx.fillStyle = dark ? "#C4B5FD" : "#6366F1";
          ctx.beginPath();
          ctx.arc(x1, y, 2.6, 0, Math.PI * 2);
          ctx.arc(x2, y, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const drawDna = () => {
      const left = w < 720 ? w * 0.08 : w * 0.09;
      const right = w < 720 ? w * 0.92 : w * 0.86;
      drawDnaColumn(right, 0, Math.min(78, w * 0.07), 1);
      drawDnaColumn(left, 1.2, Math.min(52, w * 0.045), -1);
    };

    const drawMobius = () => {
      const cx = w * 0.5;
      const cy = h * 0.48;
      ctx.save();
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i <= 220; i++) {
        const u = (i / 220) * Math.PI * 2;
        const R = Math.min(w, h) * 0.22;
        const r = 38 + Math.sin(u * 2 + t) * 8;
        const x = cx + (R + r * Math.cos(u / 2 + t * 0.4)) * Math.cos(u + t * 0.15);
        const y = cy + (R * 0.42 + r * Math.sin(u / 2 + t * 0.4)) * Math.sin(u + t * 0.15);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = dark ? "rgba(167, 139, 250, 0.22)" : "rgba(79, 70, 229, 0.16)";
      ctx.shadowColor = dark ? "#A78BFA" : "#6366F1";
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.restore();
    };

    const drawEcg = () => {
      const lanes = [h * 0.18, h * 0.5, h * 0.82];
      lanes.forEach((baseY, lane) => {
        const speed = 85 + lane * 32;
        const shift = (t * speed) % 300;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = lane === 1 ? 2.6 : 1.5;
        for (let x = -40; x <= w + 40; x += 3) {
          const u = (x + shift) % 300;
          let y = baseY + Math.sin((x + t * 48) * 0.01 + lane) * 4;
          if (u > 118 && u < 168) {
            const p = (u - 118) / 50;
            if (p < 0.16) y -= p * 22;
            else if (p < 0.36) y += (p - 0.16) * 155;
            else if (p < 0.52) y -= (p - 0.36) * 230;
            else y += (0.7 - p) * 48;
          }
          const pull = Math.exp(-((x - mx) ** 2) / (2 * 140 ** 2));
          y += (my - y) * pull * 0.18;
          if (x === -40) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = dark
          ? `rgba(45, 212, 191, ${0.2 + lane * 0.08})`
          : `rgba(13, 148, 136, ${0.18 + lane * 0.07})`;
        ctx.shadowColor = dark ? "#2DD4BF" : "#0D9488";
        ctx.shadowBlur = 14;
        ctx.stroke();
        ctx.restore();
      });
    };

    const drawLymph = () => {
      const roots = [
        { x: 0, y: h * 0.12, ax: 1, ay: 0.4 },
        { x: w, y: h * 0.2, ax: -1, ay: 0.35 },
        { x: w * 0.15, y: h, ax: 0.4, ay: -1 },
        { x: w * 0.85, y: h, ax: -0.35, ay: -1 },
      ];
      ctx.save();
      ctx.lineCap = "round";
      roots.forEach((root, ri) => {
        for (let b = 0; b < 3; b++) {
          ctx.beginPath();
          let x = root.x;
          let y = root.y;
          ctx.moveTo(x, y);
          const spread = (b - 1) * 0.55;
          for (let s = 1; s <= 14; s++) {
            const u = s / 14;
            x += root.ax * (w * 0.045) + Math.sin(t * 0.7 + ri + b + s) * 7;
            y += root.ay * (h * 0.045) + Math.cos(t * 0.55 + ri * 1.3 + s) * 6 + spread * 10;
            ctx.lineTo(x, y);
            if (s === 14 || s % 5 === 0) {
              ctx.fillStyle = dark ? "rgba(94,234,212,0.35)" : "rgba(13,148,136,0.28)";
              ctx.beginPath();
              ctx.arc(x, y, 2.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.strokeStyle = dark
            ? `rgba(125, 211, 252, ${0.12 + b * 0.04})`
            : `rgba(14, 116, 144, ${0.12 + b * 0.04})`;
          ctx.lineWidth = 1.4 - b * 0.2;
          ctx.stroke();
        }
      });
      ctx.restore();
    };

    const drawMolecule = (cx: number, cy: number, scale: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      const R = 16 * scale;
      const pts: [number, number][] = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        pts.push([Math.cos(a) * R, Math.sin(a) * R * 0.62]);
      }
      ctx.beginPath();
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
      ctx.closePath();
      ctx.strokeStyle = dark ? "rgba(251, 191, 36, 0.45)" : "rgba(180, 83, 9, 0.35)";
      ctx.lineWidth = 1.3;
      ctx.stroke();
      pts.forEach((p, i) => {
        ctx.beginPath();
        ctx.fillStyle =
          i % 2 === 0
            ? dark
              ? "rgba(45,212,191,0.85)"
              : "rgba(13,148,136,0.75)"
            : dark
              ? "rgba(167,139,250,0.85)"
              : "rgba(99,102,241,0.7)";
        ctx.arc(p[0], p[1], 3.1 * scale, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    };

    const drawCells = () => {
      cells.forEach((c) => {
        const ang = field(c.x, c.y, t);
        c.vx += Math.cos(ang) * 0.045 * c.depth;
        c.vy += Math.sin(ang) * 0.045 * c.depth;
        if (mouse.active) {
          const dx = mx - c.x;
          const dy = my - c.y;
          const d = Math.hypot(dx, dy) + 0.001;
          const pull = Math.min(2.1, 110 / d);
          c.vx += (dx / d) * pull * 0.09;
          c.vy += (dy / d) * pull * 0.09;
        }
        c.vx *= 0.955;
        c.vy *= 0.955;
        c.x += c.vx;
        c.y += c.vy;
        c.spin += 0.012 + c.depth * 0.012;
        if (c.x < -50) c.x = w + 50;
        if (c.x > w + 50) c.x = -50;
        if (c.y < -50) c.y = h + 50;
        if (c.y > h + 50) c.y = -50;

        if (c.kind === 2) {
          drawMolecule(c.x, c.y, 0.55 + c.depth * 0.5, c.spin);
          return;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.spin);
        ctx.globalAlpha = 0.3 + c.depth * 0.4;
        const g = ctx.createRadialGradient(-c.r * 0.3, -c.r * 0.3, 1, 0, 0, c.r);
        g.addColorStop(0, `hsla(${c.hue}, 82%, ${dark ? 74 : 48}%, 0.92)`);
        g.addColorStop(0.55, `hsla(${c.hue + 18}, 70%, ${dark ? 46 : 36}%, 0.32)`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, 0, c.r, c.r * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,0.42)";
        ctx.arc(-c.r * 0.25, -c.r * 0.2, c.r * 0.16, 0, Math.PI * 2);
        ctx.fill();
        if (c.kind === 1) {
          ctx.strokeStyle = dark ? "rgba(255,255,255,0.28)" : "rgba(15,118,110,0.35)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(0, 0, c.r * 0.42, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      });
      ctx.globalAlpha = 1;
    };

    const drawMandala = () => {
      if (!mouse.active) return;
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(t * 0.35);
      const petals = 8;
      for (let i = 0; i < petals; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * i) / petals);
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.quadraticCurveTo(42, 14 + Math.sin(t * 2 + i) * 6, 86, 0);
        ctx.quadraticCurveTo(42, -14 - Math.sin(t * 2 + i) * 6, 18, 0);
        ctx.strokeStyle = dark ? "rgba(94,234,212,0.42)" : "rgba(13,148,136,0.38)";
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(28, 0);
        ctx.lineTo(36, -10);
        ctx.lineTo(44, 0);
        ctx.lineTo(52, 16);
        ctx.lineTo(64, -4);
        ctx.lineTo(78, 0);
        ctx.strokeStyle = dark ? "rgba(125,211,252,0.5)" : "rgba(3,105,161,0.4)";
        ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 14 + Math.sin(t * 4) * 3, 0, Math.PI * 2);
      ctx.strokeStyle = dark ? "rgba(251,191,36,0.7)" : "rgba(180,83,9,0.55)";
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();
    };

    const drawRings = () => {
      if (mouse.active && t - lastBeat > 0.92) {
        rings.push({ x: mx, y: my, r: 10, life: 1, kind: rings.length % 2 });
        lastBeat = t;
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.r += ring.kind ? 4.4 : 2.8;
        ring.life -= 0.011;
        if (ring.life <= 0) {
          rings.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(ring.x, ring.y);
        ctx.beginPath();
        if (ring.kind) {
          for (let k = 0; k < 6; k++) {
            const a = (Math.PI / 3) * k + t * 0.2;
            const px = Math.cos(a) * ring.r;
            const py = Math.sin(a) * ring.r;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
        } else {
          ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
        }
        ctx.strokeStyle = dark
          ? `rgba(45, 212, 191, ${ring.life * 0.5})`
          : `rgba(13, 148, 136, ${ring.life * 0.42})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.restore();
      }
    };

    const drawCursorCore = () => {
      if (!mouse.active) return;
      const g = ctx.createRadialGradient(mx, my, 0, mx, my, 190);
      g.addColorStop(0, dark ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.4)");
      g.addColorStop(0.18, dark ? "rgba(45,212,191,0.22)" : "rgba(13,148,136,0.2)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(mx, my, 190, 0, Math.PI * 2);
      ctx.fill();
    };

    const frame = () => {
      t += 0.016;
      mx += (mouse.x - mx) * 0.13;
      my += (mouse.y - my) * 0.13;
      ctx.clearRect(0, 0, w, h);
      drawPlasma();
      drawCaustics();
      drawHexBloom();
      drawLymph();
      drawMobius();
      drawEcg();
      drawDna();
      drawCells();
      drawRings();
      drawCursorCore();
      drawMandala();
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("mouseleave", onLeave);
      themeObs.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div className="mk-cosmos pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="mk-prism" />
      <div className="mk-aurora" />
      <div className="mk-caustic" />
      <div className="mk-orb mk-orb-a" />
      <div className="mk-orb mk-orb-b" />
      <div className="mk-orb mk-orb-c" />
      <div className="mk-orb mk-orb-d" />
      <div className="mk-iris" />
      {!reducedMotion && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />}
      <div className="mk-scan" />
      <div className="mk-moire" />
      <div className="mk-grain" />
      <div className="mk-vignette" />
    </div>
  );
}
