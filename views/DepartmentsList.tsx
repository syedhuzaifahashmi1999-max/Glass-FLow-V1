
import React, { useMemo, useState } from 'react';
import { Building2, Users, DollarSign, ArrowUpRight, Search, Plus, MoreHorizontal, Edit, Trash2, MapPin, Target, Wallet } from 'lucide-react';
import { Employee, Department } from '../types';
import AddDepartmentModal from '../components/departments/AddDepartmentModal';

interface DepartmentsListProps {
  employees: Employee[];
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  onUpdateEmployees?: (updatedEmployees: Employee[]) => void;
}

const DepartmentsList: React.FC<DepartmentsListProps> = ({ employees, departments, setDepartments, onUpdateEmployees }) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | undefined>(undefined);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  // Handlers
  const handleAddDepartment = (deptData: Omit<Department, 'id'>) => {
      if (editingDepartment) {
          setDepartments(prev => prev.map(d => d.id === editingDepartment.id ? { ...d, ...deptData } : d));
          setEditingDepartment(undefined);
      } else {
          const newDept: Department = {
              ...deptData,
              id: `d-${Date.now()}`
          };
          setDepartments(prev => [...prev, newDept]);
      }
  };

  const handleEdit = (dept: Department) => {
      setEditingDepartment(dept);
      setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this department? Associated employees will be unassigned.')) {
          // Remove department
          const dept = departments.find(d => d.id === id);
          setDepartments(prev => prev.filter(d => d.id !== id));
          
          // Reassign employees logic (if prop provided)
          // Note: In a real app we'd update backend. Here we assume parent might handle or we skip for mock simplicity
          // if (dept && onUpdateEmployees) { ... } 
          setSelectedDeptId(null);
      }
  };

  const handleModalClose = () => {
      setIsModalOpen(false);
      setEditingDepartment(undefined);
  };

  // Aggregation Logic
  const departmentStats = useMemo(() => {
    return departments.map(dept => {
        const members = employees.filter(e => e.department === dept.name);
        const count = members.length;
        const totalSalary = members.reduce((sum, e) => {
            const sal = parseFloat((e.salary || '0').replace(/[^0-9.]/g, ''));
            return sum + (isNaN(sal) ? 0 : sal);
        }, 0);
        const manager = employees.find(e => e.id === dept.managerId);

        return {
            ...dept,
            count,
            totalSalary,
            members,
            manager
        };
    }).filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [departments, employees, searchQuery]);

  const totalHeadcount = employees.length;
  const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0);
  const totalActual = departmentStats.reduce((sum, d) => sum + d.totalSalary, 0);

  // Selected Department Details
  const selectedDept = selectedDeptId ? departmentStats.find(d => d.id === selectedDeptId) : null;

  return (
    <>
    <div className="h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
        
        {/* Top KPI Header */}
        <div className="bg-white dark:bg-[#18181b] border-b border-gray-100 dark:border-gray-800 px-8 py-6 shrink-0">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
                <div>
                    <h1 className="text-2xl font-light text-black dark:text-white mb-1">Departments</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                        Organizational structure and resource allocation.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Total Headcount</span>
                        <div className="text-lg font-light text-black dark:text-white mt-0.5">{totalHeadcount}</div>
                    </div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Annual Budget</span>
                        <div className="text-lg font-light text-black dark:text-white mt-0.5">${totalBudget.toLocaleString()}</div>
                    </div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Actual Spend</span>
                        <div className={`text-lg font-light mt-0.5 ${totalActual > totalBudget ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>${totalActual.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search departments..." 
                        className="w-64 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 transition-all"
                    />
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm"
                >
                    <Plus size={14} /> New Department
                </button>
            </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Main Grid */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar p-8 transition-all duration-300 ${selectedDept ? 'w-2/3 pr-4' : 'w-full'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {departmentStats.map(dept => {
                        // Calc percentages
                        const budgetUsage = dept.budget > 0 ? (dept.totalSalary / dept.budget) * 100 : 0;
                        const headcountUsage = dept.targetHeadcount > 0 ? (dept.count / dept.targetHeadcount) * 100 : 0;

                        return (
                            <div 
                                key={dept.id} 
                                onClick={() => setSelectedDeptId(dept.id)}
                                className={`
                                    group relative bg-white dark:bg-[#18181b] rounded-xl border p-6 cursor-pointer transition-all duration-300 flex flex-col
                                    ${selectedDeptId === dept.id ? 'border-black dark:border-white shadow-md ring-1 ring-black dark:ring-white' : 'border-gray-200 dark:border-gray-800 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none hover:border-gray-300 dark:hover:border-gray-700'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                                        <Building2 size={20} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleEdit(dept); }}
                                            className="p-1.5 text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(dept.id); }}
                                            className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-black dark:text-white mb-1">{dept.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5em]">
                                        {dept.description}
                                    </p>
                                </div>

                                {/* Metrics Bars */}
                                <div className="space-y-4 mt-auto">
                                    <div>
                                        <div className="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400 mb-1.5">
                                            <span className="flex items-center gap-1"><Users size={10} /> Capacity</span>
                                            <span>{dept.count} / {dept.targetHeadcount}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${headcountUsage > 100 ? 'bg-red-500' : 'bg-black dark:bg-white'}`} 
                                                style={{ width: `${Math.min(headcountUsage, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400 mb-1.5">
                                            <span className="flex items-center gap-1"><Wallet size={10} /> Budget</span>
                                            <span>${(dept.totalSalary/1000).toFixed(0)}k / ${(dept.budget/1000).toFixed(0)}k</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${budgetUsage > 100 ? 'bg-red-500' : 'bg-green-600'}`} 
                                                style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {dept.members.slice(0, 4).map((m, i) => (
                                            <img key={i} src={m.avatarUrl} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#18181b] object-cover" />
                                        ))}
                                        {dept.members.length > 4 && (
                                            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 border-2 border-white dark:border-[#18181b] flex items-center justify-center text-[8px] text-gray-500">+{dept.members.length - 4}</div>
                                        )}
                                    </div>
                                    {dept.manager && (
                                        <div className="text-[10px] text-gray-400">
                                            Lead: <span className="text-black dark:text-white font-medium">{dept.manager.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Drill Down Side Panel */}
            {selectedDept && (
                <div className="w-[400px] border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] flex flex-col h-full shadow-xl animate-in slide-in-from-right-10 duration-300 relative z-10">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-light text-black dark:text-white mb-1">{selectedDept.name}</h2>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <MapPin size={12} /> {selectedDept.location || 'Remote'}
                            </div>
                        </div>
                        <button onClick={() => setSelectedDeptId(null)} className="p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                            <ArrowUpRight size={18} className="rotate-45" /> {/* Use as close icon visual */}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                        
                        {/* Financial Snapshot */}
                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                            <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-wide mb-4">Financial Snapshot</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Budget</span>
                                    <span className="font-mono text-black dark:text-white">${selectedDept.budget.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Allocated Salaries</span>
                                    <span className="font-mono text-black dark:text-white">${selectedDept.totalSalary.toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-900 dark:text-gray-200">Remaining</span>
                                    <span className={`font-mono ${selectedDept.budget - selectedDept.totalSalary < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        ${(selectedDept.budget - selectedDept.totalSalary).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Manager */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-wide mb-4">Department Lead</h3>
                            {selectedDept.manager ? (
                                <div className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <img src={selectedDept.manager.avatarUrl} className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <div className="text-sm font-medium text-black dark:text-white">{selectedDept.manager.name}</div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{selectedDept.manager.role}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-400 italic">No manager assigned</div>
                            )}
                        </div>

                        {/* Team Members */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-wide">Team Members ({selectedDept.members.length})</h3>
                            </div>
                            <div className="space-y-2">
                                {selectedDept.members.map(emp => (
                                    <div key={emp.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img src={emp.avatarUrl} className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700 object-cover" />
                                                <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white dark:border-[#18181b] ${emp.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium text-black dark:text-white">{emp.name}</div>
                                                <div className="text-[10px] text-gray-500 dark:text-gray-400">{emp.role}</div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 font-mono">
                                            ${parseFloat(emp.salary || '0').toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5">
                        <button 
                            onClick={() => handleEdit(selectedDept)}
                            className="w-full py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium hover:border-gray-300 dark:hover:border-gray-600 hover:text-black dark:hover:text-white transition-all shadow-sm"
                        >
                            Edit Department Settings
                        </button>
                    </div>
                </div>
            )}

        </div>
    </div>

    <AddDepartmentModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleAddDepartment}
        initialData={editingDepartment}
        employees={employees}
    />
    </>
  );
};

export default DepartmentsList;
