import React from 'react';
import { 
  Shield, 
  HardHat, 
  Users, 
  Briefcase, 
  Package, 
  Wrench, 
  Phone 
} from 'lucide-react';
import { UserRole } from '../../types';
import { PortalSearchBar } from './PortalSearchBar';

interface SocietySectionProps {
  currentRole: UserRole;
  societySubTab: 'engineers' | 'labours' | 'vendors' | 'materials' | 'machines';
  setSocietySubTab: (tab: 'engineers' | 'labours' | 'vendors' | 'materials' | 'machines') => void;
  societyMaterialMode: 'new' | 'rented';
  setSocietyMaterialMode: (mode: 'new' | 'rented') => void;
  societyMachineMode: 'new' | 'rented';
  setSocietyMachineMode: (mode: 'new' | 'rented') => void;
  filteredSocietyEngineers: any[];
  filteredSocietyLabours: any[];
  filteredSocietyVendors: any[];
  filteredSocietyMaterials: any[];
  filteredSocietyMachines: any[];
  showFeedback: (msg: string, type: 'success' | 'info') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  appliedSearchQuery: string;
  setAppliedSearchQuery: (q: string) => void;
}

export const SocietySection: React.FC<SocietySectionProps> = ({
  currentRole,
  societySubTab,
  setSocietySubTab,
  societyMaterialMode,
  setSocietyMaterialMode,
  societyMachineMode,
  setSocietyMachineMode,
  filteredSocietyEngineers,
  filteredSocietyLabours,
  filteredSocietyVendors,
  filteredSocietyMaterials,
  filteredSocietyMachines,
  showFeedback,
  searchQuery,
  setSearchQuery,
  appliedSearchQuery,
  setAppliedSearchQuery
}) => {
  const getSubTabLabel = () => {
    switch (societySubTab) {
      case 'engineers': return 'Audits & Staff';
      case 'labours': return 'Specialists';
      case 'vendors': return 'Vendors';
      case 'materials': return 'Supplies';
      case 'machines': return 'Equipment';
      default: return 'All';
    }
  };

  return (
    <div className="space-y-6 pt-1">
      {/* Search Bar for Society Services */}
      <PortalSearchBar 
        segmentTitle="Society"
        subTabLabel={getSubTabLabel()}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        appliedSearchQuery={appliedSearchQuery}
        setAppliedSearchQuery={setAppliedSearchQuery}
      />

      <div className="flex items-center justify-between">
        <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
          <Shield size={16} className="text-blue-600 animate-pulse" />
          Society Services Catalog & Dispatch
        </h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase">5 Sub-types Available</span>
      </div>

      {/* Sub-types Nav Bar for Society Works */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { id: 'engineers', label: 'i) Audits & Staff', icon: HardHat, color: 'text-orange-600 bg-orange-50' },
          { id: 'labours', label: 'ii) Specialists', icon: Users, color: 'text-teal-600 bg-teal-50' },
          { id: 'vendors', label: 'iii) Vendors', icon: Briefcase, color: 'text-sky-600 bg-sky-50' },
          { id: 'materials', label: 'iv) Supplies', icon: Package, color: 'text-yellow-600 bg-yellow-50' },
          { id: 'machines', label: 'v) Equipment', icon: Wrench, color: 'text-indigo-600 bg-indigo-50' },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSocietySubTab(tab.id as any)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                societySubTab === tab.id 
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50 font-extrabold text-blue-900' 
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

      {/* Interactive display area based on society sub tab selection */}
      <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-150">
        {societySubTab === 'engineers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Available Society Auditors & Consultants</h4>
              <span className="text-xs font-extrabold text-blue-600 bg-white px-2 py-1 rounded-lg border">Audit Rate Reference</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredSocietyEngineers.length > 0 ? (
                filteredSocietyEngineers.map(eng => (
                  <div key={eng.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{eng.name}</p>
                        <p className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded mt-1 inline-block">{eng.specialty}</p>
                        <div className="text-[11px] text-gray-400 mt-2">Exp: {eng.experience} | Rating: ⭐ {eng.rating}</div>
                      </div>
                      <span className="text-md font-black text-gray-900 font-mono">₹{eng.dailyRate}/day</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                      <button 
                        onClick={() => showFeedback(`Successfully booked audit consultation call with ${eng.name}!`, 'success')}
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
                  No matching society engineers found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}

        {societySubTab === 'labours' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Available Society Technicians & Specialists</h4>
              <span className="text-xs font-extrabold text-blue-600 bg-white px-2 py-1 rounded-lg border">Daily wage reference</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredSocietyLabours.length > 0 ? (
                filteredSocietyLabours.map(lab => (
                  <div key={lab.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{lab.name}</p>
                        <p className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded mt-1 inline-block">{lab.specialty}</p>
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
                  No matching society specialists found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}

        {societySubTab === 'vendors' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Verified Multi-Service Society Vendors</h4>
            </div>
            <div className="space-y-3">
              {filteredSocietyVendors.length > 0 ? (
                filteredSocietyVendors.map(v => (
                  <div key={v.id} className="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-extrabold text-gray-850 text-sm">{v.name}</p>
                        <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-black uppercase">Verified Vendor</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Specialist: <strong className="text-gray-700">{v.specialist}</strong></p>
                      <p className="text-xs text-gray-400">Location: {v.location} | Active/Completed Projects: {v.completed}</p>
                      <span className="text-xs text-yellow-500 font-extrabold">⭐ {v.rating} customer feedback</span>
                    </div>
                    <button 
                      onClick={() => showFeedback(`Request for tenders sent to ${v.name}. They will response with estimation rates.`, 'success')}
                      className="py-2.5 px-4 bg-blue-600 text-white font-black text-xs rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap self-start sm:self-auto"
                    >
                      Request Society Quote
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                  No matching society vendors found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}

        {societySubTab === 'materials' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-gray-150">
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Society Supplies & Materials</h4>
                <span className="text-xs text-blue-600 font-semibold">Bulk discount offers are available for registered housing societies</span>
              </div>
              {/* Mode switcher */}
              <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setSocietyMaterialMode('new')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    societyMaterialMode === 'new'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-650 hover:text-gray-900'
                  }`}
                >
                  <span>🛒</span> Buy New
                </button>
                <button
                  onClick={() => setSocietyMaterialMode('rented')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    societyMaterialMode === 'rented'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-650 hover:text-gray-900'
                  }`}
                >
                  <span>🔑</span> Rented setups
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredSocietyMaterials.length > 0 ? (
                filteredSocietyMaterials.map(m => (
                  <div key={m.id} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-blue-400 transition-all">
                    <div>
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block mb-1">
                        {societyMaterialMode === 'new' ? '💎 Direct Purchase' : '📐 Retained Hire'}
                      </span>
                      <h5 className="font-bold text-gray-800 text-xs tracking-tight h-8 line-clamp-2">{m.name}</h5>
                      <div className="flex justify-between items-center mt-3 text-[10px] text-gray-400">
                        <span>Billing unit: {m.unit}</span>
                        <span className="text-green-600 font-bold">In Stock</span>
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
                        className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-2 rounded-lg transition-colors"
                      >
                        {currentRole === UserRole.CLIENT 
                          ? (societyMaterialMode === 'new' ? 'Order Materials' : 'Hire Service')
                          : 'Update Bidding'
                        }
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                  No matching supplies found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}

        {societySubTab === 'machines' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-gray-150">
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Society Equipment & Machineries</h4>
                <span className="text-xs text-blue-600 font-semibold">Trained personnel options are included</span>
              </div>
              {/* Mode switcher */}
              <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setSocietyMachineMode('new')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    societyMachineMode === 'new'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-650 hover:text-gray-900'
                  }`}
                >
                  <span>🛒</span> Buy New Assets
                </button>
                <button
                  onClick={() => setSocietyMachineMode('rented')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    societyMachineMode === 'rented'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-650 hover:text-gray-900'
                  }`}
                >
                  <span>🔑</span> Rented Machines
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredSocietyMachines.length > 0 ? (
                filteredSocietyMachines.map(mac => (
                  <div key={mac.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-sm flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-gray-850 text-xs h-9 line-clamp-2">{mac.name}</h5>
                      <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded inline-block mt-2 ${
                        societyMachineMode === 'new' ? 'text-green-700 bg-green-50' : 'text-blue-600 bg-blue-50'
                      }`}>
                        {societyMachineMode === 'new' ? 'Buy Asset' : 'Heavy Rental'}
                      </span>
                      <p className="font-mono text-xs font-black text-gray-700 mt-3">
                        Price: ₹{mac.price.toLocaleString()} {societyMachineMode === 'new' ? '' : `/ ${mac.unit}`}
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
                        societyMachineMode === 'new' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-black'
                      }`}
                    >
                      {currentRole === UserRole.CLIENT 
                        ? (societyMachineMode === 'new' ? 'Enquire Purchase Price' : 'Book Heavy Rental')
                        : 'Manage Allocation'
                      }
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                  No matching equipment found. Try clearing your search.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
