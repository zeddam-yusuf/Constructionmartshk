import { useState, type FormEvent } from 'react';
import { UserRole } from '../types';
import { useAuth, RegisterPayload } from '../services/auth';
import Logo from './Logo';
import { Phone, Lock, User, Building2, MapPin, Users, ShieldCheck, ArrowLeft, Loader2, X } from 'lucide-react';
import developerSymbolImg from '../src/assets/images/developer_symbol_1785094433237.jpg';
import vendorSymbolImg from '../src/assets/images/vendor_symbol_1785094447958.jpg';
import labourSymbolImg from '../src/assets/images/labour_symbol_1785094461353.jpg';
import supplierSymbolImg from '../src/assets/images/supplier_symbol_1785094473667.jpg';
import jobSymbolImg from '../src/assets/images/job_symbol_1785094488725.jpg';
import freelancerSymbolImg from '../src/assets/images/freelancer_symbol_1785171686295.jpg';
import pmcSymbolImg from '../src/assets/images/pmc_symbol_1785866168151.jpg';
import brokerSymbolImg from '../src/assets/images/broker_symbol_1785866178809.jpg';

const ROLE_CARDS: { role: UserRole; label: string; desc: string; img: string }[] = [
  { role: UserRole.CLIENT, label: 'Developer', desc: 'Hire services & post civil projects', img: developerSymbolImg },
  { role: UserRole.VENDOR, label: 'Vendor', desc: 'Contractor / builder', img: vendorSymbolImg },
  { role: UserRole.PMC, label: 'PMC', desc: 'Project management consultant', img: pmcSymbolImg },
  { role: UserRole.CHANNEL_PARTNER, label: 'Channel Partner', desc: 'Refer projects & earn', img: brokerSymbolImg },
  { role: UserRole.LABOUR, label: 'Labour', desc: 'Sub contractor / daily wages', img: labourSymbolImg },
  { role: UserRole.MATERIAL_SUPPLIER, label: 'Material Supplier', desc: 'Cement, steel, sand & more', img: supplierSymbolImg },
  { role: UserRole.JOB, label: 'Job / Engineer', desc: 'Find placement opportunities', img: jobSymbolImg },
  { role: UserRole.FREELANCER, label: 'Freelancer', desc: 'Independent consultant', img: freelancerSymbolImg },
  { role: UserRole.BROKER, label: 'Broker', desc: 'Real estate / channel partner', img: brokerSymbolImg },
];

const ROLE_LABELS: Record<string, string> = {
  [UserRole.CLIENT]: 'Developer / Client',
  [UserRole.VENDOR]: 'Vendor / Contractor',
  [UserRole.PMC]: 'PMC / Project Management Consultant',
  [UserRole.CHANNEL_PARTNER]: 'Channel Partner',
  [UserRole.LABOUR]: 'Labour / Sub Contractor',
  [UserRole.MATERIAL_SUPPLIER]: 'Material Supplier',
  [UserRole.JOB]: 'Job / Engineering Candidate',
  [UserRole.FREELANCER]: 'Freelancer',
  [UserRole.BROKER]: 'Broker (Real Estate)',
};

const inputCls =
  'w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500 text-gray-900';

export const AuthScreen = ({ onClose, initialMode }: { onClose?: () => void; initialMode?: 'login' | 'register' }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode || 'login');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Login fields
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [regRole, setRegRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('3 Years');
  const [charges, setCharges] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(phone.trim(), password);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regRole) {
      setError('Please select your role / user type.');
      return;
    }
    setBusy(true);
    try {
      const payload: RegisterPayload = {
        name: name.trim(),
        phone: regPhone.trim(),
        role: regRole,
        password: regPassword,
        email: email.trim() || undefined,
        city: city.trim() || undefined,
        companyName: companyName.trim() || undefined,
        category: category.trim() || undefined,
        experience: experience || undefined,
        charges: charges.trim() || undefined,
      };
      await register(payload);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={onClose ? '' : 'min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col items-center justify-center p-4'}>
      <div className="w-full max-w-4xl">
        {!onClose && (
          <div className="flex items-center justify-center gap-3 mb-6">
            <Logo size="lg" />
          </div>
        )}

        <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Close (modal mode only) */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-10 bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-4 text-sm font-black tracking-wide transition-colors ${mode === 'login' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              LOGIN
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-4 text-sm font-black tracking-wide transition-colors ${mode === 'register' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              REGISTER
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">Welcome back</h2>
                <p className="text-sm text-gray-500 mt-1">Login with your registered phone number.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" className={`${inputCls} pl-10`} placeholder="e.g. 9876543210" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" className={`${inputCls} pl-10`} placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 font-medium">{error}</div>}

              <button type="submit" disabled={busy} className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2">
                {busy ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                {busy ? 'Signing in...' : 'Login'}
              </button>

              <div className="text-xs text-center text-gray-500">
                New user?{' '}
                <button type="button" onClick={() => setMode('register')} className="text-orange-600 font-bold hover:underline">
                  Register here
                </button>
                <span className="mx-2">·</span>
                Admin? Use the seeded super admin phone <span className="font-mono font-bold text-gray-700">9000000000</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">Create your account</h2>
                <p className="text-sm text-gray-500 mt-1">Select your role, then fill in the required details.</p>
              </div>

              {/* Role selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Select User Type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ROLE_CARDS.map(card => (
                    <button
                      key={card.role}
                      type="button"
                      onClick={() => { setRegRole(card.role); setError(''); }}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 text-left transition-all ${
                        regRole === card.role
                          ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-200'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <img src={card.img} alt={card.label} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-gray-900 truncate">{card.label}</div>
                        <div className="text-[10px] text-gray-500 leading-tight">{card.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {regRole && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 text-xs text-orange-800 font-semibold flex items-center gap-2">
                  <Users size={14} /> Selected: {ROLE_LABELS[regRole]}
                </div>
              )}

              {/* Required fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" className={`${inputCls} pl-10`} placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" className={`${inputCls} pl-10`} placeholder="e.g. 9876543210" value={regPhone} onChange={e => setRegPhone(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="password" className={`${inputCls} pl-10`} placeholder="Min 6 characters" value={regPassword} onChange={e => setRegPassword(e.target.value)} required minLength={6} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email (optional)</label>
                  <input type="email" className={inputCls} placeholder="e.g. rahul@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City / Region</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" className={`${inputCls} pl-10`} placeholder="e.g. Mumbai" value={city} onChange={e => setCity(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Company / Organisation</label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" className={`${inputCls} pl-10`} placeholder="e.g. Sharma Builders" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category / Specialisation</label>
                  <input type="text" className={inputCls} placeholder="e.g. Contractor, Civil Engineer" value={category} onChange={e => setCategory(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Experience</label>
                  <select className={inputCls} value={experience} onChange={e => setExperience(e.target.value)}>
                    {['< 1 Year', '1 Year', '2 Years', '3 Years', '5 Years', '10+ Years'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 font-medium">{error}</div>}

              <button type="submit" disabled={busy} className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2">
                {busy ? <Loader2 size={18} className="animate-spin" /> : <ArrowLeft size={18} className="rotate-180" />}
                {busy ? 'Creating account...' : 'Register & Continue'}
              </button>

              <div className="text-xs text-center text-gray-500">
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('login')} className="text-orange-600 font-bold hover:underline">
                  Login here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};