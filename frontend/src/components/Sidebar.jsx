import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Search, 
  Calendar, 
  HelpCircle, 
  User, 
  Users, 
  TrendingUp, 
  Activity, 
  FileText, 
  X,
  BookOpen,
  Scale,
  Bot,
  UserCheck
} from 'lucide-react';

/**
 * Reusable Responsive Sidebar Component
 * @param {Object} props
 * @param {boolean} props.isOpen - mobile drawer open state
 * @param {function} props.onClose - callback to close mobile drawer
 * @param {string} props.currentPage - current view ID for active highlight
 * @param {function} props.onNavigate - callback to change page view
 * @param {string} [props.currentRole='mitra'] - user role context
 */
export default function Sidebar({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  currentRole = 'mitra',
}) {
  
  const getMenuItems = () => {
    switch (currentRole) {
      case 'coordinator':
        return [
          { id: 'coordinator-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'coordinator-mitras', label: 'Nyaaya Mitras', icon: Users },
          { id: 'coordinator-cases', label: 'Cases', icon: Briefcase },
          { id: 'previous-cases', label: 'View Previous Cases', icon: BookOpen },
          { id: 'coordinator-guidance-requests', label: 'Expert Requests', icon: UserCheck },
          { id: 'coordinator-activity', label: 'Team Activity', icon: Activity },
          { id: 'coordinator-insights', label: 'Community Insights', icon: TrendingUp },
          { id: 'coordinator-reports', label: 'Reports', icon: FileText },
        ];
      case 'expert':
        return [
          { id: 'expert-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'expert-cases', label: 'Cases for Review', icon: Briefcase },
          { id: 'previous-cases', label: 'View Previous Cases', icon: BookOpen },
          { id: 'expert-guidance', label: 'Guidance', icon: HelpCircle },
          { id: 'expert-resources', label: 'Knowledge Resources', icon: BookOpen },
          { id: 'expert-activity', label: 'My Activity', icon: Activity },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'mitra':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'cases', label: 'My Cases', icon: Briefcase },
          { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
          { id: 'knowledge', label: 'Knowledge Search', icon: Search },
          { id: 'previous-cases', label: 'View Previous Cases', icon: BookOpen },
          { id: 'follow-ups', label: 'Follow-ups', icon: Calendar },
          { id: 'guidance', label: 'Expert Guidance', icon: HelpCircle },
          { id: 'profile', label: 'Profile', icon: User },
        ];
    }
  };

  const menuItems = getMenuItems();

  // Helper for applying link styling based on active state
  const getLinkClass = (itemId) => {
    const base = "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group";
    const active = "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600";
    const inactive = "text-gray-650 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent";
    return currentPage === itemId ? `${base} ${active}` : `${base} ${inactive}`;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header section in sidebar */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200 justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <Scale className="h-4.5 w-4.5" />
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">OutLawed India</span>
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
                <Icon className={`h-5 w-5 shrink-0 ${currentPage === item.id ? 'text-emerald-600' : 'text-gray-450 group-hover:text-gray-500'}`} />
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer section */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-[10px] font-semibold text-gray-400 text-center">OutLawed India Platform</p>
        <p className="text-[10px] text-gray-400 text-center mt-0.5">MVP Release v1.0.0</p>
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
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
