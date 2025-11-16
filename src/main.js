console.log('NET Classroom Manager V2 main.js loaded');

const LESSONS = [
  { id: 'intro-welcome', title: 'Welcome to NET', level: 'Intro', duration: '10 min' },
  { id: 'intro-safety',  title: 'Safety & Protocols', level: 'Core', duration: '15 min' },
  { id: 'ai-ethics',     title: 'AI, Ethics & Responsibility', level: 'Core', duration: '20 min' }
];

const STORAGE_KEY = 'net_classroom_progress_v1';
let progress = {};
let currentLessonId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  renderLessonList();
  restoreLastLesson();
});

function renderLessonList() {
  const list = document.getElementById('lesson-list');
  list.innerHTML = '';

  LESSONS.forEach(lesson => {
    const btn = document.createElement('button');
    btn.className = 'net-lesson-card';
    btn.dataset.lessonId = lesson.id;
    btn.textContent = lesson.title;

    btn.onclick = () => loadLesson(lesson.id);
    list.appendChild(btn);
  });
}

async function loadLesson(id) {
  currentLessonId = id;

  const path = 'src/lessons/' + id + '.html';

  try {
    const res = await fetch(path, { cache: 'no-cache' });
    const html = await res.text();
    document.getElementById('lesson-container').innerHTML = html;
  } catch (e) {
    document.getElementById('lesson-container').innerHTML =
      '<p>Failed to load: ' + path + '</p>';
  }

  progress[id] = progress[id] || { status: 'in_progress', lastOpened: Date.now() };
  saveProgress();
}

function restoreLastLesson() {
  const keys = Object.keys(progress);
  if (keys.length === 0) return;
  const last = keys.sort((a,b) => progress[b].lastOpened - progress[a].lastOpened)[0];
  loadLesson(last);
}

function loadProgress() {
  try { progress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { progress = {}; }
}

function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
  catch {}
}
