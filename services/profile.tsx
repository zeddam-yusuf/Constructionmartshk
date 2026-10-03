import { useCallback } from 'react';
import { AlertTriangle, Pencil } from 'lucide-react';
import { useAuth } from './auth';
import { dbUpdateUser } from './store';

/**
 * Shared profile controller: reads the logged-in user's stored profile from the
 * local store (Supabase + localStorage) and persists edits back to it.
 */
export const useProfile = () => {
  const { user, refreshUser } = useAuth();

  const saveProfile = useCallback(
    async (patch: {
      name?: string;
      phone?: string;
      email?: string;
      city?: string;
      companyName?: string;
      category?: string;
      experience?: string;
      charges?: string;
      gstNumber?: string;
    }) => {
      if (!user) return;
      await dbUpdateUser(user.id, patch);
      await refreshUser();
    },
    [user, refreshUser]
  );

  return { user, saveProfile };
};

const LABELS: Record<string, string> = {
  name: 'Name',
  phone: 'Phone',
  city: 'City',
  company: 'Company',
  email: 'Email',
};

/**
 * Non-blocking banner that nudges the user to complete missing profile details.
 * Only fields that are passed in (not undefined) are checked, so each role can
 * flag exactly the details it cares about. Renders nothing when complete.
 */
export const ProfilePrompt = ({
  name,
  phone,
  city,
  company,
  email,
  onEdit,
}: {
  name?: string;
  phone?: string;
  city?: string;
  company?: string;
  email?: string;
  onEdit: () => void;
}) => {
  const missing = (Object.entries({ name, phone, city, company, email }) as [string, string | undefined][])
    .filter(([, value]) => value !== undefined && !String(value).trim())
    .map(([key]) => LABELS[key] || key);
  if (!missing.length) return null;

  return (
    <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
        <AlertTriangle size={16} />
      </div>
      <div className="text-xs text-amber-800">
        <p className="font-bold">Complete your profile</p>
        <p className="text-[11px] leading-relaxed mt-0.5">
          Your profile is missing: <span className="font-bold">{missing.join(', ')}.</span> Please add these details so others can reach and find you easily.
        </p>
        <button
          onClick={onEdit}
          className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg transition-colors"
        >
          <Pencil size={12} /> Add details now
        </button>
      </div>
    </div>
  );
};