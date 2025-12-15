
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, Bell, Sun, Moon, HelpCircle, Command, X, 
  LayoutGrid, Layers, FolderKanban, Users, FileText, 
  Settings, Briefcase, Zap, LifeBuoy, Keyboard, ExternalLink,
  Wallet, CheckSquare, Package, ChevronRight, Hash, User,
  Receipt, ShoppingBag, Landmark, Building2, Share2, UserPlus, 
  BookOpen, FileCheck, Award, CalendarDays, CreditCard, Monitor, 
  ShieldAlert, Clock, Book, MessageSquare, CornerDownLeft, ArrowRight, CheckCircle
} from 'lucide-react';
import { ViewState } from '../../types';
import { 
    MOCK_EMPLOYEES, MOCK_PROJECTS, MOCK_LEADS, MOCK_TASKS, MOCK_INVOICES, MOCK_PRODUCTS, 
    MOCK_EXPENSES, MOCK_PURCHASE_ORDERS, MOCK_BANK_ACCOUNTS, MOCK_DEPARTMENTS, MOCK_TEAMS, 
    MOCK_CANDIDATES, MOCK_TRAINING_COURSES, MOCK_ASSETS, MOCK_PAYROLL_RUNS 
} from '../../constants';

interface HeaderProps {
  currentView: ViewState;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onNavigate: (view: ViewState) => void;
  onSearchSelect?: (type: string, id: string) => void;
}

// Static Navigation Items
const NAV_ITEMS = [
  { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutGrid, type: 'Navigation' },
  { id: ViewState.LISTS, label: 'Leads', icon: Layers, type: 'Navigation' },
  { id: ViewState.PROJECTS, label: 'Projects', icon: FolderKanban, type: 'Navigation' },
  { id: ViewState.TASKS, label: 'Tasks', icon: CheckSquare, type: 'Navigation' },
  { id: ViewState.CUSTOMERS, label: 'Customers', icon: Users, type: 'Navigation' },
  { id: ViewState.EMPLOYEES, label: 'Employees', icon: Briefcase, type: 'Navigation' },
  { id: ViewState.INVOICES, label: 'Invoices', icon: FileText, type: 'Navigation' },
  { id: ViewState.PRODUCTS, label: 'Products', icon: Package, type: 'Navigation' },
  { id: ViewState.EXPENSES, label: 'Expenses', icon: Receipt, type: 'Navigation' },
  { id: ViewState.PURCHASES, label: 'Purchases', icon: ShoppingBag, type: 'Navigation' },
  { id: ViewState.BANK, label: 'Banking', icon: Landmark, type: 'Navigation' },
  { id: ViewState.DEPARTMENTS, label: 'Departments', icon: Building2, type: 'Navigation' },
  { id: ViewState.TEAMS, label: 'Teams', icon: Share2, type: 'Navigation' },
  { id: ViewState.RECRUITMENT, label: 'Recruitment', icon: UserPlus, type: 'Navigation' },
  { id: ViewState.ONBOARDING, label: 'Onboarding', icon: BookOpen, type: 'Navigation' },
  { id: ViewState.TRAINING, label: 'Training', icon: BookOpen, type: 'Navigation' },
  { id: ViewState.CLAIMS, label: 'Claims', icon: FileCheck, type: 'Navigation' },
  { id: ViewState.LETTERS, label: 'HR Letters', icon: FileText, type: 'Navigation' },
  { id: ViewState.PERFORMANCE, label: 'Performance', icon: Award, type: 'Navigation' },
  { id: ViewState.ATTENDANCE, label: 'Attendance', icon: Clock, type: 'Navigation' },
  { id: ViewState.LEAVE, label: 'Leave', icon: CalendarDays, type: 'Navigation' },
  { id: ViewState.PAYROLL, label: 'Payroll', icon: CreditCard, type: 'Navigation' },
  { id: ViewState.ASSETS, label: 'Assets', icon: Monitor, type: 'Navigation' },
  { id: ViewState.ROLES, label: 'Roles', icon: ShieldAlert, type: 'Navigation' },
  { id: ViewState.SETTINGS, label: 'Settings', icon: Settings, type: 'Navigation' },
];

