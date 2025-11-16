import React from 'react';
import ReactDOM from 'react-dom/client';
import LessonEditor from './pages/LessonEditor';
import LessonList from './pages/LessonList';

function App() {
  const [lessons, setLessons] = React.useState([]);
  const [editingLesson, setEditingLesson] = React.useState(null);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>NET-Ai-EcoSystem CommandStation</h1>
      <LessonEditor
        lessons={lessons}
        setLessons={setLessons}
        editingLesson={editingLesson}
        setEditingLesson={setEditingLesson}
      />
      <LessonList
        lessons={lessons}
        setEditingLesson={setEditingLesson}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
