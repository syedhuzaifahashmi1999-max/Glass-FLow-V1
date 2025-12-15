
import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, CreditCard, FileText, Check } from 'lucide-react';
import { Invoice } from '../../types';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  onConfirm: (paymentDetails: any) => void;
}

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ isOpen, onClose, invoice, onConfirm }) => {
  const [amount, setAmount] = useState(invoice.amount.toString());
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState('Wire Transfer');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setAmount(invoice.amount.toString());
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, invoice]);

  if (!isVisible && !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      amount: parseFloat(amount),
      date,
      method,
      reference,
      notes
    });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
       <div className={`
            relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col 
            transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
           <div>
             <h2 className="text-base font-semibold text-black">Record Payment</h2>
             <p className="text-xs text-gray-500">Invoice #{invoice.id}</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <form onSubmit={handleSubmit} className="p-6 space-y-5">
             
             {/* Amount */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Payment Amount</label>
                <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="number"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-lg font-mono font-medium text-black focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                    />
                </div>
             </div>

             {/* Date & Method */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Date</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black" 
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Method</label>
                     <div className="relative">
                         <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <select 
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black appearance-none"
                         >
                            <option>Wire Transfer</option>
                            <option>Credit Card</option>
                            <option>Check</option>
                            <option>Cash</option>
                            <option>Stripe / Online</option>
                         </select>
                     </div>
                 </div>
             </div>

             {/* Reference */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Reference / Check #</label>
                <div className="relative">
                    <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="e.g. #9938202"
                        className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-black"
                    />
                </div>
             </div>

             {/* Notes */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Internal Notes</label>
                <textarea 
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any details about this payment..."
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-black resize-none"
                />
             </div>

             <div className="pt-4 flex gap-3">
               <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 transition-all text-xs font-medium uppercase tracking-wide">
                   Cancel
               </button>
               <button type="submit" className="flex-[2] px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-xs font-medium uppercase tracking-wide shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                   <Check size={14} /> Confirm Payment
               </button>
             </div>

         </form>
       </div>
    </div>
  );
};

export default RecordPaymentModal;
