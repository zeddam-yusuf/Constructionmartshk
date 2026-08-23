import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../services/auth';
import { listLocalWorkRequests, WorkRequest, ROLE_LABELS, timeAgo } from './RequestsBoard';
import { fetchAllSubmissions } from '../services/supabase';
import { ClipboardList, MapPin, CalendarDays, Users, Briefcase, HardHat, Phone, X, Search, IndianRupee, Clock, Eye, Plus } from 'lucide-react';
import { PostRequestModal } from './PostRequestModal';

interface Application {
  id: string;
  requestId: string;
  requestTitle?: string;
  profession: string;
  startDate: string;
  applicantId?: string;
  applicantName: string;
  applicantPhone?: string;
  applicantRole?: string;
  status?: string;
  created_at?: string;
}

const listLocalApplications = (): Application[] => {
  try {
    const raw = localStorage.getItem('const_mart_local_applications');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const MyPosting = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<WorkRequest[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showPost, setShowPost] = useState(false);

  const loadData = async () => {
    if (!user) return;
    let reqs: WorkRequest[] = [];
    try { reqs = listLocalWorkRequests().filter((r) => r.userId === user.id); } catch {}
    let apps: Application[] = [];
    try { apps = listLocalApplications(); } catch {}
    try {
      const remote = await fetchAllSubmissions();
      const remoteReqs: WorkRequest[] = remote.filter((s: any) => s.type === 'work_request' && s.data).map((s: any) => ({ ...s.data, created_at: s.data.created_at || s.created_at }));
      const remoteApps: Application[] = remote.filter((s: any) => s.type === 'application' && s.data).map((s: any) => s.data);
      if (remoteReqs.length) {
        const byId = new Map<string, WorkRequest>();
        [...reqs, ...remoteReqs].forEach((r) => {
          const ex = byId.get(r.id);
          if (!ex || new Date((r as any).updated_at || r.created_at).getTime() > new Date((ex as any).updated_at || ex.created_at).getTime()) byId.set(r.id, r);
        });
        reqs = Array.from(byId.values()).filter((r) => r.userId === user.id);
      }
      if (remoteApps.length) {
        const byId2 = new Map<string, Application>();
        [...apps, ...remoteApps].forEach((a: any) => byId2.set(a.id, a));
        apps = Array.from(byId2.values());
      }
    } catch {}
    reqs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    apps.sort((a, b) => new Date(b.created_at || b.startDate || '').getTime() - new Date(a.created_at || a.startDate || '').getTime());
    setRequests(reqs);
    setApplications(apps);
  };

  useEffect(() => { loadData(); }, [user?.id]);
  useEffect(() => {
    const onFocus = () => loadData();
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onFocus);
    const iv = setInterval(loadData, 4000);
    return () => { window.removeEventListener('focus', onFocus); window.removeEventListener('storage', onFocus); clearInterval(iv); };
  }, [user?.id]);

  const filtered = useMemo(() => {
    if (!search.trim()) return requests;
    const q = search.toLowerCase();
    return requests.filter((r) => (r.title || '').toLowerCase().includes(q) || (r.location || '').toLowerCase().includes(q) || (r.timings || '').toLowerCase().includes(q));
  }, [requests, search]);

  const selected = useMemo(() => requests.find((r) => r.id === selectedId) || null, [requests, selectedId]);
  const selectedApps = useMemo(() => applications.filter((a) => a.requestId === selectedId), [applications, selectedId]);

  if (!user) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <p className="text-sm font-semibold text-gray-500">Please log in to see your postings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><ClipboardList size={22} className="text-orange-600" /> My Posting</h1>
          <p className="text-gray-500 text-sm mt-1">All requests posted by you — latest first. Select a row to see who applied.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, location..." className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64" />
          </div>
          <button onClick={() => setShowPost(true)} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-bold shadow-sm whitespace-nowrap">
            <Plus size={16} /> Post Request
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-black text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Title / Professions</th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Payment</th>
                <th className="text-left px-4 py-3">Applicants</th>
                <th className="text-right px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">No postings yet. Use Find → Post Request to create one.</td></tr>
              ) : filtered.map((r) => {
                const appsCount = applications.filter((a) => a.requestId === r.id).length;
                const isProject = r.kind === 'project';
                const isSelected = r.id === selectedId;
                return (
                  <tr key={r.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-orange-50' : ''}`}>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">{new Date(r.created_at).toLocaleDateString()} <span className="text-[10px] text-gray-400 block">{timeAgo(r.created_at)}</span></td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${isProject ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{isProject ? <><Briefcase size={10} /> Project</> : <><HardHat size={10} /> Available</>}</span></td>
                    <td className="px-4 py-3 max-w-[260px]"><span className="font-bold text-gray-900 line-clamp-1">{r.title || (r.professions || []).slice(0,2).join(', ') || '-'}</span><span className="text-[11px] text-gray-500 block truncate">{r.workers ? r.workers.map((w) => `${w.count} ${w.profession}`).join(', ') : (r.professions || []).join(', ')}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-[150px] truncate"><span className="inline-flex items-center gap-1"><MapPin size={11} className="text-gray-400" />{r.location || '-'}</span></td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-800">{r.paymentPerDay || r.costPerDay || '-'}</td>
                    <td className="px-4 py-3"><span className="inline-flex items-center gap-1 bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded-lg"><Users size={11} />{appsCount}</span></td>
                    <td className="px-4 py-3 text-right"><button onClick={(e) => { e.stopPropagation(); setSelectedId(r.id); }} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-colors"><Eye size={12} /> View</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-4 bg-slate-50">
            <div>
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">{selected.kind === 'project' ? <Briefcase size={14} className="text-orange-600" /> : <HardHat size={14} className="text-blue-600" />}{selected.title || 'Posting'} <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-900 text-white">{selected.status}</span></h3>
              <p className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-1"><MapPin size={11} />{selected.location || '-'}</span><span className="inline-flex items-center gap-1"><Clock size={11} />{selected.timings || '-'}</span>{selected.workType && <span className="inline-flex items-center gap-1"><CalendarDays size={11} />{selected.workType}</span>}</p>
              <p className="text-xs text-gray-400 mt-1">{selected.description || selected.availabilityNotes || ''}</p>
            </div>
            <button onClick={() => setSelectedId(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X size={16} /></button>
          </div>

          <div className="p-5">
            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><Users size={14} className="text-orange-600" /> Applicants for this posting <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-full">{selectedApps.length}</span></h4>
            {selectedApps.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
                <p className="text-sm text-gray-500 font-medium">No one has applied yet.</p>
                <p className="text-xs text-gray-400 mt-1">When labour or other users apply via the labour dashboard, they will appear here with their applied role and start date.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] font-black text-gray-500 uppercase border-b border-gray-100">
                      <th className="px-3 py-2">Applicant</th>
                      <th className="px-3 py-2">Role</th>
                      <th className="px-3 py-2">Applied as</th>
                      <th className="px-3 py-2">Start date</th>
                      <th className="px-3 py-2">Contact</th>
                      <th className="px-3 py-2">Applied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedApps.map((a) => (
                      <tr key={a.id} className="border-b border-gray-50 hover:bg-slate-50">
                        <td className="px-3 py-2.5"><span className="font-bold text-gray-900">{a.applicantName}</span></td>
                        <td className="px-3 py-2.5"><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{ROLE_LABELS[a.applicantRole || ''] || a.applicantRole || '-'}</span></td>
                        <td className="px-3 py-2.5"><span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-100 text-xs font-bold px-2 py-1 rounded-lg">{a.profession}</span></td>
                        <td className="px-3 py-2.5 text-xs font-semibold text-gray-700">{a.startDate ? new Date(a.startDate).toLocaleDateString() : '-'}</td>
                        <td className="px-3 py-2.5">
                          {a.applicantPhone ? (
                            <a href={`https://wa.me/${String(a.applicantPhone).replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-lg hover:bg-green-100"><Phone size={11} />{a.applicantPhone}</a>
                          ) : <span className="text-xs text-gray-400">-</span>}
                        </td>
                        <td className="px-3 py-2.5 text-[11px] text-gray-400">{a.created_at ? new Date(a.created_at).toLocaleDateString() : timeAgo(a.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      {showPost && <PostRequestModal onClose={() => { setShowPost(false); loadData(); }} />}
    </div>
  );
};