interface SearchResult {
    id: string;
    label: string;
    type: string;
    icon?: any;
    meta?: string;
    status?: string;
    category?: string;
    avatarUrl?: string;
}

// --- Help Center Components ---

const DocsView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Documentation</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Guides and resources to help you build with GlassFlow.</p>
        </div>

        <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-all"
            />
        </div>

        <div className="grid gap-3">
            {[
                { title: 'Getting Started with CRM', cat: 'Essentials', time: '5 min read' },
                { title: 'Managing User Permissions', cat: 'Admin', time: '3 min read' },
                { title: 'Setting up Payroll', cat: 'Finance', time: '8 min read' },
                { title: 'API Authentication', cat: 'Developer', time: '10 min read' },
                { title: 'Customizing Workflows', cat: 'Advanced', time: '6 min read' },
            ].map((doc, i) => (
                <button key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group text-left">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-white/10 rounded-lg text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                            <BookOpen size={16} />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-black dark:text-white group-hover:underline decoration-gray-300 dark:decoration-gray-600 underline-offset-4">{doc.title}</h4>
                            <p className="text-xs text-gray-500">{doc.cat}</p>
                        </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">{doc.time}</span>
                </button>
            ))}
        </div>
        
        <button className="w-full py-3 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1">
            View all documentation <ExternalLink size={12} />
        </button>
    </div>
);

