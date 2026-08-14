import React, { useState } from 'react';
import { saveSubmission } from '../services/supabase';
import { useProfile, ProfilePrompt } from '../services/profile';
import freelancerSymbolImg from '../src/assets/images/freelancer_symbol_1785171686295.jpg';
import { 
  User, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Phone, 
  Mail, 
  Edit2, 
  Save, 
  XCircle,
  Award,
  GraduationCap,
  FileText,
  Compass,
  Ruler,
  Calculator,
  Layers,
  CheckCircle2,
  Send,
  Star,
  ExternalLink,
  Building,
  HelpCircle
} from 'lucide-react';

export function FreelancerProfile() {
  const { user, saveProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState(user?.experience || '');
  const [location, setLocation] = useState(user?.city || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [consultingRate, setConsultingRate] = useState(user?.charges || '');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [availability, setAvailability] = useState('');

  // Service Request Form State
  const [clientNameInput, setClientNameInput] = useState('');
  const [clientPhoneInput, setClientPhoneInput] = useState('');
  const [serviceRequested, setServiceRequested] = useState('Drafting Plans & 3D Elevations');
  const [projectArea, setProjectArea] = useState('2,500 Sq.Ft Bungalow');
  const [notesInput, setNotesInput] = useState('');
  const [reqSubmitted, setReqSubmitted] = useState(false);

  const [tempData, setTempData] = useState<any>(null);

  const startEdit = () => {
    setTempData({
      name,
      specialty,
      experience,
      location,
      phone,
      email,
      consultingRate,
      education,
      skills,
      bio,
      availability
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (tempData) {
      setName(tempData.name);
      setSpecialty(tempData.specialty);
      setExperience(tempData.experience);
      setLocation(tempData.location);
      setPhone(tempData.phone);
      setEmail(tempData.email);
      setConsultingRate(tempData.consultingRate);
      setEducation(tempData.education);
      setSkills(tempData.skills);
      setBio(tempData.bio);
      setAvailability(tempData.availability);
    }
    setIsEditing(false);
  };

  const saveEdit = async () => {
    setIsEditing(false);
    await saveProfile({ name, phone, email, city: location, experience, charges: consultingRate, category: user?.category || 'Freelance Consultant' });
    await saveSubmission('freelancer_profile_update', {
      name,
      specialty,
      experience,
      location,
      phone,
      email,
      consultingRate,
      education,
      skills,
      bio,
      availability,
      updated_at: new Date().toISOString()
    });
  };

  const handleRequestService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientNameInput || !clientPhoneInput) return;

    await saveSubmission('freelancer_service_request', {
      freelancerName: name,
      clientName: clientNameInput,
      clientPhone: clientPhoneInput,
      serviceRequested,
      projectArea,
      notes: notesInput,
      date: new Date().toISOString()
    });

    setReqSubmitted(true);
  };

  const servicesList = [
    {
      icon: Compass,
      title: 'Plan Drafting & 3D Elevations',
      desc: 'Architectural 2D floor plans, municipal sanction drawings, section details, and photorealistic 3D front/rear elevation designs for houses, villas, & bungalows.',
      rate: '₹2.50 - ₹5.00 / Sq.Ft'
    },
    {
      icon: Ruler,
      title: 'Steel Bar Bending Schedule (BBS)',
      desc: 'Automated & optimized Rebar Cutting Lists for slabs, beams, columns, & footings to minimize structural steel wastage on site.',
      rate: '₹600 / Tonne or Per Drawing set'
    },
    {
      icon: Calculator,
      title: 'Billing & Quantity Measurement',
      desc: 'Item-rate BOQ generation, Measurement Book (MB) verification, Contractor Running Account (RA) bill auditing & material reconciliation.',
      rate: '₹1.50 / Sq.Ft or % of Bill Value'
    },
    {
      icon: FileText,
      title: 'Technical & Structural Advisory',
      desc: 'On-site technical consultation, concrete mix design advisory, soil load analysis review, & quality audit before concrete casting.',
      rate: '₹2,000 / Site Visit'
    },
    {
      icon: Layers,
      title: 'Architectural Project Consultation',
      desc: 'Vastu-compliant layouts, interior space planning, lighting & electrical line diagrams, and plumbing line elevation blueprints.',
      rate: 'Custom Lump-sum Package'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      <ProfilePrompt
        name={name}
        phone={phone}
        city={location}
        company={user?.companyName}
        email={email}
        onEdit={() => { startEdit(); }}
      />
      {/* Top Banner & Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-amber-500/80 shadow-2xl shrink-0 bg-slate-800">
                <img 
                  src={freelancerSymbolImg} 
                  alt="Freelancer Symbol" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <span className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                Verified
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{name}</h2>
                <div className="flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>4.95 (48 Reviews)</span>
                </div>
              </div>

              <p className="text-amber-400 font-bold text-sm sm:text-base mt-1 flex items-center gap-2">
                <Briefcase size={16} />
                <span>{specialty}</span>
              </p>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-zinc-300 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5 bg-zinc-800/80 px-3 py-1 rounded-lg border border-zinc-700">
                  <MapPin size={14} className="text-amber-400" />
                  {location}
                </span>
                <span className="flex items-center gap-1.5 bg-zinc-800/80 px-3 py-1 rounded-lg border border-zinc-700">
                  <Award size={14} className="text-amber-400" />
                  {experience} Experience
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {!isEditing ? (
              <button
                onClick={startEdit}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-500/25"
              >
                <Edit2 size={18} /> Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={saveEdit}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl font-bold transition-all"
                >
                  <Save size={18} /> Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all border border-zinc-700"
                >
                  <XCircle size={18} /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Edit Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bio & Professional Summary */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <User className="text-amber-600" size={20} />
              About & Technical Credentials
            </h3>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name & Title</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialty Header</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Experience</label>
                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location / City</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Overview</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Education & Certifications</label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Core Software & Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Consulting Fee Rate</label>
                  <input
                    type="text"
                    value={consultingRate}
                    onChange={(e) => setConsultingRate(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-700 text-sm leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {bio}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100/80">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">
                      <GraduationCap size={16} /> Education & Credentials
                    </div>
                    <p className="text-slate-800 text-xs font-bold">{education}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100/80">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">
                      <DollarSign size={16} /> Average Rate / Charges
                    </div>
                    <p className="text-slate-800 text-xs font-extrabold">{consultingRate}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Technical Skills & Software Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.split(',').map((s, idx) => (
                      <span key={idx} className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 rounded-xl text-xs font-bold transition-colors">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Freelance Services Offered Showcase */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Layers className="text-amber-600" size={20} />
                  Freelance Services Provided
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">High precision architectural & engineering services for developers, vendors, & bungalow owners.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {servicesList.map((srv, idx) => {
                const IconComponent = srv.icon;
                return (
                  <div key={idx} className="p-5 rounded-2xl border border-slate-150 hover:border-amber-400 hover:shadow-md transition-all bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex gap-4 items-start">
                      <div className="p-3 bg-amber-500 text-slate-950 rounded-xl shrink-0 shadow-sm mt-0.5">
                        <IconComponent size={22} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">{srv.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{srv.desc}</p>
                      </div>
                    </div>
                    <div className="shrink-0 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl text-right self-end sm:self-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Rate</span>
                      <span className="text-xs font-extrabold text-amber-700">{srv.rate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sample Work / Deliverables Portfolio */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="text-amber-600" size={20} />
              Sample Project Deliverables
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-zinc-900 text-white flex flex-col justify-between h-40 relative overflow-hidden group">
                <div className="z-10">
                  <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-bold uppercase">CAD Blueprint</span>
                  <h4 className="text-sm font-bold mt-2">2,400 Sq.Ft Bungalow Plan & 3D Front Elevation</h4>
                </div>
                <div className="flex justify-between items-center text-xs text-amber-300 font-semibold z-10">
                  <span>Baner, Pune</span>
                  <CheckCircle2 size={16} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950 to-slate-900 text-white flex flex-col justify-between h-40 relative overflow-hidden group">
                <div className="z-10">
                  <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-bold uppercase">Structural BBS</span>
                  <h4 className="text-sm font-bold mt-2">G+4 Building Steel Rebar Bending Schedule</h4>
                </div>
                <div className="flex justify-between items-center text-xs text-amber-300 font-semibold z-10">
                  <span>38 Tonne Steel</span>
                  <CheckCircle2 size={16} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-800 to-slate-900 text-white flex flex-col justify-between h-40 relative overflow-hidden group">
                <div className="z-10">
                  <span className="text-[10px] bg-sky-400 text-slate-950 px-2 py-0.5 rounded font-bold uppercase">Billing & BOQ</span>
                  <h4 className="text-sm font-bold mt-2">Contractor RA Measurement Book Verification</h4>
                </div>
                <div className="flex justify-between items-center text-xs text-amber-300 font-semibold z-10">
                  <span>₹42 Lakh Audit</span>
                  <CheckCircle2 size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Instant Booking / Consultation Request Form */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-zinc-900 to-amber-950 text-white rounded-3xl p-6 shadow-xl border border-amber-500/20 sticky top-20">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-800">
              <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold">
                <Send size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Hire Freelancer Directly</h3>
                <p className="text-xs text-zinc-400">Request plans, BBS calculation, or technical advisory</p>
              </div>
            </div>

            {reqSubmitted ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 p-5 rounded-2xl text-center space-y-3 my-4">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Service Request Sent!</h4>
                <p className="text-xs text-emerald-200">
                  Thank you! Er. Anand V. Kulkarni will review your project details and contact you within 2 hours.
                </p>
                <button
                  onClick={() => setReqSubmitted(false)}
                  className="mt-2 text-xs font-bold text-amber-400 underline hover:text-amber-300"
                >
                  Submit Another Project
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestService} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Architect Rajesh / Developer Patil"
                    value={clientNameInput}
                    onChange={(e) => setClientNameInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-800/90 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={clientPhoneInput}
                    onChange={(e) => setClientPhoneInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-800/90 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Select Required Service</label>
                  <select
                    value={serviceRequested}
                    onChange={(e) => setServiceRequested(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-800/90 border border-zinc-700 rounded-xl text-amber-300 font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="Drafting Plans & 3D Elevations">Drafting Plans & 3D Elevations</option>
                    <option value="Steel Bar Bending Schedule (BBS)">Steel Bar Bending Schedule (BBS)</option>
                    <option value="Billing & Quantity Measurement">Billing & Quantity Measurement</option>
                    <option value="Technical & Structural Consultation">Technical & Structural Consultation</option>
                    <option value="Architectural Design Advisory">Architectural Design Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Project Scale / Plot Area</label>
                  <input
                    type="text"
                    placeholder="e.g. 3,000 Sq.Ft Bungalow, G+2 Commercial"
                    value={projectArea}
                    onChange={(e) => setProjectArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-800/90 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Additional Project Details / Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="Provide plot dimensions, sanction guidelines, or specific requirements..."
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-800/90 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Send size={16} /> Submit Freelance Request
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-zinc-800 space-y-2 text-[11px] text-zinc-400">
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-amber-400" />
                <span>Direct Contact: {phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-amber-400" />
                <span>Email: {email}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FreelancerProfile;
