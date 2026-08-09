import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layers, 
  Building, 
  Zap, 
  Users, 
  Briefcase, 
  Package, 
  Wrench, 
  Truck, 
  Calendar, 
  Clock, 
  Moon, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  UserCheck, 
  Phone, 
  Sparkles, 
  FileText,
  MousePointerClick,
  Info,
  DollarSign,
  Search,
  HardHat,
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { UserRole } from '../types';
import { fetchAllBookings, saveBooking, removeBooking } from '../services/supabase';
import { ConstructionSection } from './portal/ConstructionSection';
import { InteriorSection } from './portal/InteriorSection';
import { SocietySection } from './portal/SocietySection';

interface ConstructionServicesPortalProps {
  currentRole: UserRole;
}

// --- MOCK DATA FOR SUB-TYPES ---
const INTERIOR_DATA = {
  engineers: [
    { id: 'ie1', name: 'Er. Sandeep Mehta', specialty: 'Interior Structure & Layout Engineer', experience: '10 Years', dailyRate: 2500, rating: 4.9 },
    { id: 'ie2', name: 'Er. Priya Patel', specialty: 'Acoustic & Lighting Engineer', experience: '8 Years', dailyRate: 2200, rating: 4.8 },
    { id: 'ie3', name: 'Er. Rajesh Iyer', specialty: 'HVAC & Ventilation Consultant', experience: '12 Years', dailyRate: 3000, rating: 4.9 }
  ],
  labours: [
    { id: 'il1', name: 'Raju Sharma', specialty: 'POP & False ceiling', experience: '6 Years', dailyRate: 750, rating: 4.8 },
    { id: 'il2', name: 'Vikram Singh', specialty: 'Furniture / Carpentry', experience: '8 Years', dailyRate: 900, rating: 4.9 },
    { id: 'il3', name: 'Mahesh Kevat', specialty: 'Paint & Wallpaper Designer', experience: '5 Years', dailyRate: 650, rating: 4.7 },
    { id: 'il4', name: 'Amit Patidar', specialty: 'Modular kitchen Installer', experience: '7 Years', dailyRate: 800, rating: 4.9 },
    { id: 'il5', name: 'Ganesh Shinde', specialty: 'Block work Specialist', experience: '8 Years', dailyRate: 850, rating: 4.8 },
    { id: 'il6', name: 'Satish Kamble', specialty: 'Tile/Marble fixing Mason', experience: '9 Years', dailyRate: 950, rating: 4.9 },
    { id: 'il7', name: 'Dinesh Yadav', specialty: 'Plumbing Expert', experience: '6 Years', dailyRate: 750, rating: 4.7 },
    { id: 'il8', name: 'Ramesh Solanki', specialty: 'Plaster Artisan', experience: '7 Years', dailyRate: 700, rating: 4.6 },
    { id: 'il9', name: 'Sunil Sen', specialty: 'Matress/Sofa Specialist', experience: '10 Years', dailyRate: 800, rating: 4.8 },
    { id: 'il10', name: 'Arjun Verma', specialty: 'Carpet installation Expert', experience: '5 Years', dailyRate: 600, rating: 4.7 },
    { id: 'il11', name: 'Vijay Patil', specialty: 'Waterproofing Specialist', experience: '8 Years', dailyRate: 900, rating: 4.9 },
    { id: 'il12', name: 'Pradeep Jha', specialty: 'CCTV installation Specialist', experience: '6 Years', dailyRate: 850, rating: 4.8 },
    { id: 'il13', name: 'Sanjay Mishra', specialty: 'Steel fabrication Welder', experience: '7 Years', dailyRate: 950, rating: 4.7 },
    { id: 'il14', name: 'Anil Gupta', specialty: 'Aluminium & Glass work Expert', experience: '9 Years', dailyRate: 900, rating: 4.8 }
  ],
  vendors: [
    { id: 'iv1', name: 'Creative Spaces Interior Studio', specialist: 'Modular Kitchens & Living Rooms', rating: 4.9, location: 'Mumbai West', completed: 142 },
    { id: 'iv2', name: 'Royale Paint & Decorators', specialist: 'Luxurious Wallpapers & Custom Textures', rating: 4.7, location: 'Navi Mumbai', completed: 89 },
    { id: 'iv3', name: 'DecoWood Carpenters Ltd', specialist: 'Bespoke Wardrobes & Veneer Polish', rating: 4.8, location: 'Thane', completed: 112 }
  ],
  materialsNew: [
    { id: 'imn1', name: 'CenturyPly Club Prime (19mm) - Waterproof Plywood', unit: 'sqft', price: 110, stock: 'High' },
    { id: 'imn2', name: 'Asian Paints Royale Luxury Velvet Emulsion (20L)', unit: 'bucket', price: 6200, stock: 'In Stock' },
    { id: 'imn3', name: 'Gyproc Gypsum Board False Ceiling 6x4', unit: 'sheet', price: 340, stock: 'High' },
    { id: 'imn4', name: 'Saint Gobain Tempered Toughened Glass (8mm)', unit: 'sqft', price: 160, stock: 'Limited' },
    { id: 'imn5', name: 'Premium Burma Teak Wood Margins', unit: 'running foot', price: 380, stock: 'Limited' }
  ],
  materialsRented: [
    { id: 'imr1', name: 'Modular Steel Props & Frames (False Ceiling setup)', unit: 'day', price: 15, stock: 'Available' },
    { id: 'imr2', name: 'Heavy Duty Aluminium Telescopic Ladders (12ft)', unit: 'day', price: 40, stock: 'Available' },
    { id: 'imr3', name: 'Materials Moving Trolleys & Shifting Cargo Crates', unit: 'day', price: 25, stock: 'Available' },
    { id: 'imr4', name: 'Temporary Acrylic Protective Floor Cover Sheets (100 sqft)', unit: 'day', price: 50, stock: 'Available' }
  ],
  machinesNew: [
    { id: 'imcn1', name: 'Bosch Professional GSB 13 RE Impact Drill Machine', type: 'Purchase Tool', price: 3805, unit: 'piece' },
    { id: 'imcn2', name: 'Stanley Paint Sprayer Pro 750W', type: 'Purchase Tool', price: 8500, unit: 'piece' },
    { id: 'imcn3', name: 'Makita Sheet Heavy Orbital Sander', type: 'Purchase Tool', price: 5200, unit: 'piece' },
    { id: 'imcn4', name: 'DeWalt Sliding Compound Miter Saw 10-inch', type: 'Purchase Tool', price: 16500, unit: 'piece' }
  ],
  machinesRented: [
    { id: 'imcr1', name: 'Hilti Heavy Hammer Drill (Demolition & Core)', type: 'Rental', price: 450, unit: 'day' },
    { id: 'imcr2', name: 'Wagner Airless Paint Sprayer (High Press)', type: 'Rental', price: 1200, unit: 'day' },
    { id: 'imcr3', name: 'Festool Special Orbital Wood Sander', type: 'Rental', price: 300, unit: 'day' },
    { id: 'imcr4', name: 'Industrial Wet & Dry Vacuum Dust Collector', type: 'Rental', price: 500, unit: 'day' }
  ]
};

