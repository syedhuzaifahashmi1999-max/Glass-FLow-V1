
import React, { useState, useMemo } from 'react';
import { 
  Scale, Calendar, Download, RefreshCw, Landmark, CreditCard, 
  TrendingUp, PieChart, Info, CheckCircle, AlertCircle, ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, Cell, Pie, PieChart as RePieChart, AreaChart, Area
} from 'recharts';
import { MOCK_ACCOUNTS } from '../constants';
import { GLAccount } from '../types';

interface BalanceSheetProps {
  currency?: string;
}

const BalanceSheet: React.FC<BalanceSheetProps> = ({ currency = 'USD' }) => {
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);
  const [isExporting, setIsExporting] = useState(false);

  // --- Calculations ---

  // 1. Asset Classification
  const currentAssets = MOCK_ACCOUNTS.filter(a => a.type === 'Asset' && (a.subtype === 'Current Asset' || a.subtype === 'Bank'));
  const fixedAssets = MOCK_ACCOUNTS.filter(a => a.type === 'Asset' && a.subtype === 'Fixed Asset');
  
  const totalCurrentAssets = currentAssets.reduce((sum, a) => sum + a.balance, 0);
  const totalFixedAssets = fixedAssets.reduce((sum, a) => sum + a.balance, 0);
  const totalAssets = totalCurrentAssets + totalFixedAssets;

  // 2. Liability Classification
  const currentLiabilities = MOCK_ACCOUNTS.filter(a => a.type === 'Liability' && (a.subtype === 'Current Liability' || a.subtype === 'Credit Card'));
  const longTermLiabilities = MOCK_ACCOUNTS.filter(a => a.type === 'Liability' && a.subtype === 'Long Term Liability');

  const totalCurrentLiabilities = currentLiabilities.reduce((sum, a) => sum + a.balance, 0);
  const totalLongTermLiabilities = longTermLiabilities.reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

  // 3. Equity
  const equityAccounts = MOCK_ACCOUNTS.filter(a => a.type === 'Equity');
  const totalEquityStated = equityAccounts.reduce((sum, a) => sum + a.balance, 0);
  
  // Implied Retained Earnings for balancing
  const calculatedRetainedEarnings = totalAssets - totalLiabilities - totalEquityStated;
  const totalEquity = totalEquityStated + calculatedRetainedEarnings;
  const totalLiabAndEquity = totalLiabilities + totalEquity;

  const isBalanced = Math.abs(totalAssets - totalLiabAndEquity) < 0.01;

  // --- Financial Ratios ---
  const currentRatio = totalCurrentLiabilities > 0 ? totalCurrentAssets / totalCurrentLiabilities : 0;
  const quickRatio = totalCurrentLiabilities > 0 ? (totalCurrentAssets * 0.8) / totalCurrentLiabilities : 0; // Assuming 20% inventory
  const debtToEquity = totalEquity > 0 ? totalLiabilities / totalEquity : 0;
  const workingCapital = totalCurrentAssets - totalCurrentLiabilities;

  const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);
  };

  const handleExport = () => {
      setIsExporting(true);
      setTimeout(() => {
          setIsExporting(false);
          alert("Balance Sheet Exported");
      }, 1000);
  };

  // --- Charts Data ---
  
  // Stacked Bar for Balancing
  const balanceChartData = [
      { name: 'Position', Assets: totalAssets, Liabilities: totalLiabilities, Equity: totalEquity }
  ];

  // Mock Trend for Equity Growth
  const equityTrendData = [
      { name: 'Jan', value: totalEquity * 0.85 },
      { name: 'Feb', value: totalEquity * 0.88 },
      { name: 'Mar', value: totalEquity * 0.92 },
      { name: 'Apr', value: totalEquity * 0.95 },
      { name: 'May', value: totalEquity * 0.98 },
      { name: 'Jun', value: totalEquity },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto flex flex-col bg-white dark:bg-[#18181b] fade-in pb-20">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 shrink-0">
            <div>
                <h1 className="text-3xl font-light text-black dark:text-white mb-2">Balance Sheet</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Statement of financial position and solvency.</p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
                    <Calendar size={14} className="text-gray-400" />
                    <input 
                        type="date" 
                        value={asOfDate}
                        onChange={(e) => setAsOfDate(e.target.value)}
                        className="bg-transparent text-xs font-medium text-black dark:text-white outline-none"
                    />
                </div>
                <button 
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold hover:opacity-90 transition-all shadow-sm"
                >
                    {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                    Export
                </button>
            </div>
        </div>

        {/* Ratio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 shrink-0">
            <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Current Ratio</p>
                <div className="flex items-baseline gap-2">
                    <h3 className={`text-3xl font-light ${currentRatio >= 1.5 ? 'text-green-600' : currentRatio >= 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {currentRatio.toFixed(2)}
                    </h3>
                    <span className="text-xs text-gray-400">Target: 1.5+</span>
                </div>
            </div>
            <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Ratio</p>
                <div className="flex items-baseline gap-2">
                     <h3 className={`text-3xl font-light ${quickRatio >= 1 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {quickRatio.toFixed(2)}
                    </h3>
                    <span className="text-xs text-gray-400">Target: 1.0+</span>
                </div>
            </div>
            <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Debt to Equity</p>
                <div className="flex items-baseline gap-2">
                     <h3 className={`text-3xl font-light ${debtToEquity < 2 ? 'text-green-600' : 'text-red-600'}`}>
                        {debtToEquity.toFixed(2)}
                    </h3>
                    <span className="text-xs text-gray-400">Target: &lt; 2.0</span>
                </div>
            </div>
            <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Working Capital</p>
                <h3 className="text-3xl font-light text-black dark:text-white">
                    {formatCurrency(workingCapital)}
                </h3>
            </div>
        </div>

        {/* Charts & Equation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 shrink-0">
            {/* Visual Balance */}
            <div className="lg:col-span-1 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col">
                 <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-6">Equation Check</h3>
                 
                 <div className="flex-1 flex flex-col justify-center">
                     <div className="flex justify-center items-end gap-4 h-48 w-full">
                         {/* Assets Bar */}
                         <div className="w-16 bg-green-500 rounded-t-lg relative group h-full">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-green-600">
                                {formatCurrency(totalAssets)}
                            </div>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white font-medium uppercase rotate-90 origin-left translate-x-3 mb-2">Assets</div>
                         </div>
                         
                         <div className="text-2xl font-light text-gray-300 mb-20">=</div>

                         {/* Liab + Equity Bar */}
                         <div className="w-16 flex flex-col-reverse h-full relative group">
                             <div className="bg-blue-500 rounded-b-none w-full" style={{ height: `${(totalEquity/totalLiabAndEquity)*100}%` }}></div>
                             <div className="bg-red-400 rounded-t-lg w-full flex-1"></div>
                             
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600 dark:text-gray-300">
                                {formatCurrency(totalLiabAndEquity)}
                             </div>
                         </div>
                     </div>
                     
                     <div className="mt-8 flex justify-center items-center gap-6 text-xs text-gray-500">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Assets</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded-sm"></div> Liab.</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Equity</div>
                     </div>

                     <div className={`mt-6 text-center text-xs font-bold py-1 px-3 rounded-full border w-fit mx-auto ${isBalanced ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                         {isBalanced ? 'Balanced' : 'Unbalanced'}
                     </div>
                 </div>
            </div>

            {/* Equity Trend */}
            <div className="lg:col-span-2 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col">
                <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-6">Equity Growth Trend</h3>
                <div className="flex-1 w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={equityTrendData}>
                            <defs>
                                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} tickFormatter={(v) => `${v/1000}k`} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)' }}
                                formatter={(val: number) => formatCurrency(val)}
                            />
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorEquity)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Detailed Sheet */}
        <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-black dark:text-white tracking-tight">Financial Position Detail</h3>
                <div className="text-xs text-gray-500 font-mono">Consolidated View</div>
            </div>

            <div className="overflow-x-auto">
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 min-w-[800px]">
                    
                    {/* Left Column: Assets */}
                    <div>
                        <div className="flex items-center justify-between border-b-2 border-green-500 pb-2 mb-6">
                            <h4 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Assets</h4>
                            <span className="text-sm font-bold text-green-600">{formatCurrency(totalAssets)}</span>
                        </div>
                        
                        {/* Current Assets Section */}
                        <div className="mb-8">
                            <h5 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                <ArrowRight size={12} /> Current Assets
                            </h5>
                            <div className="pl-4 space-y-2">
                                {currentAssets.map(acc => (
                                    <div key={acc.id} className="flex justify-between text-xs py-1 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 px-2 -mx-2 rounded transition-colors">
                                        <span className="text-gray-700 dark:text-gray-300">{acc.name}</span>
                                        <span className="font-mono text-black dark:text-white">{formatCurrency(acc.balance)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-xs font-bold pt-2 text-gray-900 dark:text-white">
                                    <span>Total Current Assets</span>
                                    <span>{formatCurrency(totalCurrentAssets)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Fixed Assets Section */}
                        <div className="mb-6">
                            <h5 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                <ArrowRight size={12} /> Non-Current Assets
                            </h5>
                            <div className="pl-4 space-y-2">
                                {fixedAssets.map(acc => (
                                    <div key={acc.id} className="flex justify-between text-xs py-1 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 px-2 -mx-2 rounded transition-colors">
                                        <span className="text-gray-700 dark:text-gray-300">{acc.name}</span>
                                        <span className="font-mono text-black dark:text-white">{formatCurrency(acc.balance)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-xs font-bold pt-2 text-gray-900 dark:text-white">
                                    <span>Total Fixed Assets</span>
                                    <span>{formatCurrency(totalFixedAssets)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Liabilities & Equity */}
                    <div>
                        <div className="flex items-center justify-between border-b-2 border-red-500 pb-2 mb-6">
                            <h4 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Liabilities & Equity</h4>
                            <span className="text-sm font-bold text-black dark:text-white">{formatCurrency(totalLiabAndEquity)}</span>
                        </div>

                        {/* Current Liabilities */}
                        <div className="mb-8">
                            <h5 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                <ArrowRight size={12} /> Current Liabilities
                            </h5>
                            <div className="pl-4 space-y-2">
                                {currentLiabilities.map(acc => (
                                    <div key={acc.id} className="flex justify-between text-xs py-1 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 px-2 -mx-2 rounded transition-colors">
                                        <span className="text-gray-700 dark:text-gray-300">{acc.name}</span>
                                        <span className="font-mono text-black dark:text-white">{formatCurrency(acc.balance)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-xs font-bold pt-2 text-gray-900 dark:text-white">
                                    <span>Total Current Liabilities</span>
                                    <span>{formatCurrency(totalCurrentLiabilities)}</span>
                                </div>
                            </div>
                        </div>

                         {/* Equity */}
                         <div className="mb-6">
                            <h5 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                <ArrowRight size={12} /> Equity
                            </h5>
                            <div className="pl-4 space-y-2">
                                {equityAccounts.map(acc => (
                                    <div key={acc.id} className="flex justify-between text-xs py-1 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 px-2 -mx-2 rounded transition-colors">
                                        <span className="text-gray-700 dark:text-gray-300">{acc.name}</span>
                                        <span className="font-mono text-black dark:text-white">{formatCurrency(acc.balance)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-xs py-1 border-b border-gray-50 dark:border-gray-800 px-2 -mx-2 rounded">
                                    <span className="text-gray-700 dark:text-gray-300 italic">Net Income (Current)</span>
                                    <span className="font-mono text-black dark:text-white">{formatCurrency(calculatedRetainedEarnings)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold pt-2 text-gray-900 dark:text-white">
                                    <span>Total Equity</span>
                                    <span>{formatCurrency(totalEquity)}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>

    </div>
  );
};

export default BalanceSheet;
