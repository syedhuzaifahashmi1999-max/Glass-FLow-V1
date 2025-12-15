

import React, { useMemo, useState } from 'react';
import { 
  Users, UserPlus, Clock, CalendarDays, Award, Briefcase, 
  MapPin, TrendingUp, CheckCircle, AlertCircle, MoreHorizontal,
  ChevronRight, Filter, Download, Plus, Search, DollarSign
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, AreaChart, Area, CartesianGrid } from 'recharts';
import { Employee, LeaveRequest, Candidate, Department, AttendanceRecord } from '../types';
import { MOCK_EMPLOYEES, MOCK_DEPARTMENTS, MOCK_LEAVE_REQUESTS, MOCK_ATTENDANCE, MOCK_CANDIDATES } from '../constants';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';
import RunPayrollModal from '../components/payroll/RunPayrollModal';

const HRDashboard: React.FC = () => {
  // --- State ---
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // --- Derived Metrics ---
  const totalEmployees = MOCK_EMPLOYEES.length;
  const activeEmployees = MOCK_EMPLOYEES.filter(e => e.status === 'Active').length;
  const onLeaveToday = MOCK_ATTENDANCE.filter(a => a.status === 'On Leave' && a.date === new Date().toISOString().split('T')[0]).length;
  const openPositions = 12; // Mock
  const newHiresMonth = MOCK_EMPLOYEES.filter(e => {
      const joinDate = new Date(e.joinDate);
      const now = new Date();
      return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
  }).length;

  const attritionRate = 2.4; // Mock percentage
  const employeeNPS = 42; // Mock eNPS

  // --- Chart Data ---
  
  // Headcount Trend (Mock Data)
  const headcountTrendData = [
      { name: 'Jan', count: 45 },
      { name: 'Feb', count: 48 },
      { name: 'Mar', count: 50 },
      { name: 'Apr', count: 52 },
      { name: 'May', count: 51 }, // Attrition dip
      { name: 'Jun', count: 55 },
  ];

  // Department Stats
  const deptData = useMemo(() => {
      return MOCK_DEPARTMENTS.map(d => ({
          name: d.name,
          count: MOCK_EMPLOYEES.filter(e => e.department === d.name).length
      })).filter(d => departmentFilter === 'All' || d.name === departmentFilter);
  }, [departmentFilter]);

  // Recruitment Funnel
  const recruitmentFunnel = useMemo(() => {
      const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
      return stages.map(stage => ({
          name: stage,
          value: MOCK_CANDIDATES.filter(c => c.stage === stage).length
      }));
  }, []);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  // --- Handlers ---
  const handleApproveLeave = (id: string) => {
      alert(`Leave request ${id} approved (Simulated).`);
  };

  const handleRunPayroll = (data: any) => {
      console.log('Payroll Data', data);
      setIsPayrollModalOpen(false);
      alert('Payroll run initiated successfully.');
  };

  return (
    <>
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-y-auto custom-scrollbar fade-in">
        
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
                <h1 className="text-3xl font-light text-black dark:text-white mb-2">People Operations</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your workforce, talent acquisition, and culture.</p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
                    <Filter size={14} className="text-gray-400" />
                    <select 
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="bg-transparent text-xs font-medium text-black dark:text-white outline-none"
                    >
                        <option value="All">All Departments</option>
                        {MOCK_DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                </div>

                <button 
                    onClick={() => setIsPayrollModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-black dark:text-white rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                >
                    <DollarSign size={14} className="text-green-600" /> Run Payroll
                </button>

                <button 
                    onClick={() => setIsEmployeeModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold hover:opacity-90 transition-colors shadow-sm"
                >
                    <Plus size={14} /> Add Employee
                </button>
            </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                        <Users size={20} />
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+4%</span>
                </div>
                <h3 className="text-3xl font-light text-black dark:text-white">{totalEmployees}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-1">Total Headcount</p>
            </div>

            <div className="p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-purple-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                        <UserPlus size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-400">This Month</span>
                </div>
                <h3 className="text-3xl font-light text-black dark:text-white">{newHiresMonth}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-1">New Hires</p>
            </div>

            <div className="p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-orange-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
                        <TrendingUp size={20} />
                    </div>
                    <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">{attritionRate}%</span>
                </div>
                <h3 className="text-3xl font-light text-black dark:text-white">Low</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-1">Attrition Rate</p>
            </div>

            <div className="p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-pink-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-lg">
                        <Award size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-400">eNPS</span>
                </div>
                <h3 className="text-3xl font-light text-black dark:text-white">{employeeNPS}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-1">Employee Satisfaction</p>
            </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Headcount Trend */}
            <div className="lg:col-span-2 bg-white dark:bg-[#18181b] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
                <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-6">Headcount Growth</h3>
                <div className="flex-1 w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={headcountTrendData}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recruitment Funnel */}
            <div className="bg-white dark:bg-[#18181b] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Recruitment Pipeline</h3>
                    <span className="text-xs text-blue-600 cursor-pointer hover:underline">View ATS</span>
                </div>
                <div className="flex-1 flex flex-col justify-center space-y-4">
                    {recruitmentFunnel.map((stage, idx) => (
                        <div key={stage.name} className="relative">
                            <div className="flex justify-between text-xs mb-1 font-medium text-gray-600 dark:text-gray-300">
                                <span>{stage.name}</span>
                                <span>{stage.value}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-500" 
                                    style={{ 
                                        width: `${(stage.value / Math.max(...recruitmentFunnel.map(s => s.value))) * 100}%`,
                                        backgroundColor: COLORS[idx % COLORS.length]
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Bottom Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Who's Away (Leave Calendar) */}
            <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Who's Away</h3>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div> On Leave
                        <div className="w-2 h-2 bg-blue-400 rounded-full ml-2"></div> Remote
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto max-h-[300px] p-2">
                    {MOCK_ATTENDANCE.filter(a => a.status === 'On Leave' || a.status === 'Absent').map(att => (
                        <div key={att.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg mb-1 group">
                            <div className="flex items-center gap-3">
                                <img src={att.avatarUrl} className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-700 object-cover" />
                                <div>
                                    <p className="text-sm font-medium text-black dark:text-white">{att.employeeName}</p>
                                    <p className="text-[10px] text-gray-500">Engineering</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                    att.status === 'On Leave' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                    {att.status}
                                </span>
                                <p className="text-[10px] text-gray-400 mt-1">Until tomorrow</p>
                            </div>
                        </div>
                    ))}
                    {MOCK_ATTENDANCE.filter(a => a.status === 'On Leave' || a.status === 'Absent').length === 0 && (
                         <div className="text-center py-10 text-gray-400 text-xs">Everyone is present today.</div>
                    )}
                </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Pending Requests</h3>
                    <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Needs Action</span>
                </div>
                <div className="flex-1 overflow-y-auto max-h-[300px] p-2">
                    {MOCK_LEAVE_REQUESTS.filter(r => r.status === 'Pending').map(req => (
                        <div key={req.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg mb-1 group transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                                    <CalendarDays size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-black dark:text-white">{req.employeeName}</p>
                                    <p className="text-[10px] text-gray-500">{req.type} • {req.days} Days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right mr-2">
                                    <span className="text-[10px] text-gray-400 block">{req.startDate}</span>
                                </div>
                                <button 
                                    onClick={() => handleApproveLeave(req.id)}
                                    className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded opacity-0 group-hover:opacity-100 transition-all" 
                                    title="Approve"
                                >
                                    <CheckCircle size={16} />
                                </button>
                                <button className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-all" title="Reject">
                                    <AlertCircle size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {MOCK_LEAVE_REQUESTS.filter(r => r.status === 'Pending').length === 0 && (
                        <div className="text-center py-10 text-gray-400 text-xs">No pending requests.</div>
                    )}
                </div>
            </div>

        </div>

    </div>

    {/* Modals */}
    <AddEmployeeModal 
        isOpen={isEmployeeModalOpen} 
        onClose={() => setIsEmployeeModalOpen(false)} 
        onSave={(emp) => { console.log(emp); setIsEmployeeModalOpen(false); alert('Employee Added!'); }}
    />
    
    <RunPayrollModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        onSave={handleRunPayroll}
        employees={MOCK_EMPLOYEES}
    />
    </>
  );
};

export default HRDashboard;
