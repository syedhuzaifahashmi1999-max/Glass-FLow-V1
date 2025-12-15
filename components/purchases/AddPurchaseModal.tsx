
import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Calendar, User, Plus, Trash2, DollarSign, Check } from 'lucide-react';
import { PurchaseOrder, Vendor, Product, PurchaseItem } from '../../types';
import { MOCK_VENDORS } from '../../constants';

interface AddPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (po: Omit<PurchaseOrder, 'id'>) => void;
  products: Product[];
  initialData?: PurchaseOrder;
}

const AddPurchaseModal: React.FC<AddPurchaseModalProps> = ({ isOpen, onClose, onSave, products, initialData }) => {
  const [formData, setFormData] = useState({
    vendorId: '',
    vendorName: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDate: '',
    status: 'Draft' as PurchaseOrder['status'],
    notes: ''
  });

  const [items, setItems] = useState<PurchaseItem[]>([
      { id: `item-${Date.now()}`, description: '', quantity: 1, unitCost: 0 }
  ]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (initialData) {
        // Edit Mode
        setFormData({
            vendorId: initialData.vendorId,
            vendorName: initialData.vendorName,
            orderDate: initialData.orderDate ? new Date(initialData.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], // Simplified date handling
            expectedDate: initialData.expectedDate ? new Date(initialData.expectedDate).toISOString().split('T')[0] : '',
            status: initialData.status,
            notes: initialData.notes || ''
        });
        setItems(initialData.items && initialData.items.length > 0 ? initialData.items : [{ id: `item-${Date.now()}`, description: '', quantity: 1, unitCost: 0 }]);
      } else {
        // Create Mode
        setFormData({
            vendorId: '',
            vendorName: '',
            orderDate: new Date().toISOString().split('T')[0],
            expectedDate: '',
            status: 'Draft',
            notes: ''
        });
        setItems([{ id: `item-${Date.now()}`, description: '', quantity: 1, unitCost: 0 }]);
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialData]);

  if (!isVisible && !isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'vendorId') {
        const vendor = MOCK_VENDORS.find(v => v.id === value);
        setFormData(prev => ({
            ...prev,
            vendorId: value,
            vendorName: vendor ? vendor.name : ''
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (id: string, field: keyof PurchaseItem, value: any) => {
      setItems(prev => prev.map(item => 
          item.id === id ? { ...item, [field]: value } : item
      ));
  };

  const addItem = () => {
      setItems([...items, { id: `item-${Date.now()}`, description: '', quantity: 1, unitCost: 0 }]);
  };

  const removeItem = (id: string) => {
      if (items.length > 1) {
          setItems(items.filter(i => i.id !== id));
      }
  };

  // Calculate totals
  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      vendorId: formData.vendorId,
      vendorName: formData.vendorName,
      orderDate: new Date(formData.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      expectedDate: formData.expectedDate ? new Date(formData.expectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
      status: formData.status,
      totalAmount,
      items,
      notes: formData.notes
    });
    
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
       <div className={`
            relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]
            transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
       `}>
         
         {/* Header */}
         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
           <div>
             <h2 className="text-lg font-light text-black tracking-tight">{initialData ? 'Edit Purchase Order' : 'Create Purchase Order'}</h2>
             <p className="text-xs text-gray-500">Manage procurement details and line items.</p>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100">
             <X size={18} strokeWidth={1.5} />
           </button>
         </div>
         
         <div className="overflow-y-auto custom-scrollbar flex-1">
           <form onSubmit={handleSubmit} className="p-6 space-y-6">
             
             {/* Vendor & Status */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Vendor <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            name="vendorId" 
                            required
                            value={formData.vendorId} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                        >
                            <option value="">Select Vendor</option>
                            {MOCK_VENDORS.map(v => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                        </select>
                    </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Status</label>
                     <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-accent appearance-none"
                     >
                        <option value="Draft">Draft</option>
                        <option value="Ordered">Ordered</option>
                        <option value="Received">Received</option>
                        <option value="Cancelled">Cancelled</option>
                     </select>
                 </div>
             </div>

             {/* Dates */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Order Date</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="orderDate" 
                            type="date"
                            value={formData.orderDate} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Expected Delivery</label>
                     <div className="relative">
                         <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            name="expectedDate" 
                            type="date"
                            value={formData.expectedDate} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-accent" 
                         />
                     </div>
                 </div>
             </div>

             {/* Line Items */}
             <div>
                 <div className="flex justify-between items-center mb-2">
                     <label className="block text-[11px] font-medium text-gray-600 uppercase tracking-wide">Line Items</label>
                     <button type="button" onClick={addItem} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                         <Plus size={12} /> Add Item
                     </button>
                 </div>
                 <div className="space-y-2 border-t border-gray-100 pt-2">
                     {items.map((item, index) => (
                         <div key={item.id} className="flex gap-2 items-start animate-in fade-in slide-in-from-top-1">
                             <div className="flex-1">
                                 <input 
                                    placeholder="Product or Service Description"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-accent"
                                    list="products"
                                 />
                                 <datalist id="products">
                                     {products.map(p => <option key={p.id} value={p.name} />)}
                                 </datalist>
                             </div>
                             <div className="w-20">
                                 <input 
                                    type="number"
                                    min="1"
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-xs text-black focus:outline-none focus:border-accent text-center"
                                 />
                             </div>
                             <div className="w-28 relative">
                                 <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                 <input 
                                    type="number"
                                    min="0"
                                    placeholder="Cost"
                                    value={item.unitCost}
                                    onChange={(e) => handleItemChange(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-5 pr-2 py-2 text-xs text-black focus:outline-none focus:border-accent"
                                 />
                             </div>
                             <div className="w-8 flex items-center justify-center pt-2">
                                 <button type="button" onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
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
                     <div className="flex justify-between text-lg font-bold items-center">
                         <span className="text-gray-900 text-sm uppercase tracking-wide">Total</span>
                         <span className="font-mono text-black text-xl">${totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                     </div>
                 </div>
             </div>

             {/* Notes */}
             <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Notes</label>
                <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-accent resize-none"
                    placeholder="Delivery instructions, reference numbers..."
                />
             </div>

             <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
               <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-all text-xs font-medium uppercase tracking-wide">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium shadow-lg shadow-black/5 flex items-center gap-2 uppercase tracking-wide">
                   <Check size={14} /> {initialData ? 'Update Order' : 'Create Order'}
               </button>
             </div>

           </form>
         </div>
       </div>
    </div>
  );
};

export default AddPurchaseModal;
