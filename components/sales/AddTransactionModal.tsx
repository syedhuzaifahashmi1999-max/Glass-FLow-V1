
import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, User, ShoppingBag, CreditCard, Activity } from 'lucide-react';
import { SaleTransaction } from '../../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: Omit<SaleTransaction, 'id'>) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    product: '',
    amount: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    paymentMethod: 'Credit Card',
    status: 'Completed' as SaleTransaction['status']
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      customerName: formData.customerName,
      product: formData.product,
      amount: parseFloat(formData.amount) || 0,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      status: formData.status
    });
    
    // Reset
    setFormData({
        customerName: '',
        product: '',
        amount: '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        paymentMethod: 'Credit Card',
        status: 'Completed'
    });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
         
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black tracking-tight">Record New Sale</h2>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="p-6">
           <form onSubmit={handleSubmit} className="space-y-5">
             
             {/* Customer & Product */}
             <div className="space-y-4">
                <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Customer Name <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            name="customerName" 
                            required 
                            value={formData.customerName} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                            placeholder="e.g. Acme Corp" 
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Product / Service <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <ShoppingBag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            name="product" 
                            required 
                            value={formData.product} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                            placeholder="e.g. Enterprise License" 
                        />
                    </div>
                </div>
             </div>

             {/* Amount & Date */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Amount</label>
                     <div className="relative">
                         <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="amount" 
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.amount} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                            placeholder="0.00" 
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Date</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="date" 
                            value={formData.date} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                            placeholder="MMM DD, YYYY" 
                         />
                     </div>
                 </div>
             </div>

             {/* Payment Method & Status */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Payment Method</label>
                     <div className="relative">
                         <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <select 
                            name="paymentMethod" 
                            value={formData.paymentMethod} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                         >
                            <option value="Credit Card">Credit Card</option>
                            <option value="Wire Transfer">Wire Transfer</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Stripe">Stripe</option>
                         </select>
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Status</label>
                     <div className="relative">
                         <Activity size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                         >
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Failed">Failed</option>
                            <option value="Refunded">Refunded</option>
                         </select>
                     </div>
                 </div>
             </div>

             <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-all text-xs font-medium">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium shadow-lg shadow-black/5">Record Transaction</button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddTransactionModal;