const SOCIETY_DATA = {
  engineers: [
    { id: 'se1', name: 'Er. Rohan Deshmukh', specialty: 'Building Audit Consultant', experience: '15 Years', dailyRate: 4000, rating: 4.9 },
    { id: 'se2', name: 'Er. Alok Ranjan', specialty: 'Structural Repairs Specialist', experience: '12 Years', dailyRate: 3500, rating: 4.8 }
  ],
  labours: [
    { id: 'sl1', name: 'Karan Thapa', specialty: 'CCTV Specialist', experience: '5 Years', dailyRate: 900, rating: 4.7 },
    { id: 'sl2', name: 'Manish Rawat', specialty: 'Bore well Technician', experience: '8 Years', dailyRate: 1100, rating: 4.8 },
    { id: 'sl3', name: 'Sohan Lal', specialty: 'Sewer line cleaning Expert', experience: '7 Years', dailyRate: 850, rating: 4.6 },
    { id: 'sl4', name: 'Deepak Sawant', specialty: 'Waste management Operator', experience: '6 Years', dailyRate: 750, rating: 4.5 },
    { id: 'sl5', name: 'Rajesh Solanki', specialty: 'Housekeeping Professional', experience: '4 Years', dailyRate: 600, rating: 4.7 },
    { id: 'sl6', name: 'Baldev Singh', specialty: 'Security Guard Expert', experience: '10 Years', dailyRate: 800, rating: 4.9 },
    { id: 'sl7', name: 'Ramesh Lohar', specialty: 'Steel fabrication Welder', experience: '9 Years', dailyRate: 1000, rating: 4.8 },
    { id: 'sl8', name: 'Gopal Dutt', specialty: 'Family function decorator', experience: '6 Years', dailyRate: 850, rating: 4.7 }
  ],
  vendors: [
    { id: 'sv1', name: 'SecureShield Systems', specialist: 'Society CCTV & Security Setup', rating: 4.8, location: 'Mumbai Central', completed: 78 },
    { id: 'sv2', name: 'Swachh Bharat Waste Solutions', specialist: 'Zero Waste Systems', rating: 4.9, location: 'Thane', completed: 115 },
    { id: 'sv3', name: 'Gauri Decorators', specialist: 'Society Functions & Stage Lighting', rating: 4.7, location: 'Navi Mumbai', completed: 62 }
  ],
  materialsNew: [
    { id: 'smn1', name: 'D-Link Bullet CCTV Camera 4MP Outdoor', unit: 'piece', price: 2800, stock: 'In Stock' },
    { id: 'smn2', name: 'Submersible Borewell Pump 5HP Kirloskar', unit: 'unit', price: 22500, stock: 'High' },
    { id: 'smn3', name: 'Bio-Degradable Heavy Compost Bins', unit: 'unit', price: 4500, stock: 'In Stock' }
  ],
  materialsRented: [
    { id: 'smr1', name: 'Water-Jet Sewer Cleaning High Pressure Machine', unit: 'day', price: 2500, stock: 'Available' },
    { id: 'smr2', name: 'Halogen & LED Stage Lighting Truss Set', unit: 'day', price: 5000, stock: 'Available' }
  ],
  machinesNew: [
    { id: 'smcn1', name: 'Automatic Organic Waste Composter (250kg/day)', type: 'Purchase Asset', price: 340000, unit: 'unit' },
    { id: 'smcn2', name: 'Borewell Camera Scanning System Pro', type: 'Purchase Tool', price: 45000, unit: 'unit' }
  ],
  machinesRented: [
    { id: 'smcr1', name: 'Heavy Excavator/Boring Rig Machine', type: 'Rental', price: 15000, unit: 'day' },
    { id: 'smcr2', name: 'Industrial Floor Scrubbing & Sweeper Machine', type: 'Rental', price: 1200, unit: 'day' }
  ]
};

