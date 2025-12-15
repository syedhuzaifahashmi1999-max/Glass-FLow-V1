
import React, { useState, useRef } from 'react';
import { Search, Filter, Plus, Package, Box, MoreHorizontal, DollarSign, List, LayoutGrid, Download, Upload, ArrowUpDown, X } from 'lucide-react';
import { Product, GLAccount } from '../types';
import { MOCK_ACCOUNTS } from '../constants';
import ProductCard from '../components/products/ProductCard';
import ProductRow from '../components/products/ProductRow';
import AddProductModal from '../components/products/AddProductModal';

interface ProductsListProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onSelectProduct?: (id: string) => void;
  glAccounts?: GLAccount[]; // Pass accounts
}

const ProductsList: React.FC<ProductsListProps> = ({ products, setProducts, onSelectProduct, glAccounts = MOCK_ACCOUNTS }) => {
  // State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState<'price' | 'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
      if (editingProduct) {
          // Edit
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
          setEditingProduct(undefined);
      } else {
          // Create
          const newProduct: Product = {
              ...productData,
              id: `P-${Date.now()}` // Generate ID
          };
          setProducts(prev => [newProduct, ...prev]);
      }
  };

  const handleDeleteProduct = (id: string) => {
      if (confirm('Are you sure you want to delete this product?')) {
          setProducts(prev => prev.filter(p => p.id !== id));
      }
  };

  const handleEditClick = (product: Product) => {
      setEditingProduct(product);
      setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
      setIsAddModalOpen(false);
      setEditingProduct(undefined);
  };

  // Import / Export
  const handleExportCSV = () => {
      const headers = ['ID', 'Name', 'Category', 'Type', 'Price', 'Billing', 'Status', 'SKU', 'Stock', 'GL Account'];
      const csvContent = [
          headers.join(','),
          ...filteredProducts.map(p => [
              p.id, `"${p.name}"`, `"${p.category}"`, p.type, p.price, p.billingFrequency, p.status, p.sku || '', p.stock || 0, p.glAccountId || ''
          ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          alert(`Import simulation: Ready to parse ${e.target.files[0].name}`);
          e.target.value = ''; 
      }
  };

  // --- Filtering & Sorting ---

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    const matchesType = filterType === 'All' || p.type === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
      let res = 0;
      if (sortBy === 'price') res = a.price - b.price;
      else res = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? res : -res;
  });

  const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
  const uniqueTypes = Array.from(new Set(products.map(p => p.type)));

  const clearFilters = () => {
      setFilterCategory('All');
      setFilterType('All');
      setSearchQuery('');
  };

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-light text-black dark:text-white mb-1">Products & Services</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
            Manage your catalog of offerings and pricing.
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
                    <option value="name">Name</option>
                    <option value="price">Price</option>
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
                placeholder="Search products..." 
                className="w-40 lg:w-56 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded pl-9 pr-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:ring-0 transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors text-xs font-medium ${isFilterOpen ? 'bg-gray-50 dark:bg-white/10 border-gray-300 dark:border-gray-600 text-black dark:text-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
            >
              <Filter size={14} />
              <span className="hidden sm:inline">Filter</span>
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

            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm ml-1"
            >
              <Plus size={14} />
              <span className="hidden lg:inline">Add Product</span>
            </button>
        </div>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="flex flex-wrap items-end gap-6">
                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Category</label>
                    <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                    >
                        <option value="All">All Categories</option>
                        {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Type</label>
                    <select 
                        value={filterType} 
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                    >
                        <option value="All">All Types</option>
                        {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
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
        {sortedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4">
                    <Search size={24} className="opacity-20" />
                </div>
                <p className="text-sm">No products found.</p>
                <button onClick={clearFilters} className="text-blue-600 dark:text-blue-400 hover:underline text-xs mt-2">Clear Filters</button>
            </div>
        ) : viewMode === 'list' ? (
            /* List View */
            <div className="h-full overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 uppercase tracking-widest font-medium sticky top-0 bg-white dark:bg-[#18181b] z-10 shadow-sm">
                        <th className="py-3 px-4 font-medium w-48">Name</th>
                        <th className="py-3 px-4 font-medium">Category</th>
                        <th className="py-3 px-4 font-medium">Type</th>
                        <th className="py-3 px-4 font-medium">Billing</th>
                        <th className="py-3 px-4 font-medium text-right">Price</th>
                        <th className="py-3 px-4 font-medium w-24">Status</th>
                        <th className="py-3 px-4 font-medium w-10"></th>
                    </tr>
                    </thead>
                    <tbody className="text-xs">
                    {sortedProducts.map((product) => (
                        <ProductRow 
                            key={product.id} 
                            product={product} 
                            onClick={() => onSelectProduct?.(product.id)}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteProduct}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar h-full pb-10">
                {sortedProducts.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product}
                        onClick={() => onSelectProduct?.(product.id)}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteProduct}
                    />
                ))}
            </div>
        )}
      </div>
    </div>

    <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={handleModalClose} 
        onSave={handleAddProduct}
        initialData={editingProduct}
        glAccounts={glAccounts}
    />
    </>
  );
};

export default ProductsList;
