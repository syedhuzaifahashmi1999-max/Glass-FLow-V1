
import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Users, Wallet } from 'lucide-react';
import { PayrollRun, Employee } from '../../types';

interface RunPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (run: Omit<PayrollRun, 'id'>) => void;
  employees: Employee[];
}

const RunPayrollModal: React.FC<RunPayrollModalProps> = ({ isOpen, onClose, onSave, employees }) => {
  const [formData, setFormData] = useState({
    period: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Draft' as PayrollRun['status']
  });

  const [isVisible, setIsVisible] = useState(false);

  // Calculate estimated total based on annual salaries / 12
  const estimatedTotal = employees.reduce((sum, emp) => {
      const annual = parseFloat((emp.salary || '0').replace(/[^0-9.]/g, ''));
      return sum + (annual > 0 ? annual / 12 : 0);
  }, 0);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Default to current month/year string
      const date = new Date();
      const month = date.toLocaleString('default', { month: 'long' });
      setFormData({
          period: `${month} ${date.getFullYear()}`,
          date: date.toISOString().split('T')[0],
          status: 'Draft'
      });
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      period: formData.period,
      date: new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      totalCost: estimatedTotal,
      employeeCount: employees.length,
      status: formData.status,
      reference: `ACH-${Math.floor(10000 + Math.random() * 90000)}`
    });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`
            relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col 
            transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black tracking-tight">Run Payroll</h2>
             <p className="text-xs text-gray-500">Initiate a new pay period for your team.</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="p-6">
           <form onSubmit={handleSubmit} className="space-y-6">
             
             {/* Summary Cards */}
             <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider block mb-1">Total Estimated</span>
                    <div className="flex items-center gap-1 text-black font-medium">
                        <DollarSign size={14} className="text-gray-400" />
                        <span>{estimatedTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider block mb-1">Employees</span>
                    <div className="flex items-center gap-1 text-black font-medium">
                        <Users size={14} className="text-gray-400" />
                        <span>{employees.length} Active</span>
                    </div>
                </div>
             </div>

             <div className="space-y-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Period Name</label>
                     <input 
                        required
                        value={formData.period} 
                        onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-black" 
                        placeholder="e.g. November 2024"
                     />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div>
                         <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Execution Date</label>
                         <div className="relative">
                             <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                             <input 
                                type="date"
                                required
                                value={formData.date} 
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black" 
                             />
                         </div>
                     </div>
                     <div>
                         <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Initial Status</label>
                         <select 
                            value={formData.status} 
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-black appearance-none"
                         >
                            <option value="Draft">Draft</option>
                            <option value="Processing">Processing</option>
                            <option value="Paid">Mark as Paid</option>
                         </select>
                     </div>
                 </div>
             </div>

             <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-all text-xs font-medium">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium shadow-lg shadow-black/5 flex items-center gap-2">
                   <Wallet size={14} /> Create Pay Run
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default RunPayrollModal;
