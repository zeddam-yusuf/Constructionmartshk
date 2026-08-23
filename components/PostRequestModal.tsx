import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../services/auth';
import {
  WorkRequest,
  WorkerRequirement,
  CIVIL_PROFESSIONS,
  findUserAvailableListing,
  saveWorkRequest,
} from './RequestsBoard';
import { Briefcase, HardHat, X, ChevronDown, Check, Loader2 } from 'lucide-react';

const WORKER_KEYS = [
  'Mason',
  'Carpenter',
  'Electrician',
  'Plumber',
  'Painter',
  'Bar Bender',
  'Welder',
  'Tile Fitter',
  'Helper',
  'Supervisor',
];

export const PostRequestModal = ({ onClose, initialTab }: { onClose: () => void; initialTab?: 'project' | 'available' }) => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'project' | 'available'>(initialTab || 'project');
  const [saving, setSaving] = useState(false);

  const TIME_OPTIONS = [
    '12:00 AM','1:00 AM','2:00 AM','3:00 AM','4:00 AM','5:00 AM','6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
    '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM','11:00 PM',
  ];
  const parseTimings = (s?: string): [string, string] => {
    if (!s) return ['', ''];
    const parts = s.split(' - ').map((x) => x.trim());
    if (parts.length === 2) return [parts[0], parts[1]];
    return [s, ''];
  };

  // --- Tab 1: Work Project ---
  const [pTitle, setPTitle] = useState('');
  const [workerCounts, setWorkerCounts] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState('');
  const [pLocation, setPLocation] = useState('');
  const [workType, setWorkType] = useState<'Interior' | 'Exterior' | 'Both'>('Both');
  const [pStart, setPStart] = useState('8:00 AM');
  const [pEnd, setPEnd] = useState('6:00 PM');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');

  // --- Tab 2: Available for Work ---
  const [professions, setProfessions] = useState<string[]>([]);
  const [profOpen, setProfOpen] = useState(false);
  const [costPerDay, setCostPerDay] = useState('');
  const [aStart, setAStart] = useState('9:00 AM');
  const [aEnd, setAEnd] = useState('7:00 PM');
  const [aLocation, setALocation] = useState('');
  const [notes, setNotes] = useState('');
  const [existingAvailableId, setExistingAvailableId] = useState<string | null>(null);

  // Pre-fill city from profile + load existing "Available for Work" listing (one per user -> edit mode)
  useEffect(() => {
    if (!user) return;
    setPLocation((prev) => prev || user.city || '');
    setALocation((prev) => prev || user.city || '');
    const mine = findUserAvailableListing(user.id);
    if (mine) {
      setExistingAvailableId(mine.id);
      setProfessions(mine.professions || []);
      setCostPerDay(mine.costPerDay || '');
      const [s, e] = parseTimings(mine.timings);
      if (s) setAStart(s);
      if (e) setAEnd(e);
      setALocation(mine.location || user.city || '');
      setNotes(mine.availabilityNotes || '');
    }
  }, [user]);

  const toggleProfession = (p: string) =>
    setProfessions((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

    const submitProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const workers: WorkerRequirement[] = WORKER_KEYS
      .map((k) => ({ profession: k, count: parseInt(workerCounts[k] || '0', 10) || 0 }))
      .filter((w) => w.count > 0);
    const now = new Date().toISOString();
    const timings = `${pStart} - ${pEnd}`;
    const req: WorkRequest = {
      id: `wr-${Date.now()}`,
      kind: 'project',
      userId: user.id,
      userName: `${user.name}${user.companyName ? ` (${user.companyName})` : ''}`,
      userPhone: user.phone,
      userRole: user.role,
      title: pTitle.trim(),
      workers,
      paymentPerDay: payment.trim(),
      location: pLocation.trim(),
      workType,
      timings,
      startDate: startDate || undefined,
      durationDays: duration.trim() || undefined,
      description: description.trim(),
      contactName: user.name,
      status: 'Open',
      created_at: now,
    };
    await saveWorkRequest(req);
    setSaving(false);
    alert(`Work project "${req.title}" posted to the Requests board.`);
    onClose();
  };

  const submitAvailable = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const now = new Date().toISOString();
    const orig = existingAvailableId ? findUserAvailableListing(user.id) : undefined;
    const timings = `${aStart} - ${aEnd}`;
    const req: WorkRequest = {
      id: existingAvailableId || `wr-avail-${user.id}`,
      kind: 'available',
      userId: user.id,
      userName: `${user.name}${user.companyName ? ` (${user.companyName})` : ''}`,
      userPhone: user.phone,
      userRole: user.role,
      professions,
      costPerDay: costPerDay.trim(),
      timings,
      location: aLocation.trim(),
      availabilityNotes: notes.trim(),
      status: 'Open',
      created_at: orig?.created_at || now,
      updated_at: now,
    };
    await saveWorkRequest(req);
    setSaving(false);
    alert(
      existingAvailableId
        ? 'Your Available-for-Work listing has been updated.'
        : 'Your Available-for-Work listing is live on the Requests board.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center px-6 pt-5 pb-3">
          <h3 className="text-xl font-bold text-gray-900">Post New Request</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div className="flex mx-6 mb-5 bg-gray-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setTab('project')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === 'project' ? 'bg-white text-orange-700 shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Briefcase size={15} /> Work Project
          </button>
          <button
            type="button"
            onClick={() => setTab('available')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === 'available' ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <HardHat size={15} /> Available for Work
          </button>
        </div>

        {/* ---- Tab 1: Work Project ---- */}
        {tab === 'project' && (
          <form onSubmit={submitProject} className="px-6 pb-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Project / Work title *</label>
              <input required value={pTitle} onChange={(e) => setPTitle(e.target.value)} className={inputCls}
                placeholder="e.g. Slab casting crew needed - Andheri West site" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Workers required *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {WORKER_KEYS.map((k) => (
                  <div key={k} className="flex items-center gap-2 bg-slate-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
                    <span className="text-[11px] font-bold text-gray-600 flex-1 truncate">{k}</span>
                    <input
                      type="number" min={0} value={workerCounts[k] || ''}
                      onChange={(e) => setWorkerCounts((prev) => ({ ...prev, [k]: e.target.value }))}
                      placeholder="0"
                      className="w-14 px-2 py-1 border border-gray-300 rounded-md text-xs outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Enter how many of each profession you need (leave 0 / blank if none).</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payment per day *</label>
                <input required value={payment} onChange={(e) => setPayment(e.target.value)} className={inputCls}
                  placeholder="e.g. ₹850 / day per mason" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Location *</label>
                <input required value={pLocation} onChange={(e) => setPLocation(e.target.value)} className={inputCls}
                  placeholder="e.g. Andheri West, Mumbai" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Work type</label>
                <select value={workType} onChange={(e) => setWorkType(e.target.value as any)} className={inputCls}>
                  <option>Interior</option>
                  <option>Exterior</option>
                  <option>Both</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Work start time *</label>
                <select required value={pStart} onChange={(e) => setPStart(e.target.value)} className={inputCls}>
                  {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Work end time *</label>
                <select required value={pEnd} onChange={(e) => setPEnd(e.target.value)} className={inputCls}>
                  {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Start date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Duration</label>
                <input value={duration} onChange={(e) => setDuration(e.target.value)} className={inputCls}
                  placeholder="e.g. 12 days" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Work description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputCls} resize-none`}
                placeholder="Scope of work, materials provided, meals, safety gear, etc." />
            </div>

            <button type="submit" disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-xl font-black hover:bg-orange-700 transition-colors disabled:opacity-50">
              {saving ? <Loader2 size={16} className="animate-spin" /> : null} Post Work Project
            </button>
          </form>
        )}

        {/* ---- Tab 2: Available for Work ---- */}
        {tab === 'available' && (
          <form onSubmit={submitAvailable} className="px-6 pb-6 space-y-4">
            {existingAvailableId && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-4 py-2.5 text-xs font-semibold">
                You already have an Available-for-Work listing. Any changes below will update it (only one listing per user is allowed).
              </div>
            )}

            <div className="relative">
              <label className="block text-xs font-bold text-gray-700 mb-1">Work list - civil professions *</label>
              <button
                type="button"
                onClick={() => setProfOpen(!profOpen)}
                className={`${inputCls} flex items-center justify-between text-left`}
              >
                <span className={professions.length ? 'text-gray-900' : 'text-gray-400'}>
                  {professions.length ? professions.join(', ') : 'Select your trades / professions'}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${profOpen ? 'rotate-180' : ''}`} />
              </button>
              {profOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto p-2">
                  {CIVIL_PROFESSIONS.map((p) => {
                    const active = professions.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => toggleProfession(p)}
                        className={`w-full flex items-center justify-between gap-2 text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                          active ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                        {active && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              )}
              {!!professions.length && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {professions.map((p) => (
                    <span key={p} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold px-2 py-1 rounded-lg">
                      <HardHat size={10} /> {p}
                      <button type="button" onClick={() => toggleProfession(p)} className="text-blue-400 hover:text-red-500 ml-0.5"><X size={11} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Cost per day *</label>
                <input required value={costPerDay} onChange={(e) => setCostPerDay(e.target.value)} className={inputCls}
                  placeholder="e.g. ₹800 / day" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Work start time *</label>
                <select required value={aStart} onChange={(e) => setAStart(e.target.value)} className={inputCls}>
                  {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Work end time *</label>
                <select required value={aEnd} onChange={(e) => setAEnd(e.target.value)} className={inputCls}>
                  {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Location / area you can work in *</label>
                <input required value={aLocation} onChange={(e) => setALocation(e.target.value)} className={inputCls}
                  placeholder="e.g. Noida, Sector 62" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Notes (experience, availability, tools...)</label>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputCls} resize-none`}
                placeholder="e.g. 10+ years experience, available immediately, own tools." />
            </div>

            <button type="submit" disabled={saving || professions.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-black hover:bg-blue-700 transition-colors disabled:opacity-50">
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              {existingAvailableId ? 'Update My Listing' : 'Post Availability'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const inputCls = 'w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500';
