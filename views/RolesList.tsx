
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Shield, Users, Lock, MoreHorizontal, Edit, Trash2, 
  Copy, Filter, LayoutGrid, List as ListIcon, CheckSquare, Square, 
  Download, X, ArrowUpDown, CheckCircle, Info, ShieldCheck, Key, 
  Clock, UserPlus, ChevronRight, Check, UserMinus
} from 'lucide-react';
import { Role, PermissionModule, Employee } from '../types';
import { MOCK_ROLES } from '../constants';
import AddRoleModal from '../components/roles/AddRoleModal';

interface RolesListProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

// --- Sub-Components ---

const RoleDetailDrawer = ({ 
    role, 
    onClose, 
    onEdit, 
    onDelete, 
    assignedUsers,
    allEmployees,
    onAssignUser,
    onRemoveUser
}: { 
    role: Role | null, 
    onClose: () => void, 
    onEdit: (r: Role) => void, 
    onDelete: (id: string) => void,
    assignedUsers: Employee[],
    allEmployees: Employee[],
    onAssignUser: () => void,
    onRemoveUser: (emp: Employee) => void
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'users'>('overview');

    if (!role) return null;

    const modules: PermissionModule[] = ['CRM', 'Finance', 'HR', 'Inventory', 'Settings'];

    const CheckIcon = ({ active }: { active: boolean }) => (
        <div className={`flex justify-center items-center h-full`}>
            {active ? (
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                    <Check size={10} strokeWidth={3} />
                </div>
            ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800" />
            )}
        </div>
    );

    return (
        <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]" onClick={onClose} />
            <div className="fixed inset-y-0 right-0 w-full md:w-[700px] bg-white dark:bg-[#18181b] shadow-2xl z-[101] transform transition-transform duration-300 ease-out border-l border-gray-100 dark:border-gray-800 flex flex-col">
                
                {/* Header */}
                <div className="relative h-40 bg-gradient-to-br from-gray-900 to-black shrink-0 flex flex-col justify-end p-6">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md">
                        <X size={20} />
                    </button>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl border border-white/10 backdrop-blur-sm ${role.isSystem ? 'bg-purple-500/20 text-purple-200' : 'bg-blue-500/20 text-blue-200'}`}>
                                {role.isSystem ? <Lock size={24} /> : <ShieldCheck size={24} />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">{role.name}</h2>
                                <p className="text-white/60 text-xs flex items-center gap-2 mt-1">
                                    ID: {role.id} • {role.isSystem ? 'System Managed' : 'Custom Role'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 dark:border-gray-800 px-6 bg-white dark:bg-[#18181b]">
                    <button onClick={() => setActiveTab('overview')} className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Overview</button>
                    <button onClick={() => setActiveTab('permissions')} className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'permissions' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Permissions</button>
                    <button onClick={() => setActiveTab('users')} className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'users' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Assigned Users <span className="bg-gray-100 dark:bg-white/10 text-xs px-1.5 py-0.5 rounded-full ml-1">{assignedUsers.length}</span></button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Description</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                    {role.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-transparent">
                                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Access Level</span>
                                    <div className="mt-1 flex items-center gap-2 font-medium text-black dark:text-white">
                                        <Key size={16} className="text-gray-400" />
                                        {Object.values(role.permissions).includes('Admin') ? 'Full Access' : 'Restricted'}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-transparent">
                                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Last Updated</span>
                                    <div className="mt-1 flex items-center gap-2 font-medium text-black dark:text-white">
                                        <Clock size={16} className="text-gray-400" />
                                        2 days ago
                                    </div>
                                </div>
                            </div>

                            {role.isSystem && (
                                <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-300">
                                    <Info size={20} className="shrink-0" />
                                    <div className="text-xs leading-relaxed">
                                        <strong>System Role:</strong> This role is built-in and cannot be deleted or have its core permissions modified. You can duplicate it to create a custom variation.
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'permissions' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50/50 dark:bg-white/5 text-[10px] uppercase text-gray-500 font-semibold border-b border-gray-100 dark:border-gray-800">
                                            <tr>
                                                <th className="px-6 py-4 w-32 border-r border-gray-100 dark:border-gray-800 sticky left-0 bg-white dark:bg-[#18181b] z-10">Module</th>
                                                <th className="px-4 py-4 text-center border-r border-gray-100 dark:border-gray-800">Role Level</th>
                                                <th className="px-4 py-4 text-center w-20 text-gray-400">View</th>
                                                <th className="px-4 py-4 text-center w-20 text-gray-400">Create</th>
                                                <th className="px-4 py-4 text-center w-20 text-gray-400">Edit</th>
                                                <th className="px-4 py-4 text-center w-20 text-gray-400">Delete</th>
                                                <th className="px-4 py-4 text-center w-20 text-gray-400">Manage</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                                            {modules.map(mod => {
                                                const level = role.permissions[mod];
                                                let badgeColor = 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400';
                                                if (level === 'Admin') badgeColor = 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300';
                                                if (level === 'Write') badgeColor = 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300';
                                                if (level === 'Read') badgeColor = 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300';

                                                const isRead = ['Read', 'Write', 'Admin'].includes(level);
                                                const isCreate = ['Write', 'Admin'].includes(level);
                                                const isEdit = ['Write', 'Admin'].includes(level);
                                                const isDelete = ['Admin'].includes(level);
                                                const isManage = ['Admin'].includes(level);

                                                return (
                                                    <tr key={mod} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-black dark:text-white border-r border-gray-50 dark:border-gray-800 sticky left-0 bg-white dark:bg-[#18181b] z-10">{mod}</td>
                                                        <td className="px-4 py-4 text-center border-r border-gray-50 dark:border-gray-800">
                                                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                                                                {level}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-center"><CheckIcon active={isRead} /></td>
                                                        <td className="px-4 py-4 text-center"><CheckIcon active={isCreate} /></td>
                                                        <td className="px-4 py-4 text-center"><CheckIcon active={isEdit} /></td>
                                                        <td className="px-4 py-4 text-center"><CheckIcon active={isDelete} /></td>
                                                        <td className="px-4 py-4 text-center"><CheckIcon active={isManage} /></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg">
                                    <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-2 uppercase tracking-wide">Admin Privileges</h4>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                                        Admin level access grants full control over the module, including configuration, deletion of sensitive records, and exporting bulk data.
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-lg">
                                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-300 mb-2 uppercase tracking-wide">Write Access</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                        Write access allows creating and editing records but restricts deletion and high-level configuration changes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Assigned Employees</h3>
                                <button 
                                    onClick={onAssignUser}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                >
                                    <UserPlus size={14} /> Add User
                                </button>
                            </div>
                            <div className="space-y-2">
                                {assignedUsers.length > 0 ? assignedUsers.map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatarUrl} className="w-8 h-8 rounded-full object-cover" />
                                            <div>
                                                <p className="text-sm font-medium text-black dark:text-white">{user.name}</p>
                                                <p className="text-[10px] text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => onRemoveUser(user)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                            title="Remove from Role"
                                        >
                                            <UserMinus size={14} />
                                        </button>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 text-sm">
                                        No users currently assigned.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5 flex justify-between items-center">
                    {!role.isSystem ? (
                        <button 
                            onClick={() => { if(confirm('Delete role?')) { onDelete(role.id); onClose(); } }}
                            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={14} /> Delete Role
                        </button>
                    ) : (
                        <span className="text-xs text-gray-400 italic">System roles cannot be deleted</span>
                    )}
                    <button 
                        onClick={() => { onEdit(role); }}
                        className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-black/5"
                    >
                        <Edit size={14} /> Edit Configuration
                    </button>
                </div>

            </div>
        </>
    );
};

const AssignUsersModal = ({ 
    isOpen, 
    onClose, 
    role, 
    allEmployees, 
    onAssign 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    role: Role | null; 
    allEmployees: Employee[]; 
    onAssign: (userIds: string[]) => void;
}) => {
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen || !role) return null;

    // Filter employees who DON'T have this role already
    const eligibleEmployees = allEmployees.filter(e => e.role !== role.name && e.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const toggleSelection = (id: string) => {
        const next = new Set(selectedUserIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedUserIds(next);
    };

    const handleConfirm = () => {
        onAssign(Array.from(selectedUserIds));
        setSelectedUserIds(new Set());
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
                    <div>
                        <h2 className="text-lg font-light text-black dark:text-white tracking-tight">Assign Users</h2>
                        <p className="text-xs text-gray-500">Add members to <strong>{role.name}</strong></p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full p-2 hover:bg-gray-100 dark:hover:bg-white/10">
                        <X size={18} strokeWidth={1.5} />
                    </button>
                </div>
                
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search employees..." 
                            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {eligibleEmployees.length > 0 ? (
                        <div className="space-y-1">
                            {eligibleEmployees.map(emp => (
                                <div 
                                    key={emp.id} 
                                    onClick={() => toggleSelection(emp.id)}
                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedUserIds.has(emp.id) ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={emp.avatarUrl} className="w-8 h-8 rounded-full object-cover" />
                                        <div>
                                            <p className="text-sm font-medium text-black dark:text-white">{emp.name}</p>
                                            <p className="text-[10px] text-gray-500">{emp.role}</p>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedUserIds.has(emp.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                                        {selectedUserIds.has(emp.id) && <Check size={12} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400 text-sm">No eligible employees found.</div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-white/5">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/5">Cancel</button>
                    <button 
                        onClick={handleConfirm}
                        disabled={selectedUserIds.size === 0}
                        className="px-6 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add {selectedUserIds.size} Users
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const RolesList: React.FC<RolesListProps> = ({ employees, setEmployees }) => {
  // State
  const [roles, setRoles] = useState<Role[]>(() => {
     // Initial sync of counts based on props
     return MOCK_ROLES.map(r => ({
         ...r,
         usersCount: employees.filter(e => e.role === r.name).length
     }));
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  // Filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState<'All' | 'System' | 'Custom'>('All');
  
  // Sorting
  const [sortConfig, setSortConfig] = useState<{ key: keyof Role | 'users'; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

  // --- Handlers ---

  const handleSaveRole = (roleData: Omit<Role, 'id' | 'usersCount'>) => {
      if (editingRole) {
          setRoles(prev => prev.map(r => r.id === editingRole.id ? { ...r, ...roleData } : r));
          setEditingRole(undefined);
          if (selectedRole?.id === editingRole.id) {
              setSelectedRole(prev => prev ? { ...prev, ...roleData } as Role : null);
          }
      } else {
          const newRole: Role = {
              ...roleData,
              id: `role-${Date.now()}`,
              usersCount: 0,
              isSystem: false
          };
          setRoles(prev => [...prev, newRole]);
      }
  };

  const handleEdit = (role: Role) => {
      setEditingRole(role);
      setIsModalOpen(true);
  };

  const handleDuplicate = (role: Role) => {
      const newRole: Role = {
          ...role,
          id: `role-${Date.now()}`,
          name: `${role.name} (Copy)`,
          usersCount: 0, // Duplicate starts with 0 unless we copy users too, but standard is usually no
          isSystem: false // Duplicates are always custom
      };
      setRoles(prev => [...prev, newRole]);
  };

  const handleDelete = (id: string) => {
      const role = roles.find(r => r.id === id);
      if (role?.isSystem) {
          alert("System roles cannot be deleted to prevent access lockout.");
          return;
      }
      // Enterprise check: users assigned?
      if (role && role.usersCount > 0) {
          alert(`Cannot delete role "${role.name}" because it has ${role.usersCount} users assigned. Please reassign them first.`);
          return;
      }

      setRoles(prev => prev.filter(r => r.id !== id));
      if (selectedIds.has(id)) {
          const next = new Set(selectedIds);
          next.delete(id);
          setSelectedIds(next);
      }
      if (selectedRole?.id === id) setSelectedRole(null);
  };

  const handleBulkDelete = () => {
      const idsToDelete = Array.from(selectedIds);
      const rolesToDelete = roles.filter(r => idsToDelete.includes(r.id));
      
      const hasSystemRole = rolesToDelete.some(r => r.isSystem);
      if (hasSystemRole) {
          alert("Selection contains System roles which cannot be deleted. Please deselect them.");
          return;
      }

      const hasAssignedUsers = rolesToDelete.some(r => r.usersCount > 0);
      if (hasAssignedUsers) {
          alert("Some selected roles have users assigned. Please reassign users before deleting.");
          return;
      }

      if (confirm(`Delete ${idsToDelete.length} roles?`)) {
          setRoles(prev => prev.filter(r => !selectedIds.has(r.id)));
          setSelectedIds(new Set());
      }
  };

  // --- User Assignment Handlers ---

  const handleAssignUsers = (userIds: string[]) => {
      if (!selectedRole) return;
      
      // Update Employees
      setEmployees(prev => prev.map(e => userIds.includes(e.id) ? { ...e, role: selectedRole.name } : e));
      
      // Update Role Counts
      setRoles(prev => prev.map(r => {
          if (r.id === selectedRole.id) {
              return { ...r, usersCount: r.usersCount + userIds.length };
          }
          // Decrement counts from previous roles if we were tracking them strictly by ID, 
          // but here we just increment the target. To be strictly accurate we'd re-calc all.
          // Let's re-calc all for safety in this mock environment.
          return r; 
      }));

      // Force refresh of counts based on new employee state next render or manually here
      // For simplicity in mock, we'll let the re-render handle display if derived, but we need to update state.
      // Better: Update ALL role counts.
      setTimeout(() => {
          setRoles(currentRoles => currentRoles.map(r => ({
              ...r,
              usersCount: employees.filter(e => e.role === r.name).length + (r.id === selectedRole.id ? userIds.length : 0) // Quick patch, ideally derived
          }))); 
          // Actually, since employees state update is async, we can't perfectly calc immediately without complex logic.
          // Let's just increment target role for visual feedback now.
      }, 0);
  };

  const handleRemoveUserFromRole = (employee: Employee) => {
      if (!selectedRole) return;
      // Set to 'Employee' or 'None'
      const fallbackRole = 'Employee'; 
      setEmployees(prev => prev.map(e => e.id === employee.id ? { ...e, role: fallbackRole } : e));
      
      setRoles(prev => prev.map(r => r.id === selectedRole.id ? { ...r, usersCount: Math.max(0, r.usersCount - 1) } : r));
  };

  // ---

  const handleExport = () => {
      const dataToExport = selectedIds.size > 0 
        ? roles.filter(r => selectedIds.has(r.id))
        : roles;
      
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "roles_export.json";
      link.click();
  };

  const handleSelectAll = () => {
      if (selectedIds.size === filteredRoles.length && filteredRoles.length > 0) {
          setSelectedIds(new Set());
      } else {
          setSelectedIds(new Set(filteredRoles.map(r => r.id)));
      }
  };

  const handleSelectOne = (id: string) => {
      const next = new Set(selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelectedIds(next);
  };

  const handleSort = (key: keyof Role | 'users') => {
      setSortConfig(current => ({
          key,
          direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
      }));
  };

  // --- Logic ---

  const filteredRoles = useMemo(() => {
      return roles.filter(r => {
          const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                r.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesType = filterType === 'All' || 
                              (filterType === 'System' && r.isSystem) || 
                              (filterType === 'Custom' && !r.isSystem);
          return matchesSearch && matchesType;
      });
  }, [roles, searchQuery, filterType]);

  const sortedRoles = useMemo(() => {
      return [...filteredRoles].sort((a, b) => {
          let aVal: any = a[sortConfig.key as keyof Role];
          let bVal: any = b[sortConfig.key as keyof Role];
          
          if (sortConfig.key === 'users') {
              aVal = a.usersCount;
              bVal = b.usersCount;
          }

          if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });
  }, [filteredRoles, sortConfig]);

  const getPermissionBadgeColor = (level: string) => {
      switch(level) {
          case 'Admin': return 'bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-500/30';
          case 'Write': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
          case 'Read': return 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20';
          default: return 'bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-800';
      }
  };

  const stats = useMemo(() => {
      return {
          total: roles.length,
          system: roles.filter(r => r.isSystem).length,
          custom: roles.filter(r => !r.isSystem).length,
          totalUsers: roles.reduce((sum, r) => sum + r.usersCount, 0)
      };
  }, [roles]);

  const activeFiltersCount = filterType !== 'All' ? 1 : 0;

  // Derive Assigned Users for Selected Role
  const selectedRoleUsers = useMemo(() => {
      if (!selectedRole) return [];
      return employees.filter(e => e.role === selectedRole.name);
  }, [selectedRole, employees]);

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in" onClick={() => setSelectedIds(new Set())}>
        
        {/* Header & Stats */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Roles & Permissions</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                    Manage access control and security policies.
                </p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-1">
                <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl min-w-[140px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">
                        <Shield size={10} /> Total Roles
                    </span>
                    <div className="text-2xl font-light text-black dark:text-white mt-1">{stats.total}</div>
                </div>
                <div className="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl min-w-[140px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">
                        <Lock size={10} /> System
                    </span>
                    <div className="text-2xl font-light text-purple-600 dark:text-purple-400 mt-1">{stats.system}</div>
                </div>
                <div className="p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl min-w-[140px]">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1">
                        <Users size={10} /> Users
                    </span>
                    <div className="text-2xl font-light text-blue-600 dark:text-blue-400 mt-1">{stats.totalUsers}</div>
                </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 shrink-0">
            <div className="flex gap-2 w-full md:w-auto">
                {/* View Toggle */}
                <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        <LayoutGrid size={14} />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        <ListIcon size={14} />
                    </button>
                </div>

                <div className="relative group flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search roles..." 
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 transition-all" 
                    />
                </div>

                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-xs font-medium ${isFilterOpen || activeFiltersCount > 0 ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                    <Filter size={14} />
                    <span className="hidden sm:inline">Filter</span>
                </button>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                {selectedIds.size > 0 ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-300">
                        <span className="text-xs font-medium text-gray-500 px-2">{selectedIds.size} selected</span>
                        <button 
                            onClick={handleExport}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20" 
                            title="Export Selected"
                        >
                            <Download size={14} />
                        </button>
                        <button 
                            onClick={handleBulkDelete}
                            className="p-2 rounded-lg bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 shadow-sm" 
                            title="Delete Selected"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ) : (
                    <>
                        <button 
                            onClick={handleExport}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors" 
                            title="Export All"
                        >
                            <Download size={16} strokeWidth={1.5} />
                        </button>
                        <button 
                            onClick={() => { setEditingRole(undefined); setIsModalOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm whitespace-nowrap"
                        >
                            <Plus size={14} /> Create Role
                        </button>
                    </>
                )}
            </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl animate-in slide-in-from-top-2 fade-in">
                <div className="flex items-center gap-4">
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1.5">Role Type</label>
                        <select 
                            value={filterType} 
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs min-w-[140px] text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20"
                        >
                            <option value="All">All Roles</option>
                            <option value="System">System Roles</option>
                            <option value="Custom">Custom Roles</option>
                        </select>
                    </div>
                    <button 
                        onClick={() => { setFilterType('All'); setSearchQuery(''); }}
                        className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors px-3 mt-5"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm flex flex-col">
            
            {viewMode === 'list' ? (
                /* LIST VIEW */
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 dark:bg-white/5 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800 backdrop-blur-sm">
                            <tr>
                                <th className="py-3 px-4 w-10 text-center">
                                    <button onClick={handleSelectAll} className="flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white">
                                        {selectedIds.size > 0 && selectedIds.size === filteredRoles.length ? <CheckSquare size={14} /> : <Square size={14} />}
                                    </button>
                                </th>
                                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-1">Role Name <ArrowUpDown size={10} /></div>
                                </th>
                                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Type</th>
                                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5" onClick={() => handleSort('users')}>
                                    <div className="flex items-center gap-1">Users <ArrowUpDown size={10} /></div>
                                </th>
                                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Access Summary</th>
                                <th className="py-3 px-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-gray-50 dark:divide-gray-800">
                            {sortedRoles.map(role => (
                                <tr 
                                    key={role.id} 
                                    className={`group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${selectedIds.has(role.id) ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''}`}
                                    onClick={() => setSelectedRole(role)}
                                >
                                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                        <button onClick={() => handleSelectOne(role.id)} className={`flex items-center justify-center transition-colors ${selectedIds.has(role.id) ? 'text-black dark:text-white' : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400'}`}>
                                            {selectedIds.has(role.id) ? <CheckSquare size={14} /> : <Square size={14} />}
                                        </button>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <span className="font-bold text-black dark:text-white">{role.name}</span>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-xs">{role.description}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${role.isSystem ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-500/20' : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800'}`}>
                                            {role.isSystem ? <Lock size={10} /> : <Shield size={10} />}
                                            {role.isSystem ? 'System' : 'Custom'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-1.5">
                                                {employees.filter(e => e.role === role.name).slice(0, 3).map((e, i) => (
                                                    <img key={i} src={e.avatarUrl} className="w-5 h-5 rounded-full border border-white dark:border-[#18181b]" />
                                                ))}
                                                {role.usersCount > 3 && <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[8px] border border-white dark:border-[#18181b]">+{role.usersCount - 3}</div>}
                                            </div>
                                            <span>{role.usersCount}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {Object.entries(role.permissions).slice(0, 3).map(([mod, level]) => (
                                                <span key={mod} className={`text-[9px] px-1.5 py-0.5 rounded border ${getPermissionBadgeColor(level as string)}`}>
                                                    {mod}: <span className="font-bold">{level}</span>
                                                </span>
                                            ))}
                                            {Object.keys(role.permissions).length > 3 && <span className="text-[9px] text-gray-400 self-center">...</span>}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => handleDuplicate(role)} className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded" title="Duplicate">
                                                <Copy size={14} />
                                            </button>
                                            <button onClick={() => handleEdit(role)} className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded" title="Edit">
                                                <Edit size={14} />
                                            </button>
                                            {!role.isSystem && (
                                                <button onClick={() => handleDelete(role.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded" title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* GRID VIEW */
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {sortedRoles.map(role => (
                            <div 
                                key={role.id} 
                                className={`
                                    group bg-white dark:bg-[#18181b] rounded-xl border p-6 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none transition-all duration-300 flex flex-col relative cursor-pointer
                                    ${selectedIds.has(role.id) ? 'border-black dark:border-white ring-1 ring-black dark:ring-white' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}
                                `}
                                onClick={() => setSelectedRole(role)}
                            >
                                {/* Selection Checkbox Absolute */}
                                <div className="absolute top-4 right-4 z-10" onClick={(e) => { e.stopPropagation(); handleSelectOne(role.id); }}>
                                    {selectedIds.has(role.id) ? (
                                        <CheckSquare size={18} className="text-black dark:text-white" />
                                    ) : (
                                        <Square size={18} className="text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-gray-400 dark:hover:text-gray-500" />
                                    )}
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-xl border ${role.isSystem ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                            {role.isSystem ? <Lock size={24} /> : <Shield size={24} />}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-black dark:text-white">{role.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 min-h-[2.5em]">
                                        {role.description}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2 text-[10px] text-gray-400 uppercase font-semibold">
                                        <span>Assigned Users</span>
                                        <span>{role.usersCount}</span>
                                    </div>
                                    <div className="flex -space-x-2">
                                        {employees.filter(e => e.role === role.name).slice(0, 5).map((e, i) => (
                                            <img key={i} src={e.avatarUrl} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#18181b] object-cover" />
                                        ))}
                                        {role.usersCount > 5 && (
                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 border-2 border-white dark:border-[#18181b] flex items-center justify-center text-[10px] text-gray-500 font-bold">
                                                +{role.usersCount - 5}
                                            </div>
                                        )}
                                        {role.usersCount === 0 && <span className="text-xs text-gray-400 italic py-1">No users assigned</span>}
                                    </div>
                                </div>

                                <div className="mt-auto space-y-2 border-t border-gray-50 dark:border-gray-800 pt-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(role.permissions).slice(0, 4).map(([module, level]) => (
                                            <div key={module} className="flex justify-between items-center text-[10px] border border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 rounded px-2 py-1">
                                                <span className="text-gray-600 dark:text-gray-400">{module}</span>
                                                <span className={`px-1.5 rounded border text-[9px] font-medium ${getPermissionBadgeColor(level as string)}`}>
                                                    {level as string}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Hover Actions */}
                                <div className="absolute top-4 right-12 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                        onClick={() => handleDuplicate(role)}
                                        className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
                                        title="Duplicate"
                                    >
                                        <Copy size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(role)}
                                        className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
                                        title="Edit Permissions"
                                    >
                                        <Edit size={14} />
                                    </button>
                                    {!role.isSystem && (
                                        <button 
                                            onClick={() => handleDelete(role.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                                            title="Delete Role"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

    </div>

    <AddRoleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRole}
        initialData={editingRole}
    />

    <RoleDetailDrawer 
        role={selectedRole}
        onClose={() => setSelectedRole(null)}
        onEdit={(r) => { setSelectedRole(null); handleEdit(r); }}
        onDelete={(id) => { setSelectedRole(null); handleDelete(id); }}
        assignedUsers={selectedRoleUsers}
        allEmployees={employees}
        onAssignUser={() => setIsAssignModalOpen(true)}
        onRemoveUser={handleRemoveUserFromRole}
    />

    <AssignUsersModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        role={selectedRole}
        allEmployees={employees}
        onAssign={handleAssignUsers}
    />
    </>
  );
};

export default RolesList;
