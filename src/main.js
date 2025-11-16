document.addEventListener('DOMContentLoaded', () => {
  const lessons = ['intro','rules','ethics'];
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');

  lessons.forEach(name => {
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.onclick = () => loadLesson(name);
    sidebar.appendChild(btn);
  });

  function loadLesson(name) {
    fetch('src/lessons/' + name + '.html')
      .then(r => r.text())
      .then(html => content.innerHTML = html);
  }
});
