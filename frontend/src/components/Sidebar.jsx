import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  BarChart3, 
  User, 
  Settings, 
  X 
} from 'lucide-react';

/**
 * Reusable Responsive Sidebar Component
 * @param {Object} props
 * @param {boolean} props.isOpen - mobile drawer open state
 * @param {function} props.onClose - callback to close mobile drawer
 * @param {string} props.currentPage - current view ID for active highlight
 * @param {function} props.onNavigate - callback to change page view
 */
export default function Sidebar({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'features', label: 'Main Feature', icon: Sparkles },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Helper for applying link styling based on active state
  const getLinkClass = (itemId) => {
    const base = "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group";
    const active = "bg-primary-50 text-primary-700 border-l-4 border-primary-600";
    const inactive = "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent";
    return currentPage === itemId ? `${base} ${active}` : `${base} ${inactive}`;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header section in sidebar */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200 justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 font-bold text-white shadow-sm">
            G
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">Code for Good</span>
        </div>
        {/* Mobile close button inside the sidebar */}
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onClose(); // Close mobile drawer
              }}
              className="w-full text-left"
            >
              <div className={getLinkClass(item.id)}>
                <Icon className={`h-5 w-5 shrink-0 ${currentPage === item.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer section (e.g. version or copyright info) */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-[10px] font-medium text-gray-400 text-center">3-Person Hackathon Template</p>
        <p className="text-[10px] text-gray-400 text-center mt-0.5">Ready to Customize</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed, always visible on large screen) */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64 lg:overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer (Visible when isOpen is true) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay backdrop */}
          <div 
            className="fixed inset-0 bg-gray-65/75 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={onClose} 
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs transition duration-300 ease-in-out">
            <div className="w-full flex-1">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
