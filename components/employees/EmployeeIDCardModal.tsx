
import React, { useState } from 'react';
import { X, Printer, RotateCw, Fingerprint } from 'lucide-react';
import { Employee } from '../../types';

interface EmployeeIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const EmployeeIDCardModal: React.FC<EmployeeIDCardModalProps> = ({ isOpen, onClose, employee }) => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  if (!isOpen || !employee) return null;

  const handlePrint = () => {
    window.print();
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`ID:${employee.id}|${employee.email}`)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Preview Area (Left/Top) */}
        <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center overflow-auto relative">
           
           {/* The ID Card */}
           <div 
             id="id-card-print-area"
             className={`
                bg-white rounded-xl shadow-xl overflow-hidden relative border border-gray-200 transition-all duration-500 ease-in-out
                ${orientation === 'portrait' ? 'w-[320px] h-[500px]' : 'w-[500px] h-[320px]'}
             `}
           >
              {/* Card Background Graphics */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500 blur-3xl"></div>
                 <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-purple-500 blur-3xl"></div>
              </div>
              
              {/* Content Container */}
              <div className={`relative h-full flex z-10 ${orientation === 'portrait' ? 'flex-col' : 'flex-row'}`}>
                  
                  {/* Header / Photo Section */}
                  <div className={`
                    bg-gradient-to-br from-gray-900 to-black text-white p-6 flex items-center justify-center relative overflow-hidden
                    ${orientation === 'portrait' ? 'h-2/5 w-full flex-col' : 'w-2/5 h-full flex-col'}
                  `}>
                      {/* Abstract pattern */}
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                      
                      <div className="relative z-10 mb-3">
                         <div className="w-24 h-24 rounded-full border-4 border-white/20 shadow-lg overflow-hidden">
                            <img src={employee.avatarUrl} className="w-full h-full object-cover" alt="ID Photo" />
                         </div>
                      </div>
                      
                      <div className="text-center">
                          <h2 className="text-xl font-bold tracking-tight">{employee.name}</h2>
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">{employee.role}</p>
                      </div>
                  </div>

                  {/* Details Section */}
                  <div className={`
                    bg-white p-6 flex flex-col justify-between
                    ${orientation === 'portrait' ? 'h-3/5 w-full' : 'w-3/5 h-full'}
                  `}>
                      <div className="flex justify-between items-start">
                         <div>
                            <img src="https://via.placeholder.com/40x40/000000/FFFFFF?text=GF" alt="Logo" className="w-10 h-10 rounded mb-4" />
                         </div>
                         <div className="text-right">
                             <h3 className="text-xs font-bold text-black uppercase tracking-wider">GlassFlow</h3>
                             <p className="text-[10px] text-gray-500">Employee ID Card</p>
                         </div>
                      </div>

                      <div className="space-y-3">
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                             <span className="text-[10px] text-gray-400 uppercase font-semibold">ID Number</span>
                             <span className="text-xs font-mono text-black">{employee.id.toUpperCase()}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                             <span className="text-[10px] text-gray-400 uppercase font-semibold">Department</span>
                             <span className="text-xs font-medium text-black">{employee.department}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                             <span className="text-[10px] text-gray-400 uppercase font-semibold">Join Date</span>
                             <span className="text-xs font-medium text-black">{employee.joinDate}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                             <span className="text-[10px] text-gray-400 uppercase font-semibold">Location</span>
                             <span className="text-xs font-medium text-black">{employee.location}</span>
                          </div>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                          <div className="flex flex-col gap-1">
                             <Fingerprint size={24} className="text-gray-300" />
                             <span className="text-[8px] text-gray-400 uppercase">Authorized Personnel</span>
                          </div>
                          <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16 opacity-80" />
                      </div>
                  </div>
              </div>
           </div>

        </div>

        {/* Controls Area (Right/Bottom) */}
        <div className="w-full md:w-80 bg-white border-l border-gray-100 p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-medium text-black">Card Settings</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-6 flex-1">
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Orientation</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                           onClick={() => setOrientation('portrait')}
                           className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${orientation === 'portrait' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                        >
                            <div className="w-6 h-8 border-2 border-current rounded-sm"></div>
                            <span className="text-xs font-medium">Portrait</span>
                        </button>
                        <button 
                           onClick={() => setOrientation('landscape')}
                           className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${orientation === 'landscape' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                        >
                            <div className="w-8 h-6 border-2 border-current rounded-sm"></div>
                            <span className="text-xs font-medium">Landscape</span>
                        </button>
                    </div>
                </div>

                <div>
                   <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Card Information</label>
                   <div className="p-4 bg-gray-50 rounded-lg text-xs space-y-2 text-gray-600">
                      <p>• High-resolution output</p>
                      <p>• Includes dynamic QR code</p>
                      <p>• Verified Security Hologram</p>
                   </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <button 
                   onClick={handlePrint}
                   className="w-full py-3 bg-black text-white rounded-xl font-medium shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                    <Printer size={18} />
                    Print ID Card
                </button>
            </div>
        </div>

      </div>
      
      {/* CSS for printing to hide everything else */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #id-card-print-area, #id-card-print-area * {
            visibility: visible;
          }
          #id-card-print-area {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            margin: 0;
            box-shadow: none;
            border: 1px solid #ddd;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeIDCardModal;
