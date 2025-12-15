
import React, { useState, useMemo } from 'react';
import { 
  TrendingDown, Calendar, DollarSign, Filter, Search, Download, 
  ChevronRight, RefreshCw, Calculator, X, BarChart2, ArrowLeft, 
  Printer, Layers, PieChart, Info, FileText, AlertTriangle, CheckCircle, Ban
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, AreaChart, Area, ComposedChart, Line
} from 'recharts';
import { Asset, ViewState } from '../types';

interface DepreciationProps {
  assets: Asset[];
  currency?: string;
  onNavigate?: (view: ViewState) => void;
}

// --- Helpers ---

// Mock useful life based on category
const getUsefulLife = (category: string): number => {
    switch(category) {
        case 'Hardware': return 4;
        case 'Software': return 3;
        case 'Vehicle': return 5;
        case 'Furniture': return 7;
        case 'Machinery': return 10;
        default: return 5;
    }
};

const formatCurrency = (val: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);
};

const getStatusColor = (status: Asset['status']) => {
    switch(status) {
        case 'Available': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
        case 'In Use': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
        case 'Maintenance': return 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20';
        case 'Retired': return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
        default: return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400';
    }
};

const getStatusIcon = (status: Asset['status']) => {
    switch(status) {
        case 'Available': return <CheckCircle size={12} />;
        case 'In Use': return <Layers size={12} />;
        case 'Maintenance': return <AlertTriangle size={12} />;
        case 'Retired': return <Ban size={12} />;
        default: return <Info size={12} />;
    }
};

// --- Sub-Components ---

