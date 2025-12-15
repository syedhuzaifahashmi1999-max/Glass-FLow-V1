
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, Download, 
  BarChart2, PieChart, ArrowUpRight, ArrowDownRight, RefreshCw,
  Layers, Percent, ChevronDown, ChevronRight, Activity, Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, Area
} from 'recharts';
import { MOCK_SALES, MOCK_EXPENSES } from '../constants';

interface ProfitLossProps {
  currency?: string;
}

const ProfitLoss: React.FC<ProfitLossProps> = ({ currency = 'USD' }) => {
  const [timeRange, setTimeRange] = useState<'Month' | 'Quarter' | 'YTD'>('YTD');
  const [comparisonMode, setComparisonMode] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
      'revenue': true,
      'cogs': true,
      'opex': true
  });

  // --- Helpers ---
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);
  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  const toggleSection = (section: string) => {
      setExpandedSections(prev => ({...prev, [section]: !prev[section]}));
  };

  // --- Financial Calculations (Enterprise Logic) ---
  
  // 1. Revenue
  const revenueItems = MOCK_SALES.filter(s => s.status === 'Completed');
  const totalRevenue = revenueItems.reduce((acc, s) => acc + s.amount, 0);
  
  // 2. COGS (Simulated for Demo - typically derived from inventory)
  // Assuming Product sales have 40% COGS, Services have 10% COGS
  const cogsData = revenueItems.map(item => ({
      ...item,
      cost: item.product.includes('Service') || item.product.includes('Consulting') ? item.amount * 0.15 : item.amount * 0.40
  }));
  const totalCOGS = cogsData.reduce((acc, item) => acc + item.cost, 0);
  
  const grossProfit = totalRevenue - totalCOGS;
  const grossMargin = (grossProfit / totalRevenue) * 100;

  // 3. Operating Expenses (Grouped)
  const opexItems = MOCK_EXPENSES;
  const totalOpex = opexItems.reduce((acc, e) => acc + e.amount, 0);
  
  // Grouping OPEX
  const opexByCat = useMemo(() => {
      const groups: Record<string, number> = {};
      opexItems.forEach(item => {
          groups[item.category] = (groups[item.category] || 0) + item.amount;
      });
      return Object.entries(groups).sort((a,b) => b[1] - a[1]);
  }, [opexItems]);

  const operatingIncome = grossProfit - totalOpex; // EBIT
  const operatingMargin = (operatingIncome / totalRevenue) * 100;

  // 4. Non-Operating (Simulated Taxes/Interest)
  const interestExpense = 1200; 
  const taxes = Math.max(0, (operatingIncome - interestExpense) * 0.24); // 24% Tax Rate
  
  const netIncome = operatingIncome - interestExpense - taxes;
  const netMargin = (netIncome / totalRevenue) * 100;

  // --- Chart Data Generation (Trend) ---
  const chartData = useMemo(() => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.slice(0, 6).map((month, i) => {
          // Add some volatility for realism
          const factor = 1 + (Math.sin(i) * 0.1); 
          const rev = (totalRevenue / 6) * factor;
          const exp = (totalOpex / 6) * (factor * 0.9); 
          const cogs = rev * 0.35;
          return {
              name: month,
              Revenue: rev,
              Expenses: exp + cogs,
              NetIncome: rev - (exp + cogs) - (rev * 0.05) // approx tax
          };
      });
  }, [totalRevenue, totalOpex]);


  // --- Render Helpers ---

  const TableRow = ({ 
      label, 
      amount, 
      isHeader = false, 
      isTotal = false, 
      indent = false,
      hasSub = false,
      isExpanded = false,
      onToggle,
      negative = false
  }: any) => {
      const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
      
      return (
          <div className={`
              flex items-center justify-between py-3 px-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors
              ${isHeader ? 'bg-gray-50/50 dark:bg-white/5 font-semibold text-gray-900 dark:text-white' : ''}
              ${isTotal ? 'bg-gray-100/50 dark:bg-white/10 font-bold text-black dark:text-white border-t-2 border-gray-200 dark:border-gray-700' : 'text-gray-600 dark:text-gray-300 text-sm'}
          `}>
              <div className="flex items-center gap-2 flex-1">
                  {indent && <div className="w-6"></div>}
                  {hasSub && (
                      <button onClick={onToggle} className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-white/20 text-gray-400">
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                  )}
                  {!hasSub && indent && <div className="w-4"></div>}
                  <span>{label}</span>
              </div>
              
              <div className="w-32 text-right font-mono">
                  {negative && amount > 0 ? '(' : ''}
                  {formatCurrency(amount)}
                  {negative && amount > 0 ? ')' : ''}
              </div>
              
              {/* Common Size Analysis Column */}
              <div className="w-24 text-right font-mono text-xs text-gray-400 hidden sm:block">
                  {formatPercent(percentage)}
              </div>

              {/* Comparison (Mock) */}
              {comparisonMode && (
                  <div className={`w-24 text-right font-mono text-xs hidden md:block ${amount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                      {amount > 0 ? '+4.2%' : '-'}
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto flex flex-col bg-white dark:bg-[#18181b] fade-in pb-20">
        
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 shrink-0">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-light text-black dark:text-white">Profit & Loss</h1>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 uppercase tracking-wide">
                        Consolidated
                    </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Comprehensive income statement and vertical analysis.
                </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 font-medium">Compare:</span>
                    <button 
                        onClick={() => setComparisonMode(!comparisonMode)}
                        className={`text-xs font-bold transition-colors ${comparisonMode ? 'text-blue-600' : 'text-gray-400'}`}
                    >
                        {comparisonMode ? 'vs Previous Period' : 'Off'}
                    </button>
                </div>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                    {['Month', 'Quarter', 'YTD'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range as any)}
                            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                                timeRange === range 
                                ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
                
                <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 transition-colors">
                    <Download size={16} />
                </button>
            </div>
        </div>

        {/* KPI Cards - Enterprise Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
             <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Activity size={64} />
                 </div>
                 <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Total Revenue</p>
                 <div className="flex items-baseline gap-2">
                     <h3 className="text-2xl font-light text-black dark:text-white">{formatCurrency(totalRevenue)}</h3>
                     <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                         <ArrowUpRight size={8} /> 12%
                     </span>
                 </div>
             </div>

             <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <PieChart size={64} />
                 </div>
                 <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Gross Margin</p>
                 <div className="flex items-baseline gap-2">
                     <h3 className="text-2xl font-light text-black dark:text-white">{grossMargin.toFixed(1)}%</h3>
                     <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                         <ArrowUpRight size={8} /> 1.2%
                     </span>
                 </div>
                 <div className="w-full bg-gray-100 dark:bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
                     <div className="bg-blue-500 h-full" style={{ width: `${grossMargin}%` }}></div>
                 </div>
             </div>

             <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Layers size={64} />
                 </div>
                 <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">EBITDA</p>
                 <div className="flex items-baseline gap-2">
                     <h3 className="text-2xl font-light text-black dark:text-white">{formatCurrency(operatingIncome)}</h3>
                     <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                         0%
                     </span>
                 </div>
                 <p className="text-[10px] text-gray-400 mt-1">{operatingMargin.toFixed(1)}% of Revenue</p>
             </div>

             <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <DollarSign size={64} />
                 </div>
                 <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Net Income</p>
                 <div className="flex items-baseline gap-2">
                     <h3 className={`text-2xl font-light ${netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600'}`}>
                         {formatCurrency(netIncome)}
                     </h3>
                     <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                         <ArrowUpRight size={8} /> 8.4%
                     </span>
                 </div>
                 <p className="text-[10px] text-gray-400 mt-1">{netMargin.toFixed(1)}% Net Margin</p>
             </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-8 shadow-sm shrink-0">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Financial Performance Trend</h3>
                 <div className="flex gap-4">
                     <div className="flex items-center gap-2 text-xs text-gray-500">
                         <span className="w-2 h-2 rounded-full bg-blue-500"></span> Revenue
                     </div>
                     <div className="flex items-center gap-2 text-xs text-gray-500">
                         <span className="w-2 h-2 rounded-full bg-red-400"></span> Expenses
                     </div>
                     <div className="flex items-center gap-2 text-xs text-gray-500">
                         <span className="w-2 h-2 rounded-full bg-green-500"></span> Net Income
                     </div>
                 </div>
             </div>
             <div className="h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                     <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                         <defs>
                             <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                 <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                             </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} dy={10} />
                         <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} tickFormatter={(v) => `${v/1000}k`} />
                         <Tooltip 
                             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)' }}
                             formatter={(val: number) => formatCurrency(val)}
                         />
                         <Bar dataKey="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                         <Bar dataKey="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} barSize={20} />
                         <Area type="monotone" dataKey="NetIncome" stroke="#10b981" strokeWidth={3} fill="url(#colorNet)" />
                     </ComposedChart>
                 </ResponsiveContainer>
             </div>
        </div>

        {/* Detailed Statement */}
        <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center">
                <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Statement of Operations</h3>
                <div className="text-xs font-mono text-gray-400 hidden sm:block">
                    Values in {currency} • Unaudited
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    {/* Header Row for Table */}
                    <div className="flex justify-between py-2 px-4 border-b border-gray-100 dark:border-gray-800 text-[10px] uppercase font-bold text-gray-400 bg-white dark:bg-[#18181b]">
                        <span className="flex-1">Account</span>
                        <span className="w-32 text-right">Amount</span>
                        <span className="w-24 text-right hidden sm:block">% of Rev</span>
                        {comparisonMode && <span className="w-24 text-right hidden md:block">Change</span>}
                    </div>

                    {/* Revenue */}
                    <TableRow 
                        label="Total Revenue" 
                        amount={totalRevenue} 
                        isHeader 
                        hasSub 
                        isExpanded={expandedSections['revenue']}
                        onToggle={() => toggleSection('revenue')}
                    />
                    
                    {expandedSections['revenue'] && (
                        <>
                            <TableRow label="Sales Revenue" amount={totalRevenue * 0.85} indent />
                            <TableRow label="Service Revenue" amount={totalRevenue * 0.15} indent />
                        </>
                    )}

                    {/* COGS */}
                    <TableRow 
                        label="Cost of Goods Sold" 
                        amount={totalCOGS} 
                        isHeader 
                        hasSub 
                        negative
                        isExpanded={expandedSections['cogs']}
                        onToggle={() => toggleSection('cogs')}
                    />
                    
                    {expandedSections['cogs'] && (
                        <>
                            <TableRow label="Material Costs" amount={totalCOGS * 0.7} indent negative />
                            <TableRow label="Direct Labor" amount={totalCOGS * 0.2} indent negative />
                            <TableRow label="Shipping" amount={totalCOGS * 0.1} indent negative />
                        </>
                    )}

                    {/* Gross Profit */}
                    <TableRow label="Gross Profit" amount={grossProfit} isTotal />

                    {/* OPEX */}
                    <TableRow 
                        label="Operating Expenses" 
                        amount={totalOpex} 
                        isHeader 
                        hasSub 
                        negative
                        isExpanded={expandedSections['opex']}
                        onToggle={() => toggleSection('opex')}
                    />

                    {expandedSections['opex'] && opexByCat.map(([cat, val]) => (
                        <TableRow key={cat} label={cat} amount={val} indent negative />
                    ))}

                    {/* Operating Income */}
                    <TableRow label="Operating Income (EBITDA)" amount={operatingIncome} isTotal />

                    {/* Other */}
                    <div className="py-2"></div>
                    <TableRow label="Interest Expense" amount={interestExpense} indent negative />
                    <TableRow label="Income Tax Provision" amount={taxes} indent negative />

                    {/* Net Income */}
                    <div className="mt-2">
                        <TableRow label="Net Income" amount={netIncome} isTotal />
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
};

export default ProfitLoss;
