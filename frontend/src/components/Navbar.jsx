import React from 'react';
import { Menu, Bell, LogOut, User } from 'lucide-react';

/**
 * Reusable Navbar Component for Dashboard Layout
 * @param {Object} props
 * @param {string} [props.projectName='[PROJECT NAME]']
 * @param {string} [props.userName='[USER NAME]']
 * @param {function} props.onMenuClick - callback to toggle mobile sidebar
 * @param {function} props.onLogout - callback for logging out
 */
export default function Navbar({
  projectName = '[PROJECT NAME]',
  userName = '[USER NAME]',
  onMenuClick,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      {/* Left side: Hamburger (mobile only) and Project Logo/Title */}
      <div className="flex items-center gap-x-4">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 lg:hidden p-1.5 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        
        {/* Logo Placeholder */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 font-bold text-white shadow-sm">
            G
          </div>
          <span className="hidden sm:inline-block text-lg font-bold text-gray-900 tracking-tight">
            {projectName}
          </span>
        </div>
      </div>

      {/* Right side: Notifications, Profile, Logout */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Notification Bell Placeholder */}
        <button
          type="button"
          className="relative text-gray-400 hover:text-gray-500 p-1.5 rounded-full hover:bg-gray-150 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" aria-hidden="true" />
          <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Vertical divider */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

        {/* User Profile Info */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 border border-gray-300">
            <User className="h-4.5 w-4.5" />
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-semibold text-gray-900 leading-none">{userName}</span>
            <span className="text-[10px] text-gray-500 mt-0.5">Team Member</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-red-600 transition-colors py-1.5 px-3 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
