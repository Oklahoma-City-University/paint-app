// src/components/TaskList.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { taskService } from '../services/taskService';
import { AddTask } from './AddTask';
import { TaskItem } from './TaskItem';
import { PERMISSIONS } from '../types';

export function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load tasks when component mounts
  useEffect(() => {
    loadTasks();
  }, [user.id]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const userTasks = await taskService.getUserTasks(user.id);
      setTasks(userTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Load tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (newTaskData) => {
    if (!hasPermission('create')) {
      alert('You do not have permission to create tasks');
      return;
    }

    try {
      const newTask = await taskService.createTask({
        ...newTaskData,
        userId: user.id,
        completed: false
      });
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const deleteTask = async (taskId) => {
    if (!hasPermission('delete')) {
      alert('You do not have permission to delete tasks');
      return;
    }

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const toggleTask = async (taskId) => {
    if (!hasPermission('update')) {
      alert('You do not have permission to update tasks');
      return;
    }

    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = await taskService.updateTask(taskId, {
        completed: !task.completed
      });
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const hasPermission = (action) => {
    return PERMISSIONS[user.role].includes(action);
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="task-list p-4">
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}
      
      {hasPermission('create') && (
        <AddTask onAdd={addTask} />
      )}

      <div className="tasks">
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Add some tasks to start taskin'!</p>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              {...task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
              canUpdate={hasPermission('update')}
              canDelete={hasPermission('delete')}
            />
          ))
        )}
      </div>
    </div>
  );
}