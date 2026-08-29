import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import CreateCase from './pages/CreateCase';
import CaseDetails from './pages/CaseDetails';
import CaseList from './pages/CaseList';
import AIAssistant from './pages/AIAssistant';
import KnowledgeSearch from './pages/KnowledgeSearch';
import FollowUps from './pages/FollowUps';
import ExpertGuidance from './pages/ExpertGuidance';
import CoordinatorRequests from './pages/CoordinatorRequests';
import CoordinatorMitras from './pages/CoordinatorMitras';
import CoordinatorInsights from './pages/CoordinatorInsights';
import ExpertCases from './pages/ExpertCases';
import PreviousCases from './pages/PreviousCases';
import PreviousCaseDetails from './pages/PreviousCaseDetails';
import Card from './components/Card';
import Button from './components/Button';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Layout & Role State
  const [currentRole, setCurrentRole] = useState('mitra'); // 'mitra' | 'coordinator' | 'expert'
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // URL Parameter simulator state
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [activePreviousCaseId, setActivePreviousCaseId] = useState(null);
  const [activeMitraId, setActiveMitraId] = useState(null);

  // On initial load, restore mock user state if it exists
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUser(parsedUser);
      setCurrentRole(parsedUser.role || 'mitra');
      
      // Default dashboard based on role
      const initialView = parsedUser.role === 'coordinator' 
        ? 'coordinator-dashboard' 
        : parsedUser.role === 'expert' 
          ? 'expert-dashboard' 
          : 'dashboard';
      setCurrentView(initialView);
    }
    setIsAuthLoading(false);
  }, []);

  const handleLoginSuccess = (token, loggedInUser) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setCurrentRole(loggedInUser.role || 'mitra');
    setIsAuthenticated(true);

    const destView = loggedInUser.role === 'coordinator' 
      ? 'coordinator-dashboard' 
      : loggedInUser.role === 'expert' 
        ? 'expert-dashboard' 
        : 'dashboard';
    setCurrentView(destView);
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

  // Demo Switcher triggered via Navbar
  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    if (user) {
      let newName = user.name;
      if (newRole === 'mitra') newName = 'Ananya Rao';
      else if (newRole === 'coordinator') newName = 'Suresh Kumar';
      else if (newRole === 'expert') newName = 'Dr. Priya Sharma';

      const updatedUser = { ...user, role: newRole, name: newName };
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
    }
    
    // Redirect immediately to matching dashboard
    const destView = newRole === 'coordinator' 
      ? 'coordinator-dashboard' 
      : newRole === 'expert' 
        ? 'expert-dashboard' 
        : 'dashboard';
    setCurrentView(destView);
    setActiveCaseId(null);
    setActiveMitraId(null);
  };

  // Navigation controller
  const navigateTo = (viewId, caseId = null, mitraId = null) => {
    if (viewId === 'previous-case-details') {
      setActivePreviousCaseId(caseId);
    } else {
      if (caseId) setActiveCaseId(caseId);
    }
    if (mitraId) setActiveMitraId(mitraId);
    setCurrentView(viewId);
  };

  // Routing Handler Rendering Component Subviews
  const renderCurrentView = () => {
    switch (currentView) {
      // ----------------------------------------------------
      // COMMON VIEWS
      // ----------------------------------------------------
      case 'profile':
        return <Profile user={user} onUserUpdate={handleUserUpdate} />;
      case 'previous-cases':
        return <PreviousCases onNavigate={navigateTo} />;
      case 'previous-case-details':
        return <PreviousCaseDetails previousCaseId={activePreviousCaseId} onNavigate={navigateTo} />;

      // ----------------------------------------------------
      // NYAAYA MITRA VIEWS
      // ----------------------------------------------------
      case 'dashboard':
        return <Dashboard user={user} onNavigate={navigateTo} />;
      case 'cases':
        return <CaseList user={user} onNavigate={navigateTo} />;
      case 'cases-new':
        return <CreateCase user={user} onNavigate={navigateTo} />;
      case 'cases-detail':
        return <CaseDetails caseId={activeCaseId} user={user} onNavigate={navigateTo} />;
      case 'ai-assistant':
        return <AIAssistant caseId={activeCaseId} user={user} onNavigate={navigateTo} />;
      case 'knowledge':
        return <KnowledgeSearch />;
      case 'follow-ups':
        return <FollowUps />;
      case 'guidance':
        return <ExpertGuidance onNavigate={navigateTo} />;

      // ----------------------------------------------------
      // COORDINATOR VIEWS
      // ----------------------------------------------------
      case 'coordinator-dashboard':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">📊 Coordinator Dashboard</h1>
                <p className="text-xs text-gray-500">Welcome back, Suresh Kumar. Triage requests and monitor district case progress.</p>
              </div>
              <div className="text-xs font-semibold text-gray-400 bg-white border border-gray-250 px-3 py-1.5 rounded shadow-sm">
                📍 Scope: State-level caseload monitor
              </div>
            </div>

            {/* Coordinator Stats Grid */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
              <Card className="!p-4 text-center">
                <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Nyaaya Mitras</p>
                <p className="text-2xl font-black text-gray-900 mt-1">24</p>
              </Card>
              <Card className="!p-4 text-center">
                <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Active Cases</p>
                <p className="text-2xl font-black text-gray-900 mt-1">128</p>
              </Card>
              <Card className="!p-4 text-center">
                <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Pending Cases</p>
                <p className="text-2xl font-black text-gray-900 mt-1">18</p>
              </Card>
              <Card className="!p-4 text-center">
                <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Overdue Follow-ups</p>
                <p className="text-2xl font-black text-red-650 mt-1">11</p>
              </Card>
              <Card className="!p-4 text-center">
                <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Expert Requests</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">8</p>
              </Card>
              <Card className="!p-4 text-center">
                <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Requires Attention</p>
                <p className="text-2xl font-black text-red-650 mt-1">6</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2" title="Cases Awaiting Access Allocation" subtitle="Triage dashboard for escalations. Click 'Expert Requests' in sidebar to approve access.">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 border rounded text-xs space-y-1.5">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Case #1056 — Land Inheritance Dispute</span>
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Awaiting Coordinator Review</span>
                    </div>
                    <p className="text-gray-600">Nyaaya Mitra: Ananya Rao | Location: Mandya | Priority: Important</p>
                    <p className="text-[10px] text-gray-500 italic">"AI documentation suggestions reviewed, still need guidance on court caveats."</p>
                  </div>
                  <div className="p-3 bg-gray-50 border rounded text-xs space-y-1.5 opacity-70">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Case #1042 — Domestic Violence Support Request</span>
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Expert Access Enabled</span>
                    </div>
                    <p className="text-gray-600">Nyaaya Mitra: Meena Kumar | Location: Mysuru | Priority: Urgent</p>
                    <p className="text-[10px] text-gray-500 italic">Assigned Legal Expert: Dr. Priya Sharma (Under Review)</p>
                  </div>
                </div>
              </Card>

              <div className="space-y-6">
                <Card title="Monitoring Guidelines">
                  <div className="space-y-3 text-xs text-gray-650 leading-relaxed">
                    <p><strong>Primary Function:</strong> Facilitate access to certified human legal advice. You do not write recommendations yourself.</p>
                    <p><strong>Triage Rules:</strong> Review what knowledge the Nyaaya Mitra has already checked (AI chat suggestions, local documents) before clicking <em>Enable Expert Access</em>.</p>
                  </div>
                </Card>

                <Card title="Organizational Knowledge" subtitle="50 Resolved Cases">
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1 bg-gray-50 border p-2 rounded">
                      <span className="font-bold text-gray-700 block text-[9px] uppercase tracking-wide">Common Issues:</span>
                      <span className="text-gray-850 font-semibold block">• Land / Property (12)</span>
                      <span className="text-gray-850 font-semibold block">• Government Schemes (6)</span>
                      <span className="text-gray-850 font-semibold block">• Employment (6)</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full text-center justify-center font-bold text-emerald-705 bg-white border-gray-300 hover:bg-emerald-50"
                      onClick={() => navigateTo('previous-cases')}
                    >
                      View Previous Cases
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      case 'coordinator-mitras':
        return <CoordinatorMitras />;
      case 'coordinator-mitra-detail':
        return (
          <div className="space-y-4">
            <h1 className="text-xl font-bold">Caseload Portfolio - Mitra ID #{activeMitraId}</h1>
            <Card title="Activity Feed">
              <p className="text-sm">Workload logs and outstanding tasks.</p>
            </Card>
          </div>
        );
      case 'coordinator-cases':
        return (
          <div className="space-y-4">
            <h1 className="text-xl font-bold">District Cases Monitor</h1>
            <Card title="State Caseload Table">
              <p className="text-sm">Cross-district status tracker.</p>
            </Card>
          </div>
        );
      case 'coordinator-guidance-requests':
        return <CoordinatorRequests onNavigate={navigateTo} />;
      case 'coordinator-activity':
        return (
          <div className="space-y-4">
            <h1 className="text-xl font-bold">Team Activity Logs</h1>
            <Card title="Transaction Audit Trail">
              <p className="text-sm">Audit list of creations and updates.</p>
            </Card>
          </div>
        );
      case 'coordinator-insights':
        return <CoordinatorInsights />;
      case 'coordinator-reports':
        return (
          <div className="space-y-4">
            <h1 className="text-xl font-bold">Reports Center</h1>
            <Card title="PDF export presets">
              <p className="text-sm">Caseload export wizard.</p>
            </Card>
          </div>
        );

      // ----------------------------------------------------
      // LEGAL EXPERT VIEWS
      // ----------------------------------------------------
      case 'expert-dashboard':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">👨‍⚖️ Legal Expert Dashboard</h1>
                <p className="text-xs text-gray-500">Welcome back, Dr. Priya Sharma. Review cases where expert access has been enabled.</p>
              </div>
              <div className="text-xs font-semibold text-gray-400 bg-white border border-gray-250 px-3 py-1.5 rounded shadow-sm">
                📍 Role: Certified Human Guide
              </div>
            </div>

            {/* Expert Stats Grid */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Card className="!p-4 text-center">
                <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Guidance Requests</p>
                <p className="text-3xl font-black text-gray-900 mt-1">12</p>
              </Card>
              <Card className="!p-4 text-center">
                <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Urgent Requests</p>
                <p className="text-3xl font-black text-red-600 mt-1">3</p>
              </Card>
              <Card className="!p-4 text-center">
                <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Under Review</p>
                <p className="text-3xl font-black text-amber-600 mt-1">5</p>
              </Card>
              <Card className="!p-4 text-center">
                <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Completed Reviews</p>
                <p className="text-3xl font-black text-green-600 mt-1">24</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2" title="Cases Awaiting Your Guidance" subtitle="Review case details and submit professional recommendations.">
                <div className="space-y-3">
                  <div className="p-3 bg-white border rounded-lg text-xs space-y-2 hover:border-emerald-350 transition-colors shadow-sm">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Case #1056 — Land Inheritance Dispute</span>
                      <span className="text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[10px]">Expert Access Enabled</span>
                    </div>
                    <p className="text-gray-650">Mitra: Ananya Rao | Location: Mandya | Priority: Important</p>
                    <p className="text-[10px] text-gray-500 font-semibold border-t pt-1.5">Question: Challenge validity of notarized sheets for land partition exceeding Rs 100.</p>
                  </div>
                  <div className="p-3 bg-white border rounded-lg text-xs space-y-2 hover:border-emerald-350 transition-colors shadow-sm">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Case #1042 — Domestic Violence Support Request</span>
                      <span className="text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-[10px] animate-pulse">Under Review</span>
                    </div>
                    <p className="text-gray-655">Mitra: Meena Kumar | Location: Mysuru | Priority: Urgent</p>
                    <p className="text-[10px] text-gray-500 font-semibold border-t pt-1.5">Question: Emergency shelter access under Section 19 before magistrates hearing.</p>
                  </div>
                </div>
              </Card>

              <div className="space-y-6">
                <Card title="Expert Mandate Guidelines">
                  <div className="space-y-3 text-xs text-gray-650 leading-relaxed">
                    <p><strong>Professional advice:</strong> Your recommendations are logged directly into the Nyaaya Mitra case timelines.</p>
                    <p><strong>AI Separation:</strong> Review the references compiled in the <em>AI-Assisted Knowledge</em> folder, but provide human guidance based on experience.</p>
                  </div>
                </Card>

                <Card title="Previous Case Knowledge" subtitle="50 Resolved Cases">
                  <div className="space-y-3 text-xs">
                    <div className="space-y-2">
                      <span className="font-bold text-gray-450 block text-[9px] uppercase tracking-wide">Recently Reviewed:</span>
                      <div className="p-2 bg-gray-50 border rounded font-semibold text-gray-800">
                        <span className="font-bold text-gray-400 block text-[9px]">PC-001</span>
                        Agricultural Land Inheritance
                      </div>
                      <div className="p-2 bg-gray-50 border rounded font-semibold text-gray-800">
                        <span className="font-bold text-gray-400 block text-[9px]">PC-019</span>
                        Property Inheritance
                      </div>
                      <div className="p-2 bg-gray-50 border rounded font-semibold text-gray-800">
                        <span className="font-bold text-gray-400 block text-[9px]">PC-038</span>
                        Land Inheritance
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full text-center justify-center font-bold text-emerald-705 bg-white border-gray-300 hover:bg-emerald-50"
                      onClick={() => navigateTo('previous-cases')}
                    >
                      View Previous Cases
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      case 'expert-cases':
        return <ExpertCases onNavigate={navigateTo} />;
      case 'expert-guidance':
        return <ExpertCases onNavigate={navigateTo} />;
      case 'expert-resources':
        return (
          <div className="space-y-4">
            <h1 className="text-xl font-bold">Knowledge Resources</h1>
            <Card title="Library Index">
              <p className="text-sm">Faq citations files.</p>
            </Card>
          </div>
        );
      case 'expert-activity':
        return (
          <div className="space-y-4">
            <h1 className="text-xl font-bold">My Activity Trail</h1>
            <Card title="Advisories History">
              <p className="text-sm">Log of submitted reviews.</p>
            </Card>
          </div>
        );

      case '404':
      default:
        return <NotFound onGoHome={() => setCurrentView(currentRole === 'coordinator' ? 'coordinator-dashboard' : (currentRole === 'expert' ? 'expert-dashboard' : 'dashboard'))} />;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-emerald-600 mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-semibold text-gray-500">Synchronizing database session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-full">
      {/* Sidebar navigation drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPage={currentView}
        onNavigate={(viewId) => navigateTo(viewId)}
        currentRole={currentRole}
      />

      {/* Main content wrapper */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top sticky navbar */}
        <Navbar
          projectName="OutLawed India Legal-Aid Portal"
          userName={user?.name || '[USER NAME]'}
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          onMenuClick={() => setIsSidebarOpen(true)}
          onLogout={handleLogout}
          onNavigate={navigateTo}
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
