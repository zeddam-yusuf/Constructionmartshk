import React, { useState } from 'react';
import { saveSubmission } from '../services/supabase';
import pmcSymbolImg from '../src/assets/images/pmc_symbol_1785866168151.jpg';
import { 
  User, 
  MapPin, 
  Briefcase, 
  Phone, 
  Mail, 
  Edit2, 
  Save, 
  XCircle,
  Award,
  GraduationCap,
  FileText,
  CheckCircle2,
  Send,
  Star,
  Building,
  ShieldCheck,
  ClipboardList,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  Search,
  Plus,
  ChevronRight,
  FileCheck
} from 'lucide-react';

interface AuditSnag {
  id: string;
  location: string;
  trade: string;
  issue: string;
  severity: 'Critical' | 'Moderate' | 'Minor';
  status: 'Open' | 'Resolved';
  date: string;
}

const INITIAL_SNAGS: AuditSnag[] = [
  { id: 'SNAG-101', location: 'Tower B - 8th Floor Slab', trade: 'RCC Reinforcement', issue: 'Cover blocks missing in bottom reinforcement mesh. 40mm cover required.', severity: 'Critical', status: 'Open', date: 'Today, 09:30 AM' },
  { id: 'SNAG-102', location: 'Wing A - 4th Floor Flat 402', trade: 'Masonry & Plaster', issue: 'Chicken mesh missing at RCC-AAC block joint before plastering.', severity: 'Moderate', status: 'Open', date: 'Yesterday' },
  { id: 'SNAG-103', location: 'Podium 2 - Retaining Wall', trade: 'Waterproofing', issue: 'Ponding test completed successfully for 72 hrs. No seepage observed.', severity: 'Minor', status: 'Resolved', date: '2 days ago' }
];

