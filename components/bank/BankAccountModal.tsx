
import React, { useState, useEffect } from 'react';
import { X, Building, CreditCard, DollarSign, Wallet, Palette, Book } from 'lucide-react';
import { BankAccount, GLAccount } from '../../types';

interface BankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: BankAccount) => void;
  initialData?: BankAccount;
  glAccounts?: GLAccount[];
}

const BankAccountModal: React.FC<BankAccountModalProps> = ({ isOpen, onClose, onSave, initialData, glAccounts = [] }) => {
  const [formData, setFormData] = useState<Partial<BankAccount>>({
    name: '',
    bankName: '',
    accountNumber: '',
    balance: 0,
    currency: 'USD',
    type: 'Checking',
    color: 'black',
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
            bankName: '',
            accountNumber: '',
            balance: 0,
            currency: 'USD',
            type: 'Checking',
            color: 'black',
            glAccountId: ''
        });
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialData]);

  if (!isVisible && !isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'balance' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleColorSelect = (color: any) => {
      setFormData(prev => ({ ...prev, color }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || `BA-${Date.now()}`,
      name: formData.name || 'New Account',
      bankName: formData.bankName || 'Bank',
      accountNumber: formData.accountNumber || `**** ${Math.floor(1000 + Math.random() * 9000)}`,
      balance: Number(formData.balance),
      currency: formData.currency || 'USD',
      type: formData.type as any || 'Checking',
      color: formData.color as any || 'black',
      glAccountId: formData.glAccountId
    });
    onClose();
  };

  const getCardGradient = (color: string) => {
      switch(color) {
          case 'black': return 'bg-gradient-to-br from-gray-900 to-black';
          case 'blue': return 'bg-gradient-to-br from-blue-600 to-blue-800';
          case 'purple': return 'bg-gradient-to-br from-purple-600 to-purple-800';
          case 'slate': return 'bg-gradient-to-br from-slate-600 to-slate-800';
          default: return 'bg-gray-900';
      }
  };

  // Filter for Assets/Liabilities for bank mapping
  const eligibleGLAccounts = glAccounts.filter(a => a.type === 'Asset' || a.type === 'Liability');

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`
            relative w-full max-w-lg bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col 
            transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black dark:text-white tracking-tight">{initialData ? 'Edit Account' : 'Connect Bank Account'}</h2>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full p-2 hover:bg-gray-100 dark:hover:bg-white/10">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="p-6">
           <form onSubmit={handleSubmit} className="space-y-5">
             
             <div>
                <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Account Nickname</label>
                <div className="relative">
                    <Wallet size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        name="name" 
                        required 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white" 
                        placeholder="e.g. Operating Account" 
                    />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Bank Name</label>
                     <div className="relative">
                         <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="bankName" 
                            required 
                            value={formData.bankName} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white" 
                            placeholder="e.g. Chase" 
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Account Type</label>
                     <div className="relative">
                         <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <select 
                            name="type" 
                            value={formData.type} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white appearance-none"
                         >
                            <option value="Checking">Checking</option>
                            <option value="Savings">Savings</option>
                            <option value="Credit">Credit Card</option>
                         </select>
                     </div>
                 </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Initial Balance</label>
                     <div className="relative">
                         <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="balance" 
                            type="number"
                            step="0.01"
                            value={formData.balance} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white" 
                            placeholder="0.00" 
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Last 4 Digits</label>
                     <div className="relative">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-mono">****</span>
                         <input 
                            name="accountNumber" 
                            value={formData.accountNumber?.replace('**** ', '')} 
                            onChange={(e) => setFormData(prev => ({...prev, accountNumber: `**** ${e.target.value}`}))}
                            maxLength={4}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white" 
                            placeholder="1234" 
                         />
                     </div>
                 </div>
             </div>

             {/* GL Account Mapping */}
             <div>
                 <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Ledger Account Mapping</label>
                 <div className="relative">
                     <Book size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <select 
                        name="glAccountId" 
                        value={formData.glAccountId} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white appearance-none"
                     >
                        <option value="">Select GL Account...</option>
                        {eligibleGLAccounts.map(gl => (
                            <option key={gl.id} value={gl.id}>{gl.code} - {gl.name}</option>
                        ))}
                     </select>
                 </div>
                 <p className="text-[10px] text-gray-400 mt-1">Transactions will reconcile to this General Ledger account.</p>
             </div>

             <div>
                <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-2">Card Style</label>
                <div className="flex gap-3">
                    {['black', 'blue', 'purple', 'slate'].map(color => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => handleColorSelect(color)}
                            className={`w-10 h-10 rounded-full ${getCardGradient(color)} transition-all ${formData.color === color ? 'ring-2 ring-offset-2 ring-black dark:ring-white scale-110' : 'hover:scale-105'}`}
                        />
                    ))}
                </div>
             </div>

             <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-all text-xs font-medium">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all text-xs font-medium shadow-lg shadow-black/5">
                   {initialData ? 'Save Changes' : 'Connect Account'}
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default BankAccountModal;
