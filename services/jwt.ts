// Client-side JWT utilities (HS256 via WebCrypto) + PBKDF2 password hashing.
// Note: because this runs fully in the browser, the signing secret ships with the
// app bundle. It keeps the "real JWT" flow for a standalone single-instance app,
// but for high-security deployments move signing to a server.

export interface JwtPayload {
  sub: string;
  phone: string;
  role: string;
  iat: number;
  exp: number;
}

const getSecret = (): string =>
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_JWT_SECRET) || 'construction-mart-shk-dev-secret';

const bytesToB64Url = (bytes: Uint8Array): string => {
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const b64UrlToBytes = (s: string): Uint8Array => {
  let b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4 !== 0) b64 += '=';
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};

const textToBytes = (t: string) => new TextEncoder().encode(t);
const bytesToText = (b: Uint8Array) => new TextDecoder().decode(b);

const getKey = async (secret?: string): Promise<CryptoKey> =>
  crypto.subtle.importKey(
    'raw',
    textToBytes(secret || getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );

export const signJwt = async (payload: { sub: string; phone: string; role: string }, secret?: string): Promise<string> => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 7 * 24 * 60 * 60;
  const header = { alg: 'HS256', typ: 'JWT' };
  const body = { ...payload, iat, exp };
  const headB64 = bytesToB64Url(textToBytes(JSON.stringify(header)));
  const bodyB64 = bytesToB64Url(textToBytes(JSON.stringify(body)));
  const data = textToBytes(`${headB64}.${bodyB64}`);
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, data);
  return `${headB64}.${bodyB64}.${bytesToB64Url(new Uint8Array(sig))}`;
};

export const verifyJwt = async (token: string, secret?: string): Promise<JwtPayload | null> => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const data = textToBytes(`${parts[0]}.${parts[1]}`);
    const key = await getKey(secret);
    const sig = b64UrlToBytes(parts[2]);
    const ok = await crypto.subtle.verify('HMAC', key, sig, data);
    if (!ok) return null;
    const payload = JSON.parse(bytesToText(b64UrlToBytes(parts[1]))) as JwtPayload;
    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
};

const randomHex = (bytes: number): string => {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
};

export const hashPassword = async (password: string, saltHex?: string): Promise<{ salt: string; hash: string }> => {
  const salt = saltHex || randomHex(16);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textToBytes(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: textToBytes(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return { salt, hash: bytesToB64Url(new Uint8Array(bits)) };
};

export const verifyPassword = async (password: string, stored: string): Promise<boolean> => {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const { hash: recomputed } = await hashPassword(password, salt);
  return recomputed === hash;
};