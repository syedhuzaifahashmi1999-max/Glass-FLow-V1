
import React, { useState } from 'react';
import { Search, Filter, Plus, FileText, CheckCircle, Clock, AlertCircle, ArrowUpDown, Trash2, ChevronRight, X } from 'lucide-react';
import { Quotation, Customer } from '../types';
import AddQuotationModal from '../components/quotations/AddQuotationModal';

interface QuotationsListProps {
    quotations: Quotation[];
    setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>;
    customers: Customer[];
    onSelectQuotation: (id: string) => void;
}

const QuotationsList: React.FC<QuotationsListProps> = ({ quotations, setQuotations, customers, onSelectQuotation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- Handlers ---

  const handleAddQuotation = (quotationData: Omit<Quotation, 'id'>) => {
      const newQuotation: Quotation = {
          ...quotationData,
          id: `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      };
      setQuotations(prev => [newQuotation, ...prev]);
  };

  const handleDeleteQuotation = (id: string) => {
      if (confirm('Are you sure you want to delete this quotation?')) {
          setQuotations(prev => prev.filter(q => q.id !== id));
      }
  };

  // --- Filtering ---

  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = 
        q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || q.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: Quotation['status']) => {
    switch (status) {
      case 'Accepted': return 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20';
      case 'Sent': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
      case 'Draft': return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
      case 'Rejected': return 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20';
      default: return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b]">
      
      {/* Header */}
      <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Quotations</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                    Manage price quotes and estimates.
                </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="relative group w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search quotations..." 
                        className="w-full md:w-64 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:ring-0 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-xs font-medium ${isFilterOpen ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                        <Filter size={14} /> Filter
                    </button>
                </div>

                <div className="md:ml-auto flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm"
                    >
                        <Plus size={14} />
                        <span className="inline">Create Quote</span>
                    </button>
                </div>
          </div>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="flex items-center gap-4">
                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Status</label>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <button onClick={() => setFilterStatus('All')} className="text-xs text-gray-400 hover:text-black dark:hover:text-white mt-5">Clear</button>
            </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden fade-in bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 uppercase tracking-widest font-medium sticky top-0 bg-gray-50/90 dark:bg-white/5 backdrop-blur z-10 shadow-sm">
                <th className="py-3 px-6 font-medium w-32">Quote ID</th>
                <th className="py-3 px-4 font-medium">Customer</th>
                <th className="py-3 px-4 font-medium">Dates</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-6 font-medium text-right">Amount</th>
                <th className="py-3 px-6 font-medium w-24 text-right"></th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {filteredQuotations.length > 0 ? filteredQuotations.map((q) => (
                    <tr 
                        key={q.id} 
                        onClick={() => onSelectQuotation(q.id)}
                        className="group border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-black dark:text-white font-mono font-medium">
                           <FileText size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                           {q.id}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                            <span className="text-black dark:text-white font-medium">{q.customerName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                         <div className="flex flex-col gap-0.5">
                             <div className="text-gray-500 dark:text-gray-400">Issued: {q.issueDate}</div>
                             <div className="text-[10px] text-gray-400">Expires: {q.expiryDate}</div>
                         </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium ${getStatusStyle(q.status)}`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-black dark:text-white text-right font-mono font-medium text-sm">
                        ${q.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <button 
                                onClick={() => handleDeleteQuotation(q.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" 
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                            <button className="p-2 text-gray-300 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors">
                                <ChevronRight size={14} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                  <tr>
                      <td colSpan={6} className="py-16 text-center text-gray-400 text-sm">No quotations found.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <AddQuotationModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddQuotation}
        customers={customers}
    />
    </>
  );
};

export default QuotationsList;
