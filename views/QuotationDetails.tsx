
import React from 'react';
import { ArrowLeft, Printer, Send, CheckCircle, XCircle, Building2, Download, Receipt } from 'lucide-react';
import { Quotation } from '../types';

interface QuotationDetailsProps {
  quotation: Quotation;
  onBack: () => void;
  onUpdateStatus: (id: string, status: Quotation['status']) => void;
  onConvertToInvoice: (quotation: Quotation) => void;
}

const QuotationDetails: React.FC<QuotationDetailsProps> = ({ quotation, onBack, onUpdateStatus, onConvertToInvoice }) => {
  
  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: Quotation['status']) => {
    switch(status) {
        case 'Accepted': return 'bg-green-100 text-green-800 border-green-200';
        case 'Sent': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/50 relative overflow-hidden">
        {/* Action Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-4 flex justify-between items-center print:hidden">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-medium text-black">Quotation {quotation.id}</h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusColor(quotation.status)}`}>
                            {quotation.status}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500">Prepared for {quotation.customerName}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-colors text-xs font-medium">
                    <Printer size={14} /> Print
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                
                {quotation.status === 'Draft' && (
                    <button 
                        onClick={() => onUpdateStatus(quotation.id, 'Sent')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-xs font-medium shadow-sm"
                    >
                        <Send size={14} /> Mark as Sent
                    </button>
                )}

                {quotation.status === 'Sent' && (
                    <>
                        <button 
                            onClick={() => onUpdateStatus(quotation.id, 'Rejected')}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-xs font-medium"
                        >
                            <XCircle size={14} /> Reject
                        </button>
                        <button 
                            onClick={() => onUpdateStatus(quotation.id, 'Accepted')}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-xs font-medium shadow-sm"
                        >
                            <CheckCircle size={14} /> Accept
                        </button>
                    </>
                )}

                {quotation.status === 'Accepted' && (
                    <button 
                        onClick={() => onConvertToInvoice(quotation)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors text-xs font-medium shadow-sm"
                    >
                        <Receipt size={14} /> Convert to Invoice
                    </button>
                )}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex justify-center bg-gray-100/50">
            
            {/* The Paper */}
            <div 
                id="quotation-paper"
                className="bg-white w-[800px] min-h-[1000px] shadow-sm border border-gray-200 p-12 print:shadow-none print:border-none print:w-full print:p-0"
            >
                
                {/* Header Section */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded">
                                <Building2 size={18} />
                            </div>
                            <span className="text-xl font-bold tracking-tight">GlassFlow Inc.</span>
                        </div>
                        <div className="text-xs text-gray-500 leading-relaxed">
                            <p>123 Innovation Drive, Suite 400</p>
                            <p>San Francisco, CA 94107</p>
                            <p>United States</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-light text-gray-900 mb-2">QUOTATION</h2>
                        <p className="text-sm font-mono text-gray-500 mb-6">#{quotation.id}</p>
                        <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex justify-end gap-4">
                                <span className="text-gray-400">Date Issued:</span>
                                <span className="font-medium">{quotation.issueDate}</span>
                            </div>
                            <div className="flex justify-end gap-4">
                                <span className="text-gray-400">Valid Until:</span>
                                <span className="font-medium">{quotation.expiryDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100 w-full mb-12"></div>

                {/* Prepared For */}
                <div className="mb-12">
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold block mb-3">Prepared For</span>
                    <h3 className="text-lg font-medium text-black mb-1">{quotation.customerName}</h3>
                    <p className="text-xs text-gray-500">Client ID: {quotation.customerId}</p>
                </div>

                {/* Line Items */}
                <div className="mb-12">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="py-3 text-xs uppercase tracking-wider font-bold text-gray-900 w-1/2">Description</th>
                                <th className="py-3 text-xs uppercase tracking-wider font-bold text-gray-900 text-center">Qty</th>
                                <th className="py-3 text-xs uppercase tracking-wider font-bold text-gray-900 text-right">Unit Price</th>
                                <th className="py-3 text-xs uppercase tracking-wider font-bold text-gray-900 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {quotation.items && quotation.items.length > 0 ? quotation.items.map((item, i) => (
                                <tr key={i} className="border-b border-gray-100">
                                    <td className="py-4 text-gray-900 font-medium">{item.description}</td>
                                    <td className="py-4 text-gray-600 text-center">{item.quantity}</td>
                                    <td className="py-4 text-gray-600 text-right">${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    <td className="py-4 text-gray-900 font-mono text-right">${(item.quantity * item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-400 italic text-sm">No items listed.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-mono text-gray-900">${(quotation.subtotal || quotation.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tax (10%)</span>
                            <span className="font-mono text-gray-900">${(quotation.tax || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                        <div className="h-px bg-gray-200 my-2"></div>
                        <div className="flex justify-between text-lg font-bold">
                            <span className="text-gray-900">Total</span>
                            <span className="font-mono text-black">${quotation.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                    </div>
                </div>

                {/* Footer / Notes */}
                {quotation.notes && (
                    <div className="mb-12 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold block mb-2">Notes</span>
                        <p className="text-xs text-gray-600 leading-relaxed">{quotation.notes}</p>
                    </div>
                )}

                <div className="text-center pt-12 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-1">This is an estimate</p>
                    <p className="text-[10px] text-gray-400">Pricing is subject to change. Valid until {quotation.expiryDate}.</p>
                </div>

            </div>
        </div>

        <style>{`
            @media print {
                /* Set proper page margins */
                @page { margin: 20mm; }
                
                /* Reset body/html sizing to allow full print */
                body, html {
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    overflow: visible !important;
                }

                /* Hide everything by default */
                body * {
                    visibility: hidden;
                }

                /* Specifically show the invoice paper and its children */
                #quotation-paper, #quotation-paper * {
                    visibility: visible;
                }

                /* Position the invoice paper correctly */
                #quotation-paper {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    border: none;
                    box-shadow: none;
                    background: white;
                }

                /* Ensure unwanted UI elements are strictly display:none */
                nav, aside, header, .print\\:hidden, button { 
                    display: none !important; 
                }
            }
        `}</style>
    </div>
  );
};

export default QuotationDetails;
