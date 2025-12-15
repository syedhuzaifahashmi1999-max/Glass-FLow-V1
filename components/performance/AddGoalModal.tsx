
import React, { useState, useEffect } from 'react';
import { X, Target, Calendar, User, AlignLeft, Flag, Activity, Check } from 'lucide-react';
import { PerformanceGoal, Employee } from '../../types';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<PerformanceGoal, 'id' | 'employeeName' | 'avatarUrl'>) => void;
  employees: Employee[];
  initialData?: PerformanceGoal;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose, onSave, employees, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    employeeId: '',
    description: '',
    status: 'On Track' as PerformanceGoal['status'],
    priority: 'Medium' as PerformanceGoal['priority'],
    dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +90 days
    progress: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (initialData) {
        setFormData({
            title: initialData.title,
            employeeId: initialData.employeeId,
            description: initialData.description || '',
            status: initialData.status,
            priority: initialData.priority,
            dueDate: initialData.dueDate,
            progress: initialData.progress
        });
      } else {
        setFormData({
            title: '',
            employeeId: '',
            description: '',
            status: 'On Track',
            priority: 'Medium',
            dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            progress: 0
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
      ...formData,
      progress: Number(formData.progress)
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
             <h2 className="text-lg font-light text-black tracking-tight">{initialData ? 'Edit Goal' : 'Set New Goal'}</h2>
             <p className="text-xs text-gray-500">Define objectives and key results (OKRs).</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="p-6 overflow-y-auto custom-scrollbar">
           <form onSubmit={handleSubmit} className="space-y-5">
             
             {/* Title */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Goal Title <span className="text-red-400">*</span></label>
                <div className="relative">
                    <Target size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        name="title" 
                        required 
                        value={formData.title} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                        placeholder="e.g. Increase Q4 Revenue" 
                    />
                </div>
             </div>

             {/* Employee & Priority */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Assignee</label>
                    <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            name="employeeId" 
                            required
                            value={formData.employeeId} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                        >
                            <option value="">Select Employee</option>
                            {employees.map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                    </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Priority</label>
                     <div className="relative">
                         <Flag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <select 
                            name="priority" 
                            value={formData.priority} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                         >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                         </select>
                     </div>
                 </div>
             </div>

             {/* Description */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
                <div className="relative">
                    <AlignLeft size={14} className="absolute left-3 top-3 text-gray-400" />
                    <textarea 
                        name="description" 
                        rows={3}
                        value={formData.description} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent resize-none" 
                        placeholder="Details about success criteria..." 
                    />
                </div>
             </div>

             {/* Status & Date */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Status</label>
                     <div className="relative">
                         <Activity size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                         >
                            <option value="On Track">On Track</option>
                            <option value="At Risk">At Risk</option>
                            <option value="Behind">Behind</option>
                            <option value="Completed">Completed</option>
                         </select>
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Due Date</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="dueDate" 
                            type="date"
                            required
                            value={formData.dueDate} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                         />
                     </div>
                 </div>
             </div>

             {/* Progress Slider */}
             <div>
                <div className="flex justify-between mb-1.5">
                    <label className="block text-[11px] font-medium text-gray-600 uppercase tracking-wide">Progress</label>
                    <span className="text-xs font-mono font-medium">{formData.progress}%</span>
                </div>
                <input 
                    type="range" 
                    name="progress"
                    min="0" 
                    max="100" 
                    value={formData.progress} 
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
             </div>

             <div className="pt-4 flex gap-3 border-t border-gray-100 mt-2">
               <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 transition-all text-xs font-medium uppercase tracking-wide">
                   Cancel
               </button>
               <button type="submit" className="flex-[2] px-4 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium uppercase tracking-wide shadow-lg shadow-black/5 flex items-center justify-center gap-2">
                   <Check size={14} /> {initialData ? 'Update Goal' : 'Create Goal'}
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddGoalModal;
