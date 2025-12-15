
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell 
} from 'recharts';
import { 
  Calendar, Download, RefreshCw, ArrowUpRight, ArrowDownRight, 
  DollarSign, Users, Briefcase, Activity, ChevronDown, 
  MoreHorizontal, Clock, CheckCircle, TrendingUp, Layers,
  Wallet, UserPlus, FileText, CheckSquare, Plus, ArrowRight, Building2, MapPin
} from 'lucide-react';
import { MOCK_ACTIVITIES, MOCK_TASKS, MOCK_PRODUCTS, MOCK_BANK_ACCOUNTS, MOCK_PROJECTS, MOCK_EMPLOYEES, MOCK_ATTENDANCE } from '../constants';
import { ViewState } from '../types';

// --- Types & Mock Data Generators ---

type TimeRange = '7d' | '30d' | '1y';
type ChartView = 'revenue' | 'leads';

const generateData = (range: TimeRange, type: ChartView) => {
  const points = range === '7d' ? 7 : range === '30d' ? 15 : 12;
  const base = type === 'revenue' ? 5000 : 20;
  const variance = type === 'revenue' ? 3000 : 15;
  
  return Array.from({ length: points }, (_, i) => {
    let label = '';
    if (range === '7d') {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        label = d.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (range === '30d') {
        label = `${i * 2 + 1}th`;
    } else {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        label = months[i % 12];
    }

    return {
      name: label,
      value: Math.max(base / 2, Math.floor(base + Math.random() * variance - variance / 2)),
      prev: Math.max(base / 2, Math.floor(base + Math.random() * variance - variance / 2)) // comparison data
    };
  });
};

const MetricCard: React.FC<{ 
  label: string; 
  value: string; 
  trend: number; 
  icon: React.ElementType; 
  prefix?: string;
  delay?: number;
  onClick?: () => void;
}> = ({ label, value, trend, icon: Icon, prefix = '', delay = 0, onClick }) => {
  const isPositive = trend >= 0;
  return (
    <div 
        onClick={onClick}
        className={`bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${onClick ? 'cursor-pointer' : ''}`}
        style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg ${isPositive ? 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400' : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400'}`}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${
          isPositive ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20'
        }`}>
          {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {Math.abs(trend)}%
        </span>
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-black dark:text-white tracking-tight mb-1">{prefix}{value}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
};

interface DashboardProps {
    currency?: string;
    onNavigate?: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currency = 'USD', onNavigate }) => {
  // --- State ---
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [chartView, setChartView] = useState<ChartView>('revenue');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Simulated Data (changes on timeRange)
  const [chartData, setChartData] = useState(generateData('30d', 'revenue'));
  const [metrics, setMetrics] = useState({
    revenue: 124500,
    leads: 42,
    dealSize: 18200,
    winRate: 34
  });

  // --- Live Stats from System Constants ---
  const totalCash = MOCK_BANK_ACCOUNTS.reduce((sum, acc) => sum + acc.balance, 0);
  const activeProjects = MOCK_PROJECTS.filter(p => p.status === 'Active');
  const activeEmployees = MOCK_EMPLOYEES.filter(e => e.status === 'Active').length;
  const pendingTasks = MOCK_TASKS.filter(t => t.status !== 'Done' && t.priority === 'High');
  const todaysAttendance = MOCK_ATTENDANCE.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'Present').length;

  // --- Effects ---
  
  // When range/view changes, regenerate data
  useEffect(() => {
    setChartData(generateData(timeRange, chartView));
    
    // Simulate metric changes
    const multiplier = timeRange === '7d' ? 0.25 : timeRange === '30d' ? 1 : 4;
    setMetrics({
        revenue: Math.floor(124500 * multiplier + (Math.random() * 10000)),
        leads: Math.floor(42 * multiplier + (Math.random() * 10)),
        dealSize: Math.floor(18200 + (Math.random() * 2000)), // avg stays roughly same
        winRate: Math.floor(34 + (Math.random() * 5))
    });

  }, [timeRange, chartView]);

  // --- Handlers ---

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate network delay
    setTimeout(() => {
        setLastUpdated(new Date());
        setChartData(generateData(timeRange, chartView)); // regen random
        setIsRefreshing(false);
    }, 800);
  };

  const handleDownloadReport = () => {
      const headers = ['Date', 'Value'];
      const csvContent = [
          headers.join(','),
          ...chartData.map(d => [d.name, d.value].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dashboard_report_${timeRange}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(val);
  };

  // --- Derived Calculations ---
  
  const trends = useMemo(() => ({
      revenue: timeRange === '7d' ? 12 : 8,
      leads: timeRange === '7d' ? -5 : 14,
      dealSize: 2.4,
      winRate: 1.2
  }), [timeRange]);

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-8 fade-in h-full overflow-y-auto custom-scrollbar">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-black dark:text-white mb-2">
            Command Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-light flex items-center gap-2">
            System overview and quick actions.
            <span className="text-gray-300 dark:text-gray-700">|</span> 
            <span className="flex items-center gap-1 text-gray-400">
                <Clock size={12} /> Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
            
            {/* Quick Actions */}
            <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-lg border border-gray-100 dark:border-gray-800">
                <button onClick={() => onNavigate?.(ViewState.LISTS)} className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 hover:text-black dark:hover:text-white rounded-md transition-all">
                    <UserPlus size={14} /> New Lead
                </button>
                <div className="w-px bg-gray-200 dark:bg-white/10 my-1 mx-1"></div>
                <button onClick={() => onNavigate?.(ViewState.INVOICES)} className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 hover:text-black dark:hover:text-white rounded-md transition-all">
                    <FileText size={14} /> Invoice
                </button>
                <div className="w-px bg-gray-200 dark:bg-white/10 my-1 mx-1"></div>
                <button onClick={() => onNavigate?.(ViewState.TASKS)} className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 hover:text-black dark:hover:text-white rounded-md transition-all">
                    <CheckSquare size={14} /> Task
                </button>
            </div>

            {/* Time Range Selector */}
            <div className="relative">
                <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                    className="appearance-none bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-black dark:text-white text-xs font-medium py-2.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white cursor-pointer shadow-sm transition-all"
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="1y">This Year</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181b] text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm ${isRefreshing ? 'opacity-70' : ''}`}
                title="Refresh Data"
            >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
        </div>
      </div>

      {/* --- METRICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
            label="Total Revenue" 
            value={formatCurrency(metrics.revenue)} 
            trend={trends.revenue} 
            icon={DollarSign} 
            delay={0}
            onClick={() => onNavigate?.(ViewState.SALES)}
        />
        <MetricCard 
            label="Active Leads" 
            value={metrics.leads.toString()} 
            trend={trends.leads} 
            icon={Users} 
            delay={100}
            onClick={() => onNavigate?.(ViewState.LISTS)}
        />
        <MetricCard 
            label="Avg. Deal Size" 
            value={formatCurrency(metrics.dealSize)} 
            trend={trends.dealSize} 
            icon={Briefcase} 
            delay={200}
        />
        <MetricCard 
            label="Win Rate" 
            value={`${metrics.winRate}%`} 
            trend={trends.winRate} 
            icon={Activity} 
            delay={300}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* --- MAIN CHART --- */}
        <div className="lg:col-span-2 flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] p-6 shadow-sm hover:shadow-md dark:hover:shadow-none transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
                <h3 className="text-base font-semibold text-black dark:text-white mb-1">Performance Analytics</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Compare metrics over {timeRange === '7d' ? 'the last week' : timeRange === '30d' ? 'the last month' : 'the year'}.</p>
            </div>
            
            {/* Chart Toggle */}
            <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 self-start sm:self-auto">
                <button 
                    onClick={() => setChartView('revenue')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${chartView === 'revenue' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    Revenue
                </button>
                <button 
                    onClick={() => setChartView('leads')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${chartView === 'leads' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    Leads
                </button>
            </div>
          </div>
          
          <div className="flex-1 w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'revenue' ? (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#000000" stopOpacity={0.1} className="dark:stop-color-white" />
                        <stop offset="95%" stopColor="#000000" stopOpacity={0} className="dark:stop-color-white" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#9CA3AF'}} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#9CA3AF'}} 
                        tickFormatter={(value) => `${value/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--bg-panel)', 
                        borderColor: 'var(--border-color)', 
                        color: 'var(--text-main)',
                        fontSize: '12px',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      itemStyle={{ color: 'var(--text-main)' }}
                      cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--text-main)" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      animationDuration={1000}
                    />
                  </AreaChart>
              ) : (
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#9CA3AF'}} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#9CA3AF'}} 
                    />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ 
                        backgroundColor: 'var(--bg-panel)', 
                        borderColor: 'var(--border-color)', 
                        color: 'var(--text-main)',
                        fontSize: '12px',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1000}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--text-main)' : '#4B5563'} />
                        ))}
                    </Bar>
                  </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- SYSTEM SNAPSHOTS (RIGHT COL) --- */}
        <div className="flex flex-col gap-6">
            
            {/* 1. FINANCE SNAPSHOT */}
            <div className="bg-gradient-to-br from-gray-900 to-black dark:from-[#27272a] dark:to-[#09090b] text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Wallet size={18} />
                        </div>
                        <button onClick={() => onNavigate?.(ViewState.BANK)} className="text-xs text-white/70 hover:text-white hover:underline flex items-center gap-1">
                            Bank <ArrowRight size={10} />
                        </button>
                    </div>
                    <p className="text-xs text-white/60 font-medium uppercase tracking-wider mb-1">Total Liquidity</p>
                    <h3 className="text-3xl font-light tracking-tight">{formatCurrency(totalCash)}</h3>
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                        <span className="text-white/60">3 Accounts Connected</span>
                        <span className="text-emerald-400 font-medium">+12% vs last mo</span>
                    </div>
                </div>
                {/* Deco */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            </div>

            {/* 2. HR PULSE */}
            <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
                        <Users size={16} className="text-gray-400" /> Team Pulse
                    </h3>
                    <button onClick={() => onNavigate?.(ViewState.ATTENDANCE)} className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline">Attendance</button>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Total Headcount</span>
                        <span className="text-sm font-mono text-black dark:text-white font-medium">{activeEmployees}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="bg-green-500 h-full rounded-full" 
                            style={{ width: `${(todaysAttendance / activeEmployees) * 100}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500">
                        <span>{todaysAttendance} Present</span>
                        <span>{activeEmployees - todaysAttendance} Away/Remote</span>
                    </div>
                </div>
            </div>

            {/* 3. QUICK TASKS */}
            <div className="flex-1 bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
                        <CheckSquare size={16} className="text-gray-400" /> My Priority
                    </h3>
                    <span className="text-[10px] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">{pendingTasks.length} Due</span>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar max-h-[200px]">
                    {pendingTasks.slice(0, 4).map(task => (
                        <div key={task.id} className="flex items-start gap-3 group">
                            <div className="mt-0.5 text-gray-300 hover:text-green-500 cursor-pointer transition-colors">
                                <div className="w-4 h-4 border-2 border-current rounded-sm"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-black dark:text-white truncate group-hover:text-blue-600 transition-colors">{task.title}</p>
                                <p className="text-[10px] text-gray-400">{task.dueDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => onNavigate?.(ViewState.TASKS)} className="mt-4 w-full py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    View All Tasks
                </button>
            </div>

        </div>
      </div>

      {/* --- ROW 2: PROJECTS & ACTIVITY --- */}
      <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Active Projects Pulse */}
          <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
                        <Layers size={16} className="text-gray-400" /> Project Pulse
                    </h3>
                    <button onClick={() => onNavigate?.(ViewState.PROJECTS)} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                        <ArrowRight size={16} />
                    </button>
                </div>
                <div className="space-y-5">
                    {activeProjects.slice(0, 3).map(proj => (
                        <div key={proj.id}>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-xs font-medium text-gray-900 dark:text-gray-200">{proj.name}</span>
                                <span className="text-[10px] text-gray-500">{proj.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${proj.progress > 75 ? 'bg-green-500' : 'bg-blue-600'}`} 
                                    style={{ width: `${proj.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                 <h3 className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
                    <Activity size={16} className="text-gray-400" /> System Activity
                 </h3>
                 <button className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                    <MoreHorizontal size={16} />
                 </button>
             </div>
             
             <div className="space-y-6 relative pl-2">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-100 dark:bg-gray-800"></div>
                {MOCK_ACTIVITIES.map((activity, i) => (
                    <div key={activity.id} className="relative flex gap-4 items-start group">
                        <div className="relative z-10 w-4 h-4 rounded-full bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:border-black dark:group-hover:border-white transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-black dark:group-hover:bg-white transition-colors"></div>
                        </div>
                        <div className="-mt-1 flex-1 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                            <p className="text-xs text-gray-900 dark:text-gray-200">
                                <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-medium text-blue-600 dark:text-blue-400">{activity.target}</span>
                            </p>
                            <span className="text-[10px] text-gray-400 font-mono mt-1 flex items-center gap-1">
                                <Clock size={10} /> {activity.time}
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

export default Dashboard;
