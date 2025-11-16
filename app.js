"use strict";

(function () {
  const statusPill = document.getElementById("net-status-pill");
  const footerStatus = document.getElementById("net-footer-status");
  const lessonTitleEl = document.getElementById("lesson-title");
  const sceneTitleEl = document.getElementById("scene-title");
  const sceneContentEl = document.getElementById("scene-content");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const btnStartSarcasm = document.getElementById("btn-start-sarcasm");

  if (!window.NET) {
    console.error("NET core not found.");
    if (statusPill) statusPill.textContent = "CORE MISSING";
    return;
  }

  function renderFromState(state) {
    if (!statusPill || !lessonTitleEl || !sceneTitleEl || !sceneContentEl) return;

    const lesson = NET.getCurrentLesson();
    const scene = NET.getCurrentScene();

    statusPill.textContent = state.currentLessonId
      ? `CORE V10 · ${state.currentLessonId} · scene ${state.currentSceneIndex + 1}`
      : "CORE V10 · IDLE";

    if (!lesson || !scene) {
      lessonTitleEl.textContent = "No lesson active";
      sceneTitleEl.textContent = "—";
      sceneContentEl.innerHTML = "Click “Start Sarcasm” to begin.";
      btnPrev.disabled = true;
      btnNext.disabled = true;
      return;
    }

    lessonTitleEl.textContent = lesson.title || lesson.id || "Lesson";
    sceneTitleEl.textContent = scene.title || "Scene";
    sceneContentEl.innerHTML = scene.content || "";
    btnPrev.disabled = state.currentSceneIndex <= 0;
    btnNext.disabled = lesson.scenes && state.currentSceneIndex >= lesson.scenes.length - 1;
  }

  NET.subscribe(renderFromState);
  renderFromState(NET.getState());

  if (btnStartSarcasm) {
    btnStartSarcasm.addEventListener("click", () => {
      const result = NET.startLesson("sarcasm_I1");
      if (footerStatus) {
        footerStatus.textContent = result.ok
          ? "Sarcasm (I-1) started."
          : "Could not start lesson (check pack).";
      }
      renderFromState(NET.getState());
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      NET.nextScene();
      renderFromState(NET.getState());
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      NET.prevScene();
      renderFromState(NET.getState());
    });
  }
})();
