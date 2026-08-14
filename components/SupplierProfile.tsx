import React, { useState } from 'react';
import { saveSubmission } from '../services/supabase';
import { useProfile, ProfilePrompt } from '../services/profile';
import supplierSymbolImg from '../src/assets/images/supplier_symbol_1785094473667.jpg';
import { 
  Building2, 
  MapPin, 
  Truck, 
  DollarSign, 
  Phone, 
  Mail, 
  Edit2, 
  Save, 
  XCircle,
  Award,
  Clock,
  ShieldCheck,
  TrendingUp,
  Package,
  Zap,
  Calendar,
  Users
} from 'lucide-react';

export function SupplierProfile() {
  const { user, saveProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [businessName, setBusinessName] = useState(user?.companyName || '');
  const [location, setLocation] = useState(user?.city || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [deliveryRadius, setDeliveryRadius] = useState('');
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [bio, setBio] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const [tempData, setTempData] = useState<any>(null);

  const startEdit = () => {
    setTempData({
      name,
      businessName,
      location,
      phone,
      email,
      deliveryRadius,
      minOrderValue,
      bio,
      isAvailable
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (tempData) {
      setName(tempData.name);
      setBusinessName(tempData.businessName);
      setLocation(tempData.location);
      setPhone(tempData.phone);
      setEmail(tempData.email);
      setDeliveryRadius(tempData.deliveryRadius);
      setMinOrderValue(tempData.minOrderValue);
      setBio(tempData.bio);
      setIsAvailable(tempData.isAvailable);
    }
    setIsEditing(false);
  };

  const saveEdit = async () => {
    setIsEditing(false);
    await saveProfile({ name, phone, email, city: location, companyName: businessName, category: user?.category || 'Material Supplier' });
    const updatedProfile = {
      id: `supplier-profile-rajesh`,
      fullName: name,
      email: email,
      mobile: phone,
      role: 'MATERIAL_SUPPLIER',
      category: 'Material Supplier',
      companyName: businessName,
      city: location,
      bio: bio,
      deliveryRadius: deliveryRadius,
      minOrderValue: `₹${minOrderValue}`,
      isAvailable: isAvailable,
      status: 'Updated Profile',
      updated_at: new Date().toISOString()
    };
    await saveSubmission('registration', updatedProfile);
    alert('🎉 Supplier profile changes saved and synchronized live with Supabase!');
  };

  return (
    <div id="supplier-profile-container" className="space-y-6">
      <ProfilePrompt
        name={name}
        phone={phone}
        city={location}
        company={businessName}
        email={email}
        onEdit={() => { startEdit(); }}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Material Supplier Profile</h2>
          <p className="text-xs text-gray-500 mt-1">Manage wholesale trading details, logistics capabilities, and delivery parameters.</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={cancelEdit}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <XCircle size={14} /> Cancel
              </button>
              <button 
                onClick={saveEdit}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-sm shadow-orange-100"
              >
                <Save size={14} /> Save Profile
              </button>
            </>
          ) : (
            <button 
              onClick={startEdit}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-sm shadow-orange-100"
            >
              <Edit2 size={14} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card View */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-orange-400 bg-orange-950/80 border border-orange-500/20 px-2.5 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                <Truck size={10} /> Certified Supplier
              </span>
              <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isAvailable ? 'bg-green-950 text-green-400 border border-green-500/20' : 'bg-red-950 text-red-400 border border-red-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                {isAvailable ? 'Dispatch Ready' : 'Fleet Busy'}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500/50 shadow-md shrink-0">
                <img src={supplierSymbolImg} alt="Supplier Symbol" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-lg font-bold flex items-center gap-1.5">
                  {businessName}
                  <ShieldCheck size={18} className="text-orange-500 shrink-0" aria-label="Verified Trade Business" />
                </h4>
                <p className="text-xs text-slate-400 font-medium">Prop: {name}</p>
              </div>
            </div>

            {/* Rates Banner */}
            <div className="mt-6 p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1"><Package size={13} className="text-orange-500" /> Min. Order Value:</span>
                <span className="text-base font-black text-orange-400">₹{minOrderValue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 flex items-center gap-1"><Truck size={13} className="text-orange-500" /> Dispatch Fleet:</span>
                <span className="text-xs font-black text-white">8 Vehicles active</span>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 pt-1">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><Award size={12} className="text-orange-500" /> Platform Rating:</span>
                <span className="font-bold text-orange-400">⭐ 4.85 (120+ supply cycles)</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><Clock size={12} className="text-orange-500" /> Dispatch Time:</span>
                <span className="font-bold">Within 24 Hours</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><MapPin size={12} className="text-orange-500" /> Delivery Area:</span>
                <span className="font-bold truncate max-w-[140px]" title={deliveryRadius}>{deliveryRadius}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 mt-6 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Phone size={13} className="text-orange-500" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 overflow-hidden text-ellipsis">
              <Mail size={13} className="text-orange-500" />
              <span className="truncate">{email}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Detail Editor / Viewer */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-6">
          {isEditing ? (
            /* Editing State Form */
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-sm pb-2 border-b border-gray-100">Configure Supplier parameters</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Business Name</label>
                  <input 
                    type="text" 
                    value={businessName} 
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Proprietor Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Yard Location / HQ</label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Radius</label>
                  <input 
                    type="text" 
                    value={deliveryRadius} 
                    onChange={(e) => setDeliveryRadius(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Rate configuration */}
              <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-orange-950 mb-1">Minimum Order Value (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-xs">₹</span>
                    <input 
                      type="number" 
                      value={minOrderValue} 
                      onChange={(e) => setMinOrderValue(Number(e.target.value))}
                      className="w-full text-xs pl-7 pr-3 py-2.5 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>
                  <p className="text-[10px] text-orange-800 mt-1">Typical wholesale MOQ range: ₹10,000 - ₹50,000</p>
                </div>
                <div className="flex items-center pt-6">
                  <input 
                    type="checkbox" 
                    id="availability"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-2"
                  />
                  <label htmlFor="availability" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                    Fleet active and ready for dispatch today
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Contact</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Business Bio / Materials focus</label>
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none resize-none"
                />
              </div>
            </div>
          ) : (
            /* Viewer State details */
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-800 text-sm pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Package size={16} className="text-orange-500" />
                  About Materials & Fleet Capabilities
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2.5">{bio}</p>
              </div>

              {/* Verified Badge and Compliance */}
              <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
                <Award size={20} className="text-orange-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                    ConSmart Gold Material Supplier Badge
                    <span className="bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">Verified</span>
                  </h4>
                  <p className="text-[11px] text-orange-900 leading-relaxed">
                    This yard has verified stock availability pipelines. ConSmart site engineers can place instant inquiries which will automatically populate your order catalog. No external broker fees.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5"><Truck size={14} className="text-orange-500" /> Logistics Support</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Equipped with integrated GPS-monitored trucks. Instant material tracking link sent via ConSmart WhatsApp alerts on dispatch.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5"><TrendingUp size={14} className="text-orange-500" /> Payment & Credit Terms</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Supports ConSmart Escrow structure, LC (Letter of Credit), and standard Net-30 payment structures for recurring contractors.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
