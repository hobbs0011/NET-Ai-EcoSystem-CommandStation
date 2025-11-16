"use strict";

const NET = window.NET || (window.NET = {});

NET.initAmbientOrbs = () => {
  const container = document.querySelector(".net-orb-layer");
  if (!container) return;

  const ORB_COUNT = 6;
  const orbs = [];

  for (let i = 0; i < ORB_COUNT; i++) {
    const orb = document.createElement("div");
    orb.className = "net-orb";
    container.appendChild(orb);

    const baseX = Math.random();
    const baseY = Math.random();
    const speed = 0.4 + Math.random() * 0.5;
    const radius = 10 + Math.random() * 25;

    orbs.push({ orb, baseX, baseY, speed, radius });
  }

  let start = performance.now();

  const frame = (t) => {
    const elapsed = (t - start) / 1000;
    const { innerWidth: w, innerHeight: h } = window;

    orbs.forEach(({ orb, baseX, baseY, speed, radius }, index) => {
      const angle = elapsed * speed + index;
      const x = baseX * w + Math.cos(angle) * radius * 10;
      const y = baseY * h + Math.sin(angle * 0.9) * radius * 4;

      orb.style.transform = 	ranslate3d(px, px, 0);
    });

    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
};

document.addEventListener("DOMContentLoaded", () => {
  try {
    NET.initAmbientOrbs();
  } catch (err) {
    console.error("[NET.Orbs] init error", err);
  }
});
