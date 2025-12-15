
import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Mail, Phone, MapPin, Calendar, Building, ShieldCheck, CreditCard, Heart, FileText, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Employee } from '../../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Omit<Employee, 'id'>) => void;
  initialData?: Employee;
}

type TabType = 'professional' | 'personal' | 'contact' | 'financial';

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [activeTab, setActiveTab] = useState<TabType>('professional');
  const [isVisible, setIsVisible] = useState(false);

  // Initial State
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    location: '',
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-Time',
    manager: '',
    gender: '',
    dob: '',
    nationality: '',
    address: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    bankName: '',
    accountNumber: '',
    salary: ''
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setActiveTab('professional');
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        // Reset to defaults
        setFormData({
            name: '',
            role: '',
            department: '',
            email: '',
            phone: '',
            location: '',
            status: 'Active',
            joinDate: new Date().toISOString().split('T')[0],
            employmentType: 'Full-Time',
            manager: '',
            gender: 'Prefer not to say',
            dob: '',
            nationality: '',
            address: '',
            emergencyContactName: '',
            emergencyContactRelation: '',
            emergencyContactPhone: '',
            bankName: '',
            accountNumber: '',
            salary: ''
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
      name: formData.name || 'Unknown',
      role: formData.role || 'Employee',
      department: formData.department || 'General',
      email: formData.email || '',
      phone: formData.phone || '',
      location: formData.location || '',
      status: formData.status as any || 'Active',
      joinDate: formData.joinDate || new Date().toISOString().split('T')[0],
      avatarUrl: initialData?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=random&color=fff`,
      
      // Extended fields
      employmentType: formData.employmentType as any,
      manager: formData.manager,
      gender: formData.gender,
      dob: formData.dob,
      nationality: formData.nationality,
      address: formData.address,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactRelation: formData.emergencyContactRelation,
      emergencyContactPhone: formData.emergencyContactPhone,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      salary: formData.salary
    });
    onClose();
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
      { id: 'professional', label: 'Professional', icon: Briefcase },
      { id: 'personal', label: 'Personal Info', icon: User },
      { id: 'contact', label: 'Contact & Emergency', icon: Phone },
      { id: 'financial', label: 'Financial', icon: CreditCard },
  ];

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`
            relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[85vh] 
            transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         
         {/* Header */}
         <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
           <div>
             <h2 className="text-xl font-light text-black tracking-tight">{initialData ? 'Edit Employee Profile' : 'New Employee Onboarding'}</h2>
             <p className="text-xs text-gray-500 font-light mt-0.5">Complete the form below to update the system directory.</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={20} strokeWidth={1.5} />
           </button>
         </div>

         <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-64 bg-gray-50/50 border-r border-gray-100 flex-shrink-0 flex flex-col pt-6 px-4 gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-medium transition-all text-left
                            ${activeTab === tab.id 
                                ? 'bg-white text-black shadow-sm border border-gray-100' 
                                : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-800'}
                        `}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? 'text-black' : 'text-gray-400'} />
                        {tab.label}
                        {activeTab === tab.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
                    </button>
                ))}
            </div>
         
            {/* Form Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                <form id="employee-form" onSubmit={handleSubmit} className="p-8 max-w-3xl mx-auto">
                    
                    {/* PROFESSIONAL TAB */}
                    {activeTab === 'professional' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-2">
                                <Briefcase size={18} className="text-gray-400" />
                                <h3 className="text-sm font-medium text-black uppercase tracking-wide">Employment Details</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                                    <input 
                                        name="name" 
                                        required 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                        placeholder="e.g. Jonathan Ive"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Job Title <span className="text-red-400">*</span></label>
                                    <input 
                                        name="role" 
                                        required
                                        value={formData.role} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                        placeholder="e.g. Senior Designer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Department</label>
                                    <select 
                                        name="department" 
                                        value={formData.department} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors appearance-none"
                                    >
                                        <option value="">Select Department...</option>
                                        <option value="Design">Design</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Operations">Operations</option>
                                        <option value="HR">Human Resources</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Employment Type</label>
                                    <select 
                                        name="employmentType" 
                                        value={formData.employmentType} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors appearance-none"
                                    >
                                        <option value="Full-Time">Full-Time</option>
                                        <option value="Part-Time">Part-Time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Intern">Intern</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Reporting Manager</label>
                                    <input 
                                        name="manager" 
                                        value={formData.manager} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                        placeholder="e.g. Sarah Connor"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Date of Joining</label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            name="joinDate" 
                                            type="date"
                                            value={formData.joinDate} 
                                            onChange={handleChange} 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Current Status</label>
                                    <select 
                                        name="status" 
                                        value={formData.status} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors appearance-none"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="On Leave">On Leave</option>
                                        <option value="Terminated">Terminated</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PERSONAL TAB */}
                    {activeTab === 'personal' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-2">
                                <User size={18} className="text-gray-400" />
                                <h3 className="text-sm font-medium text-black uppercase tracking-wide">Personal Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Date of Birth</label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            name="dob" 
                                            type="date"
                                            value={formData.dob} 
                                            onChange={handleChange} 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Gender</label>
                                    <select 
                                        name="gender" 
                                        value={formData.gender} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors appearance-none"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Non-binary">Non-binary</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Nationality</label>
                                    <input 
                                        name="nationality" 
                                        value={formData.nationality} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                        placeholder="e.g. American"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONTACT TAB */}
                    {activeTab === 'contact' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            
                            {/* Contact Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-gray-50 pb-2">
                                    <Phone size={18} className="text-gray-400" />
                                    <h3 className="text-sm font-medium text-black uppercase tracking-wide">Contact Details</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Work Email <span className="text-red-400">*</span></label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input 
                                                name="email" 
                                                type="email"
                                                required
                                                value={formData.email} 
                                                onChange={handleChange} 
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                                placeholder="alex@glassflow.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Phone Number</label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input 
                                                name="phone" 
                                                value={formData.phone} 
                                                onChange={handleChange} 
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Residential Address</label>
                                        <div className="relative">
                                            <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                                            <textarea 
                                                name="address" 
                                                rows={2}
                                                value={formData.address} 
                                                onChange={(e: any) => handleChange(e)} 
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors resize-none" 
                                                placeholder="Street, City, State, Zip Code"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Work Location</label>
                                        <input 
                                            name="location" 
                                            value={formData.location} 
                                            onChange={handleChange} 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                            placeholder="e.g. San Francisco HQ"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-gray-50 pb-2">
                                    <Heart size={18} className="text-gray-400" />
                                    <h3 className="text-sm font-medium text-black uppercase tracking-wide">Emergency Contact</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Contact Name</label>
                                        <input 
                                            name="emergencyContactName" 
                                            value={formData.emergencyContactName} 
                                            onChange={handleChange} 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Relationship</label>
                                        <input 
                                            name="emergencyContactRelation" 
                                            value={formData.emergencyContactRelation} 
                                            onChange={handleChange} 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                            placeholder="e.g. Spouse, Parent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Emergency Phone</label>
                                        <input 
                                            name="emergencyContactPhone" 
                                            value={formData.emergencyContactPhone} 
                                            onChange={handleChange} 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                            placeholder="+1..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FINANCIAL TAB */}
                    {activeTab === 'financial' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-2">
                                <CreditCard size={18} className="text-gray-400" />
                                <h3 className="text-sm font-medium text-black uppercase tracking-wide">Compensation & Banking</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Annual Salary / Rate</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-serif italic">$</span>
                                        <input 
                                            name="salary" 
                                            value={formData.salary} 
                                            onChange={handleChange} 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Bank Name</label>
                                    <div className="relative">
                                        <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            name="bankName" 
                                            value={formData.bankName} 
                                            onChange={handleChange} 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                            placeholder="e.g. Chase Bank"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Account Number</label>
                                    <input 
                                        name="accountNumber" 
                                        type="password"
                                        value={formData.accountNumber} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors" 
                                        placeholder="•••• •••• ••••"
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                                <ShieldCheck size={20} className="text-blue-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-semibold text-blue-700">Sensitive Data</h4>
                                    <p className="text-[10px] text-blue-600 mt-1 leading-relaxed">
                                        Financial information is encrypted at rest. Access is restricted to authorized HR and Finance personnel only.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                </form>
            </div>
         </div>

         {/* Footer Actions */}
         <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 bg-white shrink-0">
            <button 
                type="button" 
                onClick={onClose} 
                className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-all text-xs font-medium"
            >
                Cancel
            </button>
            
            <div className="flex gap-3">
                {activeTab !== 'professional' && (
                    <button 
                        type="button"
                        onClick={() => {
                            const index = tabs.findIndex(t => t.id === activeTab);
                            if (index > 0) setActiveTab(tabs[index - 1].id);
                        }}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all text-xs font-medium flex items-center gap-1"
                    >
                        <ChevronLeft size={14} /> Back
                    </button>
                )}
                
                {activeTab !== 'financial' ? (
                    <button 
                        type="button"
                        onClick={() => {
                            const index = tabs.findIndex(t => t.id === activeTab);
                            if (index < tabs.length - 1) setActiveTab(tabs[index + 1].id);
                        }}
                        className="px-6 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium flex items-center gap-1"
                    >
                        Next Step <ChevronRight size={14} />
                    </button>
                ) : (
                    <button 
                        type="button"
                        onClick={handleSubmit} 
                        className="px-8 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium shadow-lg shadow-black/5 flex items-center gap-2"
                    >
                        <Check size={14} /> {initialData ? 'Update Profile' : 'Onboard Employee'}
                    </button>
                )}
            </div>
         </div>

       </div>
    </div>
  );
};

export default AddEmployeeModal;
