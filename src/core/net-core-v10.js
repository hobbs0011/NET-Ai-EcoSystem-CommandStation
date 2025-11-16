"use strict";

window.NET = (function () {
  const defaultState = Object.freeze({
    currentLessonId: null,
    currentSceneIndex: 0,
    lessons: {},
    students: [],
    scores: { team1: 0, team2: 0 }
  });

  let state = cloneState(defaultState);
  const listeners = new Set();

  function cloneState(s) {
    return JSON.parse(JSON.stringify(s));
  }

  function getState() {
    return cloneState(state);
  }

  function notify() {
    for (const fn of listeners) {
      try { fn(getState()); } catch (err) { console.error("NET listener error:", err); }
    }
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function setState(patch) {
    state = deepMerge(state, patch || {});
    notify();
  }

  function deepMerge(base, patch) {
    if (!patch || typeof patch !== "object") return base;
    const out = Array.isArray(base) ? base.slice() : { ...base };
    for (const key of Object.keys(patch)) {
      const pv = patch[key];
      const bv = out[key];
      if (pv && typeof pv === "object" && !Array.isArray(pv) && bv && typeof bv === "object" && !Array.isArray(bv)) {
        out[key] = deepMerge(bv, pv);
      } else {
        out[key] = pv;
      }
    }
    return out;
  }

  function loadLessonPack(pack) {
    if (!pack || typeof pack !== "object") {
      console.warn("NET.loadLessonPack: invalid pack");
      return { ok: false, error: "invalid_pack" };
    }
    const lessons = { ...state.lessons, ...pack };
    setState({ lessons });
    return { ok: true, lessons: Object.keys(lessons).length };
  }

  function startLesson(lessonId) {
    const lesson = state.lessons[lessonId];
    if (!lesson) {
      console.warn("NET.startLesson: missing lesson", lessonId);
      return { ok: false, error: "lesson_not_found" };
    }
    setState({ currentLessonId: lessonId, currentSceneIndex: 0 });
    return { ok: true };
  }

  function getCurrentLesson() {
    if (!state.currentLessonId) return null;
    return state.lessons[state.currentLessonId] || null;
  }

  function getCurrentScene() {
    const lesson = getCurrentLesson();
    if (!lesson || !Array.isArray(lesson.scenes)) return null;
    const idx = state.currentSceneIndex;
    if (idx < 0 || idx >= lesson.scenes.length) return null;
    return lesson.scenes[idx];
  }

  function nextScene() {
    const lesson = getCurrentLesson();
    if (!lesson || !Array.isArray(lesson.scenes)) return { ok: false, error: "no_lesson" };
    const max = lesson.scenes.length - 1;
    const next = Math.min(max, state.currentSceneIndex + 1);
    setState({ currentSceneIndex: next });
    return { ok: true, index: next };
  }

  function prevScene() {
    const lesson = getCurrentLesson();
    if (!lesson || !Array.isArray(lesson.scenes)) return { ok: false, error: "no_lesson" };
    const prev = Math.max(0, state.currentSceneIndex - 1);
    setState({ currentSceneIndex: prev });
    return { ok: true, index: prev };
  }

  function addStudent(name) {
    if (!name || typeof name !== "string") return { ok: false, error: "invalid_name" };
    const trimmed = name.trim();
    if (!trimmed) return { ok: false, error: "empty_name" };
    const set = new Set(state.students);
    set.add(trimmed);
    setState({ students: Array.from(set) });
    return { ok: true, name: trimmed };
  }

  return {
    getState,
    subscribe,
    setState,
    loadLessonPack,
    startLesson,
    getCurrentLesson,
    getCurrentScene,
    nextScene,
    prevScene,
    addStudent
  };
})();
