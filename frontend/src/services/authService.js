import apiClient from './api';

// Simulate API lag
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  /**
   * Mock login validating role attributes
   * Tomorrow: Replace with POST request to `/auth/login`
   */
  login: async (email, password) => {
    await delay(1000);
    
    // Demo account routing
    let role = 'mitra';
    let name = 'Sarah Connor';
    
    if (email === 'coordinator@outlawed.org') {
      role = 'coordinator';
      name = 'Vikram Sen';
    } else if (email === 'expert@outlawed.org') {
      role = 'expert';
      name = 'Dr. Vivek Hegde';
    } else if (email === 'demo@example.com' || email.includes('mitra')) {
      role = 'mitra';
      name = 'Sarah Connor';
    } else {
      throw new Error('Invalid email or password. Use demo emails for testing.');
    }

    const mockResponse = {
      token: 'mock-jwt-token-outlawed',
      user: {
        id: role === 'mitra' ? 'm1' : (role === 'coordinator' ? 'c1' : 'e1'),
        name,
        email,
        role // 'mitra' | 'coordinator' | 'expert'
      }
    };

    return mockResponse;
  },

  logout: async () => {
    await delay(200);
    return true;
  }
};

export default authService;
