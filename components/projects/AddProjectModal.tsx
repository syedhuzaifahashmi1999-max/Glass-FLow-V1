
import React, { useState, useEffect } from 'react';
import { X, FolderKanban, Building2, Calendar, DollarSign, Flag, Layers, Tag, FileText, Share2 } from 'lucide-react';
import { Project, Team } from '../../types';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id' | 'members' | 'progress'>) => void;
  teams: Team[];
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onSave, teams }) => {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    startDate: '',
    dueDate: '',
    budget: '',
    status: 'Planning' as Project['status'],
    priority: 'Medium' as Project['priority'],
    category: 'Web' as Project['category'],
    tags: '',
    description: '',
    teamId: ''
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      client: formData.client,
      startDate: new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dueDate: new Date(formData.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      budget: `$${formData.budget}`,
      status: formData.status,
      priority: formData.priority,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      description: formData.description,
      teamId: formData.teamId || undefined
    });
    
    // Reset
    setFormData({
        name: '',
        client: '',
        startDate: '',
        dueDate: '',
        budget: '',
        status: 'Planning',
        priority: 'Medium',
        category: 'Web',
        tags: '',
        description: '',
        teamId: ''
    });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
         
         <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black tracking-tight">Create New Project</h2>
             <p className="text-xs text-gray-500 font-light mt-0.5">Define project scope, timeline, and resources.</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="overflow-y-auto custom-scrollbar flex-1">
           <form onSubmit={handleSubmit} className="p-8 space-y-6">
             
             {/* Core Info */}
             <div className="space-y-4">
               <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold border-b border-gray-100 pb-2">Project Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Project Name <span className="text-red-400">*</span></label>
                     <div className="relative">
                       <FolderKanban size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input name="name" required value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" placeholder="e.g. Website Redesign" />
                     </div>
                  </div>
                  <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Client <span className="text-red-400">*</span></label>
                     <div className="relative">
                       <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input name="client" required value={formData.client} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" placeholder="e.g. Acme Corp" />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Category</label>
                     <div className="relative">
                       <Layers size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none">
                          <option value="Web">Web Development</option>
                          <option value="Mobile">Mobile App</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Design">Design</option>
                          <option value="Internal">Internal</option>
                       </select>
                     </div>
                  </div>
                  <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Priority</label>
                     <div className="relative">
                       <Flag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <select name="priority" value={formData.priority} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none">
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                       </select>
                     </div>
                  </div>
               </div>
             </div>

             {/* Planning */}
             <div className="space-y-4 pt-2">
                <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold border-b border-gray-100 pb-2">Planning & Budget</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Start Date</label>
                     <div className="relative">
                       <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input name="startDate" type="date" required value={formData.startDate} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" />
                     </div>
                   </div>
                   <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Due Date</label>
                     <div className="relative">
                       <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input name="dueDate" type="date" required value={formData.dueDate} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" />
                     </div>
                   </div>
                   <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Budget</label>
                     <div className="relative">
                       <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input name="budget" type="number" value={formData.budget} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" placeholder="0.00" />
                     </div>
                   </div>
                </div>
             </div>

             {/* Team & Details */}
             <div className="space-y-4 pt-2">
                <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold border-b border-gray-100 pb-2">Resources</h3>
                
                <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Assigned Team</label>
                    <div className="relative">
                        <Share2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            name="teamId" 
                            value={formData.teamId} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                        >
                            <option value="">Select a team (optional)</option>
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>{team.name} ({team.memberIds.length} members)</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Description</label>
                    <div className="relative">
                        <FileText size={14} className="absolute left-3 top-3 text-gray-400" />
                        <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent resize-none" placeholder="Brief project description..." />
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Tags</label>
                    <div className="relative">
                        <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" placeholder="Comma separated tags..." />
                    </div>
                </div>
             </div>

             <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-all text-xs font-medium">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-all text-xs font-medium shadow-lg shadow-black/5">Create Project</button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddProjectModal;
