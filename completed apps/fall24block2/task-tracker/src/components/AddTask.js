import { useState } from 'react';
import { VISIBILITY_LEVELS, PERMISSIONS } from '../types';
import { useAuth } from '../contexts/authContext';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';

/**
 * AddTask Component
 * Provides a form interface for creating new tasks with various properties
 * including visibility levels, priorities, and rewards.
 * 
 * Features:
 * - Task visibility control (private/family)
 * - Priority selection
 * - Reward amount
 * - Due date setting
 * - Role-based permissions for family tasks
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onAdd - Callback function to handle new task creation
 */
export function AddTask({ onAdd }) {
  // Get current user context for permission checking
  const { user } = useAuth();
  
  // State for error handling
  const [error, setError] = useState(null);
  
  /**
   * Form state with default values
   * title: Task description
   * priority: Task importance level
   * dueDate: Task deadline
   * reward: Completion reward amount
   * visibility: Task visibility scope
   */
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Medium',
    dueDate: '',
    reward: '',
    visibility: VISIBILITY_LEVELS.FAMILY
  });

  /**
   * Universal change handler for all form inputs
   * Uses computed property names to update the correct field
   * 
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  /**
   * Form submission handler
   * Validates input, checks permissions, and creates new task
   * 
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Input validation
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    // Permission check for family task creation
    if (formData.visibility === VISIBILITY_LEVELS.FAMILY && 
        !PERMISSIONS[user.role].includes('create_family_tasks')) {
      setError('You do not have permission to create family tasks');
      return;
    }

    const newTask = {
      ...formData,
      id: Date.now().toString(),
      completed: false,
      reward: formData.reward ? parseFloat(formData.reward) : 0,
      userId: user.id,          // Always set the creator's ID
      createdBy: user.name,
      visibility: formData.visibility || VISIBILITY_LEVELS.PRIVATE,  // Ensure visibility is set
      createdAt: new Date().toISOString()
    };

    // Submit task through callback
    onAdd(newTask);

    // Reset form to initial state
    setFormData({
      title: '',
      priority: 'Medium',
      dueDate: '',
      reward: '',
      visibility: VISIBILITY_LEVELS.FAMILY
    });
    
    // Clear any existing errors
    setError(null);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-semibold">Add New Task</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {/* Visibility Selection Section */}
          <div className="form-group">
            <label htmlFor="visibility" className="block text-sm font-medium">
              Visibility Level
            </label>
            <select
              id="visibility"
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            >
             {/* Only show family option if user has permission */}
             {PERMISSIONS[user.role].includes('create_family_tasks') && (
                <option value={VISIBILITY_LEVELS.FAMILY}>Family</option>
              )}
             <option value={VISIBILITY_LEVELS.PRIVATE}>Private</option>
              
            </select>
          </div>

          {/* Task Title Input Section */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Task Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
              aria-required="true"
            />
          </div>

          {/* Priority Selection Section */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">
              Priority Level
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Reward Amount Input Section */}
          <div>
            <label htmlFor="reward" className="block text-sm font-medium mb-1">
              Reward Amount ($)
            </label>
            <Input
              id="reward"
              name="reward"
              type="number"
              min="0"
              step="0.01"
              value={formData.reward}
              onChange={handleChange}
              placeholder="Enter reward amount"
              aria-label="Task reward amount in dollars"
            />
          </div>

          {/* Due Date Input Section */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
              Due Date
            </label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              aria-label="Task due date"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            aria-label="Create new task"
          >
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/**
 * Component Features:
 * 1. Form Validation
 *    - Required title field
 *    - Permission checks for family tasks
 *    - Number validation for rewards
 * 
 * 2. User Experience
 *    - Clear error messages
 *    - Form field reset after submission
 *    - Accessible form labels
 *    - Responsive layout
 * 
 * 3. Data Handling
 *    - Proper type conversion
 *    - Unique ID generation
 *    - User association
 * 
 * 4. Accessibility
 *    - ARIA labels
 *    - Required field indication
 *    - Semantic HTML structure
 * 
 * Future Enhancements:
 * - Add task categories/tags
 * - Add rich text description
 * - Add file attachments
 * - Add recurring task options
 * - Add task templates
 * - Add task priority colors
 * - Add task estimation
 */