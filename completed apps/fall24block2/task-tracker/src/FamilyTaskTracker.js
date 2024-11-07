import { AuthProvider, useAuth } from './contexts/authContext';
import { useState } from 'react';
import { UserManagement } from './components/UserManagement';
import { Login } from './components/Login';
import { TaskList } from './components/TaskList';
import { Button } from './components/ui/button';

/**
 * AuthenticatedApp component handles the main application interface after user login.
 * Manages view switching between tasks and user management (for admins).
 * 
 * Features:
 * - Conditional rendering based on user role
 * - View state management for navigation
 * - Welcome message with user info
 * - Role-based access control for admin features
 * 
 * @component
 * @returns {JSX.Element} The authenticated application interface
 */
function AuthenticatedApp() {
  // Get user data and logout function from auth context
  const { user, logout } = useAuth();
  
  // State to manage current view (tasks or user management)
  const [currentView, setCurrentView] = useState('tasks');

   // If no user is logged in, show the Login component
   if (!user) {
    return <Login />;
  }

  return (
    <div>
      {/* Header bar with user info and navigation */}
      <div className="flex justify-between items-center p-4 bg-gray-100">
        {/* User information display */}
        <div>
          <span className="font-medium">Welcome, {user.name}</span>
          <span className="ml-2 text-sm text-gray-600">({user.role})</span>
        </div>

        {/* Navigation and action buttons */}
        <div className="space-x-4">
          {/* Conditional render of admin navigation */}
          {user.role === 'admin' && (
            <Button 
              onClick={() => setCurrentView(currentView === 'users' ? 'tasks' : 'users')}
              // Change button text based on current view
              aria-label={currentView === 'users' ? 'Switch to tasks view' : 'Switch to user management'}
            >
              {currentView === 'users' ? 'View Tasks' : 'Manage Users'}
            </Button>
          )}
          
          {/* Logout button */}
          <Button 
            onClick={logout} 
            variant="outline"
            aria-label="Logout"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main content area with conditional rendering */}
      {/* Show UserManagement for admins when in users view, otherwise show TaskList */}
      {user.role === 'admin' && currentView === 'users' ? (
        <UserManagement />
      ) : (
        <TaskList />
      )}
    </div>
  );
}

/**
 * Component responsibilities:
 * 1. User interface management
 *    - Displays user information
 *    - Provides navigation between views
 *    - Handles logout functionality
 * 
 * 2. Access control
 *    - Restricts admin features to admin users
 *    - Controls view access based on user role
 * 
 * 3. State management
 *    - Manages current view state
 *    - Handles view transitions
 * 
 * 4. User experience
 *    - Provides clear navigation
 *    - Shows relevant user information
 *    - Maintains consistent layout
 * 
 * Potential improvements:
 * 1. Add loading states during view transitions
 * 2. Implement view transition animations
 * 3. Add breadcrumb navigation
 * 4. Include user preferences storage
 * 5. Add keyboard navigation shortcuts
 * 6. Implement search functionality
 * 7. Add view-specific toolbars
 * 8. Include error boundaries for each view
 */

/**
 * Main App component serves as the application root.
 * Wraps the entire application with necessary providers and context.
 * 
 * Features:
 * - Authentication provider wrapping
 * - Global app layout
 * - Error boundary potential
 * 
 * @component
 * @returns {JSX.Element} The rendered application
 */
export default function App() {
  return (
    <AuthProvider>
      <div className="app min-h-screen bg-gray-50">
        <AuthenticatedApp />
      </div>
    </AuthProvider>
  );
}

/**
 * Potential future enhancements:
 * 
 * 1. Error Boundary implementation
 *    - Catch and handle runtime errors
 *    - Display user-friendly error messages
 *    - Error reporting to monitoring service
 * 
 * 2. Loading states
 *    - Initial app loading indicator
 *    - Authentication state loading
 *    - Route transition animations
 * 
 * 3. Theme provider
 *    - Dark/light mode toggle
 *    - Custom theme settings
 *    - User theme preferences
 * 
 * 4. Global notifications
 *    - Toast messages for actions
 *    - System notifications
 *    - Status updates
 * 
 * 5. Responsive design improvements
 *    - Mobile-first layouts
 *    - Breakpoint-specific rendering
 *    - Touch interactions
 * 
 * 6. Performance optimizations
 *    - Code splitting
 *    - Lazy loading components
 *    - Memoization of expensive operations
 * 
 * 7. Analytics integration
 *    - User behavior tracking
 *    - Performance monitoring
 *    - Error tracking
 * 
 * 8. Accessibility improvements
 *    - Keyboard navigation
 *    - Screen reader optimization
 *    - ARIA labels and roles
 */
