import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthUser } from '../services/auth';
import {
  adminListUsers,
  adminUpdateUser,
  adminDeleteUser,
  adminListJobs,
  adminUpdateJob,
  adminDeleteJob,
  adminCreateUser,
  adminCreateJob,
} from '../services/admin';
import Logo from './Logo';
import { fetchAllSubmissions } from '../services/supabase';
import {
  Users, Briefcase, LayoutDashboard, LogOut, Search, ShieldAlert, ShieldCheck,
  Trash2, Ban, CheckCircle2, Loader2, RefreshCw, UserCog, Plus, X, ClipboardList, Send, Eye,
  FileText, HardHat,
} from 'lucide-react';

const ROLE_OPTIONS = [
  'CLIENT', 'VENDOR', 'PMC', 'CHANNEL_PARTNER', 'LABOUR', 'MATERIAL_SUPPLIER', 'JOB', 'FREELANCER', 'BROKER',
];

const ROLE_COLORS: Record<string, string> = {
  SUPERADMIN: 'bg-purple-100 text-purple-700',
  CLIENT: 'bg-blue-100 text-blue-700',
  VENDOR: 'bg-orange-100 text-orange-700',
  PMC: 'bg-teal-100 text-teal-700',
  CHANNEL_PARTNER: 'bg-cyan-100 text-cyan-700',
  LABOUR: 'bg-yellow-100 text-yellow-700',
  MATERIAL_SUPPLIER: 'bg-green-100 text-green-700',
  JOB: 'bg-indigo-100 text-indigo-700',
  FREELANCER: 'bg-pink-100 text-pink-700',
  BROKER: 'bg-rose-100 text-rose-700',
};

const JOB_STATUS_COLORS: Record<string, string> = {
  Open: 'bg-green-100 text-green-700',
  Closed: 'bg-gray-100 text-gray-600',
  Filled: 'bg-blue-100 text-blue-700',
};

const btn =
  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95';

