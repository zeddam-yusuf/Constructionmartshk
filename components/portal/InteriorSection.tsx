import React from 'react';
import { 
  Sparkles, 
  HardHat, 
  Users, 
  Briefcase, 
  Package, 
  Wrench, 
  Phone 
} from 'lucide-react';
import { UserRole } from '../../types';
import { PortalSearchBar } from './PortalSearchBar';

interface InteriorSectionProps {
  currentRole: UserRole;
  interiorSubTab: 'engineers' | 'labours' | 'vendors' | 'materials' | 'machines';
  setInteriorSubTab: (tab: 'engineers' | 'labours' | 'vendors' | 'materials' | 'machines') => void;
  interiorMaterialMode: 'new' | 'rented';
  setInteriorMaterialMode: (mode: 'new' | 'rented') => void;
  interiorMachineMode: 'new' | 'rented';
  setInteriorMachineMode: (mode: 'new' | 'rented') => void;
  filteredInteriorEngineers: any[];
  filteredInteriorLabours: any[];
  filteredInteriorVendors: any[];
  filteredInteriorMaterials: any[];
  filteredInteriorMachines: any[];
  showFeedback: (msg: string, type: 'success' | 'info') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  appliedSearchQuery: string;
  setAppliedSearchQuery: (q: string) => void;
}

