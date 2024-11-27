
//feature version 2
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './styles.css';

// AddTaskForm Component
function AddTaskForm({ onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Medium',
    dueDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    onAdd(formData);
    setFormData({
      title: '',
      priority: 'Medium',
      dueDate: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <div className="form-group">
        <label htmlFor="title">
          Task Title: <span className="required">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
        />
      </div>
      <div className="form-group">
        <label htmlFor="priority">Priority Level:</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="dueDate">Due Date:</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
}

// ShareModal Component
function ShareModal({ isOpen, onClose, task }) {
  const shareUrl = task ? `${window.location.origin}/task/${task.id}` : '';

  useEffect(() => {
    if (isOpen && task) {
      navigator.clipboard.writeText(shareUrl);
    }
  }, [isOpen, task, shareUrl]);

//   return isOpen && task ? (
//     <div className="modal">
//       <h2>Share Task</h2>
//       <button onClick={onClose}>Close</button>
//     </div>
//   ) : null;
}

// TaskItem Component
function TaskItem({ task, onToggle, onDelete, onShare }) {
  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''}`}
      onClick={onToggle}
    >
      <h3>{task.title}</h3>
      <p>Priority: {task.priority}</p>
      {task.dueDate && <p>Due Date: {task.dueDate}</p>}
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }}>
        Delete
      </button>
      <button onClick={(e) => { e.stopPropagation(); onShare(task); }}>
        Copy Me!!
      </button>
    </div>
  );
}

// TaskPage Component
function TaskPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const fetchedTask = savedTasks.find((t) => t.id === taskId);
    if (fetchedTask) {
      setTask(fetchedTask);
    } else {
      setTask(null);
    }
  }, [taskId]);

  return (
    <div className="task-page">
      {task ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{task.title}</h1>
          <p style={{ fontSize: '1.2rem' }}>Priority: {task.priority}</p>
          {task.dueDate && <p style={{ fontSize: '1.2rem' }}>Due Date: {task.dueDate}</p>}
          <p style={{ fontSize: '1.2rem' }}>Status: {task.completed ? 'Completed' : 'Pending'}</p>
        </div>
      ) : (
        <p>Task not found.</p>
      )}
    </div>
  );
}

// App Component
export default function App() {
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    const newTask = { ...task, id: uuidv4(), completed: false };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const shareTask = (task) => {
    setCurrentTask(task);
    setIsShareModalOpen(true);
  };

  return (
    <Router>
      <div className="app">
        <h1>Task Tracker</h1>
        <AddTaskForm onAdd={addTask} />
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
              onShare={() => shareTask(task)}
            />
          ))}
        </div>
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          task={currentTask}
        />
      </div>
      <Routes>
        <Route path="/task/:taskId" element={<TaskPage />}  />
        <Route path="/"  />
      </Routes>
    </Router>
  );
}

// element={<TaskPage />}
// element={<div>Welcome to Task Tracker!</div>}