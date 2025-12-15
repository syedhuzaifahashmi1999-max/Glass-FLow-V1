
import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, AreaChart, Area } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, TrendingUp, Filter, Search, Download, Plus, List, LayoutDashboard, MoreHorizontal, X, ArrowUpDown, Trash2 } from 'lucide-react';
import { CHART_DATA } from '../constants';
import { SaleTransaction } from '../types';
import AddTransactionModal from '../components/sales/AddTransactionModal';

interface SalesOverviewProps {
    sales: SaleTransaction[];
    setSales: React.Dispatch<React.SetStateAction<SaleTransaction[]>>;
    currency?: string;
}

const SalesOverview: React.FC<SalesOverviewProps> = ({ sales, setSales, currency = 'USD' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
  
  // -- Transactions State --
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [methodFilter, setMethodFilter] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // -- Modals --
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- Calculations ---
  const totalRevenue = sales.filter(s => s.status === 'Completed').reduce((sum, s) => sum + s.amount, 0);
  const totalTransactions = sales.length;
  const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // --- Helpers ---
  const formatCurrency = (amount: number, digits = 0) => {
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: currency, 
        minimumFractionDigits: digits,
        maximumFractionDigits: digits 
    }).format(amount);
  };

  // --- Handlers ---
  const handleAddTransaction = (saleData: Omit<SaleTransaction, 'id'>) => {
      const newSale: SaleTransaction = {
          ...saleData,
          id: `txn_${Date.now()}`
      };
      setSales(prev => [newSale, ...prev]);
  };

  const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this transaction?')) {
          setSales(prev => prev.filter(s => s.id !== id));
      }
  };

  const handleExportCSV = () => {
      const headers = ['ID', 'Customer', 'Product', 'Date', 'Amount', 'Method', 'Status'];
      const csvContent = [
          headers.join(','),
          ...filteredSales.map(s => [
              s.id, `"${s.customerName}"`, `"${s.product}"`, s.date, s.amount, s.paymentMethod, s.status
          ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sales_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // --- Filter Logic ---
  const filteredSales = sales.filter(s => {
      const matchesSearch = s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchesMethod = methodFilter === 'All' || s.paymentMethod === methodFilter;
      return matchesSearch && matchesStatus && matchesMethod;
  });

  const sortedSales = [...filteredSales].sort((a, b) => {
      // Simple date sort for now, assuming date string format fits or mock data
      // For proper date sort, convert to Date object
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const clearFilters = () => {
      setStatusFilter('All');
      setMethodFilter('All');
      setSearchQuery('');
  };

  const getStatusColor = (status: SaleTransaction['status']) => {
      switch(status) {
          case 'Completed': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20';
          case 'Pending': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20';
          case 'Failed': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20';
          case 'Refunded': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20';
          default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5';
      }
  };

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-light text-black dark:text-white mb-1">Sales & Revenue</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
            Monitor financial performance and transaction history.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 mr-2">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    <LayoutDashboard size={14} /> Overview
                </button>
                <button 
                    onClick={() => setActiveTab('transactions')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'transactions' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    <List size={14} /> Transactions
                </button>
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

            <button 
                onClick={handleExportCSV}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                title="Export CSV"
            >
                <Download size={16} strokeWidth={1.5} />
            </button>
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm ml-1"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Sale</span>
            </button>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar fade-in">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
              <div className="space-y-8 pb-10">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm hover:shadow-md dark:hover:shadow-none transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                        <DollarSign size={20} strokeWidth={1.5} />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full border border-green-100 dark:border-green-500/20">
                        <ArrowUpRight size={10} /> 12%
                        </span>
                    </div>
                    <h3 className="text-3xl font-light text-black dark:text-white tracking-tight mb-1">{formatCurrency(totalRevenue)}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">Total Revenue</p>
                    </div>

                    <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm hover:shadow-md dark:hover:shadow-none transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                        <CreditCard size={20} strokeWidth={1.5} />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                        0%
                        </span>
                    </div>
                    <h3 className="text-3xl font-light text-black dark:text-white tracking-tight mb-1">{totalTransactions}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">Transactions</p>
                    </div>

                    <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm hover:shadow-md dark:hover:shadow-none transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                        <TrendingUp size={20} strokeWidth={1.5} />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full border border-red-100 dark:border-red-500/20">
                        <ArrowDownRight size={10} /> 2%
                        </span>
                    </div>
                    <h3 className="text-3xl font-light text-black dark:text-white tracking-tight mb-1">{formatCurrency(avgOrderValue)}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">Avg. Order Value</p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Chart */}
                    <div className="lg:col-span-2 p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-medium text-black dark:text-white">Revenue Trend</h3>
                            <select className="text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 outline-none text-black dark:text-white">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={CHART_DATA}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000000" stopOpacity={0.1} className="dark:stop-color-white" />
                                        <stop offset="95%" stopColor="#000000" stopOpacity={0} className="dark:stop-color-white" />
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#9CA3AF'}} 
                                    dy={10}
                                />
                                <Tooltip 
                                    cursor={{stroke: '#E5E7EB'}}
                                    contentStyle={{ 
                                        backgroundColor: 'var(--bg-panel)', 
                                        borderRadius: '8px', 
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-main)',
                                        fontSize: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    formatter={(val: number) => [formatCurrency(val), 'Amount']}
                                />
                                <Area type="monotone" dataKey="value" stroke="var(--text-main)" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Transactions List (Mini) */}
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] overflow-hidden flex flex-col shadow-sm">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-sm font-medium text-black dark:text-white">Recent Sales</h3>
                            <button onClick={() => setActiveTab('transactions')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View All</button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 max-h-[300px]">
                        {sales.slice(0, 5).map((sale) => (
                            <div key={sale.id} className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors flex justify-between items-center group mb-1">
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-black dark:text-white">{sale.customerName}</span>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{sale.date}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs font-mono text-black dark:text-white font-medium">{formatCurrency(sale.amount, 2)}</span>
                                    <span className={`text-[9px] uppercase tracking-wide font-medium ${
                                        sale.status === 'Completed' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                                    }`}>
                                        {sale.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                  </div>
              </div>
          )}

          {/* TAB: TRANSACTIONS */}
          {activeTab === 'transactions' && (
              <div className="flex flex-col h-full space-y-4">
                  
                  {/* Toolbar */}
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center bg-gray-50/50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="relative group w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search transactions..." 
                            className="w-full md:w-64 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:ring-0 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto">
                          <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-xs font-medium ${isFilterOpen ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-black/20 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'}`}
                          >
                              <Filter size={14} /> Filter
                          </button>
                          
                          <button 
                             onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                             className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 transition-colors text-xs font-medium"
                          >
                              <ArrowUpDown size={14} className={sortOrder === 'asc' ? '' : 'rotate-180'} /> Sort Date
                          </button>
                      </div>
                  </div>

                  {/* Expanded Filters */}
                  {isFilterOpen && (
                      <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl animate-in slide-in-from-top-2 fade-in">
                          <div className="flex flex-wrap gap-6 items-end">
                              <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Status</label>
                                  <select 
                                      value={statusFilter}
                                      onChange={(e) => setStatusFilter(e.target.value)}
                                      className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                                  >
                                      <option value="All">All Statuses</option>
                                      <option value="Completed">Completed</option>
                                      <option value="Pending">Pending</option>
                                      <option value="Failed">Failed</option>
                                      <option value="Refunded">Refunded</option>
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Payment Method</label>
                                  <select 
                                      value={methodFilter}
                                      onChange={(e) => setMethodFilter(e.target.value)}
                                      className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                                  >
                                      <option value="All">All Methods</option>
                                      <option value="Credit Card">Credit Card</option>
                                      <option value="Wire Transfer">Wire Transfer</option>
                                      <option value="PayPal">PayPal</option>
                                  </select>
                              </div>
                              <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-black dark:hover:text-white ml-auto">Clear Filters</button>
                          </div>
                      </div>
                  )}

                  {/* Table */}
                  <div className="flex-1 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                      <div className="overflow-y-auto custom-scrollbar flex-1">
                          <table className="w-full text-left border-collapse">
                              <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800">
                                  <tr>
                                      <th className="py-3 px-6 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold">Transaction ID</th>
                                      <th className="py-3 px-6 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold">Customer</th>
                                      <th className="py-3 px-6 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold">Product</th>
                                      <th className="py-3 px-6 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold">Date</th>
                                      <th className="py-3 px-6 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold">Method</th>
                                      <th className="py-3 px-6 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold text-right">Amount</th>
                                      <th className="py-3 px-6 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold text-center">Status</th>
                                      <th className="py-3 px-6 w-10"></th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                  {sortedSales.length > 0 ? sortedSales.map((sale) => (
                                      <tr key={sale.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                          <td className="py-3 px-6 text-xs font-mono text-gray-500 dark:text-gray-400">{sale.id}</td>
                                          <td className="py-3 px-6 text-sm font-medium text-black dark:text-white">{sale.customerName}</td>
                                          <td className="py-3 px-6 text-xs text-gray-600 dark:text-gray-300">{sale.product}</td>
                                          <td className="py-3 px-6 text-xs text-gray-500 dark:text-gray-400">{sale.date}</td>
                                          <td className="py-3 px-6 text-xs text-gray-500 dark:text-gray-400">{sale.paymentMethod}</td>
                                          <td className="py-3 px-6 text-sm font-mono text-black dark:text-white text-right">{formatCurrency(sale.amount, 2)}</td>
                                          <td className="py-3 px-6 text-center">
                                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(sale.status)}`}>
                                                  {sale.status}
                                              </span>
                                          </td>
                                          <td className="py-3 px-6 text-right">
                                              <button 
                                                onClick={() => handleDelete(sale.id)}
                                                className="text-gray-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                              >
                                                  <Trash2 size={14} />
                                              </button>
                                          </td>
                                      </tr>
                                  )) : (
                                      <tr>
                                          <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                                              No transactions found matching your criteria.
                                          </td>
                                      </tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5 text-[10px] text-gray-400 flex justify-between items-center">
                          <span>Showing {sortedSales.length} of {sales.length} transactions</span>
                          <div className="flex gap-2">
                              <button className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-black/20 disabled:opacity-50 text-black dark:text-white" disabled>Previous</button>
                              <button className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-black/20 disabled:opacity-50 text-black dark:text-white" disabled>Next</button>
                          </div>
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>

    <AddTransactionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddTransaction}
    />
    </>
  );
};

export default SalesOverview;
