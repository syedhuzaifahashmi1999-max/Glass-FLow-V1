
import React, { useState, useEffect } from 'react';
import { X, User, Building2, Mail, Phone, DollarSign, Briefcase, Globe, FileText, Hash, Flag, MapPin, Linkedin, Calendar, Percent, Tag, Target } from 'lucide-react';
import { Lead, LeadStage } from '../../types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id' | 'lastActive' | 'avatarUrl'>) => void;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    value: '',
    stage: LeadStage.NEW,
    type: 'Direct Sales' as 'Direct Sales' | 'Project',
    source: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    expectedCloseDate: '',
    probability: '',
    tags: '',
    notes: ''
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
      company: formData.company,
      email: formData.email,
      value: formData.value ? Number(formData.value) : 0,
      stage: formData.stage,
      type: formData.type,
      title: formData.title,
      phone: formData.phone,
      location: formData.location,
      linkedin: formData.linkedin,
      source: formData.source,
      priority: formData.priority,
      expectedCloseDate: formData.expectedCloseDate,
      probability: formData.probability ? Number(formData.probability) : undefined,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      notes: formData.notes
    });
    
    // Reset form
    setFormData({
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      value: '',
      stage: LeadStage.NEW,
      type: 'Direct Sales',
      source: '',
      priority: 'Medium',
      expectedCloseDate: '',
      probability: '',
      tags: '',
      notes: ''
    });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       {/* Backdrop */}
       <div 
         className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
         onClick={onClose}
       />

       {/* Modal Panel */}
       <div className={`
         relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]
         transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)
         ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black tracking-tight">Add New Lead</h2>
             <p className="text-xs text-gray-500 font-light mt-0.5">Enter detailed information to track this opportunity.</p>
           </div>
           <button 
             onClick={onClose}
             className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100"
           >
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="overflow-y-auto custom-scrollbar flex-1">
           <form onSubmit={handleSubmit} className="p-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* LEFT COLUMN: Contact */}
               <div className="space-y-6">
                 <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-4 border-b border-gray-100 pb-2">
                   Contact Information
                 </h3>
                 
                 <div className="space-y-4">
                   {/* Name */}
                   <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                     <div className="relative">
                       <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                         name="name"
                         required
                         value={formData.name}
                         onChange={handleChange}
                         className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all placeholder-gray-300 font-light"
                         placeholder="e.g. Elena Fisher"
                       />
                     </div>
                   </div>

                   {/* Title */}
                   <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Job Title</label>
                     <div className="relative">
                       <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                         name="title"
                         value={formData.title}
                         onChange={handleChange}
                         className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all placeholder-gray-300 font-light"
                         placeholder="e.g. CTO"
                       />
                     </div>
                   </div>

                   {/* Email & Phone */}
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Email <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all placeholder-gray-300 font-light"
                            placeholder="Email address"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Phone</label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all placeholder-gray-300 font-light"
                            placeholder="+1..."
                          />
                        </div>
                      </div>
                   </div>

                   {/* Location */}
                   <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Location</label>
                     <div className="relative">
                       <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                         name="location"
                         value={formData.location}
                         onChange={handleChange}
                         className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all placeholder-gray-300 font-light"
                         placeholder="e.g. San Francisco, CA"
                       />
                     </div>
                   </div>

                   {/* LinkedIn */}
                   <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">LinkedIn URL</label>
                     <div className="relative">
                       <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                         name="linkedin"
                         type="url"
                         value={formData.linkedin}
                         onChange={handleChange}
                         className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all placeholder-gray-300 font-light"
                         placeholder="https://linkedin.com/in/..."
                       />
                     </div>
                   </div>

                 </div>
               </div>

               {/* RIGHT COLUMN: Deal */}
               <div className="space-y-6">
                 <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-4 border-b border-gray-100 pb-2">
                   Deal Details
                 </h3>
                 
                 <div className="space-y-4">
                   {/* Type Selector */}
                   <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Lead Type <span className="text-red-400">*</span></label>
                        <div className="relative">
                           <Target size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                           <select
                              name="type"
                              value={formData.type}
                              onChange={handleChange}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all font-light appearance-none"
                           >
                              <option value="Direct Sales">Direct Sales</option>
                              <option value="Project">Project</option>
                           </select>
                        </div>
                   </div>

                   {/* Company */}
                   <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Company / Account <span className="text-red-400">*</span></label>
                     <div className="relative">
                       <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                         name="company"
                         required
                         value={formData.company}
                         onChange={handleChange}
                         className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all placeholder-gray-300 font-light"
                         placeholder="e.g. Nebula Corp"
                       />
                     </div>
                   </div>

                   {/* Value & Source */}
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Deal Value</label>
                        <div className="relative">
                          <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            name="value"
                            type="number"
                            min="0"
                            value={formData.value}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all placeholder-gray-300 font-light"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Lead Source</label>
                        <div className="relative">
                          <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                           <input 
                            name="source"
                            list="sources"
                            value={formData.source}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all placeholder-gray-300 font-light"
                            placeholder="Select..."
                          />
                          <datalist id="sources">
                            <option value="LinkedIn" />
                            <option value="Website" />
                            <option value="Referral" />
                            <option value="Cold Call" />
                          </datalist>
                        </div>
                      </div>
                   </div>

                   {/* Stage & Priority */}
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Stage</label>
                        <div className="relative">
                           <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                           <select
                              name="stage"
                              value={formData.stage}
                              onChange={handleChange}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all font-light appearance-none"
                           >
                              {Object.values(LeadStage).map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                           </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Priority</label>
                        <div className="relative">
                           <Flag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                           <select
                              name="priority"
                              value={formData.priority}
                              onChange={handleChange}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all font-light appearance-none"
                           >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                           </select>
                        </div>
                      </div>
                   </div>

                   {/* Probability & Close Date */}
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Probability (%)</label>
                        <div className="relative">
                          <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            name="probability"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.probability}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all placeholder-gray-300 font-light"
                            placeholder="e.g. 60"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Expected Close</label>
                        <div className="relative">
                          <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            name="expectedCloseDate"
                            type="date"
                            value={formData.expectedCloseDate}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all font-light"
                          />
                        </div>
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
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all placeholder-gray-300 font-light"
                            placeholder="Enter tags separated by commas..."
                         />
                      </div>
                   </div>

                 </div>
               </div>
             </div>

             {/* Full Width Notes */}
             <div className="mt-6">
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Additional Notes</label>
                <div className="relative">
                   <FileText size={14} className="absolute left-3 top-3 text-gray-400" />
                   <textarea 
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black/20 focus:bg-white transition-all placeholder-gray-300 font-light resize-none"
                      placeholder="Enter any relevant details about this opportunity..."
                   />
                </div>
             </div>
             
             {/* Footer Actions */}
             <div className="pt-8 flex gap-3 justify-end mt-4 border-t border-gray-100">
               <button 
                 type="button"
                 onClick={onClose}
                 className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black hover:border-gray-300 transition-all text-xs font-medium"
               >
                 Cancel
               </button>
               <button 
                 type="submit"
                 className="px-8 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium shadow-lg shadow-black/5"
               >
                 Save Lead
               </button>
             </div>
           </form>
         </div>
       </div>
    </div>
  );
};

export default AddLeadModal;
