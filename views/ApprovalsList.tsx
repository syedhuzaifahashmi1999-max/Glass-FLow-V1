
import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, XCircle, Filter, Search, Clock, FileText, 
  DollarSign, Briefcase, ShoppingBag, Calendar, Check, X,
  ArrowUpRight, AlertCircle, FileCheck, User, MapPin, Building2,
  ChevronRight, AlertTriangle
} from 'lucide-react';
import { Expense, LeaveRequest, Claim, PurchaseOrder, HRLetter } from '../types';

interface ApprovalsListProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  leaveRequests: LeaveRequest[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  claims: Claim[];
  setClaims: React.Dispatch<React.SetStateAction<Claim[]>>;
  purchaseOrders: PurchaseOrder[];
  setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  letters: HRLetter[];
  setLetters: React.Dispatch<React.SetStateAction<HRLetter[]>>;
  currency?: string;
}

// Unified Approval Item Type
interface ApprovalItem {
  id: string;
  type: 'Expense' | 'Leave' | 'Claim' | 'Purchase Order' | 'HR Letter';
  requesterName: string;
  avatarUrl?: string;
  title: string;
  subtitle: string;
  date: string;
  status: string;
  originalId: string;
  amount?: number; // Common field
  details?: any; // Store ref to original object for drawer
}

