
import React from 'react';
import { X, Printer, Download, ShoppingBag, Calendar, Truck, FileText, CheckCircle, AlertCircle, Clock, Trash2, Edit, Monitor } from 'lucide-react';
import { PurchaseOrder } from '../../types';

interface PurchaseOrderDrawerProps {
  po: PurchaseOrder | null;
  onClose: () => void;
  onEdit: (po: PurchaseOrder) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: PurchaseOrder['status']) => void;
  onConvertToAsset?: (item: any) => void;
}

const PurchaseOrderDrawer: React.FC<PurchaseOrderDrawerProps> = ({ po, onClose, onEdit, onDelete, onStatusChange, onConvertToAsset }) => {
  if (!po) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'Received': return 'bg-green-100 text-green-800 border-green-200';
      case 'Ordered': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-out border-l border-gray-100 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 shadow-sm">
                    <ShoppingBag size={18} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">{po.id}</h2>
                    <p className="text-xs text-gray-500">Created on {po.orderDate}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => onEdit(po)} className="p-2 hover:bg-white rounded-full text-gray-500 hover:text-black transition-colors" title="Edit">
                    <Edit size={18} />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-gray-500 hover:text-black transition-colors" title="Close">
                    <X size={18} />
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            
            {/* Status Bar */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">Current Status</span>
                    <span className={`px-2 py-0.5 w-fit rounded text-xs font-bold border uppercase tracking-wide ${getStatusColor(po.status)}`}>
                        {po.status}
                    </span>
                </div>
                {po.status === 'Ordered' && (
                    <button 
                        onClick={() => onStatusChange(po.id, 'Received')}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        <CheckCircle size={14} /> Mark Received
                    </button>
                )}
            </div>

            {/* Vendor & Dates */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Vendor Details</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                        <p className="font-medium text-black text-base">{po.vendorName}</p>
                        <p className="text-xs text-gray-500">ID: {po.vendorId}</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Timeline</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={14} className="text-gray-400" />
                            <span>Ordered: <span className="font-medium text-black">{po.orderDate}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Truck size={14} className="text-gray-400" />
                            <span>Expected: <span className="font-medium text-black">{po.expectedDate || 'TBD'}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Order Items</h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 font-medium">Description</th>
                                <th className="px-4 py-3 text-center font-medium">Qty</th>
                                <th className="px-4 py-3 text-right font-medium">Cost</th>
                                <th className="px-4 py-3 text-right font-medium">Total</th>
                                {onConvertToAsset && <th className="px-4 py-3 text-center font-medium w-10"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {po.items.map((item, idx) => (
                                <tr key={item.id || idx}>
                                    <td className="px-4 py-3 text-gray-900">{item.description}</td>
                                    <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                                    <td className="px-4 py-3 text-right text-gray-600">${item.unitCost.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right font-medium text-black">${(item.quantity * item.unitCost).toLocaleString()}</td>
                                    {onConvertToAsset && (
                                        <td className="px-4 py-3 text-center">
                                            <button 
                                                onClick={() => onConvertToAsset(item)}
                                                className="text-gray-400 hover:text-blue-600 transition-colors p-1" 
                                                title="Convert to Asset"
                                            >
                                                <Monitor size={14} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 border-t border-gray-200">
                            <tr>
                                <td colSpan={onConvertToAsset ? 4 : 3} className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Grand Total</td>
                                <td className="px-4 py-3 text-right font-bold text-black text-lg">${po.totalAmount.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Notes */}
            {po.notes && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FileText size={12} /> Internal Notes
                    </h3>
                    <p className="text-sm text-yellow-900 leading-relaxed">{po.notes}</p>
                </div>
            )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <button 
                onClick={() => { if(confirm('Delete PO?')) { onDelete(po.id); onClose(); } }}
                className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
            >
                <Trash2 size={14} /> Delete
            </button>
            <div className="flex gap-2">
                <button onClick={handlePrint} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                    <Printer size={14} /> Print
                </button>
                <button className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 shadow-lg shadow-black/5">
                    <Download size={14} /> Download PDF
                </button>
            </div>
        </div>

      </div>
    </>
  );
};

export default PurchaseOrderDrawer;
