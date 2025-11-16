import React from 'react';

export default function LessonList({ lessons, setEditingLesson }) {
  return (
    <div>
      <h2>Lessons</h2>
      {lessons.length === 0 && <p>No lessons yet.</p>}
      <ul>
        {lessons.map((lesson, idx) => (
          <li key={idx} style={{ marginBottom:'1rem', border:'1px solid #ccc', padding:'0.5rem', borderRadius:'6px' }}>
            <strong>{lesson.title}</strong>
            <p>{lesson.content}</p>
            <button onClick={()=>setEditingLesson(lesson)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
