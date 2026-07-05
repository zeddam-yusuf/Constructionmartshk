import React, { useState } from 'react';
import { Vendor, ServiceType } from '../types';
import { Save, MapPin, Briefcase, Users, FileText } from 'lucide-react';

interface VendorProfileFormProps {
  vendor: Vendor;
  onUpdate: (updatedVendor: Vendor) => void;
}

const VendorProfileForm: React.FC<VendorProfileFormProps> = ({ vendor, onUpdate }) => {
  const [formData, setFormData] = useState<Partial<Vendor>>({
    region: vendor.region || '',
    experience: vendor.experience || '',
    contractTypes: vendor.contractTypes || [],
    laborStrength: vendor.laborStrength || 0,
  });

  const contractOptions = [
    'Lump Sum',
    'Item Rate',
    'Percentage Rate',
    'Cost Plus Fee',
    'Labor Only',
    'Material + Labor'
  ];

  const handleContractToggle = (type: string) => {
    const current = formData.contractTypes || [];
    if (current.includes(type)) {
      setFormData({ ...formData, contractTypes: current.filter(t => t !== type) });
    } else {
      setFormData({ ...formData, contractTypes: [...current, type] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...vendor, ...formData });
    alert('Profile updated successfully!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Briefcase className="text-orange-600" size={24} />
        Vendor Business Profile
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Region */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" /> Primary Operating Region
            </label>
            <input
              type="text"
              placeholder="e.g. Mumbai Suburban, South Delhi"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Briefcase size={16} className="text-gray-400" /> Industry Experience
            </label>
            <input
              type="text"
              placeholder="e.g. 15 Years in Civil Works"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          {/* Labor Strength */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Users size={16} className="text-gray-400" /> Total Labor Strength
            </label>
            <input
              type="number"
              min="0"
              value={formData.laborStrength}
              onChange={(e) => setFormData({ ...formData, laborStrength: parseInt(e.target.value) || 0 })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Contract Types */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FileText size={16} className="text-gray-400" /> Preferred Contract Types
          </label>
          <div className="flex flex-wrap gap-2">
            {contractOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleContractToggle(option)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  formData.contractTypes?.includes(option)
                    ? 'bg-orange-600 border-orange-600 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-black transition-colors font-bold shadow-lg"
          >
            <Save size={18} /> Update Business Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorProfileForm;
