import React, { useState } from 'react';
import { saveSubmission } from '../services/supabase';
import { useProfile, ProfilePrompt } from '../services/profile';
import developerSymbolImg from '../src/assets/images/developer_symbol_1785094433237.jpg';
import { 
  User, 
  MapPin, 
  Building2, 
  DollarSign, 
  Phone, 
  Mail, 
  Edit2, 
  Save, 
  XCircle,
  Briefcase,
  Layers,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export function ClientProfile() {
  const { user, saveProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.companyName || '');
  const [location, setLocation] = useState(user?.city || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [budgetRange, setBudgetRange] = useState('Not set');
  const [projectTypes, setProjectTypes] = useState('Not set');
  const [bio, setBio] = useState('');

  const [tempData, setTempData] = useState<any>(null);

  const startEdit = () => {
    setTempData({
      name,
      company,
      location,
      phone,
      email,
      budgetRange,
      projectTypes,
      bio
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (tempData) {
      setName(tempData.name);
      setCompany(tempData.company);
      setLocation(tempData.location);
      setPhone(tempData.phone);
      setEmail(tempData.email);
      setBudgetRange(tempData.budgetRange);
      setProjectTypes(tempData.projectTypes);
      setBio(tempData.bio);
    }
    setIsEditing(false);
  };

  const saveEdit = async () => {
    setIsEditing(false);
    await saveProfile({ name, phone, email, city: location, companyName: company });
    const updatedProfile = {
      id: `client-profile-ankit`,
      fullName: name,
      email: email,
      mobile: phone,
      role: 'CLIENT',
      category: 'Developer',
      companyName: company,
      city: location,
      bio: bio,
      budgetRange: budgetRange,
      projectTypes: projectTypes,
      status: 'Updated Profile',
      updated_at: new Date().toISOString()
    };
    await saveSubmission('registration', updatedProfile);
    alert('🎉 Client/Developer profile changes saved and synchronized live with Supabase!');
  };

  return (
    <div id="client-profile-container" className="space-y-6">
      <ProfilePrompt
        name={name}
        phone={phone}
        city={location}
        company={company}
        email={email}
        onEdit={() => { startEdit(); }}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-sans tracking-tight">Client Account Profile</h2>
          <p className="text-xs text-gray-500 mt-1">Manage company details, operational locations, and procurement budgets.</p>
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
                <Building2 size={10} /> Prime Client
              </span>
              <span className="bg-green-950 text-green-400 border border-green-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Active Hiring
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500/50 shadow-md shrink-0">
                <img src={developerSymbolImg} alt="Developer Symbol" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-lg font-bold">{name}</h4>
                <p className="text-xs text-slate-400 font-medium truncate max-w-[170px]">{company}</p>
              </div>
            </div>

            {/* Quick stats box */}
            <div className="mt-6 p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Projects</span>
                <span className="text-sm font-black text-white">8 Listed</span>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Hired</span>
                <span className="text-sm font-black text-orange-400">5 Partners</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Spent</span>
                <span className="text-sm font-black text-white">₹18 L+</span>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 pt-1">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><DollarSign size={12} className="text-orange-500" /> Procurement limit:</span>
                <span className="font-bold text-orange-400">{budgetRange}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><Layers size={12} className="text-orange-500" /> Focus Category:</span>
                <span className="font-bold truncate max-w-[140px] text-right" title={projectTypes}>{projectTypes}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><MapPin size={12} className="text-orange-500" /> Operation HQ:</span>
                <span className="font-bold">{location}</span>
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
              <h3 className="font-bold text-gray-800 text-sm pb-2 border-b border-gray-100">Configure Client Profile</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contractor / Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Company/Firm Name</label>
                  <input 
                    type="text" 
                    value={company} 
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Operating HQ Location</label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Monthly Procurement Budget</label>
                  <input 
                    type="text" 
                    value={budgetRange} 
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Project Categories</label>
                  <input 
                    type="text" 
                    value={projectTypes} 
                    onChange={(e) => setProjectTypes(e.target.value)}
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

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">About Company / Bio</label>
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
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
                  Hiring Profile Description
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2.5">{bio}</p>
              </div>

              {/* Quality Compliance */}
              <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
                <Sparkles size={20} className="text-orange-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                    ConSmart Client Guarantee Compliance
                  </h4>
                  <p className="text-[11px] text-orange-900 leading-relaxed">
                    Verified client account holding active construction permissions. All listed requests from this company trigger instant 0%-commission processing options for contractors, ensuring clean transaction structures.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5"><TrendingUp size={14} className="text-orange-500" /> Platform Stats</h4>
                  <ul className="space-y-1.5 text-xs text-gray-600">
                    <li className="flex justify-between"><span>Active Projects:</span> <span className="font-bold text-gray-900">3 Live</span></li>
                    <li className="flex justify-between"><span>Completed Castings:</span> <span className="font-bold text-gray-900">5 Finished</span></li>
                    <li className="flex justify-between"><span>Instant Labours Booked:</span> <span className="font-bold text-gray-900">12 Workers</span></li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5"><Building2 size={14} className="text-orange-500" /> Registered HQ</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Office Suite 410, Sunrise Heights, Link Road, Andheri West, Mumbai, MH - 400053.
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
