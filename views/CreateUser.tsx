
import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Camera, UploadCloud, User, Mail, Phone, MapPin, 
  Briefcase, Building2, Calendar, Shield, Lock, Eye, EyeOff, 
  CheckCircle, Save, X, UserPlus 
} from 'lucide-react';
import { Employee, Role } from '../types';
import { MOCK_ROLES, MOCK_DEPARTMENTS } from '../constants';

interface CreateUserProps {
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

const CreateUser: React.FC<CreateUserProps> = ({ onSave, onCancel }) => {
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    role: '', // Job Title
    systemRole: 'Viewer', // Permission Role
    department: 'Engineering',
    joinDate: new Date().toISOString().split('T')[0],
    password: '',
    confirmPassword: '',
    sendWelcomeEmail: true,
    avatarUrl: ''
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target?.result) {
                  setFormData(prev => ({ ...prev, avatarUrl: event.target?.result as string }));
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Basic validation
      if (!formData.firstName || !formData.lastName || !formData.email) {
          alert("Please fill in all required fields.");
          return;
      }
      if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match.");
          return;
      }

      // Create Employee Object
      const newEmployee: Employee = {
          id: `E-${Date.now().toString().slice(-4)}`,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          role: formData.role || 'Employee', // Job Title
          department: formData.department,
          joinDate: formData.joinDate,
          status: 'Active',
          avatarUrl: formData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.firstName + ' ' + formData.lastName)}&background=random&color=fff`,
          // Note: Password and System Role would typically be handled by a distinct auth service/table
      };

      onSave(newEmployee);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/50 dark:bg-[#18181b] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
          <div className="px-8 py-6">
              <button 
                onClick={onCancel}
                className="group flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
              >
                  <div className="p-1 rounded-full bg-gray-100 dark:bg-white/10 group-hover:bg-gray-200 dark:group-hover:bg-white/20 transition-colors">
                    <ArrowLeft size={12} />
                  </div>
                  <span>Back to Employees</span>
              </button>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-900 to-black dark:from-white dark:to-gray-200 text-white dark:text-black flex items-center justify-center shadow-xl shadow-black/5 dark:shadow-white/5">
                          <UserPlus size={28} strokeWidth={1.5} />
                      </div>
                      <div>
                          <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight">Create User Profile</h1>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Onboard a new team member and configure access.</p>
                      </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                      <button 
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium transition-all"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={handleSubmit}
                        className="px-6 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 text-sm font-bold shadow-lg shadow-black/10 dark:shadow-white/10 flex items-center gap-2 transition-transform active:scale-95"
                      >
                          <CheckCircle size={18} /> Create Account
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Col: Avatar & Basic Info */}
              <div className="space-y-6">
                  
                  {/* Avatar Card */}
                  <div className="bg-white dark:bg-[#18181b] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center text-center">
                      <div className="relative group cursor-pointer mb-4" onClick={() => fileInputRef.current?.click()}>
                          <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-white/5 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center overflow-hidden">
                              {formData.avatarUrl ? (
                                  <img src={formData.avatarUrl} className="w-full h-full object-cover" />
                              ) : (
                                  <User size={48} className="text-gray-300 dark:text-gray-600" />
                              )}
                          </div>
                          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera className="text-white" size={24} />
                          </div>
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                      </div>
                      <h3 className="text-sm font-bold text-black dark:text-white">Profile Photo</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">Allowed *.jpeg, *.jpg, *.png, *.gif</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-medium text-black dark:text-white border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
                      >
                        <UploadCloud size={14} /> Upload Image
                      </button>
                  </div>

                  {/* Contact Info Card */}
                  <div className="bg-white dark:bg-[#18181b] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" /> Contact Details
                      </h3>
                      
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email Address <span className="text-red-500">*</span></label>
                          <div className="relative">
                              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                  name="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  placeholder="john.doe@company.com"
                                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
                              />
                          </div>
                      </div>

                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Phone Number</label>
                          <div className="relative">
                              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                  name="phone"
                                  type="tel"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  placeholder="+1 (555) 000-0000"
                                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
                              />
                          </div>
                      </div>

                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Office Location</label>
                          <div className="relative">
                              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                  name="location"
                                  type="text"
                                  value={formData.location}
                                  onChange={handleChange}
                                  placeholder="San Francisco HQ"
                                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
                              />
                          </div>
                      </div>
                  </div>
              </div>

              {/* Center & Right: General Info & Settings */}
              <div className="lg:col-span-2 space-y-6">
                  
                  {/* Personal Information */}
                  <div className="bg-white dark:bg-[#18181b] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                      <h3 className="text-base font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                          <User size={18} className="text-gray-400" /> Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">First Name <span className="text-red-500">*</span></label>
                              <input 
                                  name="firstName"
                                  value={formData.firstName}
                                  onChange={handleChange}
                                  placeholder="John"
                                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
                              />
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Last Name <span className="text-red-500">*</span></label>
                              <input 
                                  name="lastName"
                                  value={formData.lastName}
                                  onChange={handleChange}
                                  placeholder="Doe"
                                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
                              />
                          </div>
                      </div>
                  </div>

                  {/* Organization Role */}
                  <div className="bg-white dark:bg-[#18181b] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                      <h3 className="text-base font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                          <Briefcase size={18} className="text-gray-400" /> Role & Department
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Job Title</label>
                              <input 
                                  name="role"
                                  value={formData.role}
                                  onChange={handleChange}
                                  placeholder="e.g. Senior Developer"
                                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
                              />
                          </div>
                          
                          <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Department</label>
                              <div className="relative">
                                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <select 
                                      name="department"
                                      value={formData.department}
                                      onChange={handleChange}
                                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white appearance-none"
                                  >
                                      {MOCK_DEPARTMENTS.map(d => (
                                          <option key={d.id} value={d.name}>{d.name}</option>
                                      ))}
                                  </select>
                              </div>
                          </div>

                          <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">System Role (Permissions)</label>
                              <div className="relative">
                                  <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <select 
                                      name="systemRole"
                                      value={formData.systemRole}
                                      onChange={handleChange}
                                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white appearance-none"
                                  >
                                      {MOCK_ROLES.map(r => (
                                          <option key={r.id} value={r.name}>{r.name}</option>
                                      ))}
                                  </select>
                              </div>
                          </div>

                          <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Join Date</label>
                              <div className="relative">
                                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <input 
                                      name="joinDate"
                                      type="date"
                                      value={formData.joinDate}
                                      onChange={handleChange}
                                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
                                  />
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Security */}
                  <div className="bg-white dark:bg-[#18181b] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                      <h3 className="text-base font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                          <Lock size={18} className="text-gray-400" /> Account Security
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Password</label>
                              <div className="relative">
                                  <input 
                                      name="password"
                                      type={showPassword ? "text" : "password"}
                                      value={formData.password}
                                      onChange={handleChange}
                                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-4 pr-10 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
                                  />
                                  <button 
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                                  >
                                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                  </button>
                              </div>
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Confirm Password</label>
                              <input 
                                  name="confirmPassword"
                                  type={showPassword ? "text" : "password"}
                                  value={formData.confirmPassword}
                                  onChange={handleChange}
                                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
                              />
                          </div>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${formData.sendWelcomeEmail ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`} onClick={() => setFormData(prev => ({...prev, sendWelcomeEmail: !prev.sendWelcomeEmail}))}>
                                  {formData.sendWelcomeEmail && <CheckCircle size={14} className="text-white" />}
                              </div>
                              <span className="text-sm font-medium text-blue-900 dark:text-blue-200">Send welcome email with login instructions</span>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      </div>
    </div>
  );
};

export default CreateUser;
