
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, List, LayoutGrid, 
  Download, ArrowUpDown, X, Star, Users, CheckCircle, Clock, Ban, Trash2, Edit, TrendingUp, Calendar, ArrowRight
} from 'lucide-react';
import { Candidate, CandidateStage, Interview } from '../types';
import CandidateCard from '../components/recruitment/CandidateCard';
import AddCandidateModal from '../components/recruitment/AddCandidateModal';
import CandidateProfileDrawer from '../components/recruitment/CandidateProfileDrawer';

interface RecruitmentBoardProps {
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
}

const RecruitmentBoard: React.FC<RecruitmentBoardProps> = ({ candidates, setCandidates }) => {
  // --- View State ---
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  // --- Filter & Sort State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterRole, setFilterRole] = useState('All');
  const [filterRating, setFilterRating] = useState(0); 
  const [sortConfig, setSortConfig] = useState<{ key: keyof Candidate; direction: 'asc' | 'desc' }>({ key: 'appliedDate', direction: 'desc' });

  // --- Selection State (List View) ---
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // --- Drag & Drop State ---
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);

  const stages = Object.values(CandidateStage);

  // --- Derived Data ---
  const uniqueRoles = useMemo(() => Array.from(new Set(candidates.map(c => c.role))), [candidates]);

  // --- Handlers: CRUD ---

  const handleCreateCandidate = (candidateData: Omit<Candidate, 'id' | 'appliedDate' | 'avatarUrl' | 'interviews'>) => {
      const newCandidate: Candidate = {
        ...candidateData,
        id: `CAN-${Date.now()}`,
        appliedDate: new Date().toISOString().split('T')[0],
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateData.name)}&background=random`,
        interviews: []
      };
      setCandidates(prev => [newCandidate, ...prev]);
  };

  const handleUpdateCandidate = (updatedCandidate: Candidate) => {
      setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
      setSelectedCandidate(updatedCandidate); // Keep drawer in sync
  };

  const handleDelete = (id: string) => {
      setCandidates(prev => prev.filter(c => c.id !== id));
      if (selectedCandidate?.id === id) setSelectedCandidate(null);
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
  };

  // --- Handlers: Bulk Actions ---
  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Delete ${selectedIds.size} selected candidates?`)) {
      setCandidates(prev => prev.filter(c => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredCandidates.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCandidates.map(c => c.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // --- Handlers: Drag & Drop ---
  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedCandidateId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, targetStage: CandidateStage) => {
    e.preventDefault();
    if (!draggedCandidateId) return;

    setCandidates(prev => prev.map(c => 
      c.id === draggedCandidateId ? { ...c, stage: targetStage } : c
    ));
    setDraggedCandidateId(null);
  };

  // --- Logic: Filter & Sort ---
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = filterRole === 'All' || c.role === filterRole;
      const matchesRating = c.rating >= filterRating;

      return matchesSearch && matchesRole && matchesRating;
    });
  }, [candidates, searchQuery, filterRole, filterRating]);

  const sortedCandidates = useMemo(() => {
    return [...filteredCandidates].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal === undefined || bVal === undefined) return 0;
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredCandidates, sortConfig]);

  // --- Logic: Metrics ---
  const metrics = useMemo(() => {
    const total = candidates.length;
    const active = candidates.filter(c => c.stage !== CandidateStage.HIRED && c.stage !== CandidateStage.REJECTED).length;
    const hired = candidates.filter(c => c.stage === CandidateStage.HIRED).length;
    const interviewsScheduled = candidates.reduce((sum, c) => sum + (c.interviews?.filter(i => i.status === 'Scheduled').length || 0), 0);
    
    return { total, active, hired, interviewsScheduled };
  }, [candidates]);

  const handleSort = (key: keyof Candidate) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <>
      <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
        
        {/* --- Header & Metrics --- */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl font-light text-black dark:text-white mb-1">Recruitment & ATS</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                Track applicants, manage interviews, and hire top talent.
              </p>
            </div>
            
            {/* KPI Cards */}
            <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2">
                <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl min-w-[160px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1"><Users size={10} /> Active Pipeline</span>
                    <div className="text-2xl font-light text-black dark:text-white mt-1">{metrics.active}</div>
                </div>
                <div className="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl min-w-[160px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1"><Calendar size={10} /> Interviews</span>
                    <div className="text-2xl font-light text-blue-600 dark:text-blue-400 mt-1">{metrics.interviewsScheduled}</div>
                </div>
                <div className="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl min-w-[160px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1"><CheckCircle size={10} /> Hired (YTD)</span>
                    <div className="text-2xl font-light text-green-600 dark:text-green-400 mt-1">{metrics.hired}</div>
                </div>
                <div className="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl min-w-[160px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1"><TrendingUp size={10} /> Time to Hire</span>
                    <div className="text-2xl font-light text-black dark:text-white mt-1">18d</div>
                </div>
            </div>
          </div>

          {/* --- Toolbar --- */}
          <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
            
            <div className="flex gap-2 w-full md:w-auto">
               <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                  <button onClick={() => setViewMode('board')} className={`p-1.5 rounded-md transition-all ${viewMode === 'board' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}><LayoutGrid size={14} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}><List size={14} /></button>
               </div>

               <div className="relative group flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                      type="text" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      placeholder="Search candidates..." 
                      className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20" 
                  />
               </div>

               <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors text-xs font-medium ${isFilterOpen ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
               >
                  <Filter size={14} /> <span className="hidden sm:inline">Filter</span>
               </button>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
               {selectedIds.size > 0 && viewMode === 'list' ? (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-300">
                      <span className="text-[10px] font-medium bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-600 dark:text-gray-300">{selectedIds.size} Selected</span>
                      <button onClick={handleBulkDelete} className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 text-xs font-medium"><Trash2 size={12} /> Delete</button>
                  </div>
               ) : (
                  <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600" title="Export CSV"><Download size={16} /></button>
               )}
               
               <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm ml-2 flex-1 md:flex-none justify-center">
                  <Plus size={14} /><span className="inline">Add Candidate</span>
               </button>
            </div>
          </div>
        </div>

        {/* --- Filter Panel --- */}
        {isFilterOpen && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex flex-wrap items-end gap-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Role</label>
                        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white">
                            <option value="All">All Roles</option>
                            {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Min Rating</label>
                        <div className="flex items-center gap-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-2 py-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => setFilterRating(star === filterRating ? 0 : star)}>
                                    <Star size={14} className={star <= filterRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <button onClick={() => { setSearchQuery(''); setFilterRole('All'); setFilterRating(0); }} className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors px-3">Clear All</button>
                        <button onClick={() => setIsFilterOpen(false)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400"><X size={14} /></button>
                    </div>
                </div>
            </div>
        )}

        {/* --- Content Area --- */}
        <div className="flex-1 overflow-hidden fade-in">
          {viewMode === 'board' ? (
            /* Kanban Board View */
            <div className="h-full overflow-x-auto custom-scrollbar pb-4">
              <div className="flex gap-6 h-full min-w-max">
                {stages.map((stage) => {
                  const stageCandidates = filteredCandidates.filter(c => c.stage === stage);
                  return (
                    <div key={stage} className="w-80 flex flex-col h-full bg-gray-50/50 dark:bg-white/5 rounded-xl border border-gray-200/60 dark:border-gray-800/60 p-2" onDragOver={onDragOver} onDrop={(e) => onDrop(e, stage)}>
                      <div className="flex justify-between items-center px-3 py-3 mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{stage}</h3>
                          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-white/10 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700 shadow-sm">{stageCandidates.length}</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2.5 overflow-y-auto custom-scrollbar px-1 pb-20">
                        {stageCandidates.map(candidate => (
                          <div key={candidate.id} onClick={() => setSelectedCandidate(candidate)}>
                            <CandidateCard 
                                candidate={candidate}
                                isDragging={draggedCandidateId === candidate.id}
                                onDragStart={onDragStart}
                                onEdit={(c) => setSelectedCandidate(c)}
                                onDelete={(id) => { if(confirm('Delete candidate?')) handleDelete(id); }}
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
            /* List View */
            <div className="h-full overflow-y-auto custom-scrollbar bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold sticky top-0 z-10 backdrop-blur-sm">
                        <th className="py-3 px-4 w-10 text-center">
                            <button onClick={handleSelectAll} className="text-gray-400 hover:text-black dark:hover:text-white">
                                {selectedIds.size > 0 && selectedIds.size === filteredCandidates.length ? <CheckCircle size={14} className="text-black dark:text-white" /> : <div className="w-3.5 h-3.5 border border-gray-300 dark:border-gray-600 rounded mx-auto" />}
                            </button>
                        </th>
                        <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('stage')}>Stage</th>
                        <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('rating')}>Rating</th>
                        <th className="py-3 px-4 text-right">Applied</th>
                        <th className="py-3 px-4 w-20"></th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-gray-50 dark:divide-gray-800">
                    {sortedCandidates.map(c => (
                        <tr key={c.id} className={`group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${selectedIds.has(c.id) ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''}`} onClick={() => setSelectedCandidate(c)}>
                            <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => handleSelectOne(c.id)} className="text-gray-400 hover:text-black dark:hover:text-white">
                                    {selectedIds.has(c.id) ? <CheckCircle size={14} className="text-blue-600 dark:text-blue-400" /> : <div className="w-3.5 h-3.5 border border-gray-300 dark:border-gray-600 rounded mx-auto" />}
                                </button>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                    <img src={c.avatarUrl} className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700" />
                                    <div>
                                        <div className="font-medium text-black dark:text-white">{c.name}</div>
                                        <div className="text-[10px] text-gray-400">{c.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{c.role}</td>
                            <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-medium border bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">{c.stage}</span></td>
                            <td className="py-3 px-4"><div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= c.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'} />)}</div></td>
                            <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-400 font-mono">{c.appliedDate}</td>
                            <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setSelectedCandidate(c)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-gray-500 dark:text-gray-400"><Edit size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}
        </div>
      </div>

      <AddCandidateModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleCreateCandidate} />
      <CandidateProfileDrawer candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} onUpdate={handleUpdateCandidate} onDelete={handleDelete} />
    </>
  );
};

export default RecruitmentBoard;
