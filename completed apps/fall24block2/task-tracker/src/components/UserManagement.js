import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { authService } from '../services/authService';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';

/**
 * UserManagement Component
 * Provides interface for administrators to manage system users.
 * Includes functionality for creating, viewing, and deleting users.
 * Only accessible to users with admin role.
 */
export function UserManagement() {
  // Get current user info from auth context for permission checking
  const { user: currentUser } = useAuth();
  
  // State management
  const [users, setUsers] = useState([]); // List of all users
  const [error, setError] = useState(null); // Error message handling
  
  // Form state for new user creation
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user' // Default role for new users
  });

  /**
   * Load users when component mounts
   * Uses useEffect to avoid multiple simultaneous data fetches
   */
  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Fetches current list of users from the server
   * Updates users state or sets error message if fetch fails
   */
  const loadUsers = async () => {
    try {
      const users = await authService.getAllUsers();
      setUsers(users);
    } catch (err) {
      setError('Failed to load users');
      console.error('Load users error:', err);
    }
  };

  /**
   * Handles new user creation form submission
   * Validates input, creates user, and refreshes user list
   * 
   * @param {Event} e - Form submission event
   */
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      // Validate email format
      if (!newUser.email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }

      // Validate password length
      if (newUser.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      // Create new user
      await authService.createUser(newUser);
      
      // Reset form to initial state
      setNewUser({ 
        email: '', 
        password: '', 
        name: '', 
        role: 'user' 
      });
      
      // Refresh user list
      loadUsers();
      
      // Clear any existing errors
      setError(null);
    } catch (err) {
      setError('Failed to create user');
      console.error('Create user error:', err);
    }
  };

  /**
   * Handles user deletion
   * Includes safety checks and confirmation
   * 
   * @param {string} userId - ID of user to delete
   */
  const handleDeleteUser = async (userId) => {
    // Prevent self-deletion
    if (userId === currentUser.id) {
      setError("You can't delete your own account!");
      return;
    }

    // Confirm deletion
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await authService.deleteUser(userId);
        loadUsers(); // Refresh user list after deletion
        setError(null);
      } catch (err) {
        setError('Failed to delete user');
        console.error('Delete user error:', err);
      }
    }
  };

  // Access control - only allow admin access
  if (currentUser.role !== 'admin') {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">User Management</h2>
        </CardHeader>
        <CardContent>
          {/* User Creation Form */}
          <form onSubmit={handleCreateUser} className="mb-6 space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium">
                Email
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
                placeholder="user@example.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium">
                Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                required
                placeholder="Minimum 6 characters"
              />
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium">
                Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                required
                placeholder="Full Name"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="w-full rounded-md border p-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <Button type="submit">Create User</Button>
          </form>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* User List Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Users</h3>
            {/* Map through users and display them */}
            {users.map(user => (
              <Card key={user.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">Role: {user.role}</p>
                  </div>
                  {/* Delete Button - disabled for current user */}
                  <Button 
                    variant="destructive"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.id === currentUser.id}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}