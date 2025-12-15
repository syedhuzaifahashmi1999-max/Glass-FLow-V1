
import React, { useState } from 'react';
import { 
  X, CheckCircle, XCircle, Clock, Printer, Download, User, Calendar, 
  FileText, MessageSquare, Trash2, AlertTriangle, Building2, Send 
} from 'lucide-react';
import { HRLetter } from '../../types';

interface LetterDetailDrawerProps {
  letter: HRLetter | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onDelete: (id: string) => void;
  onPrint: (letter: HRLetter) => void;
  currentUserId: string; // To determine permissions (Requester vs Admin)
}

const LetterDetailDrawer: React.FC<LetterDetailDrawerProps> = ({ 
  letter, onClose, onApprove, onReject, onDelete, onPrint, currentUserId 
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  if (!letter) return null;

  const isRequester = letter.employeeId === currentUserId;
  const isAdmin = !isRequester; // Simplified role logic for demo

  const handleRejectSubmit = () => {
    if (rejectReason.trim()) {
      onReject(letter.id, rejectReason);
      setIsRejecting(false);
      setRejectReason('');
      onClose();
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white dark:bg-[#18181b] shadow-2xl z-[101] transform transition-transform duration-300 ease-out border-l border-gray-100 dark:border-gray-800 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Request Details</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{letter.id}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            
            {/* Status Banner */}
            <div className={`p-6 rounded-xl border mb-8 flex items-start gap-4 ${
                letter.status === 'Approved' ? 'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20' :
                letter.status === 'Rejected' ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20' :
                'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20'
            }`}>
                <div className={`p-2 rounded-full shrink-0 ${
                    letter.status === 'Approved' ? 'bg-green-100 dark:bg-green-500/20 text-green-600' :
                    letter.status === 'Rejected' ? 'bg-red-100 dark:bg-red-500/20 text-red-600' :
                    'bg-orange-100 dark:bg-orange-500/20 text-orange-600'
                }`}>
                    {letter.status === 'Approved' && <CheckCircle size={24} />}
                    {letter.status === 'Rejected' && <XCircle size={24} />}
                    {letter.status === 'Pending' && <Clock size={24} />}
                </div>
                <div>
                    <h3 className={`text-sm font-bold uppercase tracking-wide mb-1 ${
                        letter.status === 'Approved' ? 'text-green-800 dark:text-green-400' :
                        letter.status === 'Rejected' ? 'text-red-800 dark:text-red-400' :
                        'text-orange-800 dark:text-orange-400'
                    }`}>
                        {letter.status}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {letter.status === 'Approved' ? `This letter was issued on ${letter.dateIssued}. You can download or print it below.` :
                         letter.status === 'Rejected' ? `This request was rejected. Reason: ${letter.rejectionReason}` :
                         "This request is currently under review by the HR department."}
                    </p>
                </div>
            </div>

            {/* Request Info */}
            <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2">Information</h3>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div className="col-span-2">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-1">Employee</span>
                        <div className="flex items-center gap-3">
                            <img src={letter.avatarUrl} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700" />
                            <div>
                                <p className="text-sm font-bold text-black dark:text-white">{letter.employeeName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">ID: {letter.employeeId}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-1">Letter Type</span>
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-gray-500" />
                            <span className="text-sm font-medium text-black dark:text-white">{letter.type}</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-1">Date Requested</span>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-500" />
                            <span className="text-sm font-medium text-black dark:text-white">{letter.dateRequested}</span>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-1">Addressee</span>
                        <div className="flex items-center gap-2">
                            <Building2 size={16} className="text-gray-500" />
                            <span className="text-sm font-medium text-black dark:text-white">{letter.addressee || 'To Whom It May Concern'}</span>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-1">Purpose</span>
                        <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{letter.purpose}"</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Audit Trail (Simplified) */}
            <div className="mt-8">
                 <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2 mb-4">Timeline</h3>
                 <div className="space-y-6 pl-2 border-l border-gray-100 dark:border-gray-800 ml-2">
                     {letter.dateIssued && (
                         <div className="relative pl-6">
                             <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-[#18181b]"></div>
                             <p className="text-xs text-gray-900 dark:text-white font-medium">Letter Issued</p>
                             <p className="text-[10px] text-gray-400">{letter.dateIssued}</p>
                         </div>
                     )}
                     {letter.rejectionReason && (
                         <div className="relative pl-6">
                             <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-[#18181b]"></div>
                             <p className="text-xs text-gray-900 dark:text-white font-medium">Request Rejected</p>
                             <p className="text-[10px] text-gray-400">By Admin</p>
                         </div>
                     )}
                     <div className="relative pl-6">
                         <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-[#18181b]"></div>
                         <p className="text-xs text-gray-900 dark:text-white font-medium">Request Submitted</p>
                         <p className="text-[10px] text-gray-400">{letter.dateRequested}</p>
                     </div>
                 </div>
            </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#18181b]">
            
            {/* Case 1: Pending & Admin View -> Approve/Reject */}
            {letter.status === 'Pending' && isAdmin && (
                isRejecting ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <textarea 
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection..."
                            className="w-full bg-gray-50 dark:bg-white/5 border border-red-200 dark:border-red-900/30 rounded-lg p-3 text-sm focus:outline-none focus:border-red-500 resize-none h-20"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsRejecting(false)}
                                className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleRejectSubmit}
                                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 shadow-lg"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-3">
                         <button 
                            onClick={() => setIsRejecting(true)}
                            className="flex-1 py-3 rounded-lg border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center justify-center gap-2"
                         >
                             <XCircle size={16} /> Reject
                         </button>
                         <button 
                            onClick={() => { onApprove(letter.id); onClose(); }}
                            className="flex-[2] py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90 shadow-lg flex items-center justify-center gap-2"
                         >
                             <CheckCircle size={16} /> Approve & Issue
                         </button>
                    </div>
                )
            )}

            {/* Case 2: Pending & Requester View -> Delete */}
            {letter.status === 'Pending' && isRequester && (
                <button 
                    onClick={() => { onDelete(letter.id); onClose(); }}
                    className="w-full py-3 rounded-lg border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center justify-center gap-2"
                >
                    <Trash2 size={16} /> Cancel Request
                </button>
            )}

            {/* Case 3: Approved -> Print/Download */}
            {letter.status === 'Approved' && (
                <button 
                   onClick={() => onPrint(letter)}
                   className="w-full py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90 shadow-lg flex items-center justify-center gap-2"
                >
                    <Printer size={16} /> Print / Download PDF
                </button>
            )}

             {/* Case 4: Rejected -> Delete (Cleanup) */}
             {letter.status === 'Rejected' && (
                <button 
                    onClick={() => { onDelete(letter.id); onClose(); }}
                    className="w-full py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center gap-2"
                >
                    <Trash2 size={16} /> Delete Record
                </button>
            )}

        </div>

      </div>
    </>
  );
};

export default LetterDetailDrawer;
