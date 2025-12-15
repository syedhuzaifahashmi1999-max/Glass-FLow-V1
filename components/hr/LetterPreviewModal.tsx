
import React from 'react';
import { X, Printer, Download, Building2 } from 'lucide-react';
import { HRLetter } from '../../types';

interface LetterPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  letter: HRLetter | null;
}

const LetterPreviewModal: React.FC<LetterPreviewModalProps> = ({ isOpen, onClose, letter }) => {
  if (!isOpen || !letter) return null;

  const handlePrint = () => {
    window.print();
  };

  const getLetterContent = () => {
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      let body = '';
      
      switch(letter.type) {
          case 'Employment Verification':
              body = `This is to certify that ${letter.employeeName} is currently employed with GlassFlow Inc. since 2022. They hold the position of Senior Product Designer. This letter is issued upon the request of the employee for ${letter.purpose}.`;
              break;
          case 'Salary Certificate':
              body = `This is to certify that ${letter.employeeName} is a full-time employee at GlassFlow Inc. drawing an annual gross salary of $125,000. This certificate is issued for the purpose of ${letter.purpose} and does not constitute a guarantee of future employment or financial liability on behalf of the company.`;
              break;
          case 'NOC':
              body = `GlassFlow Inc. has no objection to ${letter.employeeName} undertaking ${letter.purpose} provided it does not conflict with their official duties and working hours at our organization.`;
              break;
          default:
              body = `This letter confirms the details regarding ${letter.employeeName} as requested for the purpose of ${letter.purpose}.`;
      }

      return (
          <div className="space-y-6 text-sm text-gray-800 leading-relaxed font-serif">
              <p>{today}</p>
              <br />
              <p className="font-bold">{letter.addressee || 'To Whom It May Concern'},</p>
              <br />
              <p>{body}</p>
              <p>Please feel free to contact our HR department at hr@glassflow.com should you require any further information.</p>
              <br />
              <br />
              <p>Sincerely,</p>
              <div className="h-16 relative">
                  {/* Signature Placeholder */}
                  <div className="absolute bottom-2 font-cursive text-2xl text-blue-900">Sarah Jenkins</div>
              </div>
              <p className="font-bold">Sarah Jenkins</p>
              <p>Head of People Operations</p>
              <p>GlassFlow Inc.</p>
          </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Actions Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shrink-0 print:hidden">
            <div className="flex flex-col">
                <h3 className="text-sm font-semibold">Document Preview</h3>
                <span className="text-[10px] text-gray-400">{letter.type} • {letter.id}</span>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={handlePrint}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white flex items-center gap-2 text-xs" 
                    title="Print"
                >
                    <Printer size={16} /> <span className="hidden sm:inline">Print</span>
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
                id="letter-print-area"
                className="bg-white shadow-lg border border-gray-200 p-16 w-full max-w-[700px] min-h-[900px] flex flex-col relative print:shadow-none print:border-none print:w-full print:absolute print:top-0 print:left-0 print:m-0"
            >
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
                    <Building2 size={300} />
                </div>

                {/* Letterhead */}
                <div className="flex justify-between items-start mb-16 border-b-2 border-black pb-6">
                    <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded">
                            <Building2 size={20} />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">GlassFlow Inc.</span>
                    </div>
                    <div className="text-right text-[10px] text-gray-500 leading-relaxed">
                        <p>123 Innovation Drive</p>
                        <p>San Francisco, CA 94107</p>
                        <p>+1 (555) 012-3456</p>
                        <p>www.glassflow.com</p>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1">
                    {getLetterContent()}
                </div>

                {/* Footer */}
                <div className="mt-auto pt-8 border-t border-gray-200 text-center text-[10px] text-gray-400">
                    <p>GlassFlow Inc. • Registered in Delaware • Reg No: 8829-XJ2</p>
                    <p>Confidential & Proprietary</p>
                </div>

            </div>
        </div>
        
        {/* CSS for print mode */}
        <style>{`
            @media print {
                body * {
                    visibility: hidden;
                }
                #letter-print-area, #letter-print-area * {
                    visibility: visible;
                }
                #letter-print-area {
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
                /* Hide header/buttons */
                .print\\:hidden {
                    display: none !important;
                }
            }
        `}</style>
      </div>
    </div>
  );
};

export default LetterPreviewModal;
