import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Polyfill WebSocket for Node 20 (supabase-js requires it)
if(typeof global.WebSocket === 'undefined'){
  global.WebSocket = class WebSocket {
    constructor(url, protocols){ this.url=url; this.protocols=protocols; }
    close(){}
    send(){}
    addEventListener(){}
    removeEventListener(){}
  };
}

// --- load .env manually ---
const envPath = path.resolve('..', '.env');
let env = {};
try {
  const rawEnv = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf8');
  rawEnv.split('\n').forEach(line=>{
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if(m) {
      let v = m[2].trim();
      if((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1,-1);
      env[m[1].trim()] = v;
    }
  });
} catch(e) { console.error('Failed to load .env', e.message); }

const SUPABASE_URL = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if(!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const VALID_ROLES = ['CLIENT','VENDOR','PMC','CHANNEL_PARTNER','LABOUR','MATERIAL_SUPPLIER','JOB SEEKER','FREELANCER','BROKER'];
const SUPERADMIN_PHONES = new Set(['9000000000','900000000']); // keep both variants

function mapRole(raw) {
  const r = (raw||'').trim().toUpperCase().replace(/\s+/g,' ');
  if(!r) return 'VENDOR';
  if(r === 'LABOUR') return 'LABOUR';
  if(r === 'VENDOR') return 'VENDOR';
  if(r === 'BROKER') return 'BROKER';
  if(r.includes('MATERIAL') && r.includes('SUPPLIER')) return 'MATERIAL_SUPPLIER';
  if(r === 'CIVIL MATERIAL SUPPLIER') return 'MATERIAL_SUPPLIER';
  if(r === 'CIVIL ENGINEER') return 'JOB SEEKER';
  if(r === 'SUPERVISOR') return 'JOB SEEKER';
  if(r.includes('SUPERVISOR')) return 'JOB SEEKER';
  if(r === 'JOB' || r === 'JOB SEEKER') return 'JOB SEEKER';
  if(r.includes('SAFETY')) return 'JOB SEEKER';
  if(r === 'DEVELOPER') return 'CLIENT';
  if(r === 'CONSULTANT') return 'PMC';
  if(r === 'ARCHITECHT' || r === 'ARCHITECT') return 'FREELANCER';
  if(r.includes('ENGINEER')) return 'JOB SEEKER';
  if(VALID_ROLES.includes(r)) return r;
  if(r === 'JOB_SEEKER') return 'JOB SEEKER';
  // fallback
  if(r.includes('LABOUR')) return 'LABOUR';
  if(r.includes('VENDOR')) return 'VENDOR';
  return 'VENDOR';
}

function randomHex(bytes=16){
  return crypto.randomBytes(bytes).toString('hex');
}
function base64url(buf){
  return buf.toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function hashPasswordSync(password, saltHex){
  const salt = saltHex || randomHex(16);
  const derived = crypto.pbkdf2Sync(password, Buffer.from(salt, 'utf8'), 100000, 32, 'sha256');
  const hash = base64url(derived);
  return { salt, hash, stored: `${salt}:${hash}` };
}

// CSV parsing
const csvPath = path.resolve(process.cwd(), 'new_users.csv');
const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split(/\r?\n/).filter(l=>l.trim()!=='');
const header = lines[0].split(',').map(h=>h.trim());
console.log('Header:', header);
const rows = [];
for(let i=1;i<lines.length;i++){
  const line = lines[i];
  // simple split, but handle quoted? For this file no quoted commas, so split is fine
  // Use a proper split that respects quotes
  const parts = [];
  let cur = '';
  let inQuotes = false;
  for(let c=0;c<line.length;c++){
    const ch = line[c];
    if(ch === '"' ){
      inQuotes = !inQuotes;
    } else if(ch === ',' && !inQuotes){
      parts.push(cur);
      cur='';
    } else {
      cur+=ch;
    }
  }
  parts.push(cur);
  // pad to header length
  while(parts.length < header.length) parts.push('');
  const obj = {};
  header.forEach((h,idx)=> obj[h] = (parts[idx]||'').trim());
  rows.push(obj);
}
console.log(`Total rows parsed: ${rows.length}`);

// Analyze
let missingId=0, missingPhone=0, missingNamePlaceholder=0;
let dupPhoneMap = new Map();
rows.forEach(r=>{
  const id = (r['ID NO.']||'').trim();
  if(!id) missingId++;
  const contact = (r['CONTACT']||'').trim();
  const digits = contact.replace(/[^0-9]/g,'');
  if(!digits) missingPhone++;
  const name = (r['NAME']||'').trim();
  if(!name || /^CM\//.test(name) || name===id) missingNamePlaceholder++;
  const norm = digits;
  if(norm) dupPhoneMap.set(norm, (dupPhoneMap.get(norm)||0)+1);
});
const dups = [...dupPhoneMap.entries()].filter(([k,v])=>v>1);
console.log(`Missing ID: ${missingId}, Missing phone: ${missingPhone}, Placeholder names: ${missingNamePlaceholder}, Duplicate phones: ${dups.length}`);
dups.slice(0,10).forEach(([k,v])=>console.log(` dup ${k} x${v}`));

// Generate users
const seenPhones = new Set([...SUPERADMIN_PHONES]);
const seenIds = new Set();
let autoIdCounter = 1;
let autoPhoneCounter = 9000000001; // start after superadmin

function generateUniquePhone(baseDigits){
  let digits = baseDigits;
  if(!digits){
    // generate new 10-digit
    let p;
    do {
      p = '9' + String(Math.floor(100000000 + Math.random()*900000000));
    } while(seenPhones.has(p));
    seenPhones.add(p);
    return p;
  }
  // normalize: keep digits, if starts with 91 and length 12, keep as is? But ensure uniqueness
  // we keep digits as is, but if duplicate, modify
  if(!seenPhones.has(digits)){
    seenPhones.add(digits);
    return digits;
  }
  // duplicate -> suffix
  let dupIdx=1;
  let newPhone;
  do {
    // try digits + dupIdx, or random
    newPhone = digits + String(dupIdx);
    if(newPhone.length > 15) newPhone = digits.slice(0,10) + String(dupIdx).padStart(2,'0');
    // if still duplicate, generate random
    if(seenPhones.has(newPhone)){
      newPhone = '9' + String(Math.floor(100000000 + Math.random()*900000000)) + String(dupIdx);
    }
    dupIdx++;
    // prevent infinite loop
    if(dupIdx>100) {
      newPhone = '9' + String(Math.floor(1000000000 + Math.random()*9000000000)).slice(0,10);
    }
  } while(seenPhones.has(newPhone));
  seenPhones.add(newPhone);
  return newPhone;
}

function bestSubCategory(category, remarks, role, id){
  const cat = (category||'').trim().toUpperCase();
  const rem = (remarks||'').trim();
  // If CSV already has sub category, use it - but in this CSV it's empty, so generate
  // Best match logic based on category
  if(cat === 'SITE ENGINEER'){
    const pools = ['RCC & Structure','Finishing & Interiors','High-Rise Execution','Residential Projects','Commercial Complex','Industrial Shed','Infrastructure & Roads','MEP Coordination','Quality Control','Billing & Planning'];
    const idx = parseInt(id.replace(/[^0-9]/g,'').slice(-2)||'0',10) % pools.length;
    return pools[idx];
  }
  if(cat === 'SR.ENGINEER') return 'Senior Site Execution';
  if(cat === 'JR.ENGINEER') return 'Junior Site Support';
  if(cat === 'BUILDING AUDIT') return rem ? rem.split(' ')[0] + ' Audit' : 'Structural Audit';
  if(cat === 'REAL ESTATE AGENT') return 'Residential Sales';
  if(cat === 'LABOUR FOREMAN') return 'Labour Management';
  if(cat === 'ELECTRICIAN') return 'Electrical Works';
  if(cat === 'FITTER CIVIL (FOREMAN)' || cat === 'FITTER CIVIL') return 'Shuttering & Reinforcement';
  if(cat === 'STEEL FABRICATOR') return 'Steel Fabrication';
  if(cat === 'PLUMBER') return 'Plumbing Works';
  if(cat === 'CARPENTER' || cat === 'CARPENTER CIVIL') return 'Carpentry & Woodwork';
  if(cat === 'HVAC') return 'HVAC Systems';
  if(cat === 'INTERIOR') return 'Interior Execution';
  if(cat === 'TILING') return 'Tiling & Flooring';
  if(cat === 'PAINTER') return 'Painting & Finishing';
  if(cat === 'CIVIL MATERIAL SUPPLIER') return 'Cement & Steel Supply';
  if(!cat && rem) return rem.slice(0,30);
  if(!cat) return role === 'JOB SEEKER' ? 'General Civil' : 'General Supply';
  // default: return category itself as sub category (best match)
  return category;
}

function generateId(rawId){
  let id = (rawId||'').trim();
  if(!id){
    let newId;
    do {
      newId = `CM/AUTO/${String(autoIdCounter).padStart(5,'0')}`;
      autoIdCounter++;
    } while(seenIds.has(newId));
    seenIds.add(newId);
    return newId;
  }
  // handle duplicate id
  if(seenIds.has(id)){
    let newId;
    do {
      newId = `${id}-DUP${autoIdCounter}`;
      autoIdCounter++;
    } while(seenIds.has(newId));
    seenIds.add(newId);
    return newId;
  }
  seenIds.add(id);
  return id;
}

const users = [];
let roleCounts = {};
rows.forEach((r,idx)=>{
  const rawId = r['ID NO.'];
  const id = generateId(rawId);
  let name = (r['NAME']||'').trim();
  const rawRole = r['ROLE'];
  const category = (r['CATEGORY']||'').trim() || undefined;
  let subCategory = (r['SUB CATEGORY']||'').trim() || undefined;
  const state = (r['STATE']||'').trim() || undefined;
  const city = (r['CITY']||'').trim() || undefined;
  const remarks = (r['REMARKS']||'').trim() || undefined;
  // Best match sub category when empty
  if(!subCategory){
    const roleForSub = mapRole(rawRole);
    subCategory = bestSubCategory(category, remarks, roleForSub, id);
  }
  const contactRaw = (r['CONTACT']||'').trim();
  let digits = contactRaw.replace(/[^0-9]/g,'');
  // handle phone generation with uniqueness
  const phone = generateUniquePhone(digits);
  // name fallback
  if(!name || /^CM\//.test(name) || name===rawId?.trim()){
    if(category) name = `${category} ${id.slice(-4)}`.trim();
    else if(subCategory) name = `${subCategory} ${id.slice(-4)}`.trim();
    else name = `User ${id.slice(-5)}`;
    // ensure name not empty
  }
  // collapse multiple spaces
  name = name.replace(/\s+/g,' ').trim();
  const role = mapRole(rawRole);
  roleCounts[role] = (roleCounts[role]||0)+1;

  // hash password: default demo123
  const {stored} = hashPasswordSync('demo123');
  users.push({
    id,
    name,
    role,
    category,
    password_hash: stored,
    subCategory,
    state,
    city,
    remarks,
    experience: undefined,
    gstNumber: undefined,
    charges: undefined,
    email: undefined,
    status: 'active',
    phone,
    created_at: new Date().toISOString()
  });
});

console.log('Generated users:', users.length);
console.log('Role distribution:', roleCounts);
console.log('Sample users:', users.slice(0,5).map(u=> ({id:u.id, name:u.name, role:u.role, phone:u.phone, category:u.category, city:u.city})));

// Now upload: first remove all previous except superadmin
console.log('--- Cleaning previous users (bookings fallback) ---');
async function cleanPrevious(){
  // fetch all bookings where booking_type=registration
  const { data, error } = await supabase.from('bookings').select('*').eq('booking_type','registration');
  if(error){
    console.warn('Fetch bookings error:', error.message, error.code);
    return;
  }
  console.log(`Found ${data.length} existing registration bookings`);
  const toDelete = data.filter(r=>{
    const d = r.details || {};
    const phone = (d.phone || d.mobile || r.details?.phone || '').toString().replace(/[^0-9]/g,'');
    const id = r.id;
    // keep superadmin by phone or id
    if(SUPERADMIN_PHONES.has(phone)) return false;
    if(id === 'super-admin-1') return false;
    // also keep if phone is superadmin prefix 9000000000
    if(phone === '9000000000' || phone === '900000000') return false;
    return true;
  });
  console.log(`Deleting ${toDelete.length} old users (keeping superadmin)`);
  // Batch delete in chunks of 100 to avoid timeout
  const DEL_BATCH = 100;
  for(let i=0;i<toDelete.length;i+=DEL_BATCH){
    const chunk = toDelete.slice(i, i+DEL_BATCH);
    const ids = chunk.map(r=>r.id);
    const { error: delErr } = await supabase.from('bookings').delete().in('id', ids);
    if(delErr) console.warn(`Batch delete ${i}-${i+ids.length} failed:`, delErr.message);
    else console.log(`Deleted batch ${i/DEL_BATCH+1}/${Math.ceil(toDelete.length/DEL_BATCH)}`);
  }
  // Also try to clear auth_users if table exists (will 404 if not)
  try {
    const { data: authData, error: authErr } = await supabase.from('auth_users').select('id,phone');
    if(!authErr && authData){
      const authToDelete = authData.filter(u=> !SUPERADMIN_PHONES.has((u.phone||'').replace(/[^0-9]/g,'')) && u.id !== 'super-admin-1');
      console.log(`Found ${authData.length} auth_users, deleting ${authToDelete.length}`);
      for(const u of authToDelete){
        await supabase.from('auth_users').delete().eq('id', u.id);
      }
    } else if(authErr && authErr.code !== 'PGRST205'){
      console.warn('auth_users fetch warning:', authErr.message);
    }
  } catch(e){
    console.warn('auth_users clean failed', e.message);
  }
}

await cleanPrevious();

// Upload new users in batches (100 per request to avoid timeout)
console.log('--- Uploading new users (batched 100) ---');
let success=0, fail=0;
const BATCH = 100;
for(let batchStart=0; batchStart<users.length; batchStart+=BATCH){
  const batch = users.slice(batchStart, batchStart+BATCH);
  const payloads = batch.map(u=> ({
    id: u.id,
    booking_type: 'registration',
    status: u.status,
    details: { ...u, fullName: u.name, mobile: u.phone, phone: u.phone },
    created_at: u.created_at
  }));
  const { error } = await supabase.from('bookings').upsert(payloads, { onConflict: 'id' });
  if(error){
    console.warn(`Batch ${batchStart}-${batchStart+payloads.length} failed:`, error.message);
    // fallback to individual
    for(const p of payloads){
      const { error: e2 } = await supabase.from('bookings').upsert(p, { onConflict: 'id' });
      if(e2) fail++; else success++;
    }
  } else {
    success += payloads.length;
    console.log(`Uploaded ${success}/${users.length}`);
  }
}
console.log(`Done. Success: ${success}, Fail: ${fail}`);

// Verify
const { data: verify, error: verErr } = await supabase.from('bookings').select('*').eq('booking_type','registration').order('created_at', { ascending: false }).limit(5);
if(!verErr) console.log('Verify sample from DB:', verify.slice(0,2).map(v=>v.details));

console.log('\nIMPORTANT: Clear browser localStorage keys cm_users_store to remove old cached users. Run in browser console: localStorage.removeItem(\"cm_users_store\"); location.reload();');
console.log('Also, superadmin remains. New users default password is demo123 (hashed with PBKDF2).');