export function PMCProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState('Apex Infra Project Management Consultants (PMC)');
  const [leadConsultant, setLeadConsultant] = useState('Er. Rajeshwar M. Sharma');
  const [specialty, setSpecialty] = useState('Senior Civil PMC & Quality Audit Lead');
  const [experience, setExperience] = useState('16+ Years');
  const [location, setLocation] = useState('Mumbai, Navi Mumbai & MMR Region');
  const [phone, setPhone] = useState('+91 98205 11980');
  const [email, setEmail] = useState('contact@apexinfrapmc.com');
  const [reraNo, setReraNo] = useState('MAHARERA / PMC / 2021 / 00942');
  const [consultingRate, setConsultingRate] = useState('₹1.25 - ₹2.50 / Sq.Ft of Built-up Area or Monthly Retainer');
  const [education, setEducation] = useState('M.Tech (Construction Management) - IIT Bombay | PMP® Certified | Lead Auditor ISO 9001:2015');
  const [skills, setSkills] = useState('Site Quality Assurance (QA/QC), Contractor RA Bill Verification, BOQ & Cost Control, Primavera P6 / MS Project Scheduling, Structural Safety Audits, Snag List Clearance');
  const [bio, setBio] = useState('Apex Infra PMC delivers comprehensive project management consultancy services for real estate developers, society redevelopments, high-rise residential towers, and commercial infrastructure. Our specialized engineers supervise daily site execution, verify contractor measurement sheets (MB), conduct stringent cube compressive tests, and ensure projects finish on schedule with zero tolerance for structural defects.');
  const [activeProjectsCount, setActiveProjectsCount] = useState(8);
  const [totalSupervisedArea, setTotalSupervisedArea] = useState('4.2 Million Sq.Ft');

  // Snag list state
  const [snags, setSnags] = useState<AuditSnag[]>(INITIAL_SNAGS);
  const [showAddSnag, setShowAddSnag] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [newTrade, setNewTrade] = useState('RCC Reinforcement');
  const [newIssue, setNewIssue] = useState('');
  const [newSeverity, setNewSeverity] = useState<'Critical' | 'Moderate' | 'Minor'>('Moderate');

  // Request PMC form
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientProject, setClientProject] = useState('Residential High-Rise Tower');
  const [serviceType, setServiceType] = useState('Full Project PMC & Site Supervision');
  const [reqSent, setReqSent] = useState(false);

  const [tempData, setTempData] = useState<any>(null);

  const startEdit = () => {
    setTempData({
      companyName,
      leadConsultant,
      specialty,
      experience,
      location,
      phone,
      email,
      reraNo,
      consultingRate,
      education,
      skills,
      bio,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (tempData) {
      setCompanyName(tempData.companyName);
      setLeadConsultant(tempData.leadConsultant);
      setSpecialty(tempData.specialty);
      setExperience(tempData.experience);
      setLocation(tempData.location);
      setPhone(tempData.phone);
      setEmail(tempData.email);
      setReraNo(tempData.reraNo);
      setConsultingRate(tempData.consultingRate);
      setEducation(tempData.education);
      setSkills(tempData.skills);
      setBio(tempData.bio);
    }
    setIsEditing(false);
  };

  const saveEdit = async () => {
    setIsEditing(false);
    await saveSubmission('pmc_profile_update', {
      companyName,
      leadConsultant,
      specialty,
      experience,
      location,
      phone,
      email,
      reraNo,
      consultingRate,
      education,
      skills,
      bio,
      updated_at: new Date().toISOString()
    });
  };

  const handleAddSnag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation || !newIssue) return;

    const snagItem: AuditSnag = {
      id: `SNAG-${Date.now().toString().slice(-4)}`,
      location: newLocation,
      trade: newTrade,
      issue: newIssue,
      severity: newSeverity,
      status: 'Open',
      date: 'Just now'
    };

    setSnags([snagItem, ...snags]);
    setNewLocation('');
    setNewIssue('');
    setShowAddSnag(false);
  };

  const handleRequestPMC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    await saveSubmission('pmc_consultation_request', {
      pmcFirm: companyName,
      clientName,
      clientPhone,
      clientProject,
      serviceType,
      date: new Date().toISOString()
    });

    setReqSent(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-100/50 via-amber-50/20 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-slate-900 ring-2 ring-orange-500 shrink-0">
                <img 
                  src={pmcSymbolImg} 
                  alt="PMC Consultant" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified RERA PMC">
                <ShieldCheck size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-orange-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Verified PMC
                </span>
                <span className="bg-slate-900 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Award size={12} /> RERA Approved
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Star size={13} fill="currentColor" /> 4.98 (52 Audit Projects)
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-2 pt-2">
                  <input 
                    type="text" 
                    value={companyName} 
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full text-lg font-black bg-orange-50 border border-orange-200 rounded-xl px-3 py-1 text-gray-900 focus:outline-none"
                    placeholder="PMC Firm Name"
                  />
                  <input 
                    type="text" 
                    value={leadConsultant} 
                    onChange={e => setLeadConsultant(e.target.value)}
                    className="w-full text-sm font-bold bg-orange-50 border border-orange-200 rounded-xl px-3 py-1 text-gray-700 focus:outline-none"
                    placeholder="Lead Consultant Name"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {companyName}
                  </h1>
                  <p className="text-sm font-bold text-orange-700 flex items-center gap-1.5">
                    <User size={14} /> Head: {leadConsultant} — <span className="text-gray-600 font-medium">{specialty}</span>
                  </p>
                </>
              )}

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin size={13} className="text-orange-600 shrink-0" />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)}
                      className="bg-orange-50 border border-orange-200 rounded-lg px-2 py-0.5 text-xs text-gray-800"
                    />
                  ) : location}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Briefcase size={13} className="text-orange-600 shrink-0" />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={experience} 
                      onChange={e => setExperience(e.target.value)}
                      className="bg-orange-50 border border-orange-200 rounded-lg px-2 py-0.5 text-xs text-gray-800 w-24"
                    />
                  ) : `${experience} Track Record`}
                </span>
                <span className="flex items-center gap-1 font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={reraNo} 
                      onChange={e => setReraNo(e.target.value)}
                      className="bg-white border rounded px-1.5 py-0.5 text-[11px]"
                    />
                  ) : reraNo}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2 shrink-0">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                >
                  <Save size={14} /> Save Profile
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all"
                >
                  <XCircle size={14} /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={startEdit}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-orange-500 text-gray-700 hover:text-orange-600 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Edit2 size={13} /> Edit Profile Data
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2 pt-2 text-right">
              <div>
                <span className="block text-[10px] font-extrabold uppercase text-gray-400">Total Supervised Area</span>
                <span className="text-sm font-black text-gray-900 font-mono">{totalSupervisedArea}</span>
              </div>
              <div className="h-8 w-px bg-gray-200 mx-1" />
              <div>
                <span className="block text-[10px] font-extrabold uppercase text-gray-400">Active Live Sites</span>
                <span className="text-sm font-black text-orange-600 font-mono">{activeProjectsCount} Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core PMC Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-2 hover:border-orange-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black">
            <ClipboardList size={22} />
          </div>
          <h3 className="text-sm font-black text-gray-900">1) Daily Progress (DPR) & Site Logs</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Deployment of resident site civil engineers for daily material intake, labour headcount verification, concrete pour logs, and photographic progress reporting.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-2 hover:border-orange-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
            <ShieldCheck size={22} />
          </div>
          <h3 className="text-sm font-black text-gray-900">2) Quality Assurance (QA/QC)</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Concrete cube 7/28-day testing verification, slump checks, steel tensile test reports, waterproofing ponding tests, and rebar lap length inspections.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-2 hover:border-orange-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
            <FileCheck size={22} />
          </div>
          <h3 className="text-sm font-black text-gray-900">3) RA Bill Verification & BOQ Audit</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Independent Measurement Book (MB) physical audit, item-rate verification against approved tender, extra item analysis, and deduction reconciliations.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-2 hover:border-orange-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
            <Clock size={22} />
          </div>
          <h3 className="text-sm font-black text-gray-900">4) Timeline & Schedule Optimization</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Critical Path Method (CPM) milestone tracking, contractor bottleneck resolution, weather delay mitigation, and weekly master timeline reviews.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-2 hover:border-orange-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
            <AlertTriangle size={22} />
          </div>
          <h3 className="text-sm font-black text-gray-900">5) Safety & Statutory Compliance</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            OSHA safety audits, helmet/harness compliance, crane third-party inspections (TPI), electrical earthing checks, and local municipal fire safety adherence.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-2 hover:border-orange-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
            <Layers size={22} />
          </div>
          <h3 className="text-sm font-black text-gray-900">6) Snagging & Project Handover</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Room-by-room architectural snag list creation, defect liability monitoring, as-built drawing verification, and society/developer handover dossiers.
          </p>
        </div>
      </div>

      {/* Interactive Quality Snag Audit Module & Consultation Request Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Live Snagging & Quality Audit Register */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-gray-150 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mb-1">
                <ShieldCheck size={11} /> PMC Inspection Suite
              </div>
              <h2 className="text-lg font-black text-gray-900">Active Site Snags & Quality Register</h2>
              <p className="text-xs text-gray-500">Live quality non-conformance reports (NCR) monitored across current client towers.</p>
            </div>

            <button
              onClick={() => setShowAddSnag(!showAddSnag)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black transition-all shadow-sm active:scale-95 shrink-0"
            >
              <Plus size={15} /> Log New Inspection Snag
            </button>
          </div>

          {/* Add Snag Form */}
          {showAddSnag && (
            <form onSubmit={handleAddSnag} className="bg-slate-50 border border-orange-200/80 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top duration-200">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-orange-600" /> New Quality Snag Entry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Location / Tower & Floor *</label>
                  <input 
                    type="text" 
                    required
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    placeholder="e.g. Tower C, 14th Floor Column C4"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Trade Category</label>
                  <select
                    value={newTrade}
                    onChange={e => setNewTrade(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="RCC Reinforcement">RCC Reinforcement / Formwork</option>
                    <option value="Concrete Pouring">Concrete Quality & Slump</option>
                    <option value="Masonry & Plaster">Masonry, Plaster & Joint Mesh</option>
                    <option value="Waterproofing">Waterproofing & Ponding</option>
                    <option value="MEP & Drainage">MEP, Piping & Electrical Conduit</option>
                    <option value="Finishing & Tiling">Tiling, Flooring & Railings</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Defect Description / PMC Observation *</label>
                <textarea 
                  required
                  rows={2}
                  value={newIssue}
                  onChange={e => setNewIssue(e.target.value)}
                  placeholder="Specify deviation from IS specifications, missing cover, honeycomb, or poor plumb..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase">Severity:</span>
                  {(['Critical', 'Moderate', 'Minor'] as const).map(sev => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setNewSeverity(sev)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                        newSeverity === sev 
                          ? sev === 'Critical' ? 'bg-red-600 text-white' : sev === 'Moderate' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                          : 'bg-white border text-gray-600'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddSnag(false)} 
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-xs"
                  >
                    Save Snag
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Snag List Items */}
          <div className="space-y-3">
            {snags.map(snag => (
              <div 
                key={snag.id} 
                className={`p-4 rounded-2xl border transition-all ${
                  snag.status === 'Resolved' 
                    ? 'bg-emerald-50/30 border-emerald-100 opacity-80' 
                    : snag.severity === 'Critical' 
                      ? 'bg-red-50/30 border-red-200' 
                      : 'bg-slate-50 border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-2xs">
                      {snag.id}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                      snag.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      snag.severity === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {snag.severity}
                    </span>
                    <span className="text-xs font-bold text-gray-700">{snag.trade}</span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-[10px] text-gray-400">{snag.date}</span>
                    <button
                      onClick={() => {
                        setSnags(snags.map(s => s.id === snag.id ? { ...s, status: s.status === 'Open' ? 'Resolved' : 'Open' } : s));
                      }}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-all ${
                        snag.status === 'Resolved' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                      }`}
                    >
                      {snag.status === 'Resolved' ? '✓ Resolved' : 'Mark Resolved'}
                    </button>
                  </div>
                </div>

                <p className="text-xs font-bold text-gray-800 mt-2">{snag.issue}</p>
                <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                  <MapPin size={11} className="text-orange-500 shrink-0" /> {snag.location}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-100 text-xs text-orange-950 leading-relaxed flex items-start gap-2.5">
            <ShieldCheck size={18} className="text-orange-600 shrink-0 mt-0.5" />
            <div>
              <strong>PMC Assurance Commitment:</strong> Every registered project under our PMC governance is assigned a Dedicated Quality Manager (DQM). Contractor measurement sheets are cleared only after physical verification on site.
            </div>
          </div>
        </div>

        {/* Right 1 Col: Hire PMC Consultant Form */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col justify-between space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-600/30 text-orange-300 border border-orange-500/40 rounded-full text-[10px] font-black uppercase tracking-wider mb-3">
              <Briefcase size={12} /> Engage PMC Services
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">
              Request Site PMC Proposal
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Developers, housing societies & builders can submit their project brief for complete construction quality supervision and billing audit.
            </p>

            {reqSent ? (
              <div className="mt-6 bg-emerald-950/80 border border-emerald-500 p-5 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
                <CheckCircle2 size={32} className="mx-auto text-emerald-400" />
                <h4 className="text-sm font-black text-white">Proposal Request Received!</h4>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Our Senior Project Management Consultant will contact you at <strong>{clientPhone}</strong> within 3 business hours.
                </p>
                <button 
                  onClick={() => setReqSent(false)} 
                  className="mt-2 text-xs font-bold text-orange-400 underline hover:text-orange-300"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestPMC} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Developer / Client Name *</label>
                  <input 
                    type="text" 
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Acme Realty / Green Society"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Project Nature</label>
                  <select 
                    value={clientProject}
                    onChange={e => setClientProject(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Residential High-Rise Tower">Residential High-Rise Tower</option>
                    <option value="Society Major Structural Repair & Audit">Society Major Structural Repair & Audit</option>
                    <option value="Commercial Mall / IT Park">Commercial Mall / IT Park</option>
                    <option value="Independent Luxury Bungalow">Independent Luxury Bungalow</option>
                    <option value="Industrial Shed / Factory">Industrial Shed / Factory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Required PMC Scope</label>
                  <select 
                    value={serviceType}
                    onChange={e => setServiceType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Full Project PMC & Site Supervision">Full Project PMC & Site Supervision</option>
                    <option value="Contractor RA Bill Verification Only">Contractor RA Bill Verification Only</option>
                    <option value="Structural & Safety Quality Audit Only">Structural & Safety Quality Audit Only</option>
                    <option value="Tender Preparation & BOQ Finalization">Tender Preparation & BOQ Finalization</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mt-2"
                >
                  <Send size={14} /> Submit PMC Mandate Request
                </button>
              </form>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span>Standard Consulting Fee:</span>
              <span className="font-bold text-orange-400 font-mono">₹1.25/sq.ft onwards</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Hotline Consultation:</span>
              <a href="tel:+919820511980" className="text-white hover:text-orange-300 font-bold underline">
                +91 98205 11980
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
