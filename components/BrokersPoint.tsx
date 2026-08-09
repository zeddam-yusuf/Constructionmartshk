import React, { useState } from 'react';
import { saveSubmission } from '../services/supabase';
import { 
  Building2, 
  MapPin, 
  Percent, 
  Coins, 
  Plus, 
  Search, 
  Calculator, 
  Phone, 
  Heart, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  ChevronRight,
  TrendingUp,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  type: 'residential' | 'commercial';
  action: 'buy' | 'sell' | 'invest';
  price: number; // in Lakhs
  location: string;
  area: number; // sq ft
  expectedYield: number; // ROI %
  description: string;
  developer: string;
  isPopular?: boolean;
}

const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Emerald Aura Luxury Residences',
    type: 'residential',
    action: 'buy',
    price: 125, // 1.25 Crore
    location: 'Whitefield, Bangalore',
    area: 1850,
    expectedYield: 4.2,
    description: 'Ultra-modern 3 BHK apartment with smart home automation, high-end clubhouse, and infinity pool access.',
    developer: 'Emerald Group',
    isPopular: true
  },
  {
    id: 'prop-2',
    title: 'TechHub Elite Commercial Plaza',
    type: 'commercial',
    action: 'invest',
    price: 450, // 4.5 Crore
    location: 'Hitec City, Hyderabad',
    area: 5200,
    expectedYield: 8.5,
    description: 'Fully leased pre-inked Grade-A office space with multinational tech tenant on a 9-year locked-in period.',
    developer: 'Elite Builders',
    isPopular: true
  },
  {
    id: 'prop-3',
    title: 'Skyline Premium Business Suites',
    type: 'commercial',
    action: 'buy',
    price: 280, // 2.8 Crore
    location: 'Ghatkopar East, Mumbai',
    area: 3100,
    expectedYield: 7.2,
    description: 'High-visibility corner commercial block ideal for banks, luxury showrooms, or premium consultancy suites.',
    developer: 'Skyline Corp',
  },
  {
    id: 'prop-4',
    title: 'Serene Meadows Eco-Apartments',
    type: 'residential',
    action: 'buy',
    price: 78, // 78 Lakhs
    location: 'Rajarhat, Kolkata',
    area: 1250,
    expectedYield: 3.8,
    description: 'Elegant 2 BHK eco-friendly apartment focusing on green living, solar backup, and organic terraces.',
    developer: 'Greenfield Developers',
  },
  {
    id: 'prop-5',
    title: 'Nexus Sovereign High-Street Retail',
    type: 'commercial',
    action: 'invest',
    price: 180, // 1.8 Crore
    location: 'Sector 62, Noida',
    area: 1400,
    expectedYield: 9.1,
    description: 'Premium ground floor retail outlet in a heavy footfall high-street marketplace with fixed annual rent escalation.',
    developer: 'Nexus Infrastructure',
    isPopular: true
  }
];

