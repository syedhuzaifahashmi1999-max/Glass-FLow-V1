
import React, { useState } from 'react';
import { Search, Filter, Plus, Download, FileText, CheckCircle, Clock, AlertCircle, ArrowUpDown, Trash2, X, MoreHorizontal, ChevronRight, Eye } from 'lucide-react';
import { Invoice, Customer, Product } from '../types';
import AddInvoiceModal from '../components/invoices/AddInvoiceModal';

interface InvoicesListProps {
    invoices: Invoice[];
    setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
    customers: Customer[];
    products: Product[];
    onSelectInvoice: (id: string) => void;
    onPaymentRecorded?: (invoice: Invoice) => void;
    currency?: string;
}

const InvoicesList: React.FC<InvoicesListProps> = ({ invoices, setInvoices, customers, products, onSelectInvoice, onPaymentRecorded, currency = 'USD' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'amount' | 'dueDate' | 'issueDate'>('issueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- Handlers ---

  const handleAddInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
      const newInvoice: Invoice = {
          ...invoiceData,
          id: `INV-${Date.now().toString().slice(-6)}`
      };
      setInvoices(prev => [newInvoice, ...prev]);
  };

  const handleDeleteInvoice = (id: string) => {
      if (confirm('Are you sure you want to delete this invoice?')) {
          setInvoices(prev => prev.filter(inv => inv.id !== id));
      }
  };

  const handleMarkPaid = (id: string) => {
      const inv = invoices.find(i => i.id === id);
      if (inv && inv.status !== 'Paid') {
          // Confirm payment recording
          if (confirm(`Mark Invoice ${id} as PAID and record transaction in Bank?`)) {
              setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
              if (onPaymentRecorded) {
                  onPaymentRecorded(inv);
              }
          }
      }
  };

  const handleExportCSV = () => {
      const headers = ['ID', 'Customer', 'Amount', 'Issue Date', 'Due Date', 'Status', 'Product'];
      const csvContent = [
          headers.join(','),
          ...filteredInvoices.map(inv => [
              inv.id, `"${inv.customerName}"`, inv.amount, inv.issueDate, inv.dueDate, inv.status, `"${inv.relatedProduct || ''}"`
          ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoices_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // --- Helpers ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);
  };

  // --- Stats ---
  const totalOutstanding = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);

  // --- Filtering & Sorting ---

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
      let res = 0;
      if (sortBy === 'amount') res = a.amount - b.amount;
      else if (sortBy === 'dueDate') res = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      else if (sortBy === 'issueDate') res = new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
      return sortOrder === 'asc' ? res : -res;
  });

  const getStatusStyle = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid': return 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20';
      case 'Pending': return 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20';
      case 'Overdue': return 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20';
      default: return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b]">
      
      {/* Header & Stats */}
      <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Invoices</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                    Track billings, payments, and outstanding balances.
                </p>
            </div>
            {/* KPI Cards */}
            <div className="flex gap-4 overflow-x-auto pb-1">
                <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 min-w-[140px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Outstanding</span>
                    <div className="text-lg font-light text-black dark:text-white mt-0.5">{formatCurrency(totalOutstanding)}</div>
                </div>
                <div className="px-4 py-2 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20 min-w-[140px]">
                    <span className="text-[10px] uppercase text-red-400 font-semibold tracking-wider">Overdue</span>
                    <div className="text-lg font-light text-red-600 dark:text-red-400 mt-0.5">{formatCurrency(totalOverdue)}</div>
                </div>
                <div className="px-4 py-2 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-100 dark:border-green-500/20 min-w-[140px]">
                    <span className="text-[10px] uppercase text-green-600/60 dark:text-green-400/60 font-semibold tracking-wider">Paid</span>
                    <div className="text-lg font-light text-green-700 dark:text-green-400 mt-0.5">{formatCurrency(totalPaid)}</div>
                </div>
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
                        placeholder="Search invoices..." 
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

                    <div className="hidden md:flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-white/5">
                        <span className="text-[10px] uppercase text-gray-400 font-bold mr-1">Sort</span>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="text-xs bg-transparent border-none focus:ring-0 cursor-pointer text-black dark:text-white font-medium focus:outline-none"
                        >
                            <option value="issueDate">Issue Date</option>
                            <option value="dueDate">Due Date</option>
                            <option value="amount">Amount</option>
                        </select>
                        <button 
                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            className="ml-1 p-0.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-500"
                        >
                            <ArrowUpDown size={12} className={sortOrder === 'asc' ? '' : 'rotate-180'} />
                        </button>
                    </div>
                </div>

                <div className="md:ml-auto flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
                    <button 
                        onClick={handleExportCSV}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        title="Export CSV"
                    >
                        <Download size={16} strokeWidth={1.5} />
                    </button>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm"
                    >
                        <Plus size={14} />
                        <span className="inline">Create Invoice</span>
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
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
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
                <th className="py-3 px-6 font-medium w-32">Invoice ID</th>
                <th className="py-3 px-4 font-medium">Client</th>
                <th className="py-3 px-4 font-medium">Dates</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Items</th>
                <th className="py-3 px-6 font-medium text-right">Amount</th>
                <th className="py-3 px-6 font-medium w-24 text-right"></th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {sortedInvoices.length > 0 ? sortedInvoices.map((inv) => {
                  const today = new Date();
                  const due = new Date(inv.dueDate);
                  const isOverdue = inv.status !== 'Paid' && due < today;
                  const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
                  
                  return (
                    <tr 
                        key={inv.id} 
                        onClick={() => onSelectInvoice(inv.id)}
                        className="group border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-black dark:text-white font-mono font-medium">
                           <FileText size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                           {inv.id}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                            <span className="text-black dark:text-white font-medium">{inv.customerName}</span>
                            <span className="text-[10px] text-gray-400">{inv.relatedProduct}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                         <div className="flex flex-col gap-0.5">
                             <div className="text-gray-500 dark:text-gray-400">Issued: {inv.issueDate}</div>
                             <div className={`text-[10px] ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                                 {inv.status === 'Paid' ? 'Paid' : isOverdue ? `Overdue by ${Math.abs(daysLeft)} days` : `Due in ${daysLeft} days`}
                             </div>
                         </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium ${getStatusStyle(inv.status)}`}>
                          {inv.status === 'Paid' && <CheckCircle size={10} />}
                          {inv.status === 'Pending' && <Clock size={10} />}
                          {inv.status === 'Overdue' && <AlertCircle size={10} />}
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-500 dark:text-gray-400">
                          {inv.items?.length || 0} items
                      </td>
                      <td className="py-4 px-6 text-black dark:text-white text-right font-mono font-medium text-sm">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            {inv.status !== 'Paid' && (
                                <button 
                                    onClick={() => handleMarkPaid(inv.id)}
                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors"
                                    title="Mark as Paid"
                                >
                                    <CheckCircle size={14} />
                                </button>
                            )}
                            <button 
                                onClick={() => handleDeleteInvoice(inv.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" 
                                title="Delete Invoice"
                            >
                                <Trash2 size={14} />
                            </button>
                            <button className="p-2 text-gray-300 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors">
                                <ChevronRight size={14} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  );
              }) : (
                  <tr>
                      <td colSpan={7} className="py-16 text-center text-gray-400 text-sm">No invoices found matching your criteria.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5 text-[10px] text-gray-400 flex justify-between items-center rounded-b-xl">
            <span>Showing {sortedInvoices.length} of {invoices.length} invoices</span>
            <div className="flex gap-2">
                <button className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-black/20 disabled:opacity-50 text-black dark:text-white" disabled>Previous</button>
                <button className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-black/20 disabled:opacity-50 text-black dark:text-white" disabled>Next</button>
            </div>
        </div>
      </div>
    </div>

    <AddInvoiceModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddInvoice}
        customers={customers}
        products={products}
    />
    </>
  );
};

export default InvoicesList;
