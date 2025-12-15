
import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, CalendarDays, CheckCircle, XCircle, Clock, PieChart, MoreHorizontal, Trash2, X } from 'lucide-react';
import { LeaveRequest } from '../types';
import { MOCK_LEAVE_REQUESTS } from '../constants';
import AddLeaveRequestModal from '../components/leave/AddLeaveRequestModal';

const LeaveBoard: React.FC = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'my_requests' | 'team_requests'>('my_requests');
  const [requests, setRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock Current User ID
  const currentUserId = 'e1';

  // --- Logic & Calculations ---

  // 1. Balances Calculation (Dynamic based on Approved Requests)
  const balances = useMemo(() => {
      const initialAnnual = 20; // Entitlement
      const initialSick = 10;
      
      const usedAnnual = requests
        .filter(r => r.employeeId === currentUserId && r.type === 'Annual' && (r.status === 'Approved' || r.status === 'Pending'))
        .reduce((sum, r) => sum + r.days, 0);
        
      const usedSick = requests
        .filter(r => r.employeeId === currentUserId && r.type === 'Sick' && (r.status === 'Approved' || r.status === 'Pending'))
        .reduce((sum, r) => sum + r.days, 0);

      const usedUnpaid = requests
        .filter(r => r.employeeId === currentUserId && r.type === 'Unpaid' && r.status === 'Approved')
        .reduce((sum, r) => sum + r.days, 0);

      return {
          annualLeft: initialAnnual - usedAnnual,
          sickLeft: initialSick - usedSick,
          unpaidUsed: usedUnpaid,
          totalAnnual: initialAnnual
      };
  }, [requests]);

  // 2. Filtering
  const filteredRequests = useMemo(() => {
      return requests.filter(req => {
          const isMyRequest = req.employeeId === currentUserId;
          
          // Tab Logic
          if (activeTab === 'my_requests' && !isMyRequest) return false;
          if (activeTab === 'team_requests' && isMyRequest) return false;

          // Search Logic
          const matchesSearch = 
            req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
            req.type.toLowerCase().includes(searchQuery.toLowerCase());

          // Filter Logic
          const matchesType = filterType === 'All' || req.type === filterType;
          const matchesStatus = filterStatus === 'All' || req.status === filterStatus;

          return matchesSearch && matchesType && matchesStatus;
      });
  }, [requests, activeTab, searchQuery, filterType, filterStatus]);

  // --- Handlers ---

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
      if (confirm(`Are you sure you want to ${action.toLowerCase()} this request?`)) {
          setRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
      }
  };

  const handleDelete = (id: string) => {
      if (confirm('Cancel this leave request?')) {
          setRequests(prev => prev.filter(req => req.id !== id));
      }
  };

  const handleCreateRequest = (requestData: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => {
      const newRequest: LeaveRequest = {
          ...requestData,
          id: `lr-${Date.now()}`,
          status: 'Pending',
          appliedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setRequests(prev => [newRequest, ...prev]);
  };

  const getStatusColor = (status: LeaveRequest['status']) => {
      switch (status) {
          case 'Approved': return 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20';
          case 'Rejected': return 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20';
          case 'Pending': return 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20';
          default: return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400';
      }
  };

  const clearFilters = () => {
      setFilterType('All');
      setFilterStatus('All');
      setSearchQuery('');
  };

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
        
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Leave Management</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Track balances and process time-off requests.</p>
            </div>
            
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm"
            >
                <Plus size={14} /> New Request
            </button>
        </div>

        {/* Balances Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
            {/* Annual */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform duration-500"><CalendarDays size={100} /></div>
                <div className="relative z-10">
                    <span className="text-xs font-medium text-blue-100 uppercase tracking-widest">Annual Leave</span>
                    <div className="mt-2 text-4xl font-light">{balances.annualLeft} <span className="text-sm font-normal opacity-70">/ {balances.totalAnnual}</span></div>
                    <div className="mt-4 text-[10px] text-blue-100 flex items-center gap-1">
                        <CheckCircle size={10} /> Available Balance
                    </div>
                </div>
            </div>
            
            {/* Sick */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-800 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform duration-500"><CheckCircle size={100} /></div>
                <div className="relative z-10">
                    <span className="text-xs font-medium text-emerald-100 uppercase tracking-widest">Sick Leave</span>
                    <div className="mt-2 text-4xl font-light">{balances.sickLeft} <span className="text-sm font-normal opacity-70">days</span></div>
                    <div className="mt-4 text-[10px] text-emerald-100 flex items-center gap-1">
                        <CheckCircle size={10} /> Available Balance
                    </div>
                </div>
            </div>
            
            {/* Unpaid */}
            <div className="p-6 rounded-xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Unpaid Taken</span>
                    <div className="mt-2 text-4xl font-light text-black dark:text-white">{balances.unpaidUsed} <span className="text-sm font-normal text-gray-400">days</span></div>
                    <div className="mt-4 text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock size={10} /> Year to Date
                    </div>
                </div>
            </div>
        </div>

        {/* Toolbar: Tabs & Filters */}
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-center mb-6 shrink-0">
            <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 w-full md:w-auto">
                <button 
                    onClick={() => setActiveTab('my_requests')}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-md text-xs font-medium transition-all ${activeTab === 'my_requests' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    My Requests
                </button>
                <button 
                    onClick={() => setActiveTab('team_requests')}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-md text-xs font-medium transition-all ${activeTab === 'team_requests' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    Team Approvals
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full xl:w-auto">
                <div className="relative group w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search employee or type..." 
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20" 
                    />
                </div>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`px-3 py-1.5 rounded border transition-colors text-xs font-medium flex items-center justify-center gap-2 ${isFilterOpen ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:text-black dark:hover:text-white'}`}
                >
                    <Filter size={14} /> Filter
                </button>
            </div>
        </div>

        {/* Extended Filters */}
        {isFilterOpen && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Leave Type</label>
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                        >
                            <option value="All">All Types</option>
                            <option value="Annual">Annual</option>
                            <option value="Sick">Sick</option>
                            <option value="Personal">Personal</option>
                            <option value="Unpaid">Unpaid</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Status</label>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors px-3 py-1.5 ml-auto">
                        Clear All
                    </button>
                </div>
            </div>
        )}

        {/* Requests Table */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 dark:bg-white/5 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800 backdrop-blur-sm">
                        <tr>
                            <th className="py-3 px-6 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Employee</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Type</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Duration</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Dates</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Reason</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Status</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-gray-50 dark:divide-gray-800">
                        {filteredRequests.length > 0 ? filteredRequests.map(req => (
                            <tr key={req.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="py-3 px-6">
                                    <div className="flex items-center gap-3">
                                        <img src={req.avatarUrl} className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700" alt="" />
                                        <div>
                                            <span className="font-medium text-black dark:text-white block">{req.employeeName}</span>
                                            <span className="text-[9px] text-gray-400 font-mono">Applied: {req.appliedOn}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">{req.type}</td>
                                <td className="py-3 px-4 font-mono text-black dark:text-white">{req.days} Days</td>
                                <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-mono text-[10px]">{req.startDate} — {req.endDate}</td>
                                <td className="py-3 px-4 text-gray-500 dark:text-gray-400 italic max-w-xs truncate" title={req.reason}>{req.reason}</td>
                                <td className="py-3 px-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${getStatusColor(req.status)}`}>
                                        {req.status === 'Approved' && <CheckCircle size={10} />}
                                        {req.status === 'Rejected' && <XCircle size={10} />}
                                        {req.status === 'Pending' && <Clock size={10} />}
                                        {req.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    {/* Action Buttons based on Tab and Status */}
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {activeTab === 'team_requests' && req.status === 'Pending' ? (
                                            <>
                                                <button onClick={() => handleAction(req.id, 'Approved')} className="p-1.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded border border-green-100 dark:border-green-500/20 hover:bg-green-100 dark:hover:bg-green-500/30 transition-colors" title="Approve">
                                                    <CheckCircle size={14} />
                                                </button>
                                                <button onClick={() => handleAction(req.id, 'Rejected')} className="p-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/30 transition-colors" title="Reject">
                                                    <XCircle size={14} />
                                                </button>
                                            </>
                                        ) : activeTab === 'my_requests' && req.status === 'Pending' ? (
                                            <button onClick={() => handleDelete(req.id)} className="p-1.5 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-500/20 transition-colors" title="Cancel Request">
                                                <Trash2 size={14} />
                                            </button>
                                        ) : (
                                            <button className="p-1.5 text-gray-300 dark:text-gray-600 cursor-default">
                                                <MoreHorizontal size={14} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <CalendarDays size={24} className="opacity-20" />
                                        <span className="text-sm">No leave requests found.</span>
                                        <button onClick={clearFilters} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Clear Filters</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    <AddLeaveRequestModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleCreateRequest}
        balances={{ annual: balances.annualLeft, sick: balances.sickLeft }}
    />
    </>
  );
};

export default LeaveBoard;
