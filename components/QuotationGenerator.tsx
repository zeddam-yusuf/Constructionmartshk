import React, { useState } from 'react';
import { Quotation, QuotationItem, ActivityRate, MaterialRate, Vendor, Project } from '../types';
import { Plus, Trash2, Printer, Send, Calculator, MapPin, FileText } from 'lucide-react';

interface QuotationGeneratorProps {
  vendor: Vendor;
  projects: Project[];
  activityRates: ActivityRate[];
  materialRates: MaterialRate[];
}

const QuotationGenerator: React.FC<QuotationGeneratorProps> = ({
  vendor,
  projects,
  activityRates,
  materialRates
}) => {
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [clientName, setClientName] = useState('');
  const [region, setRegion] = useState(vendor.region || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Local state for current item being added
  const [currentItem, setCurrentItem] = useState({ description: '', quantity: 1, unit: '', rate: 0 });

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  const addItemFromRate = (rate: ActivityRate | MaterialRate) => {
    const newItem: QuotationItem = {
      description: 'activity' in rate ? rate.activity : rate.material,
      quantity: 1,
      unit: rate.unit,
      rate: rate.rate,
      total: rate.rate
    };
    setItems([...items, newItem]);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const total = currentItem.quantity * currentItem.rate;
    setItems([...items, { ...currentItem, total }]);
    setCurrentItem({ description: '', quantity: 1, unit: '', rate: 0 });
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handlePrint = () => {
    window.print();
  };

  const availableRates = [...activityRates, ...materialRates].filter(r => 
    r.region.toLowerCase().includes(region.toLowerCase()) &&
    (('activity' in r ? r.activity : r.material).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <h3 className="text-2xl font-bold flex items-center gap-2">
               <Calculator className="text-orange-500" size={24} />
               Quotation & Estimation Tool
             </h3>
             <p className="text-gray-400 text-xs mt-1">Professional cost estimation based on regional rates.</p>
          </div>
          <div className="flex gap-2">
             <button onClick={handlePrint} className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-700 transition-colors border border-gray-700">
               <Printer size={16} /> Print PDF
             </button>
             <button disabled={items.length === 0} className="flex items-center gap-2 bg-orange-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-950/20 disabled:opacity-50">
               <Send size={16} /> Send to Client
             </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Configuration & Rate Picker */}
          <div className="lg:col-span-1 space-y-6">
             <div className="space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                   <FileText size={16} className="text-orange-600" />
                   Quotation Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Client Name / Project Name</label>
                    <input 
                      type="text" 
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. John's Villa Renovation"
                      className="w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Region</label>
                    <input 
                      type="text" 
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>
             </div>

             <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                    <Calculator size={16} className="text-blue-600" />
                    Quick Add from Rates
                  </h4>
                  <span className="text-[10px] text-gray-400 font-bold">{availableRates.length} matched</span>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search rates..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none"
                  />
                </div>
                <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                   {availableRates.map((rate) => (
                     <button
                      key={rate.id}
                      onClick={() => addItemFromRate(rate)}
                      className="w-full text-left p-2 rounded-lg hover:bg-orange-50 border border-transparent hover:border-orange-100 transition-all flex justify-between items-center group"
                     >
                       <div className="truncate pr-2">
                         <p className="text-xs font-bold text-gray-700 group-hover:text-orange-700">
                           {'activity' in rate ? rate.activity : rate.material}
                         </p>
                         <p className="text-[10px] text-gray-400">{rate.unit} • ₹{rate.rate}/{rate.unit}</p>
                       </div>
                       <Plus size={14} className="text-gray-300 group-hover:text-orange-500" />
                     </button>
                   ))}
                   {availableRates.length === 0 && (
                     <p className="text-center py-4 text-xs text-gray-400 italic">No matching regional rates found.</p>
                   )}
                </div>
             </div>
          </div>

          {/* Right Column: Quotation Preview */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl min-h-[600px] flex flex-col print:border-0 print:bg-white print:p-0">
                {/* Branding */}
                <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-200">
                   <div>
                     <h2 className="text-2xl font-black text-gray-900 mb-1">{vendor.name}</h2>
                     <p className="text-sm text-gray-500">{vendor.specialty} Specialist</p>
                     <p className="text-xs text-gray-400 mt-1">{vendor.phone} • {vendor.email}</p>
                   </div>
                   <div className="text-right">
                     <h1 className="text-3xl font-bold text-orange-600 uppercase tracking-tighter">QUOTATION</h1>
                     <p className="text-xs text-gray-500 mt-1">DATE: {new Date().toLocaleDateString()}</p>
                     <p className="text-xs text-gray-400">REF: CM-{Math.floor(Math.random()*10000)}</p>
                   </div>
                </div>

                {/* Info Section */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                     <p className="text-[10px] uppercase font-black text-gray-400 mb-1">To:</p>
                     <p className="text-sm font-bold text-gray-800">{clientName || 'Valued Client'}</p>
                     <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                       <MapPin size={10} /> {region || 'Platform Region'}
                     </p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="flex-1">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-gray-100 py-2 border-y border-gray-200">
                       <tr>
                         <th className="px-4 py-2 font-bold text-gray-700">Description</th>
                         <th className="px-4 py-2 text-center font-bold text-gray-700">Qty</th>
                         <th className="px-4 py-2 text-center font-bold text-gray-700">Rate</th>
                         <th className="px-4 py-2 text-right font-bold text-gray-700">Total</th>
                         <th className="px-4 py-2 print:hidden"></th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 text-gray-800 font-medium">{item.description}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{item.quantity} {item.unit}</td>
                            <td className="px-4 py-3 text-center text-gray-600 font-mono">₹{item.rate}</td>
                            <td className="px-4 py-3 text-right text-gray-900 font-bold font-mono">₹{item.total.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right print:hidden">
                               <button onClick={() => removeItem(idx)} className="text-red-300 hover:text-red-600 p-1">
                                 <Trash2 size={14} />
                               </button>
                            </td>
                          </tr>
                        ))}
                        {items.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-20 text-center text-gray-300 italic text-sm">
                              Add items to generate a quotation
                            </td>
                          </tr>
                        )}
                     </tbody>
                   </table>
                </div>

                {/* Totals */}
                <div className="mt-8 pt-8 border-t border-slate-200 flex justify-end">
                   <div className="w-64 space-y-2">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-500 uppercase font-bold text-[10px]">Subtotal:</span>
                        <span className="text-gray-900 font-mono font-bold">₹{totalAmount.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-500 uppercase font-bold text-[10px]">Taxes (0%):</span>
                        <span className="text-gray-900 font-mono font-bold">₹0</span>
                     </div>
                     <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                        <span className="text-gray-900 uppercase font-black text-xs">Total Amount:</span>
                        <span className="text-2xl font-black text-gray-900 font-mono">₹{totalAmount.toLocaleString()}</span>
                     </div>
                   </div>
                </div>

                {/* Terms */}
                <div className="mt-12 text-[10px] text-gray-400 space-y-1">
                   <p className="font-bold uppercase text-gray-500">Terms & Conditions:</p>
                   <p>1. Validity of this quotation is 15 days from the date of issue.</p>
                   <p>2. Payment strictly as per milestones defined in the contract.</p>
                   <p>3. Construction Mart handles 10% service fee from the final vendor payout.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationGenerator;
import { Search } from 'lucide-react';
