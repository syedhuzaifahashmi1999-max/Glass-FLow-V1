
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, Clock, CheckCircle, XCircle, FileText, Eye, Check, X, 
  Download, Printer, Trash2, CheckSquare, Square, MoreHorizontal, ArrowUpDown
} from 'lucide-react';
import { HRLetter, LetterType } from '../types';
import { MOCK_LETTERS, MOCK_EMPLOYEES } from '../constants';
import LetterRequestModal from '../components/hr/LetterRequestModal';
import LetterPreviewModal from '../components/hr/LetterPreviewModal';
import LetterDetailDrawer from '../components/hr/LetterDetailDrawer';

const HRLettersList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my_requests' | 'all_requests'>('my_requests');
  const [letters, setLetters] = useState<HRLetter[]>(MOCK_LETTERS);
  
  // Selection & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Modals & Drawers
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [previewLetter, setPreviewLetter] = useState<HRLetter | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<HRLetter | null>(null);

  // Mock Current User
  const currentUserId = 'e1';

  // --- Logic ---

  const handleRequestLetter = (letterData: any) => {
      const newLetter: HRLetter = {
          ...letterData,
          id: `LTR-${Date.now()}`,
          status: activeTab === 'all_requests' ? 'Approved' : 'Pending', // Auto-approve if created by Admin
          dateIssued: activeTab === 'all_requests' ? new Date().toISOString().split('T')[0] : undefined
      };
      setLetters(prev => [newLetter, ...prev]);
  };

  const handleStatusChange = (id: string, newStatus: HRLetter['status'], reason?: string) => {
      setLetters(prev => prev.map(l => l.id === id ? { 
          ...l, 
          status: newStatus,
          dateIssued: newStatus === 'Approved' ? new Date().toISOString().split('T')[0] : undefined,
          rejectionReason: reason
      } : l));
      
      // Update selected drawer if open
      if (selectedLetter?.id === id) {
          setSelectedLetter(prev => prev ? { 
              ...prev, 
              status: newStatus, 
              dateIssued: newStatus === 'Approved' ? new Date().toISOString().split('T')[0] : undefined,
              rejectionReason: reason 
          } : null);
      }
  };

  const handleDelete = (id: string) => {
      setLetters(prev => prev.filter(l => l.id !== id));
      if (selectedIds.has(id)) {
          const next = new Set(selectedIds);
          next.delete(id);
          setSelectedIds(next);
      }
  };

  // Bulk Actions
  const handleSelectAll = () => {
      if (selectedIds.size === filteredLetters.length) setSelectedIds(new Set());
      else setSelectedIds(new Set(filteredLetters.map(l => l.id)));
  };

  const handleSelectOne = (id: string) => {
      const next = new Set(selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelectedIds(next);
  };

  const handleBulkAction = (action: 'approve' | 'delete') => {
      if (selectedIds.size === 0) return;
      if (!confirm(`${action === 'approve' ? 'Approve' : 'Delete'} ${selectedIds.size} items?`)) return;

      if (action === 'delete') {
          setLetters(prev => prev.filter(l => !selectedIds.has(l.id)));
      } else {
          setLetters(prev => prev.map(l => selectedIds.has(l.id) && l.status === 'Pending' ? {
              ...l,
              status: 'Approved',
              dateIssued: new Date().toISOString().split('T')[0]
          } : l));
      }
      setSelectedIds(new Set());
  };

  // --- Derived Data ---

  const filteredLetters = useMemo(() => {
      return letters.filter(l => {
          // Search
          const matchesSearch = l.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                l.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                l.id.toLowerCase().includes(searchQuery.toLowerCase());
          
          // Tab
          let matchesTab = true;
          if (activeTab === 'my_requests') matchesTab = l.employeeId === currentUserId;
          
          // Filters
          const matchesStatus = filterStatus === 'All' || l.status === filterStatus;
          const matchesType = filterType === 'All' || l.type === filterType;

          return matchesSearch && matchesTab && matchesStatus && matchesType;
      });
  }, [letters, searchQuery, activeTab, filterStatus, filterType]);

  const stats = useMemo(() => {
      const pending = letters.filter(l => l.status === 'Pending').length;
      const approved = letters.filter(l => l.status === 'Approved').length;
      return { pending, approved };
  }, [letters]);

  const getStatusColor = (status: HRLetter['status']) => {
      switch (status) {
          case 'Approved': return 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20';
          case 'Rejected': return 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20';
          default: return 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20';
      }
  };

  const letterTypes: LetterType[] = ['Employment Verification', 'Salary Certificate', 'NOC', 'Experience Letter', 'Confirmation Letter'];

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in" onClick={() => setSelectedIds(new Set())}>
        
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">HR Letters</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Request and manage official employee documentation.</p>
            </div>
            
            <div className="flex gap-4">
                <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 min-w-[120px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1"><Clock size={10} /> Pending</span>
                    <div className="text-lg font-light text-orange-600 dark:text-orange-400 mt-0.5">{stats.pending}</div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 min-w-[120px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1"><CheckCircle size={10} /> Issued</span>
                    <div className="text-lg font-light text-green-600 dark:text-green-400 mt-0.5">{stats.approved}</div>
                </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 shrink-0">
             <div className="flex gap-2 w-full md:w-auto">
                 {/* Tabs */}
                 <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 mr-2">
                    <button 
                        onClick={() => { setActiveTab('my_requests'); setSelectedIds(new Set()); }} 
                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'my_requests' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        My Requests
                    </button>
                    <button 
                        onClick={() => { setActiveTab('all_requests'); setSelectedIds(new Set()); }} 
                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'all_requests' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        All Requests
                    </button>
                 </div>
                 
                 <div className="relative group flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search letters..." 
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20" 
                    />
                </div>

                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors text-xs font-medium ${isFilterOpen ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                    <Filter size={14} />
                    <span className="hidden sm:inline">Filter</span>
                </button>
             </div>

             <div className="flex gap-2">
                 {/* Bulk Actions */}
                 {selectedIds.size > 0 && (
                     <div className="flex items-center gap-1 bg-black dark:bg-white text-white dark:text-black px-2 py-1.5 rounded-lg shadow-lg animate-in slide-in-from-right-5 fade-in duration-300">
                         <span className="text-[10px] font-bold px-2 border-r border-white/20 dark:border-black/20">{selectedIds.size} Selected</span>
                         {activeTab === 'all_requests' && (
                             <button onClick={() => handleBulkAction('approve')} className="p-1.5 hover:bg-white/20 dark:hover:bg-black/10 rounded flex items-center gap-1 text-[10px] font-medium"><Check size={12} /> Approve</button>
                         )}
                         <button onClick={() => handleBulkAction('delete')} className="p-1.5 hover:bg-white/20 dark:hover:bg-black/10 rounded flex items-center gap-1 text-[10px] font-medium"><Trash2 size={12} /> Delete</button>
                         <button onClick={() => setSelectedIds(new Set())} className="ml-1 p-1 hover:bg-white/20 dark:hover:bg-black/10 rounded text-gray-400 hover:text-white dark:hover:text-black"><X size={12} /></button>
                     </div>
                 )}

                 <button 
                    onClick={() => setIsRequestModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-colors text-xs font-medium shadow-sm"
                >
                    <Plus size={14} /> {activeTab === 'all_requests' ? 'Issue Letter' : 'Request Letter'}
                </button>
             </div>
        </div>

        {/* Filters Panel */}
        {isFilterOpen && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl animate-in slide-in-from-top-2 fade-in">
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Status</label>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Type</label>
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                        >
                            <option value="All">All Types</option>
                            {letterTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <button 
                        onClick={() => { setFilterStatus('All'); setFilterType('All'); setSearchQuery(''); }}
                        className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors px-3 py-1.5 ml-auto"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm flex flex-col">
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                 <table className="w-full text-left border-collapse">
                     <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold sticky top-0 backdrop-blur-sm z-10">
                         <tr>
                             <th className="py-3 px-4 w-10 text-center">
                                 <button onClick={handleSelectAll} className="flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white">
                                     {selectedIds.size > 0 && selectedIds.size === filteredLetters.length ? <CheckSquare size={14} /> : <Square size={14} />}
                                 </button>
                             </th>
                             <th className="px-6 py-3">Letter Type</th>
                             <th className="px-6 py-3">Employee</th>
                             <th className="px-6 py-3 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors">
                                 <div className="flex items-center gap-1">Date Requested <ArrowUpDown size={10} /></div>
                             </th>
                             <th className="px-6 py-3">Purpose</th>
                             <th className="px-6 py-3">Status</th>
                             <th className="px-6 py-3 text-right">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-xs">
                         {filteredLetters.map(l => (
                             <tr 
                                key={l.id} 
                                onClick={() => setSelectedLetter(l)}
                                className={`group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${selectedIds.has(l.id) ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''}`}
                             >
                                 <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                     <button onClick={() => handleSelectOne(l.id)} className="flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white">
                                         {selectedIds.has(l.id) ? <CheckSquare size={14} className="text-black dark:text-white" /> : <Square size={14} />}
                                     </button>
                                 </td>
                                 <td className="px-6 py-4 font-medium text-black dark:text-white flex items-center gap-2">
                                     <FileText size={14} className="text-gray-400" /> {l.type}
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="flex items-center gap-2">
                                         <img src={l.avatarUrl} className="w-6 h-6 rounded-full border border-gray-100 dark:border-gray-700" />
                                         <span className="text-gray-700 dark:text-gray-300">{l.employeeName}</span>
                                     </div>
                                 </td>
                                 <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono">{l.dateRequested}</td>
                                 <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate" title={l.purpose}>{l.purpose}</td>
                                 <td className="px-6 py-4">
                                     <span className={`px-2 py-0.5 rounded text-[10px] border flex items-center gap-1 w-fit ${getStatusColor(l.status)}`}>
                                         {l.status === 'Approved' && <CheckCircle size={10} />}
                                         {l.status === 'Rejected' && <XCircle size={10} />}
                                         {l.status === 'Pending' && <Clock size={10} />}
                                         {l.status}
                                     </span>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                     <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                         <button 
                                            onClick={() => setPreviewLetter(l)}
                                            className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors" 
                                            title="Preview / Print"
                                         >
                                             {l.status === 'Approved' ? <Printer size={14} /> : <Eye size={14} />}
                                         </button>
                                         
                                         {activeTab === 'all_requests' && l.status === 'Pending' && (
                                            <>
                                                <button 
                                                    onClick={() => handleStatusChange(l.id, 'Approved')}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/20 rounded transition-colors" 
                                                    title="Approve"
                                                >
                                                    <Check size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => setSelectedLetter(l)} // Open drawer to reject with reason
                                                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded transition-colors" 
                                                    title="Reject"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                         )}
                                          
                                          {activeTab === 'my_requests' && l.status === 'Pending' && (
                                              <button 
                                                onClick={() => handleDelete(l.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                                              >
                                                  <Trash2 size={14} />
                                              </button>
                                          )}
                                     </div>
                                 </td>
                             </tr>
                         ))}
                         {filteredLetters.length === 0 && (
                             <tr>
                                 <td colSpan={7} className="py-12 text-center text-gray-400">No letters found.</td>
                             </tr>
                         )}
                     </tbody>
                 </table>
             </div>
        </div>

    </div>

    <LetterRequestModal 
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSave={handleRequestLetter}
        employees={MOCK_EMPLOYEES}
        isAdmin={activeTab === 'all_requests'}
    />

    <LetterPreviewModal 
        isOpen={!!previewLetter}
        onClose={() => setPreviewLetter(null)}
        letter={previewLetter}
    />

    <LetterDetailDrawer 
        letter={selectedLetter}
        onClose={() => setSelectedLetter(null)}
        onApprove={(id) => handleStatusChange(id, 'Approved')}
        onReject={handleStatusChange}
        onDelete={handleDelete}
        onPrint={(l) => { setSelectedLetter(null); setPreviewLetter(l); }}
        currentUserId={currentUserId}
    />
    </>
  );
};

export default HRLettersList;
