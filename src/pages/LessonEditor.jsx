import React, { useState, useEffect } from 'react';

export default function LessonEditor({ lessons, setLessons, editingLesson, setEditingLesson }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if(editingLesson){
      setTitle(editingLesson.title);
      setContent(editingLesson.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editingLesson]);

  const handleSave = () => {
    if(editingLesson){
      setLessons(lessons.map(l => l === editingLesson ? { title, content } : l));
    } else {
      setLessons([...lessons, { title, content }]);
    }
    setEditingLesson(null);
    setTitle('');
    setContent('');
  };

  return (
    <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h2>{editingLesson ? 'Edit Lesson' : 'Add Lesson'}</h2>
      <input type='text' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} style={{ width:'100%', marginBottom:'0.5rem', padding:'0.5rem' }}/>
      <textarea placeholder='Content' value={content} onChange={e => setContent(e.target.value)} style={{ width:'100%', marginBottom:'0.5rem', padding:'0.5rem', minHeight:'80px' }}/>
      <button onClick={handleSave} style={{ padding:'0.5rem 1rem' }}>{editingLesson ? 'Update':'Add'}</button>
    </div>
  );
}
