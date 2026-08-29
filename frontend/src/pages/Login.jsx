import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Reusable Login Page Component
 * @param {Object} props
 * @param {function} props.onLoginSuccess - Callback when login credentials are valid
 */
export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  // Field validation
  const validateForm = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // ==========================================
      // [LOGIN API] PLACEHOLDER
      // Tomorrow: Replace this block with a real axios call:
      //
      // const response = await apiClient.post('/auth/login', { email, password });
      // const { token, user } = response.data;
      // onLoginSuccess(token, user);
      // ==========================================
      
      // Simulating API latency
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (email === 'demo@example.com' && password === 'password') {
        const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fakeToken';
        const fakeUser = { id: 'u1', name: 'Alex Johnson', email: 'demo@example.com' };
        onLoginSuccess(fakeToken, fakeUser);
      } else {
        throw new Error('Invalid email or password. Use the demo credentials to log in.');
      }
    } catch (err) {
      setApiError(err.message || 'Unauthorized response. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoCredentials = () => {
    setEmail('demo@example.com');
    setPassword('password');
    setErrors({});
    setApiError(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 font-extrabold text-white text-2xl shadow-sm">
            G
          </div>
          {/* [PROJECT NAME] Placeholder */}
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900">
            [PROJECT NAME]
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Hackathon Starter Dashboard
          </p>
        </div>

        {/* Global API Error Alert */}
        {apiError && (
          <ErrorMessage 
            title="Authentication Failed" 
            message={apiError} 
            onRetry={handleLoginSubmit} 
          />
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
          <div className="space-y-4">
            <Input
              label="Email address"
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="e.g. team@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-700">
                Remember device
              </label>
            </div>

            {/* Forgot password placeholder */}
            <div className="text-xs">
              <a href="#" className="font-semibold text-primary-600 hover:text-primary-500">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full text-center"
            >
              Sign In
            </Button>
          </div>
        </form>

        {/* Demo Helper Button */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-400">Quick Start</span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            onClick={loadDemoCredentials}
            className="w-full bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Load Demo Credentials
          </Button>
        </div>
      </div>
    </div>
  );
}
