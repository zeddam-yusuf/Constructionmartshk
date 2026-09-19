import React, { useState } from 'react';
import { saveSubmission } from '../services/supabase';
import { useProfile, ProfilePrompt } from '../services/profile';
import labourSymbolImg from '../src/assets/images/labour_symbol_1785094461353.jpg';
import { 
  User, 
  MapPin, 
  Star, 
  Award, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  Edit2,
  Save,
  XCircle
} from 'lucide-react';

export function LabourProfile() {
  const { user, saveProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [category, setCategory] = useState(user?.category || '');
  const [specialty, setSpecialty] = useState('');
  const [baseRate, setBaseRate] = useState(0);
  const [overtimeRate, setOvertimeRate] = useState(0);
  const [experience, setExperience] = useState(user?.experience || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newCert, setNewCert] = useState('');
  const [certificates, setCertificates] = useState<string[]>([]);

  const [tempData, setTempData] = useState<any>(null);

  const startEdit = () => {
    setTempData({
      name,
      category,
      specialty,
      baseRate,
      overtimeRate,
      experience,
      phone,
      email,
      bio,
      isAvailable,
      skills: [...skills],
      certificates: [...certificates]
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (tempData) {
      setName(tempData.name);
      setCategory(tempData.category);
      setSpecialty(tempData.specialty);
      setBaseRate(tempData.baseRate);
      setOvertimeRate(tempData.overtimeRate);
      setExperience(tempData.experience);
      setPhone(tempData.phone);
      setEmail(tempData.email);
      setBio(tempData.bio);
      setIsAvailable(tempData.isAvailable);
      setSkills(tempData.skills);
      setCertificates(tempData.certificates);
    }
    setIsEditing(false);
  };

  const saveEdit = async () => {
    setIsEditing(false);
    await saveProfile({ name, phone, email, category, experience, charges: baseRate ? `₹${baseRate}/day` : undefined });
    const updatedProfile = {
      id: user?.id || `labour-profile-${phone || Date.now()}`,
      fullName: name,
      email: email,
      mobile: phone,
      role: 'LABOUR',
      category: category,
      specialty: specialty,
      experience: experience,
      charges: `₹${baseRate}/day`,
      bio: bio,
      isAvailable: isAvailable,
      skills: skills,
      certificates: certificates,
      status: 'Updated Profile',
      updated_at: new Date().toISOString()
    };
    await saveSubmission('registration', updatedProfile);
    alert('🎉 Profile changes saved and synchronized live with Supabase!');
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddCert = () => {
    if (newCert.trim() && !certificates.includes(newCert.trim())) {
      setCertificates([...certificates, newCert.trim()]);
      setNewCert('');
    }
  };

  const handleRemoveCert = (certToRemove: string) => {
    setCertificates(certificates.filter(c => c !== certToRemove));
  };

  return (
    <div id="labour-profile-container" className="space-y-6">
      <ProfilePrompt
        name={name}
        phone={phone}
        city={user?.city || ''}
        company={user?.companyName}
        email={email}
        onEdit={() => { startEdit(); }}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Labour Profile</h2>
          <p className="text-xs text-gray-500 mt-1">Manage your active working parameters, trade rates, and availability.</p>
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
          {/* Subtle background orange mesh effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-orange-400 bg-orange-950/80 border border-orange-500/20 px-2.5 py-1 rounded uppercase tracking-wider">
                {category}
              </span>
              <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isAvailable ? 'bg-green-950 text-green-400 border border-green-500/20' : 'bg-red-950 text-red-400 border border-red-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                {isAvailable ? 'Available Now' : 'Occupied'}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500/50 shadow-md shrink-0">
                <img src={labourSymbolImg} alt="Labour Symbol" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-lg font-bold flex items-center gap-1.5">
                  {name}
                  <ShieldCheck size={18} className="text-orange-500 shrink-0" aria-label="Verified Worker Profile" />
                </h4>
                <p className="text-xs text-slate-400 font-medium">{specialty}</p>
              </div>
            </div>

            {/* Rates Banner */}
            <div className="mt-6 p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1"><DollarSign size={13} className="text-orange-500" /> Base Daily Rate:</span>
                <span className="text-base font-black text-orange-400">₹{baseRate} <span className="text-[10px] text-slate-400 font-normal">/ 8h shift</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={13} className="text-orange-500" /> Overtime Hourly:</span>
                <span className="text-xs font-black text-white">₹{overtimeRate} <span className="text-[10px] text-slate-400 font-normal">/ hour</span></span>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 pt-1">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><Star size={12} className="text-orange-500" /> Rating:</span>
                <span className="font-bold text-orange-400">⭐ 4.9 (44 verified shifts)</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><Briefcase size={12} className="text-orange-500" /> Experience:</span>
                <span className="font-bold">{experience}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><MapPin size={12} className="text-orange-500" /> Preferred Region:</span>
                <span className="font-bold">Mumbai Region</span>
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
              <h3 className="font-bold text-gray-800 text-sm pb-2 border-b border-gray-100">Configure Professional Parameters</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Trade Category</label>
                  <input 
                    type="text" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Specialty Skills</label>
                  <input 
                    type="text" 
                    value={specialty} 
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Years of Experience</label>
                  <input 
                    type="text" 
                    value={experience} 
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Rate configuration */}
              <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-orange-950 mb-1">Daily Base Rate (₹ per 8 hrs)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-xs">₹</span>
                    <input 
                      type="number" 
                      value={baseRate} 
                      onChange={(e) => setBaseRate(Number(e.target.value))}
                      className="w-full text-xs pl-7 pr-3 py-2.5 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>
                  <p className="text-[10px] text-orange-800 mt-1">Average market standard: ₹800 - ₹1,200</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-orange-950 mb-1">Overtime Hourly Rate (₹ / hr)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-xs">₹</span>
                    <input 
                      type="number" 
                      value={overtimeRate} 
                      onChange={(e) => setOvertimeRate(Number(e.target.value))}
                      className="w-full text-xs pl-7 pr-3 py-2.5 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>
                  <p className="text-[10px] text-orange-800 mt-1">Typical overtime multiplier: 1.5x of hourly rate</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Contact</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Professional Bio</label>
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="availability"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="availability" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                  Check if you are actively looking for immediate dispatch / shifts today
                </label>
              </div>
            </div>
          ) : (
            /* Viewer State details */
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-800 text-sm pb-2 border-b border-gray-100 flex items-center gap-2">
                  <User size={16} className="text-orange-500" />
                  About Professional Worker
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2.5">{bio}</p>
              </div>

              {/* Verified Badge and Compliance */}
              <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
                <Award size={20} className="text-orange-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                    Verified ConSmart Skilled Professional Badge
                    <span className="bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">Active</span>
                  </h4>
                  <p className="text-[11px] text-orange-900 leading-relaxed">
                    This profile holds verified National Skill certificates. All listed daily rates (₹{baseRate}/day) represent legal fair-wage compliance metrics matching premium site benchmarks.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Skills Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center justify-between border-b border-gray-100 pb-2">
                    <span>Expertise & Certified Skills</span>
                    <span className="text-[10px] text-gray-400 font-normal">{skills.length} skills total</span>
                  </h4>

                  {isEditing ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Add skill..." 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="flex-1 text-xs p-1.5 border border-gray-200 rounded"
                      />
                      <button 
                        onClick={handleAddSkill}
                        className="p-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-gray-200 flex items-center gap-1">
                        {skill}
                        {isEditing && (
                          <button onClick={() => handleRemoveSkill(skill)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={10} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center justify-between border-b border-gray-100 pb-2">
                    <span>Certificates & Government IDs</span>
                    <span className="text-[10px] text-gray-400 font-normal">{certificates.length} verified</span>
                  </h4>

                  {isEditing ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Add certificate..." 
                        value={newCert}
                        onChange={(e) => setNewCert(e.target.value)}
                        className="flex-1 text-xs p-1.5 border border-gray-200 rounded"
                      />
                      <button 
                        onClick={handleAddCert}
                        className="p-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>
                  ) : null}

                  <ul className="space-y-2">
                    {certificates.map((cert, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <CheckCircle size={14} className="text-orange-500 shrink-0 mt-0.5" />
                        <div className="flex justify-between items-start w-full">
                          <span>{cert}</span>
                          {isEditing && (
                            <button onClick={() => handleRemoveCert(cert)} className="text-red-500 hover:text-red-700 shrink-0 ml-1 mt-0.5">
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
