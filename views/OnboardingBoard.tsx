
import React, { useState } from 'react';
import { Plus, Search, CheckCircle, User, BookOpen, ChevronRight, Layout, LayoutList } from 'lucide-react';
import { MOCK_ONBOARDING_PROCESSES, MOCK_EMPLOYEES } from '../constants';
import { EmployeeProcess } from '../types';
import StartProcessModal from '../components/onboarding/StartProcessModal';
import ProcessDetailModal from '../components/onboarding/ProcessDetailModal';

const OnboardingBoard: React.FC = () => {
    const [processes, setProcesses] = useState<EmployeeProcess[]>(MOCK_ONBOARDING_PROCESSES);
    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState<'journey' | 'list'>('journey');
    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState<EmployeeProcess | null>(null);

    // Stages for the Journey View
    const STAGES = ['Pre-boarding', 'Week 1', 'Month 1', 'Probation'];

    const filteredProcesses = processes.filter(p => 
        p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStartProcess = (processData: Omit<EmployeeProcess, 'id' | 'progress'>) => {
        const newProcess: EmployeeProcess = {
            ...processData,
            id: `OB-${Date.now()}`,
            progress: 0
        };
        setProcesses(prev => [newProcess, ...prev]);
    };

    const handleUpdateTask = (processId: string, taskId: string, newStatus: 'Pending' | 'Completed') => {
        setProcesses(prev => prev.map(p => {
            if (p.id === processId) {
                const updatedTasks = p.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
                const completedCount = updatedTasks.filter(t => t.status === 'Completed').length;
                const progress = Math.round((completedCount / updatedTasks.length) * 100);
                
                const updatedProcess = { ...p, tasks: updatedTasks, progress };
                if (selectedProcess?.id === processId) setSelectedProcess(updatedProcess);
                return updatedProcess;
            }
            return p;
        }));
    };

    const handleAddTask = (processId: string, task: any) => {
         setProcesses(prev => prev.map(p => {
            if (p.id === processId) {
                const updatedTasks = [...p.tasks, task];
                const completedCount = updatedTasks.filter(t => t.status === 'Completed').length;
                const progress = Math.round((completedCount / updatedTasks.length) * 100);
                
                const updatedProcess = { ...p, tasks: updatedTasks, progress };
                if (selectedProcess?.id === processId) setSelectedProcess(updatedProcess);
                return updatedProcess;
            }
            return p;
        }));
    };

    const handleUpdateProcess = (updatedProcess: EmployeeProcess) => {
        setProcesses(prev => prev.map(p => p.id === updatedProcess.id ? updatedProcess : p));
        setSelectedProcess(updatedProcess);
    };

    return (
        <>
        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
            
            {/* Header */}
            <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex justify-between items-end shrink-0">
                <div>
                    <h1 className="text-2xl font-light text-black dark:text-white mb-1">Employee Onboarding</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Track new hire journeys and task completion.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <button onClick={() => setView('journey')} className={`p-2 rounded-md transition-colors ${view === 'journey' ? 'bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}><Layout size={16}/></button>
                        <button onClick={() => setView('list')} className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}><LayoutList size={16}/></button>
                    </div>
                    <button 
                        onClick={() => setIsStartModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
                    >
                        <Plus size={14} /> Start Onboarding
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6 flex gap-4 shrink-0">
                <div className="relative flex-1 max-w-md">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search employee or role..." 
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {view === 'journey' ? (
                    <div className="h-full overflow-y-auto custom-scrollbar p-1">
                        <div className="space-y-4">
                            {filteredProcesses.map(process => (
                                <div 
                                    key={process.id} 
                                    onClick={() => setSelectedProcess(process)}
                                    className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <img src={process.avatarUrl} className="w-12 h-12 rounded-full border-2 border-white dark:border-[#18181b] shadow-sm" />
                                        <div>
                                            <h3 className="text-base font-bold text-black dark:text-white">{process.employeeName}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{process.role}</p>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <div className="text-xs font-medium text-black dark:text-white">{process.progress}% Complete</div>
                                            <div className="text-[10px] text-gray-400">Started {process.startDate}</div>
                                        </div>
                                    </div>

                                    {/* Journey Map */}
                                    <div className="relative">
                                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-white/5 -translate-y-1/2 rounded-full"></div>
                                        {/* Progress Line */}
                                        <div 
                                            className="absolute top-1/2 left-0 h-1 bg-black dark:bg-white -translate-y-1/2 rounded-full transition-all duration-1000" 
                                            style={{ width: `${(STAGES.indexOf(process.stage) / (STAGES.length - 1)) * 100}%` }}
                                        ></div>

                                        <div className="relative flex justify-between">
                                            {STAGES.map((stage, idx) => {
                                                const isActive = stage === process.stage;
                                                const isCompleted = STAGES.indexOf(stage) < STAGES.indexOf(process.stage);
                                                
                                                return (
                                                    <div key={stage} className="flex flex-col items-center gap-2">
                                                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                                                            isCompleted ? 'bg-black dark:bg-white border-black dark:border-white' : 
                                                            isActive ? 'bg-white dark:bg-black border-black dark:border-white scale-125' : 
                                                            'bg-white dark:bg-[#18181b] border-gray-200 dark:border-gray-700'
                                                        }`}>
                                                            {isCompleted && <CheckCircle size={10} className="text-white dark:text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                                                        </div>
                                                        <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-black dark:text-white' : 'text-gray-400'}`}>{stage}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredProcesses.length === 0 && (
                                <div className="text-center py-20 text-gray-400 text-sm">No onboarding processes found.</div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto custom-scrollbar bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800 text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold sticky top-0 backdrop-blur-sm">
                                <tr>
                                    <th className="px-6 py-3">Employee</th>
                                    <th className="px-6 py-3">Stage</th>
                                    <th className="px-6 py-3">Progress</th>
                                    <th className="px-6 py-3">Start Date</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-xs">
                                {filteredProcesses.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedProcess(p)}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={p.avatarUrl} className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700" />
                                                <div>
                                                    <div className="font-medium text-black dark:text-white">{p.employeeName}</div>
                                                    <div className="text-gray-500 dark:text-gray-400">{p.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">{p.stage}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${p.progress}%` }}></div>
                                                </div>
                                                <span className="font-mono text-black dark:text-white">{p.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{p.startDate}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-gray-400 hover:text-black dark:hover:text-white"><ChevronRight size={14}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>

        <StartProcessModal 
            isOpen={isStartModalOpen} 
            onClose={() => setIsStartModalOpen(false)} 
            employees={MOCK_EMPLOYEES} 
            onStart={handleStartProcess} 
        />

        <ProcessDetailModal 
            isOpen={!!selectedProcess} 
            onClose={() => setSelectedProcess(null)} 
            process={selectedProcess} 
            onUpdateTask={handleUpdateTask} 
            onAddTask={handleAddTask} 
            onUpdateProcess={handleUpdateProcess} 
        />
        </>
    );
};

export default OnboardingBoard;