export const BrokersPoint: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [activeActionFilter, setActiveActionFilter] = useState<'all' | 'buy' | 'invest'>('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'residential' | 'commercial'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Listed Property Form State
  const [showListForm, setShowListForm] = useState(false);
  const [newPropTitle, setNewPropTitle] = useState('');
  const [newPropType, setNewPropType] = useState<'residential' | 'commercial'>('residential');
  const [newPropAction, setNewPropAction] = useState<'buy' | 'sell' | 'invest'>('buy');
  const [newPropPrice, setNewPropPrice] = useState('');
  const [newPropLocation, setNewPropLocation] = useState('');
  const [newPropArea, setNewPropArea] = useState('');
  const [newPropYield, setNewPropYield] = useState('');
  const [newPropDesc, setNewPropDesc] = useState('');
  const [newPropDev, setNewPropDev] = useState('');

  // ROI Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(50); // in Lakhs
  const [calcPropertyType, setCalcPropertyType] = useState<'residential' | 'commercial'>('commercial');
  
  // Inquiry Modal State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientInquiryType, setClientInquiryType] = useState<'visit' | 'broker_call' | 'roi_briefing'>('visit');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Filter properties
  const filteredProperties = properties.filter(prop => {
    const matchesAction = activeActionFilter === 'all' ? true : prop.action === activeActionFilter;
    const matchesType = activeTypeFilter === 'all' ? true : prop.type === activeTypeFilter;
    const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prop.developer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesType && matchesSearch;
  });

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropTitle || !newPropPrice || !newPropLocation) {
      alert('Please fill out all required fields.');
      return;
    }

    const priceNum = parseFloat(newPropPrice);
    const areaNum = parseFloat(newPropArea) || 1200;
    const yieldNum = parseFloat(newPropYield) || (newPropType === 'commercial' ? 7.5 : 4.0);

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title: newPropTitle,
      type: newPropType,
      action: newPropAction,
      price: priceNum,
      location: newPropLocation,
      area: areaNum,
      expectedYield: yieldNum,
      description: newPropDesc || `${newPropType === 'commercial' ? 'High potential office/retail' : 'Beautiful luxury apartment'} in the heart of ${newPropLocation}.`,
      developer: newPropDev || 'Self Listed/Broker Direct',
    };

    setProperties([newProp, ...properties]);
    saveSubmission('property', newProp);
    
    // Clear state
    setNewPropTitle('');
    setNewPropPrice('');
    setNewPropLocation('');
    setNewPropArea('');
    setNewPropYield('');
    setNewPropDesc('');
    setNewPropDev('');
    setShowListForm(false);

    triggerFeedback('Property listed successfully! Verified brokers will review and make it public shortly.', 'success');
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    const inquiryDetails = {
      id: `inq-${Date.now()}`,
      clientName,
      clientPhone,
      propertyId: selectedProperty?.id,
      propertyTitle: selectedProperty?.title,
      date: new Date().toISOString()
    };

    saveSubmission('inquiry', inquiryDetails);

    triggerFeedback(`Inquiry received for "${selectedProperty?.title}". Senior property consultant will contact you at ${clientPhone} within 1 hour.`, 'success');
    setSelectedProperty(null);
    setClientName('');
    setClientPhone('');
  };

  const triggerFeedback = (text: string, type: 'success' | 'info') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 5500);
  };

  // Live Calculations
  const yieldPercent = calcPropertyType === 'commercial' ? 8.2 : 4.1;
  const annualRental = (calcAmount * (yieldPercent / 100)); // in Lakhs
  const monthlyRental = (annualRental / 12) * 100000; // in Rupees
  const appreciationRate = calcPropertyType === 'commercial' ? 7.5 : 9.0;
  const projectedValue5Y = calcAmount * Math.pow(1 + appreciationRate / 100, 5);

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="bg-gradient-to-r from-amber-50/60 to-orange-50/40 border border-orange-100 hover:border-orange-300 p-4 md:p-5 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group animate-in fade-in duration-300 w-full"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100/80 text-orange-700 rounded-2xl group-hover:scale-105 transition-transform duration-300">
            <Building2 size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-orange-100 text-orange-800 rounded-full text-[9px] font-black uppercase tracking-wider mb-1">
              Real Estate Marketplace
            </div>
            <h3 className="text-base font-black text-gray-900 tracking-tight group-hover:text-orange-700 transition-colors">
              Broker's Point — Residential & Commercial Real Estate
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Buy, sell, or invest in premium apartments. Verify live ROI yields and connect directly with senior brokers.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="hidden md:flex flex-col items-end text-right font-medium mr-2">
            <span className="text-[10px] font-extrabold uppercase text-gray-400">Yield up to</span>
            <span className="text-xs font-black text-emerald-600 font-mono">9.1% ROI p.a.</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(false);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-xs font-black transition-all shadow-md group-hover:shadow-orange-200"
          >
            <span>Explore Listings</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 shadow-sm space-y-8 animate-in fade-in duration-500">
      
      {/* Feedback Banner */}
      {feedbackMsg && (
        <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-lg border transition-all flex items-center gap-3 animate-in slide-in-from-bottom duration-300 ${
          feedbackMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-orange-50 border-orange-200 text-orange-800'
        }`}>
          <CheckCircle2 size={20} className={feedbackMsg.type === 'success' ? 'text-emerald-600' : 'text-orange-600'} />
          <div className="text-xs font-bold leading-tight">{feedbackMsg.text}</div>
          <button onClick={() => setFeedbackMsg(null)} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header section with modern badging */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
            <Building2 size={12} /> Real Estate Marketplace
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Broker's Point
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Browse verified listings, list your property, or run real estate ROI simulations for residential and commercial apartments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsMinimized(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-extrabold transition-all active:scale-95 border border-gray-200"
          >
            <ChevronUp size={16} className="text-gray-500" />
            Minimize Section
          </button>
          <button
            onClick={() => setShowListForm(!showListForm)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black transition-all shadow-md hover:shadow-orange-200 active:scale-95"
          >
            <Plus size={16} />
            List Your Property
          </button>
        </div>
      </div>

      {/* Listing Form Accordion / Modal-like */}
      {showListForm && (
        <div className="bg-slate-50 border border-gray-200 rounded-2xl p-6 animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
            <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
              <FileText size={16} className="text-orange-600" />
              Add Your Real Estate Asset for Buying/Investment
            </h3>
            <button 
              onClick={() => setShowListForm(false)} 
              className="p-1 hover:bg-gray-200 rounded-lg text-gray-400"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleAddProperty} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-gray-600 uppercase mb-1">Property Title *</label>
              <input 
                type="text" 
                required
                value={newPropTitle}
                onChange={e => setNewPropTitle(e.target.value)}
                placeholder="e.g. Skyline Heights 3BHK" 
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-600 uppercase mb-1">Developer / Owner Name</label>
              <input 
                type="text" 
                value={newPropDev}
                onChange={e => setNewPropDev(e.target.value)}
                placeholder="e.g. Prestige Group or Self" 
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-600 uppercase mb-1">Location *</label>
              <input 
                type="text" 
                required
                value={newPropLocation}
                onChange={e => setNewPropLocation(e.target.value)}
                placeholder="e.g. Indiranagar, Bangalore" 
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-extrabold text-gray-600 uppercase mb-1">Type</label>
                <select 
                  value={newPropType}
                  onChange={e => setNewPropType(e.target.value as any)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="residential">Residential Apartment</option>
                  <option value="commercial">Commercial Space</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-gray-600 uppercase mb-1">Deal Intent</label>
                <select 
                  value={newPropAction}
                  onChange={e => setNewPropAction(e.target.value as any)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="buy">For Sale (Buy)</option>
                  <option value="invest">For Investment (Yield)</option>
                  <option value="sell">Sell My Property</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-extrabold text-gray-600 uppercase mb-1">Price (Lakhs) *</label>
                <input 
                  type="number" 
                  required
                  value={newPropPrice}
                  onChange={e => setNewPropPrice(e.target.value)}
                  placeholder="e.g. 120" 
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-gray-600 uppercase mb-1">Area (Sq.Ft)</label>
                <input 
                  type="number" 
                  value={newPropArea}
                  onChange={e => setNewPropArea(e.target.value)}
                  placeholder="e.g. 1500" 
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-gray-600 uppercase mb-1">Expected ROI (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={newPropYield}
                  onChange={e => setNewPropYield(e.target.value)}
                  placeholder="e.g. 7.2" 
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-600 uppercase mb-1">Short Description</label>
              <textarea 
                rows={2}
                value={newPropDesc}
                onChange={e => setNewPropDesc(e.target.value)}
                placeholder="Briefly explain architectural style, occupancy, premium benefits..."
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="col-span-1 md:col-span-2 pt-2 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setShowListForm(false)} 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-xs font-bold text-gray-700 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black transition-all"
              >
                Publish Listing
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters & Search subheader */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-gray-150">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider mr-1">Deal Type:</span>
          <button
            onClick={() => setActiveActionFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeActionFilter === 'all' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
          >
            All Deals
          </button>
          <button
            onClick={() => setActiveActionFilter('buy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeActionFilter === 'buy' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
          >
            Buy (Own)
          </button>
          <button
            onClick={() => setActiveActionFilter('invest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeActionFilter === 'invest' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
          >
            Invest (Yield Focused)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider mr-1">Property Category:</span>
          <button
            onClick={() => setActiveTypeFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTypeFilter === 'all' ? 'text-orange-700 bg-orange-50 font-black' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            All Assets
          </button>
          <button
            onClick={() => setActiveTypeFilter('residential')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTypeFilter === 'residential' ? 'text-orange-700 bg-orange-50 font-black' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Residential Apartments
          </button>
          <button
            onClick={() => setActiveTypeFilter('commercial')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTypeFilter === 'commercial' ? 'text-orange-700 bg-orange-50 font-black' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Commercial Spaces
          </button>
        </div>

        <div className="relative w-full md:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input 
            type="text" 
            placeholder="Search city, builder..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 pl-9 pr-4 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(prop => (
            <div key={prop.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              
              {/* Card visual banner block */}
              <div className="bg-slate-900 p-4 relative text-white flex flex-col justify-between h-36">
                <div className="flex justify-between items-start">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                    prop.type === 'commercial' ? 'bg-indigo-600' : 'bg-teal-600'
                  }`}>
                    {prop.type}
                  </span>
                  {prop.isPopular && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-1">
                      <TrendingUp size={10} /> High Demand
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-sm text-white tracking-tight leading-snug drop-shadow-sm group-hover:text-orange-300 transition-colors">
                    {prop.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-gray-300 mt-1">
                    <MapPin size={10} /> {prop.location}
                  </div>
                </div>
              </div>

              {/* Card specifications block */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {prop.description}
                </p>

                <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-gray-100 text-center">
                  <div>
                    <span className="block text-[9px] font-extrabold uppercase text-gray-400">Asking Price</span>
                    <span className="text-xs font-black text-gray-800 font-mono">
                      ₹{prop.price >= 100 ? `${(prop.price / 100).toFixed(2)} Cr` : `${prop.price} L`}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-extrabold uppercase text-gray-400">Super Area</span>
                    <span className="text-xs font-bold text-gray-700 font-mono">{prop.area} sqft</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-extrabold uppercase text-gray-400">Target ROI</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-0.5 font-mono">
                      <Percent size={11} /> {prop.expectedYield}%
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-gray-400 flex justify-between items-center pb-2">
                  <span>Developer: <strong className="text-gray-600 font-bold">{prop.developer}</strong></span>
                  <span className="uppercase font-black text-[9px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                    {prop.action === 'invest' ? 'Pre-Leased' : 'Immediate' }
                  </span>
                </div>

                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => setSelectedProperty(prop)}
                    className="flex-1 py-2 text-center text-xs font-black bg-slate-900 text-white rounded-lg hover:bg-black transition-colors"
                  >
                    Inquire & ROI Details
                  </button>
                  <button 
                    onClick={() => triggerFeedback(`Saved "${prop.title}" to your favorites directory!`, 'info')}
                    className="p-2 border border-gray-200 hover:border-red-200 hover:text-red-500 rounded-lg text-gray-400 transition-colors"
                    title="Add to wishlist"
                  >
                    <Heart size={14} fill="currentColor" className="text-current" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-gray-300">
            <Building2 className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-sm font-bold text-gray-500">No properties found matching your selection.</p>
            <p className="text-xs text-gray-400 mt-1">Try resetting the filters or clearing the search box.</p>
          </div>
        )}
      </div>

      {/* Live Investment ROI Simulation Engine */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">
            <Calculator size={10} /> ROI Engine
          </div>
          <h3 className="text-lg font-black text-gray-900 leading-tight">
            Asset Investment Yield Estimator
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Drag the slider to adjust your capital allocation budget and see potential monthly earnings and 5-year capital appreciation returns based on real estate index trends.
          </p>

          <div className="pt-2 space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-gray-700">Property Sector:</span>
                <span className="text-orange-700 capitalize">{calcPropertyType}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCalcPropertyType('residential')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    calcPropertyType === 'residential' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white text-gray-600 border'
                  }`}
                >
                  Residential Apartment
                </button>
                <button
                  type="button"
                  onClick={() => setCalcPropertyType('commercial')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    calcPropertyType === 'commercial' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white text-gray-600 border'
                  }`}
                >
                  Commercial Space
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-orange-100/50 flex flex-col justify-between gap-6 shadow-sm">
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              <span>Investment Capital Budget</span>
              <span className="text-sm font-black text-slate-900 font-mono">
                ₹{calcAmount >= 100 ? `${(calcAmount / 100).toFixed(2)} Cr` : `${calcAmount} Lakhs`}
              </span>
            </div>

            {/* Slider Input */}
            <div className="pt-2">
              <input 
                type="range" 
                min="10" 
                max="500" 
                value={calcAmount} 
                onChange={e => setCalcAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold font-mono mt-1">
                <span>₹10 L</span>
                <span>₹1 Cr</span>
                <span>₹2.5 Cr</span>
                <span>₹5 Cr</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-gray-100">
            <div>
              <span className="block text-[10px] font-extrabold uppercase text-gray-400 mb-0.5">Average Yield</span>
              <span className="text-sm font-black text-emerald-600 font-mono">
                ~ {yieldPercent}% p.a.
              </span>
              <span className="block text-[9px] text-gray-400 mt-0.5">Market average rate</span>
            </div>
            <div>
              <span className="block text-[10px] font-extrabold uppercase text-gray-400 mb-0.5">Projected Monthly Rent</span>
              <span className="text-sm font-black text-gray-800 font-mono">
                ₹{monthlyRental.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              <span className="block text-[9px] text-gray-400 mt-0.5">Steady passive income</span>
            </div>
            <div>
              <span className="block text-[10px] font-extrabold uppercase text-gray-400 mb-0.5">5Y Asset Value Projection</span>
              <span className="text-sm font-black text-gray-800 font-mono">
                ₹{projectedValue5Y >= 100 ? `${(projectedValue5Y / 100).toFixed(2)} Cr` : `${projectedValue5Y.toFixed(0)} L`}
              </span>
              <span className="block text-[9px] text-gray-400 mt-0.5">At ~{appreciationRate}% p.a growth</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-medium leading-normal bg-orange-50/50 p-2.5 rounded-lg border border-dashed border-orange-200 flex items-start gap-2">
            <Coins size={14} className="text-orange-600 shrink-0 mt-0.5" />
            <span>
              Real estate investments on Construction Mart SHK are backed by title security reviews, ready structural audits and trusted brokerage escrows. Actual rental cashflow may vary according to direct tenant occupancy covenants.
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Inquiry Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="inquiry-modal-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setSelectedProperty(null)}
            />
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform transition-transform duration-300 ease-in-out">
                <div className="flex h-full flex-col bg-white shadow-2xl overflow-hidden rounded-l-3xl border-l border-gray-150 animate-in slide-in-from-right duration-300">
                  
                  {/* Modal Header */}
                  <div className="px-6 py-5 bg-gradient-to-r from-orange-600 to-orange-500 text-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div>
                      <h3 className="text-md font-black tracking-tight" id="inquiry-modal-title">Property Prospect Inquiry</h3>
                      <p className="text-[10px] text-orange-100 font-bold uppercase tracking-wider">Direct Broker Consultation</p>
                    </div>
                    <button 
                      onClick={() => setSelectedProperty(null)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all active:scale-95"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-gray-250">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-orange-600 text-white tracking-widest">{selectedProperty.type}</span>
                      <h4 className="font-extrabold text-sm text-gray-800 mt-2">{selectedProperty.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin size={11} /> {selectedProperty.location}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-200/50">
                        <div>
                          <span className="block text-[9px] font-extrabold text-gray-400 uppercase">Broker Asking</span>
                          <span className="font-black text-sm text-gray-900 font-mono">₹{selectedProperty.price} L</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-extrabold text-gray-400 uppercase">Expected Rental Return</span>
                          <span className="font-bold text-sm text-emerald-600 font-mono">{selectedProperty.expectedYield}% ROI</span>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-extrabold text-gray-600 uppercase mb-1">Your Full Name *</label>
                        <input 
                          type="text" 
                          required
                          value={clientName}
                          onChange={e => setClientName(e.target.value)}
                          placeholder="e.g. Rahul Sen" 
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-gray-600 uppercase mb-1">Contact Phone *</label>
                        <input 
                          type="tel" 
                          required
                          value={clientPhone}
                          onChange={e => setClientPhone(e.target.value)}
                          placeholder="e.g. +91 99887 76655" 
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-gray-600 uppercase mb-1">Purpose of Contact</label>
                        <select 
                          value={clientInquiryType}
                          onChange={e => setClientInquiryType(e.target.value as any)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="visit">Schedule Guided Site Visit</option>
                          <option value="broker_call">Request Callback from Direct Broker</option>
                          <option value="roi_briefing">Receive Structured ROI & Yield Projections</option>
                        </select>
                      </div>

                      <div className="pt-2">
                        <button 
                          type="submit"
                          className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                        >
                          Submit Inquiry to Broker
                        </button>
                      </div>
                    </form>

                    <div className="border-t border-gray-150 pt-4 space-y-2">
                      <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-wider">Immediate Agent Hotline</p>
                      <a 
                        href="tel:+919876543210" 
                        className="flex items-center justify-center gap-2 w-full py-2 border border-gray-200 hover:bg-gray-50 text-xs font-black text-slate-700 rounded-xl transition-all"
                      >
                        <Phone size={14} className="text-orange-600" />
                        Call Head Broker: +91 98765 43210
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
