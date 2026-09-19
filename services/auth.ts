import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { signJwt, verifyJwt, hashPassword, verifyPassword } from './jwt';
import {
  VALID_ROLES,
  SUPERADMIN_ROLE,
  StoredUser,
  dbListUsers,
  dbFindUserByPhone,
  dbUpsertUser,
  seedSampleJobs,
} from './store';

export type AuthUser = Omit<StoredUser, 'password_hash'>;

export interface RegisterPayload {
  name: string;
  phone: string;
  role: string;
  password: string;
  category?: string;
  subCategory?: string;
  state?: string;
  city?: string;
  remarks?: string;
  experience?: string;
  gstNumber?: string;
  charges?: string;
  email?: string;
  // deprecated alias
  companyName?: string;
}

const TOKEN_KEY = 'cm_token';
const USER_KEY = 'cm_user';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};
const storeUser = (user: AuthUser) => localStorage.setItem(USER_KEY, JSON.stringify(user));

const SUPERADMIN_PHONE = import.meta.env?.VITE_SUPERADMIN_PHONE || '9000000000';
const SUPERADMIN_PASSWORD = import.meta.env?.VITE_SUPERADMIN_PASSWORD || 'superadmin123';

const toPublic = (u: StoredUser): AuthUser => {
  const { password_hash: _ph, ...rest } = u;
  return rest;
};

// Seed the fixed super admin account and sample job listings (idempotent).
export const seedPlatform = async (): Promise<void> => {
  await seedSampleJobs();
  const existing = await dbFindUserByPhone(SUPERADMIN_PHONE);
  if (!existing) {
    const { salt, hash } = await hashPassword(SUPERADMIN_PASSWORD);
    await dbUpsertUser({
      id: 'super-admin-1',
      name: 'Super Admin',
      phone: SUPERADMIN_PHONE,
      role: SUPERADMIN_ROLE,
      password_hash: `${salt}:${hash}`,
      status: 'active',
      created_at: new Date().toISOString(),
    });
  }

  // Seed one demo account per role (password: demo123) for easy testing.
  const demos: Omit<StoredUser, 'password_hash'>[] = [
    { id: 'sample-client-1', name: 'Arjun Mehta (Developer)', phone: '9000000001', role: 'CLIENT', category: 'Residential', subCategory: 'Mehta Constructions', state: 'Maharashtra', city: 'Mumbai', remarks: 'Demo client', status: 'active', email: 'arjun@example.com', created_at: new Date().toISOString() },
    { id: 'sample-vendor-1', name: 'Suresh Gupta (Vendor)', phone: '9000000002', role: 'VENDOR', category: 'Civil Work', subCategory: 'Gupta Builders', state: 'Maharashtra', city: 'Pune', remarks: 'Demo vendor', status: 'active', email: 'suresh@example.com', created_at: new Date().toISOString() },
    { id: 'sample-pmc-1', name: 'Anita Desai (PMC)', phone: '9000000003', role: 'PMC', category: 'Project Management', subCategory: 'Desai PMC', state: 'Karnataka', city: 'Bangalore', remarks: 'Demo PMC', status: 'active', email: 'anita@example.com', created_at: new Date().toISOString() },
    { id: 'sample-partner-1', name: 'Vikram Singh (Channel Partner)', phone: '9000000004', role: 'CHANNEL_PARTNER', category: 'Channel Partner', subCategory: 'Singh Referrals', state: 'Delhi', city: 'Delhi', remarks: 'Demo partner', status: 'active', email: 'vikram@example.com', created_at: new Date().toISOString() },
    { id: 'sample-labour-1', name: 'Ramesh Yadav (Labour)', phone: '9000000005', role: 'LABOUR', category: 'Mason', state: 'Uttar Pradesh', city: 'Noida', remarks: 'Demo labour', experience: '10+ years', charges: '₹700 / day', status: 'active', email: 'ramesh@example.com', created_at: new Date().toISOString() },
    { id: 'sample-supplier-1', name: 'Pooja Mehta (Material Supplier)', phone: '9000000006', role: 'MATERIAL_SUPPLIER', category: 'Cement, Steel, Sand', subCategory: 'Mehta Traders', state: 'Tamil Nadu', city: 'Chennai', remarks: 'Demo supplier', status: 'active', email: 'pooja@example.com', created_at: new Date().toISOString() },
    { id: 'sample-job-1', name: 'Farhan Khan (Job Seeker / Engineer)', phone: '9000000007', role: 'JOB SEEKER', category: 'Site Engineer', subCategory: 'Khan Engineering', state: 'Telangana', city: 'Hyderabad', remarks: 'Demo job', experience: 'Site Engineer', status: 'active', email: 'farhan@example.com', created_at: new Date().toISOString() },
    { id: 'sample-freelancer-1', name: 'Neha Sharma (Freelancer)', phone: '9000000008', role: 'FREELANCER', category: 'Design', state: 'Haryana', city: 'Gurgaon', remarks: 'Demo freelancer', charges: '₹2,000 / day', status: 'active', email: 'neha@example.com', created_at: new Date().toISOString() },
    { id: 'sample-broker-1', name: 'Sanjay Rao (Broker)', phone: '9000000009', role: 'BROKER', category: 'Real Estate', subCategory: 'Rao Realty', state: 'Maharashtra', city: 'Mumbai', remarks: 'Demo broker', status: 'active', email: 'sanjay@example.com', created_at: new Date().toISOString() },
  ];
  const { salt: demoSalt, hash: demoHash } = await hashPassword('demo123');
  const all = await dbListUsers();
  // Skip demo seeding when real dataset is present (e.g., after bulk import) to avoid re-creating deleted samples
  if (all.length > 50) return;
  for (const demo of demos) {
    if (all.some((u) => u.phone === demo.phone)) continue;
    await dbUpsertUser({ ...demo, password_hash: `${demoSalt}:${demoHash}` });
  }
};

