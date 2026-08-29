import apiClient from './api';

export const authService = {
  /**
   * Log in via Spring Boot /api/auth/login endpoint
   */
  login: async (emailOrUsername, password) => {
    // Extract username prefix if email is entered (e.g., "mitra@outlawed.org" -> "mitra")
    let username = emailOrUsername;
    if (emailOrUsername.includes('@')) {
      username = emailOrUsername.split('@')[0];
    }

    const response = await apiClient.post('/auth/login', { username, password });
    const user = response.data;

    // Save mock token to local storage for Axios request interceptors
    localStorage.setItem('authToken', 'mock-jwt-token-outlawed');

    return {
      token: 'mock-jwt-token-outlawed',
      user: {
        id: user.id.toString(),
        name: user.name,
        email: emailOrUsername,
        role: user.role
      }
    };
  },

  logout: async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    return true;
  }
};

export default authService;
