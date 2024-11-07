import { VISIBILITY_LEVELS } from '../types';

const BASE_URL = 'http://localhost:3001';

export const taskService = {
  // Fetch all tasks for a specific user
  async getUserTasks(userId) {
    try {
      // Get user's private tasks AND family tasks
      const response = await fetch(`${BASE_URL}/tasks?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const tasks = await response.json();

      // Fetch all family tasks
      const familyResponse = await fetch(
        `${BASE_URL}/tasks?visibility=${VISIBILITY_LEVELS.FAMILY}`
      );
      if (!familyResponse.ok) throw new Error('Failed to fetch family tasks');
      const familyTasks = await familyResponse.json();
      
     // Combine and deduplicate tasks
     const allTasks = [...tasks, ...familyTasks];
     const uniqueTasks = Array.from(new Map(allTasks.map(task => [task.id, task])).values());      
      
      
      return uniqueTasks;
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  },

  // Create a new task
  async createTask(taskData) {
    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          visibility: taskData.visibility || VISIBILITY_LEVELS.PRIVATE
        }),
      });
      if (!response.ok) throw new Error('Failed to create task');
      return await response.json();
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },

  // Update a task
  async updateTask(taskId, updates) {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update task');
      return await response.json();
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  },

  // Delete a task
  async deleteTask(taskId) {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete task');
      return true;
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  }
};