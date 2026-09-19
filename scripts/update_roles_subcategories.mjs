import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
global.WebSocket = class{ constructor(){ } close(){} send(){} addEventListener(){} };
const raw=fs.readFileSync('.env','utf8');
const env={};
raw.split('\n').forEach(l=>{const m=l.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/); if(m){let v=m[2].trim(); if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'")))v=v.slice(1,-1); env[m[1].trim()]=v;}});
const supabase=createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

function bestSubCategory(category, remarks, role, id){
  const cat = (category||'').trim().toUpperCase();
  const rem = (remarks||'').trim();
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
  return category;
}

(async()=>{
  let all=[]; let from=0; const step=1000;
  while(true){
    const {data,error}=await supabase.from('bookings').select('*').eq('booking_type','registration').range(from, from+step-1);
    if(error){console.error('fetch error',error.message); break;}
    if(!data||!data.length)break;
    all=all.concat(data);
    if(data.length<step)break;
    from+=step;
  }
  console.log('Total registrations fetched', all.length);
  let toUpdate=[];
  for(const row of all){
    const d=row.details||{};
    let role = d.role;
    let subCat = d.subCategory || d.sub_category;
    let needs=false;
    let newDetails={...d};
    if(role === 'JOB'){
      newDetails.role='JOB SEEKER';
      needs=true;
    }
    if(!subCat || !String(subCat).trim()){
      const cat = d.category || d.CATEGORY;
      const rem = d.remarks || d.REMARKS;
      const r = newDetails.role;
      const best = bestSubCategory(cat, rem, r, row.id);
      newDetails.subCategory = best;
      newDetails.sub_category = best;
      needs=true;
    }
    if(needs){
      // also ensure phone fields consistent
      toUpdate.push({id:row.id, booking_type:row.booking_type, status:row.status, details:{...newDetails, fullName:newDetails.name, mobile:newDetails.phone}, created_at:row.created_at});
    }
  }
  console.log('To update (role JOB->JOB SEEKER or empty subCategory):', toUpdate.length);
  // show sample
  console.log(toUpdate.slice(0,3).map(u=>({id:u.id, role:u.details.role, subCat:u.details.subCategory, cat:u.details.category})));

  const BATCH=100;
  let success=0;
  for(let i=0;i<toUpdate.length;i+=BATCH){
    const batch=toUpdate.slice(i,i+BATCH);
    const {error}=await supabase.from('bookings').upsert(batch, {onConflict:'id'});
    if(error) console.error('batch error',error.message);
    else {success+=batch.length; console.log(`Updated ${success}/${toUpdate.length}`);}
  }
  console.log('Done. Updated', success);

  // Also try auth_users if exists
  try{
    const {data,error}=await supabase.from('auth_users').select('*');
    if(!error && data){
      let authToUpdate=data.filter(r=> r.role==='JOB' || !r.sub_category);
      console.log('auth_users to update', authToUpdate.length);
      for(const r of authToUpdate){
        const patch={};
        if(r.role==='JOB') patch.role='JOB SEEKER';
        if(!r.sub_category){
          const best=bestSubCategory(r.category, r.remarks, patch.role||r.role, r.id);
          patch.sub_category=best;
        }
        if(Object.keys(patch).length){
          const {error:e2}=await supabase.from('auth_users').update(patch).eq('id', r.id);
          if(e2) console.warn('auth update fail',e2.message);
        }
      }
    }
  }catch(e){ console.warn(e.message)}
})();
