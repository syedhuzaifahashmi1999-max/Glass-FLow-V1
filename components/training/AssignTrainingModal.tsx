
import React, { useState } from 'react';
import { X, User, Calendar, Check } from 'lucide-react';
import { TrainingCourse, Employee, TrainingAssignment } from '../../types';

interface AssignTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (assignment: Omit<TrainingAssignment, 'id'>) => void;
  course: TrainingCourse | null;
  employees: Employee[];
}

const AssignTrainingModal: React.FC<AssignTrainingModalProps> = ({ isOpen, onClose, onAssign, course, employees }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen || !course) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !dueDate) return;

    onAssign({
        courseId: course.id,
        employeeId,
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate,
        status: 'Not Started',
        progress: 0
    });
    setEmployeeId('');
    setDueDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="relative w-full max-w-md bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
           <div>
             <h2 className="text-lg font-light text-black dark:text-white tracking-tight">Assign Training</h2>
             <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[250px]">{course.title}</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full p-2 hover:bg-gray-100 dark:hover:bg-white/10">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="p-6">
           <form onSubmit={handleSubmit} className="space-y-5">
             
             <div>
                <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Select Employee</label>
                <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white appearance-none"
                    >
                        <option value="">Choose an employee...</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name} - {emp.role}</option>
                        ))}
                    </select>
                </div>
             </div>

             <div>
                 <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Due Date</label>
                 <div className="relative">
                     <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input 
                        type="date"
                        value={dueDate} 
                        onChange={(e) => setDueDate(e.target.value)} 
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white" 
                     />
                 </div>
             </div>

             <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
               <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-all text-xs font-medium uppercase tracking-wide">Cancel</button>
               <button type="submit" disabled={!employeeId || !dueDate} className="px-6 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 disabled:opacity-50 transition-all text-xs font-medium uppercase tracking-wide flex items-center justify-center gap-2">
                   <Check size={14} /> Assign
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AssignTrainingModal;
