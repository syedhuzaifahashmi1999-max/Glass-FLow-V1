
import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Minimize, Maximize, Download, RefreshCcw, Search, ChevronDown, ChevronUp, Mail, Phone, MapPin, Filter, Printer, User, X, Briefcase, Share2, Building2, Clock, Calendar, Copy, ExternalLink, MessageSquare, Edit } from 'lucide-react';
import { Employee } from '../types';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';

interface OrganogramProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

interface TreeNodeProps {
  employee: Employee;
  employees: Employee[];
  depth?: number;
  searchQuery: string;
  expandAll: boolean;
  onViewProfile: (employee: Employee) => void;
}

// --- Components ---

const OrgCard: React.FC<{ employee: Employee; onClick: () => void; isHighlighted: boolean; onViewProfile: () => void }> = ({ employee, onClick, isHighlighted, onViewProfile }) => {
  return (
    <div 
        className={`
            relative flex flex-col items-center bg-white dark:bg-[#18181b] rounded-xl border transition-all duration-300 z-10 w-64
            ${isHighlighted 
                ? 'border-black dark:border-white ring-2 ring-black dark:ring-white shadow-xl scale-105' 
                : 'border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700'}
        `}
    >
      {/* Status Indicator */}
      <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#18181b] ${employee.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>

      <div className="p-5 flex flex-col items-center text-center w-full cursor-pointer" onClick={onClick}>
          <div className="relative mb-3">
            <img 
                src={employee.avatarUrl} 
                alt={employee.name} 
                className="w-14 h-14 rounded-full border-4 border-white dark:border-[#18181b] shadow-sm object-cover bg-gray-100 dark:bg-gray-800" 
            />
          </div>
          
          <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1">{employee.name}</h3>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-3">{employee.role}</p>
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">
            <Building2 size={10} /> {employee.department}
          </div>
      </div>

      {/* Action Footer */}
      <div className="w-full border-t border-gray-100 dark:border-gray-800 p-1 bg-gray-50/50 dark:bg-white/5 rounded-b-xl flex">
          <button 
            onClick={(e) => { e.stopPropagation(); onViewProfile(); }}
            className="flex-1 py-1.5 text-[10px] font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-black/20 rounded-md transition-colors flex items-center justify-center gap-1"
          >
            <User size={12} /> View Profile
          </button>
      </div>
    </div>
  );
};

