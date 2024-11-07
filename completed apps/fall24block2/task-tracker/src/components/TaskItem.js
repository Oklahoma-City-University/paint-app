import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from '../contexts/authContext';
import { VISIBILITY_LEVELS } from '../types';


/**
 * Represents a single task item in the task list.
 * Displays task details and provides interaction buttons based on user permissions.
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the task
 * @param {string} props.title - Task title
 * @param {string} props.priority - Task priority level (Low/Medium/High)
 * @param {boolean} props.completed - Whether the task is completed
 * @param {number} props.reward - Reward amount for completing the task
 * @param {string} props.dueDate - Due date for the task
 * @param {Function} props.onToggle - Handler for toggling task completion
 * @param {Function} props.onDelete - Handler for deleting the task
 * @param {boolean} props.canUpdate - Whether user has permission to update
 * @param {boolean} props.canDelete - Whether user has permission to delete
 */
export function TaskItem({ 
  id,
  title, 
  priority, 
  completed, 
  reward,
  visibility,
  createdBy,
  dueDate,
  onToggle, 
  onDelete,
  canUpdate,
  canDelete 
}) {
  const {user} = useAuth();
  /**
   * Handles click events on the task item.
   * Prevents event bubbling and checks permissions before toggling completion.
   * 
   * @param {Event} e - Click event object
   */
  const handleClick = (e) => {
    e.stopPropagation();
    if (canUpdate) {
      onToggle();
    }
  };

  /**
   * Handles delete button clicks.
   * Prevents event bubbling and checks permissions before deleting.
   * 
   * @param {Event} e - Click event object
   */
  const handleDelete = (e) => {
    e.stopPropagation();
    if (canDelete) {
      onDelete();
    }
  };

  return (
    <Card 
      className={`mb-4 ${completed ? 'bg-gray-50' : 'bg-white'}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Task details section */}
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${completed ? 'line-through text-gray-500' : ''}`}>
              {title}
            </h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">Priority: {priority}</p>
              {reward && <p className="text-sm text-gray-600">Reward: ${reward}</p>}
              <p className="text-sm text-gray-600">
                {visibility === VISIBILITY_LEVELS.FAMILY ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    Family Task
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                    Private Task
                  </span>
                )}
              </p>
              {createdBy && createdBy !== user.id && (
                <p className="text-sm text-gray-600">Created by: {createdBy}</p>
              )}
            </div>
          </div>
              {dueDate && (
                <p className="text-sm text-gray-600">
                  Due: {new Date(dueDate).toLocaleDateString()}
                </p>
              )}
              <p className="text-sm text-gray-600">
                Status: {completed ? 'Complete' : 'Incomplete'}
              </p>
            </div>
      

          {/* Action buttons section */}
          <div className="flex space-x-2">
            {canUpdate && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClick}
                className={completed ? 'bg-green-50' : ''}
              >
                {completed ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
            )}
            {canDelete && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </div>
        
      </CardContent>
    </Card>
  );
}
