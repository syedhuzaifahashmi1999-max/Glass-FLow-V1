
import React, { useState, useEffect } from 'react';
import { X, Check, Monitor, Tag, DollarSign, Calendar, User, AlignLeft, Hash, ShieldCheck, FileText } from 'lucide-react';
import { Asset, Employee } from '../../types';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Omit<Asset, 'id'>) => void;
  employees: Employee[];
  initialData?: Asset;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose, onSave, employees, initialData }) => {
  const [formData, setFormData] = useState<Partial<Asset>>({
    name: '',
    category: 'Hardware',
    serialNumber: '',
    status: 'Available',
    purchaseDate: new Date().toISOString().split('T')[0],
    value: 0,
    assignedTo: '',
    notes: '',
    warrantyDate: ''
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
            category: 'Hardware',
            serialNumber: '',
            status: 'Available',
            purchaseDate: new Date().toISOString().split('T')[0],
            value: 0,
            assignedTo: '',
            notes: '',
            warrantyDate: ''
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
        [name]: name === 'value' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedEmp = employees.find(emp => emp.id === formData.assignedTo);
    
    onSave({
      name: formData.name || 'Unknown Asset',
      category: formData.category as any,
      serialNumber: formData.serialNumber,
      status: formData.status as any,
      purchaseDate: formData.purchaseDate || '',
      value: formData.value || 0,
      assignedTo: formData.assignedTo,
      assignedToName: assignedEmp ? assignedEmp.name : undefined,
      avatarUrl: initialData?.avatarUrl || 'https://images.unsplash.com/photo-1550009158-9ebf690be6f4?auto=format&fit=crop&q=80&w=100', // Generic placeholder
      notes: formData.notes,
      warrantyDate: formData.warrantyDate
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
             <h2 className="text-lg font-light text-black tracking-tight">{initialData ? 'Edit Asset' : 'Add New Asset'}</h2>
             <p className="text-xs text-gray-500">Track equipment details and assignment.</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="p-6 overflow-y-auto custom-scrollbar max-h-[80vh]">
           <form onSubmit={handleSubmit} className="space-y-5">
             
             {/* Name */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Asset Name <span className="text-red-400">*</span></label>
                <div className="relative">
                    <Monitor size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        name="name" 
                        required 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                        placeholder="e.g. MacBook Pro 16" 
                    />
                </div>
             </div>

             {/* Category & Status */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Category</label>
                     <div className="relative">
                         <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <select 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                         >
                            <option value="Hardware">Hardware</option>
                            <option value="Software">Software</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Vehicle">Vehicle</option>
                         </select>
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Status</label>
                     <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                     >
                        <option value="Available">Available</option>
                        <option value="In Use">In Use</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Retired">Retired</option>
                     </select>
                 </div>
             </div>

             {/* Serial & Value */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Serial Number</label>
                     <div className="relative">
                         <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="serialNumber" 
                            value={formData.serialNumber} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                            placeholder="SN-12345" 
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Value</label>
                     <div className="relative">
                         <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="value" 
                            type="number"
                            min="0"
                            value={formData.value} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                            placeholder="0.00" 
                         />
                     </div>
                 </div>
             </div>

             {/* Dates */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Purchase Date</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="purchaseDate" 
                            type="date"
                            value={formData.purchaseDate} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Warranty Until</label>
                     <div className="relative">
                         <ShieldCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="warrantyDate" 
                            type="date"
                            value={formData.warrantyDate} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                         />
                     </div>
                 </div>
             </div>

             {/* Assignment */}
             <div>
                 <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Assigned To</label>
                 <div className="relative">
                     <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <select 
                        name="assignedTo" 
                        value={formData.assignedTo} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                     >
                        <option value="">Unassigned</option>
                        {employees.map(e => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                     </select>
                 </div>
             </div>

             {/* Notes */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Notes</label>
                <div className="relative">
                    <FileText size={14} className="absolute left-3 top-3 text-gray-400" />
                    <textarea 
                        name="notes" 
                        rows={2}
                        value={formData.notes} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent resize-none" 
                        placeholder="Condition, maintenance history..." 
                    />
                </div>
             </div>

             <div className="pt-4 flex gap-3 border-t border-gray-100 mt-2">
               <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 transition-all text-xs font-medium uppercase tracking-wide">
                   Cancel
               </button>
               <button type="submit" className="flex-[2] px-4 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium uppercase tracking-wide shadow-lg shadow-black/5 flex items-center justify-center gap-2">
                   <Check size={14} /> {initialData ? 'Update Asset' : 'Add Asset'}
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddAssetModal;
