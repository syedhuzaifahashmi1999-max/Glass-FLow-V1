
import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Download, ShoppingBag, Truck, AlertCircle, Calendar, CheckSquare, Square, Trash2, CheckCircle, ArrowUpDown, X } from 'lucide-react';
import { PurchaseOrder, Product, Employee, Asset } from '../types';
import { MOCK_VENDORS } from '../constants';
import PurchaseOrderRow from '../components/purchases/PurchaseOrderRow';
import AddPurchaseModal from '../components/purchases/AddPurchaseModal';
import PurchaseOrderDrawer from '../components/purchases/PurchaseOrderDrawer';
import AddAssetModal from '../components/assets/AddAssetModal';

interface PurchasesListProps {
  purchaseOrders: PurchaseOrder[];
  setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  products: Product[];
  employees: Employee[];
  onAddAsset: (asset: Omit<Asset, 'id'>) => void;
}

const PurchasesList: React.FC<PurchasesListProps> = ({ purchaseOrders, setPurchaseOrders, products, employees, onAddAsset }) => {
  // --- UI State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Drawer / Edit
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | undefined>(undefined);

  // Asset Creation
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [assetDraft, setAssetDraft] = useState<Partial<Asset> | undefined>(undefined);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterVendor, setFilterVendor] = useState<string>('All');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({ start: '', end: '' });

  // Sort
  const [sortConfig, setSortConfig] = useState<{ key: keyof PurchaseOrder | 'amount'; direction: 'asc' | 'desc' }>({ key: 'orderDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Metrics ---
  const metrics = useMemo(() => {
      const totalSpend = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
      const openOrders = purchaseOrders.filter(po => po.status === 'Ordered').length;
      const lateOrders = purchaseOrders.filter(po => po.status === 'Ordered' && po.expectedDate && new Date(po.expectedDate) < new Date()).length;
      return { totalSpend, openOrders, lateOrders };
  }, [purchaseOrders]);

  // --- Filtering Logic ---
  const filteredOrders = useMemo(() => {
      return purchaseOrders.filter(po => {
          const matchesSearch = 
            po.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            po.id.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesStatus = filterStatus === 'All' || po.status === filterStatus;
          const matchesVendor = filterVendor === 'All' || po.vendorId === filterVendor;
          
          let matchesDate = true;
          if (dateRange.start) matchesDate = matchesDate && new Date(po.orderDate) >= new Date(dateRange.start);
          if (dateRange.end) matchesDate = matchesDate && new Date(po.orderDate) <= new Date(dateRange.end);

          return matchesSearch && matchesStatus && matchesVendor && matchesDate;
      });
  }, [purchaseOrders, searchQuery, filterStatus, filterVendor, dateRange]);

  // --- Sorting Logic ---
  const sortedOrders = useMemo(() => {
      return [...filteredOrders].sort((a, b) => {
          let aValue: any = a[sortConfig.key as keyof PurchaseOrder];
          let bValue: any = b[sortConfig.key as keyof PurchaseOrder];
          
          if (sortConfig.key === 'amount') { // Helper for totalAmount alias if needed, or direct prop
             aValue = a.totalAmount;
             bValue = b.totalAmount;
          }

          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });
  }, [filteredOrders, sortConfig]);

  // --- Pagination ---
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- Handlers ---

  const handleSaveOrder = (poData: Omit<PurchaseOrder, 'id'>) => {
      if (editingPO) {
          setPurchaseOrders(prev => prev.map(po => po.id === editingPO.id ? { ...po, ...poData } : po));
          setEditingPO(undefined);
          // If viewing the same PO in drawer, update it
          if (selectedPO?.id === editingPO.id) {
              setSelectedPO(prev => prev ? { ...prev, ...poData } : null);
          }
      } else {
          const newPO: PurchaseOrder = {
              ...poData,
              id: `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
          };
          setPurchaseOrders(prev => [newPO, ...prev]);
      }
  };

  const handleEdit = (po: PurchaseOrder) => {
      setEditingPO(po);
      setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
      if(confirm('Are you sure you want to delete this purchase order?')) {
          setPurchaseOrders(prev => prev.filter(po => po.id !== id));
          if (selectedPO?.id === id) setSelectedPO(null);
          if (selectedIds.has(id)) {
              const next = new Set(selectedIds);
              next.delete(id);
              setSelectedIds(next);
          }
      }
  };

  const handleStatusChange = (id: string, status: PurchaseOrder['status']) => {
      setPurchaseOrders(prev => prev.map(po => po.id === id ? { ...po, status } : po));
      if (selectedPO?.id === id) setSelectedPO(prev => prev ? { ...prev, status } : null);
  };

  const handleConvertToAsset = (item: any) => {
      // Pre-fill asset modal
      setAssetDraft({
          name: item.description,
          value: item.unitCost,
          purchaseDate: selectedPO?.orderDate || new Date().toISOString().split('T')[0],
          status: 'Available',
          category: 'Hardware' // Default, user can change
      });
      setIsAssetModalOpen(true);
  };

  const handleSaveAsset = (asset: Omit<Asset, 'id'>) => {
      onAddAsset(asset);
      alert('Asset created successfully from purchase order.');
  };

  const handleExportCSV = () => {
      const headers = ['ID', 'Vendor', 'Order Date', 'Expected Date', 'Status', 'Total'];
      const csvContent = [
          headers.join(','),
          ...filteredOrders.map(po => [
              po.id, `"${po.vendorName}"`, po.orderDate, po.expectedDate || '', po.status, po.totalAmount
          ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'purchase_orders.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // Bulk Actions
  const handleSelectAll = () => {
      if (selectedIds.size === paginatedOrders.length && paginatedOrders.length > 0) {
          setSelectedIds(new Set());
      } else {
          setSelectedIds(new Set(paginatedOrders.map(po => po.id)));
      }
  };

  const handleSelectOne = (id: string) => {
      const next = new Set(selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelectedIds(next);
  };

  const handleBulkDelete = () => {
      if (confirm(`Delete ${selectedIds.size} orders?`)) {
          setPurchaseOrders(prev => prev.filter(po => !selectedIds.has(po.id)));
          setSelectedIds(new Set());
      }
  };

  const handleBulkStatus = (status: PurchaseOrder['status']) => {
      setPurchaseOrders(prev => prev.map(po => selectedIds.has(po.id) ? { ...po, status } : po));
      setSelectedIds(new Set());
  };

  const handleSort = (key: keyof PurchaseOrder | 'amount') => {
      setSortConfig(current => ({
          key,
          direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
      }));
  };

  const clearFilters = () => {
      setFilterStatus('All');
      setFilterVendor('All');
      setSearchQuery('');
      setDateRange({ start: '', end: '' });
  };

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
        
        {/* Header & KPIs */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Purchases</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Procurement and vendor management.</p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-1">
                <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl min-w-[160px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">
                        <ShoppingBag size={10} /> Total Spend
                    </span>
                    <div className="text-2xl font-light text-black dark:text-white mt-1">${metrics.totalSpend.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl min-w-[160px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">
                        <Truck size={10} /> Open Orders
                    </span>
                    <div className="text-2xl font-light text-blue-600 dark:text-blue-400 mt-1">{metrics.openOrders}</div>
                </div>
                <div className="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl min-w-[160px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">
                        <AlertCircle size={10} /> Late Delivery
                    </span>
                    <div className="text-2xl font-light text-red-600 dark:text-red-400 mt-1">{metrics.lateOrders}</div>
                </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 shrink-0">
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative group flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search POs..." 
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 transition-all"
                    />
                </div>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-xs font-medium ${isFilterOpen ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                    <Filter size={14} /> Filter
                </button>
            </div>

            <div className="flex gap-2 w-full md:w-auto justify-end">
                {selectedIds.size > 0 ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{selectedIds.size} Selected</span>
                        <button onClick={() => handleBulkStatus('Received')} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors text-xs font-medium">
                            <CheckCircle size={12} /> Receive
                        </button>
                        <button onClick={handleBulkDelete} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-xs font-medium">
                            <Trash2 size={12} /> Delete
                        </button>
                        <button onClick={() => setSelectedIds(new Set())} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400">
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <>
                        <button onClick={handleExportCSV} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors" title="Export CSV">
                            <Download size={16} strokeWidth={1.5} />
                        </button>
                        <button 
                            onClick={() => { setEditingPO(undefined); setIsModalOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm whitespace-nowrap"
                        >
                            <Plus size={14} /> Create Order
                        </button>
                    </>
                )}
            </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl animate-in slide-in-from-top-2 fade-in">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1.5">Status</label>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Draft">Draft</option>
                            <option value="Ordered">Ordered</option>
                            <option value="Received">Received</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1.5">Vendor</label>
                        <select 
                            value={filterVendor} 
                            onChange={(e) => setFilterVendor(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                        >
                            <option value="All">All Vendors</option>
                            {MOCK_VENDORS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1.5">Start Date</label>
                        <input type="date" value={dateRange.start} onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))} className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20" />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1.5">End Date</label>
                            <input type="date" value={dateRange.end} onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))} className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20" />
                        </div>
                        <button onClick={clearFilters} className="px-3 py-1.5 bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-white/20 text-xs mt-auto h-[30px]">Clear</button>
                    </div>
                </div>
            </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 dark:bg-white/5 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
                        <tr className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">
                            <th className="py-3 px-4 w-10 text-center">
                                <button onClick={handleSelectAll} className="flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white">
                                    {selectedIds.size > 0 && selectedIds.size === paginatedOrders.length ? <CheckSquare size={14} /> : <Square size={14} />}
                                </button>
                            </th>
                            <th className="py-3 px-6 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('id')}>
                                <div className="flex items-center gap-1">PO Number <ArrowUpDown size={10} /></div>
                            </th>
                            <th className="py-3 px-4 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('vendorName')}>
                                <div className="flex items-center gap-1">Vendor <ArrowUpDown size={10} /></div>
                            </th>
                            <th className="py-3 px-4 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('orderDate')}>
                                <div className="flex items-center gap-1">Date <ArrowUpDown size={10} /></div>
                            </th>
                            <th className="py-3 px-4">Expected</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('amount')}>
                                <div className="flex items-center justify-end gap-1">Total <ArrowUpDown size={10} /></div>
                            </th>
                            <th className="py-3 px-4 w-20"></th>
                        </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-gray-50 dark:divide-gray-800">
                        {paginatedOrders.map(po => (
                            <PurchaseOrderRow 
                                key={po.id} 
                                po={po} 
                                onDelete={handleDelete}
                                selected={selectedIds.has(po.id)}
                                onSelect={handleSelectOne}
                                onView={setSelectedPO}
                            />
                        ))}
                        {paginatedOrders.length === 0 && (
                            <tr>
                                <td colSpan={8} className="py-12 text-center text-gray-400">
                                    No purchase orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Footer */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center text-[10px]">
                <span className="text-gray-500 dark:text-gray-400">
                    Showing <span className="font-medium text-black dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-black dark:text-white">{Math.min(currentPage * itemsPerPage, sortedOrders.length)}</span> of <span className="font-medium text-black dark:text-white">{sortedOrders.length}</span> results
                </span>
                <div className="flex gap-1">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 rounded bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50 text-black dark:text-white">Prev</button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="px-2 py-1 rounded bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50 text-black dark:text-white">Next</button>
                </div>
            </div>
        </div>

    </div>

    <AddPurchaseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrder}
        products={products}
        initialData={editingPO}
    />

    <PurchaseOrderDrawer
        po={selectedPO}
        onClose={() => setSelectedPO(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onConvertToAsset={handleConvertToAsset}
    />

    <AddAssetModal 
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        onSave={handleSaveAsset}
        employees={employees}
        initialData={assetDraft as any}
    />
    </>
  );
};

export default PurchasesList;
