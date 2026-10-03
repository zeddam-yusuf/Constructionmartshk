import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zcagvktgitwmrccikgas.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_swhL5N6SWjiiP1xchzdV_A_bCCCIbvB';

export interface SeedRecord {
  sr: number;
  category: string;
  state: string;
  city: string;
  area: string;
  name: string;
  contact: string;
  rate?: string;
  company?: string;
  remarks: string;
  sourceFile: string;
}

export const uploadedFile1Data: SeedRecord[] = [
  { sr: 1, category: 'BANDH KAM MASON', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'AB. KALAM', contact: '8178084835', rate: '', remarks: 'EXELLAR', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 2, category: 'STEEL FABRICATOR', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'SANTACRUZ', name: 'AB. AZEEM', contact: '9892803162', rate: '', remarks: '', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 3, category: 'AC/ WM/FRIDGE REPAIR', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'SANTACRUZ', name: 'AB.REHMAN', contact: '9892188032', rate: '', remarks: '', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 4, category: 'REAL ESTATE AGENT', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'GOLIBAR SANTACRUZ', name: 'AB. HALEEM', contact: '9892328155', rate: '', remarks: '', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 5, category: 'CATERER', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'GOLIBAR SANTACRUZ', name: 'ABRAR', contact: '7506212592', rate: '', remarks: 'BIRYANI', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 6, category: 'FITTER CIVIL (FOREMAN)', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ABU NASAR', contact: '9594021696', rate: '', remarks: 'FOREMAN INFIBUILT', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 7, category: 'REAL ESTATE AGENT', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'NALASOPARA', name: 'AFSAR', contact: '9833656094', rate: '', remarks: '', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 8, category: 'STEEL FABRICATOR', state: 'UP', city: 'AZAMGARH', area: 'KHORASAN RD', name: 'AFZAL', contact: '9919865531', rate: '', remarks: 'BHAI', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 9, category: 'REAL ESTATE AGENT', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'GOLIBAR SANTACRUZ', name: 'AHMAD', contact: '9820654678', rate: '', remarks: '', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 10, category: 'FITTER CIVIL', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ALAM', contact: '9594857081', rate: '', remarks: 'EXELLAR', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 11, category: 'PLUMBER', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'AB. ALEEM', contact: '7040128717', rate: '', remarks: '', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 12, category: 'ALAUDDIN', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'KHAR', name: 'ALAUDDIN', contact: '9082176017', rate: '', remarks: '', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 13, category: 'REAL ESTATE AGENT', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'GOLIBAR SANTACRUZ', name: 'AMEEN', contact: '8651701197', rate: '', remarks: '', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 14, category: 'REAL ESTATE AGENT', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'GOLIBAR SANTACRUZ', name: 'AMEEN', contact: '8356066174', rate: '', remarks: '', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 15, category: 'LABOUR FOREMAN', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ANAND', contact: '9987812062', rate: '', remarks: 'VINS PANDHRI', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 16, category: 'SECURITY', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ANKIT', contact: '8850150692', rate: '', remarks: '', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 17, category: 'CARPENTER (CIVIL)', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ANWAR', contact: '8291121852', rate: '', remarks: 'TDC JOGESHWARI', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 18, category: 'FITTER CIVIL (FOREMAN)', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ANZAR', contact: '8452093746', rate: '', remarks: 'FOREMAN INFIBUILT', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 19, category: 'CUTTING MASTER (CLOTH)', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ARIF', contact: '9326744015', rate: '', remarks: 'BANDA', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 20, category: 'LOADER/ UNLOADER', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'GOLIBAR SANTACRUZ', name: 'ARIF', contact: '9152353136', rate: '', remarks: '', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 21, category: 'LABOUR FOREMAN', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ARJUN', contact: '9867591724', rate: '', remarks: 'VINS PANDHRI', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 22, category: 'ELECTRICIAN', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ARSHAD KHEMA', contact: '9821423130', rate: '', remarks: '', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 23, category: 'LABOUR FOREMAN', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ARSHAD', contact: '9967804807', rate: '', remarks: 'VINS PANDHRI', sourceFile: 'File 1 - Field Verified Contacts' },
  { sr: 24, category: 'ELECTRICIAN', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ASIF', contact: '8452851383', rate: '', remarks: 'EXELLAR', sourceFile: 'File 1 - Field Verified Contacts' }
];

export const uploadedFile2Data: SeedRecord[] = [
  { sr: 1, category: 'ELECTRIC MATERIAL SUPPLIER', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'AB. GANI', contact: '7738130131', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 2, category: 'STEEL FABRICATOR', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'AB. AZEEM', contact: '9892803162', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 3, category: 'POP', state: 'MAHARASHTRA', city: 'NALASOPARA', area: 'NALASOPARA', name: 'AB.QADIR', contact: '8691841577', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 4, category: 'SCRAP', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'AB. SALAM', contact: '9022701290', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 5, category: 'CIVIL CONTRACTOR', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'AB. SATTAR', contact: '9820900355', company: 'EXELLAR LLP', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 6, category: 'PLUMBER', state: 'MAHARASHTRA', city: 'VASAI', area: 'VASAI', name: 'AB.ALIM', contact: '9172183386', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 7, category: 'CIVIL CONTRACTOR', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'AB. GAFFAR', contact: '9819412244', company: 'EXELLAR LLP', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 8, category: 'INTERIOR', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'AB. MATEEN', contact: '9768453417', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 9, category: 'LABOUR SUPPLIER', state: 'MAHARASHTRA', city: 'BORIVALI', area: 'BORIVALI', name: 'ABRAR KHAN', contact: '9769604510', company: '', remarks: 'PAGODA TEMPLE', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 10, category: 'CIVIL SUB CONTRACTOR', state: 'MAHARASHTRA', city: 'BANDRA', area: 'BANDRA', name: 'ABSAR QURESHI', contact: '9833252868', company: '', remarks: 'ANAS', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 11, category: 'INTERIOR', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ABU BAKAR REHMANI', contact: '9082523891', company: '', remarks: 'NIYAZ BHAI', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 12, category: 'CIVIL MATERIAL SUPPLIER', state: 'MAHARASHTRA', city: 'SANTACRUZ', area: 'GOLIBAR', name: 'ADIL KHAN', contact: '9702388886', company: '', remarks: 'GOLIBAR', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 13, category: 'CIVIL CONTRACTOR', state: 'MAHARASHTRA', city: 'PATHAN WADI', area: 'PATHAN WADI', name: 'ADIL BEHLIM', contact: '9773300380', company: '', remarks: 'SABOO', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 14, category: 'CIVIL SUB CONTRACTOR', state: 'MAHARASHTRA', city: 'SANTACRUZ', area: 'GOLIBAR', name: 'ADIL JATU', contact: '9699878614', company: '', remarks: 'GOLIBAR', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 15, category: 'HAIWA DUMPER', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'AFSAR', contact: '9833031222', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 16, category: 'HVAC', state: 'MAHARASHTRA', city: 'SANTACRUZ', area: 'SHASTRI COLONY', name: 'AKHTAR', contact: '8767301601', company: '', remarks: 'ANWAR BHAI SHASTRI COL', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 17, category: 'INTERIOR', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'AKRAM REHMANI', contact: '9820885977', company: '', remarks: 'NIYAZ BHAI', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 18, category: 'FITTER CIVIL', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ARSHAD', contact: '8898608857', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 19, category: 'CARPENTER CIVIL', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ARSHAD', contact: '8898608857', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 20, category: 'LABOUR SUPPLIER', state: 'MAHARASHTRA', city: 'BORIVALI', area: 'BORIVALI', name: 'ARUP', contact: '9967170806', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 21, category: 'CARPENTER CIVIL', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'AMARJEET RAWAT', contact: '9664784079', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 22, category: 'FITTER CIVIL', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'AMARJEET RAWAT', contact: '9664784079', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 23, category: 'TILING', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ALAM SABA', contact: '8767586022', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 24, category: 'PAINTER', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'WASEEM', contact: '8369238779', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 25, category: 'BLOCK WORK MASON', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ROSHAN MISHRA', contact: '8668756390', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 26, category: 'PLASTER MASON', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ROSHAN MISHRA', contact: '8668756390', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 27, category: 'POCLAIN', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ALFAIZ PATEL', contact: '8767571169', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 28, category: 'PILE BREAKER', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'AMRUDDIN', contact: '9987834962', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 29, category: 'PAINTER', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ANAND', contact: '9821151008', company: '', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 30, category: 'ALUMINIUM FABRICATOR', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MALVANI', name: 'ANSAR', contact: '8169022407', company: '', remarks: 'MALVANI', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 31, category: 'HVAC', state: 'MAHARASHTRA', city: 'SANTACRUZ', area: 'SHASTRI COLONY', name: 'ANWAR', contact: '9022352067', company: '', remarks: 'SHASTRI COLONY', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 32, category: 'CIVIL MATERIAL SUPPLIER', state: 'MAHARASHTRA', city: 'JOGESHWARI', area: 'JOGESHWARI', name: 'ARIF', contact: '9769807948', company: 'EXELLAR LLP', remarks: '', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 33, category: 'INTERIOR', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'AB.BARI', contact: '9322130075', company: '', remarks: 'ARMAN DAD', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 34, category: 'INTERIOR (RAW)', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MALVANI', name: 'ARSHAD', contact: '8108977578', company: '', remarks: 'MALVANI', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 35, category: 'WATERPROOFING', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ASHFAQ', contact: '9820222168', company: '', remarks: 'PUNIT', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 36, category: 'HAIWA DUMPER', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'KANDIVALI', name: 'ASHOK', contact: '8424953451', company: '', remarks: 'KANDIVALI', sourceFile: 'File 2 - Contractors & Suppliers' },
  { sr: 37, category: 'INTERIOR', state: 'MAHARASHTRA', city: 'MUMBAI', area: 'MUMBAI', name: 'ASIF', contact: '8286554890', company: '', remarks: 'CRESCENT', sourceFile: 'File 2 - Contractors & Suppliers' }
];

export async function uploadToSupabase() {
  console.log('--- Seeding Supabase with uploaded records ---');
  
  const allRecords: SeedRecord[] = [...uploadedFile1Data, ...uploadedFile2Data];
  const payloadRows: any[] = [];

  allRecords.forEach((item, idx) => {
    const prefix = item.sourceFile.includes('File 1') ? 'F1' : 'F2';
    const cleanName = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const id = `rec_${prefix}_${String(item.sr).padStart(2, '0')}_${cleanName}`;
    
    // Determine standardized role
    const catUpper = item.category.toUpperCase();
    let role = 'Vendor';
    if (
      catUpper.includes('MASON') ||
      catUpper.includes('FABRICATOR') ||
      catUpper.includes('REPAIR') ||
      catUpper.includes('FITTER') ||
      catUpper.includes('PLUMBER') ||
      catUpper.includes('CARPENTER') ||
      catUpper.includes('LOADER') ||
      catUpper.includes('LABOUR') ||
      catUpper.includes('ELECTRICIAN') ||
      catUpper.includes('PAINTER') ||
      catUpper.includes('TILING') ||
      catUpper.includes('POCLAIN') ||
      catUpper.includes('BREAKER') ||
      catUpper.includes('POP') ||
      catUpper.includes('DUMPER') ||
      catUpper.includes('WATERPROOFING')
    ) {
      role = 'Labour';
    } else if (catUpper.includes('SUPPLIER') || catUpper.includes('MATERIAL')) {
      role = 'Supplier';
    } else if (catUpper.includes('REAL ESTATE') || catUpper.includes('AGENT') || catUpper.includes('BROKER')) {
      role = 'Broker';
    } else if (catUpper.includes('CONTRACTOR')) {
      role = 'Vendor';
    }

    const standardizedDetails = {
      // Standard Columns matching User Uploads
      SR_NO: item.sr,
      CATEGORY: item.category,
      STATE: item.state,
      CITY: item.city,
      AREA: item.area || item.city,
      NAME: item.name,
      CONTACT: item.contact,
      COMPANY: item.company || (item.remarks && (item.remarks.includes('LLP') || item.remarks.includes('LTD') || item.remarks.includes('INFIBUILT')) ? item.remarks : ''),
      RATE: item.rate || 'Standard Verified Rate',
      REMARKS: item.remarks || '',
      
      // Normalized application fields
      id,
      category: item.category,
      state: item.state,
      city: item.city,
      area: item.area || item.city,
      name: item.name,
      fullName: item.name,
      contact: item.contact,
      mobile: item.contact,
      phone: item.contact,
      email: `${cleanName}@constructionmart.in`,
      company: item.company || (item.remarks && (item.remarks.includes('LLP') || item.remarks.includes('LTD') || item.remarks.includes('INFIBUILT')) ? item.remarks : ''),
      companyName: item.company || (item.remarks && (item.remarks.includes('LLP') || item.remarks.includes('LTD') || item.remarks.includes('INFIBUILT')) ? item.remarks : ''),
      rate: item.rate || 'Standard Verified Rate',
      charges: item.rate || 'Standard Verified Rate',
      remarks: item.remarks || '',
      role: role,
      status: 'Verified Live',
      verified: true,
      source: item.sourceFile,
      created_at: new Date().toISOString()
    };

    payloadRows.push({
      id,
      booking_type: 'registration',
      status: 'Verified Live',
      details: standardizedDetails,
      created_at: new Date().toISOString()
    });
  });

  console.log(`Prepared ${payloadRows.length} standardized records.`);

  // Upload to Supabase via Direct REST call
  const url = `${SUPABASE_URL}/rest/v1/bookings`;
  
  // Upload in chunks of 20 for safety
  const chunkSize = 20;
  let totalUploaded = 0;

  for (let i = 0; i < payloadRows.length; i += chunkSize) {
    const chunk = payloadRows.slice(i, i + chunkSize);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify(chunk)
    });

    if (res.ok) {
      totalUploaded += chunk.length;
      console.log(`✓ Uploaded batch ${Math.floor(i / chunkSize) + 1} (${totalUploaded}/${payloadRows.length}) to Supabase`);
    } else {
      const errTxt = await res.text();
      console.error(`✗ Error uploading chunk ${i}:`, res.status, errTxt);
    }
  }

  console.log(`\n🎉 SEED COMPLETED: ${totalUploaded} records uploaded live to Supabase PostgreSQL!`);
  return totalUploaded;
}

// Execute if run directly
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('seed_supabase_data')) {
  uploadToSupabase().catch(console.error);
}