export const InteriorSection: React.FC<InteriorSectionProps> = ({
  currentRole,
  interiorSubTab,
  setInteriorSubTab,
  interiorMaterialMode,
  setInteriorMaterialMode,
  interiorMachineMode,
  setInteriorMachineMode,
  filteredInteriorEngineers,
  filteredInteriorLabours,
  filteredInteriorVendors,
  filteredInteriorMaterials,
  filteredInteriorMachines,
  showFeedback,
  searchQuery,
  setSearchQuery,
  appliedSearchQuery,
  setAppliedSearchQuery
}) => {
  const getSubTabLabel = () => {
    switch (interiorSubTab) {
      case 'engineers': return 'Engineers';
      case 'labours': return 'Labours';
      case 'vendors': return 'Vendors';
      case 'materials': return 'Materials';
      case 'machines': return 'Machines';
      default: return 'All';
    }
  };

  return (
    <div className="space-y-6 pt-1">
      {/* Search Bar for Interior Services */}
      <PortalSearchBar 
        segmentTitle="Interior"
        subTabLabel={getSubTabLabel()}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        appliedSearchQuery={appliedSearchQuery}
        setAppliedSearchQuery={setAppliedSearchQuery}
      />

      <div className="flex items-center justify-between">
        <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          Interior Services Catalog & Dispatch
        </h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase">5 Sub-types Available</span>
      </div>

      {/* Sub-types Nav Bar for Interior Works */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { id: 'engineers', label: 'i) engineer/ staff', icon: HardHat, color: 'text-orange-600 bg-orange-50' },
          { id: 'labours', label: 'ii) Labours', icon: Users, color: 'text-teal-600 bg-teal-50' },
          { id: 'vendors', label: 'iii) Vendors', icon: Briefcase, color: 'text-sky-600 bg-sky-50' },
          { id: 'materials', label: 'iv) Materials', icon: Package, color: 'text-yellow-600 bg-yellow-50' },
          { id: 'machines', label: 'v) Machines', icon: Wrench, color: 'text-indigo-600 bg-indigo-50' },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setInteriorSubTab(tab.id as any)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                interiorSubTab === tab.id 
                  ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/50 font-extrabold text-amber-900' 
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

      {/* Interactive display area based on interior sub tab selection */}
      <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-150">
        {interiorSubTab === 'engineers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Available Interior Engineers & Consultants</h4>
              <span className="text-xs font-extrabold text-amber-600 bg-white px-2 py-1 rounded-lg border">Day Rate / Consulting Reference</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredInteriorEngineers.length > 0 ? (
                filteredInteriorEngineers.map(eng => (
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
                        onClick={() => showFeedback(`Successfully booked consultation call with ${eng.name}!`, 'success')}
                        className="flex-1 text-[11px] font-black text-center py-2 text-white bg-gray-900 hover:bg-black rounded-lg transition-colors"
                      >
                        Book Consultant
                      </button>
                      <a href="tel:+919876543210" className="p-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-500">
                        <Phone size={13} />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                  No matching interior engineers found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}

        {interiorSubTab === 'labours' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Available Interior Artisans & Labours</h4>
              <span className="text-xs font-extrabold text-amber-600 bg-white px-2 py-1 rounded-lg border">Daily wage reference</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredInteriorLabours.length > 0 ? (
                filteredInteriorLabours.map(lab => (
                  <div key={lab.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{lab.name}</p>
                        <p className="text-[11px] font-semibold text-amber-700 bg-amber-55 px-1.5 py-0.5 rounded mt-1 inline-block">{lab.specialty}</p>
                        <div className="text-[11px] text-gray-400 mt-2">Exp: {lab.experience} | Rating: ⭐ {lab.rating}</div>
                      </div>
                      <span className="text-md font-black text-gray-900 font-mono">₹{lab.dailyRate}/day</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                      <button 
                        onClick={() => showFeedback(`Successfully requested direct quote check from ${lab.name}!`, 'success')}
                        className="flex-1 text-[11px] font-black text-center py-2 text-white bg-gray-900 hover:bg-black rounded-lg transition-colors"
                      >
                        Book / Request Quote
                      </button>
                      <a href="tel:+919876543210" className="p-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-500">
                        <Phone size={13} />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                  No matching interior artisans found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}

        {interiorSubTab === 'vendors' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Verified Multi-Service Interior Vendors</h4>
            </div>
            <div className="space-y-3">
              {filteredInteriorVendors.length > 0 ? (
                filteredInteriorVendors.map(v => (
                  <div key={v.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h5 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        {v.name}
                        <span className="text-[10px] bg-green-50 text-green-700 font-extrabold px-1.5 py-0.5 rounded">Verified Vendor</span>
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">Specialists in: {v.specialist}</p>
                      <p className="text-[11px] text-gray-400 mt-1">Location: {v.location} | Successfully Completed: {v.completed} Projects</p>
                    </div>
                    <button 
                      onClick={() => showFeedback(`Inquiry forwarded to ${v.name}. They will view and reach out soon!`, 'success')}
                      className="py-2 px-4 bg-amber-500 text-white font-bold text-xs rounded-lg hover:bg-amber-600 transition-colors whitespace-nowrap self-start sm:self-auto"
                    >
                      Request Interior Quote
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                  No matching interior vendors found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}

        {interiorSubTab === 'materials' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-gray-150">
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Interior Materials & Fixtures</h4>
                <span className="text-xs font-bold text-green-600">Bulk delivery is supported across all zones</span>
              </div>
              {/* Mode switcher */}
              <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setInteriorMaterialMode('new')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    interiorMaterialMode === 'new'
                      ? 'bg-amber-500 text-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🛒</span> Buy New
                </button>
                <button
                  onClick={() => setInteriorMaterialMode('rented')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    interiorMaterialMode === 'rented'
                      ? 'bg-amber-500 text-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🔑</span> Rented / Scaffolding
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {filteredInteriorMaterials.length > 0 ? (
                filteredInteriorMaterials.map(m => (
                  <div key={m.id} className="bg-white p-3.5 rounded-xl border border-gray-200 flex flex-col justify-between hover:scale-[1.01] hover:border-amber-300 transition-all">
                    <div>
                      <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">
                        {interiorMaterialMode === 'new' ? '✨ Brand New' : '🛠️ Rental Material'}
                      </span>
                      <h5 className="font-bold text-gray-800 text-xs mt-1 h-9 line-clamp-2">{m.name}</h5>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-xs text-gray-400">Unit: {m.unit}</p>
                        <span className="text-[10px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded">{m.stock}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-1">
                      <div>
                        <span className="font-mono text-sm font-black text-gray-800">₹{m.price}</span>
                        <span className="text-[10px] text-gray-400 block -mt-1">per {m.unit}</span>
                      </div>
                      <button 
                        onClick={() => showFeedback(
                          currentRole === UserRole.CLIENT 
                            ? `Inquiry for ${interiorMaterialMode === 'new' ? 'purchasing' : 'renting'} ${m.name} submitted!`
                            : `Bid proposal initiated for supply of ${m.name} to municipal projects!`, 
                          'success'
                        )}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-3 py-2 rounded-lg text-xs tracking-tight transition-colors shadow-sm"
                      >
                        {currentRole === UserRole.CLIENT 
                          ? (interiorMaterialMode === 'new' ? 'Buy Now' : 'Rent Now')
                          : 'Supply B2B'
                        }
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                  No matching materials found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}

        {interiorSubTab === 'machines' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-gray-150">
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Precision Tools & Machineries</h4>
                <span className="text-xs text-gray-400">Tested and certified precision instruments</span>
              </div>
              {/* Mode switcher */}
              <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setInteriorMachineMode('new')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    interiorMachineMode === 'new'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🛒</span> Buy New Machine
                </button>
                <button
                  onClick={() => setInteriorMachineMode('rented')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    interiorMachineMode === 'rented'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🔑</span> Rented Machines
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {filteredInteriorMachines.length > 0 ? (
                filteredInteriorMachines.map(mac => (
                  <div key={mac.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-400 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded">
                          <Wrench size={14} />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          interiorMachineMode === 'new' ? 'text-green-700 bg-green-50' : 'text-indigo-700 bg-indigo-50'
                        }`}>
                          {interiorMachineMode === 'new' ? 'New Purchase' : 'Rental'}
                        </span>
                      </div>
                      <h5 className="font-bold text-gray-800 text-xs h-10 line-clamp-2">{mac.name}</h5>
                      <p className="font-mono text-xs font-extrabold text-gray-700 mt-2">
                        ₹{mac.price.toLocaleString()} {interiorMachineMode === 'new' ? '' : `/ ${mac.unit}`}
                      </p>
                    </div>
                    <button 
                      onClick={() => showFeedback(
                        currentRole === UserRole.CLIENT
                          ? `Added ${mac.name} ${interiorMachineMode === 'new' ? 'purchase order' : 'rental request'} to cart!`
                          : `Registered model ${mac.name} into commercial supply chain.`,
                        'success'
                      )}
                      className={`w-full mt-4 text-[11px] font-bold py-2 rounded-lg text-center text-white transition-all ${
                        interiorMachineMode === 'new' ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {currentRole === UserRole.CLIENT 
                        ? (interiorMachineMode === 'new' ? 'Buy Tool Now' : 'Rent This Tool')
                        : 'Manage Equipment'
                      }
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                  No matching tools or machines found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