export const registerUser = async (payload: RegisterPayload): Promise<{ user: AuthUser; token: string }> => {
  const { name, phone, role, password } = payload;
  if (!name || !phone || !role || !password) {
    throw new Error('name, phone, role and password are required.');
  }
  const cleanPhone = String(phone).trim();
  if (!/^[0-9+ -]{7,15}$/.test(cleanPhone)) {
    throw new Error('Please enter a valid phone number.');
  }
  if (!(VALID_ROLES as readonly string[]).includes(role)) {
    throw new Error(`Invalid role. Allowed: ${VALID_ROLES.join(', ')}`);
  }
  if (cleanPhone === SUPERADMIN_PHONE) {
    throw new Error('This phone number is reserved for the platform administrator.');
  }
  if (String(password).length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
  const existing = await dbFindUserByPhone(cleanPhone);
  if (existing) {
    throw new Error('An account with this phone number already exists. Please login.');
  }

  const { salt, hash } = await hashPassword(String(password));
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    role,
    category: payload.category || undefined,
    password_hash: `${salt}:${hash}`,
    subCategory: payload.subCategory || payload.companyName || undefined,
    state: payload.state || undefined,
    city: payload.city || undefined,
    remarks: payload.remarks || undefined,
    experience: payload.experience || undefined,
    gstNumber: payload.gstNumber || undefined,
    charges: payload.charges || undefined,
    email: payload.email || undefined,
    status: 'active',
    phone: cleanPhone,
    created_at: new Date().toISOString(),
  };

  await dbUpsertUser(user);
  const token = await signJwt({ sub: user.id, phone: user.phone, role: user.role });
  return { user: toPublic(user), token };
};

export const loginUser = async (phone: string, password: string): Promise<{ user: AuthUser; token: string }> => {
  if (!phone || !password) {
    throw new Error('Phone number and password are required.');
  }
  const user = await dbFindUserByPhone(String(phone).trim());
  if (!user) {
    throw new Error('No account found for this phone number.');
  }
  const ok = await verifyPassword(String(password), user.password_hash);
  if (!ok) {
    throw new Error('Incorrect password. Please try again.');
  }
  if (user.status !== 'active') {
    throw new Error('Your account has been blocked by the administrator.');
  }
  const token = await signJwt({ sub: user.id, phone: user.phone, role: user.role });
  return { user: toPublic(user), token };
};

export const fetchCurrentUser = async (token?: string): Promise<AuthUser> => {
  const rawToken = token || getToken();
  if (!rawToken) throw new Error('Not logged in.');
  const payload = await verifyJwt(rawToken);
  if (!payload) throw new Error('Invalid or expired session. Please login again.');
  const users = await dbListUsers();
  const user = users.find((u) => u.id === payload.sub);
  if (!user) throw new Error('Account not found. Please login again.');
  if (user.status !== 'active') throw new Error('Your account has been blocked by the administrator.');
  return toPublic(user);
};

// ---- Shared auth store (single source of truth for all components) ----
type Listener = () => void;

let state: { user: AuthUser | null; ready: boolean } = {
  user: getStoredUser(),
  ready: false,
};

const listeners = new Set<Listener>();

const setState = (next: Partial<{ user: AuthUser | null; ready: boolean }>) => {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
};

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getAuthState = () => state;

export const useAuth = () => {
  const snapshot = useSyncExternalStore(subscribe, getAuthState, getAuthState);

  useEffect(() => {
    (async () => {
      try {
        await seedPlatform();
      } catch (e) {
        // seeding failures (e.g. blocked storage) should not block the app
      }
      const token = getToken();
      const stored = getStoredUser();
      if (token && stored) {
        // Already bootstrapped and ready (e.g. another useAuth consumer like a profile
        // page mounted mid-session) — silently re-validate WITHOUT toggling `ready`.
        // Flipping ready here would unmount the whole tree via the loading gate and
        // cause an infinite mount/unmount loop.
        if (state.ready && state.user) {
          try {
            const fresh = await fetchCurrentUser(token);
            storeUser(fresh);
            setState({ user: fresh, ready: true });
          } catch (err) {
            setState({ ready: true });
          }
          return;
        }
        setState({ user: stored, ready: false });
        try {
          const fresh = await fetchCurrentUser(token);
          storeUser(fresh);
          setState({ user: fresh, ready: true });
        } catch (err) {
          // Invalid/expired token or storage unavailable; keep cached user so UI still opens.
          setState({ ready: true });
        }
      } else {
        setState({ ready: true });
      }
    })();
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    const { token, user } = await loginUser(phone, password);
    setToken(token);
    storeUser(user);
    setState({ user, ready: true });
    return user;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { token, user } = await registerUser(payload);
    setToken(token);
    storeUser(user);
    setState({ user, ready: true });
    return user;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setState({ user: null, ready: true });
  }, []);

  const refreshUser = useCallback(async () => {
    if (getToken() && getStoredUser()) {
      const fresh = await fetchCurrentUser();
      storeUser(fresh);
      setState({ user: fresh });
    }
  }, []);

  return { user: snapshot.user, ready: snapshot.ready, login, register, logout, refreshUser };
};