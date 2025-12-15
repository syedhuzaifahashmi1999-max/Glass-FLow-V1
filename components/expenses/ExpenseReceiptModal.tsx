
import React from 'react';
import { X, Download, Printer, FileText, Calendar, User, DollarSign, ZoomIn } from 'lucide-react';
import { Expense } from '../../types';

interface ExpenseReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
}

const ExpenseReceiptModal: React.FC<ExpenseReceiptModalProps> = ({ isOpen, onClose, expense }) => {
  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Receipt Preview (Mock) */}
        <div className="flex-1 bg-gray-100 relative flex flex-col">
            <div className="absolute inset-0 flex items-center justify-center p-8 overflow-auto">
                <div className="bg-white shadow-lg w-full max-w-md min-h-[500px] border border-gray-200 p-8 flex flex-col">
                    {/* Mock Receipt Content */}
                    <div className="text-center mb-8 border-b border-gray-100 pb-6">
                        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest">{expense.payee}</h2>
                        <p className="text-xs text-gray-500 mt-1">Official Receipt</p>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Date</span>
                            <span className="font-mono text-black">{expense.date}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Transaction ID</span>
                            <span className="font-mono text-black">{expense.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Method</span>
                            <span className="text-black">{expense.method}</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="border-b border-black">
                                <tr>
                                    <th className="py-2 font-medium">Description</th>
                                    <th className="py-2 text-right font-medium">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-4 text-gray-600">{expense.description}</td>
                                    <td className="py-4 text-right font-mono">${expense.amount.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t-2 border-black pt-4 mt-auto">
                        <div className="flex justify-between items-end">
                            <span className="text-lg font-bold">TOTAL</span>
                            <span className="text-2xl font-bold">${expense.amount.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <div className="inline-block px-4 py-1 border-2 border-black text-xs font-bold uppercase tracking-widest opacity-30 rotate-12">
                            {expense.status}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Overlay Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/80 backdrop-blur-md p-1.5 rounded-full shadow-xl">
                <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors" title="Zoom In">
                    <ZoomIn size={16} />
                </button>
                <div className="w-px bg-white/20 h-4 self-center mx-1"></div>
                <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors" title="Print">
                    <Printer size={16} />
                </button>
                <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors" title="Download">
                    <Download size={16} />
                </button>
            </div>
        </div>

        {/* Right: Meta Data & Actions */}
        <div className="w-full md:w-80 bg-white border-l border-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-black">Receipt Details</h3>
                <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black transition-colors">
                    <X size={18} />
                </button>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                            <FileText size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-900">receipt_{expense.id}.pdf</p>
                            <p className="text-[10px] text-gray-500">245 KB • PDF Document</p>
                        </div>
                    </div>
                    
                    <div className="h-px bg-gray-100 w-full"></div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider block mb-1">Uploaded By</span>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] text-blue-600 font-bold">
                                    AD
                                </div>
                                <span className="text-sm text-black">Alex Doe</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider block mb-1">Upload Date</span>
                            <div className="flex items-center gap-2 text-sm text-black">
                                <Calendar size={14} className="text-gray-400" />
                                {new Date().toLocaleDateString()}
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider block mb-1">Category</span>
                            <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                                {expense.category}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                    <p className="text-[10px] text-yellow-700 leading-relaxed">
                        <strong>Note:</strong> This receipt has been automatically verified against the transaction amount.
                    </p>
                </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
                <button 
                    onClick={onClose}
                    className="w-full py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-black hover:border-black transition-all shadow-sm"
                >
                    Close Viewer
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ExpenseReceiptModal;
