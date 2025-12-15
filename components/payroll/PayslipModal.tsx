
import React from 'react';
import { X, Printer, Download, Building2, CreditCard } from 'lucide-react';
import { Employee, PayrollRun } from '../../types';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  run: PayrollRun;
}

const PayslipModal: React.FC<PayslipModalProps> = ({ isOpen, onClose, employee, run }) => {
  if (!isOpen) return null;

  // --- Financial Calculation Logic ---
  // Ensure this matches the logic in PayrollDetails.tsx for consistency
  const annualSalary = parseFloat(employee.salary?.replace(/[^0-9.]/g, '') || '0');
  const grossPay = annualSalary / 12;

  // Earnings Breakdown
  const basic = grossPay * 0.50;
  const hra = grossPay * 0.30;
  const specialAllowance = grossPay * 0.20;

  // Deductions Breakdown
  const incomeTax = grossPay * 0.15; // 15% Tax
  const providentFund = basic * 0.12; // 12% of Basic
  const professionalTax = 200; // Flat
  const healthInsurance = 150; // Flat

  const totalDeductions = incomeTax + providentFund + professionalTax + healthInsurance;
  const netPay = grossPay - totalDeductions;

  // Helper for currency
  const formatCurrency = (amount: number) => {
      return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl h-[85vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Actions Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shrink-0">
            <div className="flex flex-col">
                <h3 className="text-sm font-semibold">Salary Slip Preview</h3>
                <span className="text-[10px] text-gray-400">{employee.name} • {run.period}</span>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={() => window.print()}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white flex items-center gap-2 text-xs" 
                    title="Print"
                >
                    <Printer size={16} /> <span className="hidden sm:inline">Print</span>
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white flex items-center gap-2 text-xs" title="Download PDF">
                    <Download size={16} /> <span className="hidden sm:inline">Download</span>
                </button>
                <div className="h-6 w-px bg-white/20 mx-1"></div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white">
                    <X size={18} />
                </button>
            </div>
        </div>

        {/* Paper Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gray-100/80 flex justify-center">
            <div 
                id="payslip-print-area"
                className="bg-white shadow-lg border border-gray-200 p-12 w-full max-w-[700px] min-h-[800px] flex flex-col relative print:shadow-none print:border-none print:w-full print:absolute print:top-0 print:left-0"
            >
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
                    <Building2 size={400} />
                </div>

                {/* Company Header */}
                <div className="flex justify-between items-start mb-12 border-b border-gray-100 pb-8">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-lg">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">GlassFlow Inc.</h1>
                            <div className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                                42 Innovation Drive, Tech Park<br/>
                                San Francisco, CA 94107<br/>
                                Tax ID: GF-8829-XJ2
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-light text-gray-900 uppercase tracking-widest mb-1">Payslip</h2>
                        <p className="text-sm font-medium text-gray-600">{run.period}</p>
                    </div>
                </div>

                {/* Employee Details Grid */}
                <div className="bg-gray-50 rounded-lg p-6 mb-10 border border-gray-100">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                        <div>
                            <span className="text-[9px] uppercase text-gray-400 font-bold tracking-wider block mb-1">Employee Name</span>
                            <span className="text-sm font-semibold text-gray-900">{employee.name}</span>
                        </div>
                        <div>
                            <span className="text-[9px] uppercase text-gray-400 font-bold tracking-wider block mb-1">Designation</span>
                            <span className="text-sm font-medium text-gray-900">{employee.role}</span>
                        </div>
                        <div>
                            <span className="text-[9px] uppercase text-gray-400 font-bold tracking-wider block mb-1">Employee ID</span>
                            <span className="text-sm font-mono text-gray-900">{employee.id}</span>
                        </div>
                        <div>
                            <span className="text-[9px] uppercase text-gray-400 font-bold tracking-wider block mb-1">Department</span>
                            <span className="text-sm font-medium text-gray-900">{employee.department}</span>
                        </div>
                        <div>
                            <span className="text-[9px] uppercase text-gray-400 font-bold tracking-wider block mb-1">Bank Account</span>
                            <span className="text-sm font-mono text-gray-900 flex items-center gap-2">
                                <CreditCard size={12} className="text-gray-400" />
                                {employee.accountNumber || '**** **** **** 4291'}
                            </span>
                        </div>
                        <div>
                            <span className="text-[9px] uppercase text-gray-400 font-bold tracking-wider block mb-1">Pay Date</span>
                            <span className="text-sm font-medium text-gray-900">{run.date}</span>
                        </div>
                    </div>
                </div>

                {/* Financials Table */}
                <div className="mb-10">
                    <div className="grid grid-cols-2 gap-8">
                        
                        {/* Earnings */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-900 uppercase border-b border-gray-200 pb-2 mb-3">Earnings</h4>
                            <table className="w-full text-xs">
                                <tbody>
                                    <tr className="border-b border-dashed border-gray-100">
                                        <td className="py-2 text-gray-600">Basic Salary</td>
                                        <td className="py-2 text-right font-medium text-gray-900">{formatCurrency(basic)}</td>
                                    </tr>
                                    <tr className="border-b border-dashed border-gray-100">
                                        <td className="py-2 text-gray-600">House Rent Allowance</td>
                                        <td className="py-2 text-right font-medium text-gray-900">{formatCurrency(hra)}</td>
                                    </tr>
                                    <tr className="border-b border-dashed border-gray-100">
                                        <td className="py-2 text-gray-600">Special Allowance</td>
                                        <td className="py-2 text-right font-medium text-gray-900">{formatCurrency(specialAllowance)}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="py-3 font-semibold text-gray-900">Gross Earnings</td>
                                        <td className="py-3 text-right font-bold text-gray-900">{formatCurrency(grossPay)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Deductions */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-900 uppercase border-b border-gray-200 pb-2 mb-3">Deductions</h4>
                            <table className="w-full text-xs">
                                <tbody>
                                    <tr className="border-b border-dashed border-gray-100">
                                        <td className="py-2 text-gray-600">Income Tax</td>
                                        <td className="py-2 text-right font-medium text-red-600">-{formatCurrency(incomeTax)}</td>
                                    </tr>
                                    <tr className="border-b border-dashed border-gray-100">
                                        <td className="py-2 text-gray-600">Provident Fund</td>
                                        <td className="py-2 text-right font-medium text-red-600">-{formatCurrency(providentFund)}</td>
                                    </tr>
                                    <tr className="border-b border-dashed border-gray-100">
                                        <td className="py-2 text-gray-600">Professional Tax</td>
                                        <td className="py-2 text-right font-medium text-red-600">-{formatCurrency(professionalTax)}</td>
                                    </tr>
                                    <tr className="border-b border-dashed border-gray-100">
                                        <td className="py-2 text-gray-600">Health Insurance</td>
                                        <td className="py-2 text-right font-medium text-red-600">-{formatCurrency(healthInsurance)}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="py-3 font-semibold text-gray-900">Total Deductions</td>
                                        <td className="py-3 text-right font-bold text-red-600">-{formatCurrency(totalDeductions)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Net Pay Highlight */}
                <div className="bg-black text-white rounded-xl p-6 flex justify-between items-center mb-12 shadow-lg">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Net Pay</p>
                        <p className="text-[10px] text-gray-500">Transferred to {employee.bankName || 'Bank'} ({employee.accountNumber?.slice(-4) || '4291'})</p>
                    </div>
                    <div className="text-3xl font-light tracking-tight">
                        {formatCurrency(netPay)}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-8 border-t border-gray-100 flex justify-between items-end text-[10px] text-gray-400">
                    <div>
                        <p>Generated on {new Date().toLocaleDateString()}</p>
                        <p>This is a computer-generated document.</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-900 uppercase">GlassFlow Inc.</p>
                        <p>Authorized Signatory</p>
                    </div>
                </div>

            </div>
        </div>
        
        {/* CSS for print mode */}
        <style>{`
            @media print {
                body * {
                    visibility: hidden;
                }
                #payslip-print-area, #payslip-print-area * {
                    visibility: visible;
                }
                #payslip-print-area {
                    position: fixed;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 40px;
                    border: none;
                    box-shadow: none;
                    z-index: 9999;
                    background: white !important;
                }
            }
        `}</style>
      </div>
    </div>
  );
};

export default PayslipModal;
