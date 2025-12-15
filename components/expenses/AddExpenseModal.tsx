
import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, CreditCard, FileText, User, Building, UploadCloud, Tag, FolderKanban, Book } from 'lucide-react';
import { Expense, BankAccount, Project, GLAccount } from '../../types';
import { MOCK_ACCOUNTS } from '../../constants'; // Or pass via props if preferred

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id'>, accountId?: string) => void;
  accounts: BankAccount[];
  projects: Project[];
  initialData?: Expense;
  glAccounts?: GLAccount[];
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onSave, accounts, projects, initialData, glAccounts = MOCK_ACCOUNTS }) => {
  const [formData, setFormData] = useState({
    payee: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    status: 'Pending' as Expense['status'],
    method: 'Credit Card',
    accountId: '',
    projectId: '',
    glAccountId: ''
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (initialData) {
        // Edit Mode: Pre-fill
        setFormData({
            payee: initialData.payee,
            description: initialData.description,
            amount: initialData.amount.toString(),
            date: initialData.date, 
            category: initialData.category,
            status: initialData.status,
            method: initialData.method,
            accountId: initialData.accountId || (accounts.length > 0 ? accounts[0].id : ''),
            projectId: initialData.projectId || '',
            glAccountId: initialData.glAccountId || ''
        });
      } else {
        // Add Mode: Reset or Defaults
        setFormData({
            payee: '',
            description: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            category: '',
            status: 'Pending',
            method: 'Credit Card',
            accountId: accounts.length > 0 ? accounts[0].id : '',
            projectId: '',
            glAccountId: ''
        });
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialData, accounts]);

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
      date: formData.date,
      category: formData.category,
      status: formData.status,
      method: formData.method,
      accountId: formData.accountId || undefined,
      projectId: formData.projectId || undefined,
      glAccountId: formData.glAccountId || undefined
    }, formData.accountId);
    onClose();
  };

  // Filter Expense Accounts
  const expenseAccounts = glAccounts.filter(a => a.type === 'Expense');

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`
            relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]
            transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         
         <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black tracking-tight">{initialData ? 'Edit Expense' : 'New Expense'}</h2>
             <p className="text-xs text-gray-500 font-light mt-0.5">{initialData ? 'Update expense details.' : 'Record a new business expense or payment.'}</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="overflow-y-auto custom-scrollbar flex-1">
           <form onSubmit={handleSubmit} className="p-8 space-y-8">
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Left Column: Details */}
                 <div className="space-y-5">
                     
                     <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Payee / Merchant <span className="text-red-400">*</span></label>
                        <div className="relative">
                            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                name="payee" 
                                required 
                                value={formData.payee} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                placeholder="e.g. AWS, Office Depot"
                            />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Amount <span className="text-red-400">*</span></label>
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
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors" 
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
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                 />
                             </div>
                         </div>
                     </div>

                     <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Category</label>
                        <div className="relative">
                            <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                name="category" 
                                list="categories"
                                value={formData.category} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                placeholder="e.g. Travel, Software"
                            />
                            <datalist id="categories">
                                <option value="Software" />
                                <option value="Office Supplies" />
                                <option value="Travel" />
                                <option value="Meals" />
                                <option value="Contractors" />
                                <option value="Rent" />
                                <option value="Infrastructure" />
                            </datalist>
                        </div>
                     </div>
                     
                     {/* Expense Ledger Link */}
                     <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">GL Expense Account</label>
                        <div className="relative">
                            <Book size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select 
                                name="glAccountId" 
                                value={formData.glAccountId} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors appearance-none"
                            >
                                <option value="">Select Account...</option>
                                {expenseAccounts.map(gl => (
                                    <option key={gl.id} value={gl.id}>{gl.code} - {gl.name}</option>
                                ))}
                            </select>
                        </div>
                     </div>

                     <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Description</label>
                        <textarea 
                            name="description" 
                            rows={2}
                            value={formData.description} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors resize-none" 
                            placeholder="Reason for expense..."
                        />
                     </div>

                 </div>

                 {/* Right Column: Payment & Receipt */}
                 <div className="space-y-6">
                     
                     <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                         <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">Payment Source</h3>
                         
                         <div className="space-y-3">
                             <div>
                                 <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Status</label>
                                 <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleChange} 
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-black appearance-none"
                                 >
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending Approval</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Failed">Failed</option>
                                 </select>
                             </div>

                             {formData.status === 'Paid' && (
                                 <div>
                                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Pay From Account</label>
                                     <div className="relative">
                                         <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                         <select 
                                            name="accountId" 
                                            value={formData.accountId} 
                                            onChange={handleChange} 
                                            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black appearance-none"
                                         >
                                            <option value="">Select Bank Account</option>
                                            {accounts.map(acc => (
                                                <option key={acc.id} value={acc.id}>{acc.name} - {acc.bankName} (${acc.balance.toLocaleString()})</option>
                                            ))}
                                         </select>
                                     </div>
                                 </div>
                             )}

                             <div>
                                 <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Method</label>
                                 <div className="relative">
                                     <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                     <select 
                                        name="method" 
                                        value={formData.method} 
                                        onChange={handleChange} 
                                        className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black appearance-none"
                                     >
                                        <option>Credit Card</option>
                                        <option>Wire Transfer</option>
                                        <option>ACH</option>
                                        <option>Check</option>
                                        <option>Reimbursement</option>
                                     </select>
                                 </div>
                             </div>
                         </div>
                     </div>

                     <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Link Project</label>
                        <div className="relative">
                            <FolderKanban size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select 
                                name="projectId" 
                                value={formData.projectId} 
                                onChange={handleChange} 
                                className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black appearance-none"
                            >
                                <option value="">No Project</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.client})</option>
                                ))}
                            </select>
                        </div>
                     </div>

                     <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-2 uppercase tracking-wide">Receipt</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all group">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2 group-hover:bg-white group-hover:text-black transition-colors shadow-sm">
                                <UploadCloud size={20} />
                            </div>
                            <p className="text-xs font-medium text-black">Click to upload</p>
                            <p className="text-[10px] text-gray-400 mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                        </div>
                     </div>

                 </div>
             </div>

             <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-all text-xs font-medium">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium shadow-lg shadow-black/5">
                   {initialData ? 'Update Expense' : 'Record Expense'}
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddExpenseModal;