const ApprovalsList: React.FC<ApprovalsListProps> = ({ 
    expenses, setExpenses, 
    leaveRequests, setLeaveRequests,
    claims, setClaims,
    purchaseOrders, setPurchaseOrders,
    letters, setLetters,
    currency = 'USD'
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);

  // --- Data Aggregation ---
  const allApprovals: ApprovalItem[] = useMemo(() => {
    const items: ApprovalItem[] = [];

    // 1. Expenses (Pending)
    expenses.forEach(exp => {
        items.push({
            id: `EXP_${exp.id}`,
            originalId: exp.id,
            type: 'Expense',
            requesterName: 'Finance Dept', // Often expenses are company cards, or reimbursement
            avatarUrl: 'https://ui-avatars.com/api/?name=Finance&background=random',
            title: exp.payee,
            subtitle: new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(exp.amount),
            date: exp.date,
            status: exp.status,
            amount: exp.amount,
            details: exp
        });
    });

    // 2. Claims (Submitted -> Pending Approval)
    claims.forEach(claim => {
        items.push({
            id: `CLM_${claim.id}`,
            originalId: claim.id,
            type: 'Claim',
            requesterName: claim.employeeName,
            avatarUrl: claim.avatarUrl,
            title: claim.description,
            subtitle: new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(claim.amount),
            date: claim.date,
            status: claim.status,
            amount: claim.amount,
            details: claim
        });
    });

    // 3. Leave Requests
    leaveRequests.forEach(req => {
        items.push({
            id: `LEV_${req.id}`,
            originalId: req.id,
            type: 'Leave',
            requesterName: req.employeeName,
            avatarUrl: req.avatarUrl,
            title: `${req.type} Leave`,
            subtitle: `${req.days} Days (${req.startDate})`,
            date: req.appliedOn || req.startDate,
            status: req.status,
            details: req
        });
    });

    // 4. Purchase Orders (Draft/Ordered)
    purchaseOrders.forEach(po => {
        items.push({
            id: `PO_${po.id}`,
            originalId: po.id,
            type: 'Purchase Order',
            requesterName: 'Procurement',
            title: po.vendorName,
            subtitle: new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(po.totalAmount),
            date: po.orderDate,
            status: po.status,
            amount: po.totalAmount,
            details: po
        });
    });

    // 5. HR Letters
    letters.forEach(ltr => {
        items.push({
            id: `LTR_${ltr.id}`,
            originalId: ltr.id,
            type: 'HR Letter',
            requesterName: ltr.employeeName,
            avatarUrl: ltr.avatarUrl,
            title: ltr.type,
            subtitle: ltr.purpose,
            date: ltr.dateRequested,
            status: ltr.status,
            details: ltr
        });
    });

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, leaveRequests, claims, purchaseOrders, letters, currency]);

  // --- Filtering Logic ---
  const filteredApprovals = useMemo(() => {
      return allApprovals.filter(item => {
          // Status Filter
          const isPending = ['Pending', 'Submitted', 'Draft', 'Ordered'].includes(item.status);
          if (activeTab === 'pending' && !isPending) return false;
          if (activeTab === 'history' && isPending) return false;

          // Search
          const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                item.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                item.originalId.toLowerCase().includes(searchQuery.toLowerCase());
          
          // Type Filter
          const matchesType = filterType === 'All' || item.type === filterType;

          return matchesSearch && matchesType;
      });
  }, [allApprovals, activeTab, searchQuery, filterType]);

  // --- Action Handlers ---

  const handleUpdateStatus = (item: ApprovalItem, action: 'Approve' | 'Reject') => {
      // Map generic action to specific status strings based on type
      switch(item.type) {
          case 'Expense':
              setExpenses(prev => prev.map(e => e.id === item.originalId ? { ...e, status: action === 'Approve' ? 'Scheduled' : 'Failed' } : e));
              break;
          case 'Claim':
              setClaims(prev => prev.map(c => c.id === item.originalId ? { ...c, status: action === 'Approve' ? 'Approved' : 'Rejected', approvalDate: new Date().toLocaleDateString() } : c));
              break;
          case 'Leave':
              setLeaveRequests(prev => prev.map(l => l.id === item.originalId ? { ...l, status: action === 'Approve' ? 'Approved' : 'Rejected' } : l));
              break;
          case 'HR Letter':
              setLetters(prev => prev.map(l => l.id === item.originalId ? { ...l, status: action === 'Approve' ? 'Approved' : 'Rejected', dateIssued: action === 'Approve' ? new Date().toISOString().split('T')[0] : undefined } : l));
              break;
          case 'Purchase Order':
             // Simplification: Approve Draft -> Ordered, or Ordered -> Received (if receiving)
             // Let's assume this view approves Drafts to Ordered
              setPurchaseOrders(prev => prev.map(p => p.id === item.originalId ? { ...p, status: action === 'Approve' ? 'Ordered' : 'Cancelled' } : p));
              break;
      }
      // Close drawer if open and matching
      if (selectedItem?.id === item.id) {
          setSelectedItem(null);
      }
  };

  const handleBulkAction = (action: 'Approve' | 'Reject') => {
      if (!confirm(`${action} ${selectedIds.size} selected items?`)) return;
      
      const itemsToUpdate = allApprovals.filter(i => selectedIds.has(i.id));
      itemsToUpdate.forEach(item => handleUpdateStatus(item, action));
      setSelectedIds(new Set());
  };

  const handleSelectOne = (id: string) => {
      const next = new Set(selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelectedIds(next);
  };

  const handleSelectAll = () => {
      if (selectedIds.size === filteredApprovals.length) setSelectedIds(new Set());
      else setSelectedIds(new Set(filteredApprovals.map(i => i.id)));
  };

  // --- Visual Helpers ---
  const getTypeIcon = (type: ApprovalItem['type']) => {
      switch(type) {
          case 'Expense': return <DollarSign size={16} className="text-orange-500" />;
          case 'Claim': return <FileCheck size={16} className="text-blue-500" />;
          case 'Leave': return <Calendar size={16} className="text-purple-500" />;
          case 'Purchase Order': return <ShoppingBag size={16} className="text-emerald-500" />;
          case 'HR Letter': return <FileText size={16} className="text-pink-500" />;
      }
  };

  const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  // --- Drawer Content Renderer ---
  const renderDrawerContent = (item: ApprovalItem) => {
      const details = item.details;
      
      return (
          <div className="space-y-6">
              {/* Common Header Info */}
              <div className="flex items-center gap-4">
                  {item.avatarUrl ? (
                      <img src={item.avatarUrl} className="w-12 h-12 rounded-full border border-gray-100 dark:border-gray-700" />
                  ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                          <User size={20} className="text-gray-400" />
                      </div>
                  )}
                  <div>
                      <h3 className="text-sm font-bold text-black dark:text-white">{item.requesterName}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Requesting approval for {item.type}</p>
                  </div>
              </div>
              
              {/* Type Specific Details */}
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
                  {item.type === 'Leave' && (
                      <>
                          <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Leave Type</span>
                              <span className="text-xs font-medium">{details.type}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Duration</span>
                              <span className="text-xs font-medium">{details.days} Days</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Dates</span>
                              <span className="text-xs font-medium">{details.startDate} - {details.endDate}</span>
                          </div>
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="text-xs text-gray-500 block mb-1">Reason</span>
                              <p className="text-xs text-black dark:text-white italic">"{details.reason}"</p>
                          </div>
                      </>
                  )}

                  {(item.type === 'Expense' || item.type === 'Claim') && (
                      <>
                         <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Amount</span>
                              <span className="text-lg font-bold text-black dark:text-white">{formatCurrency(details.amount)}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Category</span>
                              <span className="text-xs font-medium">{details.category}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Date Incurred</span>
                              <span className="text-xs font-medium">{details.date}</span>
                          </div>
                          {details.description && (
                              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                  <span className="text-xs text-gray-500 block mb-1">Description</span>
                                  <p className="text-xs text-black dark:text-white">{details.description}</p>
                              </div>
                          )}
                      </>
                  )}

                  {item.type === 'Purchase Order' && (
                      <>
                          <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Total Value</span>
                              <span className="text-lg font-bold text-black dark:text-white">{formatCurrency(details.totalAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Vendor</span>
                              <span className="text-xs font-medium">{details.vendorName}</span>
                          </div>
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="text-xs text-gray-500 block mb-1">Items</span>
                              <ul className="space-y-1">
                                  {details.items.map((i: any, idx: number) => (
                                      <li key={idx} className="flex justify-between text-xs">
                                          <span>{i.quantity}x {i.description}</span>
                                          <span>{formatCurrency(i.unitCost * i.quantity)}</span>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </>
                  )}

                   {item.type === 'HR Letter' && (
                      <>
                          <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Letter Type</span>
                              <span className="text-xs font-medium">{details.type}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Addressee</span>
                              <span className="text-xs font-medium">{details.addressee || 'General'}</span>
                          </div>
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="text-xs text-gray-500 block mb-1">Purpose</span>
                              <p className="text-xs text-black dark:text-white italic">"{details.purpose}"</p>
                          </div>
                      </>
                  )}
              </div>

              {/* Warnings/Alerts */}
              {(details.policyWarning || (item.amount && item.amount > 5000)) && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg flex gap-2 text-red-600 dark:text-red-400">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      <div>
                          <p className="text-xs font-bold">Policy Alert</p>
                          <p className="text-[10px] opacity-90">{details.policyWarning || 'High value transaction requires VP approval.'}</p>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
        
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Approvals Center</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Centralized hub for all pending requests across the organization.</p>
            </div>
            
            <div className="flex gap-4">
                <div className="px-4 py-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg border border-orange-100 dark:border-orange-500/20 min-w-[140px]">
                    <span className="text-[10px] uppercase text-orange-600 dark:text-orange-400 font-semibold tracking-wider flex items-center gap-1"><Clock size={10} /> Pending</span>
                    <div className="text-lg font-light text-orange-700 dark:text-orange-300 mt-0.5">{allApprovals.filter(i => ['Pending', 'Submitted', 'Draft', 'Ordered'].includes(i.status)).length}</div>
                </div>
                <div className="px-4 py-2 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-100 dark:border-green-500/20 min-w-[140px]">
                    <span className="text-[10px] uppercase text-green-600 dark:text-green-400 font-semibold tracking-wider flex items-center gap-1"><CheckCircle size={10} /> Approved Today</span>
                    <div className="text-lg font-light text-green-700 dark:text-green-300 mt-0.5">
                        {allApprovals.filter(i => i.status === 'Approved' || i.status === 'Paid' || i.status === 'Scheduled').filter(i => i.date === new Date().toISOString().split('T')[0] || i.date === new Date().toLocaleDateString()).length}
                    </div>
                </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 shrink-0">
             <div className="flex gap-2 w-full md:w-auto">
                 {/* Tabs */}
                 <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 mr-2">
                    <button 
                        onClick={() => { setActiveTab('pending'); setSelectedIds(new Set()); setSelectedItem(null); }} 
                        className={`px-6 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'pending' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        Pending Review
                    </button>
                    <button 
                        onClick={() => { setActiveTab('history'); setSelectedIds(new Set()); setSelectedItem(null); }} 
                        className={`px-6 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'history' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        History
                    </button>
                 </div>
                 
                 <div className="relative group flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search requests..." 
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20" 
                    />
                </div>

                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-8 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 appearance-none min-w-[140px]"
                    >
                        <option value="All">All Types</option>
                        <option value="Expense">Expenses</option>
                        <option value="Claim">Claims</option>
                        <option value="Leave">Leave Requests</option>
                        <option value="Purchase Order">Purchase Orders</option>
                        <option value="HR Letter">HR Letters</option>
                    </select>
                </div>
             </div>

             {selectedIds.size > 0 && activeTab === 'pending' && (
                 <div className="flex items-center gap-1 bg-black dark:bg-white text-white dark:text-black px-2 py-1.5 rounded-lg shadow-lg animate-in slide-in-from-right-5 fade-in duration-300">
                     <span className="text-[10px] font-bold px-2 border-r border-white/20 dark:border-black/20">{selectedIds.size} Selected</span>
                     <button onClick={() => handleBulkAction('Approve')} className="p-1.5 hover:bg-white/20 dark:hover:bg-black/10 rounded flex items-center gap-1 text-[10px] font-medium"><Check size={12} /> Approve</button>
                     <button onClick={() => handleBulkAction('Reject')} className="p-1.5 hover:bg-white/20 dark:hover:bg-black/10 rounded flex items-center gap-1 text-[10px] font-medium"><X size={12} /> Reject</button>
                     <button onClick={() => setSelectedIds(new Set())} className="ml-1 p-1 hover:bg-white/20 dark:hover:bg-black/10 rounded text-gray-400 hover:text-white dark:hover:text-black"><X size={12} /></button>
                 </div>
             )}
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm flex flex-col relative">
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                 <table className="w-full text-left border-collapse">
                     <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold sticky top-0 backdrop-blur-sm z-10">
                         <tr>
                             <th className="py-3 px-4 w-10 text-center">
                                 <button onClick={handleSelectAll} className="flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white">
                                     <div className={`w-3.5 h-3.5 border rounded ${selectedIds.size > 0 && selectedIds.size === filteredApprovals.length ? 'bg-black dark:bg-white border-black dark:border-white' : 'border-gray-300 dark:border-gray-600'}`}></div>
                                 </button>
                             </th>
                             <th className="px-6 py-3">Request Type</th>
                             <th className="px-6 py-3">Requester</th>
                             <th className="px-6 py-3">Details</th>
                             <th className="px-6 py-3">Date</th>
                             <th className="px-6 py-3">Status</th>
                             <th className="px-6 py-3 text-right">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-xs">
                         {filteredApprovals.map(item => (
                             <tr 
                                key={item.id} 
                                className={`group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${selectedIds.has(item.id) ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''}`}
                                onClick={() => setSelectedItem(item)}
                             >
                                 <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                     <button onClick={() => handleSelectOne(item.id)} className="flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white">
                                        <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center ${selectedIds.has(item.id) ? 'bg-black dark:bg-white border-black dark:border-white' : 'border-gray-300 dark:border-gray-600'}`}>
                                            {selectedIds.has(item.id) && <Check size={10} className="text-white dark:text-black" />}
                                        </div>
                                     </button>
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="flex items-center gap-2 font-medium text-black dark:text-white">
                                         {getTypeIcon(item.type)}
                                         {item.type}
                                     </div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="flex items-center gap-2">
                                         {item.avatarUrl ? (
                                             <img src={item.avatarUrl} className="w-6 h-6 rounded-full border border-gray-100 dark:border-gray-700" />
                                         ) : (
                                             <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[10px] text-gray-500">{item.requesterName.charAt(0)}</div>
                                         )}
                                         <span className="text-gray-700 dark:text-gray-300">{item.requesterName}</span>
                                     </div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="flex flex-col">
                                         <span className="font-medium text-black dark:text-white">{item.title}</span>
                                         <span className="text-[10px] text-gray-500 dark:text-gray-400">{item.subtitle}</span>
                                     </div>
                                 </td>
                                 <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono">{item.date}</td>
                                 <td className="px-6 py-4">
                                     <span className={`px-2 py-0.5 rounded text-[10px] border w-fit ${
                                         ['Approved', 'Paid', 'Scheduled', 'Ordered'].includes(item.status) ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20' :
                                         ['Rejected', 'Cancelled', 'Failed'].includes(item.status) ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20' :
                                         'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20'
                                     }`}>
                                         {item.status}
                                     </span>
                                 </td>
                                 <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                     {activeTab === 'pending' && (
                                         <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <button 
                                                onClick={() => handleUpdateStatus(item, 'Approve')}
                                                className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/20 rounded transition-colors" 
                                                title="Approve"
                                             >
                                                 <Check size={14} />
                                             </button>
                                             <button 
                                                onClick={() => handleUpdateStatus(item, 'Reject')}
                                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded transition-colors" 
                                                title="Reject"
                                             >
                                                 <X size={14} />
                                             </button>
                                         </div>
                                     )}
                                     {activeTab === 'history' && (
                                         <button className="text-gray-300 dark:text-gray-600 cursor-default hover:text-black dark:hover:text-white transition-colors">
                                             <ArrowUpRight size={14} />
                                         </button>
                                     )}
                                 </td>
                             </tr>
                         ))}
                         {filteredApprovals.length === 0 && (
                             <tr>
                                 <td colSpan={7} className="py-12 text-center text-gray-400">
                                     <div className="flex flex-col items-center justify-center gap-2">
                                         <FileCheck size={24} className="opacity-20" />
                                         <span className="text-sm">No requests found.</span>
                                     </div>
                                 </td>
                             </tr>
                         )}
                     </tbody>
                 </table>
             </div>

             {/* Detail Drawer */}
             {selectedItem && (
                 <div className="absolute top-0 right-0 bottom-0 w-[400px] bg-white dark:bg-[#18181b] border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col animate-in slide-in-from-right-10 duration-300 z-20">
                     <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start bg-gray-50/50 dark:bg-white/5">
                         <div>
                             <h2 className="text-lg font-bold text-black dark:text-white">{selectedItem.type}</h2>
                             <span className={`text-[10px] font-medium px-2 py-0.5 rounded border mt-1 inline-block ${
                                 ['Approved', 'Paid', 'Scheduled', 'Ordered'].includes(selectedItem.status) ? 'bg-green-50 text-green-700 border-green-100' :
                                 ['Rejected', 'Cancelled'].includes(selectedItem.status) ? 'bg-red-50 text-red-700 border-red-100' :
                                 'bg-orange-50 text-orange-700 border-orange-100'
                             }`}>
                                 {selectedItem.status}
                             </span>
                         </div>
                         <button onClick={() => setSelectedItem(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-500">
                             <X size={20} />
                         </button>
                     </div>
                     
                     <div className="flex-1 overflow-y-auto p-6">
                         {renderDrawerContent(selectedItem)}
                     </div>

                     {/* Drawer Actions */}
                     {activeTab === 'pending' && (
                         <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex gap-3">
                             <button 
                                onClick={() => handleUpdateStatus(selectedItem, 'Reject')}
                                className="flex-1 py-3 rounded-xl border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-sm transition-colors"
                             >
                                 Reject
                             </button>
                             <button 
                                onClick={() => handleUpdateStatus(selectedItem, 'Approve')}
                                className="flex-[2] py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 font-medium text-sm transition-opacity shadow-lg shadow-black/5"
                             >
                                 Approve
                             </button>
                         </div>
                     )}
                 </div>
             )}
        </div>
    </div>
  );
};

export default ApprovalsList;
