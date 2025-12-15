
import React, { useState } from 'react';
import { X, FileText, Check, User, Briefcase } from 'lucide-react';
import { HRLetter, LetterType, Employee } from '../../types';

interface LetterRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (letter: Omit<HRLetter, 'id' | 'status' | 'dateIssued' | 'rejectionReason'>) => void;
  employees: Employee[];
  isAdmin?: boolean;
}

const LetterRequestModal: React.FC<LetterRequestModalProps> = ({ isOpen, onClose, onSave, employees, isAdmin = false }) => {
  const [type, setType] = useState<LetterType>('Employment Verification');
  const [purpose, setPurpose] = useState('');
  const [addressee, setAddressee] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetEmployee;
    if (isAdmin && selectedEmployeeId) {
        targetEmployee = employees.find(e => e.id === selectedEmployeeId);
    } else {
        // Mock current user if not admin or simple request
        targetEmployee = { id: 'e1', name: 'Alex Doe', avatarUrl: 'https://picsum.photos/100/100?random=20' };
    }

    if (!targetEmployee) return;

    onSave({
      type,
      purpose,
      addressee: addressee || 'To Whom It May Concern',
      employeeId: targetEmployee.id,
      employeeName: targetEmployee.name,
      avatarUrl: targetEmployee.avatarUrl,
      dateRequested: new Date().toISOString().split('T')[0]
    });
    onClose();
    // Reset
    setType('Employment Verification');
    setPurpose('');
    setAddressee('');
    setSelectedEmployeeId('');
  };

  const letterTypes: LetterType[] = [
      'Employment Verification',
      'Salary Certificate',
      'NOC',
      'Experience Letter',
      'Confirmation Letter'
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="relative w-full max-w-lg bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
           <div>
             <h2 className="text-lg font-light text-black dark:text-white tracking-tight">{isAdmin ? 'Issue HR Letter' : 'Request HR Letter'}</h2>
             <p className="text-xs text-gray-500 dark:text-gray-400">{isAdmin ? 'Generate and approve a letter for an employee.' : 'Submit a request for official documentation.'}</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full p-2 hover:bg-gray-100 dark:hover:bg-white/10">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="p-6">
           <form onSubmit={handleSubmit} className="space-y-5">
             
             {/* Admin: Employee Selector */}
             {isAdmin && (
                <div>
                    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Employee</label>
                    <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            required
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white appearance-none"
                        >
                            <option value="">Select Employee...</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name} - {emp.role}</option>
                            ))}
                        </select>
                    </div>
                </div>
             )}

             <div>
                <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Letter Type</label>
                <div className="relative">
                    <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                        value={type}
                        onChange={(e) => setType(e.target.value as LetterType)}
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white appearance-none"
                    >
                        {letterTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
             </div>

             <div>
                <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Addressee (Optional)</label>
                <div className="relative">
                    <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        value={addressee}
                        onChange={(e) => setAddressee(e.target.value)}
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                        placeholder="e.g. Chase Bank / To Whom It May Concern"
                    />
                </div>
             </div>

             <div>
                <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Purpose / Notes</label>
                <textarea 
                    required={!isAdmin} // Only required if user requesting
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white resize-none h-24"
                    placeholder={isAdmin ? "Internal notes for this issuance..." : "Briefly describe why you need this letter..."}
                />
             </div>

             <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
               <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-all text-xs font-medium uppercase tracking-wide">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all text-xs font-medium uppercase tracking-wide flex items-center justify-center gap-2">
                   <Check size={14} /> {isAdmin ? 'Issue Letter' : 'Submit Request'}
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default LetterRequestModal;
