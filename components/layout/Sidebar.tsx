
import React, { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, Layers, Command, FolderKanban, Users, Receipt, TrendingUp, Briefcase, Package, CheckSquare, Settings, Landmark, CreditCard, FileText, Building2, Share2, Network, Wallet, UserPlus, CalendarDays, Clock, Award, Monitor, ShoppingBag, ShieldAlert, ChevronDown, ChevronRight, LogOut, Star, MessageSquare, BookOpen, GraduationCap, FileCheck, CheckCircle, PieChart, Activity, Book, Calculator, Scale, FileBarChart } from 'lucide-react';
import { ViewState, Role, PermissionModule } from '../../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  compact?: boolean;
  userRole?: Role;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, compact = false, userRole, onLogout }) => {
  // Mapping ViewState to Module for visibility check
  const VIEW_MODULES: Record<string, PermissionModule | 'General'> = {
    [ViewState.DASHBOARD]: 'General',
    [ViewState.CHAT]: 'General', 
    [ViewState.APPROVALS]: 'General', // Accessible to all (content filtered by role usually)
    [ViewState.LISTS]: 'CRM',
    [ViewState.TASKS]: 'CRM',
    [ViewState.PROJECTS]: 'CRM',
    [ViewState.CUSTOMERS]: 'CRM',
    [ViewState.QUOTATIONS]: 'CRM',
    [ViewState.PRODUCTS]: 'CRM',
    [ViewState.FINANCE_DASHBOARD]: 'Finance', 
    [ViewState.PROFIT_LOSS]: 'Finance',
    [ViewState.BALANCE_SHEET]: 'Finance',
    [ViewState.CHART_OF_ACCOUNTS]: 'Finance', 
    [ViewState.SALES]: 'Finance',
    [ViewState.INVOICES]: 'Finance',
    [ViewState.BANK]: 'Finance',
    [ViewState.EXPENSES]: 'Finance',
    [ViewState.PURCHASES]: 'Finance',
    [ViewState.DEPRECIATION]: 'Finance',
    [ViewState.HR_DASHBOARD]: 'HR', 
    [ViewState.EMPLOYEES]: 'HR',
    [ViewState.DEPARTMENTS]: 'HR',
    [ViewState.TEAMS]: 'HR',
    [ViewState.ORGANOGRAM]: 'HR',
    [ViewState.PAYROLL]: 'HR',
    [ViewState.RECRUITMENT]: 'HR',
    [ViewState.ONBOARDING]: 'HR',
    [ViewState.TRAINING]: 'HR',
    [ViewState.CLAIMS]: 'HR', 
    [ViewState.LETTERS]: 'HR', 
    [ViewState.PERFORMANCE]: 'HR',
    [ViewState.ATTENDANCE]: 'HR',
    [ViewState.LEAVE]: 'HR',
    [ViewState.ASSETS]: 'HR',
    [ViewState.ROLES]: 'Settings',
    [ViewState.SETTINGS]: 'Settings',
  };

  const sections = [
    {
      title: 'Overview',
      id: 'overview',
      items: [
        { id: ViewState.DASHBOARD, icon: LayoutGrid, label: 'Dashboard' },
        { id: ViewState.APPROVALS, icon: CheckCircle, label: 'Approvals' },
        { id: ViewState.CHAT, icon: MessageSquare, label: 'Team Chat' },
      ]
    },
    {
      title: 'CRM',
      id: 'crm',
      items: [
        { id: ViewState.LISTS, icon: Layers, label: 'Leads' },
        { id: ViewState.TASKS, icon: CheckSquare, label: 'Tasks' },
        { id: ViewState.PROJECTS, icon: FolderKanban, label: 'Projects' },
        { id: ViewState.CUSTOMERS, icon: Users, label: 'Customers' },
        { id: ViewState.QUOTATIONS, icon: FileText, label: 'Quotations' },
        { id: ViewState.PRODUCTS, icon: Package, label: 'Products' },
      ]
    },
    {
      title: 'Finance',
      id: 'finance',
      items: [
        { id: ViewState.FINANCE_DASHBOARD, icon: PieChart, label: 'Overview' }, 
        { id: ViewState.PROFIT_LOSS, icon: FileBarChart, label: 'Profit & Loss' },
        { id: ViewState.BALANCE_SHEET, icon: Scale, label: 'Balance Sheet' },
        { id: ViewState.SALES, icon: TrendingUp, label: 'Sales' },
        { id: ViewState.INVOICES, icon: Wallet, label: 'Invoices' },
        { id: ViewState.EXPENSES, icon: Receipt, label: 'Expenses' },
        { id: ViewState.PURCHASES, icon: ShoppingBag, label: 'Purchases' },
        { id: ViewState.BANK, icon: Landmark, label: 'Banking' },
        { id: ViewState.CHART_OF_ACCOUNTS, icon: Book, label: 'Chart of Accounts' }, 
        { id: ViewState.DEPRECIATION, icon: Calculator, label: 'Depreciation' },
      ]
    },
    {
      title: 'HR Management',
      id: 'hr',
      items: [
        { id: ViewState.HR_DASHBOARD, icon: Activity, label: 'Overview' }, 
        { id: ViewState.EMPLOYEES, icon: Briefcase, label: 'Employees' },
        { id: ViewState.DEPARTMENTS, icon: Building2, label: 'Departments' },
        { id: ViewState.TEAMS, icon: Share2, label: 'Teams' },
        { id: ViewState.ORGANOGRAM, icon: Network, label: 'Organogram' },
        { id: ViewState.RECRUITMENT, icon: UserPlus, label: 'Recruitment' },
        { id: ViewState.ONBOARDING, icon: BookOpen, label: 'Onboarding' },
        { id: ViewState.TRAINING, icon: GraduationCap, label: 'Training & Dev' },
        { id: ViewState.CLAIMS, icon: FileCheck, label: 'Claims' },
        { id: ViewState.LETTERS, icon: FileText, label: 'HR Letters' }, 
        { id: ViewState.PERFORMANCE, icon: Award, label: 'Performance' },
        { id: ViewState.ATTENDANCE, icon: Clock, label: 'Attendance' },
        { id: ViewState.LEAVE, icon: CalendarDays, label: 'Leave' },
        { id: ViewState.PAYROLL, icon: CreditCard, label: 'Payroll' },
        { id: ViewState.ASSETS, icon: Monitor, label: 'Assets' },
      ]
    },
    {
      title: 'Administration',
      id: 'admin',
      items: [
        { id: ViewState.ROLES, icon: ShieldAlert, label: 'Roles & Permissions' },
      ]
    }
  ];

  // ... rest of component unchanged
  // State for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  
  // Favorites State with persistence
  const [favorites, setFavorites] = useState<ViewState[]>(() => {
    try {
      const saved = localStorage.getItem('glassflow_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleFavorite = (e: React.MouseEvent, viewId: ViewState) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(viewId)
      ? favorites.filter(id => id !== viewId)
      : [...favorites, viewId];
    
    setFavorites(newFavorites);
    localStorage.setItem('glassflow_favorites', JSON.stringify(newFavorites));
  };

  const isSectionCollapsed = (sectionId: string) => !!collapsedSections[sectionId];

  // Derive flat list of all items for favorites lookup
  const allItemsMap = useMemo(() => {
    const map = new Map();
    sections.forEach(section => {
      section.items.forEach(item => {
        map.set(item.id, item);
      });
    });
    return map;
  }, []);

  // Filter Favorite Items based on current permissions
  const favoriteItems = favorites
    .map(id => allItemsMap.get(id))
    .filter(item => {
      if (!item) return false;
      if (!userRole) return true;
      const module = VIEW_MODULES[item.id];
      if (module === 'General') return true;
      if (!module) return true;
      const permission = userRole.permissions[module];
      return permission !== 'None';
    });

  return (
    <aside className={`
        h-full flex flex-col z-50 transition-all duration-300 border-r border-gray-200 dark:border-gray-800
        bg-surface dark:bg-[#18181b]
        ${compact ? 'w-16' : 'w-16 lg:w-64'}
    `}>
      {/* Header */}
      <div className={`
          h-16 flex items-center border-b border-gray-100 dark:border-gray-800 transition-all shrink-0
          ${compact ? 'justify-center' : 'justify-center lg:justify-start lg:px-6'}
      `}>
        <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 shadow-lg shadow-black/10">
          <Command size={16} strokeWidth={2.5} />
        </div>
        {!compact && (
          <div className="hidden lg:flex flex-col ml-3">
            <span className="font-bold text-sm tracking-wide text-black dark:text-white leading-none">
                GlassFlow
            </span>
            <span className="text-[10px] text-gray-400 font-medium mt-1">Enterprise CRM</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-2 px-3 overflow-y-auto custom-scrollbar">
        
        {/* FAVORITES SECTION */}
        {favoriteItems.length > 0 && (
          <div className="flex flex-col mb-2 animate-in fade-in slide-in-from-left-2 duration-300">
             {!compact && (
                <div className="flex items-center justify-between px-3 py-2 mt-2 mb-1 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                    <span className="flex items-center gap-1.5"><Star size={10} className="fill-orange-400 text-orange-400" /> Favorites</span>
                </div>
             )}
             {compact && <div className="my-2 h-px bg-gray-100 dark:bg-white/5 w-8 mx-auto" />}
             
             <div className="space-y-0.5">
                {favoriteItems.map((item) => {
                    const isActive = currentView === item.id || 
                                    (item.id === ViewState.PROJECTS && currentView === ViewState.PROJECT_DETAILS) ||
                                    (item.id === ViewState.TASKS && currentView === ViewState.TASK_DETAILS) ||
                                    (item.id === ViewState.QUOTATIONS && currentView === ViewState.QUOTATION_DETAILS) ||
                                    (item.id === ViewState.INVOICES && currentView === ViewState.INVOICE_DETAILS) ||
                                    (item.id === ViewState.PRODUCTS && currentView === ViewState.PRODUCT_DETAILS) ||
                                    (item.id === ViewState.PAYROLL && currentView === ViewState.PAYROLL_DETAILS);
                    
                    return (
                        <button
                            key={`fav-${item.id}`}
                            onClick={() => onNavigate(item.id)}
                            title={compact ? item.label : undefined}
                            className={`
                                group flex items-center w-full p-2.5 rounded-lg transition-all duration-200 relative
                                ${compact ? 'justify-center' : 'justify-center lg:justify-start'}
                                ${isActive 
                                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md shadow-black/5' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'}
                            `}
                        >
                            <item.icon 
                                size={18} 
                                strokeWidth={1.5} 
                                className={`shrink-0 transition-transform duration-200 ${isActive ? 'scale-100' : 'group-hover:scale-110'}`} 
                            />
                            {!compact && (
                                <span className="hidden lg:block ml-3 text-xs font-medium truncate flex-1 text-left">
                                    {item.label}
                                </span>
                            )}
                            
                            {/* Active Indicator */}
                            {isActive && !compact && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-white/20 rounded-r-full hidden lg:block"></div>
                            )}
                        </button>
                    );
                })}
             </div>
             <div className="my-2 h-px bg-gray-100 dark:bg-white/5 w-full mx-auto" />
          </div>
        )}

        {/* REGULAR SECTIONS */}
        {sections.map((section, idx) => {
            // Filter items based on permissions
            const visibleItems = section.items.filter(item => {
                if (!userRole) return true;
                const module = VIEW_MODULES[item.id];
                if (module === 'General') return true;
                if (!module) return true;
                const permission = userRole.permissions[module];
                return permission !== 'None';
            });

            if (visibleItems.length === 0) return null;

            const isCollapsed = isSectionCollapsed(section.id);

            return (
                <div key={section.id} className="flex flex-col">
                    {/* Section Header */}
                    {!compact && section.title !== 'Overview' && (
                        <button 
                            onClick={() => toggleSection(section.id)}
                            className="flex items-center justify-between px-3 py-2 mt-2 mb-1 text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
                        >
                            <span>{section.title}</span>
                            {isCollapsed ? 
                                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /> : 
                                <ChevronDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            }
                        </button>
                    )}
                    
                    {compact && idx !== 0 && (
                        <div className="my-2 h-px bg-gray-100 dark:bg-white/5 w-8 mx-auto" />
                    )}
                    
                    {/* Items */}
                    <div className={`space-y-0.5 transition-all duration-300 ease-in-out ${!compact && isCollapsed ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'}`}>
                        {visibleItems.map((item) => {
                            const isActive = currentView === item.id || 
                                            (item.id === ViewState.PROJECTS && currentView === ViewState.PROJECT_DETAILS) ||
                                            (item.id === ViewState.TASKS && currentView === ViewState.TASK_DETAILS) ||
                                            (item.id === ViewState.QUOTATIONS && currentView === ViewState.QUOTATION_DETAILS) ||
                                            (item.id === ViewState.INVOICES && currentView === ViewState.INVOICE_DETAILS) ||
                                            (item.id === ViewState.PRODUCTS && currentView === ViewState.PRODUCT_DETAILS) ||
                                            (item.id === ViewState.PAYROLL && currentView === ViewState.PAYROLL_DETAILS);
                            
                            const isFavorite = favorites.includes(item.id);

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
                                    title={compact ? item.label : undefined}
                                    className={`
                                        group flex items-center w-full p-2.5 rounded-lg transition-all duration-200 relative
                                        ${compact ? 'justify-center' : 'justify-center lg:justify-start'}
                                        ${isActive 
                                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-md shadow-black/5' 
                                        : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'}
                                    `}
                                >
                                    <item.icon 
                                        size={18} 
                                        strokeWidth={1.5} 
                                        className={`shrink-0 transition-transform duration-200 ${isActive ? 'scale-100' : 'group-hover:scale-110'}`} 
                                    />
                                    {!compact && (
                                        <>
                                            <span className="hidden lg:block ml-3 text-xs font-medium truncate flex-1 text-left">
                                                {item.label}
                                            </span>
                                            
                                            {/* Favorite Toggle */}
                                            <div 
                                                onClick={(e) => toggleFavorite(e, item.id)}
                                                className={`
                                                    p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-all
                                                    ${isFavorite ? 'opacity-100 text-orange-400' : 'opacity-0 group-hover:opacity-100 text-gray-300 hover:text-orange-400'}
                                                `}
                                                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                            >
                                                <Star size={12} className={isFavorite ? "fill-current" : ""} />
                                            </div>
                                        </>
                                    )}
                                    
                                    {/* Active Indicator for non-compact mode */}
                                    {isActive && !compact && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-white/20 rounded-r-full hidden lg:block"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        })}
      </nav>

      {/* Footer User Profile & Settings */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 mt-auto flex flex-col gap-1 shrink-0 bg-surface dark:bg-[#18181b]">
        {/* Only show Settings button if user has access to Settings module */}
        {(!userRole || userRole.permissions['Settings'] !== 'None') && (
            <button
            onClick={() => onNavigate(ViewState.SETTINGS)}
            title={compact ? "Settings" : undefined}
            className={`
                group flex items-center w-full p-2.5 rounded-lg transition-all duration-200 mb-1
                ${compact ? 'justify-center' : 'justify-center lg:justify-start'}
                ${currentView === ViewState.SETTINGS 
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' 
                : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'}
            `}
            >
            <Settings size={18} strokeWidth={1.5} className="shrink-0" />
            {!compact && (
                <span className="hidden lg:block ml-3 text-xs font-medium truncate">
                    Settings
                </span>
            )}
            </button>
        )}

        <div className={`
            flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group
            ${compact ? 'justify-center' : 'justify-center lg:justify-start'}
        `}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">
            AD
          </div>
          {!compact && (
            <div className="hidden lg:flex flex-col truncate flex-1">
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">Alex Doe</span>
                <span className="text-[10px] text-gray-400 truncate">{userRole?.name}</span>
            </div>
          )}
          {!compact && (
              <button 
                onClick={(e) => { e.stopPropagation(); onLogout && onLogout(); }}
                className="hidden lg:block text-gray-400 hover:text-red-500 transition-colors p-1" 
                title="Sign Out"
              >
                  <LogOut size={14} />
              </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
