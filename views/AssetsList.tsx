
import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, LayoutGrid, List as ListIcon, Monitor, CheckCircle, AlertTriangle, Download, ArrowUpDown, Trash2, CheckSquare, Square, X, Upload, Calculator } from 'lucide-react';
import { Asset, ViewState } from '../types';
import { MOCK_EMPLOYEES } from '../constants';
import AssetCard from '../components/assets/AssetCard';
import AssetRow from '../components/assets/AssetRow';
import AddAssetModal from '../components/assets/AddAssetModal';

interface AssetsListProps {
    assets: Asset[];
    setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
    onNavigate?: (view: ViewState) => void;
}

const AssetsList: React.FC<AssetsListProps> = ({ assets, setAssets, onNavigate }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'purchaseDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>(undefined);

  // Metrics
  const metrics = useMemo(() => {
      const totalValue = assets.reduce((sum, a) => sum + a.value, 0);
      const inUse = assets.filter(a => a.status === 'In Use').length;
      const maintenance = assets.filter(a => a.status === 'Maintenance').length;
      const available = assets.filter(a => a.status === 'Available').length;
      return { totalValue, inUse, maintenance, available, total: assets.length };
  }, [assets]);

  // Filtering Logic
  const filteredAssets = assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (asset.serialNumber && asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (asset.assignedToName && asset.assignedToName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'All' || asset.category === filterCategory;
      const matchesStatus = filterStatus === 'All' || asset.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sorting Logic
  const sortedAssets = useMemo(() => {
      return [...filteredAssets].sort((a, b) => {
          let res = 0;
          if (sortBy === 'name') res = a.name.localeCompare(b.name);
          else if (sortBy === 'value') res = a.value - b.value;
          else if (sortBy === 'purchaseDate') res = new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
          
          return sortOrder === 'asc' ? res : -res;
      });
  }, [filteredAssets, sortBy, sortOrder]);

  // Handlers
  const handleSaveAsset = (assetData: Omit<Asset, 'id'>) => {
      if (editingAsset) {
          setAssets(prev => prev.map(a => a.id === editingAsset.id ? { ...a, ...assetData } : a));
          setEditingAsset(undefined);
      } else {
          const newAsset: Asset = {
              ...assetData,
              id: `AST-${Date.now()}`
          };
          setAssets(prev => [newAsset, ...prev]);
      }
  };

  const handleEdit = (asset: Asset) => {
      setEditingAsset(asset);
      setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
      if(confirm('Delete this asset record?')) {
          setAssets(prev => prev.filter(a => a.id !== id));
          if (selectedIds.has(id)) {
              const newSelected = new Set(selectedIds);
              newSelected.delete(id);
              setSelectedIds(newSelected);
          }
      }
  };

  // Selection Handlers
  const handleSelectOne = (id: string) => {
      const newSelected = new Set(selectedIds);
      if (newSelected.has(id)) newSelected.delete(id);
      else newSelected.add(id);
      setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
      if (selectedIds.size === filteredAssets.length && filteredAssets.length > 0) {
          setSelectedIds(new Set());
      } else {
          setSelectedIds(new Set(filteredAssets.map(a => a.id)));
      }
  };

  const handleBulkDelete = () => {
      if (confirm(`Delete ${selectedIds.size} assets? This cannot be undone.`)) {
          setAssets(prev => prev.filter(a => !selectedIds.has(a.id)));
          setSelectedIds(new Set());
      }
  };

  const handleExportCSV = () => {
      const headers = ['ID', 'Name', 'Category', 'Serial Number', 'Status', 'Assigned To', 'Value', 'Purchase Date', 'Warranty Date'];
      const csvContent = [
          headers.join(','),
          ...sortedAssets.map(a => [
              a.id, `"${a.name}"`, a.category, `"${a.serialNumber || ''}"`, a.status, `"${a.assignedToName || ''}"`, a.value, a.purchaseDate, a.warrantyDate || ''
          ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'assets_inventory.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleImport = () => {
      alert("Mock Import: Processed 15 new assets from uploaded file.");
  };

  const activeFiltersCount = (filterCategory !== 'All' ? 1 : 0) + (filterStatus !== 'All' ? 1 : 0);
  const clearFilters = () => {
      setFilterCategory('All');
      setFilterStatus('All');
      setSearchQuery('');
  };

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
        
        {/* Header & Metrics */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Asset Management</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Track equipment lifecycle and assignments.</p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-1">
                <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl min-w-[160px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">
                        <Monitor size={10} /> Total Value
                    </span>
                    <div className="text-2xl font-light text-black dark:text-white mt-1">${metrics.totalValue.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl min-w-[160px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">
                        <CheckCircle size={10} /> Assigned
                    </span>
                    <div className="text-2xl font-light text-blue-600 dark:text-blue-400 mt-1">{metrics.inUse}<span className="text-sm text-gray-400">/{metrics.total}</span></div>
                </div>
                <div className="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl min-w-[160px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">
                        <AlertTriangle size={10} /> Maintenance
                    </span>
                    <div className="text-2xl font-light text-orange-600 dark:text-orange-400 mt-1">{metrics.maintenance}</div>
                </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 shrink-0">
            <div className="flex gap-2 w-full md:w-auto">
                <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        <LayoutGrid size={14} />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        <ListIcon size={14} />
                    </button>
                </div>

                <div className="relative group flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search assets..." 
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20" 
                    />
                </div>

                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-xs font-medium ${isFilterOpen || activeFiltersCount > 0 ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                    <Filter size={14} /> 
                    <span className="hidden sm:inline">Filter</span>
                    {activeFiltersCount > 0 && (
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white dark:bg-black text-black dark:text-white text-[9px] font-bold">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>
            </div>

            <div className="flex gap-2 w-full md:w-auto justify-end">
                {selectedIds.size > 0 ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{selectedIds.size} Selected</span>
                        <button 
                            onClick={handleBulkDelete}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-xs font-medium"
                        >
                            <Trash2 size={14} /> Delete Selected
                        </button>
                        <button onClick={() => setSelectedIds(new Set())} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400">
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <>
                        <button 
                            onClick={() => onNavigate?.(ViewState.DEPRECIATION)}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors" 
                            title="Depreciation Schedule"
                        >
                            <Calculator size={16} strokeWidth={1.5} />
                        </button>
                        <button onClick={handleImport} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors" title="Import CSV">
                            <Upload size={16} strokeWidth={1.5} />
                        </button>
                        <button onClick={handleExportCSV} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors" title="Export CSV">
                            <Download size={16} strokeWidth={1.5} />
                        </button>
                        <button 
                            onClick={() => { setEditingAsset(undefined); setIsModalOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm whitespace-nowrap"
                        >
                            <Plus size={14} /> Add Asset
                        </button>
                    </>
                )}
            </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl animate-in slide-in-from-top-2 fade-in">
                <div className="flex flex-wrap items-end gap-6">
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1.5">Category</label>
                        <select 
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                        >
                            <option value="All">All Categories</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Software">Software</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Vehicle">Vehicle</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1.5">Status</label>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Available">Available</option>
                            <option value="In Use">In Use</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Retired">Retired</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1.5">Sort By</label>
                        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 p-0.5">
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-transparent border-none text-xs px-2 focus:ring-0 cursor-pointer text-black dark:text-white"
                            >
                                <option value="name">Name</option>
                                <option value="value">Value</option>
                                <option value="purchaseDate">Purchase Date</option>
                            </select>
                            <button 
                                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                className="px-2 border-l border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 rounded-r"
                            >
                                <ArrowUpDown size={12} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                    </div>
                    <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors px-3 ml-auto">
                        Clear All
                    </button>
                </div>
            </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
            
            {/* Toolbar for Selection (Optional Select All) */}
            <div className="pb-2 flex justify-between items-center text-xs text-gray-500 px-1">
                <span>{sortedAssets.length} assets found</span>
                <button 
                    onClick={handleSelectAll} 
                    className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors"
                >
                    {selectedIds.size > 0 && selectedIds.size === sortedAssets.length ? <CheckSquare size={14} /> : <Square size={14} />} Select All
                </button>
            </div>

            {sortedAssets.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Search size={24} className="opacity-30" />
                    </div>
                    <p className="text-sm">No assets found.</p>
                    <button onClick={clearFilters} className="text-blue-600 dark:text-blue-400 hover:underline text-xs mt-2">Clear Filters</button>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 h-full overflow-y-auto custom-scrollbar pb-10">
                    {sortedAssets.map(asset => (
                        <AssetCard 
                            key={asset.id} 
                            asset={asset} 
                            onEdit={handleEdit} 
                            onDelete={handleDelete} 
                            selected={selectedIds.has(asset.id)}
                            onSelect={handleSelectOne}
                        />
                    ))}
                </div>
            ) : (
                <div className="h-full overflow-y-auto custom-scrollbar bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 dark:bg-white/5 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
                            <tr className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">
                                <th className="py-3 px-4 w-10 text-center">
                                    <button onClick={handleSelectAll} className="hover:text-black dark:hover:text-white">
                                        {selectedIds.size > 0 && selectedIds.size === sortedAssets.length ? <CheckSquare size={14} /> : <Square size={14} />}
                                    </button>
                                </th>
                                <th className="py-3 px-6">Asset Name</th>
                                <th className="py-3 px-4">Category</th>
                                <th className="py-3 px-4">Serial Number</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Assigned To</th>
                                <th className="py-3 px-4 text-right">Value</th>
                                <th className="py-3 px-4 w-20"></th>
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-gray-50 dark:divide-gray-800">
                            {sortedAssets.map(asset => (
                                <AssetRow 
                                    key={asset.id} 
                                    asset={asset} 
                                    onEdit={handleEdit} 
                                    onDelete={handleDelete} 
                                    selected={selectedIds.has(asset.id)}
                                    onSelect={handleSelectOne}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

    </div>

    <AddAssetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAsset}
        employees={MOCK_EMPLOYEES}
        initialData={editingAsset}
    />
    </>
  );
};

export default AssetsList;
