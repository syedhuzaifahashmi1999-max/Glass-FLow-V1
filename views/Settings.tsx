
import React, { useState, useRef } from 'react';
import { User, Bell, Shield, Building, Save, Camera, Mail, Lock, Globe, Check, Palette, Moon, Sun, PanelLeftClose, PanelLeftOpen, CreditCard, Clock, FileText, ArrowUpRight, Briefcase, CheckCircle, AlertTriangle, LogOut, UploadCloud, Trash2 } from 'lucide-react';
import { Role } from '../types';

interface SettingsProps {
    theme?: 'light' | 'dark';
    onThemeChange?: (theme: 'light' | 'dark') => void;
    layoutCompact?: boolean;
    onLayoutChange?: (compact: boolean) => void;
    accentColor?: string;
    onAccentColorChange?: (color: string) => void;
    activeRole?: Role;
    onRoleChange?: (role: Role) => void;
    roles?: Role[];
    currentPlan?: string;
    currency?: string;
    onCurrencyChange?: (currency: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
    theme = 'light', 
    onThemeChange, 
    layoutCompact = false, 
    onLayoutChange,
    accentColor = 'black',
    onAccentColorChange,
    activeRole,
    onRoleChange,
    roles = [],
    currentPlan = 'Professional',
    currency = 'USD',
    onCurrencyChange
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'workspace' | 'security' | 'appearance' | 'billing'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // -- Form States --
  
  // Profile
  const [profileData, setProfileData] = useState({
      firstName: 'Alex',
      lastName: 'Doe',
      title: 'Senior Product Designer',
      email: 'alex@glassflow.com',
      avatar: 'https://picsum.photos/200/200?random=20'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notifications
  const [notifications, setNotifications] = useState({
      newLeads: true,
      tasks: true,
      projectUpdates: false,
      marketing: false,
      securityAlerts: true
  });

  // Workspace
  const [workspaceData, setWorkspaceData] = useState({
      name: 'GlassFlow HQ',
      url: 'hq',
      language: 'English (US)',
      timezone: '(GMT-08:00) Pacific Time'
  });

  // Security
  const [securityData, setSecurityData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactor: false
  });

  // --- Handlers ---

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate API call based on active tab
    setTimeout(() => {
      setIsLoading(false);
      
      if (activeTab === 'security' && securityData.newPassword && securityData.newPassword !== securityData.confirmPassword) {
          showNotification("New passwords do not match.", 'error');
          return;
      }

      if (activeTab === 'security' && securityData.newPassword) {
          // Clear password fields after "save"
          setSecurityData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
          showNotification("Security settings updated successfully.");
      } else {
          showNotification(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings saved successfully.`);
      }
    }, 800);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target?.result) {
                  setProfileData({ ...profileData, avatar: event.target.result as string });
                  showNotification("Profile picture updated.");
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleWorkspaceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setWorkspaceData({ ...workspaceData, [e.target.name]: e.target.value });
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
      setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSecurityData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'workspace', label: 'Workspace', icon: Building },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  ] as const;

  return (
    <div className="p-8 lg:p-12 max-w-[1200px] mx-auto h-full flex flex-col bg-surface transition-colors duration-300 fade-in overflow-y-auto custom-scrollbar relative">
      
      {/* Toast Notification */}
      {notification && (
          <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 animate-in slide-in-from-top-5 duration-300 ${
              notification.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-700'
          }`}>
              {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              <span className="text-sm font-medium">{notification.message}</span>
          </div>
      )}

      {/* Header */}
      <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
        <h1 className="text-2xl font-light text-black dark:text-white mb-1">Settings</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
          Manage your account preferences and workspace configuration.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="flex flex-col gap-1 sticky top-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200
                  ${activeTab === tab.id 
                    ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white font-medium shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'}
                `}
              >
                <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2 : 1.5} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-2xl min-h-[500px]">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xl text-gray-500 overflow-hidden">
                    {profileData.avatar ? (
                        <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="font-medium">{profileData.firstName[0]}{profileData.lastName[0]}</span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={20} />
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </div>
                <div>
                  <h3 className="text-base font-medium text-black dark:text-white">Profile Picture</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">Supports JPG, PNG or GIF. Max size 2MB.</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium text-black dark:text-white border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <UploadCloud size={14} /> Upload New
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">First Name</label>
                  <input 
                    name="firstName"
                    type="text" 
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-white dark:focus:bg-black transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Last Name</label>
                  <input 
                    name="lastName"
                    type="text" 
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-white dark:focus:bg-black transition-all"
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Job Title</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      name="title"
                      type="text" 
                      value={profileData.title}
                      onChange={handleProfileChange}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-white dark:focus:bg-black transition-all"
                    />
                  </div>
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      name="email"
                      type="email" 
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-white dark:focus:bg-black transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* ROLE SIMULATOR (DEV TOOL) */}
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-5 mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Shield size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">Role Simulator</h3>
                            <p className="text-xs text-blue-600 dark:text-blue-400">Preview the application as different user roles.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide">Active Role</label>
                        <select 
                            value={activeRole?.id || ''}
                            onChange={(e) => {
                                const selected = roles.find(r => r.id === e.target.value);
                                if(selected && onRoleChange) {
                                    onRoleChange(selected);
                                    showNotification(`Role switched to ${selected.name}`);
                                }
                            }}
                            className="w-full bg-white dark:bg-black/20 border border-blue-200 dark:border-blue-800 text-sm text-black dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
                        >
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-blue-500 mt-1">
                            Switching roles will immediately update your sidebar navigation and access permissions.
                        </p>
                    </div>
                </div>

                <div>
                   <h3 className="text-sm font-medium text-black dark:text-white mb-1">Change Password</h3>
                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Ensure your account is using a long, random password to stay secure.</p>
                   
                   <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Current Password</label>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            name="currentPassword"
                            type="password" 
                            value={securityData.currentPassword}
                            onChange={handleSecurityChange}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-white dark:focus:bg-black transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">New Password</label>
                         <div className="relative">
                          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            name="newPassword"
                            type="password" 
                            value={securityData.newPassword}
                            onChange={handleSecurityChange}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-white dark:focus:bg-black transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Confirm New Password</label>
                         <div className="relative">
                          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            name="confirmPassword"
                            type="password" 
                            value={securityData.confirmPassword}
                            onChange={handleSecurityChange}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-white dark:focus:bg-black transition-all"
                          />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                   <h3 className="text-sm font-medium text-black dark:text-white mb-4">Two-Factor Authentication</h3>
                   <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5">
                      <div>
                         <p className="text-sm font-medium text-black dark:text-white">Authenticator App</p>
                         <p className="text-xs text-gray-500 dark:text-gray-400">Secure your account with TOTP (Time-based One-Time Password).</p>
                      </div>
                      <button 
                        onClick={() => {
                            setSecurityData(prev => ({...prev, twoFactor: !prev.twoFactor}));
                            showNotification(securityData.twoFactor ? "2FA Disabled" : "2FA Enabled", securityData.twoFactor ? 'error' : 'success');
                        }}
                        className={`text-xs font-medium border px-3 py-1.5 rounded transition-colors ${
                            securityData.twoFactor 
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                            : 'bg-white text-black border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                         {securityData.twoFactor ? 'Disable' : 'Enable'}
                      </button>
                   </div>
                </div>
             </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                  
                  {/* Theme Section */}
                  <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-black dark:text-white">Interface Theme</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select your preferred color scheme.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button 
                            onClick={() => onThemeChange?.('light')}
                            className={`
                                relative p-4 rounded-xl border text-left transition-all duration-200 group
                                ${theme === 'light' 
                                    ? 'border-accent bg-gray-50 dark:bg-white/10 ring-1 ring-accent' 
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                            `}
                          >
                              <div className="flex items-center gap-3 mb-3">
                                  <div className="p-2 rounded-full bg-white border border-gray-200 text-orange-500">
                                      <Sun size={18} />
                                  </div>
                                  <span className="text-sm font-medium text-black dark:text-white">Light Mode</span>
                              </div>
                              {/* Preview Graphic */}
                              <div className="h-20 bg-white border border-gray-100 rounded-lg p-2 overflow-hidden relative">
                                  <div className="w-full h-full flex gap-2">
                                      <div className="w-1/4 h-full bg-gray-50 rounded"></div>
                                      <div className="flex-1 space-y-2">
                                          <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
                                          <div className="w-1/2 h-2 bg-gray-100 rounded"></div>
                                          <div className="w-full h-8 bg-gray-50 rounded mt-2"></div>
                                      </div>
                                  </div>
                              </div>
                              {theme === 'light' && <div className="absolute top-4 right-4 text-accent"><Check size={16} /></div>}
                          </button>

                          <button 
                            onClick={() => onThemeChange?.('dark')}
                            className={`
                                relative p-4 rounded-xl border text-left transition-all duration-200 group
                                ${theme === 'dark' 
                                    ? 'border-accent bg-gray-50 dark:bg-white/10 ring-1 ring-accent' 
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                            `}
                          >
                              <div className="flex items-center gap-3 mb-3">
                                  <div className="p-2 rounded-full bg-gray-900 border border-gray-700 text-blue-400">
                                      <Moon size={18} />
                                  </div>
                                  <span className="text-sm font-medium text-black dark:text-white">Dark Mode</span>
                              </div>
                              {/* Preview Graphic */}
                              <div className="h-20 bg-gray-900 border border-gray-800 rounded-lg p-2 overflow-hidden relative">
                                  <div className="w-full h-full flex gap-2">
                                      <div className="w-1/4 h-full bg-gray-800 rounded"></div>
                                      <div className="flex-1 space-y-2">
                                          <div className="w-3/4 h-2 bg-gray-800 rounded"></div>
                                          <div className="w-1/2 h-2 bg-gray-800 rounded"></div>
                                          <div className="w-full h-8 bg-gray-800 rounded mt-2"></div>
                                      </div>
                                  </div>
                              </div>
                              {theme === 'dark' && <div className="absolute top-4 right-4 text-accent"><Check size={16} /></div>}
                          </button>
                      </div>
                  </div>

                  <hr className="border-gray-100 dark:border-gray-800" />

                  {/* Layout Section */}
                  <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-black dark:text-white">Layout Density</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Adjust how content is displayed on your screen.</p>
                      </div>

                      <div className="flex flex-col gap-3">
                         <button 
                            onClick={() => onLayoutChange?.(false)}
                            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                                !layoutCompact 
                                ? 'bg-gray-50 dark:bg-white/5 border-accent' 
                                : 'bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                         >
                            <div className="flex items-center gap-3">
                                <PanelLeftOpen size={18} className="text-gray-500" />
                                <div className="text-left">
                                    <p className="text-sm font-medium text-black dark:text-white">Comfortable</p>
                                    <p className="text-xs text-gray-500">Expanded sidebar and standard spacing</p>
                                </div>
                            </div>
                            {!layoutCompact && <Check size={16} className="text-accent" />}
                         </button>

                         <button 
                            onClick={() => onLayoutChange?.(true)}
                            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                                layoutCompact 
                                ? 'bg-gray-50 dark:bg-white/5 border-accent' 
                                : 'bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                         >
                            <div className="flex items-center gap-3">
                                <PanelLeftClose size={18} className="text-gray-500" />
                                <div className="text-left">
                                    <p className="text-sm font-medium text-black dark:text-white">Compact</p>
                                    <p className="text-xs text-gray-500">Collapsed sidebar and denser lists</p>
                                </div>
                            </div>
                            {layoutCompact && <Check size={16} className="text-accent" />}
                         </button>
                      </div>
                  </div>

                  <hr className="border-gray-100 dark:border-gray-800" />
                  
                  {/* Accent Color */}
                   <div>
                        <h3 className="text-sm font-medium text-black dark:text-white mb-4">Accent Color</h3>
                        <div className="flex gap-3">
                            {['black', 'blue', 'purple', 'emerald', 'orange'].map(color => (
                                <button 
                                    key={color}
                                    onClick={() => onAccentColorChange?.(color)}
                                    className={`
                                        w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center
                                        ${accentColor === color ? 'border-gray-400 scale-110' : 'border-transparent hover:scale-105'}
                                    `}
                                >
                                    <div className={`w-6 h-6 rounded-full ${
                                        color === 'black' ? 'bg-black dark:bg-white' : 
                                        color === 'blue' ? 'bg-blue-600' :
                                        color === 'purple' ? 'bg-purple-600' :
                                        color === 'emerald' ? 'bg-emerald-600' :
                                        'bg-orange-600'
                                    }`}></div>
                                </button>
                            ))}
                        </div>
                   </div>

              </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="space-y-6">
                 <div>
                    <h3 className="text-sm font-medium text-black dark:text-white">Email Notifications</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage what emails you receive from GlassFlow.</p>
                 </div>
                 
                 <div className="space-y-4">
                    {[
                      { key: 'newLeads', label: 'New Lead Assignments', desc: 'Get notified when a new lead is assigned to you' },
                      { key: 'tasks', label: 'Task Reminders', desc: 'Daily digest of tasks due today' },
                      { key: 'projectUpdates', label: 'Project Updates', desc: 'When team members comment on your projects' },
                      { key: 'marketing', label: 'Marketing Newsletter', desc: 'Product updates and tips' },
                      { key: 'securityAlerts', label: 'Security Alerts', desc: 'Login attempts from new devices' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-black dark:text-white">{item.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input 
                                type="checkbox" 
                                name="toggle" 
                                id={`toggle-${i}`} 
                                checked={notifications[item.key as keyof typeof notifications]}
                                onChange={() => handleNotificationToggle(item.key as keyof typeof notifications)}
                                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-accent" 
                                style={{ right: notifications[item.key as keyof typeof notifications] ? 0 : 'auto', left: notifications[item.key as keyof typeof notifications] ? 'auto' : 0 }}
                            />
                            <label htmlFor={`toggle-${i}`} className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${notifications[item.key as keyof typeof notifications] ? 'bg-accent' : 'bg-gray-300'}`}></label>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          )}

          {/* WORKSPACE TAB */}
          {activeTab === 'workspace' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Workspace Name</label>
                  <div className="relative">
                    <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      name="name"
                      type="text" 
                      value={workspaceData.name}
                      onChange={handleWorkspaceChange}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-white dark:focus:bg-black transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Workspace URL</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-gray-500 text-sm">
                      glassflow.com/
                    </span>
                    <input 
                      name="url"
                      type="text" 
                      value={workspaceData.url}
                      onChange={handleWorkspaceChange}
                      className="flex-1 min-w-0 block w-full bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 rounded-r-lg px-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                   <h3 className="text-sm font-medium text-black dark:text-white mb-4">Regional Settings</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Language</label>
                        <select 
                            name="language"
                            value={workspaceData.language}
                            onChange={handleWorkspaceChange}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-white dark:focus:bg-black transition-all"
                        >
                           <option>English (US)</option>
                           <option>Spanish</option>
                           <option>French</option>
                           <option>German</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Timezone</label>
                        <div className="relative">
                           <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                           <select 
                                name="timezone"
                                value={workspaceData.timezone}
                                onChange={handleWorkspaceChange}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-white dark:focus:bg-black transition-all appearance-none"
                           >
                              <option>(GMT-08:00) Pacific Time</option>
                              <option>(GMT-05:00) Eastern Time</option>
                              <option>(GMT+00:00) UTC</option>
                           </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Currency</label>
                        <div className="relative">
                           <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                           <select 
                                name="currency"
                                value={currency}
                                onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-white dark:focus:bg-black transition-all appearance-none"
                           >
                              <option value="USD">USD ($)</option>
                              <option value="EUR">EUR (€)</option>
                              <option value="GBP">GBP (£)</option>
                              <option value="JPY">JPY (¥)</option>
                              <option value="CAD">CAD ($)</option>
                              <option value="AUD">AUD ($)</option>
                           </select>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-medium text-red-600 mb-4">Danger Zone</h3>
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-900">Delete Workspace</p>
                            <p className="text-xs text-red-700 mt-1">Irreversibly delete this workspace and all data.</p>
                        </div>
                        <button 
                            onClick={() => {
                                if(confirm('Are you absolutely sure? This cannot be undone.')) {
                                    alert("Workspace deletion simulated.");
                                }
                            }}
                            className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-medium rounded hover:bg-red-50 transition-colors"
                        >
                            Delete Workspace
                        </button>
                    </div>
                </div>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-gradient-to-br from-black to-gray-800 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-1">Current Plan</p>
                            <h2 className="text-3xl font-light">{currentPlan}</h2>
                        </div>
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/10">
                            Active
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock size={16} />
                        Next billing date: November 1, 2024
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-white/5">
                        <h3 className="text-sm font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
                            <CreditCard size={16} /> Payment Method
                        </h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                                VISA
                            </div>
                            <span className="text-sm text-black dark:text-white font-mono">•••• 4242</span>
                        </div>
                        <button 
                            onClick={() => alert("Payment update modal simulated.")}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Update Payment Method
                        </button>
                    </div>

                    <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-white/5">
                        <h3 className="text-sm font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
                            <FileText size={16} /> Recent Invoices
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-600 dark:text-gray-400">Oct 1, 2024</span>
                                <span className="font-medium text-black dark:text-white">$29.00</span>
                                <button className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded"><ArrowUpRight size={12} /></button>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-600 dark:text-gray-400">Sep 1, 2024</span>
                                <span className="font-medium text-black dark:text-white">$29.00</span>
                                <button className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded"><ArrowUpRight size={12} /></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-medium text-black dark:text-white mb-2">Need more features?</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Upgrade your plan to unlock enterprise capabilities.</p>
                    <button 
                        onClick={() => alert("Upgrade plan modal simulated.")}
                        className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        Upgrade Plan
                    </button>
                </div>
            </div>
          )}

          {/* Action Bar (Not for Billing) */}
          {activeTab !== 'billing' && (
            <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 sticky bottom-0 bg-surface/90 backdrop-blur-sm pb-4">
                <button 
                    onClick={() => setNotification(null)} // Dummy cancel
                    className="px-6 py-2 rounded-lg text-sm text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    disabled={isLoading}
                    className={`
                        flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-md bg-accent text-accent-foreground hover:opacity-90
                        ${isLoading ? 'opacity-80 cursor-wait' : ''}
                    `}
                >
                    {isLoading ? (
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        <Save size={16} />
                    )}
                    Save Changes
                </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
