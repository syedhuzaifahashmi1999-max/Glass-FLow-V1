
import React, { useState } from 'react';
import { ArrowLeft, Printer, Send, CreditCard, Download, Edit, Building2, CheckCircle, Clock, AlertCircle, Ban, History } from 'lucide-react';
import { Invoice } from '../types';
import RecordPaymentModal from '../components/invoices/RecordPaymentModal';
import SendInvoiceModal from '../components/invoices/SendInvoiceModal';

interface InvoiceDetailsProps {
  invoice: Invoice;
  onBack: () => void;
  onUpdateStatus: (id: string, status: Invoice['status']) => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onBack, onUpdateStatus }) => {
  // Modals State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  
  // Local State for "Downloading" effect
  const [isDownloading, setIsDownloading] = useState(false);

  // Dynamic Activity History
  const [history, setHistory] = useState([
      { type: 'created', label: 'Invoice Created', date: invoice.issueDate, user: 'System' },
      { type: 'viewed', label: 'Viewed by Client', date: 'Oct 14, 2024', user: 'External' },
  ]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
      setIsDownloading(true);
      // Simulate API delay
      setTimeout(() => {
          setIsDownloading(false);
          // In a real app, this would trigger a file download from a Blob
          alert("Invoice downloaded successfully (simulation).");
      }, 1500);
  };

  const handleVoidInvoice = () => {
      if (confirm('Are you sure you want to VOID this invoice? This action cannot be undone.')) {
          // In a real app, this would update a 'void' status. 
          // For this demo, we'll just log it and maybe set to a special status if the type supported it, 
          // or just visually strike it out.
          setHistory(prev => [{ type: 'voided', label: 'Invoice Voided', date: new Date().toLocaleDateString(), user: 'You' }, ...prev]);
          alert("Invoice marked as Void.");
      }
  };

  const handlePaymentConfirmed = (details: any) => {
      onUpdateStatus(invoice.id, 'Paid');
      setHistory(prev => [{ 
          type: 'paid', 
          label: `Payment of $${details.amount} Recorded`, 
          date: details.date, 
          user: 'You' 
      }, ...prev]);
  };

  const handleEmailSent = (details: any) => {
      setHistory(prev => [{
          type: 'sent',
          label: `Sent to ${details.to}`,
          date: new Date().toLocaleDateString(),
          user: 'You'
      }, ...prev]);
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch(status) {
        case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
        case 'Pending': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
    <div className="h-full flex flex-col bg-gray-50/50 relative overflow-hidden">
        
        {/* Action Bar (Hidden when printing) */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-4 flex justify-between items-center print:hidden shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-medium text-black">Invoice {invoice.id}</h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500">Issued to {invoice.customerName}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex bg-gray-50 rounded-lg border border-gray-200 p-1">
                    <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-gray-600 hover:text-black hover:bg-white hover:shadow-sm transition-all text-xs font-medium">
                        <Printer size={14} /> Print
                    </button>
                    <button 
                        onClick={handleDownloadPDF} 
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-gray-600 hover:text-black hover:bg-white hover:shadow-sm transition-all text-xs font-medium disabled:opacity-50"
                    >
                        {isDownloading ? (
                            <span className="animate-spin w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full"></span>
                        ) : (
                            <Download size={14} /> 
                        )}
                        PDF
                    </button>
                </div>
                
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                
                {invoice.status !== 'Paid' && (
                    <>
                        <button 
                            onClick={handleVoidInvoice}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors text-xs font-medium"
                            title="Void Invoice"
                        >
                            <Ban size={16} />
                        </button>
                        <button 
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-xs font-medium shadow-sm"
                        >
                            <CreditCard size={14} /> Record Payment
                        </button>
                    </>
                )}
                
                <button 
                    onClick={() => setIsSendModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors text-xs font-medium shadow-sm"
                >
                    <Send size={14} /> Send Invoice
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex justify-center bg-gray-100/50 relative">
            
            {/* The Invoice Paper */}
            <div 
                id="invoice-paper"
                className="bg-white w-[800px] min-h-[1100px] shadow-sm border border-gray-200 p-12 print:shadow-none print:border-none print:w-full print:p-0 print:absolute print:top-0 print:left-0"
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
                            <p>support@glassflow.com</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-light text-gray-900 mb-2">INVOICE</h2>
                        <p className="text-sm font-mono text-gray-500 mb-6">#{invoice.id}</p>
                        <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex justify-end gap-4">
                                <span className="text-gray-400">Date Issued:</span>
                                <span className="font-medium">{invoice.issueDate}</span>
                            </div>
                            <div className="flex justify-end gap-4">
                                <span className="text-gray-400">Date Due:</span>
                                <span className="font-medium">{invoice.dueDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100 w-full mb-12"></div>

                {/* Bill To */}
                <div className="mb-12">
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold block mb-3">Bill To</span>
                    <h3 className="text-lg font-medium text-black mb-1">{invoice.customerName}</h3>
                    <p className="text-xs text-gray-500">Client ID: {invoice.customerId}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        742 Evergreen Terrace<br/>
                        Springfield, OR 97477
                    </p>
                </div>

                {/* Line Items */}
                <div className="mb-12 min-h-[200px]">
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
                            {invoice.items && invoice.items.length > 0 ? invoice.items.map((item, i) => (
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
                            <span className="font-mono text-gray-900">${(invoice.subtotal || invoice.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tax (10%)</span>
                            <span className="font-mono text-gray-900">${(invoice.tax || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                        <div className="h-px bg-gray-200 my-2"></div>
                        <div className="flex justify-between text-lg font-bold">
                            <span className="text-gray-900">Total</span>
                            <span className="font-mono text-black">${invoice.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                        {/* Amount Due / Paid Badge on Paper */}
                        <div className="flex justify-end mt-4">
                            <div className={`px-3 py-1 rounded border text-xs font-bold uppercase tracking-wider ${
                                invoice.status === 'Paid' ? 'border-green-200 text-green-700 bg-green-50' : 'border-black text-black bg-gray-50'
                            }`}>
                                {invoice.status === 'Paid' ? 'Paid in Full' : 'Amount Due'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                    <div className="mb-12 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold block mb-2">Notes</span>
                        <p className="text-xs text-gray-600 leading-relaxed">{invoice.notes}</p>
                    </div>
                )}

                {/* Remittance Slip (Tear-off) */}
                <div className="mt-auto pt-12">
                    <div className="border-t-2 border-dashed border-gray-300 relative">
                        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <div className="w-3 h-3 border border-gray-300 rounded-full flex items-center justify-center">✂</div> Detach and return with payment
                        </div>
                    </div>
                    <div className="pt-8 flex justify-between items-center">
                        <div>
                            <h4 className="text-sm font-bold text-gray-900">Remittance Advice</h4>
                            <p className="text-xs text-gray-500 mt-1">Please include invoice number on your check.</p>
                        </div>
                        <div className="text-right text-xs space-y-1">
                            <p><span className="text-gray-400 w-20 inline-block">Invoice No:</span> <span className="font-mono font-medium">{invoice.id}</span></p>
                            <p><span className="text-gray-400 w-20 inline-block">Amount Due:</span> <span className="font-mono font-medium">${invoice.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Sidebar (Right) - History */}
            <div className="w-80 ml-8 hidden xl:block print:hidden">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
                    <div className="flex items-center gap-2 mb-6">
                        <History size={16} className="text-gray-400" />
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Activity History</h3>
                    </div>
                    <div className="relative pl-4 space-y-8 border-l border-gray-100">
                        {history.map((event, idx) => (
                            <div key={idx} className="relative animate-in slide-in-from-left-2 duration-300">
                                <div className={`absolute -left-[21px] top-0 p-1 bg-white rounded-full border ${event.type === 'paid' ? 'border-green-200' : 'border-gray-200'}`}>
                                    {event.type === 'paid' ? <CheckCircle size={12} className="text-emerald-600" /> : 
                                     event.type === 'sent' ? <Send size={12} className="text-blue-500" /> :
                                     <Clock size={12} className="text-gray-400" />}
                                </div>
                                <p className="text-xs text-gray-900 font-medium">{event.label}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{event.date} • {event.user}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>

        {/* Modals */}
        <RecordPaymentModal 
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            invoice={invoice}
            onConfirm={handlePaymentConfirmed}
        />

        <SendInvoiceModal
            isOpen={isSendModalOpen}
            onClose={() => setIsSendModalOpen(false)}
            invoice={invoice}
            onSend={handleEmailSent}
        />

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
                #invoice-paper, #invoice-paper * {
                    visibility: visible;
                }

                /* Position the invoice paper correctly */
                #invoice-paper {
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
    </>
  );
};

export default InvoiceDetails;
