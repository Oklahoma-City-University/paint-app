const BASE_URL = 'http://localhost:3001';

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/users?email=${email}`);
      const users = await response.json();
      
      const user = users[0];
      if (user && user.password === password) {
        // Remove password before storing/returning user data
        const { password: _, ...safeUser } = user;
        return safeUser;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  async getCurrentUser() {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) return null;
      
      const user = JSON.parse(userJson);
      const response = await fetch(`${BASE_URL}/users/${user.id}`);
      if (!response.ok) {
        localStorage.removeItem('user');
        return null;
      }
      const currentUser = await response.json();
      const { password: _, ...safeUser } = currentUser;
      return safeUser;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
  
  async getAllUsers() {
    try {
      const response = await fetch(`${BASE_URL}/users`);
      const users = await response.json();
      // Remove passwords before returning
      return users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          id: Date.now().toString(), // Simple ID generation
        }),
      });
      const newUser = await response.json();
      const { password, ...safeUser } = newUser;
      return safeUser;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  async updateUser(id, userData) {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const updatedUser = await response.json();
      const { password, ...safeUser } = updatedUser;
      return safeUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }
};