
import React, { useState } from 'react';
import { X, User, Briefcase, Calendar, CheckCircle, ArrowRight, Layers, Layout } from 'lucide-react';
import { Employee, EmployeeProcess, OnboardingTask } from '../../types';

interface StartProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onStart: (process: Omit<EmployeeProcess, 'id' | 'progress'>) => void;
}

const StartProcessModal: React.FC<StartProcessModalProps> = ({ isOpen, onClose, employees, onStart }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    employeeId: string;
    type: 'Onboarding' | 'Offboarding';
    startDate: string;
    template: string;
  }>({
    employeeId: '',
    type: 'Onboarding',
    startDate: new Date().toISOString().split('T')[0],
    template: 'Standard'
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && !formData.employeeId) return; // Validation
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = () => {
    const employee = employees.find(e => e.id === formData.employeeId);
    if (!employee) return;

    // Generate tasks based on template (Mock Logic)
    let initialTasks: OnboardingTask[] = [];
    if (formData.type === 'Onboarding') {
        initialTasks = [
            { id: `t-${Date.now()}-1`, title: 'Sign Contract', status: 'Pending', category: 'HR', dueDate: formData.startDate, assignee: 'HR Manager' },
            { id: `t-${Date.now()}-2`, title: 'IT Setup & Access', status: 'Pending', category: 'IT', dueDate: formData.startDate, assignee: 'IT Support' },
            { id: `t-${Date.now()}-3`, title: 'Welcome Email', status: 'Pending', category: 'Admin', dueDate: formData.startDate, assignee: 'Manager' },
        ];
        if (formData.template === 'Engineering') {
            initialTasks.push({ id: `t-${Date.now()}-4`, title: 'GitHub Access', status: 'Pending', category: 'IT', assignee: 'Tech Lead' });
            initialTasks.push({ id: `t-${Date.now()}-5`, title: 'Dev Environment Setup', status: 'Pending', category: 'Training', assignee: 'Mentor' });
        }
    } else {
        initialTasks = [
            { id: `t-${Date.now()}-1`, title: 'Resignation Letter', status: 'Pending', category: 'HR', dueDate: formData.startDate, assignee: 'HR Manager' },
            { id: `t-${Date.now()}-2`, title: 'Revoke Access', status: 'Pending', category: 'IT', dueDate: formData.startDate, assignee: 'IT Support' },
            { id: `t-${Date.now()}-3`, title: 'Exit Interview', status: 'Pending', category: 'HR', dueDate: formData.startDate, assignee: 'HR Manager' },
        ];
    }

    onStart({
      employeeId: employee.id,
      employeeName: employee.name,
      role: employee.role,
      department: employee.department,
      avatarUrl: employee.avatarUrl,
      type: formData.type,
      stage: formData.type === 'Onboarding' ? 'Pre-boarding' : 'Notice Period',
      startDate: formData.startDate,
      tasks: initialTasks,
      status: 'Active'
    });
    onClose();
    // Reset
    setStep(1);
    setFormData({ employeeId: '', type: 'Onboarding', startDate: new Date().toISOString().split('T')[0], template: 'Standard' });
  };

  const selectedEmployee = employees.find(e => e.id === formData.employeeId);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-black">Start Process</h2>
            <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-black" /></button>
        </div>

        {/* Content */}
        <div className="p-6">
            
            {/* Steps Indicator */}
            <div className="flex items-center justify-center mb-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
                <div className="w-12 h-px bg-gray-200 mx-2"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
            </div>

            {step === 1 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Select Employee</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select 
                                value={formData.employeeId}
                                onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                                className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-black appearance-none"
                            >
                                <option value="">Select an employee...</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name} - {emp.role}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Process Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setFormData({...formData, type: 'Onboarding'})}
                                className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-medium transition-all ${formData.type === 'Onboarding' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                            >
                                <Briefcase size={16} /> Onboarding
                            </button>
                            <button 
                                onClick={() => setFormData({...formData, type: 'Offboarding'})}
                                className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-medium transition-all ${formData.type === 'Offboarding' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                            >
                                <X size={16} /> Offboarding
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Start Date</label>
                        <div className="relative">
                            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="date" 
                                value={formData.startDate}
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-black"
                            />
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                        {selectedEmployee && <img src={selectedEmployee.avatarUrl} className="w-10 h-10 rounded-full" />}
                        <div>
                            <p className="text-sm font-bold text-black">{selectedEmployee?.name}</p>
                            <p className="text-xs text-gray-500">{formData.type} starting {formData.startDate}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Select Template</label>
                        <div className="space-y-2">
                            {['Standard', 'Engineering', 'Executive'].map(t => (
                                <div 
                                    key={t}
                                    onClick={() => setFormData({...formData, template: t})}
                                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${formData.template === t ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded bg-white border ${formData.template === t ? 'border-gray-200' : 'border-gray-100'}`}>
                                            {t === 'Standard' ? <Layout size={16} /> : <Layers size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-black">{t} {formData.type}</p>
                                            <p className="text-[10px] text-gray-500">Includes {t === 'Engineering' ? '12' : '8'} standard tasks</p>
                                        </div>
                                    </div>
                                    {formData.template === t && <CheckCircle size={18} className="text-black" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center">
            {step > 1 ? (
                <button onClick={handleBack} className="text-sm text-gray-500 hover:text-black font-medium">Back</button>
            ) : (
                <div></div>
            )}
            
            {step === 1 ? (
                <button 
                    onClick={handleNext}
                    disabled={!formData.employeeId}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Next Step <ArrowRight size={16} />
                </button>
            ) : (
                <button 
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
                >
                    <CheckCircle size={16} /> Start Process
                </button>
            )}
        </div>

      </div>
    </div>
  );
};

export default StartProcessModal;