const ShortcutsView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Keyboard Shortcuts</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Navigate GlassFlow faster with these keys.</p>
        </div>

        <div className="grid gap-2">
            {[
                { keys: ['⌘', 'K'], label: 'Open Command Palette' },
                { keys: ['Esc'], label: 'Close Modals / Menus' },
                { keys: ['↑', '↓'], label: 'Navigate Lists' },
                { keys: ['Enter'], label: 'Select Item' },
                { keys: ['⌘', '/'], label: 'Open Help Center' },
                { keys: ['⌘', 'B'], label: 'Toggle Sidebar' },
            ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                    <div className="flex gap-1">
                        {item.keys.map((k, idx) => (
                            <kbd key={idx} className="h-6 min-w-[24px] px-1.5 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 text-xs font-sans font-medium text-gray-500 dark:text-gray-400">
                                {k}
                            </kbd>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const SupportView = ({ onClose }: { onClose: () => void }) => {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => {
            setSent(false);
            onClose();
        }, 2000);
    };

    if (sent) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">Message Sent!</h3>
                <p className="text-sm text-gray-500 max-w-xs">Our support team will get back to you within 24 hours.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">Contact Support</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Need help? Send us a message and we'll be in touch.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                    <select className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white">
                        <option>General Inquiry</option>
                        <option>Bug Report</option>
                        <option>Billing Issue</option>
                        <option>Feature Request</option>
                    </select>
                </div>
                
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                    <textarea 
                        required
                        rows={5}
                        placeholder="Describe your issue or question..."
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white resize-none"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</label>
                    <div className="flex gap-3">
                        {['Low', 'Medium', 'High'].map(p => (
                            <label key={p} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="priority" className="accent-black dark:accent-white" defaultChecked={p === 'Medium'} />
                                <span className="text-sm text-black dark:text-white">{p}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="pt-2">
                    <button type="submit" className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                        Send Message <ArrowRight size={14} />
                    </button>
                </div>
            </form>
        </div>
    );
};

const HelpModal = ({ isOpen, onClose, initialTab }: { isOpen: boolean; onClose: () => void; initialTab: string }) => {
    const [tab, setTab] = useState(initialTab);

    useEffect(() => {
        if (isOpen) setTab(initialTab);
    }, [initialTab, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
             <div 
                className="bg-white dark:bg-[#18181b] w-full max-w-2xl h-[600px] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 flex overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
             >
                {/* Sidebar */}
                <div className="w-48 bg-gray-50 dark:bg-white/5 border-r border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-1 shrink-0">
                    <div className="mb-4 px-2 pt-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Help Center</h3>
                    </div>
                    <button onClick={() => setTab('docs')} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'docs' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        <Book size={16} /> Documentation
                    </button>
                    <button onClick={() => setTab('shortcuts')} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'shortcuts' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        <Keyboard size={16} /> Shortcuts
                    </button>
                    <button onClick={() => setTab('support')} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'support' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        <LifeBuoy size={16} /> Support
                    </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col relative bg-white dark:bg-[#18181b]">
                    <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400 transition-colors z-10">
                        <X size={18} />
                    </button>
                    
                    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
                         {tab === 'docs' && <DocsView />}
                         {tab === 'shortcuts' && <ShortcutsView />}
                         {tab === 'support' && <SupportView onClose={onClose} />}
                    </div>
                </div>
             </div>
             {/* Click outside handler */}
             <div className="absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    )
}

const Header: React.FC<HeaderProps> = ({ currentView, theme, onThemeToggle, onNavigate, onSearchSelect }) => {
  // --- State ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Help Modal State
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [helpTab, setHelpTab] = useState<'docs' | 'shortcuts' | 'support'>('docs');

  // Refs
  const notifRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // --- Search Logic ---
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return NAV_ITEMS.slice(0, 5).map(item => ({ ...item, category: 'Quick Access' }));

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // 1. Navigation
    NAV_ITEMS.forEach(item => {
        if (item.label.toLowerCase().includes(query)) {
            results.push({ ...item, category: 'Navigation' });
        }
    });

    // 2. Projects
    MOCK_PROJECTS.forEach(p => {
        if (p.name.toLowerCase().includes(query) || p.client.toLowerCase().includes(query)) {
            results.push({ 
                id: p.id, 
                label: p.name, 
                type: 'Project', 
                icon: FolderKanban, 
                meta: p.client, 
                status: p.status, 
                category: 'Projects' 
            });
        }
    });

    // 3. Employees
    MOCK_EMPLOYEES.forEach(e => {
        if (e.name.toLowerCase().includes(query) || e.role.toLowerCase().includes(query)) {
            results.push({
                id: e.id,
                label: e.name, 
                type: 'Employee',
                icon: User,
                meta: e.role,
                avatarUrl: e.avatarUrl,
                category: 'People'
            });
        }
    });

    // 4. Leads
    MOCK_LEADS.forEach(l => {
        if (l.name.toLowerCase().includes(query) || l.company.toLowerCase().includes(query)) {
            results.push({
                id: l.id,
                label: l.name,
                type: 'Lead',
                icon: Layers,
                meta: l.company,
                status: l.stage,
                category: 'Leads'
            });
        }
    });

    // 5. Invoices
    MOCK_INVOICES.forEach(inv => {
        if (inv.id.toLowerCase().includes(query) || inv.customerName.toLowerCase().includes(query)) {
            results.push({
                id: inv.id,
                label: `Invoice ${inv.id}`,
                type: 'Invoice',
                icon: FileText,
                meta: inv.customerName,
                status: inv.status,
                category: 'Finance'
            });
        }
    });
    
    // 6. Expenses
    MOCK_EXPENSES.forEach(e => {
        if (e.payee.toLowerCase().includes(query) || e.description.toLowerCase().includes(query)) {
             results.push({
                id: e.id,
                label: e.payee,
                type: 'Expense',
                icon: Receipt,
                meta: `$${e.amount.toLocaleString()}`,
                status: e.status,
                category: 'Finance'
             });
        }
    });

    // 7. Purchase Orders
    MOCK_PURCHASE_ORDERS.forEach(po => {
        if (po.vendorName.toLowerCase().includes(query) || po.id.toLowerCase().includes(query)) {
             results.push({
                id: po.id,
                label: `${po.vendorName} (${po.id})`,
                type: 'PurchaseOrder',
                icon: ShoppingBag,
                meta: `$${po.totalAmount.toLocaleString()}`,
                status: po.status,
                category: 'Finance'
             });
        }
    });

    // 8. Banking
    MOCK_BANK_ACCOUNTS.forEach(acc => {
        if (acc.name.toLowerCase().includes(query) || acc.bankName.toLowerCase().includes(query)) {
             results.push({
                id: acc.id,
                label: acc.name,
                type: 'BankAccount',
                icon: Landmark,
                meta: `${acc.bankName} • ****${acc.accountNumber.slice(-4)}`,
                category: 'Finance'
             });
        }
    });

    // 9. Departments
    MOCK_DEPARTMENTS.forEach(dept => {
        if (dept.name.toLowerCase().includes(query)) {
             results.push({
                id: dept.id,
                label: dept.name,
                type: 'Department',
                icon: Building2,
                meta: `${dept.targetHeadcount} Members Target`,
                category: 'HR'
             });
        }
    });

    // 10. Teams
    MOCK_TEAMS.forEach(team => {
        if (team.name.toLowerCase().includes(query)) {
             results.push({
                id: team.id,
                label: team.name,
                type: 'Team',
                icon: Share2,
                meta: `${team.memberIds.length} Members`,
                category: 'HR'
             });
        }
    });

    // 11. Candidates
    MOCK_CANDIDATES.forEach(c => {
        if (c.name.toLowerCase().includes(query) || c.role.toLowerCase().includes(query)) {
             results.push({
                id: c.id,
                label: c.name,
                type: 'Candidate',
                icon: UserPlus,
                meta: c.role,
                status: c.stage,
                category: 'HR'
             });
        }
    });

    // 12. Training Courses
    MOCK_TRAINING_COURSES.forEach(c => {
        if (c.title.toLowerCase().includes(query)) {
             results.push({
                id: c.id,
                label: c.title,
                type: 'Course',
                icon: BookOpen,
                meta: c.category,
                category: 'HR'
             });
        }
    });

    // 13. Assets
    MOCK_ASSETS.forEach(a => {
        if (a.name.toLowerCase().includes(query) || (a.serialNumber && a.serialNumber.toLowerCase().includes(query))) {
             results.push({
                id: a.id,
                label: a.name,
                type: 'Asset',
                icon: Monitor,
                meta: a.serialNumber || 'No SN',
                status: a.status,
                category: 'HR'
             });
        }
    });

    // 14. Payroll
    MOCK_PAYROLL_RUNS.forEach(run => {
        if (run.period.toLowerCase().includes(query)) {
             results.push({
                id: run.id,
                label: `Payroll - ${run.period}`,
                type: 'PayrollRun',
                icon: CreditCard,
                meta: `$${run.totalCost.toLocaleString()}`,
                status: run.status,
                category: 'HR'
             });
        }
    });
    
    // 15. Tasks
    MOCK_TASKS.forEach(t => {
        if (t.title.toLowerCase().includes(query)) {
             results.push({
                id: t.id,
                label: t.title,
                type: 'Task',
                icon: CheckSquare,
                meta: t.project,
                status: t.status,
                category: 'Tasks'
             });
        }
    });

    // Limit results per category to avoid clutter
    return results;
  }, [searchQuery]);

  // Grouping for Display
  const groupedResults = useMemo(() => {
      const groups: Record<string, SearchResult[]> = {};
      searchResults.forEach(item => {
          const cat = item.category || 'Other';
          if (!groups[cat]) groups[cat] = [];
          if (groups[cat].length < 4) groups[cat].push(item); // Limit to 4 per section
      });
      return groups;
  }, [searchResults]);
  
  const flattenedResults = useMemo(() => {
      return Object.values(groupedResults).flat();
  }, [groupedResults]);

  // --- Keyboard Handling ---
  useEffect(() => {
    setActiveIndex(0); // Reset index on search change
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }

      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
          e.preventDefault();
          setHelpTab('docs');
          setIsHelpModalOpen(true);
      }
      
      if (!isSearchOpen) return;

      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, flattenedResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = flattenedResults[activeIndex];
        if (selected) {
            handleSelect(selected);
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setIsHelpOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, flattenedResults, activeIndex]);

  // Auto-scroll to selected item
  useEffect(() => {
      if (isSearchOpen && resultsRef.current) {
          const selectedEl = resultsRef.current.querySelector(`[data-index="${activeIndex}"]`);
          if (selectedEl) {
              selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
      }
  }, [activeIndex]);

  // Focus Input
  useEffect(() => {
    if (isSearchOpen) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
        setSearchQuery('');
    }
  }, [isSearchOpen]);


  // --- Actions ---
  const handleSelect = (item: SearchResult) => {
    if (item.type === 'Navigation') {
        onNavigate(item.id as ViewState);
    } else if (onSearchSelect) {
        onSearchSelect(item.type, item.id);
    }
    setIsSearchOpen(false);
  };

  const formatView = (view: string) => {
    return view.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  const getStatusColor = (status?: string) => {
      if (!status) return '';
      switch(status) {
          case 'Active': case 'Paid': case 'Won': case 'Completed': case 'Ordered': case 'Received': case 'Approved': case 'Hired': return 'bg-green-500';
          case 'Pending': case 'Planning': case 'Draft': case 'Scheduled': case 'Submitted': case 'Applied': return 'bg-orange-500';
          case 'Overdue': case 'Lost': case 'Rejected': case 'Cancelled': case 'Failed': case 'Terminated': return 'bg-red-500';
          default: return 'bg-gray-400';
      }
  };

  const openHelp = (tab: 'docs' | 'shortcuts' | 'support') => {
      setHelpTab(tab);
      setIsHelpModalOpen(true);
      setIsHelpOpen(false);
  };

  return (
    <>
      <header className="h-16 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-40 sticky top-0 transition-all duration-300">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-4 min-w-[200px]">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <button 
                    onClick={() => onNavigate(ViewState.DASHBOARD)}
                    className="text-gray-600 dark:text-gray-300 font-semibold tracking-tight hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                  >
                    <div className="w-5 h-5 bg-black dark:bg-white text-white dark:text-black rounded flex items-center justify-center">
                        <Command size={10} />
                    </div>
                    GlassFlow
                  </button>
                  <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{formatView(currentView)}</span>
              </div>
          </div>

          {/* Search Bar Trigger */}
          <div className="flex items-center gap-2 flex-1 max-w-xl mx-6 hidden md:flex">
              <div 
                className="relative w-full group cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
              >
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <input 
                      type="text" 
                      readOnly
                      placeholder="Search projects, people, or commands..." 
                      className="w-full bg-gray-100/50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-xl pl-9 pr-12 py-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-200 dark:hover:border-white/10 transition-all focus:outline-none"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                      <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 px-1.5 font-mono text-[10px] font-medium text-gray-400 dark:text-gray-500 opacity-100">
                          <span className="text-xs">⌘</span>K
                      </kbd>
                  </div>
              </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
              <button 
                  onClick={onThemeToggle}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                  title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                  {theme === 'light' ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}
              </button>
              
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className={`p-2 rounded-full transition-colors relative ${isNotifOpen ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                    <Bell size={18} strokeWidth={1.5} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#18181b] animate-pulse"></span>
                </button>
                {isNotifOpen && (
                    <div className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-[#18181b] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top-right z-50">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                            <h3 className="text-sm font-semibold text-black dark:text-white">Notifications</h3>
                            <button className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-medium">Mark all read</button>
                        </div>
                        <div className="p-8 text-center text-gray-400 text-xs flex flex-col items-center">
                            <Bell size={24} className="mb-2 opacity-20" />
                            No new notifications.
                        </div>
                    </div>
                )}
              </div>

              {/* Help Menu */}
              <div className="relative" ref={helpRef}>
                <button 
                    onClick={() => setIsHelpOpen(!isHelpOpen)}
                    className={`p-2 rounded-full transition-colors ${isHelpOpen ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                    <HelpCircle size={18} strokeWidth={1.5} />
                </button>
                {isHelpOpen && (
                    <div className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-[#18181b] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top-right z-50">
                        <div className="p-2 space-y-1">
                            <button 
                                onClick={() => openHelp('docs')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors text-left hover:text-black dark:hover:text-white"
                            >
                                <FileText size={14} className="text-gray-400" /> Documentation
                            </button>
                            <button 
                                onClick={() => openHelp('shortcuts')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors text-left hover:text-black dark:hover:text-white"
                            >
                                <Keyboard size={14} className="text-gray-400" /> Shortcuts
                            </button>
                            <button 
                                onClick={() => openHelp('support')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors text-left hover:text-black dark:hover:text-white"
                            >
                                <LifeBuoy size={14} className="text-gray-400" /> Support Center
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors text-left group">
                                <ExternalLink size={14} className="text-gray-400" /> System Status
                                <span className="ml-auto flex items-center gap-1.5 text-[9px] text-gray-400 bg-gray-100 dark:bg-white/10 px-1.5 rounded-full group-hover:bg-green-100 dark:group-hover:bg-green-900/30 group-hover:text-green-600 transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                                </span>
                            </button>
                        </div>
                    </div>
                )}
              </div>
          </div>
      </header>

      {/* Command Palette Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsSearchOpen(false)}></div>
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#18181b] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-4 duration-200 ring-1 ring-black/5">
                
                {/* Input */}
                <div className="flex items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                    <Search size={18} className="text-gray-400 ml-2" />
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Type a command or search..." 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 text-black dark:text-white placeholder-gray-400 h-6 font-medium"
                    />
                    <div className="flex items-center gap-2">
                        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/10 px-2 font-mono text-[10px] font-medium text-gray-500 dark:text-gray-400">ESC</kbd>
                    </div>
                </div>

                {/* Results */}
                <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {flattenedResults.length > 0 ? (
                        Object.entries(groupedResults).map(([category, items]) => (
                            <div key={category} className="mb-2">
                                <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur z-10">
                                    {category}
                                </div>
                                <div className="space-y-1">
                                    {(items as SearchResult[]).map((item) => {
                                        const globalIndex = flattenedResults.indexOf(item);
                                        const isSelected = globalIndex === activeIndex;

                                        return (
                                            <button
                                                key={`${item.type}-${item.id}`}
                                                data-index={globalIndex}
                                                onClick={() => handleSelect(item)}
                                                onMouseEnter={() => setActiveIndex(globalIndex)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors group ${
                                                    isSelected ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    {item.avatarUrl ? (
                                                        <img src={item.avatarUrl} className="w-8 h-8 rounded-lg object-cover border border-white/20" />
                                                    ) : (
                                                        <div className={`p-2 rounded-lg border transition-colors ${
                                                            isSelected ? 'bg-white/20 border-transparent text-white dark:text-black' : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-500 dark:text-gray-400'
                                                        }`}>
                                                            <item.icon size={16} strokeWidth={1.5} />
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}>
                                                            {item.label}
                                                        </p>
                                                        {item.meta && (
                                                            <p className={`text-[10px] truncate ${isSelected ? 'text-white/70 dark:text-black/70' : 'text-gray-400'}`}>
                                                                {item.meta}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Right Side Indicators */}
                                                <div className="flex items-center gap-3">
                                                    {item.status && (
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(item.status)}`}></div>
                                                            <span className={`text-[10px] ${isSelected ? 'text-white/80 dark:text-black/80' : 'text-gray-400'}`}>{item.status}</span>
                                                        </div>
                                                    )}
                                                    {isSelected && <ChevronRight size={14} className="opacity-50" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center">
                            <Search size={24} className="mb-2 opacity-20" />
                            No results found for "{searchQuery}"
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><kbd className="font-sans px-1 py-0.5 rounded bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700">↑↓</kbd> to navigate</span>
                        <span className="flex items-center gap-1"><kbd className="font-sans px-1 py-0.5 rounded bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700">↵</kbd> to select</span>
                    </div>
                    <div className="flex gap-2">
                        <span><strong>Cmd + K</strong> to close</span>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Help Center Modal */}
      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
        initialTab={helpTab} 
      />
    </>
  );
};

export default Header;
