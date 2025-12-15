
import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, Check, Copy, Info, Eye, Edit, Trash2, Plus, Settings } from 'lucide-react';
import { Role, PermissionModule, AccessLevel } from '../../types';
import { MOCK_ROLES } from '../../constants';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Omit<Role, 'id' | 'usersCount'>) => void;
  initialData?: Role;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    description: '',
    isSystem: false,
    permissions: {
      'CRM': 'None',
      'Finance': 'None',
      'HR': 'None',
      'Inventory': 'None',
      'Settings': 'None'
    }
  });

  const [copyFromId, setCopyFromId] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCopyFromId('');
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        setFormData({
            name: '',
            description: '',
            isSystem: false,
            permissions: {
                'CRM': 'None',
                'Finance': 'None',
                'HR': 'None',
                'Inventory': 'None',
                'Settings': 'None'
            }
        });
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialData]);

  if (!isVisible && !isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (module: PermissionModule, level: AccessLevel) => {
      setFormData(prev => ({
          ...prev,
          permissions: {
              ...prev.permissions!,
              [module]: level
          }
      }));
  };

  // Bulk set a whole column (e.g., Set all to 'Read')
  const handleBulkPermissionSet = (level: AccessLevel) => {
      if (formData.isSystem) return; 
      const newPerms = { ...formData.permissions } as Record<PermissionModule, AccessLevel>;
      modules.forEach(m => newPerms[m] = level);
      setFormData(prev => ({ ...prev, permissions: newPerms }));
  };

  const handleCopyFrom = (roleId: string) => {
      setCopyFromId(roleId);
      const sourceRole = MOCK_ROLES.find(r => r.id === roleId);
      if (sourceRole) {
          setFormData(prev => ({
              ...prev,
              permissions: { ...sourceRole.permissions }
          }));
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<Role, 'id' | 'usersCount'>);
    onClose();
  };

  const modules: PermissionModule[] = ['CRM', 'Finance', 'HR', 'Inventory', 'Settings'];
  const levels: AccessLevel[] = ['None', 'Read', 'Write', 'Admin'];

  // Helper to render capability icons based on level
  const renderCapabilities = (level: AccessLevel) => {
      if (level === 'None') return <span className="text-gray-300">-</span>;
      
      const caps = [];
      if (['Read', 'Write', 'Admin'].includes(level)) caps.push({ icon: Eye, label: 'View' });
      if (['Write', 'Admin'].includes(level)) caps.push({ icon: Plus, label: 'Create' });
      if (['Write', 'Admin'].includes(level)) caps.push({ icon: Edit, label: 'Edit' });
      if (['Admin'].includes(level)) caps.push({ icon: Trash2, label: 'Delete' });
      
      return (
          <div className="flex gap-1 justify-center mt-1">
              {caps.map((c, i) => (
                  <c.icon key={i} size={10} className="text-gray-400" title={c.label} />
              ))}
          </div>
      );
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`
            relative w-full max-w-4xl bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]
            transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black dark:text-white tracking-tight">{initialData ? 'Edit Role' : 'Create New Role'}</h2>
             <p className="text-xs text-gray-500 dark:text-gray-400">Define access levels and permissions.</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full p-2 hover:bg-gray-100 dark:hover:bg-white/10">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="overflow-y-auto custom-scrollbar flex-1">
           <form onSubmit={handleSubmit} className="p-6 space-y-8">
             
             {/* Top Row: Basic Info + Copy Feature */}
             <div className="flex flex-col md:flex-row gap-8">
                 {/* Basic Info */}
                 <div className="flex-1 space-y-4">
                     <div>
                        <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Role Name <span className="text-red-400">*</span></label>
                        <div className="relative">
                            <Shield size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                name="name" 
                                required 
                                value={formData.name} 
                                onChange={handleChange} 
                                disabled={formData.isSystem}
                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-accent disabled:bg-gray-50 dark:disabled:bg-white/5 disabled:text-gray-500" 
                                placeholder="e.g. Sales Manager"
                            />
                        </div>
                     </div>

                     <div>
                        <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Description</label>
                        <textarea 
                            name="description" 
                            rows={3}
                            value={formData.description} 
                            onChange={handleChange} 
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-accent resize-none" 
                            placeholder="Purpose of this role..."
                        />
                     </div>
                 </div>

                 {/* Copy From Widget */}
                 {!formData.isSystem && (
                     <div className="w-full md:w-64 bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-gray-800 h-fit">
                        <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300">
                            <Copy size={14} />
                            <span className="text-xs font-semibold uppercase tracking-wide">Quick Setup</span>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3">
                            Pre-fill permissions by copying an existing role template.
                        </p>
                        <select 
                            value={copyFromId}
                            onChange={(e) => handleCopyFrom(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-accent"
                        >
                            <option value="">Copy permissions from...</option>
                            {MOCK_ROLES.filter(r => r.id !== initialData?.id).map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                     </div>
                 )}
             </div>

             {/* Permission Matrix */}
             <div>
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                        <Lock size={12} /> Access Matrix
                    </h3>
                    {!formData.isSystem && (
                        <span className="text-[10px] text-gray-400">
                            Tip: Click column headers to bulk select.
                        </span>
                    )}
                 </div>
                 
                 <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                         <thead className="bg-gray-50 dark:bg-white/5 text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-800">
                             <tr>
                                 <th className="px-4 py-3 bg-gray-50 dark:bg-white/5 border-r border-gray-100 dark:border-gray-800">Module</th>
                                 {levels.map(level => (
                                     <th 
                                        key={level} 
                                        className={`px-4 py-3 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${formData.isSystem ? 'pointer-events-none' : ''}`}
                                        onClick={() => handleBulkPermissionSet(level)}
                                        title={`Set all to ${level}`}
                                     >
                                         <div className="flex flex-col items-center gap-1">
                                             <span>{level}</span>
                                             {/* Visual indicator of what this level includes */}
                                             <div className="flex gap-0.5 opacity-50">
                                                 {['Read', 'Write', 'Admin'].includes(level) && <Eye size={8} />}
                                                 {['Write', 'Admin'].includes(level) && <Edit size={8} />}
                                                 {['Admin'].includes(level) && <Trash2 size={8} />}
                                             </div>
                                         </div>
                                     </th>
                                 ))}
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-xs">
                             {modules.map(module => (
                                 <tr key={module} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                     <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent group-hover:bg-gray-50 dark:group-hover:bg-white/5 border-r border-gray-100 dark:border-gray-800">{module}</td>
                                     {levels.map(level => (
                                         <td key={level} className="px-4 py-3 text-center relative border-r border-gray-50 dark:border-gray-800 last:border-0">
                                             <label className="cursor-pointer flex flex-col justify-center items-center h-full w-full py-2">
                                                 <input 
                                                    type="radio" 
                                                    name={`perm-${module}`}
                                                    checked={formData.permissions?.[module] === level}
                                                    onChange={() => handlePermissionChange(module, level)}
                                                    disabled={formData.isSystem && level !== formData.permissions?.[module]}
                                                    className={`w-4 h-4 text-black border-gray-300 dark:border-gray-600 focus:ring-black cursor-pointer accent-black mb-1 ${formData.permissions?.[module] === level ? 'scale-110' : ''}`}
                                                 />
                                                 {/* Show Capabilities explicitly when selected */}
                                                 <div className={`transition-opacity duration-200 ${formData.permissions?.[module] === level ? 'opacity-100' : 'opacity-0'}`}>
                                                     {renderCapabilities(level)}
                                                 </div>
                                             </label>
                                         </td>
                                     ))}
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
                 
                 {/* Detailed Legend */}
                 <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                     <div className="text-[10px] text-gray-500 dark:text-gray-400">
                         <strong className="text-black dark:text-white block mb-1">None</strong>
                         No visibility or access to the module.
                     </div>
                     <div className="text-[10px] text-gray-500 dark:text-gray-400">
                         <strong className="text-black dark:text-white block mb-1 flex items-center gap-1"><Eye size={10} /> Read</strong>
                         View-only access. Cannot create or edit data.
                     </div>
                     <div className="text-[10px] text-gray-500 dark:text-gray-400">
                         <strong className="text-black dark:text-white block mb-1 flex items-center gap-1"><Edit size={10} /> Write</strong>
                         Can create and edit records. <span className="text-red-500">No deletion rights.</span>
                     </div>
                     <div className="text-[10px] text-gray-500 dark:text-gray-400">
                         <strong className="text-black dark:text-white block mb-1 flex items-center gap-1"><Trash2 size={10} /> Admin</strong>
                         Full control including <span className="text-red-500 font-bold">Delete</span> and module settings.
                     </div>
                 </div>

                 {formData.isSystem && (
                     <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg flex items-start gap-2 border border-blue-100 dark:border-blue-900/30">
                         <Info size={14} className="mt-0.5 shrink-0" />
                         <p className="text-xs">
                             <strong>System Role Locked:</strong> Permissions for system-defined roles cannot be modified to ensure platform stability. You can duplicate this role to customize it.
                         </p>
                     </div>
                 )}
             </div>

             <div className="pt-2 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-all text-xs font-medium uppercase tracking-wide">Cancel</button>
               {!formData.isSystem && (
                   <button type="submit" className="px-6 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all text-xs font-medium uppercase tracking-wide shadow-lg shadow-black/5 flex items-center gap-2">
                       <Check size={14} /> Save Role
                   </button>
               )}
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddRoleModal;
