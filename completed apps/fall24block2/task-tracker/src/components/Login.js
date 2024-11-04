// components/Login.js
import { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/authContext';


/**
 * Login component that handles user authentication.
 * Provides a form for users to enter credentials and handles the login process.
 * Uses the AuthContext to manage authentication state.
 * 
 * Features:
 * - Email and password validation
 * - Error handling and display
 * - Controlled form inputs
 * - Integration with authentication context
 * 
 * @component
 */
export function Login() {
  // State for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State for handling login errors
  const [error, setError] = useState('');
  
  // Get login function from auth context
  const { login } = useAuth();

  /**
   * Handles form submission for login.
   * Validates inputs and attempts to log in the user.
   * 
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {


      // Attempt login
      login(username, password);
      
      // Clear any existing errors on successful login
      setError('');
    } catch (err) {
      // Handle login errors
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold">Login</h2>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input Group */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium"
            >
              Email
            </label>
            <Input
              id="username"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="mt-1"
              required
              // Add aria-label for accessibility
              aria-label="Username"
              // Add aria-invalid when there's an error
              aria-invalid={error ? 'true' : 'false'}
            />
          </div>

          {/* Password Input Group */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1"
              // Add aria-label for accessibility
              aria-label="Password"
              // Add aria-invalid when there's an error
              aria-invalid={error ? 'true' : 'false'}
            />
          </div>

          {/* Error Alert */}
          {error && (
            <Alert 
              variant="destructive"
              // Add role="alert" for accessibility
              role="alert"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            // Disable button while logging in (could add loading state)
            // disabled={isLoading}
          >
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/**
 * Additional component features that could be added:
 * 
 * 1. Loading state during login attempt
 * 2. Remember me checkbox
 * 3. Forgot password link
 * 4. Sign up link for new users
 * 5. OAuth integration for social login
 * 6. Password visibility toggle
 * 7. Rate limiting for failed attempts
 * 8. Auto-focus on email input on mount
 * 9. Form persistence between renders
 * 10. Password strength requirements
 */
