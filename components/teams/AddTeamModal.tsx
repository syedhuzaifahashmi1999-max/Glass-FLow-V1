
import React, { useState, useEffect } from 'react';
import { X, Share2, AlignLeft, User, Users, Tag, Check } from 'lucide-react';
import { Team, Employee } from '../../types';

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (team: Omit<Team, 'id'>) => void;
  initialData?: Team;
  employees: Employee[];
}

const AddTeamModal: React.FC<AddTeamModalProps> = ({ isOpen, onClose, onSave, initialData, employees }) => {
  const [formData, setFormData] = useState<Partial<Team>>({
    name: '',
    description: '',
    leadId: '',
    memberIds: [],
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
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
            leadId: '',
            memberIds: [],
            tags: []
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

  const toggleMember = (employeeId: string) => {
      setFormData(prev => {
          const currentMembers = prev.memberIds || [];
          if (currentMembers.includes(employeeId)) {
              return { ...prev, memberIds: currentMembers.filter(id => id !== employeeId) };
          } else {
              return { ...prev, memberIds: [...currentMembers, employeeId] };
          }
      });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && tagInput.trim()) {
          e.preventDefault();
          setFormData(prev => ({
              ...prev,
              tags: [...(prev.tags || []), tagInput.trim()]
          }));
          setTagInput('');
      }
  };

  const removeTag = (tagToRemove: string) => {
      setFormData(prev => ({
          ...prev,
          tags: (prev.tags || []).filter(t => t !== tagToRemove)
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
        name: formData.name || 'New Team',
        description: formData.description || '',
        leadId: formData.leadId || '',
        memberIds: formData.memberIds || [],
        tags: formData.tags || []
    });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`
            relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] 
            transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black tracking-tight">{initialData ? 'Edit Team' : 'Create New Team'}</h2>
             <p className="text-xs text-gray-500">Form a squad for cross-functional projects.</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="overflow-y-auto custom-scrollbar flex-1">
           <form onSubmit={handleSubmit} className="p-6 space-y-6">
             
             {/* Name */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Team Name <span className="text-red-400">*</span></label>
                <div className="relative">
                    <Share2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        name="name" 
                        required 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                        placeholder="e.g. Growth Hacking"
                    />
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
                        placeholder="Purpose and goals of this team..."
                    />
                </div>
             </div>

             {/* Team Lead */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Team Lead</label>
                <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                        name="leadId" 
                        value={formData.leadId} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors appearance-none"
                    >
                        <option value="">Select Lead...</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                        ))}
                    </select>
                </div>
             </div>

             {/* Members Multi-select */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-2">Team Members</label>
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto custom-scrollbar p-1">
                    {employees.map(emp => {
                        const isSelected = formData.memberIds?.includes(emp.id);
                        return (
                            <div 
                                key={emp.id} 
                                onClick={() => toggleMember(emp.id)}
                                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${isSelected ? 'bg-black/5' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <img src={emp.avatarUrl} className="w-6 h-6 rounded-full" alt="" />
                                    <div>
                                        <div className="text-xs font-medium text-black">{emp.name}</div>
                                        <div className="text-[10px] text-gray-500">{emp.role}</div>
                                    </div>
                                </div>
                                {isSelected && <Check size={14} className="text-black" />}
                            </div>
                        );
                    })}
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5 text-right">{formData.memberIds?.length || 0} members selected</p>
             </div>

             {/* Tags */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Tags</label>
                <div className="relative">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                        placeholder="Type and press Enter..."
                    />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags?.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-xs text-black">
                            #{tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={10} /></button>
                        </span>
                    ))}
                </div>
             </div>

             <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-all text-xs font-medium">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium shadow-lg shadow-black/5">
                   {initialData ? 'Update Team' : 'Create Team'}
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddTeamModal;
