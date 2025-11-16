"use strict";

const NET = window.NET || (window.NET = {});

NET.initScrollReveal = () => {
  const targets = Array.from(document.querySelectorAll("[data-net-reveal]"));
  if (!targets.length) return;

  const reveal = (el) => {
    el.classList.add("net-reveal-visible");
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        reveal(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18
  });

  targets.forEach((el) => observer.observe(el));
};

NET.initBreathingGlow = () => {
  document.documentElement.classList.add("net-breathing-glow");
};

document.addEventListener("DOMContentLoaded", () => {
  try {
    NET.initScrollReveal();
    NET.initBreathingGlow();
  } catch (err) {
    console.error("[NET.Animation] init error", err);
  }
});