const DepreciationDetailDrawer = ({ 
    asset, 
    onClose, 
    currency 
}: { 
    asset: Asset | null, 
    onClose: () => void, 
    currency: string 
}) => {
    const [activeTab, setActiveTab] = useState<'schedule' | 'details'>('schedule');

    if (!asset) return null;

    const cost = asset.value;
    const lifeYears = getUsefulLife(asset.category);
    const purchaseDate = new Date(asset.purchaseDate);
    const yearlyDep = cost / lifeYears;
    
    // Generate schedule
    const schedule = [];
    let accumulatedDep = 0;

    for (let i = 0; i <= lifeYears; i++) {
        const year = purchaseDate.getFullYear() + i;
        
        // Simple straight line logic
        let expense = i === 0 ? 0 : yearlyDep; 
        
        // Adjust final year to not exceed cost (simple rounding handle)
        if (accumulatedDep + expense > cost) {
            expense = cost - accumulatedDep;
        }

        accumulatedDep += expense;
        const bookValue = Math.max(0, cost - accumulatedDep);

        schedule.push({
            year,
            expense,
            accumulated: accumulatedDep,
            bookValue
        });
    }

    const handlePrint = () => {
        window.print();
    };

    const handleExportSchedule = () => {
        const headers = ['Year', 'Opening Book Value', 'Depreciation Expense', 'Accumulated Depreciation', 'Closing Book Value'];
        const rows = schedule.map(r => {
            const opening = r.bookValue + r.expense;
            return [r.year, opening, r.expense, r.accumulated, r.bookValue].join(',');
        });
        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `depreciation_schedule_${asset.name.replace(/\s+/g, '_')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]" onClick={onClose} />
            <div className="fixed inset-y-0 right-0 w-full md:w-[700px] bg-white dark:bg-[#18181b] shadow-2xl z-[101] transform transition-transform duration-300 ease-out border-l border-gray-100 dark:border-gray-800 flex flex-col">
                
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                                {asset.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1 ${getStatusColor(asset.status)}`}>
                                {getStatusIcon(asset.status)}
                                {asset.status}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{asset.name}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">S/N: {asset.serialNumber || 'N/A'}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handlePrint} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition-colors" title="Print Schedule">
                            <Printer size={18} />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-8 border-b border-gray-100 dark:border-gray-800 flex gap-6">
                    <button 
                        onClick={() => setActiveTab('schedule')}
                        className={`py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'schedule' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        Depreciation Schedule
                    </button>
                    <button 
                        onClick={() => setActiveTab('details')}
                        className={`py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'details' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        Asset Details
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    
                    {activeTab === 'schedule' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Cost Basis</span>
                                    <div className="text-lg font-mono text-black dark:text-white mt-1">
                                        {formatCurrency(cost, currency)}
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Useful Life</span>
                                    <div className="text-lg font-mono text-black dark:text-white mt-1">{lifeYears} Years</div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Method</span>
                                    <div className="text-lg font-mono text-black dark:text-white mt-1">Straight Line</div>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="h-64 bg-white dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={schedule}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} tickFormatter={(v) => `${v/1000}k`} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)' }}
                                            formatter={(val: number) => formatCurrency(val, currency)}
                                        />
                                        <Area type="monotone" dataKey="bookValue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" name="Book Value" />
                                        <Line type="monotone" dataKey="accumulated" stroke="#f97316" strokeWidth={2} dot={false} name="Accumulated Dep." />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Table */}
                            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                                <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Yearly Breakdown</span>
                                    <button onClick={handleExportSchedule} className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                        <Download size={10} /> Export CSV
                                    </button>
                                </div>
                                <table className="w-full text-left">
                                    <thead className="bg-white dark:bg-[#18181b] text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-gray-800">
                                        <tr>
                                            <th className="px-4 py-3">Year</th>
                                            <th className="px-4 py-3 text-right">Expense</th>
                                            <th className="px-4 py-3 text-right">Accumulated</th>
                                            <th className="px-4 py-3 text-right">Book Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#18181b]">
                                        {schedule.map((row) => (
                                            <tr key={row.year} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 font-medium text-black dark:text-white">{row.year}</td>
                                                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{formatCurrency(row.expense, currency)}</td>
                                                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{formatCurrency(row.accumulated, currency)}</td>
                                                <td className="px-4 py-3 text-right font-bold text-black dark:text-white">{formatCurrency(row.bookValue, currency)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Asset Information</h3>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                                    <div>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-1">Assigned To</span>
                                        <div className="text-sm font-medium text-black dark:text-white">{asset.assignedToName || 'Unassigned'}</div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-1">Location</span>
                                        <div className="text-sm font-medium text-black dark:text-white">HQ - Floor 2</div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-1">Purchase Date</span>
                                        <div className="text-sm font-medium text-black dark:text-white">{asset.purchaseDate}</div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-1">Warranty Expires</span>
                                        <div className="text-sm font-medium text-black dark:text-white">{asset.warrantyDate || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-[#18181b] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gray-100 dark:bg-white/10 rounded-lg">
                                        <FileText size={16} className="text-gray-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-black dark:text-white">Purchase Invoice</h4>
                                        <p className="text-[10px] text-gray-400">INV-{asset.id}.pdf</p>
                                    </div>
                                    <button className="ml-auto text-xs text-blue-600 dark:text-blue-400 hover:underline">Download</button>
                                </div>
                            </div>

                            {asset.notes && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Notes</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                        {asset.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Print Styles */}
                <style>{`
                    @media print {
                        body * { visibility: hidden; }
                        .fixed.inset-y-0.right-0, .fixed.inset-y-0.right-0 * { visibility: visible; }
                        .fixed.inset-y-0.right-0 { position: absolute; left: 0; top: 0; width: 100%; height: auto; }
                    }
                `}</style>
            </div>
        </>
    );
};

const Depreciation: React.FC<DepreciationProps> = ({ assets, currency = 'USD', onNavigate }) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'purchaseDate'>('name');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- Calculations ---
  
  // Calculate current book value for all assets
  const processedAssets = useMemo(() => {
      const now = new Date();
      
      return assets.map(asset => {
          const cost = asset.value;
          const lifeYears = getUsefulLife(asset.category);
          const purchaseDate = new Date(asset.purchaseDate);
          
          // Calculate months elapsed
          const monthsElapsed = (now.getFullYear() - purchaseDate.getFullYear()) * 12 + (now.getMonth() - purchaseDate.getMonth());
          const totalMonthsLife = lifeYears * 12;
          
          const monthlyDep = cost / totalMonthsLife;
          const accumulatedDep = Math.min(cost, Math.max(0, monthlyDep * monthsElapsed));
          const bookValue = cost - accumulatedDep;

          return {
              ...asset,
              lifeYears,
              accumulatedDep,
              bookValue,
              monthlyDep,
              percentDepreciated: (accumulatedDep / cost) * 100
          };
      })
      .filter(a => {
          const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                (a.serialNumber && a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()));
          const matchesCategory = filterCategory === 'All' || a.category === filterCategory;
          const matchesStatus = filterStatus === 'All' || a.status === filterStatus;
          return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
          if (sortBy === 'name') return a.name.localeCompare(b.name);
          if (sortBy === 'value') return b.value - a.value;
          if (sortBy === 'purchaseDate') return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
          return 0;
      });
  }, [assets, searchQuery, filterCategory, filterStatus, sortBy]);

  // Aggregates
  const totalCost = processedAssets.reduce((acc, curr) => acc + curr.value, 0);
  const totalAccumulated = processedAssets.reduce((acc, curr) => acc + curr.accumulatedDep, 0);
  const totalBookValue = totalCost - totalAccumulated;
  const monthlyExpense = processedAssets.reduce((acc, curr) => acc + (curr.bookValue > 0 ? curr.monthlyDep : 0), 0);

  // --- Handlers ---
  
  const handleExportList = () => {
      const headers = ['Name', 'Category', 'Purchase Date', 'Cost', 'Accumulated Dep.', 'Book Value', 'Status'];
      const rows = processedAssets.map(a => [
          `"${a.name}"`, 
          a.category, 
          a.purchaseDate, 
          a.value.toFixed(2), 
          a.accumulatedDep.toFixed(2), 
          a.bookValue.toFixed(2), 
          a.status
      ].join(','));
      
      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'assets_depreciation_report.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const categories = Array.from(new Set(assets.map(a => a.category)));

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto min-h-screen flex flex-col bg-white dark:bg-[#18181b] fade-in pb-20">
        
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0">
            <div>
                 <button 
                  onClick={() => onNavigate?.(ViewState.ASSETS)}
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-2"
                >
                  <ArrowLeft size={12} />
                  <span>Back to Assets</span>
                </button>
                <h1 className="text-3xl font-light text-black dark:text-white mb-2">Fixed Asset Depreciation</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track value reduction and schedule expenses.</p>
            </div>
             <div className="flex items-center gap-2">
                 <button 
                    onClick={handleExportList}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-black dark:text-white rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm"
                >
                    <Download size={14} /> Export Report
                </button>
             </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 shrink-0">
            <div className="p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Asset Cost</p>
                <h3 className="text-2xl font-light text-black dark:text-white">{formatCurrency(totalCost, currency)}</h3>
            </div>
            <div className="p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Accumulated Dep.</p>
                <h3 className="text-2xl font-light text-orange-600 dark:text-orange-400">{formatCurrency(totalAccumulated, currency)}</h3>
            </div>
            <div className="p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Net Book Value</p>
                <h3 className="text-2xl font-light text-green-600 dark:text-green-400">{formatCurrency(totalBookValue, currency)}</h3>
            </div>
            <div className="p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                <div className="flex justify-between">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Monthly Expense</p>
                    <Calculator size={14} className="text-blue-500" />
                </div>
                <h3 className="text-2xl font-light text-blue-600 dark:text-blue-400">{formatCurrency(monthlyExpense, currency)}</h3>
            </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-8 shadow-sm shrink-0">
            <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-6">Book Value Composition</h3>
            <div className="h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedAssets.slice(0, 15)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} dy={10} interval={0} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} tickFormatter={(v) => `${v/1000}k`} />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)' }}
                            formatter={(val: number) => formatCurrency(val, currency)}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                        <Bar dataKey="accumulatedDep" stackId="a" name="Accumulated Dep." fill="#f97316" radius={[0, 0, 0, 0]} barSize={32} />
                        <Bar dataKey="bookValue" stackId="a" name="Book Value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                 </ResponsiveContainer>
            </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 shrink-0">
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative group flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search assets..." 
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20"
                    />
                </div>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors text-xs font-medium ${isFilterOpen ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                    <Filter size={14} /> Filter
                </button>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase text-gray-400 font-bold mr-1">Sort By:</span>
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded px-2 py-1 cursor-pointer text-black dark:text-white font-medium focus:outline-none"
                >
                    <option value="name">Asset Name</option>
                    <option value="value">Cost Basis</option>
                    <option value="purchaseDate">Purchase Date</option>
                </select>
            </div>
        </div>

        {isFilterOpen && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl animate-in slide-in-from-top-2 fade-in">
                <div className="flex gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Category</label>
                        <select 
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs min-w-[140px] focus:outline-none text-black dark:text-white"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Status</label>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs min-w-[140px] focus:outline-none text-black dark:text-white"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Available">Available</option>
                            <option value="In Use">In Use</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Retired">Retired</option>
                        </select>
                    </div>
                    <button onClick={() => { setFilterCategory('All'); setFilterStatus('All'); setSearchQuery(''); }} className="text-xs text-gray-400 hover:text-black dark:hover:text-white mt-auto pb-2 ml-auto">
                        Clear All
                    </button>
                </div>
            </div>
        )}

        {/* Asset Table */}
        <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm flex flex-col mb-10 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold sticky top-0 backdrop-blur-sm z-10">
                        <tr>
                            <th className="px-6 py-3 min-w-[240px]">Asset Name</th>
                            <th className="px-6 py-3 min-w-[120px]">Category</th>
                            <th className="px-6 py-3 min-w-[120px]">Purchase Date</th>
                            <th className="px-6 py-3 text-right min-w-[120px]">Cost</th>
                            <th className="px-6 py-3 text-center min-w-[180px]">Life Progress</th>
                            <th className="px-6 py-3 text-right min-w-[140px]">Net Book Value</th>
                            <th className="px-6 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-gray-50 dark:divide-gray-800">
                        {processedAssets.map(asset => (
                            <tr 
                                key={asset.id} 
                                onClick={() => setSelectedAsset(asset)}
                                className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-black dark:text-white text-sm">{asset.name}</span>
                                        <span className="text-[10px] text-gray-400 font-mono mt-0.5">{asset.serialNumber || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                    <div className="flex flex-col gap-1 items-start">
                                        <span>{asset.category}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(asset.status)}`}>{asset.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono whitespace-nowrap">{asset.purchaseDate}</td>
                                <td className="px-6 py-4 text-right font-mono text-black dark:text-white whitespace-nowrap">{formatCurrency(asset.value, currency)}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col gap-1.5 w-full max-w-[140px] mx-auto" title={`${Math.min(asset.percentDepreciated, 100).toFixed(1)}% Depreciated`}>
                                        <div className="flex justify-between text-[10px] text-gray-400">
                                            <span>{Math.min(asset.percentDepreciated, 100).toFixed(0)}%</span>
                                            <span>{asset.lifeYears} yrs</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${asset.percentDepreciated >= 100 ? 'bg-red-500' : 'bg-blue-500'}`} 
                                                style={{ width: `${Math.min(asset.percentDepreciated, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-green-600 dark:text-green-400 whitespace-nowrap text-sm">
                                    {formatCurrency(asset.bookValue, currency)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 text-[10px] text-gray-500 text-center">
                Showing {processedAssets.length} assets
            </div>
        </div>
    </div>

    <DepreciationDetailDrawer 
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        currency={currency}
    />
    </>
  );
};

export default Depreciation;
