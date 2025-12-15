
import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, CreditCard, FileText, User, Building } from 'lucide-react';
import { Expense, BankAccount } from '../../types';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id'>, accountId?: string) => void;
  accounts: BankAccount[];
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ isOpen, onClose, onSave, accounts }) => {
  const [formData, setFormData] = useState({
    payee: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    status: 'Paid' as Expense['status'],
    method: 'Wire Transfer',
    accountId: ''
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Auto-select first account if available
      if (accounts.length > 0) {
          setFormData(prev => ({ ...prev, accountId: accounts[0].id }));
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, accounts]);

  if (!isVisible && !isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      payee: formData.payee,
      description: formData.description,
      amount: parseFloat(formData.amount) || 0,
      date: new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      category: formData.category,
      status: formData.status,
      method: formData.method,
      accountId: formData.accountId || undefined
    }, formData.accountId);
    
    // Reset
    setFormData({
        payee: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        status: 'Paid',
        method: 'Wire Transfer',
        accountId: accounts.length > 0 ? accounts[0].id : ''
    });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`
            relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]
            transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black tracking-tight">Record Payment</h2>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="overflow-y-auto custom-scrollbar flex-1">
           <form onSubmit={handleSubmit} className="p-6 space-y-6">
             
             {/* Payee */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Payee / Vendor <span className="text-red-400">*</span></label>
                <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        name="payee" 
                        required 
                        value={formData.payee} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                        placeholder="e.g. AWS Web Services"
                    />
                </div>
             </div>

             {/* Amount & Date */}
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
                            value={formData.amount} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                            placeholder="0.00"
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Date</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="date" 
                            type="date"
                            value={formData.date} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                         />
                     </div>
                 </div>
             </div>

             {/* Category & Status */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Category</label>
                     <input 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                        placeholder="e.g. Infrastructure"
                     />
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Status</label>
                     <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                     >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Failed">Failed</option>
                     </select>
                 </div>
             </div>

             {/* Source Account (Only if Paid) */}
             {formData.status === 'Paid' && (
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Pay From Account</label>
                     <div className="relative">
                         <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <select 
                            name="accountId" 
                            value={formData.accountId} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                         >
                            <option value="">Select Bank Account</option>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name} - {acc.bankName} (${acc.balance.toLocaleString()})</option>
                            ))}
                         </select>
                     </div>
                 </div>
             )}

             {/* Method & Description */}
             <div>
                 <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Payment Method</label>
                 <div className="relative">
                     <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <select 
                        name="method" 
                        value={formData.method} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                     >
                        <option>Wire Transfer</option>
                        <option>Credit Card</option>
                        <option>ACH</option>
                        <option>Check</option>
                     </select>
                 </div>
             </div>

             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Description</label>
                <div className="relative">
                    <FileText size={14} className="absolute left-3 top-3 text-gray-400" />
                    <textarea 
                        name="description" 
                        rows={3}
                        value={formData.description} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent resize-none" 
                        placeholder="Purpose of payment..."
                    />
                </div>
             </div>

             <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-all text-xs font-medium">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium shadow-lg shadow-black/5">Record Payment</button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddPaymentModal;
