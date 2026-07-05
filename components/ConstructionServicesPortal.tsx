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
  Shield
} from 'lucide-react';
import { UserRole } from '../types';
import { fetchAllBookings, saveBooking, removeBooking } from '../services/supabase';

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
  const [activeSegment, setActiveSegment] = useState<'interior' | 'construction' | 'society' | 'instant'>('interior');
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-orange-500 to-amber-600 text-white rounded-2xl shadow-md">
            <Layers className="animate-pulse" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              Construction Mart Pro Services
              <span className="text-[10px] bg-orange-100 text-orange-850 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Console
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              On-demand construction and interior & renovation services dispatcher for {currentRole === UserRole.CLIENT ? 'Clients' : 'Contractors & Vendors'}
            </p>
          </div>
        </div>

        {/* Top-Level Parts Navigation Bar */}
        <div className="grid grid-cols-2 sm:flex w-full sm:w-auto bg-gray-50 p-1.5 rounded-xl border border-gray-150 shadow-inner gap-1.5">
          <button 
            id="part-interior-tab"
            onClick={() => setActiveSegment('interior')}
            className={`col-span-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeSegment === 'interior' 
                ? 'bg-amber-500 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            <Layers size={14} className="shrink-0" />
            <span className="truncate">Interior<span className="hidden sm:inline"> Services</span></span>
          </button>
          
          <button 
            id="part-construction-tab"
            onClick={() => setActiveSegment('construction')}
            className={`col-span-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeSegment === 'construction' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            <Building size={14} className="shrink-0" />
            <span className="truncate">Construction<span className="hidden sm:inline"> Services</span></span>
          </button>

          <button 
            id="part-society-tab"
            onClick={() => setActiveSegment('society')}
            className={`col-span-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeSegment === 'society' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            <Shield size={14} className="shrink-0" />
            <span className="truncate">Society<span className="hidden sm:inline"> Services</span></span>
          </button>
          
          <button 
            id="part-instant-tab"
            onClick={() => setActiveSegment('instant')}
            className={`col-span-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeSegment === 'instant' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            <Zap size={14} className="animate-bounce shrink-0" />
            <span className="truncate">Instant Labours</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 border border-white rounded-full animate-ping" />
          </button>
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

      {/* Pro Services Search Bar */}
      {activeSegment !== 'instant' && (
        <div className="flex flex-col sm:flex-row gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-150 animate-in fade-in duration-200">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder={`Search in ${activeSegment === 'interior' ? 'Interior' : activeSegment === 'society' ? 'Society' : 'Construction'} Services (${
                activeSegment === 'interior'
                  ? interiorSubTab === 'engineers' ? 'Engineers' : interiorSubTab === 'labours' ? 'Labours' : interiorSubTab === 'vendors' ? 'Vendors' : interiorSubTab === 'materials' ? 'Materials' : 'Machines'
                  : activeSegment === 'society'
                  ? societySubTab === 'engineers' ? 'Engineers' : societySubTab === 'labours' ? 'Labours' : societySubTab === 'vendors' ? 'Vendors' : societySubTab === 'materials' ? 'Materials' : 'Machines'
                  : constructionSubTab === 'engineers' ? 'Engineers' : constructionSubTab === 'labours' ? 'Labours' : constructionSubTab === 'vendors' ? 'Vendors' : constructionSubTab === 'materials' ? 'Materials' : constructionSubTab === 'machines' ? 'Machines' : 'Vehicles'
              })...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setAppliedSearchQuery(searchQuery);
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500 transition-all font-semibold text-gray-800"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setAppliedSearchQuery(searchQuery)}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Search size={14} /> Search
            </button>
            {(searchQuery || appliedSearchQuery) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setAppliedSearchQuery('');
                }}
                className="px-4 py-2.5 border border-gray-250 bg-white hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- PART 1: INTERIOR WORKS --- */}
      {activeSegment === 'interior' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              Interior Services Catalog & Dispatch
            </h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase">5 Sub-types Available</span>
          </div>

          {/* Sub-types Nav Bar for Interior Works */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'engineers', label: 'i) engineer/ staff', icon: HardHat, color: 'text-orange-600 bg-orange-50' },
              { id: 'labours', label: 'ii) Labours', icon: Users, color: 'text-teal-600 bg-teal-50' },
              { id: 'vendors', label: 'iii) Vendors', icon: Briefcase, color: 'text-sky-600 bg-sky-50' },
              { id: 'materials', label: 'iv) Materials', icon: Package, color: 'text-yellow-600 bg-yellow-50' },
              { id: 'machines', label: 'v) Machines', icon: Wrench, color: 'text-indigo-600 bg-indigo-50' },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setInteriorSubTab(tab.id as any)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    interiorSubTab === tab.id 
                      ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/50 font-extrabold text-amber-900' 
                      : 'border-gray-200 hover:border-gray-350 bg-white text-gray-500'
                  }`}
                >
                  <span className={`p-1.5 rounded-lg ${tab.color}`}>
                    <Icon size={14} />
                  </span>
                  <span className="text-xs uppercase font-bold tracking-wider">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive display area based on interior sub tab selection */}
          <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-150">
            {interiorSubTab === 'engineers' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Available Interior Engineers & Consultants</h4>
                  <span className="text-xs font-extrabold text-amber-600 bg-white px-2 py-1 rounded-lg border">Day Rate / Consulting Reference</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredInteriorEngineers.length > 0 ? (
                    filteredInteriorEngineers.map(eng => (
                      <div key={eng.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{eng.name}</p>
                            <p className="text-[11px] font-semibold text-amber-700 bg-amber-55 px-1.5 py-0.5 rounded mt-1 inline-block">{eng.specialty}</p>
                            <div className="text-[11px] text-gray-400 mt-2">Exp: {eng.experience} | Rating: ⭐ {eng.rating}</div>
                          </div>
                          <span className="text-md font-black text-gray-900 font-mono">₹{eng.dailyRate}/day</span>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                          <button 
                            onClick={() => showFeedback(`Successfully booked consultation call with ${eng.name}!`, 'success')}
                            className="flex-1 text-[11px] font-black text-center py-2 text-white bg-gray-900 hover:bg-black rounded-lg transition-colors"
                          >
                            Book Consultant
                          </button>
                          <a href="tel:+919876543210" className="p-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-500">
                            <Phone size={13} />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching interior engineers found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {interiorSubTab === 'labours' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Available Interior Artisans & Labours</h4>
                  <span className="text-xs font-extrabold text-amber-600 bg-white px-2 py-1 rounded-lg border">Daily wage reference</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredInteriorLabours.length > 0 ? (
                    filteredInteriorLabours.map(lab => (
                      <div key={lab.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{lab.name}</p>
                            <p className="text-[11px] font-semibold text-amber-700 bg-amber-55 px-1.5 py-0.5 rounded mt-1 inline-block">{lab.specialty}</p>
                            <div className="text-[11px] text-gray-400 mt-2">Exp: {lab.experience} | Rating: ⭐ {lab.rating}</div>
                          </div>
                          <span className="text-md font-black text-gray-900 font-mono">₹{lab.dailyRate}/day</span>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                          <button 
                            onClick={() => showFeedback(`Successfully requested direct quote check from ${lab.name}!`, 'success')}
                            className="flex-1 text-[11px] font-black text-center py-2 text-white bg-gray-900 hover:bg-black rounded-lg transition-colors"
                          >
                            Book / Request Quote
                          </button>
                          <a href="tel:+919876543210" className="p-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-500">
                            <Phone size={13} />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching interior artisans found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {interiorSubTab === 'vendors' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Verified Multi-Service Interior Vendors</h4>
                  <span className="text-xs text-gray-400">Total verified vendors: {INTERIOR_DATA.vendors.length}</span>
                </div>
                <div className="space-y-3">
                  {filteredInteriorVendors.length > 0 ? (
                    filteredInteriorVendors.map(v => (
                      <div key={v.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h5 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                            {v.name}
                            <span className="text-[10px] bg-green-50 text-green-700 font-extrabold px-1.5 py-0.5 rounded">Verified Vendor</span>
                          </h5>
                          <p className="text-xs text-gray-500 mt-1">Specialists in: {v.specialist}</p>
                          <p className="text-[11px] text-gray-400 mt-1">Location: {v.location} | Successfully Completed: {v.completed} Projects</p>
                        </div>
                        <button 
                          onClick={() => showFeedback(`Inquiry forwarded to ${v.name}. They will view and reach out soon!`, 'success')}
                          className="py-2 px-4 bg-amber-500 text-white font-bold text-xs rounded-lg hover:bg-amber-600 transition-colors whitespace-nowrap self-start sm:self-auto"
                        >
                          Request Interior Quote
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching interior vendors found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {interiorSubTab === 'materials' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-gray-150">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Interior Materials & Fixtures</h4>
                    <span className="text-xs font-bold text-green-600">Bulk delivery is supported across all zones</span>
                  </div>
                  {/* Mode switcher */}
                  <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <button
                      onClick={() => setInteriorMaterialMode('new')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        interiorMaterialMode === 'new'
                          ? 'bg-amber-500 text-white shadow'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>🛒</span> Buy New
                    </button>
                    <button
                      onClick={() => setInteriorMaterialMode('rented')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        interiorMaterialMode === 'rented'
                          ? 'bg-amber-500 text-white shadow'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>🔑</span> Rented / Scaffolding
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredInteriorMaterials.length > 0 ? (
                    filteredInteriorMaterials.map(m => (
                      <div key={m.id} className="bg-white p-3.5 rounded-xl border border-gray-200 flex flex-col justify-between hover:scale-[1.01] hover:border-amber-300 transition-all">
                        <div>
                          <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">
                            {interiorMaterialMode === 'new' ? '✨ Brand New' : '🛠️ Rental Material'}
                          </span>
                          <h5 className="font-bold text-gray-800 text-xs mt-1 h-9 line-clamp-2">{m.name}</h5>
                          <div className="flex justify-between items-center mt-3">
                            <p className="text-xs text-gray-400">Unit: {m.unit}</p>
                            <span className="text-[10px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded">{m.stock}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-1">
                          <div>
                            <span className="font-mono text-sm font-black text-gray-800">₹{m.price}</span>
                            <span className="text-[10px] text-gray-400 block -mt-1">per {m.unit}</span>
                          </div>
                          <button 
                            onClick={() => showFeedback(
                              currentRole === UserRole.CLIENT 
                                ? `Inquiry for ${interiorMaterialMode === 'new' ? 'purchasing' : 'renting'} ${m.name} submitted!`
                                : `Bid proposal initiated for supply of ${m.name} to municipal projects!`, 
                              'success'
                            )}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-3 py-2 rounded-lg text-xs tracking-tight transition-colors shadow-sm"
                          >
                            {currentRole === UserRole.CLIENT 
                              ? (interiorMaterialMode === 'new' ? 'Buy Now' : 'Rent Now')
                              : 'Supply B2B'
                            }
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching materials found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {interiorSubTab === 'machines' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-gray-150">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Precision Tools & Machineries</h4>
                    <span className="text-xs text-gray-400">Tested and certified precision instruments</span>
                  </div>
                  {/* Mode switcher */}
                  <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <button
                      onClick={() => setInteriorMachineMode('new')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        interiorMachineMode === 'new'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>🛒</span> Buy New Machine
                    </button>
                    <button
                      onClick={() => setInteriorMachineMode('rented')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        interiorMachineMode === 'rented'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>🔑</span> Rented Machines
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredInteriorMachines.length > 0 ? (
                    filteredInteriorMachines.map(mac => (
                      <div key={mac.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-400 transition-colors flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded">
                              <Wrench size={14} />
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              interiorMachineMode === 'new' ? 'text-green-700 bg-green-50' : 'text-indigo-700 bg-indigo-50'
                            }`}>
                              {interiorMachineMode === 'new' ? 'New Purchase' : 'Rental'}
                            </span>
                          </div>
                          <h5 className="font-bold text-gray-800 text-xs h-10 line-clamp-2">{mac.name}</h5>
                          <p className="font-mono text-xs font-extrabold text-gray-700 mt-2">
                            ₹{mac.price.toLocaleString()} {interiorMachineMode === 'new' ? '' : `/ ${mac.unit}`}
                          </p>
                        </div>
                        <button 
                          onClick={() => showFeedback(
                            currentRole === UserRole.CLIENT
                              ? `Added ${mac.name} ${interiorMachineMode === 'new' ? 'purchase order' : 'rental request'} to cart!`
                              : `Registered model ${mac.name} into commercial supply chain.`,
                            'success'
                          )}
                          className={`w-full mt-4 text-[11px] font-bold py-2 rounded-lg text-center text-white transition-all ${
                            interiorMachineMode === 'new' ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
                          }`}
                        >
                          {currentRole === UserRole.CLIENT 
                            ? (interiorMachineMode === 'new' ? 'Buy Tool Now' : 'Rent This Tool')
                            : 'Manage Equipment'
                          }
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching tools or machines found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- PART 2: CONSTRUCTION --- */}
      {activeSegment === 'construction' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building size={18} className="text-orange-600" />
              <div>
                <h3 className="text-md font-bold text-gray-800">
                  Construction Services Catalog & Dispatch
                </h3>
                <p className="text-[11px] text-gray-500">
                  Select between Part A (Civil, MEP, Finishing) or Part B (Heavy Site & Foundations)
                </p>
              </div>
            </div>
            
            {/* Inline Toggle for Part A & Part B */}
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setConstructionPart('part_a')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  constructionPart === 'part_a'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-gray-650 hover:text-gray-850'
                }`}
              >
                <span>🏗️</span> Part A (Civil & Finishing)
              </button>
              <button
                onClick={() => setConstructionPart('part_b')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  constructionPart === 'part_b'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-gray-650 hover:text-gray-850'
                }`}
              >
                <span>🚜</span> Part B (Heavy Site & Infra)
              </button>
            </div>
          </div>

          {/* Sub-types Nav Bar for Construction */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'engineers', label: 'i) engineer/ staff', icon: HardHat, color: 'text-orange-600 bg-orange-50' },
              { id: 'labours', label: 'ii) Labours', icon: Users, color: 'text-teal-600 bg-teal-50' },
              { id: 'vendors', label: 'iii) Vendors', icon: Briefcase, color: 'text-sky-600 bg-sky-50' },
              { id: 'materials', label: 'iv) Materials', icon: Package, color: 'text-yellow-600 bg-yellow-50' },
              { id: 'machines', label: 'v) Machines', icon: Wrench, color: 'text-indigo-600 bg-indigo-50' },
              { id: 'vehicles', label: 'vi) Vehicles', icon: Truck, color: 'text-rose-600 bg-rose-50' },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setConstructionSubTab(tab.id as any)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    constructionSubTab === tab.id 
                      ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/50 font-extrabold text-orange-900' 
                      : 'border-gray-200 hover:border-gray-350 bg-white text-gray-500'
                  }`}
                >
                  <span className={`p-1.5 rounded-lg ${tab.color}`}>
                    <Icon size={14} />
                  </span>
                  <span className="text-xs uppercase font-bold tracking-wider">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive display area based on construction sub tab selection */}
          <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-150">
            {constructionSubTab === 'engineers' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Available Civil, Structural & Site Engineers</h4>
                  <span className="text-xs font-extrabold text-amber-600 bg-white px-2 py-1 rounded-lg border">Day Rate / Consulting Reference</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredConstructionEngineers.length > 0 ? (
                    filteredConstructionEngineers.map(eng => (
                      <div key={eng.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{eng.name}</p>
                            <p className="text-[11px] font-semibold text-amber-700 bg-amber-55 px-1.5 py-0.5 rounded mt-1 inline-block">{eng.specialty}</p>
                            <div className="text-[11px] text-gray-400 mt-2">Exp: {eng.experience} | Rating: ⭐ {eng.rating}</div>
                          </div>
                          <span className="text-md font-black text-gray-900 font-mono">₹{eng.dailyRate}/day</span>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                          <button 
                            onClick={() => showFeedback(`Successfully booked engineering consultation with ${eng.name}!`, 'success')}
                            className="flex-1 text-[11px] font-black text-center py-2 text-white bg-gray-900 hover:bg-black rounded-lg transition-colors"
                          >
                            Book Engineer
                          </button>
                          <a href="tel:+919876543210" className="p-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-500">
                            <Phone size={13} />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching construction engineers found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {constructionSubTab === 'labours' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">
                    Available {constructionPart === 'part_a' ? 'Construction Services (Part A) Artisans & Labours' : 'Construction Services (Part B) Crews'}
                  </h4>
                  <span className="text-xs text-gray-400">Standard Daily shifts (08:30 AM - 05:30 PM)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredConstructionLabours.length > 0 ? (
                    filteredConstructionLabours.map(lab => (
                      <div key={lab.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow">
                        <div>
                          <p className="font-extrabold text-gray-800 text-sm">{lab.name}</p>
                          <p className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full mt-1.5 inline-block">{lab.specialty}</p>
                          <div className="text-[11px] text-gray-455 mt-3 space-y-0.5">
                            <p>Experience: {lab.experience}</p>
                            <p>Rating: ⭐ {lab.rating}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Wage shift:</span>
                            <span className="text-sm font-black text-gray-900">₹{lab.dailyRate}/day</span>
                          </div>
                          <button 
                            onClick={() => showFeedback(`Direct reservation inquiry sent to helper supervisor for ${lab.name}`, 'success')}
                            className="w-full text-xs font-black py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-center"
                          >
                            Book Crew
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching construction crews found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {constructionSubTab === 'vendors' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Class-A Structural & Foundation Contractors</h4>
                  <span className="text-xs text-gray-400">Commercial & Residential builders</span>
                </div>
                <div className="space-y-3">
                  {filteredConstructionVendors.length > 0 ? (
                    filteredConstructionVendors.map(v => (
                      <div key={v.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h5 className="font-black text-gray-800 text-sm flex items-center gap-2">
                            {v.name}
                            <span className="text-[10px] bg-indigo-50 text-indigo-750 font-bold px-1.5 py-0.5 rounded">RERA Registered</span>
                          </h5>
                          <p className="text-xs text-gray-500 mt-1">Specialists in: {v.specialist}</p>
                          <p className="text-[11px] text-gray-400 mt-1">Location: {v.location} | Completed Infrastructure projects: {v.completed}</p>
                        </div>
                        <button 
                          onClick={() => showFeedback(`Request for tenders sent to ${v.name}. They will response with estimation rates.`, 'success')}
                          className="py-2.5 px-4 bg-orange-600 text-white font-black text-xs rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap self-start sm:self-auto"
                        >
                          Request Structural Bid
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching construction vendors found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {constructionSubTab === 'materials' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-gray-150">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Heavy Material Rates (Mumbai Region)</h4>
                    <span className="text-xs text-gray-400 font-bold text-red-500">Prices fluctuate daily based on global market indices</span>
                  </div>
                  {/* Mode switcher */}
                  <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <button
                      onClick={() => setConstructionMaterialMode('new')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        constructionMaterialMode === 'new'
                          ? 'bg-orange-600 text-white shadow'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>🛒</span> Buy New
                    </button>
                    <button
                      onClick={() => setConstructionMaterialMode('rented')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        constructionMaterialMode === 'rented'
                          ? 'bg-orange-600 text-white shadow'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>🔑</span> Rented Centering / Scaffolding
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredConstructionMaterials.length > 0 ? (
                    filteredConstructionMaterials.map(m => (
                      <div key={m.id} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-orange-400 transition-all">
                        <div>
                          <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest block mb-1">
                            {constructionMaterialMode === 'new' ? '💎 Direct From Yard' : '📐 Retained Hire'}
                          </span>
                          <h5 className="font-bold text-gray-800 text-xs tracking-tight h-8 line-clamp-2">{m.name}</h5>
                          <div className="flex justify-between items-center mt-3 text-[10px] text-gray-400">
                            <span>Billing unit: {m.unit}</span>
                            <span className="text-green-600 font-bold">{m.stock}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <p className="font-mono text-xs font-extrabold text-gray-850">₹{m.price.toLocaleString()}</p>
                            <span className="text-[9px] text-gray-455 block -mt-1">per {m.unit}</span>
                          </div>
                          <button 
                            onClick={() => showFeedback(
                              currentRole === UserRole.CLIENT
                                ? `Inquiry for bulk purchase/rent of ${m.name} submitted successfully!`
                                : `Assigned listing rates updated for ${m.name}!`, 
                              'success'
                            )}
                            className="text-[10px] bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-3 py-2 rounded-lg transition-colors"
                          >
                            {currentRole === UserRole.CLIENT 
                              ? (constructionMaterialMode === 'new' ? 'Order Materials' : 'Hire scaffolding')
                              : 'Update Bidding Yard'
                            }
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching construction materials found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {constructionSubTab === 'machines' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-gray-150">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Heavy Equipment & Machineries</h4>
                    <span className="text-xs text-indigo-600 font-semibold">Trained operator dispatch options are pre-selected</span>
                  </div>
                  {/* Mode switcher */}
                  <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <button
                      onClick={() => setConstructionMachineMode('new')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        constructionMachineMode === 'new'
                          ? 'bg-red-600 text-white shadow'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>🛒</span> Buy New Machineries
                    </button>
                    <button
                      onClick={() => setConstructionMachineMode('rented')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        constructionMachineMode === 'rented'
                          ? 'bg-red-600 text-white shadow'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>🔑</span> Rented Machineries
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredConstructionMachines.length > 0 ? (
                    filteredConstructionMachines.map(mac => (
                      <div key={mac.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-sm flex flex-col justify-between">
                        <div>
                          <h5 className="font-bold text-gray-850 text-xs h-9 line-clamp-2">{mac.name}</h5>
                          <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded inline-block mt-2 ${
                            constructionMachineMode === 'new' ? 'text-green-700 bg-green-50' : 'text-rose-600 bg-rose-50'
                          }`}>
                            {constructionMachineMode === 'new' ? 'Buy Asset' : 'Heavy Rental'}
                          </span>
                          <p className="font-mono text-xs font-black text-gray-700 mt-3">
                            Price: ₹{mac.price.toLocaleString()} {constructionMachineMode === 'new' ? '' : `/ ${mac.unit}`}
                          </p>
                        </div>
                        <button 
                          onClick={() => showFeedback(
                            currentRole === UserRole.CLIENT
                              ? `Commercial quotation requested for ${mac.name}!`
                              : `Logistics status updated for ${mac.name}.`,
                            'success'
                          )}
                          className={`w-full mt-4 text-[11px] font-black py-2 text-white rounded-lg transition-colors ${
                            constructionMachineMode === 'new' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-black'
                          }`}
                        >
                          {currentRole === UserRole.CLIENT 
                            ? (constructionMachineMode === 'new' ? 'Enquire Purchase Price' : 'Book Heavy Rental')
                            : 'Manage Allocation'
                          }
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching equipment or machines found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {constructionSubTab === 'vehicles' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Construction Logistics & Heavy Vehicles</h4>
                  <span className="text-xs font-bold text-orange-600 bg-white border px-2 py-0.5 rounded-md">Live availability dispatcher</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredConstructionVehicles.length > 0 ? (
                    filteredConstructionVehicles.map(vh => (
                      <div key={vh.id} className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-rose-50 text-rose-600 rounded">
                            <Truck size={14} />
                          </div>
                          <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest">{vh.availability}</span>
                        </div>
                        <h5 className="font-bold text-gray-800 text-xs h-9 line-clamp-2">{vh.name}</h5>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="font-mono text-indigo-700 font-bold text-xs">₹{vh.rate} / {vh.unit}</span>
                          <button 
                            onClick={() => showFeedback(`Requested booking details for vehicle: ${vh.name}`, 'success')}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-[10px] px-2 py-1.5 rounded-lg"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching vehicles found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- PART 4: SOCIETY SERVICES --- */}
      {activeSegment === 'society' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
              <Shield size={16} className="text-blue-600 animate-pulse" />
              Society Services Catalog & Dispatch
            </h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase">5 Sub-types Available</span>
          </div>

          {/* Sub-types Nav Bar for Society Works */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'engineers', label: 'i) Audits & Staff', icon: HardHat, color: 'text-orange-600 bg-orange-50' },
              { id: 'labours', label: 'ii) Specialists', icon: Users, color: 'text-teal-600 bg-teal-50' },
              { id: 'vendors', label: 'iii) Vendors', icon: Briefcase, color: 'text-sky-600 bg-sky-50' },
              { id: 'materials', label: 'iv) Supplies', icon: Package, color: 'text-yellow-600 bg-yellow-50' },
              { id: 'machines', label: 'v) Equipment', icon: Wrench, color: 'text-indigo-600 bg-indigo-50' },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSocietySubTab(tab.id as any)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    societySubTab === tab.id 
                      ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50 font-extrabold text-blue-900' 
                      : 'border-gray-200 hover:border-gray-350 bg-white text-gray-500'
                  }`}
                >
                  <span className={`p-1.5 rounded-lg ${tab.color}`}>
                    <Icon size={14} />
                  </span>
                  <span className="text-xs uppercase font-bold tracking-wider">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive display area based on society sub tab selection */}
          <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-150">
            {societySubTab === 'engineers' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Available Society Auditors & Consultants</h4>
                  <span className="text-xs font-extrabold text-blue-600 bg-white px-2 py-1 rounded-lg border">Audit Rate Reference</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredSocietyEngineers.length > 0 ? (
                    filteredSocietyEngineers.map(eng => (
                      <div key={eng.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{eng.name}</p>
                            <p className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded mt-1 inline-block">{eng.specialty}</p>
                            <div className="text-[11px] text-gray-400 mt-2">Exp: {eng.experience} | Rating: ⭐ {eng.rating}</div>
                          </div>
                          <span className="text-md font-black text-gray-900 font-mono">₹{eng.dailyRate}/day</span>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                          <button 
                            onClick={() => showFeedback(`Successfully booked audit consultation call with ${eng.name}!`, 'success')}
                            className="flex-1 text-[11px] font-black text-center py-2 text-white bg-gray-900 hover:bg-black rounded-lg transition-colors"
                          >
                            Book Consultant
                          </button>
                          <a href="tel:+919876543210" className="p-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-500">
                            <Phone size={13} />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching society engineers found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {societySubTab === 'labours' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Available Society Technicians & Specialists</h4>
                  <span className="text-xs font-extrabold text-blue-600 bg-white px-2 py-1 rounded-lg border">Daily wage reference</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredSocietyLabours.length > 0 ? (
                    filteredSocietyLabours.map(lab => (
                      <div key={lab.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{lab.name}</p>
                            <p className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded mt-1 inline-block">{lab.specialty}</p>
                            <div className="text-[11px] text-gray-400 mt-2">Exp: {lab.experience} | Rating: ⭐ {lab.rating}</div>
                          </div>
                          <span className="text-md font-black text-gray-900 font-mono">₹{lab.dailyRate}/day</span>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                          <button 
                            onClick={() => showFeedback(`Successfully requested direct quote check from ${lab.name}!`, 'success')}
                            className="flex-1 text-[11px] font-black text-center py-2 text-white bg-gray-900 hover:bg-black rounded-lg transition-colors"
                          >
                            Book / Request Quote
                          </button>
                          <a href="tel:+919876543210" className="p-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-500">
                            <Phone size={13} />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching society specialists found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {societySubTab === 'vendors' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Verified Multi-Service Society Vendors</h4>
                  <span className="text-xs text-gray-400">Total verified vendors: {SOCIETY_DATA.vendors.length}</span>
                </div>
                <div className="space-y-3">
                  {filteredSocietyVendors.length > 0 ? (
                    filteredSocietyVendors.map(v => (
                      <div key={v.id} className="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-extrabold text-gray-850 text-sm">{v.name}</p>
                            <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-black uppercase">Verified Vendor</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Specialist: <strong className="text-gray-700">{v.specialist}</strong></p>
                          <p className="text-xs text-gray-400">Location: {v.location} | Active/Completed Projects: {v.completed}</p>
                          <span className="text-xs text-yellow-500 font-extrabold">⭐ {v.rating} customer feedback</span>
                        </div>
                        <button 
                          onClick={() => showFeedback(`Request for tenders sent to ${v.name}. They will response with estimation rates.`, 'success')}
                          className="py-2.5 px-4 bg-blue-600 text-white font-black text-xs rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap self-start sm:self-auto"
                        >
                          Request Society Quote
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching society vendors found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {societySubTab === 'materials' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-gray-150">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Society Supplies & Materials</h4>
                    <span className="text-xs text-blue-600 font-semibold">Bulk discount offers are available for registered housing societies</span>
                  </div>
                  {/* Mode switcher */}
                  <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <button
                      onClick={() => setSocietyMaterialMode('new')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        societyMaterialMode === 'new'
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-gray-650 hover:text-gray-900'
                      }`}
                    >
                      <span>🛒</span> Buy New
                    </button>
                    <button
                      onClick={() => setSocietyMaterialMode('rented')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        societyMaterialMode === 'rented'
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-gray-650 hover:text-gray-900'
                      }`}
                    >
                      <span>🔑</span> Rented setups
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredSocietyMaterials.length > 0 ? (
                    filteredSocietyMaterials.map(m => (
                      <div key={m.id} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-blue-400 transition-all">
                        <div>
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block mb-1">
                            {societyMaterialMode === 'new' ? '💎 Direct Purchase' : '📐 Retained Hire'}
                          </span>
                          <h5 className="font-bold text-gray-800 text-xs tracking-tight h-8 line-clamp-2">{m.name}</h5>
                          <div className="flex justify-between items-center mt-3 text-[10px] text-gray-400">
                            <span>Billing unit: {m.unit}</span>
                            <span className="text-green-600 font-bold">In Stock</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <p className="font-mono text-xs font-extrabold text-gray-850">₹{m.price.toLocaleString()}</p>
                            <span className="text-[9px] text-gray-455 block -mt-1">per {m.unit}</span>
                          </div>
                          <button 
                            onClick={() => showFeedback(
                              currentRole === UserRole.CLIENT
                                ? `Inquiry for bulk purchase/rent of ${m.name} submitted successfully!`
                                : `Assigned listing rates updated for ${m.name}!`, 
                              'success'
                            )}
                            className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-2 rounded-lg transition-colors"
                          >
                            {currentRole === UserRole.CLIENT 
                              ? (societyMaterialMode === 'new' ? 'Order Materials' : 'Hire Service')
                              : 'Update Bidding'
                            }
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching supplies found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {societySubTab === 'machines' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-gray-150">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Society Equipment & Machineries</h4>
                    <span className="text-xs text-blue-600 font-semibold">Trained personnel options are included</span>
                  </div>
                  {/* Mode switcher */}
                  <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <button
                      onClick={() => setSocietyMachineMode('new')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        societyMachineMode === 'new'
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-gray-650 hover:text-gray-900'
                      }`}
                    >
                      <span>🛒</span> Buy New Assets
                    </button>
                    <button
                      onClick={() => setSocietyMachineMode('rented')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        societyMachineMode === 'rented'
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-gray-650 hover:text-gray-900'
                      }`}
                    >
                      <span>🔑</span> Rented Machines
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredSocietyMachines.length > 0 ? (
                    filteredSocietyMachines.map(mac => (
                      <div key={mac.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-sm flex flex-col justify-between">
                        <div>
                          <h5 className="font-bold text-gray-850 text-xs h-9 line-clamp-2">{mac.name}</h5>
                          <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded inline-block mt-2 ${
                            societyMachineMode === 'new' ? 'text-green-700 bg-green-50' : 'text-blue-600 bg-blue-50'
                          }`}>
                            {societyMachineMode === 'new' ? 'Buy Asset' : 'Heavy Rental'}
                          </span>
                          <p className="font-mono text-xs font-black text-gray-700 mt-3">
                            Price: ₹{mac.price.toLocaleString()} {societyMachineMode === 'new' ? '' : `/ ${mac.unit}`}
                          </p>
                        </div>
                        <button 
                          onClick={() => showFeedback(
                            currentRole === UserRole.CLIENT
                              ? `Commercial quotation requested for ${mac.name}!`
                              : `Logistics status updated for ${mac.name}.`,
                            'success'
                          )}
                          className={`w-full mt-4 text-[11px] font-black py-2 text-white rounded-lg transition-colors ${
                            societyMachineMode === 'new' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-black'
                          }`}
                        >
                          {currentRole === UserRole.CLIENT 
                            ? (societyMachineMode === 'new' ? 'Enquire Purchase Price' : 'Book Heavy Rental')
                            : 'Manage Allocation'
                          }
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold bg-white rounded-xl border border-dashed">
                      No matching equipment found. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- PART 3: INSTANT LABOURS --- */}
      {activeSegment === 'instant' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-tr from-red-500 to-rose-600 text-white rounded-2xl p-5 sm:p-6 shadow-md shadow-red-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 py-2.5 px-4 bg-white/10 backdrop-blur-md rounded-bl-xl border-l border-b border-white/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <Loader2 className="animate-spin" size={10} />
              Live Broadcast Active
            </div>
            
            <div className="max-w-xl">
              <h3 className="text-xl font-extrabold flex items-center gap-2">
                <Zap size={22} className="text-yellow-300 animate-bounce" />
                Instant Labour Booking Hub
              </h3>
              <p className="text-xs text-red-50 opacity-90 mt-1">
                Post shift requirements for immediate labor matching. The request is dispatched to our active pool of local construction technicians instantly. Your bids are confirmed by workers first and finalized by you!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* BOOKING FORM */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-150 p-5 space-y-4">
              <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-widest flex items-center gap-2 border-b pb-2">
                <MousePointerClick size={14} className="text-red-500" />
                New On-Demand Labour Shift Booking
              </h4>
              
              <form onSubmit={handleInstantBook} className="space-y-4 mt-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Type of Work Force Needed</label>
                  <select 
                    value={instantLaborType}
                    onChange={(e) => setInstantLaborType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  >
                    <option>Carpenter Team (Part A)</option>
                    <option>Fitter Crew (Part A)</option>
                    <option>Concrete Casting Squad (Part A)</option>
                    <option>Plaster Specialists (Part A)</option>
                    <option>Blockwork/Brickwork Crew (Part A)</option>
                    <option>Tiles & Marble Installers (Part A)</option>
                    <option>Electrician Shift (Part A)</option>
                    <option>Plumbing Experts (Part A)</option>
                    <option>POP Artisans (Part A)</option>
                    <option>False Ceiling Experts (Part A)</option>
                    <option>Fire Fighting System Installers (Part A)</option>
                    <option>Post Tension Specialists (Part A)</option>
                    <option>Waterproofing Crew (Part A)</option>
                    <option>Breaker & Chipping Squad (Part A)</option>
                    <option>Hilti & Core Cut Specialists (Part A)</option>
                    <option>Steel Fabricators (Part A)</option>
                    <option>Aluminium Fabricators (Part A)</option>
                    <option>Scaffolding Riggers (Part A)</option>
                    <option>Vadari Trad Stone Artisans (Part A)</option>
                    <option>Post Concrete Finishing Team (Part A)</option>
                    <option>Hywa Dumper Dispatch (Part A)</option>
                    <option>Debris Disposal Crew (Part A)</option>
                    <option>Mivan Acid Wash Squad (Part A)</option>
                    <option>Excavation Crews (Part B)</option>
                    <option>Demolition Services (Part B)</option>
                    <option>Painter Teams (Part B)</option>
                    <option>Scrap Clearing Workers (Part B)</option>
                    <option>Home Decor Electrician (Part B)</option>
                    <option>Piling Specialized Crew (Part B)</option>
                    <option>RMC Pump Placing Teams (Part B)</option>
                    <option>Bore Well Drillers (Part B)</option>
                    <option>Facade Glazing Technicians (Part B)</option>
                    <option>Tower Crane Operator & Signal Man (Part B)</option>
                    <option>Crane Service Operators (Part B)</option>
                    <option>Crane TPI Experts (Part B)</option>
                    <option>CCTV Technicians (Part B)</option>
                    <option>AC Ducting & Installers (Part B)</option>
                    <option>Sewer Connection Technicians (Part B)</option>
                    <option>Precast Materials (Part B)</option>
                    <option>Cover and Kanda Maker (Part B)</option>
                    <option>Dewatering Pump Repairs (Part B)</option>
                    <option>Block work (Interior)</option>
                    <option>Tile/Marble fixing (Interior)</option>
                    <option>Plumbing (Interior)</option>
                    <option>Plaster (Interior)</option>
                    <option>POP & False ceiling (Interior)</option>
                    <option>Furniture (Interior)</option>
                    <option>Matress/Sofa (Interior)</option>
                    <option>Carpet installation (Interior)</option>
                    <option>Paint (Interior)</option>
                    <option>Waterproofing (Interior)</option>
                    <option>Wallpaper (Interior)</option>
                    <option>Modular kitchen (Interior)</option>
                    <option>CCTV installation (Interior)</option>
                    <option>Steel fabrication (Interior)</option>
                    <option>Aluminium & Glass work (Interior)</option>
                    <option disabled className="font-bold text-gray-400 bg-gray-100">--- Job Placement Services ---</option>
                    <option>Jr. Civil Engineer (Placement)</option>
                    <option>Sr.Civil Engineer (Placement)</option>
                    <option>Quality Engineer (Placement)</option>
                    <option>Safety Engineer (Placement)</option>
                    <option>Safety Manager (Placement)</option>
                    <option>Billing Engineer (Placement)</option>
                    <option>MEP Engineer (Placement)</option>
                    <option>AC technician (Placement)</option>
                    <option>Quantity surveyors (Placement)</option>
                    <option>Draftsman (Placement)</option>
                    <option>Architect (Placement)</option>
                    <option>BBS Engineer (Placement)</option>
                    <option>Freelancer (Placement)</option>
                    <option>Surveyors (Placement)</option>
                    <option>Welder (Placement)</option>
                    <option>Construction Supervisor (Placement)</option>
                    <option>Fire fighting supervisor (Placement)</option>
                    <option>CCTV & Wifi technician (Placement)</option>
                    <option>Structural consultant (Placement)</option>
                    <option>MEP consultant (Placement)</option>
                    <option>Facade supervisor (Placement)</option>
                    <option>Facade Engineer (Placement)</option>
                    <option>Interior Designer (Placement)</option>
                    <option>Crane Signal man (Placement)</option>
                    <option>Crane operator (Placement)</option>
                    <option>JCB operator (Placement)</option>
                    <option>Hydra operator (Placement)</option>
                    <option>Piling machine operator (Placement)</option>
                    <option>Bore well operator (Placement)</option>
                    <option>PT Engineer (Placement)</option>
                    <option>PT supervisor (Placement)</option>
                    <option>RMC Sr. Engineer (Placement)</option>
                    <option>RMC Jr. Engineer (Placement)</option>
                    <option>RMC Supervisor (Placement)</option>
                    <option>RMC pump operator (Placement)</option>
                    <option>RMC quality engineer (Placement)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Count of Labours</label>
                    <input 
                      type="number"
                      min="1"
                      max="50"
                      value={instantCount}
                      onChange={(e) => setInstantCount(parseInt(e.target.value) || 1)}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 font-mono">Status Live views</label>
                    <div className="w-full bg-red-50 text-red-700 px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 border border-red-150">
                      <Users size={12} />
                      10 views dispatch
                    </div>
                  </div>
                </div>

                {/* Provision for "1 day before" or "in 2nd half of the day" or "for night work" */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1">
                    Select Your Preferred Dispatch Schedule
                  </label>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTimeSlot('1_day_before')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        selectedTimeSlot === '1_day_before'
                          ? 'bg-rose-50 border-rose-400 text-rose-800 font-extrabold ring-1 ring-rose-300'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Calendar size={16} />
                      <span className="text-[10px] text-center uppercase tracking-tight block font-bold leading-tight">
                        1 Day Before (Tomorrow)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTimeSlot('2nd_half_of_day')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        selectedTimeSlot === '2nd_half_of_day'
                          ? 'bg-rose-50 border-rose-400 text-rose-800 font-extrabold ring-1 ring-rose-300'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Clock size={16} />
                      <span className="text-[10px] text-center uppercase tracking-tight block font-bold leading-tight">
                        2nd Half of Day (Afternoon)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTimeSlot('night_work')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        selectedTimeSlot === 'night_work'
                          ? 'bg-rose-50 border-rose-400 text-rose-800 font-extrabold ring-1 ring-rose-300'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Moon size={16} />
                      <span className="text-[10px] text-center uppercase tracking-tight block font-bold leading-tight">
                        Night Work Shift
                      </span>
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-red-650 text-white font-extrabold py-3.5 rounded-xl shadow-lg hover:bg-red-700 hover:shadow-red-200 hover:-translate-y-0.5 active:translate-y-0 transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  <Zap size={14} />
                  Find & broadcast shifts
                </button>
              </form>
            </div>

            {/* LIVE DISPATCH DASHBOARD */}
            <div className="lg:col-span-7 bg-gray-50 p-5 rounded-2xl border border-gray-150 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping shrink-0" />
                  Your Active Shift Requests Status
                </span>
                <span className="text-[10px] bg-red-100 text-red-800 font-black px-2 py-0.5 rounded-full">
                  Real-time updates
                </span>
              </div>

              {bookings.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-dashed flex flex-col items-center justify-center space-y-2">
                  <AlertCircle size={32} className="text-gray-300" />
                  <p className="text-sm font-bold text-gray-600">No active bookings found</p>
                  <p className="text-xs text-gray-400">Fill the instant request form on the left to broadcast to local worker crews.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((bk) => {
                    const isSelected = activeBooking?.id === bk.id;
                    return (
                      <div 
                        key={bk.id} 
                        className={`p-4 rounded-xl border transition-all ${
                          isSelected 
                            ? 'bg-white border-red-300 shadow ring-2 ring-red-100' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveBooking(bk)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black text-gray-750 bg-gray-100 px-2 py-0.5 rounded">
                                {bk.id}
                              </span>
                              <h5 className="font-extrabold text-sm text-gray-900">{bk.laborType} ({bk.count} Labours)</h5>
                            </div>
                            
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                              Schedule: 
                              {bk.timeSlot === '1_day_before' && (
                                <span className="text-rose-700 bg-rose-50 px-1.5 py-0.2 ml-1 rounded font-bold">1 Day Before (Tomorrow)</span>
                              )}
                              {bk.timeSlot === '2nd_half_of_day' && (
                                <span className="text-amber-800 bg-amber-50 px-1.5 py-0.2 ml-1 rounded font-bold">2nd Half of Day (Afternoon)</span>
                              )}
                              {bk.timeSlot === 'night_work' && (
                                <span className="text-indigo-800 bg-indigo-50 px-1.5 py-0.2 ml-1 rounded font-bold">Night Work Shift</span>
                              )}
                            </p>
                          </div>
                          
                          <div className="self-start sm:self-auto uppercase tracking-wider text-[10px] font-black">
                            {bk.status === 'broadcasting' && (
                              <span className="text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                                <Loader2 className="animate-spin" size={10} />
                                Broad Cast
                              </span>
                            )}
                            {bk.status === 'confirmed_by_labor' && (
                              <span className="text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full flex items-center gap-1 animate-bounce">
                                <UserCheck size={10} />
                                Labour Confirmed
                              </span>
                            )}
                            {bk.status === 'finalized' && (
                              <span className="text-green-700 bg-green-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                                <CheckCircle2 size={10} />
                                Finalized & Sent
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Interactive Status Steps & Confirmation details */}
                        <div className="mt-3.5 space-y-3">
                          {bk.status === 'broadcasting' && (
                            <div className="bg-red-50/50 p-3 rounded-xl border border-red-100">
                              <div className="flex justify-between items-center text-xs text-red-800">
                                <p className="font-extrabold flex items-center gap-1">
                                  <Loader2 className="animate-spin text-red-600" size={12} />
                                  Broadcasting live search offer...
                                </p>
                                <span className="font-extrabold text-[10px] text-red-600 animate-pulse bg-white border border-red-200 px-2 py-0.5 rounded">
                                  ⚡ 10 labours have seen your request
                                </span>
                              </div>
                              <p className="text-[10px] text-red-500 mt-1">
                                Construction Mart algorithm has reached the local team dispatchers. Waiting for responses...
                              </p>
                              
                              <div className="mt-3 flex gap-2 flex-wrap">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmAsLabourManually(bk.id);
                                  }}
                                  className="text-[10px] font-bold bg-white text-red-700 hover:bg-red-50 hover:text-red-900 border border-red-200 px-3 py-1.5 rounded-lg shadow-sm"
                                >
                                  Simulate Labour Response Now
                                </button>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteBooking(bk.id);
                                  }}
                                  className="text-[10px] font-bold text-gray-400 hover:text-red-500 px-2 py-1.5"
                                >
                                  Cancel Request
                                </button>
                              </div>
                            </div>
                          )}

                          {bk.status === 'confirmed_by_labor' && (
                            <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-gray-700 font-mono">
                                    👷
                                  </div>
                                  <div>
                                    <p className="text-xs font-extrabold text-indigo-900">{bk.labourWhoConfirmed}</p>
                                    <p className="text-[10px] text-slate-500">Rep Rating: ⭐ {bk.rating} | Verified Crew Contractor</p>
                                  </div>
                                </div>
                                <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-right">
                                  1st Step Confirmed by Worker
                                </span>
                              </div>

                              <div className="border-t border-indigo-100 pt-2.5 flex items-center justify-between flex-wrap gap-2">
                                <p className="text-[10px] text-slate-500 italic">
                                  To finalize the dispatch, client/vendor must sign off the estimation work order.
                                </p>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      finalizeBooking(bk.id);
                                    }}
                                    className="text-[11px] font-black bg-indigo-650 hover:bg-indigo-750 text-white px-4 py-2 rounded-lg flex items-center gap-1.5 shadow"
                                  >
                                    <FileText size={12} />
                                    Finalize Booking by Client / Vendor
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteBooking(bk.id);
                                    }}
                                    className="text-[10px] font-bold text-slate-400 hover:text-red-500 px-2 py-2"
                                  >
                                    Decline
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {bk.status === 'finalized' && (
                            <div className="bg-green-50/50 p-3 rounded-xl border border-green-150 space-y-1">
                              <p className="text-xs font-black text-green-900 flex items-center gap-1">
                                <CheckCircle2 size={13} className="text-green-600" />
                                Work Order Finalized & Crew Committed
                              </p>
                              <p className="text-[11px] text-green-700">
                                Worker Crew Representative: <span className="font-extrabold">{bk.labourWhoConfirmed}</span>
                              </p>
                              <div className="flex items-center gap-4 text-[10px] text-gray-500 pt-1">
                                <p className="flex items-center gap-1">
                                  <Phone size={10} className="text-green-600" />
                                  Phone Contact: <span className="font-bold underline">{bk.phone}</span>
                                </p>
                                <p>Dispatched Time Slot: {bk.timeSlot}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};
