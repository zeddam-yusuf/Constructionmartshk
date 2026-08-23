import { useEffect, useMemo, useState } from 'react';
import { saveSubmission, fetchAllSubmissions } from '../services/supabase';
import {
  ClipboardList,
  HardHat,
  Briefcase,
  MapPin,
  Clock,
  CalendarDays,
  Users,
  Phone,
  Loader2,
  IndianRupee,
  Layers,
} from 'lucide-react';

// ---------- Data model ----------

export interface WorkerRequirement {
  profession: string;
  count: number;
}

export interface WorkRequest {
  id: string;
  kind: 'project' | 'available';
  userId: string;
  userName: string;
  userPhone: string;
  userRole: string;
  // Work Project fields
  title?: string;
  workers?: WorkerRequirement[];
  paymentPerDay?: string;
  location?: string;
  workType?: 'Interior' | 'Exterior' | 'Both';
  timings?: string;
  startDate?: string;
  durationDays?: string;
  description?: string;
  contactName?: string;
  // Available for Work fields
  professions?: string[];
  costPerDay?: string;
  availabilityNotes?: string;
  status: 'Open' | 'Closed';
  created_at: string;
  updated_at?: string;
}

export const CIVIL_PROFESSIONS = [
  'Mason (Raj Mistri)',
  'Carpenter (Shuttering)',
  'Carpenter (Finishing)',
  'Electrician',
  'Plumber',
  'Painter',
  'Bar Bender (Steel)',
  'Welder / Fabricator',
  'Tile / Marble Fitter',
  'POP / False Ceiling Technician',
  'Waterproofing Applicator',
  'Helper / Mazdoor',
  'Supervisor / Site Engineer',
];

// ---------- Storage (localStorage first, Supabase mirror) ----------

const LS_KEY = 'const_mart_local_work_requests';

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

const SEED_REQUESTS: WorkRequest[] = [
  {
    id: 'wr-seed-1', kind: 'project', userId: 'seed-user-1',
    userName: 'Mehta Constructions (Developer)', userPhone: '9000000001', userRole: 'CLIENT',
    title: 'Slab casting crew needed - Andheri West site',
    workers: [
      { profession: 'Mason', count: 8 },
      { profession: 'Bar Bender', count: 4 },
      { profession: 'Helper', count: 6 },
    ],
    paymentPerDay: '₹850/day masons, ₹550/day helpers',
    location: 'Andheri West, Mumbai', workType: 'Exterior',
    timings: '8:00 AM - 6:00 PM', durationDays: '12 days',
    description: 'Casting of 3,500 sqft residential floor slab. Meals and safety gear provided. Immediate start.',
    contactName: 'Arjun Mehta', status: 'Open', created_at: daysAgo(1),
  },
  {
    id: 'wr-seed-2', kind: 'available', userId: 'seed-user-2',
    userName: 'Ramesh Yadav (Labour)', userPhone: '9000000005', userRole: 'LABOUR',
    professions: ['Mason (Raj Mistri)', 'Tile / Marble Fitter'],
    costPerDay: '₹800 / day', location: 'Noida, Sector 62', timings: '9:00 AM - 7:00 PM',
    availabilityNotes: '10+ years experience. Available immediately for interior finishing work.',
    status: 'Open', created_at: daysAgo(2),
  },
  {
    id: 'wr-seed-3', kind: 'project', userId: 'seed-user-3',
    userName: 'Desai PMC', userPhone: '9000000003', userRole: 'PMC',
    title: 'Interior fit-out electricians & plumbers - Bangalore',
    workers: [
      { profession: 'Electrician', count: 3 },
      { profession: 'Plumber', count: 2 },
    ],
    paymentPerDay: '₹900 / day', location: 'Whitefield, Bangalore', workType: 'Interior',
    timings: '9:00 AM - 6:30 PM', durationDays: '30 days',
    startDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    description: '12-washroom commercial complex fit-out. Certified professionals preferred.',
    contactName: 'Anita Desai', status: 'Open', created_at: daysAgo(3),
  },
];

export const listLocalWorkRequests = (): WorkRequest[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(SEED_REQUESTS));
      return [...SEED_REQUESTS];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

const upsertLocal = (req: WorkRequest) => {
  const list = listLocalWorkRequests();
  const idx = list.findIndex((r) => r.id === req.id);
  if (idx > -1) list[idx] = req;
  else list.unshift(req);
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore quota errors
  }
};

export const saveWorkRequest = async (req: WorkRequest) => {
  upsertLocal(req);
  await saveSubmission('work_request', req);
};

// One "Available for Work" listing per user
export const findUserAvailableListing = (userId?: string): WorkRequest | undefined =>
  userId ? listLocalWorkRequests().find((r) => r.kind === 'available' && r.userId === userId) : undefined;

