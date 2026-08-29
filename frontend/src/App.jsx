import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Card from './components/Card';
import Button from './components/Button';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Layout State
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard | features | reports | profile | settings | 404
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // On initial render: Check if user session details are present in localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setIsAuthLoading(false);
  }, []);

  const handleLoginSuccess = (token, loggedInUser) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleUserUpdate = (updatedUser) => {
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // Render view router switcher
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'profile':
        return <Profile user={user} onUserUpdate={handleUserUpdate} />;
      
      // Placeholders for secondary routes - customize tomorrow!
      case 'features':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Main Feature Page</h1>
              <p className="text-xs text-gray-500">Tomorrow's custom application code goes here.</p>
            </div>
            <Card title="Feature Container" subtitle="Modify or replace this panel with domain-specific components.">
              <div className="py-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-md">
                <p className="text-sm font-semibold text-gray-700">No feature components mounted yet.</p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Add custom views, hooks, maps, or real-time tracking dashboards within this page template.
                </p>
                <Button 
                  onClick={() => setCurrentView('dashboard')} 
                  className="mt-4 text-xs font-semibold"
                >
                  Return to Dashboard Home
                </Button>
              </div>
            </Card>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Reports & Diagnostics</h1>
              <p className="text-xs text-gray-500">Aggregate logs, chart panels, and summary export tools.</p>
            </div>
            <Card title="Reports Container" subtitle="Ready to connect with database aggregation endpoints.">
              <div className="py-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-md">
                <p className="text-sm font-semibold text-gray-700">No charts or stats plots configured.</p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Integrate lightweight libraries like Chart.js or Recharts to visualize logs and metrics.
                </p>
              </div>
            </Card>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">App Configurations</h1>
              <p className="text-xs text-gray-500">API keys, system levels, and environmental toggles.</p>
            </div>
            <Card title="System Settings" subtitle="Mock configurations.">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-150">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Mock Webhook Triggers</p>
                    <p className="text-xs text-gray-400 mt-0.5">Send alerts automatically during critical transactions.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded border-gray-300" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Production Mode Bypass</p>
                    <p className="text-xs text-gray-400 mt-0.5">Mock CORS integrations without strict environment configurations.</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded border-gray-300" />
                </div>
              </div>
            </Card>
          </div>
        );
      case '404':
      default:
        return <NotFound onGoHome={() => setCurrentView('dashboard')} />;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-primary-600 mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-semibold text-gray-500">Checking session status...</span>
        </div>
      </div>
    );
  }

  // Not authenticated: render Login page directly
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Authenticated layout shell
  return (
    <div className="min-h-full">
      {/* Sidebar navigation drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPage={currentView}
        onNavigate={(viewId) => setCurrentView(viewId)}
      />

      {/* Main content wrapper */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top sticky navbar */}
        <Navbar
          projectName="[PROJECT NAME]"
          userName={user?.name || '[USER NAME]'}
          onMenuClick={() => setIsSidebarOpen(true)}
          onLogout={handleLogout}
        />

        {/* Dynamic page container */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  );
}
