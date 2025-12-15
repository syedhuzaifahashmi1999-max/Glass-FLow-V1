
import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, Clock, AlertCircle, Check } from 'lucide-react';
import { LeaveRequest } from '../../types';

interface AddLeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (request: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => void;
  balances: { annual: number; sick: number };
}

const AddLeaveRequestModal: React.FC<AddLeaveRequestModalProps> = ({ isOpen, onClose, onSave, balances }) => {
  const [formData, setFormData] = useState({
    type: 'Annual' as LeaveRequest['type'],
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setFormData({
        type: 'Annual',
        startDate: '',
        endDate: '',
        reason: ''
      });
      setDuration(0);
      setError('');
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Calculate duration whenever dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end >= start) {
        // Simple calculation: difference in ms / ms per day + 1 (inclusive)
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
        setDuration(diffDays);
        setError('');
      } else {
        setDuration(0);
        setError('End date cannot be before start date.');
      }
    }
  }, [formData.startDate, formData.endDate]);

  if (!isVisible && !isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (error) return;
    if (duration <= 0) {
        setError('Please select valid dates.');
        return;
    }

    // Basic Balance Check
    if (formData.type === 'Annual' && duration > balances.annual) {
        setError(`Insufficient Annual Leave balance. You have ${balances.annual} days remaining.`);
        return;
    }
    if (formData.type === 'Sick' && duration > balances.sick) {
        setError(`Insufficient Sick Leave balance. You have ${balances.sick} days remaining.`);
        return;
    }

    onSave({
      employeeId: 'e1', // Current User Mock
      employeeName: 'Alex Doe',
      avatarUrl: 'https://picsum.photos/100/100?random=20',
      type: formData.type,
      startDate: new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      endDate: new Date(formData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      days: duration,
      reason: formData.reason
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
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
           <div>
             <h2 className="text-lg font-light text-black tracking-tight">Request Time Off</h2>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="p-6">
           <form onSubmit={handleSubmit} className="space-y-5">
             
             {/* Type */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Leave Type</label>
                <div className="relative">
                    <select 
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange} 
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-black focus:outline-none focus:border-black appearance-none"
                    >
                        <option value="Annual">Annual Leave ({balances.annual} days left)</option>
                        <option value="Sick">Sick Leave ({balances.sick} days left)</option>
                        <option value="Personal">Personal Leave</option>
                        <option value="Maternity">Maternity/Paternity</option>
                        <option value="Unpaid">Unpaid Leave</option>
                    </select>
                </div>
             </div>

             {/* Dates */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Start Date</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="startDate" 
                            type="date"
                            required
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black" 
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">End Date</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="endDate" 
                            type="date"
                            required
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black" 
                         />
                     </div>
                 </div>
             </div>

             {/* Summary & Validation */}
             <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-xs text-gray-600">
                     <Clock size={14} />
                     <span>Total Duration:</span>
                 </div>
                 <span className="font-mono font-medium text-black">
                     {duration > 0 ? `${duration} Days` : '-'}
                 </span>
             </div>

             {error && (
                 <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                     <AlertCircle size={14} />
                     {error}
                 </div>
             )}

             {/* Reason */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Reason</label>
                <div className="relative">
                    <FileText size={14} className="absolute left-3 top-3 text-gray-400" />
                    <textarea 
                        name="reason" 
                        required
                        rows={3}
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black resize-none"
                        placeholder="Please describe the reason for your leave..."
                    />
                </div>
             </div>

             <div className="pt-4 flex gap-3">
               <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 transition-all text-xs font-medium uppercase tracking-wide">
                   Cancel
               </button>
               <button type="submit" className="flex-[2] px-4 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium uppercase tracking-wide shadow-lg shadow-black/5 flex items-center justify-center gap-2">
                   <Check size={14} /> Submit Request
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddLeaveRequestModal;
