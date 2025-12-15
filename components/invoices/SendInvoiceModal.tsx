
import React, { useState, useEffect } from 'react';
import { X, Send, Mail, Paperclip, CheckCircle, FileText } from 'lucide-react';
import { Invoice } from '../../types';

interface SendInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  onSend: (emailDetails: any) => void;
}

const SendInvoiceModal: React.FC<SendInvoiceModalProps> = ({ isOpen, onClose, invoice, onSend }) => {
  const [to, setTo] = useState('billing@client.com');
  const [subject, setSubject] = useState(`Invoice #${invoice.id} from GlassFlow`);
  const [message, setMessage] = useState(`Hi there,

Please find attached invoice #${invoice.id} for ${invoice.relatedProduct || 'recent services'}.

Amount Due: $${invoice.amount.toLocaleString()}
Due Date: ${invoice.dueDate}

Thank you for your business.

Best regards,
The GlassFlow Team`);
  
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsSent(false);
      setIsSending(false);
      // Reset logic if needed
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const handleSend = () => {
    setIsSending(true);
    // Simulate network request
    setTimeout(() => {
        setIsSending(false);
        setIsSent(true);
        setTimeout(() => {
            onSend({ to, subject });
            onClose();
        }, 1000);
    }, 1500);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
       <div className={`
            relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col 
            transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         
         {/* Success Overlay */}
         {isSent && (
             <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                     <CheckCircle size={32} />
                 </div>
                 <h3 className="text-lg font-medium text-black">Invoice Sent!</h3>
                 <p className="text-gray-500 text-sm mt-1">The email is on its way.</p>
             </div>
         )}

         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
           <div className="flex items-center gap-2">
             <div className="p-1.5 bg-blue-100 text-blue-600 rounded">
                <Mail size={16} />
             </div>
             <h2 className="text-base font-semibold text-black">Send Invoice</h2>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="p-6 space-y-4">
             
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">To</label>
                <input 
                    type="email"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-black"
                />
             </div>

             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Subject</label>
                <input 
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-black"
                />
             </div>

             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Message</label>
                <textarea 
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-black resize-none"
                />
             </div>

             {/* Attachment Preview */}
             <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                 <div className="w-8 h-10 bg-red-100 rounded border border-red-200 flex items-center justify-center text-red-500">
                     <FileText size={16} />
                 </div>
                 <div className="flex-1">
                     <p className="text-xs font-medium text-black">Invoice_{invoice.id}.pdf</p>
                     <p className="text-[10px] text-gray-500">PDF Document • 45 KB</p>
                 </div>
                 <div className="text-green-600">
                     <CheckCircle size={16} />
                 </div>
             </div>

             <div className="pt-2 flex gap-3">
               <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 transition-all text-xs font-medium uppercase tracking-wide">
                   Cancel
               </button>
               <button 
                 onClick={handleSend}
                 disabled={isSending}
                 className="flex-[2] px-4 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium uppercase tracking-wide shadow-lg shadow-black/5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
               >
                   {isSending ? 'Sending...' : <><Send size={14} /> Send Email</>}
               </button>
             </div>

         </div>
       </div>
    </div>
  );
};

export default SendInvoiceModal;
