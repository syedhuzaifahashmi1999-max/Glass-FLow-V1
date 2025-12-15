
import React from 'react';
import { ArrowLeft, Box, DollarSign, Users, Briefcase, FileText, TrendingUp, CheckCircle, Package } from 'lucide-react';
import { Product } from '../types';
import { MOCK_SALES, MOCK_PROJECTS, MOCK_LEADS, MOCK_INVOICES } from '../constants';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack }) => {
  // Filter related entities based on Product Name
  const relatedSales = MOCK_SALES.filter(s => s.product === product.name);
  const relatedProjects = MOCK_PROJECTS.filter(p => p.relatedProduct === product.name);
  const relatedLeads = MOCK_LEADS.filter(l => l.productInterest === product.name);
  const relatedInvoices = MOCK_INVOICES.filter(i => i.relatedProduct === product.name);

  // Calculate some stats
  const totalRevenue = relatedSales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalSold = relatedSales.length;

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col bg-white fade-in overflow-y-auto custom-scrollbar pb-20">
      {/* Header */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-black transition-colors mb-4"
        >
          <ArrowLeft size={12} />
          <span>Back to Products</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
             <div className="p-3 bg-gray-50 rounded-lg text-gray-400">
               <Package size={24} strokeWidth={1} />
             </div>
             <div>
                <h1 className="text-3xl font-light text-black tracking-tight mb-2">{product.name}</h1>
                <div className="flex items-center gap-3">
                   <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wide">
                      {product.type}
                   </span>
                   <span className="text-sm text-gray-500 font-mono">
                      {product.sku}
                   </span>
                </div>
             </div>
          </div>
          
          <div className="flex gap-3">
             <button className="px-4 py-2 rounded border border-gray-200 text-gray-600 hover:text-black hover:border-black transition-colors text-xs font-medium">
                Edit Product
             </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
         <div className="p-5 rounded-lg border border-gray-100 bg-gray-50/30">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block mb-2">Price</span>
            <span className="text-xl text-black font-light">${product.price.toLocaleString()}</span>
         </div>
         <div className="p-5 rounded-lg border border-gray-100 bg-gray-50/30">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block mb-2">Billing</span>
            <span className="text-xl text-black font-light">{product.billingFrequency}</span>
         </div>
         <div className="p-5 rounded-lg border border-gray-100 bg-gray-50/30">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block mb-2">Total Sales</span>
            <span className="text-xl text-black font-light">{totalSold}</span>
         </div>
         <div className="p-5 rounded-lg border border-gray-100 bg-gray-50/30">
            <span className="text-[10px] uppercase tracking-wider text-green-600/70 font-semibold block mb-2">Revenue Generated</span>
            <span className="text-xl text-green-700 font-light">${totalRevenue.toLocaleString()}</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         
         {/* SALES COLUMN */}
         <div className="space-y-8">
            {/* Sales History */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
               <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp size={14} /> Sales History
                  </h3>
                  <span className="text-[10px] text-gray-400">{relatedSales.length} records</span>
               </div>
               <div className="divide-y divide-gray-50">
                  {relatedSales.length > 0 ? relatedSales.map(sale => (
                     <div key={sale.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                        <div>
                           <div className="text-sm font-medium text-black">{sale.customerName}</div>
                           <div className="text-[10px] text-gray-400">{sale.date} • {sale.paymentMethod}</div>
                        </div>
                        <div className="text-right">
                           <div className="text-sm font-mono text-black">${sale.amount.toLocaleString()}</div>
                           <div className="text-[9px] text-green-600 uppercase font-medium">{sale.status}</div>
                        </div>
                     </div>
                  )) : (
                     <div className="p-6 text-center text-gray-400 text-xs italic">No sales recorded for this product.</div>
                  )}
               </div>
            </div>

            {/* Invoices */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
               <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} /> Related Invoices
                  </h3>
               </div>
               <div className="divide-y divide-gray-50">
                  {relatedInvoices.length > 0 ? relatedInvoices.map(inv => (
                     <div key={inv.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded bg-gray-100 text-gray-500">
                              <FileText size={14} />
                           </div>
                           <div>
                              <div className="text-xs font-medium text-black">{inv.id}</div>
                              <div className="text-[10px] text-gray-400">Due: {inv.dueDate}</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-sm font-mono text-black">${inv.amount.toLocaleString()}</div>
                           <span className={`text-[9px] px-1.5 py-0.5 rounded ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{inv.status}</span>
                        </div>
                     </div>
                  )) : (
                     <div className="p-6 text-center text-gray-400 text-xs italic">No invoices found.</div>
                  )}
               </div>
            </div>
         </div>

         {/* PROJECTS & LEADS COLUMN */}
         <div className="space-y-8">
            {/* Active Projects */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
               <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase size={14} /> Active Projects
                  </h3>
               </div>
               <div className="divide-y divide-gray-50">
                  {relatedProjects.length > 0 ? relatedProjects.map(proj => (
                     <div key={proj.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                           <div className="text-sm font-medium text-black">{proj.name}</div>
                           <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">{proj.status}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="text-xs text-gray-500">{proj.client}</div>
                           <div className="w-24 bg-gray-100 rounded-full h-1">
                              <div className="bg-black h-full rounded-full" style={{ width: `${proj.progress}%` }}></div>
                           </div>
                        </div>
                     </div>
                  )) : (
                     <div className="p-6 text-center text-gray-400 text-xs italic">No projects linked to this product.</div>
                  )}
               </div>
            </div>

            {/* Interested Leads (Pipeline) */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
               <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Users size={14} /> Interested Leads
                  </h3>
               </div>
               <div className="divide-y divide-gray-50">
                  {relatedLeads.length > 0 ? relatedLeads.map(lead => (
                     <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <img src={lead.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-gray-100" />
                           <div>
                              <div className="text-xs font-medium text-black">{lead.name}</div>
                              <div className="text-[10px] text-gray-400">{lead.company}</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-xs font-medium text-black">{lead.stage}</div>
                           <div className="text-[10px] text-gray-400">Value: ${lead.value.toLocaleString()}</div>
                        </div>
                     </div>
                  )) : (
                     <div className="p-6 text-center text-gray-400 text-xs italic">No leads interested in this product yet.</div>
                  )}
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default ProductDetails;
