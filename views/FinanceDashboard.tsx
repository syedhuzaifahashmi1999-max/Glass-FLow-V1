

import React, { useState, useMemo } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, 
  ArrowUpRight, ArrowDownLeft, Receipt, Activity, ShoppingBag, 
  Download, Calendar, Filter, ChevronDown, RefreshCw, FileText, Send, AlertCircle, CheckCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';
import { MOCK_SALES, MOCK_EXPENSES, MOCK_BANK_ACCOUNTS, MOCK_INVOICES } from '../constants';
import { SaleTransaction, Expense } from '../types';

const FinanceDashboard: React.FC<{ currency?: string }> = ({ currency = 'USD' }) => {
  // --- State ---
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'YTD'>('30d');
  const [isExporting, setIsExporting] = useState(false);

  // --- Derived Metrics ---
  const totalRevenue = MOCK_SALES.filter(s => s.status === 'Completed').reduce((acc, s) => acc + s.amount, 0);
  const totalExpenses = MOCK_EXPENSES.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const cashOnHand = MOCK_BANK_ACCOUNTS.reduce((acc, b) => acc + b.balance, 0);
  
  // Calculate burn rate (mock logic based on expenses)
  const monthlyBurnRate = totalExpenses / 1.5; 
  const runwayMonths = monthlyBurnRate > 0 ? (cashOnHand / monthlyBurnRate).toFixed(1) : '∞';

  const outstandingInvoices = MOCK_INVOICES.filter(i => i.status !== 'Paid');
  const outstandingAmount = outstandingInvoices.reduce((acc, i) => acc + i.amount, 0);

  // --- Chart Data Generators ---
  const cashFlowData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 12;
    const data = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const label = timeRange === 'YTD' 
            ? d.toLocaleString('default', { month: 'short' }) 
            : d.toLocaleDateString('default', { day: 'numeric', month: 'short' });
        
        // Mock randomized data based on realistic volatility
        const baseIncome = 4000;
        const baseExpense = 2500;
        const volatility = 2000;

        data.push({
            name: label,
            income: Math.max(0, baseIncome + (Math.random() * volatility - volatility/2)),
            expense: Math.max(0, baseExpense + (Math.random() * volatility - volatility/2)),
            net: 0 // Calculated below
        });
    }
    // Calculate net for the line chart
    return data.map(d => ({ ...d, net: d.income - d.expense }));
  }, [timeRange]);

  const expenseBreakdownData = useMemo(() => {
    const map: Record<string, number> = {};
    MOCK_EXPENSES.forEach(e => {
        map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.keys(map).map(k => ({ name: k, value: map[k] })).sort((a,b) => b.value - a.value);
  }, []);

  // --- Handlers ---

  const handleExportReport = () => {
      setIsExporting(true);
      setTimeout(() => {
          // Simulate download
          const csvContent = "Date,Income,Expense,Net\n" + cashFlowData.map(r => `${r.name},${r.income},${r.expense},${r.net}`).join("\n");
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `financial_report_${timeRange}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setIsExporting(false);
      }, 1000);
  };

  const handleRemindClient = (invoiceId: string) => {
      alert(`Reminder sent for Invoice #${invoiceId}`);
  };

  const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-y-auto custom-scrollbar fade-in">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
            <div>
                <h1 className="text-3xl font-light text-black dark:text-white mb-2">Finance Overview</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Real-time financial health, cash flow analysis, and ledger.
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                    {['7d', '30d', '90d', 'YTD'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range as any)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                timeRange === range 
                                ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={handleExportReport}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold hover:opacity-90 transition-all shadow-sm"
                >
                    {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                    Export Report
                </button>
            </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Net Profit */}
            <div className="p-6 bg-gradient-to-br from-gray-900 to-black dark:from-[#27272a] dark:to-[#09090b] text-white rounded-xl shadow-lg relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-xs font-bold uppercase tracking-wider opacity-60">Net Profit</p>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-medium">+24%</span>
                    </div>
                    <h3 className="text-3xl font-light tracking-tight">{formatCurrency(netProfit)}</h3>
                    <p className="text-[10px] opacity-50 mt-1">Net Income (YTD)</p>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Activity size={80} />
                </div>
            </div>

            {/* Total Revenue */}
            <div className="p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-blue-500/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                        <TrendingUp size={20} />
                    </div>
                </div>
                <h3 className="text-3xl font-light text-black dark:text-white">{formatCurrency(totalRevenue)}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-1">Total Revenue</p>
            </div>

            {/* Expenses */}
            <div className="p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-red-500/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                        <TrendingDown size={20} />
                    </div>
                </div>
                <h3 className="text-3xl font-light text-black dark:text-white">{formatCurrency(totalExpenses)}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-1">Total Expenses</p>
            </div>

            {/* Cash on Hand */}
            <div className="p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-emerald-500/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                        <Wallet size={20} />
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Runway</span>
                        <p className="text-xs font-mono text-black dark:text-white">{runwayMonths} Mo</p>
                    </div>
                </div>
                <h3 className="text-3xl font-light text-black dark:text-white">{formatCurrency(cashOnHand)}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-1">Cash on Hand</p>
            </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Cash Flow Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-[#18181b] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Cash Flow Analysis</h3>
                    <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Income</div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Expense</div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Net</div>
                    </div>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={cashFlowData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} tickFormatter={(val) => `$${val/1000}k`} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'var(--bg-panel)', 
                                    borderRadius: '8px', 
                                    border: '1px solid var(--border-color)',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                formatter={(val: number) => formatCurrency(val)}
                            />
                            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={8} />
                            <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={8} />
                            <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Accounts Receivable */}
            <div className="bg-white dark:bg-[#18181b] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Outstanding Invoices</h3>
                    <span className="text-xs font-mono text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">{formatCurrency(outstandingAmount)}</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                    {outstandingInvoices.length > 0 ? outstandingInvoices.map(inv => (
                        <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5 hover:border-red-200 dark:hover:border-red-800 transition-colors group">
                            <div>
                                <div className="text-xs font-bold text-black dark:text-white mb-0.5">{inv.customerName}</div>
                                <div className="text-[10px] text-gray-500">Due: {inv.dueDate}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-mono font-medium text-black dark:text-white">{formatCurrency(inv.amount)}</div>
                                <button 
                                    onClick={() => handleRemindClient(inv.id)}
                                    className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 justify-end ml-auto"
                                >
                                    <Send size={10} /> Remind
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-xs">
                            <CheckCircle size={24} className="mb-2 text-green-500 opacity-50" />
                            All caught up! No overdue invoices.
                        </div>
                    )}
                </div>
                <button className="w-full mt-4 py-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-500 hover:text-black dark:hover:text-white hover:border-gray-400 transition-all">
                    View All Invoices
                </button>
            </div>
        </div>

        {/* Bottom Section: Expense Categories & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Expense Breakdown */}
            <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                 <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-6">Expense Categories</h3>
                 <div className="space-y-4">
                     {expenseBreakdownData.slice(0, 5).map((item, idx) => {
                         const percentage = (item.value / totalExpenses) * 100;
                         return (
                             <div key={item.name}>
                                 <div className="flex justify-between items-center text-xs mb-1.5">
                                     <span className="font-medium text-black dark:text-white">{item.name}</span>
                                     <span className="text-gray-500">{formatCurrency(item.value)} ({percentage.toFixed(1)}%)</span>
                                 </div>
                                 <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                     <div 
                                        className="h-full bg-black dark:bg-white rounded-full" 
                                        style={{ width: `${percentage}%`, opacity: 1 - (idx * 0.15) }}
                                     ></div>
                                 </div>
                             </div>
                         )
                     })}
                 </div>
            </div>

            {/* Recent Sales Ledger */}
            <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Recent Transactions</h3>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                        View Ledger <ArrowUpRight size={12} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {MOCK_SALES.slice(0, 5).map(sale => (
                        <div key={sale.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg mb-1 group cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${sale.status === 'Completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-gray-100 dark:bg-white/10 text-gray-500'}`}>
                                    <Receipt size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-black dark:text-white">{sale.customerName}</p>
                                    <p className="text-[10px] text-gray-500">{sale.date} • {sale.paymentMethod}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-mono font-medium text-black dark:text-white">+{formatCurrency(sale.amount)}</p>
                                <span className={`text-[9px] uppercase font-bold ${sale.status === 'Completed' ? 'text-green-600' : 'text-orange-500'}`}>
                                    {sale.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    </div>
  );
};

export default FinanceDashboard;