export const SuperAdminPanel = ({ onLogout }: { onLogout: () => void }) => {
  const [tab, setTab] = useState<'overview' | 'users' | 'jobs' | 'postings' | 'applications'>('overview');

  // Users
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [usersBusy, setUsersBusy] = useState(false);

  // Jobs
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsBusy, setJobsBusy] = useState(false);

  // Postings & Applications (Work Requests + Applications)
  const [postings, setPostings] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [postingsBusy, setPostingsBusy] = useState(false);
  const [selectedPostingId, setSelectedPostingId] = useState<string | null>(null);
  const [postingsSearch, setPostingsSearch] = useState('');

  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  // Create modals
  const [modal, setModal] = useState<'user' | 'job' | null>(null);
  const [saving, setSaving] = useState(false);

  // Add User form
  const [nuName, setNuName] = useState('');
  const [nuPhone, setNuPhone] = useState('');
  const [nuRole, setNuRole] = useState('CLIENT');
  const [nuPassword, setNuPassword] = useState('');
  const [nuCity, setNuCity] = useState('');
  const [nuCompany, setNuCompany] = useState('');
  const [nuEmail, setNuEmail] = useState('');
  const [nuCategory, setNuCategory] = useState('');

  // Add Job form
  const [njTitle, setNjTitle] = useState('');
  const [njRole, setNjRole] = useState('');
  const [njLocation, setNjLocation] = useState('');
  const [njSalary, setNjSalary] = useState('');
  const [njType, setNjType] = useState('Full-time');
  const [njStatus, setNjStatus] = useState('Open');
  const [njDescription, setNjDescription] = useState('');

  const resetUserForm = () => {
    setNuName(''); setNuPhone(''); setNuRole('CLIENT'); setNuPassword('');
    setNuCity(''); setNuCompany(''); setNuEmail(''); setNuCategory('');
  };

  const resetJobForm = () => {
    setNjTitle(''); setNjRole(''); setNjLocation(''); setNjSalary('');
    setNjType('Full-time'); setNjStatus('Open'); setNjDescription('');
  };

  const submitCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminCreateUser({
        name: nuName, phone: nuPhone, role: nuRole, password: nuPassword,
        city: nuCity || undefined, companyName: nuCompany || undefined,
        email: nuEmail || undefined, category: nuCategory || undefined,
      });
      flash('User created.');
      setModal(null);
      resetUserForm();
      loadUsers();
    } catch (err: any) {
      setError(err?.message || 'Failed to create user.');
    } finally {
      setSaving(false);
    }
  };

  const submitCreateJob = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminCreateJob({
        title: njTitle, role: njRole || undefined, location: njLocation || undefined,
        salary: njSalary || undefined, type: njType || undefined,
        status: njStatus || undefined, description: njDescription || undefined,
      });
      flash('Job listing created.');
      setModal(null);
      resetJobForm();
      loadJobs();
    } catch (err: any) {
      setError(err?.message || 'Failed to create job listing.');
    } finally {
      setSaving(false);
    }
  };

  const loadUsers = useCallback(async () => {
    setUsersBusy(true);
    setError('');
    try {
      const users = await adminListUsers({ search: userSearch || undefined, role: roleFilter || undefined });
      setUsers(users);
    } catch (err: any) {
      setError(err?.message || 'Failed to load users.');
    } finally {
      setUsersBusy(false);
    }
  }, [userSearch, roleFilter]);

  const loadJobs = useCallback(async () => {
    setJobsBusy(true);
    try {
      setJobs(await adminListJobs());
    } catch (err: any) {
      setError(err?.message || 'Failed to load jobs.');
    } finally {
      setJobsBusy(false);
    }
  }, []);

  const loadPostings = useCallback(async () => {
    setPostingsBusy(true);
    try {
      let items: any[] = [];
      try {
        const raw = localStorage.getItem('const_mart_local_work_requests');
        items = raw ? JSON.parse(raw) : [];
      } catch {}
      try {
        const remote = await fetchAllSubmissions();
        const remoteReqs = remote.filter((s: any) => s.type === 'work_request' && s.data).map((s: any) => ({ ...s.data, created_at: s.data.created_at || s.created_at }));
        if (remoteReqs.length) {
          const byId = new Map<string, any>();
          [...items, ...remoteReqs].forEach((r: any) => {
            const ex = byId.get(r.id);
            if (!ex || new Date(r.updated_at || r.created_at).getTime() > new Date(ex.updated_at || ex.created_at).getTime()) byId.set(r.id, r);
          });
          items = Array.from(byId.values());
        }
      } catch {}
      items.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setPostings(items);
    } catch (err: any) {
      setError(err?.message || 'Failed to load postings.');
    } finally {
      setPostingsBusy(false);
    }
  }, []);

  const loadApplications = useCallback(async () => {
    try {
      let items: any[] = [];
      try {
        const raw = localStorage.getItem('const_mart_local_applications');
        items = raw ? JSON.parse(raw) : [];
      } catch {}
      try {
        const remote = await fetchAllSubmissions();
        const remoteApps = remote.filter((s: any) => s.type === 'application' && s.data).map((s: any) => s.data);
        if (remoteApps.length) {
          const byId = new Map<string, any>();
          [...items, ...remoteApps].forEach((a: any) => byId.set(a.id, a));
          items = Array.from(byId.values());
        }
      } catch {}
      items.sort((a: any, b: any) => new Date(b.created_at || b.startDate || 0).getTime() - new Date(a.created_at || a.startDate || 0).getTime());
      setApplications(items);
    } catch {}
  }, []);

  const deletePosting = async (id: string, title: string) => {
    if (!window.confirm(`Delete posting "${title || id}"? This cannot be undone.`)) return;
    try {
      const raw = localStorage.getItem('const_mart_local_work_requests');
      let list: any[] = raw ? JSON.parse(raw) : [];
      list = list.filter((r: any) => r.id !== id);
      localStorage.setItem('const_mart_local_work_requests', JSON.stringify(list));
    } catch {}
    try { const { supabase } = await import('../services/supabase'); await supabase.from('submissions').delete().eq('id', id); } catch {}
    flash('Posting deleted.');
    loadPostings();
    loadApplications();
  };

  const deleteApplication = async (id: string) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      const raw = localStorage.getItem('const_mart_local_applications');
      let list: any[] = raw ? JSON.parse(raw) : [];
      list = list.filter((a: any) => a.id !== id);
      localStorage.setItem('const_mart_local_applications', JSON.stringify(list));
    } catch {}
    try { const { supabase } = await import('../services/supabase'); await supabase.from('submissions').delete().eq('id', id); } catch {}
    flash('Application deleted.');
    loadApplications();
  };

  useEffect(() => { loadUsers(); }, [loadUsers]);
  useEffect(() => { loadJobs(); }, [loadJobs]);
  useEffect(() => { loadPostings(); }, [loadPostings]);
  useEffect(() => { loadApplications(); }, [loadApplications]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const changeUserStatus = async (id: string, status: string) => {
    await adminUpdateUser(id, { status: status as 'active' | 'blocked' });
    flash(status === 'blocked' ? 'User blocked.' : 'User unblocked.');
    loadUsers();
  };

  const changeUserRole = async (id: string, role: string) => {
    await adminUpdateUser(id, { role });
    flash('User role updated.');
    loadUsers();
  };

  const deleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    await adminDeleteUser(id);
    flash('User deleted.');
    loadUsers();
  };

  const changeJobStatus = async (id: string, status: string) => {
    await adminUpdateJob(id, { status: status as 'Open' | 'Closed' | 'Filled' });
    flash('Job listing updated.');
    loadJobs();
  };

  const deleteJob = async (id: string, title: string) => {
    if (!window.confirm(`Delete job listing "${title}"?`)) return;
    await adminDeleteJob(id);
    flash('Job listing deleted.');
    loadJobs();
  };

  const stats = useMemo(() => {
    const total = users.length;
    const blocked = users.filter(u => u.status === 'blocked').length;
    const openJobs = jobs.filter(j => j.status === 'Open').length;
    const totalPostings = postings.length;
    const openPostings = postings.filter((p: any) => p.status === 'Open').length;
    const totalApplications = applications.length;
    const byRole: Record<string, number> = {};
    users.forEach(u => { byRole[u.role] = (byRole[u.role] || 0) + 1; });
    return { total, blocked, openJobs, totalPostings, openPostings, totalApplications, byRole };
  }, [users, jobs, postings, applications]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="hidden sm:block">
              <div className="text-sm font-black text-gray-900">Super Admin Console</div>
              <div className="text-[11px] text-gray-500">Construction Mart SHK</div>
            </div>
          </div>
          <button onClick={onLogout} className={`${btn} bg-red-50 text-red-600 hover:bg-red-100`}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4">
        <div className="flex gap-2 flex-wrap">
          {([
            { key: 'overview', label: 'Overview', icon: LayoutDashboard },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'jobs', label: 'Job Listings', icon: Briefcase },
            { key: 'postings', label: 'Postings', icon: ClipboardList },
            { key: 'applications', label: 'Applications', icon: Send },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === key ? 'bg-orange-600 text-white shadow' : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              <Icon size={16} /> {label}
              {key === 'users' && <span className="bg-black/10 px-1.5 rounded text-xs">{users.length}</span>}
              {key === 'jobs' && <span className="bg-black/10 px-1.5 rounded text-xs">{jobs.length}</span>}
              {key === 'postings' && <span className="bg-black/10 px-1.5 rounded text-xs">{postings.length}</span>}
              {key === 'applications' && <span className="bg-black/10 px-1.5 rounded text-xs">{applications.length}</span>}
            </button>
          ))}
        </div>

        {toast && (
          <div className="mt-4 px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} /> {toast}
          </div>
        )}
        {error && (
          <div className="mt-4 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">{error}</div>
        )}

        {/* Overview */}
        {tab === 'overview' && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Users size={22} /></div>
                <div>
                  <div className="text-2xl font-black text-gray-900">{stats.total}</div>
                  <div className="text-xs text-gray-500 font-semibold">Total registered users</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-red-100 text-red-600 rounded-xl flex items-center justify-center"><Ban size={22} /></div>
                <div>
                  <div className="text-2xl font-black text-gray-900">{stats.blocked}</div>
                  <div className="text-xs text-gray-500 font-semibold">Blocked accounts</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><Briefcase size={22} /></div>
                <div>
                  <div className="text-2xl font-black text-gray-900">{stats.openJobs}</div>
                  <div className="text-xs text-gray-500 font-semibold">Open job listings</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><ClipboardList size={22} /></div>
                <div>
                  <div className="text-2xl font-black text-gray-900">{stats.totalPostings}</div>
                  <div className="text-xs text-gray-500 font-semibold">Total postings (Find)</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><Send size={22} /></div>
                <div>
                  <div className="text-2xl font-black text-gray-900">{stats.totalApplications}</div>
                  <div className="text-xs text-gray-500 font-semibold">Total applications</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center"><HardHat size={22} /></div>
                <div>
                  <div className="text-2xl font-black text-gray-900">{stats.openPostings}</div>
                  <div className="text-xs text-gray-500 font-semibold">Open postings</div>
                </div>
              </div>
            </div>

            <div className="sm:col-span-3 bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="text-sm font-black text-gray-900 mb-3">Users by role</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {ROLE_OPTIONS.map(role => (
                  <div key={role} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2.5">
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded ${ROLE_COLORS[role] || 'bg-gray-100 text-gray-600'}`}>{role.replace('_', ' ')}</span>
                    <span className="text-sm font-black text-gray-800">{stats.byRole[role] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <div className="relative flex-1 max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search name, phone, email..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All roles</option>
                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
              <button onClick={loadUsers} className={`${btn} bg-orange-600 text-white hover:bg-orange-700`}>
                {usersBusy ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Refresh
              </button>
              <button onClick={() => { setError(''); setModal('user'); }} className={`${btn} bg-green-600 text-white hover:bg-green-700`}>
                <Plus size={14} /> Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                    <th className="px-4 py-3 font-black">User</th>
                    <th className="px-4 py-3 font-black">Phone</th>
                    <th className="px-4 py-3 font-black">Role</th>
                    <th className="px-4 py-3 font-black">Status</th>
                    <th className="px-4 py-3 font-black">Joined</th>
                    <th className="px-4 py-3 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && !usersBusy && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm font-semibold">No users found.</td></tr>
                  )}
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">{u.name}</div>
                        {u.companyName && <div className="text-xs text-gray-500">{u.companyName}</div>}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">{u.phone}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={e => changeUserRole(u.id, e.target.value)}
                          disabled={u.role === 'SUPERADMIN'}
                          className={`text-[11px] font-black px-2 py-1 rounded-md border border-transparent ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-600'}`}
                        >
                          {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-md ${
                          u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {u.status === 'active' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                          {u.status === 'active' ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.role !== 'SUPERADMIN' && (
                            <>
                              {u.status === 'active' ? (
                                <button onClick={() => changeUserStatus(u.id, 'blocked')} className={`${btn} bg-amber-50 text-amber-600 hover:bg-amber-100`} title="Block user">
                                  <Ban size={13} /> Block
                                </button>
                              ) : (
                                <button onClick={() => changeUserStatus(u.id, 'active')} className={`${btn} bg-green-50 text-green-600 hover:bg-green-100`} title="Unblock user">
                                  <CheckCircle2 size={13} /> Unblock
                                </button>
                              )}
                              <button onClick={() => deleteUser(u.id, u.name)} className={`${btn} bg-red-50 text-red-600 hover:bg-red-100`} title="Delete user">
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                          {u.role === 'SUPERADMIN' && <span className="text-[11px] text-gray-400 font-semibold"><UserCog size={14} className="inline" /> Protected</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Job listings */}
        {tab === 'jobs' && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2"><Briefcase size={16} className="text-orange-600" /> Manage job listings</h3>
              <div className="flex items-center gap-2">
                <button onClick={loadJobs} className={`${btn} bg-orange-600 text-white hover:bg-orange-700`}>
                  {jobsBusy ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Refresh
                </button>
                <button onClick={() => { setError(''); setModal('job'); }} className={`${btn} bg-green-600 text-white hover:bg-green-700`}>
                  <Plus size={14} /> Add Job
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                    <th className="px-4 py-3 font-black">Job Title</th>
                    <th className="px-4 py-3 font-black">Role</th>
                    <th className="px-4 py-3 font-black">Location</th>
                    <th className="px-4 py-3 font-black">Salary</th>
                    <th className="px-4 py-3 font-black">Type</th>
                    <th className="px-4 py-3 font-black">Status</th>
                    <th className="px-4 py-3 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 && !jobsBusy && (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm font-semibold">No job listings found.</td></tr>
                  )}
                  {jobs.map(j => (
                    <tr key={j.id} className="border-b border-gray-50 hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-gray-900">{j.title}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{j.role}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{j.location}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{j.salary}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{j.type}</td>
                      <td className="px-4 py-3">
                        <select
                          value={j.status}
                          onChange={e => changeJobStatus(j.id, e.target.value)}
                          className={`text-[11px] font-black px-2 py-1 rounded-md border border-transparent ${JOB_STATUS_COLORS[j.status] || 'bg-gray-100 text-gray-600'}`}
                        >
                          <option>Open</option>
                          <option>Closed</option>
                          <option>Filled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => deleteJob(j.id, j.title)} className={`${btn} bg-red-50 text-red-600 hover:bg-red-100`} title="Delete job">
                          <Trash2 size={13} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Postings — all Find requests */}
        {tab === 'postings' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 flex items-center gap-2"><ClipboardList size={16} className="text-orange-600" /> All Postings (Find)</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={postingsSearch} onChange={e => setPostingsSearch(e.target.value)} placeholder="Search title, location, phone..." className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <button onClick={() => { loadPostings(); loadApplications(); }} className={`${btn} bg-orange-600 text-white hover:bg-orange-700`}>
                    {postingsBusy ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Refresh
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                      <th className="px-4 py-3 font-black">Date</th>
                      <th className="px-4 py-3 font-black">Type</th>
                      <th className="px-4 py-3 font-black">Title / Professions</th>
                      <th className="px-4 py-3 font-black">Posted By</th>
                      <th className="px-4 py-3 font-black">Location</th>
                      <th className="px-4 py-3 font-black">Payment</th>
                      <th className="px-4 py-3 font-black">Status</th>
                      <th className="px-4 py-3 font-black text-center">Applications</th>
                      <th className="px-4 py-3 font-black text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postings.length === 0 && !postingsBusy && (
                      <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-400 text-sm font-semibold">No postings found.</td></tr>
                    )}
                    {postings
                      .filter(p => !postingsSearch || (p.title || '').toLowerCase().includes(postingsSearch.toLowerCase()) || (p.location || '').toLowerCase().includes(postingsSearch.toLowerCase()) || (p.userName || '').toLowerCase().includes(postingsSearch.toLowerCase()) || (p.userPhone || '').includes(postingsSearch))
                      .map(p => {
                        const appsCount = applications.filter(a => a.requestId === p.id).length;
                        const isProject = p.kind === 'project';
                        return (
                          <tr key={p.id} className={`border-b border-gray-50 hover:bg-slate-50 ${selectedPostingId === p.id ? 'bg-orange-50' : ''}`}>
                            <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{p.created_at ? new Date(p.created_at).toLocaleDateString() : '-'}</td>
                            <td className="px-4 py-3"><span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${isProject ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{isProject ? 'Project' : 'Available'}</span></td>
                            <td className="px-4 py-3 max-w-[220px]"><div className="font-bold text-gray-900 truncate">{p.title || (p.professions || []).slice(0,2).join(', ') || '-'}</div><div className="text-[11px] text-gray-500 truncate">{isProject ? (p.workers ? p.workers.map((w:any)=>`${w.count} ${w.profession}`).join(', ') : '') : (p.professions || []).join(', ')}</div></td>
                            <td className="px-4 py-3"><div className="font-semibold text-gray-800 text-xs">{p.userName}</div><div className="text-[11px] text-gray-500 font-mono">{p.userPhone} · {p.userRole}</div></td>
                            <td className="px-4 py-3 text-xs text-gray-600 max-w-[140px] truncate">{p.location || '-'}</td>
                            <td className="px-4 py-3 text-xs font-semibold text-gray-800">{p.paymentPerDay || p.costPerDay || '-'}</td>
                            <td className="px-4 py-3"><span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-700">{p.status}</span></td>
                            <td className="px-4 py-3 text-center"><span className="inline-flex items-center gap-1 bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded-lg">{appsCount}</span></td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1.5">
                                <button onClick={() => setSelectedPostingId(p.id)} className={`${btn} bg-blue-50 text-blue-600 hover:bg-blue-100`} title="View applications"><Eye size={13} /> View</button>
                                <button onClick={() => deletePosting(p.id, p.title || p.id)} className={`${btn} bg-red-50 text-red-600 hover:bg-red-100`} title="Delete posting"><Trash2 size={13} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
            {selectedPostingId && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="text-sm font-black text-gray-800 flex items-center gap-2"><Users size={14} className="text-orange-600" /> Applications for selected posting <span className="text-xs font-mono text-gray-500">{selectedPostingId.slice(0,8)}</span></h4>
                  <button onClick={() => setSelectedPostingId(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={14} /></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-[11px] font-black text-gray-500 uppercase border-b border-gray-100"><th className="px-4 py-2">Applicant</th><th className="px-4 py-2">Role</th><th className="px-4 py-2">Applied as</th><th className="px-4 py-2">Start date</th><th className="px-4 py-2">Contact</th><th className="px-4 py-2">Applied</th><th className="px-4 py-2 text-right">Actions</th></tr></thead>
                    <tbody>
                      {applications.filter(a => a.requestId === selectedPostingId).length === 0 ? (
                        <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400 text-sm">No applications for this posting yet.</td></tr>
                      ) : applications.filter(a => a.requestId === selectedPostingId).map(a => (
                        <tr key={a.id} className="border-b border-gray-50 hover:bg-slate-50">
                          <td className="px-4 py-2.5 font-bold text-gray-900">{a.applicantName}</td>
                          <td className="px-4 py-2.5 text-xs"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[11px]">{a.applicantRole || '-'}</span></td>
                          <td className="px-4 py-2.5"><span className="bg-orange-50 text-orange-700 border border-orange-100 text-xs font-bold px-2 py-1 rounded-lg">{a.profession}</span></td>
                          <td className="px-4 py-2.5 text-xs">{a.startDate ? new Date(a.startDate).toLocaleDateString() : '-'}</td>
                          <td className="px-4 py-2.5 text-xs font-mono">{a.applicantPhone || '-'}</td>
                          <td className="px-4 py-2.5 text-xs text-gray-500">{a.created_at ? new Date(a.created_at).toLocaleDateString() : '-'}</td>
                          <td className="px-4 py-2.5 text-right"><button onClick={() => deleteApplication(a.id)} className={`${btn} bg-red-50 text-red-600 hover:bg-red-100`}><Trash2 size={12} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Applications — all */}
        {tab === 'applications' && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2"><Send size={16} className="text-orange-600" /> All Applications</h3>
              <button onClick={() => { loadApplications(); loadPostings(); }} className={`${btn} bg-orange-600 text-white hover:bg-orange-700`}><RefreshCw size={14} /> Refresh</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                    <th className="px-4 py-3 font-black">Date</th>
                    <th className="px-4 py-3 font-black">Applicant</th>
                    <th className="px-4 py-3 font-black">Applied as</th>
                    <th className="px-4 py-3 font-black">Start date</th>
                    <th className="px-4 py-3 font-black">Posting</th>
                    <th className="px-4 py-3 font-black">Posted By</th>
                    <th className="px-4 py-3 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm font-semibold">No applications found.</td></tr>
                  ) : applications.map(a => {
                    const posting = postings.find(p => p.id === a.requestId);
                    return (
                      <tr key={a.id} className="border-b border-gray-50 hover:bg-slate-50">
                        <td className="px-4 py-3 text-xs text-gray-600">{a.created_at ? new Date(a.created_at).toLocaleDateString() : '-'}</td>
                        <td className="px-4 py-3"><div className="font-bold text-gray-900">{a.applicantName}</div><div className="text-[11px] text-gray-500">{a.applicantPhone} · {a.applicantRole}</div></td>
                        <td className="px-4 py-3"><span className="bg-orange-50 text-orange-700 border border-orange-100 text-xs font-bold px-2 py-1 rounded-lg">{a.profession}</span></td>
                        <td className="px-4 py-3 text-xs">{a.startDate ? new Date(a.startDate).toLocaleDateString() : '-'}</td>
                        <td className="px-4 py-3 max-w-[200px]"><div className="font-semibold text-gray-800 text-xs truncate">{posting?.title || a.requestTitle || a.requestId.slice(0,8)}</div><div className="text-[11px] text-gray-500 truncate">{posting?.location || '-'}</div></td>
                        <td className="px-4 py-3 text-xs"><div className="font-semibold text-gray-700">{posting?.userName || '-'}</div><div className="text-[11px] text-gray-500 font-mono">{posting?.userPhone || ''}</div></td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {a.requestId && <button onClick={() => { setSelectedPostingId(a.requestId); setTab('postings'); }} className={`${btn} bg-blue-50 text-blue-600 hover:bg-blue-100`}><Eye size={12} /> Posting</button>}
                            <button onClick={() => deleteApplication(a.id)} className={`${btn} bg-red-50 text-red-600 hover:bg-red-100`}><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add User modal */}
      {modal === 'user' && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={submitCreateUser} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2"><Plus size={16} className="text-green-600" /> Add User</h3>
              <button type="button" onClick={() => setModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-600">Full name *</label>
                <input required value={nuName} onChange={e => setNuName(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Rahul Verma" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Phone *</label>
                <input required value={nuPhone} onChange={e => setNuPhone(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. 9876543210" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Password *</label>
                <input required minLength={6} type="password" value={nuPassword} onChange={e => setNuPassword(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="Min 6 characters" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-600">Role *</label>
                <select value={nuRole} onChange={e => setNuRole(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500">
                  {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">City</label>
                <input value={nuCity} onChange={e => setNuCity(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Company</label>
                <input value={nuCompany} onChange={e => setNuCompany(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Email</label>
                <input type="email" value={nuEmail} onChange={e => setNuEmail(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Category</label>
                <input value={nuCategory} onChange={e => setNuCategory(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Cement, Steel" />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setModal(null)} className={`${btn} bg-gray-100 text-gray-600 hover:bg-gray-200`}>Cancel</button>
              <button type="submit" disabled={saving} className={`${btn} bg-green-600 text-white hover:bg-green-700 disabled:opacity-50`}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Create User
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Job modal */}
      {modal === 'job' && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={submitCreateJob} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2"><Plus size={16} className="text-green-600" /> Add Job Listing</h3>
              <button type="button" onClick={() => setModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-600">Job title *</label>
                <input required value={njTitle} onChange={e => setNjTitle(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Site Engineer (RCC)" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Role</label>
                <input value={njRole} onChange={e => setNjRole(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Civil Engineer" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Location</label>
                <input value={njLocation} onChange={e => setNjLocation(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Mumbai" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Salary</label>
                <input value={njSalary} onChange={e => setNjSalary(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. ₹45,000 / month" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Type</label>
                <select value={njType} onChange={e => setNjType(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Status</label>
                <select value={njStatus} onChange={e => setNjStatus(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500">
                  <option>Open</option>
                  <option>Closed</option>
                  <option>Filled</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-600">Description</label>
                <textarea rows={3} value={njDescription} onChange={e => setNjDescription(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="Job description / requirements" />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setModal(null)} className={`${btn} bg-gray-100 text-gray-600 hover:bg-gray-200`}>Cancel</button>
              <button type="submit" disabled={saving} className={`${btn} bg-green-600 text-white hover:bg-green-700 disabled:opacity-50`}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Create Job
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};