const CONSTRUCTION_PART_A_DATA = {
  labours: [
    { id: 'pa1', name: 'Sharma Timber Crafts', specialty: 'Carpenter Team', experience: '8 Years', dailyRate: 850, rating: 4.9 },
    { id: 'pa2', name: 'Rathod Steel Fitters', specialty: 'Fitter Crew', experience: '6 Years', dailyRate: 750, rating: 4.8 },
    { id: 'pa3', name: 'Verma Concrete Castings', specialty: 'Concrete Casting Squad', experience: '10 Years', dailyRate: 980, rating: 4.9 },
    { id: 'pa4', name: 'Mhatre Civil Plasters', specialty: 'Plaster Specialists', experience: '7 Years', dailyRate: 700, rating: 4.7 },
    { id: 'pa5', name: 'Solanki Masonry Works', specialty: 'Blockwork/Brickwork Crew', experience: '9 Years', dailyRate: 800, rating: 4.9 },
    { id: 'pa6', name: 'Maruti Tiles & Marbles', specialty: 'Tiles & Marble Installers', experience: '8 Years', dailyRate: 950, rating: 4.8 },
    { id: 'pa7', name: 'Apex Power Electrics', specialty: 'Electrician Shift', experience: '5 Years', dailyRate: 800, rating: 4.7 },
    { id: 'pa8', name: 'A-One Plumbers Mumbai', specialty: 'Plumbing Experts', experience: '7 Years', dailyRate: 750, rating: 4.8 },
    { id: 'pa9', name: 'Delhi POP Decorators', specialty: 'POP Artisans', experience: '6 Years', dailyRate: 800, rating: 4.6 },
    { id: 'pa10', name: 'Gypsum False Ceiling Pro', specialty: 'False Ceiling Experts', experience: '8 Years', dailyRate: 900, rating: 4.9 },
    { id: 'pa11', name: 'Suraksha Fire Fighting', specialty: 'Fire Fighting System Installers', experience: '12 Years', dailyRate: 1200, rating: 5.0 },
    { id: 'pa12', name: 'Stran Post-Tensioning', specialty: 'Post Tension Specialists', experience: '11 Years', dailyRate: 1500, rating: 4.9 },
    { id: 'pa13', name: 'Cico Waterproofing Co', specialty: 'Waterproofing Crew', experience: '8 Years', dailyRate: 900, rating: 4.8 },
    { id: 'pa14', name: 'Yadav Heavy Demolition', specialty: 'Breaker & Chipping Squad', experience: '5 Years', dailyRate: 850, rating: 4.6 },
    { id: 'pa15', name: 'Hilti & Core Cut Pros', specialty: 'Hilti & Core Cut Specialists', experience: '7 Years', dailyRate: 1100, rating: 4.9 },
    { id: 'pa16', name: 'National Steel Fabricators', specialty: 'Steel Fabricators', experience: '9 Years', dailyRate: 950, rating: 4.7 },
    { id: 'pa17', name: 'AluGlaze Fabricators', specialty: 'Aluminium Fabricators', experience: '6 Years', dailyRate: 850, rating: 4.8 },
    { id: 'pa18', name: 'Super Scaffolding Assembly', specialty: 'Scaffolding Riggers', experience: '10 Years', dailyRate: 1000, rating: 4.9 },
    { id: 'pa19', name: 'Vajra Steel Threading', specialty: 'Steel Threading Workers', experience: '5 Years', dailyRate: 750, rating: 4.7 },
    { id: 'pa20', name: 'Vadari Stone Crafts', specialty: 'Vadari Trad Stone Artisans', experience: '15 Years', dailyRate: 1300, rating: 5.0 },
    { id: 'pa21', name: 'Sneh Concrete Surface', specialty: 'Post Concrete Finishing Team', experience: '8 Years', dailyRate: 900, rating: 4.8 },
    { id: 'pa22', name: 'Hywa Dumper Logistics', specialty: 'Hywa Dumper Dispatch', experience: '11 Years', dailyRate: 2500, rating: 4.9 },
    { id: 'pa23', name: 'Mumbai Debris Disposal', specialty: 'Debris Disposal Crew', experience: '7 Years', dailyRate: 1400, rating: 4.6 },
    { id: 'pa24', name: 'CleanTech Mivan Cleaners', specialty: 'Mivan Acid Wash Squad', experience: '5 Years', dailyRate: 1100, rating: 4.7 }
  ],
  vendors: [
    { id: 'cav1', name: 'Apex Infrastructure Developers', specialist: 'High-Rise RCC & Foundation', rating: 4.8, location: 'Mumbai Central', completed: 34 },
    { id: 'cav2', name: 'Core Foundations & Piling', specialist: 'Piling, Shoring & Anchoring', rating: 4.9, location: 'Kalyan', completed: 57 }
  ],
  materialsNew: [
    { id: 'cmn1', name: 'Tata Tiscon TMT Fe 550D High-Strength Steel', unit: 'metric ton', price: 68500, stock: 'Immediately Available' },
    { id: 'cmn2', name: 'UltraTech Premium Weather Plus Cement', unit: 'bag', price: 410, stock: 'In Stock' },
    { id: 'cmn3', name: 'Red Clay Bricks (Class-A Ground Molded)', unit: '1000 pcs', price: 7500, stock: 'High' },
    { id: 'cmn4', name: 'River Sand V2 Double Washed', unit: 'brass', price: 6200, stock: 'High' },
    { id: 'cmn5', name: 'Ambuja Kawach Anti-Damp Waterproofing Cement', unit: 'bag', price: 450, stock: 'In Stock' }
  ],
  materialsRented: [
    { id: 'cmr1', name: 'Adjustable Cuplock H-Frame Scaffolding Set (Heavy)', unit: 'day', price: 45, stock: 'Available' },
    { id: 'cmr2', name: 'M.S. Steel Centering Plates (3x2 ft)', unit: 'day', price: 12, stock: 'Available' },
    { id: 'cmr3', name: 'Column Box Shuttering Heavy Steel Plates', unit: 'day', price: 30, stock: 'Available' },
    { id: 'cmr4', name: 'M.S. Support Props & Jack Supports (10ft)', unit: 'day', price: 8, stock: 'In Stock' }
  ],
  machinesNew: [
    { id: 'cmcn1', name: 'Kirloskar 5kVA Silent Diesel Generator Set', type: 'Purchase Heavy', price: 85000, unit: 'unit' },
    { id: 'cmcn2', name: 'Bosch Professional Heavy Breaker Hammer 11kg', type: 'Purchase Tool', price: 32000, unit: 'unit' },
    { id: 'cmcn3', name: 'Safari Reversible Drum Concrete Mixer 10/7', type: 'Purchase Heavy', price: 140000, unit: 'unit' },
    { id: 'cmcn4', name: 'Honda Engine Walk-Behind Petrol Floor Trowel', type: 'Purchase Tool', price: 58000, unit: 'unit' }
  ],
  machinesRented: [
    { id: 'cmcr1', name: 'Concrete Mixer Heavy Machine (10/7 CFT)', type: 'Rental', price: 1500, unit: 'day' },
    { id: 'cmcr2', name: 'Plate Soil Compactor (5 Ton Engine)', type: 'Rental', price: 1100, unit: 'day' },
    { id: 'cmcr3', name: 'Steel Bar Cutting Industrial Machine', type: 'Rental', price: 800, unit: 'day' },
    { id: 'cmcr4', name: 'Multi-Storey Tower Hoist Lift Machine (30 Meters)', type: 'Rental', price: 2500, unit: 'day' }
  ]
};

