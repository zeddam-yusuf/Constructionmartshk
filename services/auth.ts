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
  email?: string;
  city?: string;
  companyName?: string;
  category?: string;
  experience?: string;
  charges?: string;
  gstNumber?: string;
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
    { id: 'sample-client-1', name: 'Arjun Mehta (Developer)', phone: '9000000001', role: 'CLIENT', status: 'active', city: 'Mumbai', companyName: 'Mehta Constructions', email: 'arjun@example.com', created_at: new Date().toISOString() },
    { id: 'sample-vendor-1', name: 'Suresh Gupta (Vendor)', phone: '9000000002', role: 'VENDOR', status: 'active', city: 'Pune', companyName: 'Gupta Builders', email: 'suresh@example.com', created_at: new Date().toISOString() },
    { id: 'sample-pmc-1', name: 'Anita Desai (PMC)', phone: '9000000003', role: 'PMC', status: 'active', city: 'Bangalore', companyName: 'Desai PMC', email: 'anita@example.com', created_at: new Date().toISOString() },
    { id: 'sample-partner-1', name: 'Vikram Singh (Channel Partner)', phone: '9000000004', role: 'CHANNEL_PARTNER', status: 'active', city: 'Delhi', companyName: 'Singh Referrals', email: 'vikram@example.com', created_at: new Date().toISOString() },
    { id: 'sample-labour-1', name: 'Ramesh Yadav (Labour)', phone: '9000000005', role: 'LABOUR', status: 'active', city: 'Noida', experience: '10+ years', charges: '₹700 / day', email: 'ramesh@example.com', created_at: new Date().toISOString() },
    { id: 'sample-supplier-1', name: 'Pooja Mehta (Material Supplier)', phone: '9000000006', role: 'MATERIAL_SUPPLIER', status: 'active', city: 'Chennai', companyName: 'Mehta Traders', category: 'Cement, Steel, Sand', email: 'pooja@example.com', created_at: new Date().toISOString() },
    { id: 'sample-job-1', name: 'Farhan Khan (Construction & Engineering Staff)', phone: '9000000007', role: 'JOB', status: 'active', city: 'Hyderabad', companyName: 'Khan Engineering', experience: 'Civil Site Engineer', email: 'farhan@example.com', created_at: new Date().toISOString() },
    { id: 'sample-freelancer-1', name: 'Neha Sharma (Freelancer)', phone: '9000000008', role: 'FREELANCER', status: 'active', city: 'Gurgaon', charges: '₹2,000 / day', email: 'neha@example.com', created_at: new Date().toISOString() },
    { id: 'sample-broker-1', name: 'Sanjay Rao (Broker)', phone: '9000000009', role: 'BROKER', status: 'active', city: 'Mumbai', companyName: 'Rao Realty', email: 'sanjay@example.com', created_at: new Date().toISOString() },
    { id: 'sample-architect-1', name: 'Kavita Verma (Architect)', phone: '9000000010', role: 'ARCHITECT', status: 'active', city: 'Mumbai', companyName: 'Studio Verma Architects', category: 'Architectural Design & Planning', email: 'kavita@example.com', created_at: new Date().toISOString() },
    { id: 'sample-rmc-1', name: 'UltraMix Concrete (RMC)', phone: '9000000011', role: 'RMC', status: 'active', city: 'Pune', companyName: 'UltraMix RMC Ready-Mix Concrete', category: 'Ready-Mix Concrete / Batching Plant', email: 'ultramix@example.com', created_at: new Date().toISOString() },
    { id: 'sample-consultant-1', name: 'Dr. Rajesh Kulkarni (Consultant)', phone: '9000000012', role: 'CONSULTANT', status: 'active', city: 'Bangalore', companyName: 'Kulkarni Structural Advisory', category: 'Civil & Structural Consultant', email: 'kulkarni@example.com', created_at: new Date().toISOString() },
    { id: 'sample-factory-1', name: 'Bharat Precast & AAC (Construction Factory)', phone: '9000000013', role: 'CONSTRUCTION_FACTORY', status: 'active', city: 'Nagpur', companyName: 'Bharat Precast & AAC Blocks Ltd', category: 'Precast Panels, AAC Blocks & Building Materials', email: 'bharatfactory@example.com', created_at: new Date().toISOString() },
    { id: 'sample-mep-1', name: 'Rohan Sharma (MEP Staff & Supervisor)', phone: '9000000014', role: 'MEP', status: 'active', city: 'Mumbai', companyName: 'Apex MEP Engineering Solutions', category: 'Mechanical, Electrical & Plumbing Staff / Supervisor / Labour', email: 'rohan.mep@example.com', created_at: new Date().toISOString() },
  ];
  const { salt: demoSalt, hash: demoHash } = await hashPassword('demo123');
  const all = await dbListUsers();
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
    phone: cleanPhone,
    role,
    password_hash: `${salt}:${hash}`,
    status: 'active',
    email: payload.email || undefined,
    city: payload.city || undefined,
    companyName: payload.companyName || undefined,
    category: payload.category || undefined,
    experience: payload.experience || undefined,
    charges: payload.charges || undefined,
    gstNumber: payload.gstNumber || undefined,
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
  user: getToken() ? getStoredUser() : null,
  ready: true,
};

let bootstrapStarted = false;
let sessionVersion = 0;

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
    if (bootstrapStarted) return;
    bootstrapStarted = true;
    const myVersion = sessionVersion;

    (async () => {
      try {
        await seedPlatform();
      } catch (e) {
        // seeding failures (e.g. blocked storage) should not block the app
      }
      if (myVersion !== sessionVersion) return;

      const token = getToken();
      const stored = getStoredUser();
      if (token && stored) {
        try {
          const fresh = await fetchCurrentUser(token);
          if (myVersion !== sessionVersion || !getToken()) return;
          storeUser(fresh);
          setState({ user: fresh, ready: true });
        } catch (err) {
          if (myVersion !== sessionVersion) return;
          // Keep cached user if still logged in so UI stays open
          setState({ ready: true });
        }
      } else if (myVersion === sessionVersion) {
        clearToken();
        setState({ user: null, ready: true });
      }
    })();
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    const { token, user } = await loginUser(phone, password);
    sessionVersion += 1;
    setToken(token);
    storeUser(user);
    setState({ user, ready: true });
    return user;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { token, user } = await registerUser(payload);
    sessionVersion += 1;
    setToken(token);
    storeUser(user);
    setState({ user, ready: true });
    return user;
  }, []);

  const logout = useCallback(() => {
    sessionVersion += 1;
    clearToken();
    setState({ user: null, ready: true });
  }, []);

  const refreshUser = useCallback(async () => {
    const myVersion = sessionVersion;
    const token = getToken();
    if (token && getStoredUser()) {
      const fresh = await fetchCurrentUser(token);
      if (myVersion !== sessionVersion || !getToken()) return;
      storeUser(fresh);
      setState({ user: fresh });
    }
  }, []);

  return { user: snapshot.user, ready: snapshot.ready, login, register, logout, refreshUser };
};