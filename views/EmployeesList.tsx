
import React, { useState, useRef } from 'react';
import { Search, Filter, Plus, List, LayoutGrid, Mail, Phone, MapPin, MoreHorizontal, Briefcase, Trash2, Edit, X, Download, Upload, CreditCard } from 'lucide-react';
import { Employee, ViewState } from '../types';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';
import EmployeeIDCardModal from '../components/employees/EmployeeIDCardModal';

interface EmployeesListProps {
    employees: Employee[];
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
    onNavigate?: (view: ViewState) => void;
}

const EmployeesList: React.FC<EmployeesListProps> = ({ employees, setEmployees, onNavigate }) => {
  // State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIDModalOpen, setIsIDModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);
  const [cardPreviewEmployee, setCardPreviewEmployee] = useState<Employee | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleAddEmployee = (empData: Omit<Employee, 'id'>) => {
    if (selectedEmployee) {
        // Update
        setEmployees(prev => prev.map(e => e.id === selectedEmployee.id ? { ...e, ...empData } : e));
        setSelectedEmployee(undefined);
    } else {
        // Create
        const newEmp: Employee = {
            ...empData,
            id: `E-${Date.now().toString().slice(-4)}`
        };
        setEmployees(prev => [newEmp, ...prev]);
    }
  };

  const handleDelete = (id: string) => {
      if (window.confirm('Are you sure you want to remove this employee? This action cannot be undone.')) {
          setEmployees(prev => prev.filter(e => e.id !== id));
      }
  };

  const handleEditClick = (employee: Employee) => {
      setSelectedEmployee(employee);
      setIsAddModalOpen(true);
  };

  const handleIDCardClick = (employee: Employee) => {
      setCardPreviewEmployee(employee);
      setIsIDModalOpen(true);
  };

  const handleModalClose = () => {
      setIsAddModalOpen(false);
      setSelectedEmployee(undefined);
  };

  // --- Import / Export ---

  const handleExportCSV = () => {
      const headers = ['ID', 'Name', 'Role', 'Department', 'Email', 'Phone', 'Location', 'Status', 'Join Date'];
      const csvContent = [
          headers.join(','),
          ...filteredEmployees.map(e => [
              e.id, 
              `"${e.name}"`, 
              `"${e.role}"`, 
              `"${e.department}"`, 
              e.email, 
              e.phone, 
              `"${e.location}"`, 
              e.status, 
              e.joinDate
          ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employees_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          // In a real app, parse CSV here. For now, we verify the button works.
          alert(`Import simulation: Ready to parse ${e.target.files[0].name}`);
          e.target.value = ''; // Reset
      }
  };

  // --- Filtering ---
  
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const uniqueDepartments = Array.from(new Set(employees.map(e => e.department)));
  const clearFilters = () => {
      setDepartmentFilter('All');
      setStatusFilter('All');
      setSearchQuery('');
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20';
      case 'On Leave': return 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20';
      case 'Terminated': return 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20';
      default: return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-light text-black dark:text-white mb-1">Employees</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
            Manage your team directory, roles, and access cards.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
             {/* View Toggle */}
             <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 mr-2">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                title="List View"
              >
                <List size={14} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                title="Grid View"
              >
                <LayoutGrid size={14} />
              </button>
             </div>

             {/* Search */}
             <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employees..." 
                className="w-40 lg:w-56 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded pl-9 pr-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:ring-0 transition-all"
              />
            </div>
            
            {/* Filter Toggle */}
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors text-xs font-medium ${isFilterOpen ? 'bg-gray-50 dark:bg-white/10 border-gray-300 dark:border-gray-600 text-black dark:text-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
            >
              <Filter size={14} />
              <span className="hidden lg:inline">Filter</span>
            </button>
            
            {/* Import / Export */}
            <div className="hidden lg:flex gap-1 ml-1">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".csv" />
                <button 
                    onClick={handleImportClick} 
                    className="p-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors" 
                    title="Import CSV"
                >
                    <Upload size={14} />
                </button>
                <button 
                    onClick={handleExportCSV} 
                    className="p-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors" 
                    title="Export CSV"
                >
                    <Download size={14} />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1"></div>

            <button 
                onClick={() => onNavigate ? onNavigate(ViewState.CREATE_USER) : setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm ml-1"
            >
              <Plus size={14} />
              <span className="hidden lg:inline">Add Employee</span>
            </button>
        </div>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="flex flex-wrap items-end gap-6">
                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Department</label>
                    <select 
                        value={departmentFilter} 
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                    >
                        <option value="All">All Departments</option>
                        {uniqueDepartments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1.5">Status</label>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs min-w-[140px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Terminated">Terminated</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors px-3">Clear All</button>
                    <button onClick={() => setIsFilterOpen(false)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500"><X size={14} /></button>
                </div>
            </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden fade-in">
        {filteredEmployees.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4">
                    <Search size={24} className="opacity-20" />
                </div>
                <p className="text-sm">No employees found.</p>
                <button onClick={clearFilters} className="text-blue-600 dark:text-blue-400 hover:underline text-xs mt-2">Clear Filters</button>
            </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar h-full pb-10">
            {filteredEmployees.map((emp) => (
              <div key={emp.id} className="group relative bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 flex flex-col">
                 <div className="flex justify-between items-start mb-4">
                    <div className="relative">
                        <img src={emp.avatarUrl} alt={emp.name} className="w-14 h-14 rounded-full border-2 border-white dark:border-[#18181b] shadow-sm object-cover" />
                        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white dark:border-[#18181b] rounded-full ${emp.status === 'Active' ? 'bg-green-500' : emp.status === 'On Leave' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => handleEditClick(emp)}
                            className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
                            title="Edit Details"
                        >
                            <Edit size={14} />
                        </button>
                        <button 
                            onClick={() => handleDelete(emp.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                 </div>
                 
                 <div className="mb-4 text-center">
                    <h3 className="text-sm font-semibold text-black dark:text-white mb-1">{emp.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{emp.role}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-gray-50 dark:bg-white/5 text-[10px] text-gray-400 dark:text-gray-300 rounded-full border border-gray-100 dark:border-gray-700">{emp.department}</span>
                 </div>

                 <div className="space-y-3 mb-6 bg-gray-50/50 dark:bg-white/5 p-3 rounded-lg border border-gray-50 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                       <Mail size={12} className="text-gray-400 dark:text-gray-500" />
                       <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                       <Phone size={12} className="text-gray-400 dark:text-gray-500" />
                       <span>{emp.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                       <MapPin size={12} className="text-gray-400 dark:text-gray-500" />
                       <span>{emp.location}</span>
                    </div>
                 </div>

                 <div className="mt-auto flex gap-2">
                    <button 
                        onClick={() => handleIDCardClick(emp)}
                        className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-all flex items-center justify-center gap-2 group/btn"
                    >
                        <CreditCard size={14} className="text-gray-400 group-hover/btn:text-black dark:group-hover/btn:text-white" />
                        ID Card
                    </button>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="h-full overflow-y-auto custom-scrollbar">
             <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 uppercase tracking-widest font-medium sticky top-0 bg-white dark:bg-[#18181b] z-10">
                    <th className="py-3 px-4 font-medium">Employee</th>
                    <th className="py-3 px-4 font-medium">Role</th>
                    <th className="py-3 px-4 font-medium">Department</th>
                    <th className="py-3 px-4 font-medium">Contact</th>
                    <th className="py-3 px-4 font-medium">Location</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium w-24 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="group border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                         <div className="flex items-center gap-3">
                            <img src={emp.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700" />
                            <div>
                                <div className="font-medium text-black dark:text-white">{emp.name}</div>
                                <div className="text-[10px] text-gray-400 font-mono">#{emp.id}</div>
                            </div>
                         </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{emp.role}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                         <span className="px-2 py-0.5 rounded bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800">{emp.department}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-0.5 text-gray-500 dark:text-gray-400">
                           <span className="truncate max-w-[150px]">{emp.email}</span>
                           <span className="text-[10px] text-gray-400">{emp.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                           <MapPin size={10} />
                           {emp.location}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-medium ${getStatusColor(emp.status)}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleIDCardClick(emp)}
                                className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
                                title="View ID Card"
                            >
                                <CreditCard size={14} />
                            </button>
                            <button 
                                onClick={() => handleEditClick(emp)}
                                className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
                                title="Edit"
                            >
                                <Edit size={14} />
                            </button>
                            <button 
                                onClick={() => handleDelete(emp.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
    
    {/* Keep the modal as a fallback or for editing */}
    <AddEmployeeModal 
        isOpen={isAddModalOpen} 
        onClose={handleModalClose} 
        onSave={handleAddEmployee}
        initialData={selectedEmployee}
    />

    <EmployeeIDCardModal 
        isOpen={isIDModalOpen}
        onClose={() => setIsIDModalOpen(false)}
        employee={cardPreviewEmployee}
    />
    </>
  );
};

export default EmployeesList;
