
import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, FileText, User, UploadCloud, Check } from 'lucide-react';
import { Claim, Employee } from '../../types';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (claim: Omit<Claim, 'id' | 'status' | 'employeeName' | 'avatarUrl'>) => void;
  employees: Employee[];
}

const ClaimModal: React.FC<ClaimModalProps> = ({ isOpen, onClose, onSave, employees }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Travel' as Claim['category'],
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
        employeeId: formData.employeeId,
        description: formData.description,
        amount: parseFloat(formData.amount) || 0,
        date: formData.date,
        category: formData.category,
        notes: formData.notes
    });
    onClose();
    // Reset
    setFormData({
        employeeId: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Travel',
        notes: ''
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="relative w-full max-w-lg bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
           <div>
             <h2 className="text-lg font-light text-black dark:text-white tracking-tight">Submit Claim</h2>
             <p className="text-xs text-gray-500 dark:text-gray-400">Request reimbursement for expenses.</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full p-2 hover:bg-gray-100 dark:hover:bg-white/10">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="p-6">
           <form onSubmit={handleSubmit} className="space-y-5">
             
             {/* Employee */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Employee</label>
                <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                        value={formData.employeeId}
                        onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white appearance-none"
                    >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                    </select>
                </div>
             </div>

             {/* Description */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Description</label>
                <div className="relative">
                    <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                        placeholder="e.g. Client Lunch"
                    />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Amount</label>
                     <div className="relative">
                         <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                            placeholder="0.00"
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Date</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                         />
                     </div>
                 </div>
             </div>

             <div>
                <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Category</label>
                <div className="relative">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white appearance-none"
                    >
                        <option>Travel</option>
                        <option>Meals</option>
                        <option>Office Supplies</option>
                        <option>Software</option>
                        <option>Training</option>
                        <option>Other</option>
                    </select>
                </div>
             </div>

             {/* Receipt Placeholder */}
             <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                 <UploadCloud size={24} className="text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                 <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Click to upload receipt</span>
             </div>

             <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
               <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-all text-xs font-medium uppercase tracking-wide">Cancel</button>
               <button type="submit" disabled={!formData.employeeId || !formData.amount} className="px-6 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 disabled:opacity-50 transition-all text-xs font-medium uppercase tracking-wide flex items-center justify-center gap-2">
                   <Check size={14} /> Submit
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default ClaimModal;
