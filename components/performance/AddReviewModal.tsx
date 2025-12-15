
import React, { useState, useEffect } from 'react';
import { X, User, Calendar, MessageSquare, Check, Award, Star } from 'lucide-react';
import { PerformanceReview, Employee } from '../../types';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (review: Partial<PerformanceReview>) => void;
  employees: Employee[];
  initialData?: PerformanceReview;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({ isOpen, onClose, onSave, employees, initialData }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    reviewerName: '',
    cycle: 'Q4 2024',
    date: new Date().toISOString().split('T')[0],
    rating: 0,
    status: 'Scheduled' as PerformanceReview['status'],
    feedback: ''
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (initialData) {
        setFormData({
            employeeId: initialData.employeeId,
            reviewerName: initialData.reviewerName,
            cycle: initialData.cycle,
            date: initialData.date,
            rating: initialData.rating,
            status: initialData.status,
            feedback: initialData.feedback || ''
        });
      } else {
        setFormData({
            employeeId: '',
            reviewerName: '',
            cycle: 'Q4 2024',
            date: new Date().toISOString().split('T')[0],
            rating: 0,
            status: 'Scheduled',
            feedback: ''
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
    onSave(formData);
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
             <h2 className="text-lg font-light text-black tracking-tight">{initialData ? 'Edit Review' : 'Schedule Review'}</h2>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="p-6 overflow-y-auto custom-scrollbar max-h-[80vh]">
           <form onSubmit={handleSubmit} className="space-y-5">
             
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Employee</label>
                <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                        name="employeeId" 
                        required
                        value={formData.employeeId} 
                        onChange={handleChange} 
                        className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-black focus:outline-none focus:border-black appearance-none"
                    >
                        <option value="">Select Employee</option>
                        {employees.map(e => (
                            <option key={e.id} value={e.id}>{e.name} - {e.role}</option>
                        ))}
                    </select>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Review Cycle</label>
                     <div className="relative">
                         <Award size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <select 
                            name="cycle" 
                            value={formData.cycle} 
                            onChange={handleChange} 
                            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black appearance-none"
                         >
                            <option>Q1 2024</option>
                            <option>Q2 2024</option>
                            <option>Q3 2024</option>
                            <option>Q4 2024</option>
                            <option>Annual 2024</option>
                            <option>Probation</option>
                         </select>
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Date</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="date" 
                            type="date"
                            required
                            value={formData.date} 
                            onChange={handleChange} 
                            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black" 
                         />
                     </div>
                 </div>
             </div>

             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Reviewer Name</label>
                <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        name="reviewerName" 
                        required
                        value={formData.reviewerName} 
                        onChange={handleChange} 
                        placeholder="e.g. Maria Garcia"
                        className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-black focus:outline-none focus:border-black"
                    />
                </div>
             </div>

             {/* Rating & Status Section - Only relevant if editing/completing */}
             <div className="border-t border-gray-100 pt-4 mt-4">
                 <div className="grid grid-cols-2 gap-4 mb-4">
                     <div>
                         <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Status</label>
                         <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange} 
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-black appearance-none"
                         >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Draft">Draft</option>
                         </select>
                     </div>
                     <div>
                         <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Overall Rating (1-5)</label>
                         <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1.5">
                             {[1, 2, 3, 4, 5].map(star => (
                                 <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData(prev => ({...prev, rating: star}))}
                                    className="p-1 hover:scale-110 transition-transform"
                                 >
                                     <Star 
                                        size={16} 
                                        className={star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} 
                                     />
                                 </button>
                             ))}
                         </div>
                     </div>
                 </div>

                 <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Feedback & Notes</label>
                    <div className="relative">
                        <MessageSquare size={14} className="absolute left-3 top-3 text-gray-400" />
                        <textarea 
                            name="feedback" 
                            rows={3}
                            value={formData.feedback} 
                            onChange={handleChange} 
                            placeholder="Performance summary..."
                            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black resize-none"
                        />
                    </div>
                 </div>
             </div>

             <div className="pt-4 flex gap-3 border-t border-gray-100">
               <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 transition-all text-xs font-medium uppercase tracking-wide">
                   Cancel
               </button>
               <button type="submit" className="flex-[2] px-4 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium uppercase tracking-wide shadow-lg shadow-black/5 flex items-center justify-center gap-2">
                   <Check size={14} /> {initialData ? 'Update Review' : 'Schedule'}
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddReviewModal;
