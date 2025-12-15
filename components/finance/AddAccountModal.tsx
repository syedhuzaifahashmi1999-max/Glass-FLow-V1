
import React, { useState, useEffect } from 'react';
import { X, Hash, Book, Check, Tag, Info } from 'lucide-react';
import { GLAccount } from '../../types';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Omit<GLAccount, 'id'>) => void;
  initialData?: GLAccount;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'Asset' as GLAccount['type'],
    subtype: '',
    description: '',
    balance: '',
    status: 'Active' as GLAccount['status']
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (initialData) {
        setFormData({
            code: initialData.code,
            name: initialData.name,
            type: initialData.type,
            subtype: initialData.subtype,
            description: initialData.description || '',
            balance: initialData.balance.toString(),
            status: initialData.status
        });
      } else {
        // Reset defaults
        setFormData({
            code: '',
            name: '',
            type: 'Asset',
            subtype: '',
            description: '',
            balance: '0.00',
            status: 'Active'
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      code: formData.code,
      name: formData.name,
      type: formData.type,
      subtype: formData.subtype,
      description: formData.description,
      balance: parseFloat(formData.balance) || 0,
      status: formData.status
    });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`
            relative w-full max-w-lg bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col 
            transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
           <div>
             <h2 className="text-lg font-light text-black dark:text-white tracking-tight">{initialData ? 'Edit Account' : 'Add New Account'}</h2>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full p-2 hover:bg-gray-100 dark:hover:bg-white/10">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <form onSubmit={handleSubmit} className="p-6 space-y-5">
             
             {/* Account Name & Code */}
             <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-1">
                     <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Code <span className="text-red-400">*</span></label>
                     <div className="relative">
                         <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="code" 
                            required
                            value={formData.code} 
                            onChange={handleChange} 
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white font-mono" 
                            placeholder="1000" 
                         />
                     </div>
                 </div>
                 <div className="col-span-2">
                     <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Account Name <span className="text-red-400">*</span></label>
                     <div className="relative">
                         <Book size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="name" 
                            required
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white" 
                            placeholder="e.g. Petty Cash" 
                         />
                     </div>
                 </div>
             </div>

             {/* Type & Subtype */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Type</label>
                     <select 
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange} 
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white appearance-none"
                     >
                        <option value="Asset">Asset</option>
                        <option value="Liability">Liability</option>
                        <option value="Equity">Equity</option>
                        <option value="Revenue">Revenue</option>
                        <option value="Expense">Expense</option>
                     </select>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Subtype</label>
                     <input 
                        name="subtype" 
                        value={formData.subtype} 
                        onChange={handleChange} 
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white" 
                        placeholder="e.g. Current Asset" 
                     />
                 </div>
             </div>

             {/* Opening Balance */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Opening Balance</label>
                <input 
                    name="balance" 
                    type="number"
                    step="0.01"
                    value={formData.balance} 
                    onChange={handleChange} 
                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white" 
                    placeholder="0.00"
                />
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Info size={10} /> Enter positive for debit, negative for credit based on account type.
                </p>
             </div>

             {/* Description */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea 
                    name="description" 
                    rows={2}
                    value={formData.description} 
                    onChange={handleChange} 
                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white resize-none" 
                    placeholder="Optional details..."
                />
             </div>
             
             {/* Status */}
             <div>
                 <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Status</label>
                 <div className="flex gap-4">
                     <label className="flex items-center gap-2 cursor-pointer">
                         <input type="radio" name="status" value="Active" checked={formData.status === 'Active'} onChange={handleChange} className="text-black focus:ring-black accent-black" />
                         <span className="text-sm text-black dark:text-white">Active</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                         <input type="radio" name="status" value="Archived" checked={formData.status === 'Archived'} onChange={handleChange} className="text-black focus:ring-black accent-black" />
                         <span className="text-sm text-black dark:text-white">Archived</span>
                     </label>
                 </div>
             </div>

             <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
               <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-all text-xs font-medium uppercase tracking-wide">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all text-xs font-medium uppercase tracking-wide flex items-center justify-center gap-2">
                   <Check size={14} /> Save Account
               </button>
             </div>

         </form>
       </div>
    </div>
  );
};

export default AddAccountModal;
