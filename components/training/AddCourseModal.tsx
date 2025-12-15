
import React, { useState, useEffect } from 'react';
import { X, BookOpen, Clock, Layers, FileText, Check, Plus, Trash2 } from 'lucide-react';
import { TrainingCourse, TrainingModule } from '../../types';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<TrainingCourse, 'id'>) => void;
  initialData?: TrainingCourse;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<TrainingCourse>>({
    title: '',
    description: '',
    category: 'Technical',
    duration: '',
    status: 'Active',
    modules: []
  });

  // Local state for module editing
  const [modules, setModules] = useState<TrainingModule[]>([]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (initialData) {
        setFormData({ ...initialData });
        setModules(initialData.modules || []);
      } else {
        setFormData({
            title: '',
            description: '',
            category: 'Technical',
            duration: '',
            status: 'Active',
            modules: []
        });
        setModules([{ id: `m-${Date.now()}`, title: '', duration: '', type: 'Video' }]);
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

  const handleModuleChange = (id: string, field: keyof TrainingModule, value: string) => {
      setModules(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addModule = () => {
      setModules([...modules, { id: `m-${Date.now()}`, title: '', duration: '', type: 'Video' }]);
  };

  const removeModule = (id: string) => {
      setModules(prev => prev.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
        ...formData as any,
        modules: modules.filter(m => m.title), // Filter empty ones
        modulesCount: modules.length
    });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`
            relative w-full max-w-2xl bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]
            transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black dark:text-white tracking-tight">{initialData ? 'Edit Course' : 'Add New Course'}</h2>
             <p className="text-xs text-gray-500 dark:text-gray-400">Define training curriculum and details.</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full p-2 hover:bg-gray-100 dark:hover:bg-white/10">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="overflow-y-auto custom-scrollbar flex-1 p-6">
           <form id="course-form" onSubmit={handleSubmit} className="space-y-6">
             
             {/* Basic Info */}
             <div className="space-y-4">
                 <div>
                    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Course Title <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            name="title" 
                            required 
                            value={formData.title} 
                            onChange={handleChange} 
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white" 
                            placeholder="e.g. Advanced Security"
                        />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Category</label>
                        <div className="relative">
                            <Layers size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select 
                                name="category" 
                                value={formData.category} 
                                onChange={handleChange} 
                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white appearance-none"
                            >
                                <option>Compliance</option>
                                <option>Technical</option>
                                <option>Soft Skills</option>
                                <option>Leadership</option>
                                <option>Security</option>
                            </select>
                        </div>
                     </div>
                     <div>
                         <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Total Duration</label>
                         <div className="relative">
                             <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                             <input 
                                name="duration" 
                                value={formData.duration} 
                                onChange={handleChange} 
                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white" 
                                placeholder="e.g. 2h 30m"
                             />
                         </div>
                     </div>
                 </div>

                 <div>
                    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Description</label>
                    <div className="relative">
                        <FileText size={14} className="absolute left-3 top-3 text-gray-400" />
                        <textarea 
                            name="description" 
                            rows={3}
                            value={formData.description} 
                            onChange={handleChange} 
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white resize-none" 
                            placeholder="Course objectives..."
                        />
                    </div>
                 </div>
             </div>

             {/* Modules Builder */}
             <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                 <div className="flex justify-between items-center mb-3">
                     <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Modules</label>
                     <button type="button" onClick={addModule} className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                         <Plus size={12} /> Add Module
                     </button>
                 </div>
                 <div className="space-y-3">
                     {modules.map((mod, idx) => (
                         <div key={mod.id} className="flex gap-2 items-start animate-in fade-in slide-in-from-top-1">
                             <span className="text-xs text-gray-400 pt-2.5 w-4 text-center">{idx + 1}</span>
                             <div className="flex-1">
                                 <input 
                                     placeholder="Module Title"
                                     value={mod.title}
                                     onChange={(e) => handleModuleChange(mod.id, 'title', e.target.value)}
                                     className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                                 />
                             </div>
                             <div className="w-24">
                                 <select
                                     value={mod.type}
                                     onChange={(e) => handleModuleChange(mod.id, 'type', e.target.value)}
                                     className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-2 text-xs text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white appearance-none"
                                 >
                                     <option>Video</option>
                                     <option>Quiz</option>
                                     <option>Reading</option>
                                 </select>
                             </div>
                             <div className="w-20">
                                 <input 
                                     placeholder="Time"
                                     value={mod.duration}
                                     onChange={(e) => handleModuleChange(mod.id, 'duration', e.target.value)}
                                     className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-2 text-xs text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white text-center"
                                 />
                             </div>
                             <button type="button" onClick={() => removeModule(mod.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                 <Trash2 size={14} />
                             </button>
                         </div>
                     ))}
                 </div>
             </div>

           </form>
         </div>

         {/* Footer */}
         <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-all text-xs font-medium uppercase tracking-wide">Cancel</button>
            <button type="submit" form="course-form" className="px-6 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all text-xs font-medium uppercase tracking-wide flex items-center justify-center gap-2">
                <Check size={14} /> {initialData ? 'Update Course' : 'Create Course'}
            </button>
         </div>

       </div>
    </div>
  );
};

export default AddCourseModal;
