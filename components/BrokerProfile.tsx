import React, { useState } from 'react';
import { saveSubmission } from '../services/supabase';
import { useProfile, ProfilePrompt } from '../services/profile';
import brokerSymbolImg from '../src/assets/images/broker_symbol_1785866178809.jpg';
import { BrokersPoint } from './BrokersPoint';
import { 
  Building2, 
  MapPin, 
  Percent, 
  Coins, 
  Plus, 
  Search, 
  Calculator, 
  Phone, 
  Mail, 
  Edit2, 
  Save, 
  XCircle,
  Award,
  CheckCircle2, 
  ArrowRight, 
  TrendingUp,
  FileText,
  User,
  ShieldCheck,
  Briefcase,
  Star,
  Users,
  DollarSign
} from 'lucide-react';

export function BrokerProfile() {
  const { user, saveProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [agencyName, setAgencyName] = useState(user?.companyName || '');
  const [brokerName, setBrokerName] = useState(user?.name || '');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState(user?.experience || '');
  const [location, setLocation] = useState(user?.city || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [reraNo, setReraNo] = useState(user?.gstNumber || '');
  const [totalDealsValue, setTotalDealsValue] = useState('');
  const [activeListingsCount, setActiveListingsCount] = useState(0);
  const [commissionRate, setCommissionRate] = useState('');
  const [bio, setBio] = useState('');

  // Commission Calculator State
  const [dealValue, setDealValue] = useState<number>(150); // in Lakhs
  const [brokeragePercent, setBrokeragePercent] = useState<number>(1.0); // %
  
  const [tempData, setTempData] = useState<any>(null);

  const startEdit = () => {
    setTempData({
      agencyName,
      brokerName,
      specialty,
      experience,
      location,
      phone,
      email,
      reraNo,
      commissionRate,
      bio
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (tempData) {
      setAgencyName(tempData.agencyName);
      setBrokerName(tempData.brokerName);
      setSpecialty(tempData.specialty);
      setExperience(tempData.experience);
      setLocation(tempData.location);
      setPhone(tempData.phone);
      setEmail(tempData.email);
      setReraNo(tempData.reraNo);
      setCommissionRate(tempData.commissionRate);
      setBio(tempData.bio);
    }
    setIsEditing(false);
  };

  const saveEdit = async () => {
    setIsEditing(false);
    await saveProfile({ name: brokerName, phone, email, city: location, companyName: agencyName, experience, gstNumber: reraNo });
    await saveSubmission('broker_profile_update', {
      agencyName,
      brokerName,
      specialty,
      experience,
      location,
      phone,
      email,
      reraNo,
      commissionRate,
      bio,
      updated_at: new Date().toISOString()
    });
  };

  // Commission Calc Live Math
  const calculatedCommission = (dealValue * 100000) * (brokeragePercent / 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <ProfilePrompt
        name={brokerName}
        phone={phone}
        city={location}
        company={agencyName}
        email={email}
        onEdit={() => { startEdit(); }}
      />
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/50 via-orange-50/20 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-slate-900 ring-2 ring-amber-500 shrink-0">
                <img 
                  src={brokerSymbolImg} 
                  alt="Broker Consultant" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified RERA Broker">
                <ShieldCheck size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Verified Real Estate Broker
                </span>
                <span className="bg-slate-900 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Award size={12} /> RERA Certified
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Star size={13} fill="currentColor" /> 4.95 (120+ Verified Deals)
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-2 pt-2">
                  <input 
                    type="text" 
                    value={agencyName} 
                    onChange={e => setAgencyName(e.target.value)}
                    className="w-full text-lg font-black bg-amber-50 border border-amber-200 rounded-xl px-3 py-1 text-gray-900 focus:outline-none"
                    placeholder="Broker Agency Name"
                  />
                  <input 
                    type="text" 
                    value={brokerName} 
                    onChange={e => setBrokerName(e.target.value)}
                    className="w-full text-sm font-bold bg-amber-50 border border-amber-200 rounded-xl px-3 py-1 text-gray-700 focus:outline-none"
                    placeholder="Lead Broker Name"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {agencyName}
                  </h1>
                  <p className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
                    <User size={14} /> Principal Broker: {brokerName} — <span className="text-gray-600 font-medium">{specialty}</span>
                  </p>
                </>
              )}

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin size={13} className="text-amber-600 shrink-0" />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)}
                      className="bg-amber-50 border border-amber-200 rounded-lg px-2 py-0.5 text-xs text-gray-800"
                    />
                  ) : location}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Briefcase size={13} className="text-amber-600 shrink-0" />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={experience} 
                      onChange={e => setExperience(e.target.value)}
                      className="bg-amber-50 border border-amber-200 rounded-lg px-2 py-0.5 text-xs text-gray-800 w-24"
                    />
                  ) : `${experience} in Real Estate`}
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
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-amber-500 text-gray-700 hover:text-amber-700 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Edit2 size={13} /> Edit Profile Data
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2 pt-2 text-right">
              <div>
                <span className="block text-[10px] font-extrabold uppercase text-gray-400">Total Deals Transacted</span>
                <span className="text-sm font-black text-gray-900 font-mono">{totalDealsValue}</span>
              </div>
              <div className="h-8 w-px bg-gray-200 mx-1" />
              <div>
                <span className="block text-[10px] font-extrabold uppercase text-gray-400">Active Mandates</span>
                <span className="text-sm font-black text-amber-600 font-mono">{activeListingsCount} Properties</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broker Quick Stats & Brokerage Estimator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Deal Closure Capabilities */}
        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4 lg:col-span-1">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <Building2 className="text-amber-600" size={18} />
            Brokerage Mandate Capabilities
          </h3>

          <div className="space-y-3 pt-1">
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
              <span className="text-xs font-black text-amber-900 block">🏙️ High-End Residential</span>
              <p className="text-[11px] text-gray-600 mt-0.5">Luxury 2/3/4 BHK apartments & penthouses directly from Tier-1 developers.</p>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="text-xs font-black text-blue-900 block">🏢 Pre-Leased Commercial</span>
              <p className="text-[11px] text-gray-600 mt-0.5">Offices with 8-9% ROI yields locked with multinational tenants on 9-year terms.</p>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-xs font-black text-emerald-900 block">📐 Land & Society Redevelopment</span>
              <p className="text-[11px] text-gray-600 mt-0.5">Joint Ventures (JV), Development Management (DM), and society consensus advisory.</p>
            </div>
          </div>
        </div>

        {/* Real Estate Commission Estimator */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-white p-6 rounded-3xl border border-amber-200/70 shadow-sm space-y-4 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-black uppercase tracking-wider">
                <Calculator size={12} /> Brokerage Yield Calculator
              </div>
              <span className="text-xs font-black text-amber-900 font-mono">Standard RERA Fee</span>
            </div>

            <h3 className="text-base font-black text-gray-900 mt-2">
              Property Deal Brokerage Payout Estimator
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Estimate potential brokerage commissions on outright property sales and commercial investments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-2xs">
              <label className="block text-[10px] font-extrabold uppercase text-gray-400 mb-1">
                Property Transaction Value (₹ Lakhs)
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="10" 
                  max="5000"
                  value={dealValue} 
                  onChange={e => setDealValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
                  ({dealValue >= 100 ? `${(dealValue / 100).toFixed(2)} Cr` : `${dealValue} L`})
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-2xs">
              <label className="block text-[10px] font-extrabold uppercase text-gray-400 mb-1">
                Brokerage Fee Structure
              </label>
              <div className="flex gap-2">
                {[
                  { label: '1% Resi', rate: 1.0 },
                  { label: '1.5%', rate: 1.5 },
                  { label: '2% Comm', rate: 2.0 }
                ].map(item => (
                  <button
                    key={item.rate}
                    type="button"
                    onClick={() => setBrokeragePercent(item.rate)}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                      brokeragePercent === item.rate 
                        ? 'bg-amber-600 text-white shadow-sm' 
                        : 'bg-slate-50 text-gray-700 hover:bg-amber-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Total Net Brokerage Receivable</span>
              <span className="text-xl font-black text-amber-400 font-mono">
                ₹{calculatedCommission.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="text-right text-[11px] text-slate-300">
              <span>Escrow Protected Direct Settlement</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Integrated Real Estate Marketplace & Listings Engine */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-600 text-white rounded-xl shadow-xs">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Real Estate Asset Inventory & Mandates</h2>
            <p className="text-xs text-gray-500">Live verified inventory available for purchase, leasing and investment syndication.</p>
          </div>
        </div>

        {/* Brokers Point Complete Component */}
        <BrokersPoint />
      </div>

    </div>
  );
}
