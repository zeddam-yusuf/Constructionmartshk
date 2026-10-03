// Super admin data operations (users + job listings).
// All functions operate directly on the local store (Supabase + localStorage),
// keeping the app fully standalone with no separate auth server.

import {
  StoredUser,
  StoredJob,
  dbListUsers,
  dbUpdateUser,
  dbDeleteUser,
  dbListJobs,
  dbUpdateJob,
  dbDeleteJob,
  dbUpsertUser,
  dbUpsertJob,
} from './store';
import { hashPassword } from './jwt';

export const adminListUsers = async (opts?: { search?: string; role?: string }): Promise<StoredUser[]> => {
  const users = await dbListUsers();
  const { search = '', role = '' } = opts || {};
  return users.filter((u) => {
    const matchesSearch =
      !search ||
      u.name?.toLowerCase().includes(String(search).toLowerCase()) ||
      u.phone?.includes(String(search)) ||
      u.email?.toLowerCase().includes(String(search).toLowerCase());
    const matchesRole = !role || u.role === role;
    return matchesSearch && matchesRole;
  });
};

export const adminUpdateUser = async (id: string, patch: Partial<Pick<StoredUser, 'role' | 'status' | 'name'>>) =>
  dbUpdateUser(id, patch);

export const adminDeleteUser = async (id: string) => dbDeleteUser(id);

export interface AdminNewUser {
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

export const adminCreateUser = async (input: AdminNewUser): Promise<void> => {
  if (!input.name || !input.phone || !input.role || !input.password) {
    throw new Error('Name, phone, role and password are required.');
  }
  if (String(input.password).length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
  const { salt, hash } = await hashPassword(String(input.password));
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: String(input.name).trim(),
    phone: String(input.phone).trim(),
    role: input.role,
    password_hash: `${salt}:${hash}`,
    status: 'active',
    email: input.email || undefined,
    city: input.city || undefined,
    companyName: input.companyName || undefined,
    category: input.category || undefined,
    experience: input.experience || undefined,
    charges: input.charges || undefined,
    gstNumber: input.gstNumber || undefined,
    created_at: new Date().toISOString(),
  };
  await dbUpsertUser(user);
};

export const adminListJobs = async (): Promise<StoredJob[]> => dbListJobs();

export const adminUpdateJob = async (id: string, patch: Partial<StoredJob>) => dbUpdateJob(id, patch);

export const adminDeleteJob = async (id: string) => dbDeleteJob(id);

export interface AdminNewJob {
  title: string;
  role?: string;
  location?: string;
  salary?: string;
  type?: string;
  status?: string;
  description?: string;
}

export const adminCreateJob = async (input: AdminNewJob): Promise<void> => {
  if (!input.title) throw new Error('Job title is required.');
  const job: StoredJob = {
    id: crypto.randomUUID(),
    title: String(input.title).trim(),
    role: input.role || 'General',
    location: input.location || 'Remote',
    salary: input.salary || 'Negotiable',
    type: input.type || 'Full-time',
    status: (input.status as StoredJob['status']) || 'Open',
    description: input.description || undefined,
    created_at: new Date().toISOString(),
  };
  await dbUpsertJob(job);
};