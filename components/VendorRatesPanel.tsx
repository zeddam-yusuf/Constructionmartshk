import React, { useState } from 'react';
import { ActivityRate, MaterialRate, Vendor } from '../types';
import { Plus, Trash2, Hammer, Package, MapPin, Search } from 'lucide-react';

interface VendorRatesPanelProps {
  vendor: Vendor;
  activityRates: ActivityRate[];
  materialRates: MaterialRate[];
  onAddActivityRate: (rate: Omit<ActivityRate, 'id'>) => void;
  onRemoveActivityRate: (id: string) => void;
  onAddMaterialRate: (rate: Omit<MaterialRate, 'id'>) => void;
  onRemoveMaterialRate: (id: string) => void;
}

const VendorRatesPanel: React.FC<VendorRatesPanelProps> = ({
  vendor,
  activityRates,
  materialRates,
  onAddActivityRate,
  onRemoveActivityRate,
  onAddMaterialRate,
  onRemoveMaterialRate,
}) => {
  const [activeTab, setActiveTab] = useState<'activities' | 'materials'>('activities');
  const [regionFilter, setRegionFilter] = useState('');

  // Form states
  const [newActivity, setNewActivity] = useState({ activity: '', unit: '', rate: 0, region: vendor.region || '' });
  const [newMaterial, setNewMaterial] = useState({ material: '', unit: '', rate: 0, region: vendor.region || '' });

  const filteredActivities = activityRates.filter(r => 
    r.region.toLowerCase().includes(regionFilter.toLowerCase()) ||
    r.activity.toLowerCase().includes(regionFilter.toLowerCase())
  );

  const filteredMaterials = materialRates.filter(r => 
    r.region.toLowerCase().includes(regionFilter.toLowerCase()) ||
    r.material.toLowerCase().includes(regionFilter.toLowerCase())
  );

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    onAddActivityRate({ ...newActivity, vendorId: vendor.id });
    setNewActivity({ ...newActivity, activity: '', rate: 0 });
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMaterialRate({ ...newMaterial, vendorId: vendor.id });
    setNewMaterial({ ...newMaterial, material: '', rate: 0 });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Regional Rate Management</h3>
            <p className="text-sm text-gray-500">Define your service and material costs per region.</p>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'activities' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Hammer size={14} /> Activities
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'materials' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package size={14} /> Materials
            </button>
          </div>
        </div>

        {/* Global Search/Filter */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by region or item name..."
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
          />
        </div>

        {/* Form to Add New */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8">
           <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
             <Plus size={16} className="text-orange-600" />
             Add New {activeTab === 'activities' ? 'Activity Rate' : 'Material Rate'}
           </h4>
           <form 
            onSubmit={activeTab === 'activities' ? handleAddActivity : handleAddMaterial}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
           >
              <input
                type="text"
                placeholder={activeTab === 'activities' ? "e.g. Painting" : "e.g. Cement"}
                value={activeTab === 'activities' ? newActivity.activity : newMaterial.material}
                onChange={(e) => activeTab === 'activities' 
                  ? setNewActivity({ ...newActivity, activity: e.target.value })
                  : setNewMaterial({ ...newMaterial, material: e.target.value })
                }
                className="p-2 border border-gray-200 rounded-md text-sm outline-none"
                required
              />
              <input
                type="text"
                placeholder="Unit (e.g. sqft, kg)"
                value={activeTab === 'activities' ? newActivity.unit : newMaterial.unit}
                onChange={(e) => activeTab === 'activities'
                  ? setNewActivity({ ...newActivity, unit: e.target.value })
                  : setNewMaterial({ ...newMaterial, unit: e.target.value })
                }
                className="p-2 border border-gray-200 rounded-md text-sm outline-none"
                required
              />
              <input
                type="number"
                placeholder="Rate (₹)"
                value={activeTab === 'activities' ? newActivity.rate : newMaterial.rate}
                onChange={(e) => activeTab === 'activities'
                  ? setNewActivity({ ...newActivity, rate: parseFloat(e.target.value) || 0 })
                  : setNewMaterial({ ...newMaterial, rate: parseFloat(e.target.value) || 0 })
                }
                className="p-2 border border-gray-200 rounded-md text-sm outline-none"
                required
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Region"
                  value={activeTab === 'activities' ? newActivity.region : newMaterial.region}
                  onChange={(e) => activeTab === 'activities'
                    ? setNewActivity({ ...newActivity, region: e.target.value })
                    : setNewMaterial({ ...newMaterial, region: e.target.value })
                  }
                  className="p-2 border border-gray-200 rounded-md text-sm outline-none flex-1"
                  required
                />
                <button 
                  type="submit"
                  className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
           </form>
        </div>

        {/* List Tables */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">{activeTab === 'activities' ? 'Activity Description' : 'Material Name'}</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Rate</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(activeTab === 'activities' ? filteredActivities : filteredMaterials).map((rate) => (
                <tr key={rate.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {'activity' in rate ? rate.activity : rate.material}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{rate.unit}</td>
                  <td className="px-6 py-4 font-mono text-gray-700">₹{rate.rate}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                      <MapPin size={10} /> {rate.region}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => activeTab === 'activities' ? onRemoveActivityRate(rate.id) : onRemoveMaterialRate(rate.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {(activeTab === 'activities' ? filteredActivities : filteredMaterials).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    No records found for the current selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorRatesPanel;