const CONSTRUCTION_DATA = {
  engineers: [
    { id: 'ce1', name: 'Er. Manoj Kumar', specialty: 'Chief Structural Engineer & RCC Specialist', experience: '15 Years', dailyRate: 5000, rating: 4.9 },
    { id: 'ce2', name: 'Er. Sneha Sharma', specialty: 'Geotechnical & Soil Testing Consultant', experience: '12 Years', dailyRate: 4500, rating: 4.8 },
    { id: 'ce3', name: 'Er. Amit Verma', specialty: 'Project Management & Surveying Specialist', experience: '14 Years', dailyRate: 6000, rating: 5.0 }
  ],
  labours: [
    { id: 'pb1', name: 'Mahabali Diggers Ltd', specialty: 'Excavation Crews', experience: '10 Years', dailyRate: 1800, rating: 4.9 },
    { id: 'pb2', name: 'Destroyers Shuttering & Demolition', specialty: 'Demolition Services', experience: '8 Years', dailyRate: 1500, rating: 4.8 },
    { id: 'pb3', name: 'Krishna Brushmasters', specialty: 'Painter Teams', experience: '7 Years', dailyRate: 750, rating: 4.7 },
    { id: 'pb4', name: 'Mumbai Scrap Recyclers', specialty: 'Scrap Clearing Workers', experience: '12 Years', dailyRate: 900, rating: 4.9 },
    { id: 'pb5', name: 'Luxury Lighting Designers', specialty: 'Home Decor Electrician', experience: '6 Years', dailyRate: 950, rating: 4.8 },
    { id: 'pb6', name: 'Vajra Foundation Engineers', specialty: 'Piling Specialized Crew', experience: '11 Years', dailyRate: 3500, rating: 5.0 },
    { id: 'pb7', name: 'Kalyan RMC Pump Operators', specialty: 'RMC Pump Placing Teams', experience: '9 Years', dailyRate: 2200, rating: 4.7 },
    { id: 'pb8', name: 'Om Borewells & Tubewells', specialty: 'Bore Well Drillers', experience: '14 Years', dailyRate: 4000, rating: 4.9 },
    { id: 'pb9', name: 'RetroGlaze Structural Facades', specialty: 'Facade Glazing Technicians', experience: '8 Years', dailyRate: 1600, rating: 4.8 },
    { id: 'pb10', name: 'Apex Rigging & Crane Ops', specialty: 'Tower Crane Operator & Signal Man', experience: '10 Years', dailyRate: 1800, rating: 4.9 },
    { id: 'pb11', name: 'HeavyLift Crane Dispatch', specialty: 'Crane Service Operators', experience: '12 Years', dailyRate: 4800, rating: 5.0 },
    { id: 'pb12', name: 'TUV Inspect Safe', specialty: 'Crane TPI Experts', experience: '15 Years', dailyRate: 3200, rating: 4.9 },
    { id: 'pb13', name: 'GuardEye Security Installations', specialty: 'CCTV Technicians', experience: '6 Years', dailyRate: 1200, rating: 4.8 },
    { id: 'pb14', name: 'CoolClimate HVAC Comforts', specialty: 'AC Ducting & Installers', experience: '8 Years', dailyRate: 1100, rating: 4.7 },
    { id: 'pb15', name: 'Municipal sewer connector', specialty: 'Sewer Connection Technicians', experience: '9 Years', dailyRate: 1550, rating: 4.8 },
    { id: 'pb16', name: 'Mahavir Precast Concrete', specialty: 'Precast Materials', experience: '8 Years', dailyRate: 2100, rating: 4.9 },
    { id: 'pb17', name: 'Yadav Cover Block & Kanda Maker', specialty: 'Cover and Kanda Maker', experience: '6 Years', dailyRate: 700, rating: 4.7 },
    { id: 'pb18', name: 'Kirloskar Pump Repairs', specialty: 'Dewatering Pump Repairs', experience: '11 Years', dailyRate: 1300, rating: 4.8 }
  ],
  vendors: [
    { id: 'cv1', name: 'Apex Infrastructure Developers', specialist: 'High-Rise RCC & Foundation', rating: 4.8, location: 'Mumbai Central', completed: 34 },
    { id: 'cv2', name: 'Core Foundations & Piling', specialist: 'Piling, Shoring & Anchoring', rating: 4.9, location: 'Kalyan', completed: 57 }
  ],
  materialsNew: [
    { id: 'cmn1', name: 'Tata Tiscon TMT Fe 550D High-Strength Steel', unit: 'metric ton', price: 68500, stock: 'Immediately Available' },
    { id: 'cmn2', name: 'UltraTech Premium Weather Plus Cement', unit: 'bag', price: 410, stock: 'In Stock' },
    { id: 'cmn3', name: 'Red Clay Bricks (Class-A Ground Molded)', unit: '1000 pcs', price: 7500, stock: 'High' },
    { id: 'cmn4', name: 'River Sand V2 Double Washed', unit: 'brass', price: 6200, stock: 'High' },
    { id: 'cmn5', name: 'Ambuja Kawach Anti-Damp Waterproofing Cement', unit: 'bag', price: 450, stock: 'In Stock' }
  ],
  materialsRented: [
    { id: 'cmr1', name: 'Adjustable Cuplock H-Frame Scaffolding Set (Heavy)', unit: 'day', price: 45, stock: 'Available' },
    { id: 'cmr2', name: 'M.S. Steel Centering Plates (3x2 ft)', unit: 'day', price: 12, stock: 'Available' },
    { id: 'cmr3', name: 'Column Box Shuttering Heavy Steel Plates', unit: 'day', price: 30, stock: 'Available' },
    { id: 'cmr4', name: 'M.S. Support Props & Jack Supports (10ft)', unit: 'day', price: 8, stock: 'In Stock' }
  ],
  machinesNew: [
    { id: 'cmcn1', name: 'Kirloskar 5kVA Silent Diesel Generator Set', type: 'Purchase Heavy', price: 85000, unit: 'unit' },
    { id: 'cmcn2', name: 'Bosch Professional Heavy Breaker Hammer 11kg', type: 'Purchase Tool', price: 32000, unit: 'unit' },
    { id: 'cmcn3', name: 'Safari Reversible Drum Concrete Mixer 10/7', type: 'Purchase Heavy', price: 140000, unit: 'unit' },
    { id: 'cmcn4', name: 'Honda Engine Walk-Behind Petrol Floor Trowel', type: 'Purchase Tool', price: 58000, unit: 'unit' }
  ],
  machinesRented: [
    { id: 'cmcr1', name: 'Concrete Mixer Heavy Machine (10/7 CFT)', type: 'Rental', price: 1500, unit: 'day' },
    { id: 'cmcr2', name: 'Plate Soil Compactor (5 Ton Engine)', type: 'Rental', price: 1100, unit: 'day' },
    { id: 'cmcr3', name: 'Steel Bar Cutting Industrial Machine', type: 'Rental', price: 800, unit: 'day' },
    { id: 'cmcr4', name: 'Multi-Storey Tower Hoist Lift Machine (30 Meters)', type: 'Rental', price: 2500, unit: 'day' }
  ],
  vehicles: [
    { id: 'cvh1', name: 'JCB 3DX Backhoe Loader', rate: 1200, unit: 'hour', availability: 'Immediate' },
    { id: 'cvh2', name: 'Transit Mixer (6 Cum)', rate: 1800, unit: 'trip', availability: 'Book in advance' },
    { id: 'cvh3', name: 'Tata 10-Wheeler Dumper', rate: 4500, unit: 'day', availability: 'Immediate' },
    { id: 'cvh4', name: 'Hydra 14 Ton Pick and Carry Crane', rate: 1400, unit: 'hour', availability: 'On Request' }
  ]
};

