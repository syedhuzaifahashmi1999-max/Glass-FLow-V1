
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, Download, CheckCircle, Clock, 
  Trash2, ChevronLeft, ChevronRight, ArrowUpDown, 
  MoreHorizontal, FileText, CheckSquare, Square, X, Wallet, PieChart,
  Edit, Receipt, BarChart2, Check, AlertCircle, Copy, FolderKanban
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Expense, BankAccount, Project, GLAccount } from '../types';
import { MOCK_ACCOUNTS } from '../constants';
import AddExpenseModal from '../components/expenses/AddExpenseModal';
import ExpenseReceiptModal from '../components/expenses/ExpenseReceiptModal';

interface ExpensesListProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  accounts: BankAccount[];
  projects: Project[];
  onAddExpense: (expense: Omit<Expense, 'id'>, accountId?: string) => void;
  currency?: string;
  glAccounts?: GLAccount[];
}

const ExpensesList: React.FC<ExpensesListProps> = ({ expenses, setExpenses, accounts, projects, onAddExpense, currency = 'USD', glAccounts = MOCK_ACCOUNTS }) => {
  // --- State Management ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({ start: '', end: '' });

  const [sortConfig, setSortConfig] = useState<{ key: keyof Expense; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [viewingReceiptExpense, setViewingReceiptExpense] = useState<Expense | null>(null);

  // --- Helpers ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount);
  };

  // --- Derived Data & Helpers ---
  const categories = useMemo(() => Array.from(new Set(expenses.map(e => e.category))), [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        exp.payee.toLowerCase().includes(searchLower) ||
        exp.description.toLowerCase().includes(searchLower) ||
        exp.id.toLowerCase().includes(searchLower) ||
        exp.category.toLowerCase().includes(searchLower);
      
      const matchesStatus = filterStatus === 'All' || exp.status === filterStatus;
      const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;
      
      let matchesDate = true;
      if (dateRange.start) matchesDate = matchesDate && new Date(exp.date) >= new Date(dateRange.start);
      if (dateRange.end) matchesDate = matchesDate && new Date(exp.date) <= new Date(dateRange.end);

      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  }, [expenses, searchQuery, filterStatus, filterCategory, dateRange]);

  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => {
      const aValue = a[sortConfig.key]!;
      const bValue = b[sortConfig.key]!;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredExpenses, sortConfig]);

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);
  const paginatedExpenses = sortedExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const metrics = useMemo(() => {
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const pending = expenses.filter(e => e.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
    const avg = expenses.length > 0 ? total / expenses.length : 0;
    
    // Chart Data Preparation (Last 6 Months approx)
    const chartMap = new Map<string, number>();
    expenses.forEach(e => {
        const month = new Date(e.date).toLocaleString('default', { month: 'short' });
        chartMap.set(month, (chartMap.get(month) || 0) + e.amount);
    });
    // Fill dummy data for visual balance if empty
    if(chartMap.size === 0) {
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].forEach(m => chartMap.set(m, 0));
    }
    const chartData = Array.from(chartMap.entries()).map(([name, value]) => ({ name, value }));

    return { total, pending, avg, count: expenses.length, chartData };
  }, [expenses]);

  // --- Handlers ---
  const handleSort = (key: keyof Expense) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedExpenses.length && paginatedExpenses.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedExpenses.map(e => e.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleBulkAction = (action: 'delete' | 'markPaid' | 'approve' | 'export') => {
    if (selectedIds.size === 0) return;
    
    if (action === 'delete') {
        if(confirm(`Are you sure you want to delete ${selectedIds.size} expenses?`)) {
            setExpenses(prev => prev.filter(e => !selectedIds.has(e.id)));
            setSelectedIds(new Set());
        }
    } else if (action === 'markPaid') {
        setExpenses(prev => prev.map(e => selectedIds.has(e.id) ? { ...e, status: 'Paid' } : e));
        setSelectedIds(new Set());
    } else if (action === 'approve') {
        setExpenses(prev => prev.map(e => selectedIds.has(e.id) && e.status === 'Pending' ? { ...e, status: 'Scheduled' } : e));
        setSelectedIds(new Set());
    } else if (action === 'export') {
        alert(`Exporting ${selectedIds.size} items to CSV...`);
        setSelectedIds(new Set());
    }
  };

  const handleEditExpense = (expense: Expense) => {
      setEditingExpense(expense);
      setIsAddModalOpen(true);
  };

  const handleSaveExpense = (expenseData: Omit<Expense, 'id'>, accountId?: string) => {
      if (editingExpense) {
          // Update Existing
          setExpenses(prev => prev.map(e => e.id === editingExpense.id ? { ...e, ...expenseData } : e));
          setEditingExpense(undefined);
      } else {
          // Create New
          onAddExpense(expenseData, accountId);
      }
  };

  const handleViewReceipt = (expense: Expense) => {
      setViewingReceiptExpense(expense);
      setIsReceiptModalOpen(true);
  };

  const handleDuplicate = (expense: Expense) => {
      const newExp = {
          ...expense,
          id: `EXP-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          status: 'Pending' as const,
          description: `${expense.description} (Copy)`
      };
      setExpenses(prev => [newExp, ...prev]);
  };

  const clearFilters = () => {
    setFilterStatus('All');
    setFilterCategory('All');
    setSearchQuery('');
    setDateRange({ start: '', end: '' });
  };

  return (
    <>
      <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
        
        {/* --- Header & Metrics --- */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl font-light text-black dark:text-white mb-1">Expenses Management</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                Track, approve, and analyze company spending.
              </p>
            </div>
            
            {/* Visual Charts / KPIs */}
            <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-1">
                <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 min-w-[200px] flex flex-col justify-between rounded-xl">
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Total YTD</span>
                            <Wallet size={14} className="text-gray-400" />
                        </div>
                        <div className="text-xl font-light text-black dark:text-white">{formatCurrency(metrics.total)}</div>
                    </div>
                    <div className="mt-3 h-8 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.chartData}>
                                <Bar dataKey="value" fill="#9CA3AF" radius={[2,2,0,0]} />
                            </BarChart>
                         </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-4 bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 min-w-[160px] flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Pending</span>
                        <Clock size={14} className="text-orange-400" />
                    </div>
                    <div>
                        <div className="text-xl font-light text-orange-600 dark:text-orange-400">{formatCurrency(metrics.pending)}</div>
                        <div className="text-[10px] text-gray-400 mt-1">Requires approval</div>
                    </div>
                </div>

                <div className="p-4 bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 min-w-[160px] flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Avg Expense</span>
                        <BarChart2 size={14} className="text-gray-400" />
                    </div>
                    <div>
                        <div className="text-xl font-light text-black dark:text-white">{formatCurrency(metrics.avg)}</div>
                        <div className="text-[10px] text-gray-400 mt-1">Per transaction</div>
                    </div>
                </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 justify-between items-center relative">
            {/* Search & Filters */}
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative group w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search payee, ID, category..." 
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 transition-all"
                    />
                </div>
                
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors text-xs font-medium ${isFilterOpen ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                    <Filter size={14} /> <span className="hidden sm:inline">Filter</span>
                </button>
            </div>

            {/* Main Actions */}
            <div className="flex gap-2 w-full md:w-auto">
                {selectedIds.size > 0 ? (
                    <div className="flex items-center gap-1 bg-black dark:bg-white text-white dark:text-black px-2 py-1.5 rounded-lg shadow-lg animate-in slide-in-from-right-10 fade-in duration-300 absolute md:static top-0 right-0 z-20 w-full md:w-auto justify-between md:justify-start">
                        <span className="text-[10px] font-bold px-2 border-r border-white/20 dark:border-black/20 whitespace-nowrap">{selectedIds.size} Selected</span>
                        
                        <div className="flex items-center gap-1 ml-1">
                            <button onClick={() => handleBulkAction('approve')} className="p-1.5 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors flex items-center gap-1 text-[10px] font-medium" title="Approve Selected">
                                <CheckCircle size={12} /> <span className="hidden lg:inline">Approve</span>
                            </button>
                            <button onClick={() => handleBulkAction('markPaid')} className="p-1.5 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors flex items-center gap-1 text-[10px] font-medium" title="Mark as Paid">
                                <Wallet size={12} /> <span className="hidden lg:inline">Pay</span>
                            </button>
                            <button onClick={() => handleBulkAction('export')} className="p-1.5 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors flex items-center gap-1 text-[10px] font-medium" title="Export Selected">
                                <Download size={12} />
                            </button>
                            <div className="w-px h-3 bg-white/20 dark:bg-black/20 mx-1"></div>
                            <button onClick={() => handleBulkAction('delete')} className="p-1.5 hover:bg-red-500/80 rounded transition-colors flex items-center gap-1 text-[10px] font-medium text-red-200 hover:text-white" title="Delete Selected">
                                <Trash2 size={12} />
                            </button>
                        </div>
                        <button onClick={() => setSelectedIds(new Set())} className="ml-2 p-1 hover:bg-white/20 dark:hover:bg-black/10 rounded text-gray-400 hover:text-white dark:hover:text-black"><X size={12} /></button>
                    </div>
                ) : (
                    <>
                        <button className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors" title="Export Report"><Download size={14} /></button>
                        <button 
                            onClick={() => { setEditingExpense(undefined); setIsAddModalOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm"
                        >
                            <Plus size={14} /> New Expense
                        </button>
                    </>
                )}
            </div>
          </div>
        </div>

        {/* --- Filters (Collapsible) --- */}
        {isFilterOpen && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl animate-in slide-in-from-top-2 fade-in">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1">Status</label>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20">
                            <option value="All">All Statuses</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1">Category</label>
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20">
                            <option value="All">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1">Start Date</label>
                        <input type="date" value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20" />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1">End Date</label>
                            <input type="date" value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20" />
                        </div>
                        <button onClick={clearFilters} className="px-3 py-1.5 bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-white/20 text-xs mt-auto h-[30px]">Clear</button>
                    </div>
                </div>
            </div>
        )}

        {/* --- Table --- */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 dark:bg-white/5 sticky top-0 z-10 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="py-3 px-4 w-10 text-center">
                                <button onClick={handleSelectAll} className="flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white">
                                    {selectedIds.size > 0 && selectedIds.size === paginatedExpenses.length ? <CheckSquare size={14} /> : <Square size={14} />}
                                </button>
                            </th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5" onClick={() => handleSort('date')}>Date</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5" onClick={() => handleSort('payee')}>Payee</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Description</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Category</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Project</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider text-center">Receipt</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Status</th>
                            <th className="py-3 px-6 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider text-right cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5" onClick={() => handleSort('amount')}>Amount</th>
                            <th className="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-gray-50 dark:divide-gray-800">
                        {paginatedExpenses.length > 0 ? paginatedExpenses.map(exp => (
                            <tr key={exp.id} className={`group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${selectedIds.has(exp.id) ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''}`}>
                                <td className="py-3 px-4 text-center">
                                    <button onClick={() => handleSelectOne(exp.id)} className={`flex items-center justify-center transition-colors ${selectedIds.has(exp.id) ? 'text-black dark:text-white' : 'text-gray-300 hover:text-gray-500'}`}>
                                        {selectedIds.has(exp.id) ? <CheckSquare size={14} /> : <Square size={14} />}
                                    </button>
                                </td>
                                <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-mono">{exp.date}</td>
                                <td className="py-3 px-4 font-medium text-black dark:text-white">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">
                                            {exp.payee.slice(0,2)}
                                        </div>
                                        {exp.payee}
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{exp.description}</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-0.5 rounded bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400">{exp.category}</span>
                                </td>
                                <td className="py-3 px-4">
                                    {exp.projectId ? (
                                        <span className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-500/20">
                                            <FolderKanban size={10} />
                                            {projects.find(p => p.id === exp.projectId)?.name || 'Project'}
                                        </span>
                                    ) : (
                                        <span className="text-gray-300 dark:text-gray-600">-</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleViewReceipt(exp); }}
                                        className="text-gray-300 dark:text-gray-600 hover:text-black dark:hover:text-white transition-colors p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded"
                                        title="View Receipt"
                                    >
                                        <Receipt size={14} />
                                    </button>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border ${
                                        exp.status === 'Paid' ? 'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20 text-green-700 dark:text-green-400' : 
                                        exp.status === 'Pending' ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20 text-orange-700 dark:text-orange-400' : 
                                        exp.status === 'Failed' ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 text-red-700 dark:text-red-400' :
                                        'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-400'
                                    }`}>
                                        {exp.status === 'Paid' && <CheckCircle size={10} />}
                                        {exp.status === 'Pending' && <Clock size={10} />}
                                        {exp.status === 'Failed' && <AlertCircle size={10} />}
                                        {exp.status}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-right font-mono font-medium text-black dark:text-white">{formatCurrency(exp.amount)}</td>
                                <td className="py-3 px-4 text-right">
                                    <div className="relative group/actions">
                                        <button className="p-1 text-gray-300 dark:text-gray-600 hover:text-black dark:hover:text-white transition-colors">
                                            <MoreHorizontal size={14} />
                                        </button>
                                        
                                        {/* Dropdown Menu */}
                                        <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#18181b] rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-20 hidden group-hover/actions:block animate-in fade-in zoom-in-95 origin-top-right">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleViewReceipt(exp); }}
                                                className="w-full text-left px-4 py-2 text-[10px] hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 flex items-center gap-2"
                                            >
                                                <FileText size={12} /> View Receipt
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleEditExpense(exp); }}
                                                className="w-full text-left px-4 py-2 text-[10px] hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 flex items-center gap-2"
                                            >
                                                <Edit size={12} /> Edit Details
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDuplicate(exp); }}
                                                className="w-full text-left px-4 py-2 text-[10px] hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 flex items-center gap-2"
                                            >
                                                <Copy size={12} /> Duplicate
                                            </button>
                                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if(confirm('Delete expense?')) setExpenses(prev => prev.filter(e => e.id !== exp.id));
                                                }}
                                                className="w-full text-left px-4 py-2 text-[10px] hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-2"
                                            >
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={10} className="py-16 text-center text-gray-400 text-sm">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                                            <Search size={18} className="opacity-30" />
                                        </div>
                                        <p>No expenses found matching filters.</p>
                                        <button onClick={clearFilters} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Clear Filters</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center text-[10px]">
                <span className="text-gray-500 dark:text-gray-400">
                    Showing <span className="font-medium text-black dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-black dark:text-white">{Math.min(currentPage * itemsPerPage, sortedExpenses.length)}</span> of <span className="font-medium text-black dark:text-white">{sortedExpenses.length}</span> results
                </span>
                <div className="flex gap-1">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50 text-black dark:text-white"><ChevronLeft size={12} /></button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50 text-black dark:text-white"><ChevronRight size={12} /></button>
                </div>
            </div>
        </div>

      </div>

      <AddExpenseModal 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setEditingExpense(undefined); }}
        onSave={handleSaveExpense}
        accounts={accounts}
        projects={projects}
        initialData={editingExpense}
        glAccounts={glAccounts}
      />

      <ExpenseReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        expense={viewingReceiptExpense}
      />
    </>
  );
};

export default ExpensesList;
