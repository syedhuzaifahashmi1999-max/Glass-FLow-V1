
import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, FileText, ArrowUpRight, ArrowDownLeft, Tag, CreditCard } from 'lucide-react';
import { BankAccount, BankTransaction } from '../../types';

interface BankTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<BankTransaction, 'id'>) => void;
  accounts: BankAccount[];
  preselectedAccountId?: string | null;
}

const BankTransactionModal: React.FC<BankTransactionModalProps> = ({ isOpen, onClose, onSave, accounts, preselectedAccountId }) => {
  const [formData, setFormData] = useState({
    accountId: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    description: '',
    amount: '',
    type: 'Debit' as 'Credit' | 'Debit',
    category: '',
    status: 'Cleared' as 'Cleared' | 'Pending'
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setFormData(prev => ({
          ...prev,
          accountId: preselectedAccountId || (accounts.length > 0 ? accounts[0].id : '')
      }));
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, preselectedAccountId, accounts]);

  if (!isVisible && !isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      accountId: formData.accountId,
      date: formData.date,
      description: formData.description,
      amount: parseFloat(formData.amount) || 0,
      type: formData.type,
      category: formData.category,
      status: formData.status
    });
    
    // Reset core fields
    setFormData({
        accountId: accounts.length > 0 ? accounts[0].id : '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        description: '',
        amount: '',
        type: 'Debit',
        category: '',
        status: 'Cleared'
    });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black tracking-tight">Record Transaction</h2>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="p-6">
           <form onSubmit={handleSubmit} className="space-y-5">
             
             {/* Account Select */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Bank Account</label>
                <div className="relative">
                    <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                        name="accountId" 
                        required
                        value={formData.accountId} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black appearance-none"
                    >
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name} ({acc.bankName})</option>
                        ))}
                    </select>
                </div>
             </div>

             {/* Description */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Description <span className="text-red-400">*</span></label>
                <div className="relative">
                    <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        name="description" 
                        required 
                        value={formData.description} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black" 
                        placeholder="e.g. Office Rent" 
                    />
                </div>
             </div>

             {/* Amount & Type */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Amount</label>
                     <div className="relative">
                         <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="amount" 
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={formData.amount} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black" 
                            placeholder="0.00" 
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Type</label>
                     <div className="grid grid-cols-2 gap-2 h-[38px]">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: 'Debit' }))}
                            className={`flex items-center justify-center gap-1 rounded-lg text-xs font-medium border ${formData.type === 'Debit' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                        >
                            <ArrowUpRight size={12} /> Debit
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: 'Credit' }))}
                            className={`flex items-center justify-center gap-1 rounded-lg text-xs font-medium border ${formData.type === 'Credit' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                        >
                            <ArrowDownLeft size={12} /> Credit
                        </button>
                     </div>
                 </div>
             </div>

             {/* Date, Category, Status */}
             <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-1">
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Date</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="date" 
                            value={formData.date} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-2 py-2 text-sm text-black focus:outline-none focus:border-black" 
                         />
                     </div>
                 </div>
                 <div className="col-span-1">
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Category</label>
                     <div className="relative">
                         <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-2 py-2 text-sm text-black focus:outline-none focus:border-black" 
                            placeholder="e.g. Sales"
                         />
                     </div>
                 </div>
                 <div className="col-span-1">
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Status</label>
                     <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-sm text-black focus:outline-none focus:border-black appearance-none"
                     >
                        <option value="Cleared">Cleared</option>
                        <option value="Pending">Pending</option>
                     </select>
                 </div>
             </div>

             <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-all text-xs font-medium">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium shadow-lg shadow-black/5">Add Transaction</button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default BankTransactionModal;
