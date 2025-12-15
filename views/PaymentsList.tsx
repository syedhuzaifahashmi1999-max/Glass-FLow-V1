
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, Download, ArrowUpRight, CheckCircle, Clock, 
  AlertCircle, Trash2, Calendar, ChevronLeft, ChevronRight, ArrowUpDown, 
  MoreHorizontal, FileText, CheckSquare, Square, X, Wallet, PieChart,
  ArrowDown, DollarSign, CreditCard
} from 'lucide-react';
import { Expense, BankAccount } from '../types';
import AddPaymentModal from '../components/payments/AddPaymentModal';

interface PaymentsListProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  accounts: BankAccount[];
  onAddExpense: (expense: Omit<Expense, 'id'>, accountId?: string) => void;
}

const PaymentsList: React.FC<PaymentsListProps> = ({ expenses, setExpenses, accounts, onAddExpense }) => {
  // --- State Management ---
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({ start: '', end: '' });

  // Sorting & Pagination
  const [sortConfig, setSortConfig] = useState<{ key: keyof Expense; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selection & Actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- Derived Data & Helpers ---

  // Unique Categories for Filter Dropdown
  const categories = useMemo(() => Array.from(new Set(expenses.map(e => e.category))), [expenses]);

  // 1. Filter Logic
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      // Text Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        exp.payee.toLowerCase().includes(searchLower) ||
        exp.description.toLowerCase().includes(searchLower) ||
        exp.id.toLowerCase().includes(searchLower) ||
        exp.category.toLowerCase().includes(searchLower);
      
      // Dropdown Filters
      const matchesStatus = filterStatus === 'All' || exp.status === filterStatus;
      const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;
      
      // Date Range
      let matchesDate = true;
      if (dateRange.start) {
        matchesDate = matchesDate && new Date(exp.date) >= new Date(dateRange.start);
      }
      if (dateRange.end) {
        matchesDate = matchesDate && new Date(exp.date) <= new Date(dateRange.end);
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  }, [expenses, searchQuery, filterStatus, filterCategory, dateRange]);

  // 2. Sort Logic
  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => {
      const aValue = a[sortConfig.key]!;
      const bValue = b[sortConfig.key]!;
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredExpenses, sortConfig]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);
  const paginatedExpenses = sortedExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 4. Metrics Logic (based on filtered view)
  const metrics = useMemo(() => {
    const total = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const pending = filteredExpenses.filter(e => e.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
    const paidCount = filteredExpenses.filter(e => e.status === 'Paid').length;
    return { total, pending, paidCount, count: filteredExpenses.length };
  }, [filteredExpenses]);

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
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkAction = (action: 'delete' | 'markPaid' | 'markPending') => {
    if (selectedIds.size === 0) return;

    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedIds.size} items?`)) {
        setExpenses(prev => prev.filter(e => !selectedIds.has(e.id)));
        setSelectedIds(new Set());
      }
    } else if (action === 'markPaid') {
      setExpenses(prev => prev.map(e => selectedIds.has(e.id) ? { ...e, status: 'Paid' } : e));
      setSelectedIds(new Set());
    } else if (action === 'markPending') {
      setExpenses(prev => prev.map(e => selectedIds.has(e.id) ? { ...e, status: 'Pending' } : e));
      setSelectedIds(new Set());
    }
  };

  const handleAddPayment = (expenseData: Omit<Expense, 'id'>, accountId?: string) => {
    onAddExpense(expenseData, accountId);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Payee', 'Description', 'Date', 'Category', 'Status', 'Method', 'Amount'];
    const csvContent = [
        headers.join(','),
        ...sortedExpenses.map(e => [
            e.id, `"${e.payee}"`, `"${e.description}"`, e.date, e.category, e.status, e.method, e.amount
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'expenses_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setFilterStatus('All');
    setFilterCategory('All');
    setSearchQuery('');
    setDateRange({ start: '', end: '' });
  };

  return (
    <>
      <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white">
        
        {/* --- Header & Metrics --- */}
        <div className="mb-8 border-b border-gray-100 pb-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl font-light text-black mb-1">Payments & Expenses</h1>
              <p className="text-xs text-gray-500 font-light">
                Enterprise expense management and disbursement tracking.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full lg:w-auto">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl min-w-[180px]">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Total Spend</span>
                        <Wallet size={14} className="text-gray-400" />
                    </div>
                    <div className="text-xl font-light text-black">${metrics.total.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl min-w-[180px]">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase text-orange-400 font-semibold tracking-wider">Pending</span>
                        <Clock size={14} className="text-orange-400" />
                    </div>
                    <div className="text-xl font-light text-orange-700">${metrics.pending.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-xl min-w-[180px]">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Records</span>
                        <PieChart size={14} className="text-gray-400" />
                    </div>
                    <div className="text-xl font-light text-black">{metrics.count}</div>
                </div>
            </div>
          </div>

          {/* --- Toolbar --- */}
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
            
            {/* Left: Search & Filter Toggles */}
            <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
                <div className="relative group w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search payee, ID, category..." 
                        className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black/20 transition-all"
                    />
                </div>
                
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors text-xs font-medium w-full md:w-auto
                    ${isFilterOpen || filterStatus !== 'All' || filterCategory !== 'All' 
                        ? 'bg-gray-100 border-gray-300 text-black' 
                        : 'bg-white border-gray-200 text-gray-500 hover:text-black hover:border-gray-300'}`}
                >
                    <Filter size={14} /> 
                    <span>Filters</span>
                    {(filterStatus !== 'All' || filterCategory !== 'All') && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-1"></div>}
                </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 w-full xl:w-auto">
                {selectedIds.size > 0 ? (
                    <div className="flex items-center gap-2 bg-black text-white px-2 py-1.5 rounded-lg w-full xl:w-auto animate-in slide-in-from-right-5 fade-in duration-300">
                        <span className="text-[10px] font-medium px-2 border-r border-white/20 whitespace-nowrap">{selectedIds.size} Selected</span>
                        <button onClick={() => handleBulkAction('markPaid')} className="p-1.5 hover:bg-white/20 rounded transition-colors text-[10px] font-medium flex items-center gap-1">
                            <CheckCircle size={12} /> Paid
                        </button>
                        <button onClick={() => handleBulkAction('markPending')} className="p-1.5 hover:bg-white/20 rounded transition-colors text-[10px] font-medium flex items-center gap-1">
                            <Clock size={12} /> Pending
                        </button>
                        <button onClick={() => handleBulkAction('delete')} className="p-1.5 hover:bg-red-500/50 rounded transition-colors text-[10px] font-medium flex items-center gap-1">
                            <Trash2 size={12} /> Delete
                        </button>
                        <button onClick={() => setSelectedIds(new Set())} className="ml-auto p-1 hover:bg-white/20 rounded"><X size={12} /></button>
                    </div>
                ) : (
                    <>
                        <button 
                            onClick={handleExportCSV}
                            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-black hover:border-gray-300 transition-colors"
                            title="Export Report"
                        >
                            <Download size={16} strokeWidth={1.5} />
                        </button>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors text-xs font-medium shadow-sm whitespace-nowrap"
                        >
                            <Plus size={14} />
                            <span>New Payment</span>
                        </button>
                    </>
                )}
            </div>
          </div>
        </div>

        {/* --- Filter Panel (Collapsible) --- */}
        {isFilterOpen && (
            <div className="mb-6 p-5 bg-gray-50/50 border border-gray-100 rounded-xl animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-1.5">Status</label>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-black/20 appearance-none"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-1.5">Category</label>
                        <select 
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-black/20 appearance-none"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-1.5">Start Date</label>
                        <input 
                            type="date" 
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-black/20"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-1.5">End Date</label>
                            <input 
                                type="date" 
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-black/20"
                            />
                        </div>
                        <button 
                            onClick={clearFilters}
                            className="h-[34px] px-3 mt-auto text-xs text-gray-500 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* --- Data Table --- */}
        <div className="flex-1 overflow-hidden fade-in bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] text-gray-500 uppercase tracking-widest font-semibold sticky top-0 z-10 backdrop-blur-sm">
                  <th className="py-3 px-4 w-10 text-center">
                    <button onClick={handleSelectAll} className="flex items-center justify-center text-gray-400 hover:text-black">
                        {selectedIds.size > 0 && selectedIds.size === paginatedExpenses.length ? <CheckSquare size={14} /> : <Square size={14} />}
                    </button>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100/50 transition-colors w-28"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-1">ID <ArrowUpDown size={10} /></div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100/50 transition-colors"
                    onClick={() => handleSort('payee')}
                  >
                    <div className="flex items-center gap-1">Payee <ArrowUpDown size={10} /></div>
                  </th>
                  <th className="py-3 px-4 hidden md:table-cell">Description</th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100/50 transition-colors"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">Date <ArrowUpDown size={10} /></div>
                  </th>
                  <th className="py-3 px-4">Status</th>
                  <th 
                    className="py-3 px-6 text-right cursor-pointer hover:bg-gray-100/50 transition-colors"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center justify-end gap-1">Amount <ArrowUpDown size={10} /></div>
                  </th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-gray-50">
                {paginatedExpenses.length > 0 ? paginatedExpenses.map((exp) => (
                  <tr 
                    key={exp.id} 
                    className={`group transition-colors ${selectedIds.has(exp.id) ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                  >
                    <td className="py-3 px-4 text-center">
                        <button 
                            onClick={() => handleSelectOne(exp.id)}
                            className={`flex items-center justify-center transition-colors ${selectedIds.has(exp.id) ? 'text-black' : 'text-gray-300 hover:text-gray-500'}`}
                        >
                            {selectedIds.has(exp.id) ? <CheckSquare size={14} /> : <Square size={14} />}
                        </button>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono">{exp.id}</td>
                    <td className="py-3 px-4 font-medium text-black">
                        {exp.payee}
                        <div className="md:hidden text-[10px] text-gray-400 font-normal truncate max-w-[100px]">{exp.description}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 hidden md:table-cell truncate max-w-xs">{exp.description}</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{exp.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${
                        exp.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' :
                        exp.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        exp.status === 'Failed' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {exp.status === 'Paid' && <CheckCircle size={10} />}
                        {exp.status === 'Pending' && <Clock size={10} />}
                        {exp.status === 'Failed' && <AlertCircle size={10} />}
                        {exp.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-black text-right font-mono font-medium">
                      ${exp.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="relative group/actions">
                          <button className="text-gray-300 hover:text-black p-1 transition-colors">
                              <MoreHorizontal size={14} />
                          </button>
                          {/* Dropdown Menu (Hover based for simplicity in list) */}
                          <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-20 hidden group-hover/actions:block animate-in fade-in zoom-in-95 origin-top-right">
                              <button className="block w-full text-left px-3 py-2 text-[10px] hover:bg-gray-50 text-gray-700">View Details</button>
                              <button className="block w-full text-left px-3 py-2 text-[10px] hover:bg-gray-50 text-gray-700">Download Receipt</button>
                              <div className="h-px bg-gray-100 my-1"></div>
                              <button 
                                onClick={() => {
                                    if(confirm('Delete payment?')) setExpenses(prev => prev.filter(e => e.id !== exp.id));
                                }}
                                className="block w-full text-left px-3 py-2 text-[10px] hover:bg-red-50 text-red-600"
                              >
                                  Delete
                              </button>
                          </div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                <Search size={20} className="opacity-30" />
                            </div>
                            <span className="text-sm">No payments found matching your filters.</span>
                            <button onClick={clearFilters} className="text-blue-600 hover:underline text-xs">Clear Filters</button>
                        </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* --- Pagination Footer --- */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs">
              <span className="text-gray-500">
                  Showing <span className="font-medium text-black">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-black">{Math.min(currentPage * itemsPerPage, sortedExpenses.length)}</span> of <span className="font-medium text-black">{sortedExpenses.length}</span> results
              </span>
              
              <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                      <ChevronLeft size={14} />
                  </button>
                  <span className="text-gray-600 font-medium px-2">Page {currentPage} of {totalPages || 1}</span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                      <ChevronRight size={14} />
                  </button>
              </div>
          </div>
        </div>
      </div>

      <AddPaymentModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPayment}
        accounts={accounts}
      />
    </>
  );
};

export default PaymentsList;
