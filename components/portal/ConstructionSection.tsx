import React from 'react';
import { 
  Building, 
  HardHat, 
  Users, 
  Briefcase, 
  Package, 
  Wrench, 
  Truck, 
  Phone 
} from 'lucide-react';
import { UserRole } from '../../types';
import { PortalSearchBar } from './PortalSearchBar';

interface ConstructionSectionProps {
  currentRole: UserRole;
  constructionPart: 'part_a' | 'part_b';
  setConstructionPart: (part: 'part_a' | 'part_b') => void;
  constructionSubTab: 'engineers' | 'labours' | 'vendors' | 'materials' | 'machines' | 'vehicles';
  setConstructionSubTab: (tab: 'engineers' | 'labours' | 'vendors' | 'materials' | 'machines' | 'vehicles') => void;
  constructionMaterialMode: 'new' | 'rented';
  setConstructionMaterialMode: (mode: 'new' | 'rented') => void;
  constructionMachineMode: 'new' | 'rented';
  setConstructionMachineMode: (mode: 'new' | 'rented') => void;
  filteredConstructionEngineers: any[];
  filteredConstructionLabours: any[];
  filteredConstructionVendors: any[];
  filteredConstructionMaterials: any[];
  filteredConstructionMachines: any[];
  filteredConstructionVehicles: any[];
  showFeedback: (msg: string, type: 'success' | 'info') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  appliedSearchQuery: string;
  setAppliedSearchQuery: (q: string) => void;
}