export const timeAgo = (iso?: string) => {
  if (!iso) return '';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export const ROLE_LABELS: Record<string, string> = {
  CLIENT: 'Developer',
  VENDOR: 'Vendor / Contractor',
  PMC: 'PMC',
  CHANNEL_PARTNER: 'Channel Partner',
  LABOUR: 'Labour',
  MATERIAL_SUPPLIER: 'Material Supplier',
  JOB: 'Job Seeker',
  FREELANCER: 'Freelancer',
  BROKER: 'Broker',
};

// ---------- Requests view (board) ----------

export const RequestsView = ({ mode }: { mode: 'all' | 'project' | 'available' }) => {
  const [requests, setRequests] = useState<WorkRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'project' | 'available'>('all');
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    let items = listLocalWorkRequests();
    try {
      const remote = await fetchAllSubmissions();
      const remoteReqs: WorkRequest[] = remote
        .filter((s: any) => s.type === 'work_request' && s.data)
        .map((s: any) => ({ ...s.data, created_at: s.data.created_at || s.created_at }));
      const byId = new Map<string, WorkRequest>();
      [...items, ...remoteReqs].forEach((r) => {
        const existing = byId.get(r.id);
        if (!existing || new Date(r.updated_at || r.created_at) > new Date(existing.updated_at || existing.created_at)) {
          byId.set(r.id, r);
        }
      });
      items = Array.from(byId.values());
    } catch (e) {
      // offline / table missing — local copy is enough
    }
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setRequests(items);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const effectiveMode = mode === 'all' ? filter : mode;
  const visible = useMemo(
    () => requests.filter((r) => (effectiveMode === 'all' ? true : r.kind === effectiveMode)),
    [requests, effectiveMode]
  );

  const title =
    mode === 'available' ? 'Find Labour'
    : mode === 'project' ? 'Find Project'
    : 'Find';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {mode === 'available'
            ? 'Skilled workers and teams available for hire right now.'
            : mode === 'project'
            ? 'Work projects posted by developers, contractors and consultants.'
            : 'All requests posted by users - latest first.'}
        </p>
      </div>

      {mode === 'all' && (
        <div className="flex flex-wrap gap-2">
          {([
            { key: 'all', label: 'All Requests', icon: ClipboardList },
            { key: 'project', label: 'Work Projects', icon: Briefcase },
            { key: 'available', label: 'Available for Work', icon: HardHat },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === key ? 'bg-orange-600 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-orange-600" size={28} /></div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <ClipboardList size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-gray-500">No requests yet. Be the first to post one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.map((r) => (
            <RequestCard key={r.id} req={r} />
          ))}
        </div>
      )}
    </div>
  );
};

// ---------- Request card ----------

const RequestCard = ({ req }: { req: WorkRequest }) => {
  const isProject = req.kind === 'project';
  return (
    <div className={`rounded-2xl p-5 space-y-3 bg-white shadow-sm hover:shadow-md transition-shadow border-t-4 ${isProject ? 'border-t-orange-400' : 'border-t-blue-400'} border-x border-b border-gray-100`}>
      <div className="flex items-start justify-between gap-3">
        <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
          isProject ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {isProject ? <><Briefcase size={11} /> Work Project</> : <><HardHat size={11} /> Available for Work</>}
        </span>
        <span className="text-[11px] text-gray-400 font-semibold whitespace-nowrap">{timeAgo(req.created_at)}</span>
      </div>

      {isProject ? (
        <>
          <h3 className="font-bold text-gray-900 leading-snug">{req.title}</h3>
          {!!req.workers?.length && (
            <div className="flex flex-wrap gap-1.5">
              {req.workers.map((w) => (
                <span key={w.profession} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-1 rounded-lg">
                  <Users size={11} /> {w.profession}: {w.count}
                </span>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {(req.professions || []).map((p) => (
            <span key={p} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] font-bold px-2 py-1 rounded-lg border border-blue-100">
              <HardHat size={11} /> {p}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600 pt-1">
        {(isProject ? req.paymentPerDay : req.costPerDay) && (
          <span className="flex items-center gap-1.5 min-w-0">
            <IndianRupee size={12} className="text-green-600 shrink-0" />
            <span className="font-semibold truncate">{isProject ? req.paymentPerDay : req.costPerDay}</span>
          </span>
        )}
        {req.location && (
          <span className="flex items-center gap-1.5 truncate"><MapPin size={12} className="text-red-500 shrink-0" />{req.location}</span>
        )}
        {req.timings && (
          <span className="flex items-center gap-1.5"><Clock size={12} className="text-indigo-500 shrink-0" />{req.timings}</span>
        )}
        {isProject && req.workType && (
          <span className="flex items-center gap-1.5"><Layers size={12} className="text-purple-500 shrink-0" />{req.workType}</span>
        )}
        {isProject && req.durationDays && (
          <span className="flex items-center gap-1.5"><CalendarDays size={12} className="text-teal-500 shrink-0" />{req.durationDays}</span>
        )}
      </div>

      {!isProject && req.availabilityNotes && (
        <p className="text-[11px] text-gray-500 leading-relaxed">{req.availabilityNotes}</p>
      )}
      {isProject && req.description && (
        <p className="text-[11px] text-gray-500 leading-relaxed">{req.description}</p>
      )}

      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-800 truncate">{req.userName}</p>
          <p className="text-[10px] text-gray-400">
            {ROLE_LABELS[req.userRole] || req.userRole}{req.userPhone ? ` · ${req.userPhone}` : ''}
          </p>
        </div>
        {req.userPhone && (
          <a
            href={`https://wa.me/${String(req.userPhone).replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors"
          >
            <Phone size={12} /> Contact
          </a>
        )}
      </div>
    </div>
  );
};
