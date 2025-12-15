
import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, User, Plus, Trash2 } from 'lucide-react';
import { Quotation, Customer, InvoiceItem } from '../../types';

interface AddQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quotation: Omit<Quotation, 'id'>) => void;
  customers: Customer[];
}

const AddQuotationModal: React.FC<AddQuotationModalProps> = ({ isOpen, onClose, onSave, customers }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Draft' as Quotation['status'],
    notes: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([
      { id: `item-${Date.now()}`, description: '', quantity: 1, price: 0 }
  ]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'customerId') {
      const selectedCustomer = customers.find(c => c.id === value);
      setFormData(prev => ({ 
        ...prev, 
        customerId: value,
        customerName: selectedCustomer ? selectedCustomer.name : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
      setItems(prev => prev.map(item => 
          item.id === id ? { ...item, [field]: value } : item
      ));
  };

  const addItem = () => {
      setItems([...items, { id: `item-${Date.now()}`, description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
      if (items.length > 1) {
          setItems(items.filter(i => i.id !== id));
      }
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * 0.1; // 10% tax mock
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      customerId: formData.customerId,
      customerName: formData.customerName,
      issueDate: new Date(formData.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      expiryDate: new Date(formData.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: total,
      status: formData.status,
      items: items,
      subtotal: subtotal,
      tax: tax,
      notes: formData.notes
    });
    
    // Reset
    setFormData({
        customerId: '',
        customerName: '',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Draft',
        notes: ''
    });
    setItems([{ id: `item-${Date.now()}`, description: '', quantity: 1, price: 0 }]);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`
            relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]
            transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         
         {/* Header */}
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black tracking-tight">Create New Quotation</h2>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="overflow-y-auto custom-scrollbar flex-1">
           <form onSubmit={handleSubmit} className="p-6 space-y-6">
             
             {/* Customer & Status */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Customer <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            name="customerId" 
                            required
                            value={formData.customerId} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                        >
                            <option value="">Select a Customer</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                            ))}
                        </select>
                    </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Status</label>
                     <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                     >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                     </select>
                 </div>
             </div>

             {/* Dates */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Issue Date</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="issueDate" 
                            type="date"
                            value={formData.issueDate} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Valid Until</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="expiryDate" 
                            type="date"
                            value={formData.expiryDate} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                         />
                     </div>
                 </div>
             </div>

             {/* Line Items */}
             <div>
                 <div className="flex justify-between items-center mb-2">
                     <label className="block text-[11px] font-medium text-gray-600">Line Items</label>
                     <button type="button" onClick={addItem} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                         <Plus size={12} /> Add Item
                     </button>
                 </div>
                 <div className="space-y-2">
                     {items.map((item, index) => (
                         <div key={item.id} className="flex gap-2 items-start">
                             <div className="flex-1">
                                 <input 
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-accent"
                                 />
                             </div>
                             <div className="w-16">
                                 <input 
                                    type="number"
                                    min="1"
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-xs text-black focus:outline-none focus:border-accent text-center"
                                 />
                             </div>
                             <div className="w-24 relative">
                                 <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                 <input 
                                    type="number"
                                    min="0"
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                                    className="w-full bg-white border border-gray-200 rounded-lg pl-5 pr-2 py-2 text-xs text-black focus:outline-none focus:border-accent"
                                 />
                             </div>
                             <div className="w-8 flex items-center justify-center pt-2">
                                 <button type="button" onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500">
                                     <Trash2 size={14} />
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>

             {/* Summary */}
             <div className="flex justify-end pt-4 border-t border-gray-50">
                 <div className="w-48 space-y-2">
                     <div className="flex justify-between text-xs text-gray-500">
                         <span>Subtotal</span>
                         <span>${subtotal.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-xs text-gray-500">
                         <span>Tax (10%)</span>
                         <span>${tax.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-sm font-medium text-black pt-2 border-t border-gray-100">
                         <span>Total</span>
                         <span>${total.toFixed(2)}</span>
                     </div>
                 </div>
             </div>

             {/* Notes */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Notes</label>
                <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-accent resize-none"
                    placeholder="Valid for 30 days..."
                />
             </div>

             <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-all text-xs font-medium">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium shadow-lg shadow-black/5">Create Quotation</button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddQuotationModal;
