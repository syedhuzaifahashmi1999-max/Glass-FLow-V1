
import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Clock, FileText, User, Calendar, DollarSign, MessageSquare, AlertTriangle, Download, Send } from 'lucide-react';
import { Claim } from '../../types';

interface ClaimDetailDrawerProps {
  claim: Claim | null;
  onClose: () => void;
  onApprove: (id: string, comment?: string) => void;
  onReject: (id: string, reason: string) => void;
  onPay: (id: string) => void;
  currentUserId: string;
}

const ClaimDetailDrawer: React.FC<ClaimDetailDrawerProps> = ({ claim, onClose, onApprove, onReject, onPay, currentUserId }) => {
  const [comment, setComment] = useState('');
  const [rejectMode, setRejectMode] = useState(false);

  if (!claim) return null;

  const isApprover = claim.employeeId !== currentUserId; // Simple logic: if not my claim, I am approver

  const handleAction = (action: 'approve' | 'reject' | 'pay') => {
      if (action === 'approve') {
          onApprove(claim.id, comment);
      } else if (action === 'reject') {
          if (!comment.trim()) {
              alert("Please provide a reason for rejection.");
              return;
          }
          onReject(claim.id, comment);
      } else if (action === 'pay') {
          onPay(claim.id);
      }
      onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white dark:bg-[#18181b] shadow-2xl z-[101] transform transition-transform duration-300 ease-out border-l border-gray-100 dark:border-gray-800 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Claim Details</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{claim.id}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            
            {/* Status & Amount Banner */}
            <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-gray-800 mb-8">
                <div>
                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1 block">Total Amount</span>
                    <span className="text-3xl font-light text-black dark:text-white">${claim.amount.toFixed(2)}</span>
                </div>
                <div className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${
                    claim.status === 'Approved' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30' :
                    claim.status === 'Rejected' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30' :
                    claim.status === 'Paid' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30' :
                    'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30'
                }`}>
                    {claim.status === 'Approved' && <CheckCircle size={14} />}
                    {claim.status === 'Rejected' && <XCircle size={14} />}
                    {claim.status === 'Paid' && <DollarSign size={14} />}
                    {claim.status === 'Submitted' && <Clock size={14} />}
                    {claim.status}
                </div>
            </div>

            {/* Policy Warning */}
            {claim.policyWarning && claim.status === 'Submitted' && (
                <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg flex gap-3 text-red-600 dark:text-red-400">
                    <AlertTriangle size={20} className="shrink-0" />
                    <div>
                        <h4 className="text-sm font-bold">Policy Warning</h4>
                        <p className="text-xs mt-1 opacity-90">{claim.policyWarning}</p>
                    </div>
                </div>
            )}

            {/* Details Grid */}
            <div className="space-y-6 mb-8">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2">Information</h3>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-1">Employee</span>
                        <div className="flex items-center gap-2">
                            <img src={claim.avatarUrl} className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700" />
                            <span className="text-sm font-medium text-black dark:text-white">{claim.employeeName}</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-1">Category</span>
                        <span className="text-sm font-medium text-black dark:text-white">{claim.category}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-1">Date Incurred</span>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-black dark:text-white">
                            <Calendar size={14} className="text-gray-400" /> {claim.date}
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-1">Description</span>
                        <span className="text-sm font-medium text-black dark:text-white">{claim.description}</span>
                    </div>
                </div>

                {claim.notes && (
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-2">Notes</span>
                        <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{claim.notes}"</p>
                    </div>
                )}
            </div>

            {/* Receipt Preview */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Receipt Attachment</h3>
                    {claim.receiptUrl && (
                        <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                            <Download size={12} /> Download
                        </button>
                    )}
                </div>
                
                {claim.receiptUrl ? (
                    <div className="bg-gray-100 dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 h-48 flex items-center justify-center relative overflow-hidden group">
                        <FileText size={48} className="text-gray-300 dark:text-gray-600" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold">Preview File</button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg text-center">
                        <p className="text-xs text-gray-400">No receipt attached.</p>
                    </div>
                )}
            </div>

            {/* History / Audit Log */}
            <div>
                 <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2 mb-4">Audit Trail</h3>
                 <div className="space-y-6 pl-2 border-l border-gray-100 dark:border-gray-800 ml-2">
                     
                     {claim.approvalDate && (
                         <div className="relative pl-6">
                             <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-[#18181b]"></div>
                             <p className="text-xs text-gray-900 dark:text-white font-medium">Approved by Manager</p>
                             <p className="text-[10px] text-gray-400">{claim.approvalDate}</p>
                         </div>
                     )}

                     {claim.rejectionReason && (
                         <div className="relative pl-6">
                             <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-[#18181b]"></div>
                             <p className="text-xs text-gray-900 dark:text-white font-medium">Rejected by Manager</p>
                             <p className="text-[10px] text-red-500 italic">"{claim.rejectionReason}"</p>
                             <p className="text-[10px] text-gray-400">{new Date().toLocaleDateString()}</p>
                         </div>
                     )}

                     {claim.submissionDate && (
                         <div className="relative pl-6">
                             <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-[#18181b]"></div>
                             <p className="text-xs text-gray-900 dark:text-white font-medium">Submitted by {claim.employeeName}</p>
                             <p className="text-[10px] text-gray-400">{claim.submissionDate}</p>
                         </div>
                     )}
                     
                     {/* Initial State */}
                     <div className="relative pl-6">
                         <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-[#18181b]"></div>
                         <p className="text-xs text-gray-900 dark:text-white font-medium">Draft Created</p>
                         <p className="text-[10px] text-gray-400">{claim.date}</p>
                     </div>
                 </div>
            </div>

        </div>

        {/* Footer Actions */}
        {isApprover && claim.status === 'Submitted' && (
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#18181b]">
                {rejectMode ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <textarea 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Reason for rejection..."
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-red-500 mb-3 resize-none h-20"
                        />
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setRejectMode(false)}
                                className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleAction('reject')}
                                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 shadow-lg shadow-red-500/20"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-3">
                         <button 
                            onClick={() => setRejectMode(true)}
                            className="flex-1 py-3 rounded-lg border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center justify-center gap-2"
                         >
                             <XCircle size={16} /> Reject
                         </button>
                         <button 
                            onClick={() => handleAction('approve')}
                            className="flex-[2] py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90 shadow-lg flex items-center justify-center gap-2"
                         >
                             <CheckCircle size={16} /> Approve Claim
                         </button>
                    </div>
                )}
            </div>
        )}

        {/* Finance Actions */}
        {isApprover && claim.status === 'Approved' && (
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#18181b]">
                 <button 
                    onClick={() => handleAction('pay')}
                    className="w-full py-3 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                 >
                     <DollarSign size={16} /> Process Payment
                 </button>
            </div>
        )}

      </div>
    </>
  );
};

export default ClaimDetailDrawer;
