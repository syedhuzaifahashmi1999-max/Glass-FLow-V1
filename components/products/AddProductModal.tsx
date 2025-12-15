
import React, { useState, useEffect } from 'react';
import { X, Package, Tag, DollarSign, FileText, Layers, Hash, Box, Book, Check } from 'lucide-react';
import { Product, GLAccount } from '../../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'>) => void;
  initialData?: Product;
  glAccounts?: GLAccount[];
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSave, initialData, glAccounts = [] }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    type: 'Service',
    price: 0,
    billingFrequency: 'One-time',
    status: 'Active',
    description: '',
    sku: '',
    stock: 0,
    glAccountId: ''
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        setFormData({
            name: '',
            category: '',
            type: 'Service',
            price: 0,
            billingFrequency: 'One-time',
            status: 'Active',
            description: '',
            sku: '',
            stock: 0,
            glAccountId: ''
        });
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialData]);

  if (!isVisible && !isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<Product, 'id'>);
    onClose();
  };

  // Filter Revenue Accounts
  const revenueAccounts = glAccounts.filter(a => a.type === 'Revenue');

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`
            relative w-full max-w-2xl bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh] 
            transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         
         <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black dark:text-white tracking-tight">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
             <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-0.5">Manage inventory details and pricing configuration.</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full p-2 hover:bg-gray-100 dark:hover:bg-white/10">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="overflow-y-auto custom-scrollbar flex-1">
           <form onSubmit={handleSubmit} className="p-8 space-y-6">
             
             {/* Main Info */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Product Name <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            name="name" 
                            required 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors" 
                            placeholder="e.g. Enterprise Solution"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">SKU / ID</label>
                    <div className="relative">
                        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            name="sku" 
                            value={formData.sku} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors" 
                            placeholder="e.g. PRD-001"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Category</label>
                    <div className="relative">
                        <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors" 
                            placeholder="e.g. Software"
                        />
                    </div>
                </div>
             </div>

             {/* Pricing & Type */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-gray-50 dark:border-gray-800">
                <div>
                    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Price</label>
                    <div className="relative">
                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            name="price" 
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors" 
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Type</label>
                    <div className="relative">
                        <Box size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            name="type" 
                            value={formData.type} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors appearance-none"
                        >
                            <option value="Service">Service</option>
                            <option value="Digital">Digital</option>
                            <option value="Physical">Physical</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Billing Frequency</label>
                    <div className="relative">
                        <Layers size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            name="billingFrequency" 
                            value={formData.billingFrequency} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors appearance-none"
                        >
                            <option value="One-time">One-time</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Yearly">Yearly</option>
                        </select>
                    </div>
                </div>
             </div>

             {/* GL Account & Status & Stock */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                     <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Income Account</label>
                     <div className="relative">
                         <Book size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <select 
                            name="glAccountId" 
                            value={formData.glAccountId} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white appearance-none"
                         >
                            <option value="">Select Revenue Account...</option>
                            {revenueAccounts.map(gl => (
                                <option key={gl.id} value={gl.id}>{gl.code} - {gl.name}</option>
                            ))}
                         </select>
                     </div>
                </div>

                <div>
                    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Status</label>
                    <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors appearance-none"
                    >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>

                {formData.type === 'Physical' && (
                    <div className="col-span-2">
                        <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Stock Quantity</label>
                        <input 
                            name="stock" 
                            type="number"
                            min="0"
                            value={formData.stock} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors" 
                            placeholder="0"
                        />
                    </div>
                )}
             </div>

             {/* Description */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Description</label>
                <div className="relative">
                    <FileText size={14} className="absolute left-3 top-3 text-gray-400" />
                    <textarea 
                        name="description" 
                        rows={3}
                        value={formData.description} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none" 
                        placeholder="Product details..."
                    />
                </div>
             </div>

             <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-all text-xs font-medium uppercase tracking-wide">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all text-xs font-medium uppercase tracking-wide shadow-lg shadow-black/5 flex items-center justify-center gap-2">
                   <Check size={14} /> {initialData ? 'Update Product' : 'Create Product'}
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddProductModal;
