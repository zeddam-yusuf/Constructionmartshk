import { useState, type FormEvent } from 'react';
import { UserRole } from '../types';
import { useAuth, RegisterPayload } from '../services/auth';
import Logo from './Logo';
import { 
  Phone, 
  Lock, 
  User, 
  Building2, 
  MapPin, 
  Users, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  X,
  Compass,
  Truck,
  FileCheck2,
  Package,
  HardHat,
  Briefcase,
  GraduationCap,
  Sparkles,
  Home,
  Share2
} from 'lucide-react';
import developerSymbolImg from '../src/assets/images/developer_symbol_1785094433237.jpg';
import vendorSymbolImg from '../src/assets/images/vendor_symbol_1785094447958.jpg';
import labourSymbolImg from '../src/assets/images/labour_symbol_1785094461353.jpg';
import supplierSymbolImg from '../src/assets/images/supplier_symbol_1785094473667.jpg';
import jobSymbolImg from '../src/assets/images/job_symbol_1785094488725.jpg';
import freelancerSymbolImg from '../src/assets/images/freelancer_symbol_1785171686295.jpg';
import pmcSymbolImg from '../src/assets/images/pmc_symbol_1785866168151.jpg';
import brokerSymbolImg from '../src/assets/images/broker_symbol_1785866178809.jpg';
import architectSymbolImg from '../src/assets/images/architect_symbol_1790965373365.jpg';
import rmcSymbolImg from '../src/assets/images/rmc_symbol_1790965385502.jpg';
import consultantSymbolImg from '../src/assets/images/consultant_symbol_1790965398851.jpg';
import factorySymbolImg from '../src/assets/images/factory_symbol_1790966263406.jpg';
import mepSymbolImg from '../src/assets/images/mep_symbol_1791044860644.jpg';
import { 
  Factory,
  Wrench
} from 'lucide-react';

export interface RoleCardConfig {
  role: UserRole;
  label: string;
  desc: string;
  img: string;
  demoPhone: string;
  icon: any;
  color: string;
}