export const ConstructionSection: React.FC<ConstructionSectionProps> = ({
  currentRole,
  constructionPart,
  setConstructionPart,
  constructionSubTab,
  setConstructionSubTab,
  constructionMaterialMode,
  setConstructionMaterialMode,
  constructionMachineMode,
  setConstructionMachineMode,
  filteredConstructionEngineers,
  filteredConstructionLabours,
  filteredConstructionVendors,
  filteredConstructionMaterials,
  filteredConstructionMachines,
  filteredConstructionVehicles,
  showFeedback,
  searchQuery,
  setSearchQuery,
  appliedSearchQuery,
  setAppliedSearchQuery
}) => {
  const getSubTabLabel = () => {
    switch (constructionSubTab) {
      case 'engineers': return 'Engineers';
      case 'labours': return 'Labours';
      case 'vendors': return 'Vendors';
      case 'materials': return 'Materials';
      case 'machines': return 'Machines';
      case 'vehicles': return 'Vehicles';
      default: return 'All';
    }
  };

  return (
    <div className="space-y-6 pt-1">
      {/* Search Bar for Construction Services */}
      <PortalSearchBar 
        segmentTitle="Construction"
        subTabLabel={getSubTabLabel()}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        appliedSearchQuery={appliedSearchQuery}
        setAppliedSearchQuery={setAppliedSearchQuery}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building size={18} className="text-orange-600" />
          <div>
            <h3 className="text-md font-bold text-gray-800">
              Construction Services Catalog & Dispatch
            </h3>
            <p className="text-[11px] text-gray-500">
              Select between Part A (Civil, MEP, Finishing) or Part B (Heavy Site & Foundations)
            </p>
          </div>
        </div>
        
        {/* Inline Toggle for Part A & Part B */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setConstructionPart('part_a')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              constructionPart === 'part_a'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-gray-650 hover:text-gray-850'
            }`}
          >
            <span>🏗️</span> Part A (Civil & Finishing)
          </button>
          <button
            onClick={() => setConstructionPart('part_b')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              constructionPart === 'part_b'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-gray-650 hover:text-gray-850'
            }`}
          >
            <span>🚜</span> Part B (Heavy Site & Infra)
          </button>
        </div>
      </div>

      {/* Sub-types Nav Bar for Construction */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { id: 'engineers', label: 'i) engineer/ staff', icon: HardHat, color: 'text-orange-600 bg-orange-50' },
          { id: 'labours', label: 'ii) Labours', icon: Users, color: 'text-teal-600 bg-teal-50' },
          { id: 'vendors', label: 'iii) Vendors', icon: Briefcase, color: 'text-sky-600 bg-sky-50' },
          { id: 'materials', label: 'iv) Materials', icon: Package, color: 'text-yellow-600 bg-yellow-50' },
          { id: 'machines', label: 'v) Machines', icon: Wrench, color: 'text-indigo-600 bg-indigo-50' },
          { id: 'vehicles', label: 'vi) Vehicles', icon: Truck, color: 'text-rose-600 bg-rose-50' },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setConstructionSubTab(tab.id as any)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                constructionSubTab === tab.id 
                  ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/50 font-extrabold text-orange-900' 
                  : 'border-gray-200 hover:border-gray-350 bg-white text-gray-500'
              }`}
            >
              <span className={`p-1.5 rounded-lg ${tab.color}`}>
                <Icon size={14} />
              </span>
              <span className="text-xs uppercase font-bold tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive display area based on construction sub tab selection */}
      <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-150">
        {constructionSubTab === 'engineers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Available Civil, Structural & Site Engineers</h4>
              <span className="text-xs font-extrabold text-amber-600 bg-white px-2 py-1 rounded-lg border">Day Rate / Consulting Reference</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConstructionEngineers.length > 0 ? (
                filteredConstructionEngineers.map(eng => (
                  <div key={eng.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{eng.name}</p>
                        <p className="text-[11px] font-semibold text-amber-700 bg-amber-55 px-1.5 py-0.5 rounded mt-1 inline-block">{eng.specialty}</p>
                        <div className="text-[11px] text-gray-400 mt-2">Exp: {eng.experience} | Rating: ⭐ {eng.rating}</div>
                      </div>
                      <span className="text-md font-black text-gray-900 font-mono">₹{eng.dailyRate}/day</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                      <button 
                        onClick={() => showFeedback(`Successfully booked engineering consultation with ${eng.name}!`, 'success')}
                        className="flex-1 text-[11px] font-black text-center py-2 text-white bg-gray-900 hover:bg-black rounded-lg transition-colors"
                      >
                        Book Engineer
                      </button>
                      <a href="tel:+919876543210" className="p-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-500">
                        <Phone size={13} />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                  No matching construction engineers found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}

        {constructionSubTab === 'labours' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">
                Available {constructionPart === 'part_a' ? 'Construction Services (Part A) Artisans & Labours' : 'Construction Services (Part B) Crews'}
              </h4>
              <span className="text-xs text-gray-400">Standard Daily shifts (08:30 AM - 05:30 PM)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConstructionLabours.length > 0 ? (
                filteredConstructionLabours.map(lab => (
                  <div key={lab.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow">
                    <div>
                      <p className="font-extrabold text-gray-800 text-sm">{lab.name}</p>
                      <p className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full mt-1.5 inline-block">{lab.specialty}</p>
                      <div className="text-[11px] text-gray-455 mt-3 space-y-0.5">
                        <p>Experience: {lab.experience}</p>
                        <p>Rating: ⭐ {lab.rating}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Wage shift:</span>
                        <span className="text-sm font-black text-gray-900">₹{lab.dailyRate}/day</span>
                      </div>
                      <button 
                        onClick={() => showFeedback(`Direct reservation inquiry sent to helper supervisor for ${lab.name}`, 'success')}
                        className="w-full text-xs font-black py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-center"
                      >
                        Book Crew
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                  No matching construction crews found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}

        {constructionSubTab === 'vendors' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Class-A Structural & Foundation Contractors</h4>
              <span className="text-xs text-gray-400">Commercial & Residential builders</span>
            </div>
            <div className="space-y-3">
              {filteredConstructionVendors.length > 0 ? (
                filteredConstructionVendors.map(v => (
                  <div key={v.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h5 className="font-black text-gray-800 text-sm flex items-center gap-2">
                        {v.name}
                        <span className="text-[10px] bg-indigo-50 text-indigo-750 font-bold px-1.5 py-0.5 rounded">RERA Registered</span>
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">Specialists in: {v.specialist}</p>
                      <p className="text-[11px] text-gray-400 mt-1">Location: {v.location} | Completed Infrastructure projects: {v.completed}</p>
                    </div>
                    <button 
                      onClick={() => showFeedback(`Request for tenders sent to ${v.name}. They will response with estimation rates.`, 'success')}
                      className="py-2.5 px-4 bg-orange-600 text-white font-black text-xs rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap self-start sm:self-auto"
                    >
                      Request Structural Bid
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                  No matching construction vendors found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}

        {constructionSubTab === 'materials' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-gray-150">
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Heavy Material Rates (Mumbai Region)</h4>
                <span className="text-xs text-gray-400 font-bold text-red-500">Prices fluctuate daily based on global market indices</span>
              </div>
              {/* Mode switcher */}
              <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setConstructionMaterialMode('new')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    constructionMaterialMode === 'new'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🛒</span> Buy New
                </button>
                <button
                  onClick={() => setConstructionMaterialMode('rented')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    constructionMaterialMode === 'rented'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🔑</span> Rented Centering / Scaffolding
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {filteredConstructionMaterials.length > 0 ? (
                filteredConstructionMaterials.map(m => (
                  <div key={m.id} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-orange-400 transition-all">
                    <div>
                      <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest block mb-1">
                        {constructionMaterialMode === 'new' ? '💎 Direct From Yard' : '📐 Retained Hire'}
                      </span>
                      <h5 className="font-bold text-gray-800 text-xs tracking-tight h-8 line-clamp-2">{m.name}</h5>
                      <div className="flex justify-between items-center mt-3 text-[10px] text-gray-400">
                        <span>Billing unit: {m.unit}</span>
                        <span className="text-green-600 font-bold">{m.stock}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="font-mono text-xs font-extrabold text-gray-850">₹{m.price.toLocaleString()}</p>
                        <span className="text-[9px] text-gray-455 block -mt-1">per {m.unit}</span>
                      </div>
                      <button 
                        onClick={() => showFeedback(
                          currentRole === UserRole.CLIENT
                            ? `Inquiry for bulk purchase/rent of ${m.name} submitted successfully!`
                            : `Assigned listing rates updated for ${m.name}!`, 
                          'success'
                        )}
                        className="text-[10px] bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-3 py-2 rounded-lg transition-colors"
                      >
                        {currentRole === UserRole.CLIENT 
                          ? (constructionMaterialMode === 'new' ? 'Order Materials' : 'Hire scaffolding')
                          : 'Update Bidding Yard'
                        }
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                  No matching construction materials found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}

        {constructionSubTab === 'machines' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-gray-150">
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Heavy Equipment & Machineries</h4>
                <span className="text-xs text-indigo-600 font-semibold">Trained operator dispatch options are pre-selected</span>
              </div>
              {/* Mode switcher */}
              <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setConstructionMachineMode('new')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    constructionMachineMode === 'new'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🛒</span> Buy New Machineries
                </button>
                <button
                  onClick={() => setConstructionMachineMode('rented')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    constructionMachineMode === 'rented'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🔑</span> Rented Machineries
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredConstructionMachines.length > 0 ? (
                filteredConstructionMachines.map(mac => (
                  <div key={mac.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-sm flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-gray-850 text-xs h-9 line-clamp-2">{mac.name}</h5>
                      <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded inline-block mt-2 ${
                        constructionMachineMode === 'new' ? 'text-green-700 bg-green-50' : 'text-rose-600 bg-rose-50'
                      }`}>
                        {constructionMachineMode === 'new' ? 'Buy Asset' : 'Heavy Rental'}
                      </span>
                      <p className="font-mono text-xs font-black text-gray-700 mt-3">
                        Price: ₹{mac.price.toLocaleString()} {constructionMachineMode === 'new' ? '' : `/ ${mac.unit}`}
                      </p>
                    </div>
                    <button 
                      onClick={() => showFeedback(
                        currentRole === UserRole.CLIENT
                          ? `Commercial quotation requested for ${mac.name}!`
                          : `Logistics status updated for ${mac.name}.`,
                        'success'
                      )}
                      className={`w-full mt-4 text-[11px] font-black py-2 text-white rounded-lg transition-colors ${
                        constructionMachineMode === 'new' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-black'
                      }`}
                    >
                      {currentRole === UserRole.CLIENT 
                        ? (constructionMachineMode === 'new' ? 'Enquire Purchase Price' : 'Book Heavy Rental')
                        : 'Manage Allocation'
                      }
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                  No matching equipment or machines found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}

        {constructionSubTab === 'vehicles' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Construction Logistics & Heavy Vehicles</h4>
              <span className="text-xs font-bold text-orange-600 bg-white border px-2 py-0.5 rounded-md">Live availability dispatcher</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredConstructionVehicles.length > 0 ? (
                filteredConstructionVehicles.map(vh => (
                  <div key={vh.id} className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-rose-50 text-rose-600 rounded">
                        <Truck size={14} />
                      </div>
                      <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest">{vh.availability}</span>
                    </div>
                    <h5 className="font-bold text-gray-800 text-xs h-9 line-clamp-2">{vh.name}</h5>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="font-mono text-indigo-700 font-bold text-xs">₹{vh.rate} / {vh.unit}</span>
                      <button 
                        onClick={() => showFeedback(`Requested booking details for vehicle: ${vh.name}`, 'success')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-[10px] px-2 py-1.5 rounded-lg"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                  No matching vehicles found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
