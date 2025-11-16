// src/main.js

const LESSONS = [
  {
    id: "intro-welcome",
    title: "Welcome to NET",
    level: "Intro",
    duration: "10 min",
    tags: ["system", "orientation"],
  },
  {
    id: "intro-safety",
    title: "Safety & Protocols",
    level: "Core",
    duration: "15 min",
    tags: ["safety", "rules"],
  },
  {
    id: "ai-ethics",
    title: "AI, Ethics & Responsibility",
    level: "Core",
    duration: "20 min",
    tags: ["ethics", "discussion"],
  },
];

const LESSON_PATH_PREFIX = "src/lessons/";
const STORAGE_KEY = "net_classroom_progress_v1";

let progress = {};
let currentLessonId = null;

document.addEventListener("DOMContentLoaded", () => {
  const lessonListEl = document.getElementById("lesson-list");
  const lessonSearchEl = document.getElementById("lesson-search");
  const lessonContainer = document.getElementById("lesson-container");
  const titleEl = document.getElementById("current-lesson-title");
  const metaEl = document.getElementById("current-lesson-meta");
  const footerVersion = document.getElementById("net-footer-version");
  const footerStatus = document.getElementById("net-footer-status");
  const markCompleteBtn = document.getElementById("mark-complete-btn");

  footerVersion.textContent = `Autosave: ON • Lessons: ${LESSONS.length}`;
  footerStatus.textContent = "Ready.";

  loadProgress();
  renderLessonList(lessonListEl);

  lessonSearchEl.addEventListener("input", () => {
    renderLessonList(lessonListEl, lessonSearchEl.value.trim());
  });

  markCompleteBtn.addEventListener("click", () => {
    if (!currentLessonId) return;
    setLessonStatus(currentLessonId, "completed");
    updateLessonListVisuals();
  });

  const lastLessonId = getLastOpenedLessonId();
  if (lastLessonId) {
    loadLesson(lastLessonId, { scrollToSaved: true });
  }

  lessonContainer.addEventListener("scroll", () => {
    if (!currentLessonId) return;
    const sTop = lessonContainer.scrollTop;
    const sHeight = lessonContainer.scrollHeight || 1;
    const ratio = sTop / sHeight;
    ensureProgressEntry(currentLessonId);
    progress[currentLessonId].scrollRatio = ratio;
    saveProgress();
  });

  function renderLessonList(container, filterQuery = "") {
    container.innerHTML = "";
    const q = filterQuery.toLowerCase();
    const filtered = LESSONS.filter((lesson) => {
      if (!q) return true;
      return (
        lesson.title.toLowerCase().includes(q) ||
        lesson.level.toLowerCase().includes(q) ||
        (lesson.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });

    filtered.forEach((lesson) => {
      const item = document.createElement("button");
      item.className = "net-lesson-card";
      item.type = "button";
      item.dataset.lessonId = lesson.id;

      const left = document.createElement("div");
      const right = document.createElement("div");

      const title = document.createElement("p");
      title.className = "net-lesson-card__title";
      title.textContent = lesson.title;

      const meta = document.createElement("p");
      meta.className = "net-lesson-card__meta";
      meta.textContent = `${lesson.level} • ${lesson.duration}`;

      const status = document.createElement("p");
      status.className = "net-lesson-card__status";
      status.textContent = prettyStatus(getLessonStatus(lesson.id));

      left.appendChild(title);
      left.appendChild(meta);
      left.appendChild(status);

      const pill = document.createElement("span");
      pill.className = "net-lesson-card__pill";
      pill.textContent = (lesson.tags || []).slice(0, 1).join(", ") || "Lesson";

      right.appendChild(pill);

      item.appendChild(left);
      item.appendChild(right);

      item.addEventListener("click", () => {
        loadLesson(lesson.id);
      });

      container.appendChild(item);
    });

    updateLessonListVisuals();
  }

  function updateLessonListVisuals() {
    const cards = lessonListEl.querySelectorAll(".net-lesson-card");
    cards.forEach((card) => {
      const id = card.dataset.lessonId;
      const statusEl = card.querySelector(".net-lesson-card__status");
      statusEl.textContent = prettyStatus(getLessonStatus(id));
      if (id === currentLessonId) {
        card.classList.add("net-lesson-card--active");
      } else {
        card.classList.remove("net-lesson-card--active");
      }
    });
  }

  async function loadLesson(id, options = {}) {
    const { scrollToSaved = false } = options;
    const lesson = LESSONS.find((l) => l.id === id);
    if (!lesson) {
      footerStatus.textContent = `Unknown lesson ID: ${id}`;
      return;
    }

    currentLessonId = id;
    footerStatus.textContent = "Loading lesson...";
    titleEl.textContent = lesson.title;
    metaEl.textContent = `${lesson.level} • ${lesson.duration}`;
    markCompleteBtn.disabled = false;

    setLessonStatus(id, "in_progress");
    updateLessonListVisuals();

    const url = `${LESSON_PATH_PREFIX}${id}.html`;

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const html = await res.text();
      lessonContainer.innerHTML = html;
      footerStatus.textContent = "Lesson loaded.";

      if (scrollToSaved) {
        const p = progress[id];
        if (p && typeof p.scrollRatio === "number") {
          requestAnimationFrame(() => {
            const maxScroll =
              lessonContainer.scrollHeight - lessonContainer.clientHeight;
            lessonContainer.scrollTop = maxScroll * p.scrollRatio;
          });
        }
      }
    } catch (err) {
      lessonContainer.innerHTML = `
        <div class="net-lesson-placeholder">
          <p>Failed to load lesson <code>${id}</code>.</p>
          <p>Error: ${err.message}</p>
          <p>Expected path: <code>${url}</code></p>
        </div>
      `;
      footerStatus.textContent = "Error loading lesson.";
    } finally {
      updateLessonListVisuals();
    }
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      progress = raw ? JSON.parse(raw) : {};
    } catch {
      progress = {};
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }

  function ensureProgressEntry(id) {
    if (!progress[id]) {
      progress[id] = {
        status: "not_started",
        lastOpened: null,
        completedAt: null,
        scrollRatio: 0,
      };
    }
  }

  function setLessonStatus(id, status) {
    ensureProgressEntry(id);
    const now = Date.now();
    progress[id].status = status;
    progress[id].lastOpened = now;
    if (status === "completed") {
      progress[id].completedAt = now;
    }
    saveProgress();
  }

  function getLessonStatus(id) {
    return progress[id]?.status || "not_started";
  }

  function prettyStatus(status) {
    switch (status) {
      case "in_progress":
        return "In progress";
      case "completed":
        return "Completed";
      default:
        return "Not started";
    }
  }

  function getLastOpenedLessonId() {
    const entries = Object.entries(progress);
    if (!entries.length) return null;
    const sorted = entries
      .filter(([, v]) => typeof v.lastOpened === "number")
      .sort(([, a], [, b]) => (b.lastOpened || 0) - (a.lastOpened || 0));
    return sorted[0]?.[0] || null;
  }
});
