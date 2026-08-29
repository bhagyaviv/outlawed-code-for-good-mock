import React, { useState } from 'react';
import { 
  Bot, 
  Eye, 
  EyeOff, 
  Lock, 
  Shield, 
  Layers, 
  BookOpen, 
  Users, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Redesigned OutLawed Login Component
 * @param {Object} props
 * @param {function} props.onLoginSuccess - Callback when login completes
 */
export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  // Field validation
  const validateForm = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Username/Email is required';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 4) {
      tempErrors.password = 'Password must be at least 4 characters';
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
      // Simulating authentication delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Match demo roles for custom username logins
      if (email.includes('ananya') || email.includes('mitra')) {
        onLoginSuccess('fake-token-mitra', { name: 'Ananya Rao', role: 'mitra', email: 'ananya.rao@outlawed.org' });
      } else if (email.includes('suresh') || email.includes('coordinator')) {
        onLoginSuccess('fake-token-coordinator', { name: 'Suresh Kumar', role: 'coordinator', email: 'suresh.kumar@outlawed.org' });
      } else if (email.includes('priya') || email.includes('expert')) {
        onLoginSuccess('fake-token-expert', { name: 'Dr. Priya Sharma', role: 'expert', email: 'priya.sharma@outlawed.org' });
      } else {
        // Default Mitra login fallback
        onLoginSuccess('fake-token-default', { name: 'Ananya Rao', role: 'mitra', email: email });
      }
    } catch (err) {
      setApiError('Incorrect credentials. Select a demo workspace to log in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = (role) => {
    setIsLoading(true);
    setTimeout(() => {
      if (role === 'mitra') {
        onLoginSuccess('fake-token-mitra', { name: 'Ananya Rao', role: 'mitra', email: 'ananya.rao@outlawed.org' });
      } else if (role === 'coordinator') {
        onLoginSuccess('fake-token-coordinator', { name: 'Suresh Kumar', role: 'coordinator', email: 'suresh.kumar@outlawed.org' });
      } else if (role === 'expert') {
        onLoginSuccess('fake-token-expert', { name: 'Dr. Priya Sharma', role: 'expert', email: 'priya.sharma@outlawed.org' });
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-12 bg-gray-50">
      
      {/* LEFT COLUMN: PRODUCT INTRODUCTION (Hidden on small screens) */}
      <div className="hidden lg:flex lg:col-span-5 bg-emerald-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative background vectors */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-100 via-emerald-800 to-emerald-900 pointer-events-none" />
        
        {/* Logo and Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold tracking-wider text-emerald-300">OUTLAWED</span>
          </div>
          <h2 className="text-xl font-bold mt-2 text-emerald-50">
            Intelligent Legal-Aid Knowledge & Case Management Platform
          </h2>
          <p className="text-xs mt-3 text-emerald-200 leading-relaxed max-w-sm">
            Empowering grassroots legal-aid teams with knowledge, AI-assisted discovery, and human legal expertise.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="relative z-10 space-y-4 my-8">
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-3 flex gap-3 items-start shadow-sm">
            <div className="p-2 bg-white/10 rounded text-emerald-300">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-50">🤖 AI-Assisted Knowledge</h4>
              <p className="text-[10px] text-emerald-200 leading-relaxed mt-1">
                Ask questions, search organizational knowledge, find similar cases, and understand relevant information.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-3 flex gap-3 items-start shadow-sm">
            <div className="p-2 bg-white/10 rounded text-emerald-300">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-50">📊 Coordinator Monitoring</h4>
              <p className="text-[10px] text-emerald-200 leading-relaxed mt-1">
                Monitor case progress, follow-ups, and requests for additional support.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-3 flex gap-3 items-start shadow-sm">
            <div className="p-2 bg-white/10 rounded text-emerald-300">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-50">⚖️ Human Legal Expertise</h4>
              <p className="text-[10px] text-emerald-200 leading-relaxed mt-1">
                Connect cases with a human Legal Expert when additional guidance is required.
              </p>
            </div>
          </div>

        </div>

        {/* Business Flow Visual */}
        <div className="relative z-10 border-t border-white/10 pt-4 text-center">
          <p className="text-[9px] uppercase tracking-wider text-emerald-300 font-bold mb-2">Platform Flow</p>
          <div className="flex justify-between items-center bg-black/10 p-2 rounded text-[10px] border border-white/5">
            <span className="font-semibold">Nyaaya Mitra</span>
            <ArrowRight className="h-3 w-3 text-emerald-400" />
            <span className="text-emerald-200">AI Assist</span>
            <ArrowRight className="h-3 w-3 text-emerald-400" />
            <span className="text-emerald-200">Knowledge</span>
            <ArrowRight className="h-3 w-3 text-emerald-400" />
            <span className="font-semibold">Human Expert</span>
          </div>
          <p className="text-[10px] italic text-emerald-200 mt-3 font-semibold">
            "AI assists. Nyaaya Mitras act. Coordinators monitor. Human Legal Experts guide."
          </p>
        </div>

      </div>

      {/* RIGHT COLUMN: LOGIN FORM */}
      <div className="flex-1 lg:col-span-7 flex flex-col justify-between p-8 sm:p-12">
        <div className="max-w-md mx-auto w-full space-y-6 pt-8">
          
          <div>
            <span className="lg:hidden text-2xl font-black text-emerald-700 tracking-wider">OUTLAWED</span>
            <h2 className="text-xl font-black text-gray-900 mt-2">Welcome to OutLawed</h2>
            <p className="text-xs text-gray-500 mt-1">Sign in to continue to your workspace.</p>
          </div>

          {/* Secure Access Warning Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs flex gap-2 items-start shadow-sm">
            <Lock className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-800">🔒 Secure Access for Authorized Users</span>
              <p className="text-[10px] text-emerald-650 leading-relaxed mt-0.5">
                Case information is protected by role-based access controls. Authorized intake logs audited automatically.
              </p>
            </div>
          </div>

          {apiError && (
            <ErrorMessage 
              title="Sign In Failed" 
              message={apiError} 
              onRetry={handleLoginSubmit} 
            />
          )}

          {/* Standard Form */}
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <Input
              label="Email / Username"
              id="login-email"
              type="text"
              placeholder="e.g. ananya.rao@outlawed.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={isLoading}
            />

            <div className="relative">
              <Input
                label="Password"
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-8.5 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 mr-1.5"
                />
                Remember me
              </label>
              <a href="#" onClick={(e) => {e.preventDefault(); alert('Password recovery details can be reset by contacting your Coordinator.');}} className="text-emerald-700 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full justify-center bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              Sign In
            </Button>
          </form>

          {/* DEMO WORKSPACE TRIGGER */}
          <div className="border-t border-gray-250 pt-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-700">Try Demo Workspace</span>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Demo Mode — Mock Data
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => handleDemoAccess('mitra')}
                className="text-xs !py-2 !px-1 text-center justify-center font-bold bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                disabled={isLoading}
              >
                Nyaaya Mitra
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDemoAccess('coordinator')}
                className="text-xs !py-2 !px-1 text-center justify-center font-bold bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                disabled={isLoading}
              >
                Coordinator
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDemoAccess('expert')}
                className="text-xs !py-2 !px-1 text-center justify-center font-bold bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                disabled={isLoading}
              >
                Legal Expert
              </Button>
            </div>

            {/* Fictional credentials notes */}
            <div className="bg-gray-100 rounded p-2.5 text-[9px] text-gray-550 space-y-1">
              <div className="flex justify-between">
                <span>Nyaaya Mitra:</span>
                <span className="font-bold text-gray-700">Ananya Rao</span>
              </div>
              <div className="flex justify-between">
                <span>Coordinator:</span>
                <span className="font-bold text-gray-700">Suresh Kumar</span>
              </div>
              <div className="flex justify-between">
                <span>Legal Expert:</span>
                <span className="font-bold text-gray-700">Dr. Priya Sharma</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-gray-400 mt-12 border-t pt-4">
          <p className="font-bold">OutLawed • Code for Good Mock Hackathon</p>
          <p className="mt-0.5">Demo Prototype • Grassroots Case File Manager</p>
        </div>

      </div>

    </div>
  );
}