export const ROLE_CARDS: RoleCardConfig[] = [
  // 1. Previous roles up to Channel Partner (kept in order)
  { role: UserRole.CLIENT, label: 'Developer', desc: 'Hire services & post civil projects', img: developerSymbolImg, demoPhone: '9000000001', icon: Building2, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { role: UserRole.VENDOR, label: 'Vendor', desc: 'Contractor & turnkey builder', img: vendorSymbolImg, demoPhone: '9000000002', icon: Briefcase, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { role: UserRole.PMC, label: 'PMC', desc: 'Project management & QA/QC audits', img: pmcSymbolImg, demoPhone: '9000000003', icon: ShieldCheck, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { role: UserRole.LABOUR, label: 'Labour', desc: 'Instant skilled / daily wage workers', img: labourSymbolImg, demoPhone: '9000000005', icon: HardHat, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { role: UserRole.MATERIAL_SUPPLIER, label: 'Material Supplier', desc: 'Cement, steel, sand & raw gear', img: supplierSymbolImg, demoPhone: '9000000006', icon: Package, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { role: UserRole.JOB, label: 'Construction and Engineering Staff', desc: 'Civil site engineers, surveyors, draftsmen & supervisors', img: jobSymbolImg, demoPhone: '9000000007', icon: GraduationCap, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { role: UserRole.FREELANCER, label: 'Freelancer', desc: 'Drafting, BBS steel & billing advisory', img: freelancerSymbolImg, demoPhone: '9000000008', icon: Sparkles, color: 'text-pink-600 bg-pink-50 border-pink-200' },
  { role: UserRole.BROKER, label: 'Broker', desc: 'Real estate advisory & properties', img: brokerSymbolImg, demoPhone: '9000000009', icon: Home, color: 'text-violet-600 bg-violet-50 border-violet-200' },
  { role: UserRole.CHANNEL_PARTNER, label: 'Channel Partner', desc: 'Refer clients & earn commissions', img: brokerSymbolImg, demoPhone: '9000000004', icon: Share2, color: 'text-sky-600 bg-sky-50 border-sky-200' },

  // 2. Added after Channel Partner: Architect, RMC, Consultant, Construction Factory, MEP
  { role: UserRole.ARCHITECT, label: 'Architect', desc: 'Design, blueprints & 3D elevations', img: architectSymbolImg, demoPhone: '9000000010', icon: Compass, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { role: UserRole.RMC, label: 'RMC Plant', desc: 'Ready-mix concrete batching & supply', img: rmcSymbolImg, demoPhone: '9000000011', icon: Truck, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { role: UserRole.CONSULTANT, label: 'Consultant', desc: 'Structural, civil & MEP advisory', img: consultantSymbolImg, demoPhone: '9000000012', icon: FileCheck2, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { role: UserRole.CONSTRUCTION_FACTORY, label: 'Construction Factory', desc: 'Precast, AAC blocks, cement plant & machinery', img: factorySymbolImg, demoPhone: '9000000013', icon: Factory, color: 'text-stone-700 bg-stone-100 border-stone-300' },
  { role: UserRole.MEP, label: 'MEP Staff & Supervisor', desc: 'Mechanical, electrical and plumbing staff, supervisor and labour', img: mepSymbolImg, demoPhone: '9000000014', icon: Wrench, color: 'text-amber-800 bg-amber-50 border-amber-300' },
];

export const ROLE_LABELS: Record<string, string> = {
  [UserRole.CLIENT]: 'Developer / Client',
  [UserRole.VENDOR]: 'Vendor / Contractor',
  [UserRole.PMC]: 'PMC / Project Management Consultant',
  [UserRole.LABOUR]: 'Labour',
  [UserRole.MATERIAL_SUPPLIER]: 'Material Supplier',
  [UserRole.JOB]: 'Construction & Engineering Staff',
  [UserRole.FREELANCER]: 'Freelancer',
  [UserRole.BROKER]: 'Broker (Real Estate)',
  [UserRole.CHANNEL_PARTNER]: 'Channel Partner',
  [UserRole.ARCHITECT]: 'Architect (Studio & Design)',
  [UserRole.RMC]: 'RMC (Ready-Mix Concrete Plant)',
  [UserRole.CONSULTANT]: 'Consultant (Structural & Civil)',
  [UserRole.CONSTRUCTION_FACTORY]: 'Construction Factory (Precast / AAC / Cement)',
  [UserRole.MEP]: 'MEP (Mechanical, Electrical & Plumbing Staff/Supervisor/Labour)',
};

const inputCls =
  'w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500 text-gray-900';

export const AuthScreen = ({ 
  onClose, 
  initialMode, 
  initialRole 
}: { 
  onClose?: () => void; 
  initialMode?: 'login' | 'register';
  initialRole?: UserRole;
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode || 'login');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Selected role for filter or context
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(initialRole || null);

  // Login fields
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [regRole, setRegRole] = useState<UserRole | null>(initialRole || null);
  const [name, setName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('3 Years');
  const [charges, setCharges] = useState('');

  // Quick fill demo credentials
  const fillDemoRole = (card: RoleCardConfig) => {
    setSelectedRole(card.role);
    setPhone(card.demoPhone);
    setPassword('demo123');
    setError('');
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(phone.trim(), password);
      onClose?.();
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check phone and password.');
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
      onClose?.();
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
            <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">Welcome Back</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Login with your registered phone number, or choose a role below for 1-click demo access.
                </p>
              </div>

              {/* Quick Role Login Selector Bar */}
              <div>
                <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Select Role to Login / Fill Demo:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {ROLE_CARDS.map(card => {
                    const IconComp = card.icon || Building2;
                    const isSelected = selectedRole === card.role || phone === card.demoPhone;
                    return (
                      <button
                        key={card.role}
                        type="button"
                        onClick={() => fillDemoRole(card)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-200'
                            : 'border-gray-200 hover:border-orange-300 bg-white'
                        }`}
                        title={`Click to fill ${card.label} demo credentials`}
                      >
                        <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-orange-50 text-orange-600 ring-1 ring-orange-200 flex items-center justify-center">
                          <IconComp size={16} className="text-orange-600 shrink-0" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-extrabold text-gray-900 truncate">{card.label}</div>
                          <div className="text-[9px] text-orange-600 font-bold">Login</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
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
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 font-medium">{error}</div>}

              <button type="submit" disabled={busy} className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-md shadow-orange-200">
                {busy ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                {busy ? 'Signing in...' : 'Login to Dashboard'}
              </button>

              <div className="text-xs text-center text-gray-500 pt-2 border-t border-gray-100">
                New user?{' '}
                <button type="button" onClick={() => setMode('register')} className="text-orange-600 font-bold hover:underline">
                  Register for an account here
                </button>
                <span className="mx-2">·</span>
                Super Admin? Use phone <span className="font-mono font-bold text-gray-700">9000000000</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">Create your account</h2>
                <p className="text-sm text-gray-500 mt-1">Select your role, then fill in your professional profile details.</p>
              </div>

              {/* Role selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Select User Type / Role *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {ROLE_CARDS.map(card => {
                    const isSelected = regRole === card.role;
                    const IconComp = card.icon || Building2;
                    return (
                      <button
                        key={card.role}
                        type="button"
                        onClick={() => { setRegRole(card.role); setError(''); }}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-200'
                            : 'border-gray-200 hover:border-orange-300 bg-white'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-orange-50 text-orange-600 ring-1 ring-orange-200 flex items-center justify-center">
                          <IconComp size={20} className="text-orange-600 shrink-0" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-gray-900 truncate">{card.label}</div>
                          <div className="text-[10px] text-gray-500 leading-tight line-clamp-1">{card.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {regRole && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 text-xs text-orange-800 font-semibold flex items-center gap-2">
                  <Users size={14} /> Selected: {ROLE_LABELS[regRole] || regRole}
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
                    <input type="text" className={`${inputCls} pl-10`} placeholder="e.g. Mumbai / Pune" value={city} onChange={e => setCity(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Company / Studio / Brand</label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" className={`${inputCls} pl-10`} placeholder="e.g. Studio Vista / UltraMix Concrete" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category / Specialisation</label>
                  <input type="text" className={inputCls} placeholder="e.g. Residential Architect, RMC M25/M30, Structural Consultant" value={category} onChange={e => setCategory(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Experience</label>
                  <select className={inputCls} value={experience} onChange={e => setExperience(e.target.value)}>
                    {['< 1 Year', '1 Year', '2 Years', '3 Years', '5 Years', '10+ Years'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 font-medium">{error}</div>}

              <button type="submit" disabled={busy} className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-md shadow-orange-200">
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