const TreeNode: React.FC<TreeNodeProps> = ({ employee, employees, depth = 0, searchQuery, expandAll, onViewProfile }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  useEffect(() => {
      setIsExpanded(expandAll);
  }, [expandAll]);

  // Find direct reports
  const children = employees.filter(e => e.manager === employee.name);
  
  const isMatch = searchQuery && (
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      employee.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center">
      <div className="relative z-10 m-4 mb-8">
        <OrgCard 
            employee={employee} 
            onClick={() => setIsExpanded(!isExpanded)} 
            isHighlighted={!!isMatch} 
            onViewProfile={() => onViewProfile(employee)}
        />
        
        {/* Connector to Parent */}
        {depth > 0 && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
        )}

        {/* Expand/Collapse Button */}
        {children.length > 0 && (
            <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-[#18181b] border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black hover:border-black dark:hover:border-white transition-colors z-20 shadow-sm"
            >
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
        )}
      </div>

      {/* Children Container */}
      {isExpanded && children.length > 0 && (
        <div className="flex relative pt-4">
            {/* Horizontal Line Connector */}
            {children.length > 1 && (
                <div className="absolute top-0 left-0 w-full flex justify-center">
                    {/* We need a line that spans from the center of the first child to the center of the last child */}
                    {/* This visual trick uses the padding of the child containers to define the line length */}
                    <div className="absolute top-0 h-px bg-gray-300 dark:bg-gray-600 w-[calc(100%-16rem)]"></div> 
                </div>
            )}

            {children.map((child, index) => (
                <div key={child.id} className="flex flex-col items-center relative px-4">
                    {/* Connector Lines via Pseudo Elements Simulation */}
                    {/* Vertical line up from child */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                    
                    {/* Horizontal Connector Logic */}
                    {children.length > 1 && (
                        <>
                            {/* Left Line */}
                            {index > 0 && (
                                <div className="absolute top-0 right-1/2 w-[calc(50%+1rem)] h-px bg-gray-300 dark:bg-gray-600"></div>
                            )}
                            {/* Right Line */}
                            {index < children.length - 1 && (
                                <div className="absolute top-0 left-1/2 w-[calc(50%+1rem)] h-px bg-gray-300 dark:bg-gray-600"></div>
                            )}
                            {/* Curved Corner Fixes (Optional Polish) */}
                            {index === 0 && <div className="absolute top-0 left-1/2 w-px h-4 bg-transparent"></div>} {/* Spacer */}
                        </>
                    )}
                    
                    <TreeNode 
                        employee={child} 
                        employees={employees} 
                        depth={depth + 1} 
                        searchQuery={searchQuery} 
                        expandAll={expandAll} 
                        onViewProfile={onViewProfile}
                    />
                </div>
            ))}
        </div>
      )}
      {/* Vertical line from parent card to horizontal bus */}
      {isExpanded && children.length > 0 && (
          <div className="absolute top-[calc(100%-2rem)] left-1/2 -translate-x-1/2 w-px h-4 bg-gray-300 dark:bg-gray-600 -mt-16 z-0"></div>
      )}
    </div>
  );
};

interface ProfileDrawerProps {
    employee: Employee | null;
    onClose: () => void;
    allEmployees: Employee[];
    onSelectEmployee: (emp: Employee) => void;
    onEdit: (emp: Employee) => void;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ employee, onClose, allEmployees, onSelectEmployee, onEdit }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'team'>('info');

    if (!employee) return null;

    // Find reports
    const directReports = allEmployees.filter(e => e.manager === employee.name);

    return (
        <div className="fixed inset-y-0 right-0 w-[400px] bg-white dark:bg-[#18181b] shadow-2xl border-l border-gray-200 dark:border-gray-800 z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 flex justify-end p-4">
                <button 
                    onClick={onClose}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors h-fit"
                >
                    <X size={18} />
                </button>
                <div className="absolute -bottom-10 left-8">
                    <div className="relative">
                        <img src={employee.avatarUrl} alt={employee.name} className="w-20 h-20 rounded-full border-4 border-white dark:border-[#18181b] shadow-md object-cover bg-gray-200" />
                        <span className={`absolute bottom-1 right-1 w-3.5 h-3.5 border-2 border-white dark:border-[#18181b] rounded-full ${employee.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    </div>
                </div>
            </div>

            {/* Profile Info */}
            <div className="mt-12 px-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{employee.name}</h2>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{employee.role}</p>
                    </div>
                    <button 
                        onClick={() => onEdit(employee)}
                        className="p-2 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <Edit size={16} />
                    </button>
                </div>

                <div className="mt-6 flex border-b border-gray-100 dark:border-gray-800">
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors ${activeTab === 'info' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
                    >
                        Information
                    </button>
                    <button 
                        onClick={() => setActiveTab('team')}
                        className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors ${activeTab === 'team' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
                    >
                        Team & Reports
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                {activeTab === 'info' && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <Briefcase size={16} className="text-gray-400" />
                                <span>{employee.department} Department</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <MapPin size={16} className="text-gray-400" />
                                <span>{employee.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <Mail size={16} className="text-gray-400" />
                                <a href={`mailto:${employee.email}`} className="hover:text-blue-600 hover:underline">{employee.email}</a>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <Phone size={16} className="text-gray-400" />
                                <a href={`tel:${employee.phone}`} className="hover:text-blue-600 hover:underline">{employee.phone}</a>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Employment Details</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] text-gray-500 block mb-1">Employee ID</span>
                                    <span className="text-sm font-mono text-black dark:text-white">{employee.id}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-500 block mb-1">Joined Date</span>
                                    <span className="text-sm text-black dark:text-white">{employee.joinDate}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-500 block mb-1">Type</span>
                                    <span className="text-sm text-black dark:text-white">{employee.employmentType || 'Full-Time'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Reporting To</h4>
                            {employee.manager ? (
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-black dark:text-white">{employee.manager}</div>
                                        <div className="text-xs text-gray-500">Manager</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-400 italic">No manager assigned</div>
                            )}
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Direct Reports ({directReports.length})</h4>
                            {directReports.length > 0 ? (
                                <div className="space-y-2">
                                    {directReports.map(report => (
                                        <div 
                                            key={report.id} 
                                            onClick={() => onSelectEmployee(report)}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                                        >
                                            <img src={report.avatarUrl} className="w-8 h-8 rounded-full object-cover border border-gray-100 dark:border-gray-700" />
                                            <div>
                                                <div className="text-xs font-medium text-black dark:text-white group-hover:text-blue-600 transition-colors">{report.name}</div>
                                                <div className="text-[10px] text-gray-500">{report.role}</div>
                                            </div>
                                            <ChevronUp size={14} className="ml-auto text-gray-300 rotate-90" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-400 italic p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-center">
                                    No direct reports.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Organogram: React.FC<OrganogramProps> = ({ employees, setEmployees }) => {
  const [scale, setScale] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandAll, setExpandAll] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Employee | null>(null);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);

  // Identify Root Node (CEO / Top Level)
  // For simplicity, we assume the person with no manager or specifically 'Maria Garcia' in mock is root
  const rootEmployee = employees.find(e => !e.manager) || employees[0];

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleReset = () => setScale(1);

  const handleUpdateEmployee = (empData: Omit<Employee, 'id'>) => {
      if (editingEmployee) {
          setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? { ...e, ...empData } : e));
          // Also update selected profile view if it's the same person
          if (selectedProfile?.id === editingEmployee.id) {
             setSelectedProfile({ ...selectedProfile, ...empData });
          }
          setEditingEmployee(undefined);
      }
      setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="h-full flex flex-col bg-gray-50 dark:bg-[#09090b] overflow-hidden relative">
          
          {/* Toolbar */}
          <div className="absolute top-6 left-6 z-20 flex flex-col gap-4">
              <div className="bg-white dark:bg-[#18181b] p-1.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col gap-1">
                  <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md text-gray-600 dark:text-gray-300" title="Zoom In"><ZoomIn size={18} /></button>
                  <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md text-gray-600 dark:text-gray-300" title="Zoom Out"><ZoomOut size={18} /></button>
                  <button onClick={handleReset} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md text-gray-600 dark:text-gray-300" title="Reset View"><RefreshCcw size={16} /></button>
              </div>

              <div className="bg-white dark:bg-[#18181b] p-1.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col gap-1">
                  <button 
                    onClick={() => setExpandAll(!expandAll)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md text-gray-600 dark:text-gray-300" 
                    title={expandAll ? "Collapse All" : "Expand All"}
                  >
                      {expandAll ? <Minimize size={18} /> : <Maximize size={18} />}
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md text-gray-600 dark:text-gray-300" title="Download Chart"><Download size={18} /></button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md text-gray-600 dark:text-gray-300" title="Print"><Printer size={18} /></button>
              </div>
          </div>

          <div className="absolute top-6 right-6 z-20">
              <div className="bg-white dark:bg-[#18181b] p-1 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 flex items-center">
                  <div className="p-2 text-gray-400"><Search size={18} /></div>
                  <input 
                      type="text" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      placeholder="Search employee..." 
                      className="bg-transparent border-none outline-none text-sm w-48 text-black dark:text-white placeholder-gray-400"
                  />
              </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto cursor-grab active:cursor-grabbing bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px]">
              <div 
                  className="min-w-full min-h-full flex justify-center pt-20 pb-20 transition-transform duration-200 origin-top"
                  style={{ transform: `scale(${scale})` }}
              >
                  {rootEmployee ? (
                      <TreeNode 
                          employee={rootEmployee} 
                          employees={employees} 
                          searchQuery={searchQuery} 
                          expandAll={expandAll}
                          onViewProfile={setSelectedProfile}
                      />
                  ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">No organizational data available.</div>
                  )}
              </div>
          </div>

      </div>

      {/* Profile Drawer */}
      {selectedProfile && (
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedProfile(null)}></div>
      )}
      <ProfileDrawer 
          employee={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
          allEmployees={employees}
          onSelectEmployee={setSelectedProfile}
          onEdit={(emp) => {
              setEditingEmployee(emp);
              setIsEditModalOpen(true);
          }}
      />

      <AddEmployeeModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSave={handleUpdateEmployee}
          initialData={editingEmployee}
      />
    </>
  );
};

export default Organogram;
