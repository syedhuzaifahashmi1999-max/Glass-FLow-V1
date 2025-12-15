
import React, { useState, useRef } from 'react';
import { Search, Filter, LayoutGrid, List as ListIcon, Plus, MoreHorizontal, Download, Upload, X, FileDown } from 'lucide-react';
import { Lead, LeadStage } from '../types';
import AddLeadModal from '../components/leads/AddLeadModal';
import LeadRow from '../components/leads/LeadRow';
import LeadBoardCard from '../components/leads/LeadBoardCard';

interface LeadsListProps {
    leads: Lead[];
    setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
    onConvertLead: (lead: Lead) => void;
    currency?: string;
}

const LeadsList: React.FC<LeadsListProps> = ({ leads, setLeads, onConvertLead, currency = 'USD' }) => {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStage, setFilterStage] = useState<string>('All');
  const [filterMinValue, setFilterMinValue] = useState<string>('');

  // Import Menu State
  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false);

  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stages = Object.values(LeadStage);

  // --- Filtering Logic ---
  const filteredLeads = leads.filter(lead => {
    // 1. Search Query
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Stage Filter
    const matchesStage = filterStage === 'All' || lead.stage === filterStage;

    // 3. Value Filter
    const val = parseFloat(filterMinValue);
    const matchesValue = !filterMinValue || (!isNaN(val) && lead.value >= val);

    return matchesSearch && matchesStage && matchesValue;
  });

  // --- Import / Export Handlers ---
  const handleExport = () => {
    // Simple CSV Export
    const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Value', 'Stage', 'Last Active'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.id,
        `"${lead.name}"`,
        `"${lead.company}"`,
        lead.email,
        lead.phone || '',
        lead.value,
        lead.stage,
        lead.lastActive
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTemplate = () => {
    // Template CSV
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Value', 'Stage', 'Source', 'Priority'];
    const sampleRow = ['John Doe', 'Acme Corp', 'john@acme.com', '123-456-7890', '5000', 'New', 'Website', 'Medium'];
    const csvContent = [
      headers.join(','),
      sampleRow.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsImportMenuOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock Import: In a real app, parse CSV here
      alert(`Simulated import of ${file.name}. (Backend required for persistent data)`);
      // Reset input
      e.target.value = '';
    }
  };

  // --- Drag & Drop Handlers ---
  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, targetStage: LeadStage) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    setLeads(prev => prev.map(lead => 
      lead.id === draggedLeadId ? { ...lead, stage: targetStage } : lead
    ));
    setDraggedLeadId(null);
  };

  const handleAddLead = (leadData: Omit<Lead, 'id' | 'lastActive' | 'avatarUrl'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Math.floor(Math.random() * 10000).toString(),
      lastActive: 'Just now',
      avatarUrl: `https://picsum.photos/100/100?random=${Math.floor(Math.random() * 1000)}`
    };
    
    setLeads(prev => [newLead, ...prev]);
  };

  const clearFilters = () => {
    setFilterStage('All');
    setFilterMinValue('');
    setSearchQuery('');
  };

  const activeFiltersCount = (filterStage !== 'All' ? 1 : 0) + (filterMinValue ? 1 : 0);

  return (
    <>
      <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 gap-4">
          <div>
            <h1 className="text-2xl font-light text-black dark:text-white mb-1">Leads</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
              {filteredLeads.length} active leads in your network.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
             {/* View Toggle */}
             <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 mr-2">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                title="List View"
              >
                <ListIcon size={14} />
              </button>
              <button 
                onClick={() => setViewMode('board')}
                className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'board' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                title="Board View"
              >
                <LayoutGrid size={14} />
              </button>
             </div>

             {/* Search */}
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search leads..." 
                  className="w-40 lg:w-56 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded pl-9 pr-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:ring-0 transition-all"
                />
              </div>

              {/* Filter Toggle */}
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors text-xs font-medium ${isFilterOpen || activeFiltersCount > 0 ? 'bg-gray-50 dark:bg-white/10 border-gray-300 dark:border-gray-600 text-black dark:text-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
              >
                <Filter size={14} />
                <span className="hidden sm:inline">Filter</span>
                {activeFiltersCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-black dark:bg-white text-white dark:text-black text-[9px]">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Import / Export Buttons */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv" 
                onChange={handleFileChange} 
              />
              
              {/* Import Menu */}
              <div className="relative">
                <button 
                  onClick={() => setIsImportMenuOpen(!isImportMenuOpen)}
                  className={`p-1.5 rounded border transition-colors ${isImportMenuOpen ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                  title="Import Options"
                >
                  <Upload size={14} />
                </button>
                
                {isImportMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsImportMenuOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#18181b] rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-20 py-1 flex flex-col animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                      <button 
                        onClick={() => {
                          fileInputRef.current?.click();
                          setIsImportMenuOpen(false);
                        }}
                        className="text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors"
                      >
                        <Upload size={12} />
                        Upload CSV
                      </button>
                      <button 
                        onClick={handleDownloadTemplate}
                        className="text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors border-t border-gray-50 dark:border-gray-800"
                      >
                        <FileDown size={12} />
                        Download Template
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button 
                onClick={handleExport}
                className="p-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                title="Export CSV"
              >
                <Download size={14} />
              </button>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1"></div>

              {/* New Lead */}
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm ml-1"
              >
                <Plus size={14} />
                <span className="hidden lg:inline">New Lead</span>
              </button>
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
              
              {/* Filter: Stage */}
              <div className="w-full md:w-auto">
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Stage</label>
                <select 
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="w-full md:w-40 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20"
                >
                  <option value="All">All Stages</option>
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              {/* Filter: Min Value */}
              <div className="w-full md:w-auto">
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Min Deal Value</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                  <input 
                    type="number"
                    value={filterMinValue}
                    onChange={(e) => setFilterMinValue(e.target.value)}
                    placeholder="0.00"
                    className="w-full md:w-32 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded pl-6 pr-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 md:ml-auto mt-2 md:mt-0">
                <button 
                  onClick={clearFilters}
                  className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors px-3 py-1.5"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'list' ? (
            /* List View */
            <div className="h-full overflow-y-auto custom-scrollbar fade-in">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 uppercase tracking-widest font-medium sticky top-0 bg-white dark:bg-[#18181b] z-10">
                    <th className="py-3 px-4 font-medium w-20">ID</th>
                    <th className="py-3 px-4 font-medium">Name</th>
                    <th className="py-3 px-4 font-medium">Company</th>
                    <th className="py-3 px-4 font-medium">Stage</th>
                    <th className="py-3 px-4 font-medium text-right">Value</th>
                    <th className="py-3 px-4 font-medium text-right">Last Active</th>
                    <th className="py-3 px-4 font-medium text-right w-40">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {filteredLeads.map((lead) => (
                    <LeadRow 
                      key={lead.id} 
                      lead={lead}
                      onConvert={onConvertLead}
                      currency={currency}
                    />
                  ))}
                </tbody>
              </table>
              {filteredLeads.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-sm font-light">
                   <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-3">
                      <Search size={20} className="opacity-20" />
                   </div>
                   <p>No leads found matching your criteria.</p>
                   <button onClick={clearFilters} className="text-blue-600 dark:text-blue-400 hover:underline mt-2 text-xs">Clear Filters</button>
                </div>
              )}
            </div>
          ) : (
            /* Board View */
            <div className="h-full overflow-x-auto custom-scrollbar pb-4 fade-in">
              <div className="flex gap-6 h-full min-w-max">
                {stages.map((stage) => {
                  const stageLeads = filteredLeads.filter(l => l.stage === stage);

                  return (
                    <div 
                      key={stage}
                      className="w-72 flex flex-col h-full"
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, stage)}
                    >
                      {/* Column Header */}
                      <div className="flex justify-between items-center mb-4 px-1 group">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stage}</h3>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded">{stageLeads.length}</span>
                        </div>
                        <MoreHorizontal size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-black dark:hover:text-white transition-all" />
                      </div>

                      {/* Drop Zone */}
                      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pb-20">
                        {stageLeads.map((lead) => (
                          <LeadBoardCard
                            key={lead.id}
                            lead={lead}
                            isDragging={draggedLeadId === lead.id}
                            onDragStart={onDragStart}
                            onConvert={onConvertLead}
                            currency={currency}
                          />
                        ))}
                        
                        {stageLeads.length === 0 && (
                           <div className="h-12 border border-dashed border-gray-200 dark:border-gray-800 rounded flex items-center justify-center opacity-50">
                              <span className="text-[10px] text-gray-400">Drag to {stage}</span>
                           </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <AddLeadModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddLead}
      />
    </>
  );
};

export default LeadsList;
