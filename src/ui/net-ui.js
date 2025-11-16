"use strict";

const NET = window.NET || (window.NET = {});

// Basic interactive UI hooks: ripple, hover glow, click pulses
NET.initUIInteractions = () => {
  const { Cyan, on } = NET;

  // Ripple buttons
  Cyan(".net-btn, [data-net-ripple]").forEach((btn) => {
    btn.classList.add("net-ripple-ready");
    on(btn, "click", (e) => {
      const rect = btn.getBoundingClientRect();
      const circle = document.createElement("span");
      circle.className = "net-ripple";
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = size + "px";
      circle.style.left = (e.clientX - rect.left - size / 2) + "px";
      circle.style.top = (e.clientY - rect.top - size / 2) + "px";
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 550);
    });
  });

  // Hover glow
  Cyan(".net-card, [data-net-hover]").forEach((el) => {
    el.classList.add("net-hover-glow");
  });

  // Navbar scroll shrink
  const nav = document.querySelector(".net-nav-shell");
  if (nav) {
    const onScroll = NET.throttle(() => {
      if (window.scrollY > 32) {
        nav.classList.add("net-nav-scrolled");
      } else {
        nav.classList.remove("net-nav-scrolled");
      }
    }, 50);
    window.addEventListener("scroll", onScroll);
  }

  NET.bus.emit("ui:init:done");
};

document.addEventListener("DOMContentLoaded", () => {
  try {
    NET.initUIInteractions();
  } catch (err) {
    console.error("[NET.UI] init error", err);
  }
});
