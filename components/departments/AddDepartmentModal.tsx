
import React, { useState, useEffect } from 'react';
import { X, Building2, User, DollarSign, MapPin, Target, AlignLeft } from 'lucide-react';
import { Department, Employee } from '../../types';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (department: Omit<Department, 'id'>) => void;
  initialData?: Department;
  employees: Employee[];
}

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({ isOpen, onClose, onSave, initialData, employees }) => {
  const [formData, setFormData] = useState<Partial<Department>>({
    name: '',
    description: '',
    managerId: '',
    budget: 0,
    targetHeadcount: 0,
    location: '',
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
            description: '',
            managerId: '',
            budget: 0,
            targetHeadcount: 0,
            location: '',
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
    setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'budget' || name === 'targetHeadcount' ? Number(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<Department, 'id'>);
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
             <h2 className="text-lg font-light text-black tracking-tight">{initialData ? 'Edit Department' : 'New Department'}</h2>
             <p className="text-xs text-gray-500">Configure department details and resources.</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="overflow-y-auto custom-scrollbar flex-1">
           <form onSubmit={handleSubmit} className="p-6 space-y-6">
             
             {/* Name & Location */}
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Department Name <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            name="name" 
                            required 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                            placeholder="e.g. Innovation"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Location</label>
                    <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            name="location" 
                            value={formData.location} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                            placeholder="e.g. HQ"
                        />
                    </div>
                </div>
             </div>

             {/* Manager */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Department Head</label>
                <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                        name="managerId" 
                        value={formData.managerId} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors appearance-none"
                    >
                        <option value="">Select Manager...</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                    </select>
                </div>
             </div>

             {/* Budget & Target */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Annual Budget</label>
                     <div className="relative">
                         <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="budget" 
                            type="number"
                            min="0"
                            value={formData.budget} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                            placeholder="0"
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Target Headcount</label>
                     <div className="relative">
                         <Target size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="targetHeadcount" 
                            type="number"
                            min="0"
                            value={formData.targetHeadcount} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                            placeholder="0"
                         />
                     </div>
                 </div>
             </div>

             {/* Description */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Description</label>
                <div className="relative">
                    <AlignLeft size={14} className="absolute left-3 top-3 text-gray-400" />
                    <textarea 
                        name="description" 
                        rows={3}
                        value={formData.description} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors resize-none" 
                        placeholder="Mission and responsibilities..."
                    />
                </div>
             </div>

             <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-all text-xs font-medium">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium shadow-lg shadow-black/5">
                   {initialData ? 'Update Department' : 'Create Department'}
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddDepartmentModal;
