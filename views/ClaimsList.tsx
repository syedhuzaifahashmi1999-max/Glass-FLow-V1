
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, LayoutGrid, List as ListIcon, 
  CheckCircle, AlertCircle, Clock, Trash2, X, Download, MoreHorizontal, FileText, CheckSquare, Square, ThumbsUp, DollarSign
} from 'lucide-react';
import { Claim } from '../types';
import { MOCK_CLAIMS, MOCK_EMPLOYEES } from '../constants';
import ClaimCard from '../components/claims/ClaimCard';
import ClaimModal from '../components/claims/ClaimModal';
import ClaimDetailDrawer from '../components/claims/ClaimDetailDrawer';

const ClaimsList: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'my_claims' | 'team_approvals'>('my_claims');
  const [claims, setClaims] = useState<Claim[]>(MOCK_CLAIMS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  // Drag & Drop
  const [draggedClaimId, setDraggedClaimId] = useState<string | null>(null);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Mock Current User ID
  const currentUserId = 'e1';

  // --- Handlers: Logic ---
  
  const handleAddClaim = (claimData: any) => {
      const employee = MOCK_EMPLOYEES.find(e => e.id === claimData.employeeId);
      const newClaim: Claim = {
          ...claimData,
          id: `CLM-${Date.now()}`,
          status: 'Submitted', // Default to submitted for workflow
          employeeName: employee?.name || 'Unknown',
          avatarUrl: employee?.avatarUrl || '',
          submissionDate: new Date().toLocaleDateString(),
          policyWarning: claimData.amount > 1000 ? 'Requires Director Approval' : undefined // Mock policy
      };
      setClaims(prev => [newClaim, ...prev]);
  };

  const handleDelete = (id: string) => {
      if (confirm('Delete this claim?')) {
          setClaims(prev => prev.filter(c => c.id !== id));
          if (selectedIds.has(id)) {
             const next = new Set(selectedIds);
             next.delete(id);
             setSelectedIds(next);
          }
      }
  };

  const handleStatusChange = (id: string, newStatus: Claim['status'], meta?: any) => {
      setClaims(prev => prev.map(c => {
          if (c.id === id) {
              return { 
                  ...c, 
                  status: newStatus,
                  approvalDate: newStatus === 'Approved' ? new Date().toLocaleDateString() : c.approvalDate,
                  rejectionReason: meta?.reason,
                  // If paid, maybe update paid date etc.
              };
          }
          return c;
      }));
      // Update selected claim if open
      if (selectedClaim?.id === id) {
          setSelectedClaim(prev => prev ? { 
             ...prev, 
             status: newStatus, 
             approvalDate: newStatus === 'Approved' ? new Date().toLocaleDateString() : prev.approvalDate,
             rejectionReason: meta?.reason 
          } : null);
      }
  };

  // Bulk Actions
  const handleSelectAll = () => {
      if (selectedIds.size === filteredClaims.length) setSelectedIds(new Set());
      else setSelectedIds(new Set(filteredClaims.map(c => c.id)));
  };

  const handleSelectOne = (id: string) => {
      const next = new Set(selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelectedIds(next);
  };

  const handleBulkAction = (action: 'approve' | 'reject' | 'delete') => {
      if (selectedIds.size === 0) return;
      if (!confirm(`${action === 'approve' ? 'Approve' : 'Delete'} ${selectedIds.size} selected claims?`)) return;

      if (action === 'delete') {
          setClaims(prev => prev.filter(c => !selectedIds.has(c.id)));
      } else {
          const status = action === 'approve' ? 'Approved' : 'Rejected';
          setClaims(prev => prev.map(c => selectedIds.has(c.id) ? { 
              ...c, 
              status: status,
              approvalDate: status === 'Approved' ? new Date().toLocaleDateString() : undefined
          } : c));
      }
      setSelectedIds(new Set());
  };

  const handleExport = () => {
      const headers = ['ID', 'Employee', 'Category', 'Date', 'Amount', 'Status'];
      const rows = filteredClaims.map(c => [c.id, c.employeeName, c.category, c.date, c.amount, c.status].join(','));
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'claims_export.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // Drag & Drop
  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedClaimId(id);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (e: React.DragEvent, targetStatus: Claim['status']) => {
    e.preventDefault();
    if (!draggedClaimId) return;
    if (activeTab === 'team_approvals') {
        handleStatusChange(draggedClaimId, targetStatus);
    }
    setDraggedClaimId(null);
  };

  // --- Metrics ---
  const stats = useMemo(() => {
      const pending = claims.filter(c => c.status === 'Submitted').reduce((sum, c) => sum + c.amount, 0);
      const approved = claims.filter(c => c.status === 'Approved').reduce((sum, c) => sum + c.amount, 0);
      const paid = claims.filter(c => c.status === 'Paid').reduce((sum, c) => sum + c.amount, 0);
      return { pending, approved, paid };
  }, [claims]);

  const filteredClaims = useMemo(() => {
      return claims.filter(c => {
          const matchesSearch = 
            c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
          
          let matchesTab = true;
          if (activeTab === 'my_claims') {
              matchesTab = c.employeeId === currentUserId;
          } else {
              matchesTab = c.employeeId !== currentUserId; 
          }
          return matchesSearch && matchesTab;
      });
  }, [claims, searchQuery, activeTab]);

  const statuses: Claim['status'][] = ['Submitted', 'Approved', 'Paid', 'Rejected'];

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
        
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Expense Claims</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Manage employee reimbursements and approvals.</p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-1">
                <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 min-w-[140px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1"><Clock size={10} /> Pending</span>
                    <div className="text-lg font-light text-orange-600 dark:text-orange-400 mt-0.5">${stats.pending.toLocaleString()}</div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 min-w-[140px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1"><CheckCircle size={10} /> To Pay</span>
                    <div className="text-lg font-light text-green-600 dark:text-green-400 mt-0.5">${stats.approved.toLocaleString()}</div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 min-w-[140px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1"><Download size={10} /> Paid YTD</span>
                    <div className="text-lg font-light text-black dark:text-white mt-0.5">${stats.paid.toLocaleString()}</div>
                </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 shrink-0">
             <div className="flex gap-2 w-full md:w-auto">
                 {/* Tabs */}
                 <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 mr-2">
                    <button 
                        onClick={() => { setActiveTab('my_claims'); setSelectedIds(new Set()); }} 
                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'my_claims' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        My Claims
                    </button>
                    <button 
                        onClick={() => { setActiveTab('team_approvals'); setSelectedIds(new Set()); }} 
                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'team_approvals' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        Approvals
                    </button>
                 </div>

                 <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}><LayoutGrid size={14}/></button>
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}><ListIcon size={14}/></button>
                 </div>
                 
                 <div className="relative group flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search claims..." 
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20" 
                    />
                </div>
             </div>

             <div className="flex gap-2">
                 {/* Bulk Actions Toolbar */}
                 {selectedIds.size > 0 && activeTab === 'team_approvals' && (
                     <div className="flex items-center gap-1 bg-black dark:bg-white text-white dark:text-black px-2 py-1.5 rounded-lg shadow-lg animate-in slide-in-from-right-5 fade-in duration-300">
                         <span className="text-[10px] font-bold px-2 border-r border-white/20 dark:border-black/20">{selectedIds.size} Selected</span>
                         <button onClick={() => handleBulkAction('approve')} className="p-1.5 hover:bg-white/20 dark:hover:bg-black/10 rounded flex items-center gap-1 text-[10px] font-medium"><CheckCircle size={12} /> Approve</button>
                         <button onClick={() => handleBulkAction('reject')} className="p-1.5 hover:bg-white/20 dark:hover:bg-black/10 rounded flex items-center gap-1 text-[10px] font-medium"><X size={12} /> Reject</button>
                         <button onClick={() => setSelectedIds(new Set())} className="ml-1 p-1 hover:bg-white/20 dark:hover:bg-black/10 rounded text-gray-400 hover:text-white dark:hover:text-black"><X size={12} /></button>
                     </div>
                 )}
                 
                 <button onClick={handleExport} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors" title="Export CSV">
                     <Download size={16} className="text-gray-500" />
                 </button>
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-colors text-xs font-medium shadow-sm"
                >
                    <Plus size={14} /> New Claim
                </button>
             </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
             {viewMode === 'grid' ? (
                 <div className="h-full overflow-x-auto custom-scrollbar pb-4">
                     <div className="flex gap-6 h-full min-w-max">
                         {statuses.map(status => {
                             const statusClaims = filteredClaims.filter(c => c.status === status);
                             
                             return (
                                 <div 
                                    key={status}
                                    className="w-80 flex flex-col h-full bg-gray-50/50 dark:bg-white/5 rounded-xl border border-gray-200/60 dark:border-gray-800/60 p-2"
                                    onDragOver={onDragOver}
                                    onDrop={(e) => onDrop(e, status)}
                                 >
                                     <div className="flex justify-between items-center px-3 py-3 mb-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{status}</h3>
                                            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-white/10 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700 shadow-sm">{statusClaims.length}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-400">
                                            ${statusClaims.reduce((acc, c) => acc + c.amount, 0).toLocaleString()}
                                        </span>
                                     </div>

                                     <div className="flex-1 space-y-2.5 overflow-y-auto custom-scrollbar px-1 pb-20">
                                         {statusClaims.map(claim => (
                                             <div key={claim.id}>
                                                 <ClaimCard 
                                                    claim={claim}
                                                    isDragging={draggedClaimId === claim.id}
                                                    onDragStart={onDragStart}
                                                    onClick={() => setSelectedClaim(claim)}
                                                 />
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             );
                         })}
                     </div>
                 </div>
             ) : (
                 <div className="h-full overflow-y-auto custom-scrollbar bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl">
                     <table className="w-full text-left border-collapse">
                         <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold sticky top-0 backdrop-blur-sm z-10">
                             <tr>
                                 <th className="py-3 px-4 w-10 text-center">
                                     <button onClick={handleSelectAll} className="flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white">
                                         {selectedIds.size > 0 && selectedIds.size === filteredClaims.length ? <CheckSquare size={14} /> : <Square size={14} />}
                                     </button>
                                 </th>
                                 <th className="px-6 py-3">Description</th>
                                 <th className="px-6 py-3">Employee</th>
                                 <th className="px-6 py-3">Category</th>
                                 <th className="px-6 py-3">Date</th>
                                 <th className="px-6 py-3">Amount</th>
                                 <th className="px-6 py-3">Status</th>
                                 <th className="px-6 py-3 text-right">Actions</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-xs">
                             {filteredClaims.map(c => (
                                 <tr 
                                    key={c.id} 
                                    onClick={() => setSelectedClaim(c)}
                                    className={`group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${selectedIds.has(c.id) ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''}`}
                                 >
                                     <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                         <button onClick={() => handleSelectOne(c.id)} className="flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white">
                                             {selectedIds.has(c.id) ? <CheckSquare size={14} className="text-black dark:text-white" /> : <Square size={14} />}
                                         </button>
                                     </td>
                                     <td className="px-6 py-4 font-medium text-black dark:text-white">{c.description}</td>
                                     <td className="px-6 py-4 flex items-center gap-2">
                                         <img src={c.avatarUrl} className="w-6 h-6 rounded-full" />
                                         {c.employeeName}
                                     </td>
                                     <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{c.category}</td>
                                     <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono">{c.date}</td>
                                     <td className="px-6 py-4 font-mono font-medium text-black dark:text-white">${c.amount.toFixed(2)}</td>
                                     <td className="px-6 py-4">
                                         <span className={`px-2 py-0.5 rounded text-[10px] border ${
                                             c.status === 'Approved' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 border-green-100' :
                                             c.status === 'Rejected' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 border-red-100' :
                                             'bg-gray-50 dark:bg-white/5 text-gray-500 border-gray-200'
                                         }`}>
                                             {c.status}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4 text-right">
                                         <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                             {activeTab === 'my_claims' && c.status === 'Submitted' && (
                                                 <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Delete">
                                                     <Trash2 size={14} />
                                                 </button>
                                             )}
                                             
                                             {activeTab === 'team_approvals' && c.status === 'Submitted' && (
                                                <>
                                                    <button onClick={() => handleStatusChange(c.id, 'Approved')} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/20 rounded transition-colors" title="Approve">
                                                        <ThumbsUp size={14} />
                                                    </button>
                                                    <button onClick={() => handleStatusChange(c.id, 'Rejected')} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded transition-colors" title="Reject">
                                                        <X size={14} />
                                                    </button>
                                                </>
                                             )}
                                              
                                             {c.receiptUrl && (
                                                 <button onClick={() => setSelectedClaim(c)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded transition-colors" title="View Receipt">
                                                     <FileText size={14} />
                                                 </button>
                                             )}
                                         </div>
                                     </td>
                                 </tr>
                             ))}
                             {filteredClaims.length === 0 && (
                                 <tr>
                                     <td colSpan={8} className="py-12 text-center text-gray-400">No claims found.</td>
                                 </tr>
                             )}
                         </tbody>
                     </table>
                 </div>
             )}
        </div>

    </div>

    <ClaimModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddClaim}
        employees={MOCK_EMPLOYEES}
    />

    <ClaimDetailDrawer 
        claim={selectedClaim} 
        onClose={() => setSelectedClaim(null)} 
        onApprove={(id, reason) => handleStatusChange(id, 'Approved', { reason })}
        onReject={(id, reason) => handleStatusChange(id, 'Rejected', { reason })}
        onPay={(id) => handleStatusChange(id, 'Paid')}
        currentUserId={currentUserId}
    />
    </>
  );
};

export default ClaimsList;