// --- TYPES FOR INSTANT LABOURS BOOKING ---
interface HourlyBooking {
  id: string;
  laborType: string;
  count: number;
  timeSlot: '1_day_before' | '2nd_half_of_day' | 'night_work';
  status: 'broadcasting' | 'confirmed_by_labor' | 'finalized';
  labourWhoConfirmed?: string;
  phone?: string;
  rating?: number;
  timestamp: string;
}

export const ConstructionServicesPortal: React.FC<ConstructionServicesPortalProps> = ({ currentRole }) => {
  const [activeSegment, setActiveSegment] = useState<'interior' | 'construction' | 'society' | null>('construction');
  const [constructionPart, setConstructionPart] = useState<'part_a' | 'part_b'>('part_a');
  
  // Search query states
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');

  // Sub-tabs
  const [interiorSubTab, setInteriorSubTab] = useState<'engineers' | 'labours' | 'vendors' | 'materials' | 'machines'>('engineers');
  const [constructionSubTab, setConstructionSubTab] = useState<'engineers' | 'labours' | 'vendors' | 'materials' | 'machines' | 'vehicles'>('engineers');
  const [societySubTab, setSocietySubTab] = useState<'engineers' | 'labours' | 'vendors' | 'materials' | 'machines'>('engineers');

  // New vs Rented selection modes
  const [interiorMaterialMode, setInteriorMaterialMode] = useState<'new' | 'rented'>('new');
  const [interiorMachineMode, setInteriorMachineMode] = useState<'new' | 'rented'>('rented');
  const [constructionMaterialMode, setConstructionMaterialMode] = useState<'new' | 'rented'>('new');
  const [constructionMachineMode, setConstructionMachineMode] = useState<'new' | 'rented'>('rented');
  const [societyMaterialMode, setSocietyMaterialMode] = useState<'new' | 'rented'>('new');
  const [societyMachineMode, setSocietyMachineMode] = useState<'new' | 'rented'>('rented');

  // Reset applied search on tab/sub-tab change
  useEffect(() => {
    setSearchQuery('');
    setAppliedSearchQuery('');
  }, [activeSegment, interiorSubTab, constructionSubTab, societySubTab, constructionPart, interiorMaterialMode, interiorMachineMode, constructionMaterialMode, constructionMachineMode, societyMaterialMode, societyMachineMode]);

  // Filtered lists based on search query
  const filteredInteriorEngineers = useMemo(() => {
    if (!appliedSearchQuery) return INTERIOR_DATA.engineers;
    const q = appliedSearchQuery.toLowerCase();
    return INTERIOR_DATA.engineers.filter(eng => 
      eng.name.toLowerCase().includes(q) || 
      eng.specialty.toLowerCase().includes(q)
    );
  }, [appliedSearchQuery]);

  const filteredInteriorLabours = useMemo(() => {
    if (!appliedSearchQuery) return INTERIOR_DATA.labours;
    const q = appliedSearchQuery.toLowerCase();
    return INTERIOR_DATA.labours.filter(lab => 
      lab.name.toLowerCase().includes(q) || 
      lab.specialty.toLowerCase().includes(q)
    );
  }, [appliedSearchQuery]);

  const filteredInteriorVendors = useMemo(() => {
    if (!appliedSearchQuery) return INTERIOR_DATA.vendors;
    const q = appliedSearchQuery.toLowerCase();
    return INTERIOR_DATA.vendors.filter(v => 
      v.name.toLowerCase().includes(q) || 
      v.specialist.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q)
    );
  }, [appliedSearchQuery]);

  const filteredInteriorMaterials = useMemo(() => {
    const list = interiorMaterialMode === 'new' ? INTERIOR_DATA.materialsNew : INTERIOR_DATA.materialsRented;
    if (!appliedSearchQuery) return list;
    const q = appliedSearchQuery.toLowerCase();
    return list.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.unit.toLowerCase().includes(q)
    );
  }, [interiorMaterialMode, appliedSearchQuery]);

  const filteredInteriorMachines = useMemo(() => {
    const list = interiorMachineMode === 'new' ? INTERIOR_DATA.machinesNew : INTERIOR_DATA.machinesRented;
    if (!appliedSearchQuery) return list;
    const q = appliedSearchQuery.toLowerCase();
    return list.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.unit.toLowerCase().includes(q)
    );
  }, [interiorMachineMode, appliedSearchQuery]);

  const filteredConstructionEngineers = useMemo(() => {
    if (!appliedSearchQuery) return CONSTRUCTION_DATA.engineers;
    const q = appliedSearchQuery.toLowerCase();
    return CONSTRUCTION_DATA.engineers.filter(eng => 
      eng.name.toLowerCase().includes(q) || 
      eng.specialty.toLowerCase().includes(q)
    );
  }, [appliedSearchQuery]);

  const filteredConstructionLabours = useMemo(() => {
    const list = constructionPart === 'part_a' ? CONSTRUCTION_PART_A_DATA.labours : CONSTRUCTION_DATA.labours;
    if (!appliedSearchQuery) return list;
    const q = appliedSearchQuery.toLowerCase();
    return list.filter(lab => 
      lab.name.toLowerCase().includes(q) || 
      lab.specialty.toLowerCase().includes(q)
    );
  }, [constructionPart, appliedSearchQuery]);

  const filteredConstructionVendors = useMemo(() => {
    if (!appliedSearchQuery) return CONSTRUCTION_DATA.vendors;
    const q = appliedSearchQuery.toLowerCase();
    return CONSTRUCTION_DATA.vendors.filter(v => 
      v.name.toLowerCase().includes(q) || 
      v.specialist.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q)
    );
  }, [appliedSearchQuery]);

  const filteredConstructionMaterials = useMemo(() => {
    const list = constructionMaterialMode === 'new' ? CONSTRUCTION_DATA.materialsNew : CONSTRUCTION_DATA.materialsRented;
    if (!appliedSearchQuery) return list;
    const q = appliedSearchQuery.toLowerCase();
    return list.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.unit.toLowerCase().includes(q)
    );
  }, [constructionMaterialMode, appliedSearchQuery]);

  const filteredConstructionMachines = useMemo(() => {
    const list = constructionMachineMode === 'new' ? CONSTRUCTION_DATA.machinesNew : CONSTRUCTION_DATA.machinesRented;
    if (!appliedSearchQuery) return list;
    const q = appliedSearchQuery.toLowerCase();
    return list.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.unit.toLowerCase().includes(q)
    );
  }, [constructionMachineMode, appliedSearchQuery]);

  const filteredConstructionVehicles = useMemo(() => {
    if (!appliedSearchQuery) return CONSTRUCTION_DATA.vehicles;
    const q = appliedSearchQuery.toLowerCase();
    return CONSTRUCTION_DATA.vehicles.filter(v => 
      v.name.toLowerCase().includes(q) || 
      v.unit.toLowerCase().includes(q) ||
      v.availability.toLowerCase().includes(q)
    );
  }, [appliedSearchQuery]);

  const filteredSocietyEngineers = useMemo(() => {
    if (!appliedSearchQuery) return SOCIETY_DATA.engineers;
    const q = appliedSearchQuery.toLowerCase();
    return SOCIETY_DATA.engineers.filter(eng => 
      eng.name.toLowerCase().includes(q) || 
      eng.specialty.toLowerCase().includes(q)
    );
  }, [appliedSearchQuery]);

  const filteredSocietyLabours = useMemo(() => {
    if (!appliedSearchQuery) return SOCIETY_DATA.labours;
    const q = appliedSearchQuery.toLowerCase();
    return SOCIETY_DATA.labours.filter(lab => 
      lab.name.toLowerCase().includes(q) || 
      lab.specialty.toLowerCase().includes(q)
    );
  }, [appliedSearchQuery]);

  const filteredSocietyVendors = useMemo(() => {
    if (!appliedSearchQuery) return SOCIETY_DATA.vendors;
    const q = appliedSearchQuery.toLowerCase();
    return SOCIETY_DATA.vendors.filter(v => 
      v.name.toLowerCase().includes(q) || 
      v.specialist.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q)
    );
  }, [appliedSearchQuery]);

  const filteredSocietyMaterials = useMemo(() => {
    const list = societyMaterialMode === 'new' ? SOCIETY_DATA.materialsNew : SOCIETY_DATA.materialsRented;
    if (!appliedSearchQuery) return list;
    const q = appliedSearchQuery.toLowerCase();
    return list.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.unit.toLowerCase().includes(q)
    );
  }, [societyMaterialMode, appliedSearchQuery]);

  const filteredSocietyMachines = useMemo(() => {
    const list = societyMachineMode === 'new' ? SOCIETY_DATA.machinesNew : SOCIETY_DATA.machinesRented;
    if (!appliedSearchQuery) return list;
    const q = appliedSearchQuery.toLowerCase();
    return list.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.unit.toLowerCase().includes(q)
    );
  }, [societyMachineMode, appliedSearchQuery]);

  // Instant Labour form inputs
  const [instantLaborType, setInstantLaborType] = useState('Carpenter Team (Part A)');
  const [instantCount, setInstantCount] = useState(3);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'1_day_before' | '2nd_half_of_day' | 'night_work'>('1_day_before');

  // List of bookings (persisted in local state)
  const [bookings, setBookings] = useState<HourlyBooking[]>([
    {
      id: 'B-8492',
      laborType: 'Fitter Crew (Part A)',
      count: 4,
      timeSlot: 'night_work',
      status: 'finalized',
      labourWhoConfirmed: 'Devendra Patil (Contractor Representative)',
      phone: '+91 94220 88910',
      rating: 4.9,
      timestamp: 'Today, 2:30 PM'
    }
  ]);

  // Load hourly bookings from Supabase on component mount
  useEffect(() => {
    const loadSupabaseHourlyBookings = async () => {
      const records = await fetchAllBookings();
      const hourlyRecords = records
        .filter(r => r.booking_type === 'hourly')
        .map(r => r.details);
      
      if (hourlyRecords.length > 0) {
        setBookings(hourlyRecords);
      }
    };
    loadSupabaseHourlyBookings();
  }, []);

  // Sync hourly bookings to Supabase on state change
  useEffect(() => {
    const syncToSupabase = async () => {
      for (const booking of bookings) {
        await saveBooking(booking.id, 'hourly', booking.status, booking);
      }
    };
    syncToSupabase();
  }, [bookings]);

  const [activeBooking, setActiveBooking] = useState<HourlyBooking | null>(null);
  
  // Interactive triggers for user action feedback
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Auto response timer to simulate labor acceptance
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (activeBooking && activeBooking.status === 'broadcasting') {
      timeout = setTimeout(() => {
        setBookings(prev => 
          prev.map(b => {
            if (b.id === activeBooking.id) {
              return {
                ...b,
                status: 'confirmed_by_labor',
                labourWhoConfirmed: getRandomLabourName(b.laborType),
                phone: '+91 98334 ' + Math.floor(10000 + Math.random() * 90000),
                rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1))
              };
            }
            return b;
          })
        );
        // Sync active booking details
        setActiveBooking(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: 'confirmed_by_labor',
            labourWhoConfirmed: getRandomLabourName(prev.laborType),
            phone: '+91 98334 ' + Math.floor(10000 + Math.random() * 90000),
            rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1))
          };
        });
        showFeedback('Labour has response for your bid! Please finalize booking now.', 'info');
      }, 4000); // Wait 4 seconds for an authentic responsive feel
    }
    return () => clearTimeout(timeout);
  }, [activeBooking?.status]);

  const getRandomLabourName = (type: string) => {
    const firstNames = ['Ramchandra', 'Sanjay', 'Satish', 'Jagdish', 'Bhagwan', 'Santosh', 'Surendra', 'Kishore'];
    const lastNames = ['Kharat', 'Mhatre', 'Rathod', 'Chavan', 'Waghela', 'Shinde', 'Solanki', 'Paswan'];
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${fn} ${ln} & Heavy Team (${type})`;
  };

  const showFeedback = (text: string, type: 'success' | 'info') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleInstantBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `B-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBk: HourlyBooking = {
      id: newId,
      laborType: instantLaborType,
      count: instantCount,
      timeSlot: selectedTimeSlot,
      status: 'broadcasting',
      timestamp: 'Just now'
    };
    
    setBookings(prev => [newBk, ...prev]);
    setActiveBooking(newBk);
    showFeedback(`Your instant labour request ${newId} has been broadcasted successfully!`, 'success');
  };

  // State update to confirm/finalize order
  const confirmAsLabourManually = (bookingId: string) => {
    setBookings(prev => 
      prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'confirmed_by_labor',
            labourWhoConfirmed: getRandomLabourName(b.laborType),
            phone: '+91 97881 ' + Math.floor(10000 + Math.random() * 90000),
            rating: 4.8
          };
        }
        return b;
      })
    );
    setActiveBooking(prev => {
      if (!prev || prev.id !== bookingId) return prev;
      return {
        ...prev,
        status: 'confirmed_by_labor',
        labourWhoConfirmed: getRandomLabourName(prev.laborType),
        phone: '+91 97881 ' + Math.floor(10000 + Math.random() * 90000),
        rating: 4.8
      };
    });
    showFeedback('Simulated manual Labour acceptance!', 'info');
  };

  const finalizeBooking = (bookingId: string) => {
    setBookings(prev => 
      prev.map(b => {
        if (b.id === bookingId) {
          return { ...b, status: 'finalized' };
        }
        return b;
      })
    );
    setActiveBooking(prev => {
      if (!prev || prev.id !== bookingId) return prev;
      return { ...prev, status: 'finalized' };
    });
    showFeedback('Successfully finalized the book structure! Team dispatched.', 'success');
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    if (activeBooking?.id === id) {
      setActiveBooking(null);
    }
    removeBooking(id);
  };

  return (
    <div id="construction-services-portal-section" className="bg-white rounded-2xl border border-gray-150 shadow-md p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-300">
      
      {/* Header Info Banner */}
      <div className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-orange-500 to-amber-600 text-white rounded-2xl shadow-md">
            <Layers className="animate-pulse" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              Construction Mart SHK Pro Services
              <span className="text-[10px] bg-orange-100 text-orange-850 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Console
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              On-demand construction and interior & renovation services dispatcher for {currentRole === UserRole.CLIENT ? 'Clients' : 'Contractors & Vendors'}
            </p>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className={`p-4 rounded-xl flex items-center justify-between border ${
          feedbackMsg.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-blue-50 border-blue-200 text-blue-800'
        } animate-in slide-in-from-top-2`}>
          <div className="flex items-center gap-2.5 text-sm font-semibold">
            {feedbackMsg.type === 'success' ? <CheckCircle2 size={18} className="text-green-600" /> : <Info size={18} className="text-blue-600" />}
            {feedbackMsg.text}
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-xs font-bold text-gray-400 hover:text-gray-600">Dismiss</button>
        </div>
      )}

      {/* 3 Services Rows - Each heading row with its catalog & dispatch coming just below it */}
      <div className="space-y-4 w-full">
        {/* ROW 1: 1) Construction Services */}
        <div className="border border-gray-800 rounded-2xl overflow-hidden bg-white shadow-md transition-all">
          <button 
            id="part-construction-tab"
            onClick={() => setActiveSegment(activeSegment === 'construction' ? null : 'construction')}
            className={`w-full flex items-center justify-between p-3.5 sm:p-4 text-left transition-all cursor-pointer bg-gradient-to-r from-gray-950 via-slate-900 to-stone-900 hover:from-black hover:to-slate-950 text-white ${
              activeSegment === 'construction' ? 'ring-2 ring-orange-500 shadow-lg border-b border-orange-500/40' : 'border-b border-gray-800'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2.5 rounded-xl shrink-0 transition-colors bg-orange-600/30 text-orange-400 border border-orange-500/30 shadow-xs">
                <Building size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-black tracking-wide text-white">
                    1) Construction Services
                  </span>
                  {activeSegment === 'construction' ? (
                    <span className="text-[10px] bg-orange-600 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      Active View
                    </span>
                  ) : (
                    <span className="text-[10px] bg-gray-800 text-orange-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-orange-500/30">
                      Click to Open
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5 truncate sm:whitespace-normal text-gray-300">
                  Civil engineers, contractors, masons, bar benders, concrete, steel, earthmovers & equipment hire
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="hidden sm:inline-block text-xs font-bold px-3 py-1.5 rounded-lg transition-colors bg-orange-600 text-white shadow-sm hover:bg-orange-700">
                {activeSegment === 'construction' ? 'Hide Section' : 'Open Catalog & Dispatch →'}
              </span>
              <div className="p-1.5 rounded-lg bg-gray-800 text-orange-400 border border-gray-700">
                {activeSegment === 'construction' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>
          </button>

          {/* Construction Services catalog and dispatch coming just below Row 1 */}
          {activeSegment === 'construction' && (
            <div className="p-4 sm:p-6 border-t border-gray-150 bg-white">
              <ConstructionSection
                currentRole={currentRole}
                constructionPart={constructionPart}
                setConstructionPart={setConstructionPart}
                constructionSubTab={constructionSubTab}
                setConstructionSubTab={setConstructionSubTab}
                constructionMaterialMode={constructionMaterialMode}
                setConstructionMaterialMode={setConstructionMaterialMode}
                constructionMachineMode={constructionMachineMode}
                setConstructionMachineMode={setConstructionMachineMode}
                filteredConstructionEngineers={filteredConstructionEngineers}
                filteredConstructionLabours={filteredConstructionLabours}
                filteredConstructionVendors={filteredConstructionVendors}
                filteredConstructionMaterials={filteredConstructionMaterials}
                filteredConstructionMachines={filteredConstructionMachines}
                filteredConstructionVehicles={filteredConstructionVehicles}
                showFeedback={showFeedback}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                appliedSearchQuery={appliedSearchQuery}
                setAppliedSearchQuery={setAppliedSearchQuery}
              />
            </div>
          )}
        </div>

        {/* ROW 2: 2) Interior Services */}
        <div className="border border-gray-800 rounded-2xl overflow-hidden bg-white shadow-md transition-all">
          <button 
            id="part-interior-tab"
            onClick={() => setActiveSegment(activeSegment === 'interior' ? null : 'interior')}
            className={`w-full flex items-center justify-between p-3.5 sm:p-4 text-left transition-all cursor-pointer bg-gradient-to-r from-stone-950 via-zinc-900 to-slate-900 hover:from-black hover:to-zinc-950 text-white ${
              activeSegment === 'interior' ? 'ring-2 ring-amber-500 shadow-lg border-b border-amber-500/40' : 'border-b border-gray-800'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2.5 rounded-xl shrink-0 transition-colors bg-amber-600/30 text-amber-400 border border-amber-500/30 shadow-xs">
                <Layers size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-black tracking-wide text-white">
                    2) Interior Services
                  </span>
                  {activeSegment === 'interior' ? (
                    <span className="text-[10px] bg-amber-600 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      Active View
                    </span>
                  ) : (
                    <span className="text-[10px] bg-gray-800 text-amber-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-500/30">
                      Click to Open
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5 truncate sm:whitespace-normal text-gray-300">
                  Architects, interior designers, modular kitchens, false ceilings, painters, carpenters & materials
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="hidden sm:inline-block text-xs font-bold px-3 py-1.5 rounded-lg transition-colors bg-amber-600 text-white shadow-sm hover:bg-amber-700">
                {activeSegment === 'interior' ? 'Hide Section' : 'Open Catalog & Dispatch →'}
              </span>
              <div className="p-1.5 rounded-lg bg-gray-800 text-amber-400 border border-gray-700">
                {activeSegment === 'interior' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>
          </button>

          {/* Interior Services catalog and dispatch coming just below Row 2 */}
          {activeSegment === 'interior' && (
            <div className="p-4 sm:p-6 border-t border-gray-150 bg-white">
              <InteriorSection
                currentRole={currentRole}
                interiorSubTab={interiorSubTab}
                setInteriorSubTab={setInteriorSubTab}
                interiorMaterialMode={interiorMaterialMode}
                setInteriorMaterialMode={setInteriorMaterialMode}
                interiorMachineMode={interiorMachineMode}
                setInteriorMachineMode={setInteriorMachineMode}
                filteredInteriorEngineers={filteredInteriorEngineers}
                filteredInteriorLabours={filteredInteriorLabours}
                filteredInteriorVendors={filteredInteriorVendors}
                filteredInteriorMaterials={filteredInteriorMaterials}
                filteredInteriorMachines={filteredInteriorMachines}
                showFeedback={showFeedback}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                appliedSearchQuery={appliedSearchQuery}
                setAppliedSearchQuery={setAppliedSearchQuery}
              />
            </div>
          )}
        </div>

        {/* ROW 3: 3) Society Services */}
        <div className="border border-gray-800 rounded-2xl overflow-hidden bg-white shadow-md transition-all">
          <button 
            id="part-society-tab"
            onClick={() => setActiveSegment(activeSegment === 'society' ? null : 'society')}
            className={`w-full flex items-center justify-between p-3.5 sm:p-4 text-left transition-all cursor-pointer bg-gradient-to-r from-slate-950 via-gray-900 to-blue-950 hover:from-black hover:to-slate-950 text-white ${
              activeSegment === 'society' ? 'ring-2 ring-blue-500 shadow-lg border-b border-blue-500/40' : 'border-b border-gray-800'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2.5 rounded-xl shrink-0 transition-colors bg-blue-600/30 text-blue-400 border border-blue-500/30 shadow-xs">
                <Shield size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-black tracking-wide text-white">
                    3) Society Services
                  </span>
                  {activeSegment === 'society' ? (
                    <span className="text-[10px] bg-blue-600 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      Active View
                    </span>
                  ) : (
                    <span className="text-[10px] bg-gray-800 text-blue-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-500/30">
                      Click to Open
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5 truncate sm:whitespace-normal text-gray-300">
                  Structural audits, society repair contractors, security, water tank cleaning, lifts & facility maintenance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="hidden sm:inline-block text-xs font-bold px-3 py-1.5 rounded-lg transition-colors bg-blue-600 text-white shadow-sm hover:bg-blue-700">
                {activeSegment === 'society' ? 'Hide Section' : 'Open Catalog & Dispatch →'}
              </span>
              <div className="p-1.5 rounded-lg bg-gray-800 text-blue-400 border border-gray-700">
                {activeSegment === 'society' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>
          </button>

          {/* Society Services catalog and dispatch coming just below Row 3 */}
          {activeSegment === 'society' && (
            <div className="p-4 sm:p-6 border-t border-gray-150 bg-white">
              <SocietySection
                currentRole={currentRole}
                societySubTab={societySubTab}
                setSocietySubTab={setSocietySubTab}
                societyMaterialMode={societyMaterialMode}
                setSocietyMaterialMode={setSocietyMaterialMode}
                societyMachineMode={societyMachineMode}
                setSocietyMachineMode={setSocietyMachineMode}
                filteredSocietyEngineers={filteredSocietyEngineers}
                filteredSocietyLabours={filteredSocietyLabours}
                filteredSocietyVendors={filteredSocietyVendors}
                filteredSocietyMaterials={filteredSocietyMaterials}
                filteredSocietyMachines={filteredSocietyMachines}
                showFeedback={showFeedback}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                appliedSearchQuery={appliedSearchQuery}
                setAppliedSearchQuery={setAppliedSearchQuery}
              />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
