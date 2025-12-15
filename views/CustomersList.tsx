
import React, { useState, useRef } from 'react';
import { Search, Filter, Plus, List, LayoutGrid, Download, Upload, ArrowUpDown, X, FileDown } from 'lucide-react';
import { Customer } from '../types';
import CustomerRow from '../components/customers/CustomerRow';
import CustomerCard from '../components/customers/CustomerCard';
import AddCustomerModal from '../components/customers/AddCustomerModal';

interface CustomersListProps {
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomersList: React.FC<CustomersListProps> = ({ customers, setCustomers }) => {
  // State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'totalSpent' | 'lastOrderDate'>('lastOrderDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  
  // File Import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleAddCustomer = (customerData: Omit<Customer, 'id'>) => {
      if (editingCustomer) {
          // Edit Mode
          setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...customerData } : c));
          setEditingCustomer(undefined);
      } else {
          // Create Mode
          const newCustomer: Customer = {
              ...customerData,
              id: `c-${Date.now()}`
          };
          setCustomers(prev => [newCustomer, ...prev]);
      }
  };

  const handleDeleteCustomer = (id: string) => {
      if (confirm('Are you sure you want to delete this customer?')) {
          setCustomers(prev => prev.filter(c => c.id !== id));
      }
  };

  const handleEditClick = (customer: Customer) => {
      setEditingCustomer(customer);
      setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
      setIsAddModalOpen(false);
      setEditingCustomer(undefined);
  };

  const handleExportCSV = () => {
      const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Status', 'Total Spent', 'Last Order'];
      const csvContent = [
          headers.join(','),
          ...filteredCustomers.map(c => [
              c.id, `"${c.name}"`, `"${c.company}"`, c.email, c.phone, c.status, c.totalSpent, c.lastOrderDate
          ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customers_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          alert("Import simulation: Parsed 12 new customers from CSV.");
      }
  };

  // --- Logic ---

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
      let res = 0;
      if (sortBy === 'name') res = a.name.localeCompare(b.name);
      else if (sortBy === 'totalSpent') res = a.totalSpent - b.totalSpent;
      else if (sortBy === 'lastOrderDate') res = new Date(a.lastOrderDate).getTime() - new Date(b.lastOrderDate).getTime();
      return sortOrder === 'asc' ? res : -res;
  });

  const activeFiltersCount = statusFilter !== 'All' ? 1 : 0;
  const clearFilters = () => {
      setStatusFilter('All');
      setSearchQuery('');
  };

  return (
    <>
        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 gap-4">
            <div>
            <h1 className="text-2xl font-light text-black dark:text-white mb-1">Customers</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                {filteredCustomers.length} active accounts managed.
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
                        <List size={14} />
                    </button>
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        title="Grid View"
                    >
                        <LayoutGrid size={14} />
                    </button>
                </div>

                {/* Sort */}
                <div className="hidden md:flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 bg-white dark:bg-white/5 mr-2">
                    <span className="text-[10px] uppercase text-gray-400 font-bold mr-1">Sort</span>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="text-xs bg-transparent border-none focus:ring-0 cursor-pointer text-black dark:text-white font-medium focus:outline-none"
                    >
                        <option value="lastOrderDate">Last Order</option>
                        <option value="name">Name</option>
                        <option value="totalSpent">Total Spent</option>
                    </select>
                    <button 
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="ml-1 p-0.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-500"
                    >
                        <ArrowUpDown size={12} className={sortOrder === 'asc' ? '' : 'rotate-180'} />
                    </button>
                </div>

                {/* Search */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search customers..." 
                        className="w-40 lg:w-56 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded pl-9 pr-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:ring-0 transition-all"
                    />
                </div>

                {/* Filter Button */}
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

                {/* Import / Export */}
                <div className="hidden lg:flex gap-1 ml-1">
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".csv" />
                    <button onClick={handleImportClick} className="p-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors" title="Import CSV">
                        <Upload size={14} />
                    </button>
                    <button onClick={handleExportCSV} className="p-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors" title="Export CSV">
                        <Download size={14} />
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1"></div>

                {/* Add Button */}
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm ml-1"
                >
                    <Plus size={14} />
                    <span className="hidden lg:inline">Add Customer</span>
                </button>
            </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex flex-wrap items-end gap-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Status</label>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                        <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors px-3">Clear All</button>
                        <button onClick={() => setIsFilterOpen(false)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500"><X size={14} /></button>
                    </div>
                </div>
            </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden fade-in">
            {sortedCustomers.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4">
                        <Search size={24} className="opacity-20" />
                    </div>
                    <p className="text-sm">No customers found.</p>
                    <button onClick={clearFilters} className="text-blue-600 dark:text-blue-400 hover:underline text-xs mt-2">Clear Filters</button>
                </div>
            ) : viewMode === 'list' ? (
                /* List View */
                <div className="h-full overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 uppercase tracking-widest font-medium sticky top-0 bg-white dark:bg-[#18181b] z-10">
                        <th className="py-3 px-4 font-medium">Customer</th>
                        <th className="py-3 px-4 font-medium">Contact</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium text-right">Total Spent</th>
                        <th className="py-3 px-4 font-medium text-right">Last Order</th>
                        <th className="py-3 px-4 font-medium w-24 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="text-xs">
                        {sortedCustomers.map((customer) => (
                            <CustomerRow 
                                key={customer.id} 
                                customer={customer} 
                                onEdit={handleEditClick}
                                onDelete={handleDeleteCustomer}
                            />
                        ))}
                    </tbody>
                </table>
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar h-full pb-10">
                    {sortedCustomers.map((customer) => (
                        <CustomerCard 
                            key={customer.id} 
                            customer={customer} 
                            onEdit={handleEditClick}
                            onDelete={handleDeleteCustomer}
                        />
                    ))}
                </div>
            )}
        </div>
        </div>

        <AddCustomerModal 
            isOpen={isAddModalOpen}
            onClose={handleModalClose}
            onSave={handleAddCustomer}
            initialData={editingCustomer}
        />
    </>
  );
};

export default CustomersList;
