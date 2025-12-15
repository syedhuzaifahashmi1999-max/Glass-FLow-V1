
import React, { useState } from 'react';
import { Search, Plus, Filter, Download, MoreHorizontal, DollarSign, Calendar, Users, CheckCircle, Clock, FileText, ArrowUpRight, Trash2, Copy } from 'lucide-react';
import { PayrollRun, Employee } from '../types';
import RunPayrollModal from '../components/payroll/RunPayrollModal';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';

interface PayrollListProps {
  payrollRuns: PayrollRun[];
  setPayrollRuns: React.Dispatch<React.SetStateAction<PayrollRun[]>>;
  employees: Employee[];
  onSelectRun: (runId: string) => void;
}

const PayrollList: React.FC<PayrollListProps> = ({ payrollRuns, setPayrollRuns, employees, onSelectRun }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleAddRun = (runData: Omit<PayrollRun, 'id'>) => {
      const newRun: PayrollRun = {
          ...runData,
          id: `PR-${new Date().getFullYear()}-${Math.floor(Math.random() * 100)}`
      };
      setPayrollRuns(prev => [newRun, ...prev]);
  };

  const handleDeleteRun = (id: string) => {
      if(confirm('Are you sure you want to delete this payroll run record?')) {
          setPayrollRuns(prev => prev.filter(r => r.id !== id));
      }
      setActiveMenuId(null);
  };

  const handleDuplicateRun = (run: PayrollRun) => {
      const newRun = { 
          ...run, 
          id: `PR-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
          period: `${run.period} (Copy)`,
          status: 'Draft' as const
      };
      setPayrollRuns(prev => [newRun, ...prev]);
      setActiveMenuId(null);
  };

  const handleExportCSV = () => {
      const headers = ['ID', 'Period', 'Date', 'Employees', 'Total Cost', 'Status', 'Reference'];
      const csvContent = [
          headers.join(','),
          ...payrollRuns.map(r => [
              r.id, r.period, r.date, r.employeeCount, r.totalCost, r.status, r.reference
          ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'payroll_history.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const getStatusColor = (status: PayrollRun['status']) => {
      switch(status) {
          case 'Paid': return 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20';
          case 'Processing': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
          default: return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
      }
  };

  // Metrics
  const totalYTD = payrollRuns.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.totalCost, 0);
  const activeEmployees = employees.filter(e => e.status === 'Active').length;

  // Chart Data
  const chartData = payrollRuns.slice().reverse().map(r => ({
      name: r.period.split(' ')[0],
      amount: r.totalCost
  }));

  const filteredRuns = payrollRuns.filter(r => 
      r.period.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in" onClick={() => setActiveMenuId(null)}>
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 gap-4 shrink-0">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Payroll</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                    Manage compensation, pay runs, and tax documents.
                </p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={handleExportCSV}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    title="Export CSV"
                >
                    <Download size={16} strokeWidth={1.5} />
                </button>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm"
                >
                    <Plus size={14} /> Run Payroll
                </button>
            </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm flex flex-col justify-between">
                <div>
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Total Payroll YTD</span>
                    <h3 className="text-3xl font-light text-black dark:text-white mt-2 tracking-tight">${totalYTD.toLocaleString()}</h3>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 w-fit px-2 py-1 rounded border border-green-100 dark:border-green-500/20">
                    <ArrowUpRight size={12} /> <span>12% vs last year</span>
                </div>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm flex flex-col justify-between">
                <div>
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Active Employees</span>
                    <h3 className="text-3xl font-light text-black dark:text-white mt-2 tracking-tight">{activeEmployees}</h3>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                    <span>On Payroll</span>
                </div>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] shadow-sm flex flex-col relative overflow-hidden">
                <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider mb-2 z-10">Cost Trend</span>
                <div className="flex-1 w-full h-24 -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" hide />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)' }}
                            />
                            <Bar dataKey="amount" radius={[4, 4, 4, 4]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'var(--text-main)' : '#9CA3AF'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-white/5">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search periods..." 
                        className="w-64 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors text-xs font-medium">
                    <Filter size={14} /> Filter
                </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 uppercase tracking-widest font-medium sticky top-0 bg-white dark:bg-[#18181b] z-10 shadow-sm shadow-gray-50 dark:shadow-gray-900">
                            <th className="py-3 px-6 w-48">Pay Period</th>
                            <th className="py-3 px-4">Run Date</th>
                            <th className="py-3 px-4">Employees</th>
                            <th className="py-3 px-4">Total Cost</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Reference</th>
                            <th className="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="text-xs">
                        {filteredRuns.length > 0 ? filteredRuns.map(run => (
                            <tr 
                                key={run.id} 
                                onClick={() => onSelectRun(run.id)}
                                className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0 cursor-pointer"
                            >
                                <td className="py-4 px-6">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-black dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{run.period}</span>
                                        <span className="text-[10px] text-gray-400 font-mono">{run.id}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={12} className="text-gray-400" />
                                        {run.date}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <Users size={12} className="text-gray-400" />
                                        {run.employeeCount}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-black dark:text-white font-mono">
                                    ${run.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-medium ${getStatusColor(run.status)}`}>
                                        {run.status === 'Paid' && <CheckCircle size={10} />}
                                        {run.status === 'Processing' && <Clock size={10} />}
                                        {run.status === 'Draft' && <FileText size={10} />}
                                        {run.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-gray-400 font-mono text-[10px]">
                                    {run.reference || '-'}
                                </td>
                                <td className="py-4 px-4 text-right relative">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenuId(activeMenuId === run.id ? null : run.id);
                                        }}
                                        className="text-gray-300 dark:text-gray-600 hover:text-black dark:hover:text-white transition-colors p-1"
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>
                                    
                                    {activeMenuId === run.id && (
                                        <div className="absolute right-8 top-8 w-32 bg-white dark:bg-[#18181b] rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDuplicateRun(run); }}
                                                className="w-full text-left px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                                            >
                                                <Copy size={12} /> Duplicate
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteRun(run.id); }}
                                                className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                                            >
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                                    No pay runs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    <RunPayrollModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddRun}
        employees={employees}
    />
    </>
  );
};

export default PayrollList;
