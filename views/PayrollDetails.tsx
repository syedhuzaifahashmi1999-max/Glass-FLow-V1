
import React, { useState } from 'react';
import { ArrowLeft, Download, CheckCircle, Send, MoreHorizontal, DollarSign, PieChart, AlertCircle, FileText, Printer, Building, ChevronDown, Mail } from 'lucide-react';
import { PayrollRun, Employee } from '../types';
import PayslipModal from '../components/payroll/PayslipModal';

interface PayrollDetailsProps {
  run: PayrollRun;
  employees: Employee[];
  onBack: () => void;
  onUpdateStatus: (runId: string, status: PayrollRun['status']) => void;
}

const PayrollDetails: React.FC<PayrollDetailsProps> = ({ run, employees, onBack, onUpdateStatus }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Calculations ---
  // Note: This logic MUST match PayslipModal.tsx for consistency.
  // Formula:
  // Gross = Annual / 12
  // Basic = 50% Gross
  // Tax = 15% Gross
  // PF = 12% Basic
  // Insurance = 150
  // Professional Tax = 200
  // Deductions = Tax + PF + Ins + ProfTax
  // Net = Gross - Deductions

  const calculatePay = (employee: Employee) => {
      const annual = parseFloat((employee.salary || '0').replace(/[^0-9.]/g, ''));
      const gross = annual > 0 ? annual / 12 : 0;
      
      const basic = gross * 0.50;
      const incomeTax = gross * 0.15;
      const providentFund = basic * 0.12;
      const insurance = 150;
      const profTax = 200;
      
      const deductions = incomeTax + providentFund + insurance + profTax;
      const net = gross - deductions;

      return { gross, deductions, net, tax: incomeTax };
  };

  // Metrics for the cards
  const metrics = employees.reduce((acc, emp) => {
      const { gross, deductions, net, tax } = calculatePay(emp);
      return {
          totalGross: acc.totalGross + gross,
          totalDeductions: acc.totalDeductions + deductions,
          totalNet: acc.totalNet + net,
          totalTax: acc.totalTax + tax
      };
  }, { totalGross: 0, totalDeductions: 0, totalNet: 0, totalTax: 0 });

  const handleSendPayslips = () => {
      alert(`Queued sending ${employees.length} payslips via email.`);
  };

  const handleExportDetails = () => {
      const headers = ['Employee ID', 'Name', 'Role', 'Gross Pay', 'Deductions', 'Net Pay'];
      const rows = employees.map(emp => {
          const { gross, deductions, net } = calculatePay(emp);
          return [emp.id, `"${emp.name}"`, emp.role, gross.toFixed(2), deductions.toFixed(2), net.toFixed(2)].join(',');
      });
      
      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payroll_${run.id}_details.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const filteredEmployees = employees.filter(e => 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-50/50 dark:bg-black/20 fade-in">
        
        {/* Header */}
        <div className="bg-white dark:bg-[#18181b] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20 px-8 py-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
                <button onClick={onBack} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-2 transition-colors">
                    <ArrowLeft size={12} /> Back to List
                </button>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-light text-black dark:text-white tracking-tight">{run.period} Payroll</h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wide ${
                        run.status === 'Paid' ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20' : 
                        run.status === 'Processing' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20' : 
                        'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800'
                    }`}>
                        {run.status}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={handleExportDetails} className="px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors">
                    <Download size={14} /> Export Report
                </button>
                {run.status !== 'Paid' && (
                    <button 
                        onClick={() => {
                            if(window.confirm('Are you sure you want to process payment for this run?')) {
                                onUpdateStatus(run.id, 'Paid');
                            }
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <CheckCircle size={14} /> Process Payment
                    </button>
                )}
                <button onClick={handleSendPayslips} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors shadow-lg shadow-black/5 dark:shadow-white/5">
                    <Send size={14} /> Send Payslips
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-[1600px] mx-auto space-y-8">
                
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-[#18181b] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider mb-2">Total Cost (Gross)</p>
                        <div className="flex items-center gap-2">
                            <DollarSign size={24} className="text-gray-300 dark:text-gray-600" />
                            <span className="text-2xl font-light text-black dark:text-white">${metrics.totalGross.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#18181b] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider mb-2">Total Net Pay</p>
                        <div className="flex items-center gap-2">
                            <Building size={24} className="text-emerald-300 dark:text-emerald-600" />
                            <span className="text-2xl font-light text-emerald-600 dark:text-emerald-400">${metrics.totalNet.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#18181b] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider mb-2">Taxes & Deductions</p>
                        <div className="flex items-center gap-2">
                            <PieChart size={24} className="text-orange-300 dark:text-orange-600" />
                            <span className="text-2xl font-light text-orange-600 dark:text-orange-400">${metrics.totalDeductions.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#18181b] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider mb-2">Issues</p>
                        <div className="flex items-center gap-2">
                            <AlertCircle size={24} className="text-gray-200 dark:text-gray-700" />
                            <span className="text-2xl font-light text-gray-400 dark:text-gray-500">0</span>
                        </div>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-white/5">
                        <h3 className="text-sm font-medium text-black dark:text-white">Employee Pay Breakdown</h3>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search employee..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg pl-3 pr-8 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-black/20 dark:focus:border-white/20" 
                            />
                        </div>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-white/5 text-[10px] uppercase text-gray-500 dark:text-gray-400 tracking-wider font-semibold border-b border-gray-100 dark:border-gray-800">
                                <th className="px-6 py-3">Employee</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3 text-right">Gross Pay</th>
                                <th className="px-6 py-3 text-right">Deductions</th>
                                <th className="px-6 py-3 text-right">Net Pay</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {filteredEmployees.map(emp => {
                                const { gross, deductions, net } = calculatePay(emp);

                                return (
                                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={emp.avatarUrl} className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700 object-cover" />
                                                <div>
                                                    <p className="text-sm font-medium text-black dark:text-white">{emp.name}</p>
                                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{emp.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-300">{emp.department}</td>
                                        <td className="px-6 py-4 text-xs text-right font-mono text-gray-600 dark:text-gray-300">${gross.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        <td className="px-6 py-4 text-xs text-right font-mono text-red-500 dark:text-red-400">-${deductions.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        <td className="px-6 py-4 text-xs text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">${net.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border ${
                                                run.status === 'Paid' ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800'
                                            }`}>
                                                {run.status === 'Paid' ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors" title="Email Payslip">
                                                    <Mail size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedEmployee(emp);
                                                        setIsPayslipOpen(true);
                                                    }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 text-xs font-medium text-blue-600 dark:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm"
                                                >
                                                    <FileText size={12} /> View Slip
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

        {selectedEmployee && (
            <PayslipModal 
                isOpen={isPayslipOpen}
                onClose={() => setIsPayslipOpen(false)}
                employee={selectedEmployee}
                run={run}
            />
        )}
    </div>
  );
};

export default PayrollDetails;
