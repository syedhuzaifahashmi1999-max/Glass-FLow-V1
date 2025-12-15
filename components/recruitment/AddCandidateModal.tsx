
import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Mail, Phone, Star, Calendar, Globe, Tag } from 'lucide-react';
import { Candidate, CandidateStage } from '../../types';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (candidate: Omit<Candidate, 'id' | 'appliedDate' | 'avatarUrl' | 'interviews'>) => void;
  initialData?: Candidate;
}

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    stage: CandidateStage.APPLIED,
    rating: 0,
    source: 'LinkedIn',
    currentCompany: '',
    skills: ''
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (initialData) {
        setFormData({
          name: initialData.name,
          role: initialData.role,
          email: initialData.email,
          phone: initialData.phone,
          stage: initialData.stage,
          rating: initialData.rating,
          source: initialData.source || 'LinkedIn',
          currentCompany: initialData.currentCompany || '',
          skills: initialData.skills?.join(', ') || ''
        });
      } else {
        setFormData({
          name: '',
          role: '',
          email: '',
          phone: '',
          stage: CandidateStage.APPLIED,
          rating: 0,
          source: 'LinkedIn',
          currentCompany: '',
          skills: ''
        });
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialData]);

  if (!isVisible && !isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      stage: formData.stage,
      rating: Number(formData.rating),
      source: formData.source,
      currentCompany: formData.currentCompany,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
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
             <h2 className="text-lg font-light text-black tracking-tight">{initialData ? 'Edit Candidate' : 'Add Candidate'}</h2>
             <p className="text-xs text-gray-500">Enter applicant details to track in ATS.</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
           <form onSubmit={handleSubmit} className="space-y-5">
             
             {/* Personal Info */}
             <div className="space-y-4">
                <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Candidate Name <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            name="name" 
                            required 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                            placeholder="e.g. Jane Doe"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Role Applied For <span className="text-red-400">*</span></label>
                        <div className="relative">
                            <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                name="role" 
                                required 
                                value={formData.role} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black" 
                                placeholder="e.g. Product Designer"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Current Company</label>
                        <div className="relative">
                            <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                name="currentCompany" 
                                value={formData.currentCompany} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black" 
                                placeholder="e.g. Acme Inc."
                            />
                        </div>
                    </div>
                </div>
             </div>

             {/* Contact Info */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                     <div className="relative">
                         <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="email" 
                            type="email"
                            value={formData.email} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black" 
                            placeholder="email@example.com"
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Phone</label>
                     <div className="relative">
                         <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black" 
                            placeholder="+1..."
                         />
                     </div>
                 </div>
             </div>

             {/* Skills & Source */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Skills (Comma Separated)</label>
                <div className="relative">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        name="skills" 
                        value={formData.skills} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black" 
                        placeholder="React, Figma, Leadership..."
                    />
                </div>
             </div>

             {/* Status & Rating */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Stage</label>
                     <select 
                        name="stage" 
                        value={formData.stage} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-black appearance-none"
                     >
                        {Object.values(CandidateStage).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                     </select>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Source</label>
                     <select 
                        name="source" 
                        value={formData.source} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-black appearance-none"
                     >
                        <option>LinkedIn</option>
                        <option>Referral</option>
                        <option>Website</option>
                        <option>Agency</option>
                     </select>
                 </div>
             </div>

             <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-all text-xs font-medium">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium shadow-lg shadow-black/5">
                   {initialData ? 'Update Profile' : 'Add Candidate'}
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddCandidateModal;
