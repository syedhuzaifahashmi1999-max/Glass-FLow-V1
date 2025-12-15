
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, Calendar, CheckCircle, XCircle, LogIn, LogOut, MapPin, 
  Coffee, Play, Pause, History, Filter, Download, Search, AlertCircle, 
  MoreHorizontal, ChevronRight 
} from 'lucide-react';
import { AttendanceRecord } from '../types';
import { MOCK_ATTENDANCE, MOCK_EMPLOYEES } from '../constants';

// Enhanced local type for session management
interface SessionState {
  status: 'idle' | 'working' | 'break';
  startTime: Date | null;
  breakStartTime: Date | null;
  totalBreakSeconds: number;
}

const AttendanceBoard: React.FC = () => {
  // --- Global Clock ---
  const [currentTime, setCurrentTime] = useState(new Date());

  // --- Session State ---
  const [session, setSession] = useState<SessionState>({
    status: 'idle',
    startTime: null,
    breakStartTime: null,
    totalBreakSeconds: 0
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // --- Data State ---
  const [records, setRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // --- Effects ---

  // 1. Global Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Session Timer Logic
  useEffect(() => {
    let interval: number;
    
    if (session.status === 'working' && session.startTime) {
      interval = window.setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - session.startTime!.getTime()) / 1000);
        setElapsedSeconds(diff - session.totalBreakSeconds);
      }, 1000);
    } 
    // Note: If on break, we don't increment elapsed work seconds, 
    // but we could track break duration separately if needed.

    return () => clearInterval(interval);
  }, [session]);

  // --- Formatters ---

  const formatDuration = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --- Handlers ---

  const handleCheckIn = () => {
    setSession({
      status: 'working',
      startTime: new Date(),
      breakStartTime: null,
      totalBreakSeconds: 0
    });
  };

  const handleToggleBreak = () => {
    if (session.status === 'working') {
      // Start Break
      setSession(prev => ({
        ...prev,
        status: 'break',
        breakStartTime: new Date()
      }));
    } else if (session.status === 'break') {
      // End Break
      const now = new Date();
      const breakDuration = session.breakStartTime 
        ? Math.floor((now.getTime() - session.breakStartTime.getTime()) / 1000) 
        : 0;
      
      setSession(prev => ({
        ...prev,
        status: 'working',
        breakStartTime: null,
        totalBreakSeconds: prev.totalBreakSeconds + breakDuration
      }));
    }
  };

  const handleCheckOut = () => {
    if (!session.startTime) return;

    const checkOutTime = new Date();
    // Calculate final duration string
    const finalDurationStr = formatDuration(elapsedSeconds); // simplified
    
    // Create new record
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId: 'e1', // Current user mock
      employeeName: 'Alex Doe',
      avatarUrl: 'https://picsum.photos/100/100?random=20',
      date: new Date().toISOString().split('T')[0],
      checkIn: formatTime(session.startTime),
      checkOut: formatTime(checkOutTime),
      status: 'Present',
      totalHours: finalDurationStr.replace(/s/g, '').replace(/h/g, 'h').replace(/m/g, 'm'), // formatting match
      location: 'San Francisco HQ'
    };

    setRecords(prev => [newRecord, ...prev]);
    
    // Reset Session
    setSession({
      status: 'idle',
      startTime: null,
      breakStartTime: null,
      totalBreakSeconds: 0
    });
    setElapsedSeconds(0);
  };

  const handleDeleteRecord = (id: string) => {
      if(confirm('Delete this log entry?')) {
          setRecords(prev => prev.filter(r => r.id !== id));
      }
  };

  // --- Filtering & Stats ---

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = r.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, filterStatus]);

  const stats = useMemo(() => {
    return {
      present: records.filter(r => r.status === 'Present').length,
      late: records.filter(r => r.status === 'Late').length,
      absent: records.filter(r => r.status === 'Absent').length,
      onLeave: records.filter(r => r.status === 'On Leave').length
    };
  }, [records]);

  const getStatusColor = (status: AttendanceRecord['status']) => {
      switch (status) {
          case 'Present': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
          case 'Late': return 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20';
          case 'Absent': return 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20';
          case 'Half Day': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
          case 'On Leave': return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
          default: return 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400';
      }
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
        
        {/* --- Header --- */}
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0">
            <div>
                <h1 className="text-2xl font-light text-black dark:text-white mb-1">Attendance</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                    Track your daily hours, breaks, and team status.
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-mono bg-gray-50 dark:bg-white/5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-black dark:text-white">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono bg-black dark:bg-white text-white dark:text-black px-3 py-2 rounded-lg border border-black dark:border-white shadow-lg shadow-black/10">
                    <Clock size={14} className="text-white/70 dark:text-black/70" />
                    <span>{currentTime.toLocaleTimeString([], { hour12: true })}</span>
                </div>
            </div>
        </div>

        {/* --- Hero Section (Punch Clock) --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8 shrink-0">
            
            {/* The Timer Card */}
            <div className="xl:col-span-2 bg-gradient-to-br from-gray-900 to-black dark:from-gray-800 dark:to-gray-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                
                {/* Left: Status & Timer */}
                <div className="relative z-10 flex flex-col items-center md:items-start mb-8 md:mb-0 w-full">
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`flex w-2.5 h-2.5 rounded-full ${session.status === 'idle' ? 'bg-gray-500' : session.status === 'working' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500 animate-pulse'}`}></span>
                        <span className="text-sm font-medium text-gray-300 uppercase tracking-widest">
                            {session.status === 'idle' ? 'Not Checked In' : session.status === 'working' ? 'Working' : 'On Break'}
                        </span>
                    </div>
                    
                    <div className="text-7xl font-light font-mono tracking-tighter mb-4 tabular-nums">
                        {session.status === 'idle' ? '00:00:00' : formatDuration(elapsedSeconds)}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                            <MapPin size={14} /> 
                            <span>San Francisco HQ <span className="opacity-50">(192.168.1.42)</span></span>
                        </div>
                        {session.startTime && (
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <LogIn size={14} /> 
                                <span>Checked in at {formatTime(session.startTime)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="relative z-10 flex gap-4">
                    {session.status === 'idle' ? (
                        <button 
                            onClick={handleCheckIn}
                            className="group relative w-32 h-32 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:scale-105"
                        >
                            <div className="bg-white/20 p-3 rounded-full mb-2 group-hover:rotate-12 transition-transform">
                                <LogIn size={28} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider">Check In</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-6">
                            {/* Break Button */}
                            <button 
                                onClick={handleToggleBreak}
                                className={`
                                    group w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300
                                    ${session.status === 'break' 
                                        ? 'border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white' 
                                        : 'border-yellow-500 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-white'}
                                `}
                            >
                                {session.status === 'break' ? <Play size={24} className="mb-1" /> : <Coffee size={24} className="mb-1" />}
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                    {session.status === 'break' ? 'Resume' : 'Break'}
                                </span>
                            </button>

                            {/* Check Out Button */}
                            <button 
                                onClick={handleCheckOut}
                                className="group w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 text-white flex flex-col items-center justify-center transition-all duration-300 shadow-lg hover:scale-105"
                            >
                                <LogOut size={24} className="mb-1" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Clock Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">Present</span>
                        <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-md text-emerald-600 dark:text-emerald-400"><CheckCircle size={16} /></div>
                    </div>
                    <div>
                        <span className="text-3xl font-light text-emerald-900 dark:text-emerald-300">{stats.present}</span>
                        <div className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-1">Employees</div>
                    </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-xl p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold text-orange-700 dark:text-orange-400 tracking-wider">Late</span>
                        <div className="p-1.5 bg-orange-100 dark:bg-orange-500/20 rounded-md text-orange-600 dark:text-orange-400"><AlertCircle size={16} /></div>
                    </div>
                    <div>
                        <span className="text-3xl font-light text-orange-900 dark:text-orange-300">{stats.late}</span>
                        <div className="text-[10px] text-orange-600/70 dark:text-orange-400/70 mt-1">Arrivals &gt; 9:30 AM</div>
                    </div>
                </div>
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold text-red-700 dark:text-red-400 tracking-wider">Absent</span>
                        <div className="p-1.5 bg-red-100 dark:bg-red-500/20 rounded-md text-red-600 dark:text-red-400"><XCircle size={16} /></div>
                    </div>
                    <div>
                        <span className="text-3xl font-light text-red-900 dark:text-red-300">{stats.absent}</span>
                        <div className="text-[10px] text-red-600/70 dark:text-red-400/70 mt-1">No check-in</div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">On Leave</span>
                        <div className="p-1.5 bg-gray-200 dark:bg-white/10 rounded-md text-gray-500 dark:text-gray-400"><Calendar size={16} /></div>
                    </div>
                    <div>
                        <span className="text-3xl font-light text-black dark:text-white">{stats.onLeave}</span>
                        <div className="text-[10px] text-gray-400 mt-1">Approved</div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Activity Log Section --- */}
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
            
            {/* Log Toolbar */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search employee..." 
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20" 
                        />
                    </div>
                    
                    <div className="relative">
                        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20 appearance-none min-w-[120px]"
                        >
                            <option value="All">All Status</option>
                            <option value="Present">Present</option>
                            <option value="Late">Late</option>
                            <option value="Absent">Absent</option>
                            <option value="On Leave">On Leave</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors" title="Export CSV">
                        <Download size={14} />
                    </button>
                </div>
            </div>
            
            {/* Log Table */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 dark:bg-white/5 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="py-3 px-6 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Employee</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Date</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Check In</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Check Out</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Duration</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Location</th>
                            <th className="py-3 px-4 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">Status</th>
                            <th className="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-gray-50 dark:divide-gray-800">
                        {filteredRecords.map(record => (
                            <tr key={record.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="py-3 px-6">
                                    <div className="flex items-center gap-3">
                                        <img src={record.avatarUrl} className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700" alt="" />
                                        <div>
                                            <p className="font-medium text-black dark:text-white">{record.employeeName}</p>
                                            <p className="text-[10px] text-gray-400 font-mono">{record.employeeId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{record.date}</td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-300 font-mono">{record.checkIn || '--:--'}</td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-300 font-mono">{record.checkOut || '--:--'}</td>
                                <td className="py-3 px-4 font-mono font-medium text-black dark:text-white">{record.totalHours || '-'}</td>
                                <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                                    {record.location ? (
                                        <span className="flex items-center gap-1 text-[10px] bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-800 w-fit">
                                            <MapPin size={10} /> {record.location}
                                        </span>
                                    ) : '-'}
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${getStatusColor(record.status)}`}>
                                        {record.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <button 
                                        className="text-gray-300 hover:text-black dark:hover:text-white p-1 opacity-0 group-hover:opacity-100 transition-all"
                                        title="View Details"
                                    >
                                        <MoreHorizontal size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredRecords.length === 0 && (
                            <tr>
                                <td colSpan={8} className="py-12 text-center text-gray-400">
                                    No records found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    </div>
  );
};

export default AttendanceBoard;
