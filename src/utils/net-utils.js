"use strict";

// Global NET namespace (idempotent)
window.NET = window.NET || {};
const NET = window.NET;

// -------- DOM SHORTCUTS --------
NET.$ = (sel, root = document) => root.querySelector(sel);
NET.Cyan = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// -------- EVENT UTILS ----------
NET.on = (el, type, handler, opts) => el && el.addEventListener(type, handler, opts || false);
NET.off = (el, type, handler, opts) => el && el.removeEventListener(type, handler, opts || false);

// -------- EVENT BUS ------------
NET.bus = NET.bus || (() => {
  const listeners = Object.create(null);

  return {
    on(type, fn) {
      if (!type || typeof fn !== "function") return;
      (listeners[type] ||= new Set()).add(fn);
    },
    off(type, fn) {
      listeners[type]?.delete(fn);
    },
    emit(type, payload) {
      const set = listeners[type];
      if (!set) return;
      for (const fn of set) {
        try {
          fn(payload);
        } catch (err) {
          console.error("[NET.bus] handler error for event:", type, err);
        }
      }
    }
  };
})();

// -------- THROTTLE / DEBOUNCE ---
NET.throttle = (fn, wait = 100) => {
  let last = 0;
  let queued = null;
  return function throttled(...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    } else {
      queued = args;
      setTimeout(() => {
        if (queued) {
          last = Date.now();
          fn.apply(null, queued);
          queued = null;
        }
      }, wait - (now - last));
    }
  };
};

NET.debounce = (fn, wait = 150) => {
  let t;
  return function debounced(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
};

// -------- MICRO STORE ----------
NET.createStore = (initialState = {}) => {
  let state = Object.freeze({ ...initialState });
  const subs = new Set();

  const get = () => state;

  const set = (patch) => {
    const next = {
      ...state,
      ...(typeof patch === "function" ? patch(state) : patch)
    };
    state = Object.freeze(next);
    subs.forEach((fn) => {
      try { fn(state); } catch (err) { console.error("[NET.store] subscriber error", err); }
    });
  };

  const subscribe = (fn) => {
    subs.add(fn);
    return () => subs.delete(fn);
  };

  return { get, set, subscribe };
};

// -------- SAFE RAF SCHEDULER ----
NET.raf = (fn) => {
  let id = null;
  const loop = () => {
    id = requestAnimationFrame(() => {
      fn();
      loop();
    });
  };
  loop();
  return () => cancelAnimationFrame(id);
};
