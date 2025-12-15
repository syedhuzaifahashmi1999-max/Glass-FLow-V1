
import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Calendar, Flag, Tag, FileText, User, Layers, FolderKanban } from 'lucide-react';
import { Task, TaskStatus, Project } from '../../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  projects?: Project[];
  preselectedProject?: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave, projects = [], preselectedProject }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: 'Medium' as Task['priority'],
    dueDate: '',
    assigneeName: '',
    project: preselectedProject || '',
    tags: ''
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Reset form when opening, keeping preselected project if exists
      setFormData(prev => ({
          ...prev, 
          project: preselectedProject || prev.project
      }));
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, preselectedProject]);

  if (!isVisible && !isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date',
      assigneeName: formData.assigneeName,
      assignee: formData.assigneeName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.assigneeName)}&background=random` : undefined,
      project: formData.project,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    
    // Reset core fields
    setFormData({
        title: '',
        description: '',
        status: TaskStatus.TODO,
        priority: 'Medium',
        dueDate: '',
        assigneeName: '',
        project: preselectedProject || '',
        tags: ''
    });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black tracking-tight">New Task</h2>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="overflow-y-auto custom-scrollbar flex-1">
           <form onSubmit={handleSubmit} className="p-6 space-y-5">
             
             {/* Title */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Task Title <span className="text-red-400">*</span></label>
                <div className="relative">
                    <CheckSquare size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        name="title" 
                        required 
                        value={formData.title} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                        placeholder="What needs to be done?" 
                        autoFocus
                    />
                </div>
             </div>

             {/* Project & Status */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Project</label>
                     <div className="relative">
                         <FolderKanban size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         {preselectedProject ? (
                             <input 
                                disabled 
                                value={preselectedProject} 
                                className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                             />
                         ) : (
                             <select 
                                name="project" 
                                value={formData.project} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                             >
                                <option value="">No Project</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.name}>{p.name}</option>
                                ))}
                             </select>
                         )}
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Status</label>
                     <div className="relative">
                         <Layers size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                         >
                            {Object.values(TaskStatus).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                         </select>
                     </div>
                 </div>
             </div>

             {/* Priority & Due Date */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Priority</label>
                     <div className="relative">
                         <Flag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <select 
                            name="priority" 
                            value={formData.priority} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                         >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                         </select>
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Due Date</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="dueDate" 
                            type="date" 
                            value={formData.dueDate} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                         />
                     </div>
                 </div>
             </div>

             {/* Assignee */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Assignee</label>
                <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        name="assigneeName" 
                        value={formData.assigneeName} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                        placeholder="e.g. Alex Doe"
                    />
                </div>
             </div>

             {/* Tags */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Tags</label>
                <div className="relative">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        name="tags" 
                        value={formData.tags} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                        placeholder="Comma separated tags..."
                    />
                </div>
             </div>

             {/* Description */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Description</label>
                <div className="relative">
                    <FileText size={14} className="absolute left-3 top-3 text-gray-400" />
                    <textarea 
                        name="description" 
                        rows={3} 
                        value={formData.description} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent resize-none" 
                        placeholder="Add details..."
                    />
                </div>
             </div>

             <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-all text-xs font-medium">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-all text-xs font-medium shadow-lg shadow-black/5">Create Task</button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddTaskModal;
