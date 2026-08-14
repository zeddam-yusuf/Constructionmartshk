import React, { useState } from 'react';
import { saveSubmission } from '../services/supabase';
import { useProfile, ProfilePrompt } from '../services/profile';
import vendorSymbolImg from '../src/assets/images/vendor_symbol_1785094447958.jpg';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Phone, 
  Mail, 
  Edit2, 
  Save, 
  XCircle,
  Award,
  Users,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react';

export function VendorProfile() {
  const { user, saveProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [location, setLocation] = useState(user?.city || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [experience, setExperience] = useState(user?.experience || '');
  const [laborStrength, setLaborStrength] = useState(45);
  const [contractTypes, setContractTypes] = useState(['Lump Sum', 'Item Rate', 'Labor Only', 'Material + Labor']);
  const [bio, setBio] = useState('');

  const [tempData, setTempData] = useState<any>(null);

  const contractOptions = [
    'Lump Sum',
    'Item Rate',
    'Percentage Rate',
    'Cost Plus Fee',
    'Labor Only',
    'Material + Labor'
  ];

  const handleContractToggle = (type: string) => {
    if (contractTypes.includes(type)) {
      setContractTypes(contractTypes.filter(t => t !== type));
    } else {
      setContractTypes([...contractTypes, type]);
    }
  };

  const startEdit = () => {
    setTempData({
      name,
      companyName,
      location,
      phone,
      email,
      experience,
      laborStrength,
      contractTypes: [...contractTypes],
      bio
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (tempData) {
      setName(tempData.name);
      setCompanyName(tempData.companyName);
      setLocation(tempData.location);
      setPhone(tempData.phone);
      setEmail(tempData.email);
      setExperience(tempData.experience);
      setLaborStrength(tempData.laborStrength);
      setContractTypes(tempData.contractTypes);
      setBio(tempData.bio);
    }
    setIsEditing(false);
  };

  const saveEdit = async () => {
    setIsEditing(false);
    await saveProfile({ name, phone, email, city: location, companyName, experience });
    const updatedProfile = {
      id: `vendor-profile-vikram`,
      fullName: name,
      email: email,
      mobile: phone,
      role: 'VENDOR',
      category: 'Contractor',
      experience: experience,
      companyName: companyName,
      city: location,
      bio: bio,
      laborStrength: laborStrength,
      contractTypes: contractTypes,
      status: 'Updated Profile',
      updated_at: new Date().toISOString()
    };
    await saveSubmission('registration', updatedProfile);
    alert('🎉 Business profile changes saved and synchronized live with Supabase!');
  };

  return (
    <div id="vendor-profile-container" className="space-y-6">
      <ProfilePrompt
        name={name}
        phone={phone}
        city={location}
        company={companyName}
        email={email}
        onEdit={() => { startEdit(); }}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Vendor Business Profile</h2>
          <p className="text-xs text-gray-500 mt-1">Manage your contracting firm parameters, active workers capacity, and accepted contract structures.</p>
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
                <Building2 size={10} /> Contracting Firm
              </span>
              <span className="bg-green-950 text-green-400 border border-green-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Accepting Bids
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500/50 shadow-md shrink-0">
                <img src={vendorSymbolImg} alt="Vendor Symbol" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-lg font-bold flex items-center gap-1.5">
                  {companyName}
                  <ShieldCheck size={18} className="text-orange-500 shrink-0" aria-label="Verified Grade-A Contractor" />
                </h4>
                <p className="text-xs text-slate-400 font-medium">Lead: {name}</p>
              </div>
            </div>

            {/* Quick stats box */}
            <div className="mt-6 p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Bids</span>
                <span className="text-sm font-black text-white">14 Sent</span>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Workforce</span>
                <span className="text-sm font-black text-orange-400">{laborStrength} pax</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Exp</span>
                <span className="text-sm font-black text-white">{experience}</span>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 pt-1">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><Award size={12} className="text-orange-500" /> Platform Rating:</span>
                <span className="font-bold text-orange-400">⭐ 4.90 (28 active sites)</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><Users size={12} className="text-orange-500" /> Crew Capacity:</span>
                <span className="font-bold text-white">{laborStrength} active builders</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><MapPin size={12} className="text-orange-500" /> Head Office:</span>
                <span className="font-bold truncate max-w-[140px]" title={location}>{location}</span>
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
              <h3 className="font-bold text-gray-800 text-sm pb-2 border-b border-gray-100">Configure Contractor Profile</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Company / Firm Name</label>
                  <input 
                    type="text" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Lead Partner / Proprietor</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Office Location</label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Firm Experience</label>
                  <input 
                    type="text" 
                    value={experience} 
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Crew Workforce Capacity (pax)</label>
                  <input 
                    type="number" 
                    value={laborStrength} 
                    onChange={(e) => setLaborStrength(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Contact</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Preferred Contract Types */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Accepted Contract Structures</label>
                <div className="flex flex-wrap gap-2">
                  {contractOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleContractToggle(option)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        contractTypes.includes(option)
                          ? 'bg-orange-600 border-orange-600 text-white'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Company bio / Core focus</label>
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
                  <Briefcase size={16} className="text-orange-500" />
                  Contracting Focus & Technical Bio
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2.5">{bio}</p>
              </div>

              {/* Contract Options Tags */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 mb-2">Billing & Contract Preferences</h4>
                <div className="flex flex-wrap gap-1.5">
                  {contractTypes.map((type, index) => (
                    <span 
                      key={index} 
                      className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-orange-100"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compliance & Verification details */}
              <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
                <Users size={20} className="text-orange-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                    ConSmart Grade-A Compliance
                  </h4>
                  <p className="text-[11px] text-orange-900 leading-relaxed">
                    This company has completed extensive audits for labor compliance, ESIC/PF payouts, and structural safety parameters. Authorized to file bidding quotes across residential and commercial categories.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5"><TrendingUp size={14} className="text-orange-500" /> Capacity</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Maintains verified machinery roster including concrete mixers, scaffolding pipelines, and formwork assets.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5"><FileText size={14} className="text-orange-500" /> Bidding Authority</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Fully approved to generate binding quotations directly via ConSmart Estimation workspace.
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
