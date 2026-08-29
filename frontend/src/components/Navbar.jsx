import React, { useState } from 'react';
import { Menu, Bell, LogOut, User, X } from 'lucide-react';

/**
 * Reusable Navbar Component with Interactive Notifications & Role Switcher
 * @param {Object} props
 * @param {string} [props.projectName='OutLawed India']
 * @param {string} [props.userName='Ananya Rao']
 * @param {string} [props.currentRole='mitra']
 * @param {function} props.onRoleChange - switcher callback
 * @param {function} props.onMenuClick - mobile menu callback
 * @param {function} props.onLogout - session logout callback
 * @param {function} props.onNavigate - route handler callback
 */
export default function Navbar({
  projectName = 'OutLawed India',
  userName = 'Ananya Rao',
  currentRole = 'mitra',
  onRoleChange,
  onMenuClick,
  onLogout,
  onNavigate,
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const getNotifications = () => {
    switch (currentRole) {
      case 'coordinator':
        return [
          { id: 'n1', text: '⚠️ Guidance requested: Case #1056 by Ananya Rao', view: 'coordinator-guidance-requests', param: null },
          { id: 'n2', text: '📁 Case #1042: Triage complete, assigned to Dr. Priya Sharma', view: 'coordinator-dashboard', param: null }
        ];
      case 'expert':
        return [
          { id: 'n1', text: '📁 Case #1056 assigned for review by Suresh Kumar', view: 'expert-cases', param: null },
          { id: 'n2', text: '📁 Case #1042: Urgent domestic violence file pending action', view: 'expert-cases', param: null }
        ];
      case 'mitra':
      default:
        return [
          { id: 'n1', text: '🔓 Expert access enabled for Case #1056 by Suresh Kumar', view: 'cases-detail', param: '1056' },
          { id: 'n2', text: '📁 Case #1056: Substituted documents requested by Suresh Kumar', view: 'cases-detail', param: '1056' }
        ];
    }
  };

  const notifications = getNotifications();

  const handleNotificationClick = (item) => {
    setShowNotifications(false);
    if (onNavigate) {
      onNavigate(item.view, item.param);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      {/* Left side: Hamburger (mobile only) and Project Logo/Title */}
      <div className="flex items-center gap-x-4">
        <button
          type="button"
          className="text-gray-505 hover:text-gray-700 lg:hidden p-1.5 rounded-md hover:bg-gray-150 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        
        {/* Logo Placeholder */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-extrabold text-white shadow-sm">
            OL
          </div>
          <span className="hidden sm:inline-block text-base font-bold text-gray-900 tracking-tight">
            {projectName}
          </span>
        </div>
      </div>

      {/* Right side: Role selector, Notifications, Profile, Logout */}
      <div className="flex items-center gap-x-4 lg:gap-x-6 relative">
        
        {/* Demo Role Switcher Dropdown */}
        {onRoleChange && (
          <div className="flex items-center gap-1.5">
            <span className="hidden md:inline-block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Demo Role:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="text-xs font-semibold bg-gray-50 border border-gray-300 text-gray-700 rounded-md py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
            >
              <option value="mitra">Nyaaya Mitra (Doer)</option>
              <option value="coordinator">Coordinator (Supervisor)</option>
              <option value="expert">Legal Expert (Guide)</option>
            </select>
          </div>
        )}

        {/* Interactive Notification Bell */}
        <div className="relative">
          <button
            type="button"
            className="relative text-gray-450 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8px] font-bold text-white ring-2 ring-white">
              {notifications.length}
            </span>
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-72 rounded-md bg-white py-1.5 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-200">
              <div className="flex items-center justify-between border-b pb-2 px-3 mb-1">
                <span className="text-xs font-bold text-gray-900">Notifications Desk</span>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {notifications.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className="w-full text-left px-3 py-2 text-[11px] hover:bg-emerald-50/50 border-b border-gray-50 flex flex-col gap-0.5 transition-colors"
                  >
                    <span className="font-semibold text-gray-800 leading-snug">{item.text}</span>
                    <span className="text-[9px] text-gray-400 font-medium">Just now • Click to inspect</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

        {/* User Profile Info */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 border border-gray-300">
            <User className="h-4.5 w-4.5" />
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-semibold text-gray-900 leading-none">{userName}</span>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              {currentRole === 'mitra' ? 'Nyaaya Mitra' : currentRole === 'coordinator' ? 'Coordinator' : 'Legal Expert'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="text-gray-450 hover:text-red-650 p-1.5 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          title="Sign Out"
        >
          <LogOut className="h-5 w-5" />
        </button>

      </div>
    </header>
  );
}
