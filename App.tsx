import React, { useState, useEffect, useRef } from 'react';
import { UserRole, ServiceType, Project, WhatsappContact, PaymentStatus, ChatMessage, Vendor, Client, ChannelPartner, ActivityRate, MaterialRate } from './types';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import PaymentModal from './components/PaymentModal';
import ServiceCarousel, { CarouselItem } from './components/ServiceCarousel';
import ChatWindow from './components/ChatWindow';
import VendorProfileForm from './components/VendorProfileForm';
import VendorRatesPanel from './components/VendorRatesPanel';
import QuotationGenerator from './components/QuotationGenerator';
import RateExplorer from './components/RateExplorer';
import { BrokersPoint } from './components/BrokersPoint';
import { ConstructionServicesPortal } from './components/ConstructionServicesPortal';
import { InstantLaboursSection } from './components/InstantLaboursSection';
import { LabourProfile } from './components/LabourProfile';
import { ClientProfile } from './components/ClientProfile';
import { SupplierProfile } from './components/SupplierProfile';
import { JobProfile } from './components/JobProfile';
import { VendorProfile } from './components/VendorProfile';
import SupplierDashboard from './components/SupplierDashboard';
import { fetchAllBookings, saveBooking, saveSubmission, fetchAllSubmissions } from './services/supabase';
import { listLocalWorkRequests, WorkRequest, RequirementCategory, MAIN_REQUIREMENT_CATEGORIES } from './components/RequestsBoard';
import { useAuth } from './services/auth';
import { AuthScreen } from './components/AuthScreen';
import { SuperAdminPanel } from './components/SuperAdminPanel';
import developerSymbolImg from './src/assets/images/developer_symbol_1785094433237.jpg';
import vendorSymbolImg from './src/assets/images/vendor_symbol_1785094447958.jpg';
import labourSymbolImg from './src/assets/images/labour_symbol_1785094461353.jpg';
import supplierSymbolImg from './src/assets/images/supplier_symbol_1785094473667.jpg';
import jobSymbolImg from './src/assets/images/job_symbol_1785094488725.jpg';
import freelancerSymbolImg from './src/assets/images/freelancer_symbol_1785171686295.jpg';
import pmcSymbolImg from './src/assets/images/pmc_symbol_1785866168151.jpg';
import brokerSymbolImg from './src/assets/images/broker_symbol_1785866178809.jpg';
import architectSymbolImg from './src/assets/images/architect_symbol_1790965373365.jpg';
import rmcSymbolImg from './src/assets/images/rmc_symbol_1790965385502.jpg';
import consultantSymbolImg from './src/assets/images/consultant_symbol_1790965398851.jpg';
import materialSymbolImg from './src/assets/images/material_symbol_1790965413299.jpg';
import factorySymbolImg from './src/assets/images/factory_symbol_1790966263406.jpg';
import mepSymbolImg from './src/assets/images/mep_symbol_1791044860644.jpg';
import { FreelancerProfile } from './components/FreelancerProfile';
import { PMCProfile } from './components/PMCProfile';
import { BrokerProfile } from './components/BrokerProfile';
import { RequestsView } from './components/RequestsBoard';
import { PostRequestModal } from './components/PostRequestModal';
import { MyPosting } from './components/MyPosting';
import Logo, { LOGO_IMAGE_PATH } from './components/Logo';
import { 
  LayoutDashboard, 
  Settings, 
  HelpCircle, 
  Info, 
  User, 
  Menu, 
  X,
  Phone,
  MessageSquare,
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
  Plus,
  Search,
  Hammer,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Wallet,
  Clock,
  ShieldAlert,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Package,
  Calculator,
  UserCircle,
  BarChart4,
  TrendingUp,
  Building2,
  MapPin,
  Percent,
  Coins,
  Bell,
  LogOut,
  LogIn,
  ClipboardList,
  HardHat,
  FileText,
  Briefcase,
  Loader2,
  Compass,
  Truck,
  FileCheck2,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Home,
  Share2,
  Factory,
  Wrench
} from 'lucide-react';

// --- MOCK DATA ---
const WHATSAPP_DIRECTORY: WhatsappContact[] = [
  { name: 'Saddam Husain Khan', role: 'Founder & Support', number: '9326294480' },
  { name: 'Central Support', role: 'Support Helpdesk', number: '9326294480' },
  { name: 'Emergency Support', role: 'Emergency Operations', number: '9326294480' },
];

const MOCK_VENDORS_DATA: Vendor[] = [
  { 
    id: 'v1', 
    name: 'BestBuild Corp', 
    specialty: ServiceType.CONSTRUCTION, 
    rating: 4.8, 
    email: 'contact@bestbuild.com', 
    phone: '+1 555-0101', 
    joinedDate: '2023-01-10',
    region: 'Mumbai',
    experience: '12 Years',
    contractTypes: ['Lump Sum', 'Material + Labor'],
    laborStrength: 45
  },
  { id: 'v2', name: 'Elite Interiors Studio', specialty: ServiceType.INTERIOR, rating: 4.9, email: 'info@eliteinteriors.com', phone: '+1 555-0102', joinedDate: '2023-02-15' },
  { id: 'v3', name: 'GreenCare Services', specialty: ServiceType.BUILDING_SOCIETY, rating: 4.5, email: 'support@greencare.com', phone: '+1 555-0103', joinedDate: '2023-03-20' },
  { id: 'v4', name: 'QuickFix Plumbers', specialty: ServiceType.HOME, rating: 4.7, email: 'help@quickfix.com', phone: '+1 555-0104', joinedDate: '2023-04-05' },
  { id: 'v5', name: 'Staff Masters', specialty: ServiceType.PLACEMENT, rating: 4.6, email: 'hr@staffmasters.com', phone: '+1 555-0105', joinedDate: '2023-05-12' },
  { id: 'v6', name: 'Urban Renovators', specialty: ServiceType.INTERIOR, rating: 4.7, email: 'hello@urbanrenovators.com', phone: '+1 555-0106', joinedDate: '2023-06-01' },
];

const INITIAL_ACTIVITY_RATES: ActivityRate[] = [
  // Mumbai
  { id: 'ar1', vendorId: 'v1', region: 'Mumbai', activity: 'Carpenter Services', unit: 'sqft', rate: 180 },
  { id: 'ar2', vendorId: 'v1', region: 'Mumbai', activity: 'Internal/External Plaster', unit: 'sqft', rate: 45 },
  { id: 'ar3', vendorId: 'v1', region: 'Mumbai', activity: 'Concrete Casting & Masonry', unit: 'cum', rate: 4500 },
  { id: 'ar4', vendorId: 'v1', region: 'Mumbai', activity: 'Excavation & Shoring', unit: 'brass', rate: 1200 },
  { id: 'ar5', vendorId: 'v1', region: 'Mumbai', activity: 'Demolition & Breaking', unit: 'sqft', rate: 35 },
  { id: 'ar6', vendorId: 'v1', region: 'Mumbai', activity: 'Tiles & Marble Fitting', unit: 'sqft', rate: 65 },
  { id: 'ar7', vendorId: 'v1', region: 'Mumbai', activity: 'Piling & Foundation Works', unit: 'running meter', rate: 2200 },
  { id: 'ar8', vendorId: 'v1', region: 'Mumbai', activity: 'Waterproofing & Coating', unit: 'sqft', rate: 80 },
  
  // Delhi
  { id: 'ar9', vendorId: 'v1', region: 'Delhi', activity: 'Carpenter Services', unit: 'sqft', rate: 165 },
  { id: 'ar10', vendorId: 'v1', region: 'Delhi', activity: 'Internal/External Plaster', unit: 'sqft', rate: 40 },
  { id: 'ar11', vendorId: 'v1', region: 'Delhi', activity: 'Concrete Casting & Masonry', unit: 'cum', rate: 4200 },
  { id: 'ar12', vendorId: 'v1', region: 'Delhi', activity: 'Excavation & Shoring', unit: 'brass', rate: 1100 },
  { id: 'ar13', vendorId: 'v1', region: 'Delhi', activity: 'Demolition & Breaking', unit: 'sqft', rate: 30 },
  { id: 'ar14', vendorId: 'v1', region: 'Delhi', activity: 'Tiles & Marble Fitting', unit: 'sqft', rate: 58 },
  { id: 'ar15', vendorId: 'v1', region: 'Delhi', activity: 'Piling & Foundation Works', unit: 'running meter', rate: 2100 },
  { id: 'ar16', vendorId: 'v1', region: 'Delhi', activity: 'Waterproofing & Coating', unit: 'sqft', rate: 75 },

  // Bangalore
  { id: 'ar17', vendorId: 'v1', region: 'Bangalore', activity: 'Carpenter Services', unit: 'sqft', rate: 195 },
  { id: 'ar18', vendorId: 'v1', region: 'Bangalore', activity: 'Internal/External Plaster', unit: 'sqft', rate: 50 },
  { id: 'ar19', vendorId: 'v1', region: 'Bangalore', activity: 'Concrete Casting & Masonry', unit: 'cum', rate: 4800 },
  { id: 'ar20', vendorId: 'v1', region: 'Bangalore', activity: 'Excavation & Shoring', unit: 'brass', rate: 1300 },
  { id: 'ar21', vendorId: 'v1', region: 'Bangalore', activity: 'Demolition & Breaking', unit: 'sqft', rate: 40 },
  { id: 'ar22', vendorId: 'v1', region: 'Bangalore', activity: 'Tiles & Marble Fitting', unit: 'sqft', rate: 72 },
  { id: 'ar23', vendorId: 'v1', region: 'Bangalore', activity: 'Piling & Foundation Works', unit: 'running meter', rate: 2350 },
  { id: 'ar24', vendorId: 'v1', region: 'Bangalore', activity: 'Waterproofing & Coating', unit: 'sqft', rate: 90 }
];

const INITIAL_MATERIAL_RATES: MaterialRate[] = [
  // Mumbai
  { id: 'mr1', vendorId: 'v1', region: 'Mumbai', material: 'Cement (PPC)', unit: 'bag', rate: 410 },
  { id: 'mr2', vendorId: 'v1', region: 'Mumbai', material: 'Steel Reinforcement', unit: 'kg', rate: 68 },
  { id: 'mr3', vendorId: 'v1', region: 'Mumbai', material: 'Crushed Stone', unit: 'cum', rate: 2400 },
  { id: 'mr4', vendorId: 'v1', region: 'Mumbai', material: 'River Sand V2 Double Washed', unit: 'brass', rate: 6200 },
  { id: 'mr5', vendorId: 'v1', region: 'Mumbai', material: 'Red Clay Bricks (Class-A)', unit: '1000 pcs', rate: 7500 },
  // Delhi
  { id: 'mr6', vendorId: 'v1', region: 'Delhi', material: 'Cement (PPC)', unit: 'bag', rate: 395 },
  { id: 'mr7', vendorId: 'v1', region: 'Delhi', material: 'Steel Reinforcement', unit: 'kg', rate: 65 },
  { id: 'mr8', vendorId: 'v1', region: 'Delhi', material: 'Crushed Stone', unit: 'cum', rate: 2200 },
  { id: 'mr9', vendorId: 'v1', region: 'Delhi', material: 'River Sand V2 Double Washed', unit: 'brass', rate: 5900 },
  { id: 'mr10', vendorId: 'v1', region: 'Delhi', material: 'Red Clay Bricks (Class-A)', unit: '1000 pcs', rate: 7200 },
  // Bangalore
  { id: 'mr11', vendorId: 'v1', region: 'Bangalore', material: 'Cement (PPC)', unit: 'bag', rate: 420 },
  { id: 'mr12', vendorId: 'v1', region: 'Bangalore', material: 'Steel Reinforcement', unit: 'kg', rate: 70 },
  { id: 'mr13', vendorId: 'v1', region: 'Bangalore', material: 'Crushed Stone', unit: 'cum', rate: 2600 },
  { id: 'mr14', vendorId: 'v1', region: 'Bangalore', material: 'River Sand V2 Double Washed', unit: 'brass', rate: 6400 },
  { id: 'mr15', vendorId: 'v1', region: 'Bangalore', material: 'Red Clay Bricks (Class-A)', unit: '1000 pcs', rate: 7800 },

  // Flooring (Mumbai, Delhi, Bangalore)
  { id: 'fl1', vendorId: 'v1', region: 'Mumbai', material: 'Premium Vitrified Tiles', unit: 'sqft', rate: 65 },
  { id: 'fl2', vendorId: 'v1', region: 'Delhi', material: 'Premium Vitrified Tiles', unit: 'sqft', rate: 60 },
  { id: 'fl3', vendorId: 'v1', region: 'Bangalore', material: 'Premium Vitrified Tiles', unit: 'sqft', rate: 68 },
  { id: 'fl4', vendorId: 'v1', region: 'Mumbai', material: 'Italian Marble Slabs', unit: 'sqft', rate: 350 },
  { id: 'fl5', vendorId: 'v1', region: 'Delhi', material: 'Italian Marble Slabs', unit: 'sqft', rate: 320 },
  { id: 'fl6', vendorId: 'v1', region: 'Bangalore', material: 'Italian Marble Slabs', unit: 'sqft', rate: 385 },
  { id: 'fl7', vendorId: 'v1', region: 'Mumbai', material: 'Granite Slab Flooring', unit: 'sqft', rate: 140 },
  { id: 'fl8', vendorId: 'v1', region: 'Delhi', material: 'Granite Slab Flooring', unit: 'sqft', rate: 130 },
  { id: 'fl9', vendorId: 'v1', region: 'Bangalore', material: 'Granite Slab Flooring', unit: 'sqft', rate: 155 },

  // Plumbing (Mumbai, Delhi, Bangalore)
  { id: 'pl1', vendorId: 'v1', region: 'Mumbai', material: 'CPVC Plumbing Pipes (1 inch)', unit: 'meter', rate: 120 },
  { id: 'pl2', vendorId: 'v1', region: 'Delhi', material: 'CPVC Plumbing Pipes (1 inch)', unit: 'meter', rate: 110 },
  { id: 'pl3', vendorId: 'v1', region: 'Bangalore', material: 'CPVC Plumbing Pipes (1 inch)', unit: 'meter', rate: 128 },
  { id: 'pl4', vendorId: 'v1', region: 'Mumbai', material: 'Brass Flow Control Valves', unit: 'piece', rate: 380 },
  { id: 'pl5', vendorId: 'v1', region: 'Delhi', material: 'Brass Flow Control Valves', unit: 'piece', rate: 360 },
  { id: 'pl6', vendorId: 'v1', region: 'Bangalore', material: 'Brass Flow Control Valves', unit: 'piece', rate: 395 },
  { id: 'pl7', vendorId: 'v1', region: 'Mumbai', material: 'Premium Wash Basin & CP Fittings', unit: 'set', rate: 5500 },
  { id: 'pl8', vendorId: 'v1', region: 'Delhi', material: 'Premium Wash Basin & CP Fittings', unit: 'set', rate: 5200 },
  { id: 'pl9', vendorId: 'v1', region: 'Bangalore', material: 'Premium Wash Basin & CP Fittings', unit: 'set', rate: 5800 },

  // Wall Decor (Mumbai, Delhi, Bangalore)
  { id: 'wd1', vendorId: 'v1', region: 'Mumbai', material: 'Asian Paints Royale Emulsion Paint', unit: 'bucket', rate: 6200 },
  { id: 'wd2', vendorId: 'v1', region: 'Delhi', material: 'Asian Paints Royale Emulsion Paint', unit: 'bucket', rate: 6000 },
  { id: 'wd3', vendorId: 'v1', region: 'Bangalore', material: 'Asian Paints Royale Emulsion Paint', unit: 'bucket', rate: 6400 },
  { id: 'wd4', vendorId: 'v1', region: 'Mumbai', material: 'Gypsum Board Sheet 6x4 (Ceiling)', unit: 'sheet', rate: 340 },
  { id: 'wd5', vendorId: 'v1', region: 'Delhi', material: 'Gypsum Board Sheet 6x4 (Ceiling)', unit: 'sheet', rate: 320 },
  { id: 'wd6', vendorId: 'v1', region: 'Bangalore', material: 'Gypsum Board Sheet 6x4 (Ceiling)', unit: 'sheet', rate: 355 },
  { id: 'wd7', vendorId: 'v1', region: 'Mumbai', material: 'Designer Textured Wallpaper', unit: 'roll', rate: 1800 },
  { id: 'wd8', vendorId: 'v1', region: 'Delhi', material: 'Designer Textured Wallpaper', unit: 'roll', rate: 1650 },
  { id: 'wd9', vendorId: 'v1', region: 'Bangalore', material: 'Designer Textured Wallpaper', unit: 'roll', rate: 1950 },

  // Chemicals (Mumbai, Delhi, Bangalore)
  { id: 'ch1', vendorId: 'v1', region: 'Mumbai', material: 'Waterproofing Compound (Liquid)', unit: 'litre', rate: 150 },
  { id: 'ch2', vendorId: 'v1', region: 'Delhi', material: 'Waterproofing Compound (Liquid)', unit: 'litre', rate: 140 },
  { id: 'ch3', vendorId: 'v1', region: 'Bangalore', material: 'Waterproofing Compound (Liquid)', unit: 'litre', rate: 160 },
  { id: 'ch4', vendorId: 'v1', region: 'Mumbai', material: 'Epoxy Grout Admixture', unit: 'kg', rate: 280 },
  { id: 'ch5', vendorId: 'v1', region: 'Delhi', material: 'Epoxy Grout Admixture', unit: 'kg', rate: 260 },
  { id: 'ch6', vendorId: 'v1', region: 'Bangalore', material: 'Epoxy Grout Admixture', unit: 'kg', rate: 295 },
  { id: 'ch7', vendorId: 'v1', region: 'Mumbai', material: 'Concrete Damp-proof Adjuvant', unit: 'bag', rate: 450 },
  { id: 'ch8', vendorId: 'v1', region: 'Delhi', material: 'Concrete Damp-proof Adjuvant', unit: 'bag', rate: 430 },
  { id: 'ch9', vendorId: 'v1', region: 'Bangalore', material: 'Concrete Damp-proof Adjuvant', unit: 'bag', rate: 470 },

  // Machineries (Mumbai, Delhi, Bangalore)
  { id: 'mc1', vendorId: 'v1', region: 'Mumbai', material: 'Concrete Mixer Heavy Machine (Rental)', unit: 'day', rate: 1500 },
  { id: 'mc2', vendorId: 'v1', region: 'Delhi', material: 'Concrete Mixer Heavy Machine (Rental)', unit: 'day', rate: 1400 },
  { id: 'mc3', vendorId: 'v1', region: 'Bangalore', material: 'Concrete Mixer Heavy Machine (Rental)', unit: 'day', rate: 1600 },
  { id: 'mc4', vendorId: 'v1', region: 'Mumbai', material: 'Heavy Demolition Hammer (Rental)', unit: 'day', rate: 1100 },
  { id: 'mc5', vendorId: 'v1', region: 'Delhi', material: 'Heavy Demolition Hammer (Rental)', unit: 'day', rate: 1000 },
  { id: 'mc6', vendorId: 'v1', region: 'Bangalore', material: 'Heavy Demolition Hammer (Rental)', unit: 'day', rate: 1150 },
  { id: 'mc7', vendorId: 'v1', region: 'Mumbai', material: 'Silent Diesel Generator Set (Rental)', unit: 'day', rate: 3500 },
  { id: 'mc8', vendorId: 'v1', region: 'Delhi', material: 'Silent Diesel Generator Set (Rental)', unit: 'day', rate: 3200 },
  { id: 'mc9', vendorId: 'v1', region: 'Bangalore', material: 'Silent Diesel Generator Set (Rental)', unit: 'day', rate: 3700 },

  // Construction Vehicles (Mumbai, Delhi, Bangalore)
  { id: 'vh1', vendorId: 'v1', region: 'Mumbai', material: 'JCB 3DX Backhoe Loader (Rental)', unit: 'hour', rate: 1200 },
  { id: 'vh2', vendorId: 'v1', region: 'Delhi', material: 'JCB 3DX Backhoe Loader (Rental)', unit: 'hour', rate: 1100 },
  { id: 'vh3', vendorId: 'v1', region: 'Bangalore', material: 'JCB 3DX Backhoe Loader (Rental)', unit: 'hour', rate: 1250 },
  { id: 'vh4', vendorId: 'v1', region: 'Mumbai', material: 'Transit Mixer 6 Cum (Rental)', unit: 'trip', rate: 1800 },
  { id: 'vh5', vendorId: 'v1', region: 'Delhi', material: 'Transit Mixer 6 Cum (Rental)', unit: 'trip', rate: 1700 },
  { id: 'vh6', vendorId: 'v1', region: 'Bangalore', material: 'Transit Mixer 6 Cum (Rental)', unit: 'trip', rate: 1950 },
  { id: 'vh7', vendorId: 'v1', region: 'Mumbai', material: 'Tata 10-Wheeler Dumper (Rental)', unit: 'day', rate: 4500 },
  { id: 'vh8', vendorId: 'v1', region: 'Delhi', material: 'Tata 10-Wheeler Dumper (Rental)', unit: 'day', rate: 4200 },
  { id: 'vh9', vendorId: 'v1', region: 'Bangalore', material: 'Tata 10-Wheeler Dumper (Rental)', unit: 'day', rate: 4750 }
];

interface ClientRequirement {
  id: string;
  title: string;
  description: string;
  category: ServiceType;
  budget: string;
  client: string;
  location: string;
  urgency: 'Urgently Needed' | 'Immediate' | 'Next 7 Days';
  status: 'Open' | 'Bid Submitted';
  requesterType?: 'Client' | 'Contractor';
  reqCategory?: 'Labours' | 'Materials' | 'Staff';
}

const INITIAL_CLIENT_REQUIREMENTS: ClientRequirement[] = [
  // Client - Materials
  {
    id: 'req-1',
    title: 'Urgent: Cement Supply for Noida Highrise Site',
    description: 'Require immediate delivery of 500 bags of Grade 53 OPC Cement. Direct unloading assistance required at site.',
    category: ServiceType.CONSTRUCTION,
    budget: '₹2,10,000',
    client: 'Noida Infra Developers',
    location: 'Sector 150, Noida',
    urgency: 'Urgently Needed',
    status: 'Open',
    requesterType: 'Client',
    reqCategory: 'Materials'
  },
  {
    id: 'req-1b',
    title: 'Tata Tiscon TMT Steel Reinforcement Supply (15 Tons)',
    description: 'Need urgent dispatch of Fe 550D TMT reinforcement bars of sizes 8mm, 12mm, and 16mm.',
    category: ServiceType.CONSTRUCTION,
    budget: '₹10,50,000',
    client: 'L&T Subcontractor Group',
    location: 'Ghatkopar, Mumbai',
    urgency: 'Immediate',
    status: 'Open',
    requesterType: 'Client',
    reqCategory: 'Materials'
  },
  // Client - Labours
  {
    id: 'req-2',
    title: 'Complete Plumbing Contractor for 3-Story Commercial Complex',
    description: 'Looking for a certified contracting firm to lay sewage lines, supply premium CP fittings, and install restroom assets for 12 washrooms.',
    category: ServiceType.CONSTRUCTION,
    budget: '₹4,80,000',
    client: 'Summit Heights Projects',
    location: 'Whitefield, Bangalore',
    urgency: 'Immediate',
    status: 'Open',
    requesterType: 'Client',
    reqCategory: 'Labours'
  },
  {
    id: 'req-3',
    title: 'Premium False Ceiling & Modern Wallpaper Installation',
    description: 'Need elegant gypsum ceiling with integrated warm LED profiles and acoustic board panels for a high-end duplex lounge.',
    category: ServiceType.INTERIOR,
    budget: '₹1,50,000',
    client: 'Mehra Luxury Villas',
    location: 'GK-2, Delhi',
    urgency: 'Next 7 Days',
    status: 'Open',
    requesterType: 'Client',
    reqCategory: 'Labours'
  },
  {
    id: 'req-4',
    title: 'Instant Labor Squad for Concrete Casting Slab',
    description: 'Require 12 skilled masons and 6 helper boys for casting 3500 sqft residential floor slab on Friday night. Meal and safety gear provided.',
    category: ServiceType.CONSTRUCTION,
    budget: '₹22,000',
    client: 'Agarwal & Sons Construction',
    location: 'Ghatkopar, Mumbai',
    urgency: 'Urgently Needed',
    status: 'Open',
    requesterType: 'Client',
    reqCategory: 'Labours'
  },
  // Contractor - Labours
  {
    id: 'req-5',
    title: 'Civil Contractor: Experienced Brickwork & Plastering Gang',
    description: 'Looking for subcontractor gang with 15+ masons and helpers for bricklaying and internal plastering of highrise residential floors.',
    category: ServiceType.CONSTRUCTION,
    budget: '₹1,80,000',
    client: 'K Raheja Corp Sub-Contractor',
    location: 'Bandra West, Mumbai',
    urgency: 'Urgently Needed',
    status: 'Open',
    requesterType: 'Contractor',
    reqCategory: 'Labours'
  },
  {
    id: 'req-6',
    title: 'Slab Shuttering & Centering Carpenters Needed',
    description: 'Urgent requirement of 8 shuttering carpenters for setting plywood formwork and steel props for a commercial building slab casting.',
    category: ServiceType.CONSTRUCTION,
    budget: '₹85,000',
    client: 'Techno Buildcon Solutions',
    location: 'Whitefield, Bangalore',
    urgency: 'Immediate',
    status: 'Open',
    requesterType: 'Contractor',
    reqCategory: 'Labours'
  },
  // Contractor - Materials
  {
    id: 'req-7',
    title: 'Contractor Require: 45 Cubic Meters of RMC Concrete M25 Grade',
    description: 'Requires supply of ready-mix concrete of grade M25 with standard transit mixers. Pouring pump required on site.',
    category: ServiceType.CONSTRUCTION,
    budget: '₹1,95,000',
    client: 'Rishabh Foundations',
    location: 'Noida Sector 62',
    urgency: 'Urgently Needed',
    status: 'Open',
    requesterType: 'Contractor',
    reqCategory: 'Materials'
  },
  {
    id: 'req-8',
    title: 'Ready Stock Red Clay Bricks (30,000 Pcs)',
    description: 'Contractor needs immediate site delivery of first-class double-burnt red bricks for partition walls.',
    category: ServiceType.CONSTRUCTION,
    budget: '₹2,40,000',
    client: 'Om Sai Developers',
    location: 'Thane West, Mumbai',
    urgency: 'Immediate',
    status: 'Open',
    requesterType: 'Contractor',
    reqCategory: 'Materials'
  },
  // Client - Staff Needed
  {
    id: 'req-9',
    title: 'Developer Require: Senior Resident Site Engineer (Structural)',
    description: 'Looking for a certified Structural B.Tech Civil Engineer with 5+ years experience in highrise RCC casting supervision and billing coordination.',
    category: ServiceType.CONSTRUCTION,
    budget: '₹45,000 / month',
    client: 'Noida Infra Developers',
    location: 'Sector 150, Noida',
    urgency: 'Urgently Needed',
    status: 'Open',
    requesterType: 'Client',
    reqCategory: 'Staff'
  },
  {
    id: 'req-10',
    title: 'Developer Require: Electrical MEP Project Engineer',
    description: 'Developer seeks Electrical/MEP consultant to oversee installation of transformers, DG sets, and low voltage routing layout.',
    category: ServiceType.CONSTRUCTION,
    budget: '₹50,000 / month',
    client: 'Summit Heights Projects',
    location: 'Whitefield, Bangalore',
    urgency: 'Next 7 Days',
    status: 'Open',
    requesterType: 'Client',
    reqCategory: 'Staff'
  },
  // Contractor - Staff Needed
  {
    id: 'req-11',
    title: 'Contractor Require: Junior Quantity Surveyor & AutoCad Draftsman',
    description: 'Contracting firm requires quantity estimation specialist to draft material BBS charts and coordinate site measurements.',
    category: ServiceType.CONSTRUCTION,
    budget: '₹28,000 / month',
    client: 'K Raheja Corp Sub-Contractor',
    location: 'Bandra West, Mumbai',
    urgency: 'Immediate',
    status: 'Open',
    requesterType: 'Contractor',
    reqCategory: 'Staff'
  },
  {
    id: 'req-12',
    title: 'Contractor Require: HSE Safety Officer',
    description: 'Requires certified safety specialist for daily briefing, labor hazard audit, and equipment safety check of commercial plaza foundation work.',
    category: ServiceType.CONSTRUCTION,
    budget: '₹35,000 / month',
    client: 'Rishabh Foundations',
    location: 'Noida Sector 62',
    urgency: 'Urgently Needed',
    status: 'Open',
    requesterType: 'Contractor',
    reqCategory: 'Staff'
  }
];

const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 555-1001', joinedDate: '2023-01-15', totalProjects: 3 },
  { id: 'c2', name: 'TechHub Inc', email: 'admin@techhub.com', phone: '+1 555-1002', joinedDate: '2023-03-20', totalProjects: 1 },
  { id: 'c3', name: 'Greenwood Society', email: 'contact@greenwood.com', phone: '+1 555-1003', joinedDate: '2023-05-10', totalProjects: 5 },
  { id: 'c4', name: 'Mark Evans', email: 'mark.evans@gmail.com', phone: '+1 555-1004', joinedDate: '2023-08-12', totalProjects: 0 },
];

const MOCK_CHANNEL_PARTNERS: ChannelPartner[] = [
  { id: 's1', name: 'John Doe', email: 'john.d@constmart.com', phone: '+1 555-2001', experience: '10 years', activeMatches: 5 },
  { id: 's2', name: 'Sarah Connor', email: 'sarah.c@constmart.com', phone: '+1 555-2002', experience: '8 years', activeMatches: 3 },
  { id: 's3', name: 'Mike Ross', email: 'mike.r@constmart.com', phone: '+1 555-2003', experience: '5 years', activeMatches: 1 },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Modern Kitchen Renovation',
    description: 'Full remodel of 200sqft kitchen with marble countertops.',
    serviceType: ServiceType.INTERIOR,
    budget: 15000,
    status: 'In Progress',
    paymentStatus: PaymentStatus.PAID,
    date: '2023-10-15',
    clientName: 'Alice Johnson',
    vendorName: 'BestBuild Corp'
  },
  {
    id: '2',
    title: 'Office Building Plumbing',
    description: 'Fixing leakage in 3rd floor washrooms.',
    serviceType: ServiceType.CONSTRUCTION,
    budget: 2000,
    status: 'Completed',
    paymentStatus: PaymentStatus.PAID,
    date: '2023-09-20',
    clientName: 'TechHub Inc',
    vendorName: 'QuickFix Plumbers'
  },
  {
    id: '3',
    title: 'Security Guard Placement',
    description: 'Providing 3 guards for society gate.',
    serviceType: ServiceType.BUILDING_SOCIETY,
    budget: 5000,
    status: 'Pending',
    paymentStatus: PaymentStatus.PENDING,
    date: '2023-10-25',
    clientName: 'Greenwood Society',
  }
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    senderId: 'admin',
    senderName: 'System Admin',
    senderRole: 'Admin',
    text: 'Welcome to Construction Mart SHK! Post a request to get started.',
    timestamp: new Date().toISOString()
  }
];

const SERVICES_LIST = [
  { type: ServiceType.CONSTRUCTION, icon: '🏗️', desc: 'Civil works, plumbing, electrical.' },
  { type: ServiceType.INTERIOR, icon: '🎨', desc: 'Renovation, painting, decor.' },
  { type: ServiceType.BUILDING_SOCIETY, icon: '🏢', desc: 'Maintenance, security, gardening.' },
  { type: ServiceType.HOME, icon: '🏠', desc: 'Cleaning, repairs, pest control.' },
  { type: ServiceType.PLACEMENT, icon: '👥', desc: 'Staffing for construction sites.' },
];

const LANDING_ADS: CarouselItem[] = [
  {
    id: 101,
    title: "Dream Home Interiors",
    category: "Special Offer",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    description: "Get 20% off on complete home interior packages. Book your consultation today!",
    rating: 5
  },
  {
    id: 102,
    title: "Expert Construction",
    category: "Verified Vendors",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    description: "Reliable civil contractors for residential and commercial projects. Timely delivery guaranteed.",
    rating: 5
  },
  {
    id: 103,
    title: "Society Maintenance",
    category: "Hassle Free",
    image: "/src/assets/images/building_repair_1782069406615.jpg",
    description: "Comprehensive maintenance packages for building societies. Security, cleaning, and gardening.",
    rating: 4
  }
];

const JOB_VACANCIES_SLIDES: CarouselItem[] = [
  {
    id: 501,
    title: "Civil Engineer & Project Consultant",
    category: "Site & Technical Careers",
    image: "/src/assets/images/job_civil_engineer_1782070226038.jpg",
    description: "Seeking experienced Civil Engineers and structural technical consultants to supervise construction, site blueprints, and civil audits.",
    rating: 5
  },
  {
    id: 502,
    title: "Project Manager & MEP Engineer",
    category: "Construction Management",
    image: "/src/assets/images/job_project_manager_1782070243610.jpg",
    description: "Lead active on-site planning, structural execution, and MEP mechanical-electrical-plumbing coordination for multi-storey systems.",
    rating: 5
  },
  {
    id: 503,
    title: "Safety Officer & HSE Inspector",
    category: "Workplace Health & Safety",
    image: "/src/assets/images/job_safety_officer_1782070261216.jpg",
    description: "Enforce site protection procedures, scaffolding load checkmarks, worker gears, and certified civil safety regulations.",
    rating: 5
  },
  {
    id: 504,
    title: "Architect & CAD Draftsman Layouts",
    category: "Design & Architectural Drafts",
    image: "/src/assets/images/job_architect_drafts_1782070276835.jpg",
    description: "Draft structural floor concepts, exterior design elevations, and build layout drafts to materialise master civil blueprints.",
    rating: 5
  }
];

const DETAILED_SERVICES = [
  {
    category: "Construction services (Part A)",
    items: [
      "Carpenter Setup", "Fitter & steel binding", "Concrete Casting", "Plaster (Internal/External)", "Blockwork & Brickwork", 
      "Tiles & Marble fitting", "Electrician shift", "Plumbing & Drainage", "POP craft work", "False Ceiling installation", 
      "Fire Fighting setup", "Post Tension Service", "Waterproofing & Grouting", "Breaker & core cutting", "Hilti anchor fixing", 
      "Steel Fabricators", "Aluminium Fabricators", "Scaffolding Setup", "Steel Threading", "Vadari stonework", 
      "Post Concrete Finishing", "Hywa Dumper Service", "Debris Disposal Logist.", "Mivan Acid Wash"
    ]
  },
  {
    category: "Construction services (Part B)",
    items: [
      "Excavation Earthworks", "Demolition structure", "Professional Painter", "Scrap trade clearance", "Home Decor Electrician", 
      "Piling Foundations", "RMC Pump concreting", "Bore Well Drilling", "Facade Glass fitting", "Tower Crane Contractor", 
      "Crane service rental", "Crane TPI certification", "CCTV & safety security", "AC installation duct", "Swer & Drainage Line",
      "Precast materials", "Cover and kanda maker", "Dewatering pump repairs"
    ]
  },
  {
    category: ServiceType.INTERIOR,
    items: [
      "Block work", "Tile/Marble fixing", "Plumbing", "Plaster", "POP & False ceiling", 
      "Furniture", "Matress/Sofa", "Carpet installation", "Paint", "Waterproofing", 
      "Wallpaper", "Modular kitchen", "CCTV installation", "Steel fabrication", "Aluminium & Glass work"
    ]
  },
  {
    category: ServiceType.BUILDING_SOCIETY,
    items: [
      "CCTV", "Bore well", "Building Audit", "Building repairs", "Sewer line cleaning", 
      "Waste management", "Housekeeping", "Security", "Steel fabrication", "Family function decoration"
    ]
  },
  {
    category: ServiceType.HOME,
    items: [
      "Plumbing", "AC/Fridge/Cooler repair", "Fan/Mixer/Gas repair", "Pest control", "Deep cleaning", 
      "Mattress wash", "Tank cleaning", "Curtain fixing", "Grill works", "Aluminium & Glass work", "Family function decoration"
    ]
  },
  {
    category: ServiceType.PLACEMENT,
    items: [
      "Jr. Civil Engineer", "Sr. Civil Engineer", "Quality Engineer", "Safety Engineer", "Safety Manager",
      "Billing Engineer", "MEP Engineer", "AC technician", "Quantity surveyors", "Draftsman",
      "Architect", "BBS Engineer", "Freelancer", "Surveyors", "Welder",
      "Construction Supervisor", "Fire fighting supervisor", "CCTV & Wifi technician", "Structural consultant", "MEP consultant",
      "Facade supervisor", "Facade Engineer", "Interior Designer", "Crane Signal man", "Crane operator",
      "JCB operator", "Hydra operator", "Piling machine operator", "Bore well operator", "PT Engineer",
      "PT supervisor", "RMC Sr. Engineer", "RMC Jr. Engineer", "RMC Supervisor", "RMC pump operator",
      "RMC quality engineer"
    ]
  },
  {
    category: "PMC & Quality Supervision",
    items: [
      "Daily Site Progress (DPR)", "Contractor MB Measurement Audit", "RA Bill Physical Verification",
      "Concrete Cube 7/28-Day Strength QA", "Rebar Lap & Cover Inspection", "Waterproofing Ponding Audits",
      "Tender Preparation & BOQ Control", "Defect Liability & Snag Clearance"
    ]
  },
  {
    category: "Brokers Point (Real Estate)",
    items: [
      "Residential Luxury Apartments", "Grade-A Pre-Leased Commercial (8-9% ROI)", "Society Redevelopment JV & DM",
      "Industrial Logistics & Land Parcels", "RERA Brokerage Payout Calculator", "Developer Direct Mandates",
      "Escrow Protected Settlements", "High-Yield Retail Shops"
    ]
  },
  {
    category: "Architect & Design Studio",
    items: [
      "2D AutoCAD Floor Plans", "Municipal Sanction Drawings", "Photorealistic 3D Exterior Elevations",
      "Interior 3D Perspective Modeling", "Vastu Layout Consulting", "Walkthrough Architectural Animations",
      "Landscape & Master Site Planning", "Working & Structural Coordination Drawings"
    ]
  },
  {
    category: "RMC (Ready-Mix Concrete) Plant",
    items: [
      "M20 to M50 Grade Concrete Mix Design", "Transit Mixer Fleet Dispatch Logistics", "Boom Pump & Stationary Line Pumping",
      "7-Day & 28-Day Concrete Cube Strength Lab Tests", "Self-Compacting & Flyash Concrete", "Temperature Controlled Mass Concreting"
    ]
  },
  {
    category: "Civil & Structural Consultancy",
    items: [
      "Building Structural Stability & Load Audits", "Geotechnical Soil Bearing Capacity Tests", "Seismic & Wind Load Analysis",
      "Independent Third-Party QA/QC Verification", "Non-Destructive Rebound Hammer & Ultrasonic Tests", "Bar Bending Schedule (BBS) Verification"
    ]
  },
  {
    category: "MEP (Mechanical, Electrical & Plumbing)",
    items: [
      "HVAC Central Chiller & Ventilation Ducting", "Electrical Substation & HT/LT Panel Setup", "Sanitary Drainage & Internal Water Supply Piping",
      "Fire Hydrant, Hose Reel & Sprinkler Networks", "Building Management Systems (BMS) Automation", "Diesel Generator (DG) & Solar PV Integration",
      "Certified MEP Site Supervisors & Plumbers"
    ]
  },
  {
    category: "Construction Factory & Precast Manufacturing",
    items: [
      "Automated Precast Concrete Wall Panels", "Autoclave Aerated Concrete (AAC) Blocks", "Prestressed Hollowcore Concrete Slabs",
      "Heavy Duty Flyash Bricks & Interlocking Pavers", "Direct Bulk Factory Yard Consignments", "Ready-Mix Batching Plant Manufacturing"
    ]
  },
  {
    category: "Channel Partner & Referral Network",
    items: [
      "Verified Real Estate Buyer Leads", "Developer Turnkey Mandate Referrals", "Escrow Commission Distribution Tracking",
      "Tiered Institutional Partner Payouts", "Dedicated Partner QR & Referral Code"
    ]
  },
  {
    category: "Construction Material Marketplace",
    items: [
      "Wholesale OPC 53 & PPC 43 Grade Cement", "Fe-550D TMT Reinforcement Steel Rebars",
      "River Sand, Crushed Stone Sand & Blue Metal 10/20mm", "High Precision Red Clay Bricks & AAC Blocks",
      "Structural Steel Beams, MS Channels & Angles", "Waterproofing Chemicals, Admixtures & Epoxy Grouts",
      "Binding Wire, Shuttering Ply & Construction Hardware"
    ]
  }
];

// --- COMPONENTS ---

// Reusable Footer Component
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              <Logo size="sm" />
            </div>
            <p className="text-sm text-gray-500">
              The most trusted marketplace for construction and interior renovation needs.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-blue-600"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-red-600"><Youtube size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-pink-600"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-800"><Linkedin size={20} /></a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Construction</li>
              <li>Interior Design</li>
              <li>Society Maintenance</li>
              <li>Placement Services</li>
              <li>Home Services</li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
             <h4 className="font-semibold text-gray-900 mb-4">Newsletter</h4>
             <p className="text-sm text-gray-500 mb-4">Subscribe to our newsletter for latest updates and offers.</p>
             <div className="flex gap-2">
               <input type="email" placeholder="Enter your email" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
               <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">Subscribe</button>
             </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Construction Mart SHK. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export const ROLE_SYMBOLS: Record<UserRole, { img: string; label: string; desc: string; icon: any }> = {
  // 1. Previous roles up to Channel Partner (kept in order, Material Supplier preserved as earlier)
  [UserRole.CLIENT]: {
    img: developerSymbolImg,
    label: 'Developer',
    desc: 'I want to hire services & post civil projects',
    icon: Building2
  },
  [UserRole.VENDOR]: {
    img: vendorSymbolImg,
    label: 'Vendor',
    desc: 'I offer contracting & general civil works',
    icon: Briefcase
  },
  [UserRole.PMC]: {
    img: pmcSymbolImg,
    label: 'PMC',
    desc: 'Project Management Consultant / Site Supervision / RA Bill & Quality Audits',
    icon: ShieldCheck
  },
  [UserRole.LABOUR]: {
    img: labourSymbolImg,
    label: 'Labour',
    desc: 'I am a skilled technician/helper seeking shift bookings',
    icon: HardHat
  },
  [UserRole.MATERIAL_SUPPLIER]: {
    img: supplierSymbolImg,
    label: 'Material Supplier',
    desc: 'Supplying bulk cement, TMT steel, sand & construction raw gear',
    icon: Package
  },
  [UserRole.JOB]: {
    img: jobSymbolImg,
    label: 'Construction and Engineering Staff',
    desc: 'Civil site engineers, surveyors, draftsmen & supervisors',
    icon: GraduationCap
  },
  [UserRole.FREELANCER]: {
    img: freelancerSymbolImg,
    label: 'Freelancer',
    desc: 'Drafting plans/3D elevations, steel BBS, billing & advisory',
    icon: Sparkles
  },
  [UserRole.BROKER]: {
    img: brokerSymbolImg,
    label: 'Brokers (Real Estate)',
    desc: 'RERA Real Estate Agents / Outright Properties / Commercial Mandates',
    icon: Home
  },
  [UserRole.CHANNEL_PARTNER]: {
    img: brokerSymbolImg,
    label: 'Channel Partner',
    desc: 'Refer projects & clients, earn referral commissions',
    icon: Share2
  },

  // 2. Added after Channel Partner: Architect, RMC, Consultant, Construction Factory, MEP
  [UserRole.ARCHITECT]: {
    img: architectSymbolImg,
    label: 'Architect',
    desc: 'Architectural 2D blueprints, municipal approvals, 3D elevations & planning',
    icon: Compass
  },
  [UserRole.RMC]: {
    img: rmcSymbolImg,
    label: 'RMC Plant',
    desc: 'Ready-mix concrete batching plant, transit mixer logistics & pumping',
    icon: Truck
  },
  [UserRole.CONSULTANT]: {
    img: consultantSymbolImg,
    label: 'Consultant',
    desc: 'Structural engineering, geotech soil tests, MEP & civil quality audits',
    icon: FileCheck2
  },
  [UserRole.CONSTRUCTION_FACTORY]: {
    img: factorySymbolImg,
    label: 'Construction Factory',
    desc: 'Precast panels, AAC blocks, cement batch plant & manufacturing gear',
    icon: Factory
  },
  [UserRole.MEP]: {
    img: mepSymbolImg,
    label: 'MEP',
    desc: 'Mechanical, electrical and plumbing staff/ supervisor and labour',
    icon: Wrench
  }
};

const RoleSelection = ({ 
  onSelect, 
  activityRates, 
  materialRates,
  onOpenRateExplorer,
  onRegister,
  onBackToHome
}: { 
  onSelect: (role: UserRole) => void;
  activityRates: ActivityRate[];
  materialRates: MaterialRate[];
  onOpenRateExplorer: () => void;
  onRegister?: (role: UserRole) => void;
  onBackToHome?: () => void;
}) => {
  const [showRegister, setShowRegister] = useState(false);
  const [regRole, setRegRole] = useState<UserRole | null>(null);
  const [selectedServiceModal, setSelectedServiceModal] = useState<'brokersPoint' | 'pmc' | 'fullCatalog' | null>(null);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('All');

  // Registration form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('3 Years');
  const [charges, setCharges] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  const handleRegister = (role: UserRole) => {
    // When a register handler is provided (new auth flow), open the AuthScreen register tab.
    if (onRegister) {
      onRegister(role);
      return;
    }
    setRegRole(role);
    setShowRegister(true);
    // Initialize default category depending on selected role
    if (role === UserRole.LABOUR) setCategory('Labour');
    else if (role === UserRole.VENDOR) setCategory('Contractor');
    else if (role === UserRole.PMC) setCategory('Project Management Consultant (PMC)');
    else if (role === UserRole.MATERIAL_SUPPLIER) setCategory('Material Supplier');
    else if (role === UserRole.JOB) setCategory('Civil Engineer');
    else if (role === UserRole.FREELANCER) setCategory('Freelance Consultant');
    else if (role === UserRole.BROKER) setCategory('Real Estate Broker / Channel Partner');
    else setCategory('Developer / Client');
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const registrationData = {
      id: `reg-${Date.now()}`,
      fullName,
      email,
      password, // securely sent to storage (bcrypt representation in mock-database backend client-side)
      mobile,
      city,
      role: regRole,
      category: category || regRole,
      experience,
      charges: charges || 'As per quote',
      companyName,
      gstNumber,
      status: 'Pending Approval',
      created_at: new Date().toISOString()
    };

    await saveSubmission('registration', registrationData);
    alert(`🎉 Registration successful! Professional profile for ${fullName} submitted for Admin Approval. You can now login.`);
    
    // Reset states
    setFullName('');
    setEmail('');
    setPassword('');
    setMobile('');
    setCity('');
    setCharges('');
    setCompanyName('');
    setGstNumber('');
    setShowRegister(false);
    onBackToHome?.();
  };

  const RegistrationModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            {regRole && ROLE_SYMBOLS[regRole] && (
              <img 
                src={ROLE_SYMBOLS[regRole].img} 
                alt={regRole} 
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-orange-400 shadow-md shrink-0" 
              />
            )}
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">
                Register Profile
              </h3>
              <p className="text-xs text-orange-600 font-bold">
                {regRole === UserRole.CLIENT ? 'Developer' : 
                 regRole === UserRole.VENDOR ? 'Vendor' : 
                 regRole === UserRole.PMC ? 'PMC / Project Management Consultant' : 
                 regRole === UserRole.LABOUR ? 'Labour' : 
                 regRole === UserRole.MATERIAL_SUPPLIER ? 'Material Supplier' : 
                 regRole === UserRole.JOB ? 'Construction and Engineering Staff' : 
                 regRole === UserRole.FREELANCER ? 'Freelancer' : 
                 regRole === UserRole.BROKER ? 'Brokers (Real Estate)' : 
                 regRole === UserRole.CHANNEL_PARTNER ? 'Channel Partner' : 
                 regRole === UserRole.ARCHITECT ? 'Architect' : 
                 regRole === UserRole.RMC ? 'RMC Plant' : 
                 regRole === UserRole.CONSULTANT ? 'Consultant' : 
                 regRole === UserRole.CONSTRUCTION_FACTORY ? 'Construction Factory' : 
                 regRole === UserRole.MEP ? 'MEP Staff & Supervisor' : regRole}
              </p>
            </div>
          </div>
          <button onClick={() => setShowRegister(false)} className="text-gray-400 hover:text-gray-600">
            <X size={20}/>
          </button>
        </div>
        <form className="space-y-4 text-left" onSubmit={handleSubmitRegistration}>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
            <input 
              type="text" 
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" 
              placeholder="e.g. Rahul Sharma" 
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email ID *</label>
            <input 
              type="email" 
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" 
              placeholder="e.g. rahul@example.com" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {regRole === UserRole.LABOUR || regRole === UserRole.JOB || regRole === UserRole.FREELANCER 
                ? 'Company / Practice Name (Optional)' 
                : regRole === UserRole.BROKER ? 'Broker Agency / Firm Name (Optional)' : 'Company Name *'}
            </label>
            <input 
              type="text" 
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" 
              placeholder={regRole === UserRole.PMC ? 'e.g. Apex PMC & Civil Audit Ltd' : regRole === UserRole.BROKER ? 'e.g. Prime Crest Real Estate Advisory' : 'e.g. Apex Engineering / Studio'} 
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              required={regRole !== UserRole.LABOUR && regRole !== UserRole.JOB && regRole !== UserRole.FREELANCER && regRole !== UserRole.BROKER}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {regRole === UserRole.CLIENT ? 'Phone Number (Optional)' : 'Phone Number *'}
            </label>
            <input 
              type="tel" 
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" 
              placeholder="e.g. +91 98765-43210" 
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              required={regRole !== UserRole.CLIENT} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
            <input 
              type="text" 
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" 
              placeholder="e.g. Mumbai, Noida, Bengaluru" 
              value={city}
              onChange={e => setCity(e.target.value)}
              required 
            />
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-[0.98]">
              Submit Registration Live to Supabase
            </button>
            <p className="text-[10px] text-gray-500 text-center mt-2">
              By registering, your details will be synchronized instantly to your Supabase account.
            </p>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <Logo size="lg" />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
            India's Leading Construction & Interior Marketplace
          </span>
        </div>

        {/* Ads Carousel */}
        <ServiceCarousel items={LANDING_ADS} autoPlayInterval={4000} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content Area: Login & Register */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-500 mb-6">Please select your role to login to your dashboard.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(ROLE_SYMBOLS).map(([roleKey, item]) => {
                  const IconComp = item.icon || Building2;
                  return (
                    <button
                      key={roleKey}
                      onClick={() => onSelect(roleKey as UserRole)}
                      className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-150 hover:border-orange-400 flex flex-col items-center text-center group hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 rounded-2xl overflow-hidden shadow-md ring-2 ring-gray-100 group-hover:ring-orange-500 transition-all relative bg-orange-50 flex items-center justify-center">
                        <img 
                          src={item.img} 
                          alt={item.label} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 relative z-10"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                        <IconComp size={30} className="text-orange-600 absolute" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors flex items-center justify-center gap-1.5">
                        <IconComp size={14} className="text-orange-500 shrink-0" />
                        {item.label} Login
                      </h3>
                      <p className="text-[10px] text-gray-500 font-medium min-h-[2.25rem] leading-tight line-clamp-2">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-white rounded-2xl p-6 border border-orange-100 shadow-sm">
               <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Join Our Platform</h3>
                    <p className="text-sm text-gray-600">Create a verified account today to start listing or hiring.</p>
                  </div>
                  <div className="flex flex-wrap gap-2.5 justify-center">
                     {Object.entries(ROLE_SYMBOLS).map(([roleKey, item]) => {
                       const IconComp = item.icon || Building2;
                       return (
                         <button 
                           key={roleKey}
                           onClick={() => handleRegister(roleKey as UserRole)} 
                           className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 hover:border-orange-400 rounded-xl text-xs font-bold text-gray-800 hover:bg-orange-50/50 shadow-sm transition-all"
                         >
                           <div className="w-5 h-5 rounded-md overflow-hidden shrink-0 ring-1 ring-orange-300 bg-orange-50 flex items-center justify-center text-orange-600">
                             <IconComp size={12} className="text-orange-600 shrink-0" />
                           </div>
                           <span>{item.label} Registration</span>
                         </button>
                       );
                     })}
                  </div>
               </div>
            </div>

            {/* Market Rate Explorer Showcase */}
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BarChart4 className="text-orange-600" size={20} />
                  Construction Market Rate Explorer
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  View real-time, verified average rates for labor services and construction materials across key geographic regions.
                </p>
              </div>
              <button 
                onClick={onOpenRateExplorer}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-[0.98]"
              >
                <TrendingUp size={16} />
                Open Construction Market Rate Explorer
              </button>
            </div>

            {/* Additional Services & Specialized Portals Section (Dedicated Service Pages for all 8 verticals) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                      Specialized Service Pages
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mt-1">
                    Explore Platform Services & Dedicated Portals
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Access dedicated service pages and tools for Developers, Vendors, PMC, Labour, Material Suppliers, Job Seekers, Freelancers, and Real Estate Brokers.
                  </p>
                </div>
              </div>

              {/* 8 Verticals Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Developer Service Portal */}
                <div className="bg-slate-50 hover:bg-orange-50/30 border border-gray-200 hover:border-orange-300 rounded-2xl p-5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200 shrink-0">
                          <img src={ROLE_SYMBOLS[UserRole.CLIENT].img} alt="Developer" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">Developer & Client Portal</h4>
                          <span className="text-[10px] text-gray-500 font-medium">Civil Tenders & Project Escrow</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                        Vertical 01
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      Post multi-crore civil works, tender BOQ specifications, hire certified turnkey vendors, and track escrow payments with milestone safety.
                    </p>
                    <ul className="text-[11px] text-gray-500 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-orange-500" /> AI Project Scope & BOQ Generator</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-orange-500" /> Instant Labour (Labour Naka) Dispatch</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => onSelect(UserRole.CLIENT)}
                    className="w-full py-2 px-3 bg-white hover:bg-orange-600 hover:text-white border border-gray-200 hover:border-orange-600 text-gray-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Launch Developer Portal</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 2. Vendor & Contractor Hub */}
                <div className="bg-slate-50 hover:bg-orange-50/30 border border-gray-200 hover:border-orange-300 rounded-2xl p-5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200 shrink-0">
                          <img src={ROLE_SYMBOLS[UserRole.VENDOR].img} alt="Vendor" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">Vendor & Contractor Hub</h4>
                          <span className="text-[10px] text-gray-500 font-medium">Turnkey Contracting & Estimates</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                        Vertical 02
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      Access direct developer requirement feeds, submit competitive bids with 0% middleman fees, and generate verified BOQ quotations.
                    </p>
                    <ul className="text-[11px] text-gray-500 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-orange-500" /> Automated BOQ Rate & Quotation Engine</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-orange-500" /> Direct Client Chat & Bidding Station</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => onSelect(UserRole.VENDOR)}
                    className="w-full py-2 px-3 bg-white hover:bg-orange-600 hover:text-white border border-gray-200 hover:border-orange-600 text-gray-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Launch Vendor Portal</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 3. PMC (Project Management Consultancy) */}
                <div className="bg-slate-50 hover:bg-orange-50/30 border border-gray-200 hover:border-orange-300 rounded-2xl p-5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200 shrink-0">
                          <img src={ROLE_SYMBOLS[UserRole.PMC].img} alt="PMC" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">PMC & Quality Supervision</h4>
                          <span className="text-[10px] text-gray-500 font-medium">Site QA/QC & RA Bill Audits</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                        Vertical 03
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      Independent Project Management Consultants for resident civil supervision, concrete cube testing, reinforcement lap audits & RA bill clearance.
                    </p>
                    <ul className="text-[11px] text-gray-500 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-orange-500" /> Active Snag & Non-Conformance Log (NCR)</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-orange-500" /> RA Bill Physical Measurement Book Audit</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setSelectedServiceModal('pmc')}
                      className="py-2 px-3 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>Explore Service Page</span>
                    </button>
                    <button 
                      onClick={() => onSelect(UserRole.PMC)}
                      className="py-2 px-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>PMC Login</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* 4. Labour & Sub-Contractor Station */}
                <div className="bg-slate-50 hover:bg-orange-50/30 border border-gray-200 hover:border-orange-300 rounded-2xl p-5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200 shrink-0">
                          <img src={ROLE_SYMBOLS[UserRole.LABOUR].img} alt="Labour" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">Labour & Sub-Contractor Hub</h4>
                          <span className="text-[10px] text-gray-500 font-medium">Instant Labour (Labour Naka) Shift Deployment</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                        Vertical 04
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      Hire certified masons, bar benders, shuttering carpenters, painters, electricians and helpers for immediate same-day site deployment.
                    </p>
                    <ul className="text-[11px] text-gray-500 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-orange-500" /> Instant Labour (Labour Naka) Booking & Dispatch</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-orange-500" /> Transparent Regional Standard Wages</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onRegister?.(UserRole.LABOUR)}
                      className="py-2 px-3 bg-white hover:bg-orange-50 text-orange-900 border border-orange-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <UserPlus size={13} className="text-orange-600" />
                      <span>Labour Register</span>
                    </button>
                    <button 
                      onClick={() => onSelect(UserRole.LABOUR)}
                      className="py-2 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>Labour Login</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* 5. Construction Material Marketplace */}
                <div className="bg-slate-50 hover:bg-emerald-50/30 border border-gray-200 hover:border-emerald-300 rounded-2xl p-5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200 shrink-0 bg-emerald-50 flex items-center justify-center relative">
                          <img 
                            src={ROLE_SYMBOLS[UserRole.MATERIAL_SUPPLIER].img} 
                            alt="Construction Material" 
                            className="w-full h-full object-cover relative z-10" 
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                          />
                          <Package size={20} className="text-emerald-600 absolute" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors">Construction Material Marketplace</h4>
                          <span className="text-[10px] text-gray-500 font-medium">Cement, Steel, Sand & Raw Materials</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                        Vertical 05
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      Procure OPC/PPC Cement, Fe550D TMT Steel, RMC Ready Mix Concrete, River/Crushed Sand, Aggregates and heavy equipment at factory prices.
                    </p>
                    <ul className="text-[11px] text-gray-500 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Direct Wholesale Manufacturer Rates</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Instant Truckload & Yard Logistics Dispatch</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onRegister?.(UserRole.MATERIAL_SUPPLIER)}
                      className="py-2 px-3 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <UserPlus size={13} className="text-emerald-600" />
                      <span>Material Register</span>
                    </button>
                    <button 
                      onClick={() => onSelect(UserRole.MATERIAL_SUPPLIER)}
                      className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>Material Login</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* 6. Job & Recruitment Placement */}
                <div className="bg-slate-50 hover:bg-orange-50/30 border border-gray-200 hover:border-orange-300 rounded-2xl p-5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200 shrink-0">
                          <img src={ROLE_SYMBOLS[UserRole.JOB].img} alt="Job" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">Construction & Engineering Staff</h4>
                          <span className="text-[10px] text-gray-500 font-medium">Civil Site Engineers & Supervisors</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                        Vertical 06
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      Recruitment board connecting site engineers, QA/QC managers, safety officers, quantity surveyors, and technical supervisors directly with developers.
                    </p>
                    <ul className="text-[11px] text-gray-500 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-orange-500" /> 100% Direct Recruiter Interview Calls</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-orange-500" /> Transparent Experience-Based Packages</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => onSelect(UserRole.JOB)}
                    className="w-full py-2 px-3 bg-white hover:bg-orange-600 hover:text-white border border-gray-200 hover:border-orange-600 text-gray-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Launch Construction & Engineering Staff Portal</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 7. Freelancer Advisory & CAD */}
                <div className="bg-slate-50 hover:bg-orange-50/30 border border-gray-200 hover:border-orange-300 rounded-2xl p-5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200 shrink-0">
                          <img src={ROLE_SYMBOLS[UserRole.FREELANCER].img} alt="Freelancer" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">Freelancer Engineering & CAD</h4>
                          <span className="text-[10px] text-gray-500 font-medium">AutoCAD Blueprints & BBS</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                        Vertical 07
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      Hire freelance architectural draftsmen, 3D elevation specialists, Bar Bending Schedule (BBS) steel estimators, and structural consultants.
                    </p>
                    <ul className="text-[11px] text-gray-500 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-orange-500" /> Milestone-based Deliverables & Proofing</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-orange-500" /> Quantity Surveying & BOQ Verification</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => onSelect(UserRole.FREELANCER)}
                    className="w-full py-2 px-3 bg-white hover:bg-orange-600 hover:text-white border border-gray-200 hover:border-orange-600 text-gray-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Launch Freelancer Portal</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 8. Brokers Point (Real Estate Advisory) */}
                <div className="bg-gradient-to-br from-orange-500/10 via-amber-50 to-white border-2 border-orange-400/80 rounded-2xl p-5 transition-all flex flex-col justify-between shadow-sm hover:shadow-md group relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-orange-600 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm">
                    Featured Marketplace
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md ring-2 ring-orange-400 shrink-0">
                          <img src={ROLE_SYMBOLS[UserRole.BROKER].img} alt="Brokers Point" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">Brokers Point — Real Estate</h4>
                          <span className="text-[10px] text-orange-700 font-bold">RERA Mandates & Asset Advisory</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed mb-3 font-medium">
                      Verified luxury residential apartments, pre-leased Grade-A commercial office floors (8-9% ROI), society redevelopment mandates & land JV advisory.
                    </p>
                    <ul className="text-[11px] text-gray-600 space-y-1 mb-4 font-medium">
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-orange-600" /> Live Real Estate Property Inventory & Filters</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-orange-600" /> Interactive Brokerage Commission Calculator</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setSelectedServiceModal('brokersPoint')}
                      className="py-2.5 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-md active:scale-95"
                    >
                      <Building2 size={14} />
                      <span>Explore Brokers Point</span>
                    </button>
                    <button 
                      onClick={() => onSelect(UserRole.BROKER)}
                      className="py-2.5 px-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>Broker Login</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* 9. Channel Partner Portal */}
                <div className="bg-slate-50 hover:bg-sky-50/30 border border-gray-200 hover:border-sky-300 rounded-2xl p-5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200 shrink-0 bg-sky-50 flex items-center justify-center relative">
                          <img 
                            src={brokerSymbolImg} 
                            alt="Channel Partner" 
                            className="w-full h-full object-cover relative z-10" 
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                          />
                          <Share2 size={20} className="text-sky-600 absolute" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-sky-600 transition-colors">Channel Partner Network</h4>
                          <span className="text-[10px] text-gray-500 font-medium">Project Referrals & Partner Commission</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                        Vertical 09
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      Connect real estate leads, civil developers and contractors to the platform and earn attractive tiered referral payouts and commissions.
                    </p>
                    <ul className="text-[11px] text-gray-500 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-sky-500" /> Dedicated Referral Tracking Code</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-sky-500" /> Verified Commission Escrow Payouts</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onRegister?.(UserRole.CHANNEL_PARTNER)}
                      className="py-2 px-3 bg-white hover:bg-sky-50 text-sky-900 border border-sky-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <UserPlus size={13} className="text-sky-600" />
                      <span>Partner Register</span>
                    </button>
                    <button 
                      onClick={() => onSelect(UserRole.CHANNEL_PARTNER)}
                      className="py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>Partner Login</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* 10. Architect & Design Studio Portal */}
                <div className="bg-slate-50 hover:bg-indigo-50/30 border border-gray-200 hover:border-indigo-300 rounded-2xl p-5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200 shrink-0 bg-indigo-50 flex items-center justify-center relative">
                          <img 
                            src={architectSymbolImg} 
                            alt="Architect" 
                            className="w-full h-full object-cover relative z-10" 
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                          />
                          <Compass size={20} className="text-indigo-600 absolute" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">Architect & Design Studio</h4>
                          <span className="text-[10px] text-gray-500 font-medium">Municipal Sanctions & 3D Elevations</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                        Vertical 10
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      Access verified residential and commercial architectural blueprints, AutoCAD sanction drawings, vastu layout planning, and photorealistic 3D exterior/interior elevations.
                    </p>
                    <ul className="text-[11px] text-gray-500 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-indigo-500" /> Municipal Sanctions & Layout Approvals</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-indigo-500" /> 3D Elevations & Photorealistic Renders</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onRegister?.(UserRole.ARCHITECT)}
                      className="py-2 px-3 bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <UserPlus size={13} className="text-indigo-600" />
                      <span>Architect Register</span>
                    </button>
                    <button 
                      onClick={() => onSelect(UserRole.ARCHITECT)}
                      className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>Architect Login</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* 11. RMC (Ready-Mix Concrete) Plant Portal */}
                <div className="bg-slate-50 hover:bg-amber-50/30 border border-gray-200 hover:border-amber-300 rounded-2xl p-5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200 shrink-0 bg-amber-50 flex items-center justify-center relative">
                          <img 
                            src={rmcSymbolImg} 
                            alt="RMC Plant" 
                            className="w-full h-full object-cover relative z-10" 
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                          />
                          <Truck size={20} className="text-amber-600 absolute" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-amber-600 transition-colors">RMC (Ready Mix Concrete)</h4>
                          <span className="text-[10px] text-gray-500 font-medium">Batching Plant & Concrete Pumps</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                        Vertical 11
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      Order certified ready-mix concrete from M20 to M50 grade, dispatch transit mixer fleets, schedule boom/line concrete pumps, and get 7 & 28-day cube strength certificates.
                    </p>
                    <ul className="text-[11px] text-gray-500 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-amber-500" /> Direct Batching Plant Pumping Dispatch</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-amber-500" /> Lab-Tested Cube Strength Certificates</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onRegister?.(UserRole.RMC)}
                      className="py-2 px-3 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <UserPlus size={13} className="text-amber-600" />
                      <span>RMC Register</span>
                    </button>
                    <button 
                      onClick={() => onSelect(UserRole.RMC)}
                      className="py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>RMC Login</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* 12. Consultant (Civil, Structural & QA/QC) Portal */}
                <div className="bg-slate-50 hover:bg-blue-50/30 border border-gray-200 hover:border-blue-300 rounded-2xl p-5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200 shrink-0 bg-blue-50 flex items-center justify-center relative">
                          <img 
                            src={consultantSymbolImg} 
                            alt="Consultant" 
                            className="w-full h-full object-cover relative z-10" 
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                          />
                          <FileCheck2 size={20} className="text-blue-600 absolute" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">Civil & Structural Consultant</h4>
                          <span className="text-[10px] text-gray-500 font-medium">Stability Certificates & Geotech</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                        Vertical 12
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      Connect with licensed structural consultants for building stability certificates, geotech soil investigation reports, bar bending audits, and independent third-party QA/QC.
                    </p>
                    <ul className="text-[11px] text-gray-500 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-blue-500" /> Structural Stability Audit & Certification</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-blue-500" /> Geotech Soil Testing & Foundation Design</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onRegister?.(UserRole.CONSULTANT)}
                      className="py-2 px-3 bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <UserPlus size={13} className="text-blue-600" />
                      <span>Consultant Register</span>
                    </button>
                    <button 
                      onClick={() => onSelect(UserRole.CONSULTANT)}
                      className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>Consultant Login</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* 13. Construction Factory & Plants */}
                <div className="bg-slate-50 hover:bg-stone-50/50 border border-gray-200 hover:border-stone-400 rounded-2xl p-5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200 shrink-0 bg-stone-100 flex items-center justify-center relative">
                          <img 
                            src={factorySymbolImg} 
                            alt="Construction Factory" 
                            className="w-full h-full object-cover relative z-10" 
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                          />
                          <Factory size={20} className="text-stone-700 absolute" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-stone-800 transition-colors">Construction Factory & Plants</h4>
                          <span className="text-[10px] text-gray-500 font-medium">Precast Panels, AAC Blocks & Plants</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                        Vertical 13
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      Industrial manufacturing units, automated precast concrete panels, autoclave aerated concrete (AAC) blocks, paver tiles and heavy manufacturing plants.
                    </p>
                    <ul className="text-[11px] text-gray-500 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-stone-600" /> Direct Manufacturer Factory Consignments</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-stone-600" /> Bulk Heavy Project Invoicing & Transport</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onRegister?.(UserRole.CONSTRUCTION_FACTORY)}
                      className="py-2 px-3 bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <UserPlus size={13} className="text-stone-700" />
                      <span>Factory Register</span>
                    </button>
                    <button 
                      onClick={() => onSelect(UserRole.CONSTRUCTION_FACTORY)}
                      className="py-2 px-3 bg-stone-800 hover:bg-black text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>Factory Login</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* 14. MEP (Mechanical, Electrical & Plumbing) Staff & Labour Portal */}
                <div className="bg-slate-50 hover:bg-amber-50/40 border border-gray-200 hover:border-amber-400 rounded-2xl p-5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200 shrink-0 bg-amber-50 flex items-center justify-center relative">
                          <img 
                            src={mepSymbolImg} 
                            alt="MEP Portal" 
                            className="w-full h-full object-cover relative z-10" 
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                          />
                          <Wrench size={20} className="text-amber-800 absolute" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-amber-800 transition-colors">MEP Engineering & Staff</h4>
                          <span className="text-[10px] text-gray-500 font-medium">Mechanical, Electrical, Plumbing & Supervisors</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                        Vertical 14
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      Specialized portal for mechanical HVAC engineers, certified electricians, master plumbers, MEP site supervisors and fire fighting technicians.
                    </p>
                    <ul className="text-[11px] text-gray-500 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-amber-700" /> HVAC, HT/LT Panels & Fire Fighting</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-amber-700" /> MEP Supervisors, Foremen & Skilled Labour</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onRegister?.(UserRole.MEP)}
                      className="py-2 px-3 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <UserPlus size={13} className="text-amber-800" />
                      <span>MEP Register</span>
                    </button>
                    <button 
                      onClick={() => onSelect(UserRole.MEP)}
                      className="py-2 px-3 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>MEP Login</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Services List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
              <div className="bg-gray-900 p-4">
                 <h3 className="font-bold text-white text-lg flex items-center gap-2">
                   <Hammer size={20} className="text-orange-500" />
                   Our Services
                 </h3>
              </div>
              <div className="p-4 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                {DETAILED_SERVICES.map((section, idx) => (
                  <div key={idx} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                      {section.category}
                    </h4>
                    <ul className="space-y-1.5 pl-4">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5 hover:text-orange-600 transition-colors cursor-default">
                          <CheckCircle2 size={12} className="shrink-0 mt-0.5 text-gray-300" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 text-center border-t border-orange-200/80">
                <button 
                  onClick={() => setSelectedServiceModal('fullCatalog')}
                  className="text-xs font-black text-orange-700 hover:text-orange-800 flex items-center justify-center gap-1.5 w-full py-2 bg-white hover:bg-orange-100/60 border border-orange-200 rounded-xl shadow-2xs transition-all active:scale-98"
                >
                  <Sparkles size={14} className="text-orange-600 animate-pulse" />
                  <span>Pop-Up Complete Services Catalog</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {showRegister && <RegistrationModal />}

      {/* Dedicated Service Page Modal: Brokers Point (Real Estate) */}
      {selectedServiceModal === 'brokersPoint' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex flex-col items-center justify-start p-2 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-50 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between sticky top-0 z-20 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-sm">
                  <img src={ROLE_SYMBOLS[UserRole.BROKER].img} alt="Brokers Point" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    Brokers Point — Real Estate & Asset Mandates Service Page
                  </h2>
                  <p className="text-[11px] text-orange-100 font-medium">
                    Verified Residential & Commercial Properties, Society Redevelopment, Land JV & Brokerage Tools
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setSelectedServiceModal(null);
                    onSelect(UserRole.BROKER);
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white text-orange-800 hover:bg-orange-50 rounded-xl text-xs font-black transition-all shadow-sm"
                >
                  <UserCircle size={15} />
                  <span>Login as Broker</span>
                </button>
                <button 
                  onClick={() => setSelectedServiceModal(null)}
                  className="p-2 bg-black/20 hover:bg-black/35 rounded-xl text-white transition-all active:scale-95"
                  title="Close Service Page"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              <BrokersPoint />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <span>Direct RERA real estate mandates with guaranteed escrow payout safety.</span>
              <button 
                onClick={() => {
                  setSelectedServiceModal(null);
                  onBackToHome?.();
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-all"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Service Page Modal: PMC (Project Management Consultancy) */}
      {selectedServiceModal === 'pmc' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex flex-col items-center justify-start p-2 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-50 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between sticky top-0 z-20 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-sm">
                  <img src={ROLE_SYMBOLS[UserRole.PMC].img} alt="PMC" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    PMC (Project Management Consultancy) & Quality Audit Service Page
                  </h2>
                  <p className="text-[11px] text-orange-100 font-medium">
                    Resident Civil Supervision, Concrete QA/QC, RA Bill Verification & Site Snagging Registers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setSelectedServiceModal(null);
                    onSelect(UserRole.PMC);
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white text-orange-800 hover:bg-orange-50 rounded-xl text-xs font-black transition-all shadow-sm"
                >
                  <UserCircle size={15} />
                  <span>Login as PMC</span>
                </button>
                <button 
                  onClick={() => setSelectedServiceModal(null)}
                  className="p-2 bg-black/20 hover:bg-black/35 rounded-xl text-white transition-all active:scale-95"
                  title="Close Service Page"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              <PMCProfile />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <span>Professional quality control & technical civil engineering auditing for high-rise buildings.</span>
              <button 
                onClick={() => {
                  setSelectedServiceModal(null);
                  onBackToHome?.();
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-all"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Service Page Modal: Full Services Catalog */}
      {selectedServiceModal === 'fullCatalog' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex flex-col items-center justify-start p-2 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-50 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white flex items-center justify-between sticky top-0 z-20 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xs">
                  <Sparkles size={22} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    Our Services Directory & Multi-Platform Catalog
                  </h2>
                  <p className="text-[11px] text-orange-100 font-medium">
                    85+ Verified Construction, MEP, Structural, Precast, Interior & Real Estate Services
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedServiceModal(null)}
                className="p-2 bg-black/20 hover:bg-black/35 rounded-xl text-white transition-all active:scale-95"
                title="Close Catalog"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 bg-white border-b border-gray-200 space-y-3 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search any service (e.g. AutoCAD, RMC Concrete, Soil Test, Precast, MEP, Plumber, TMT Steel...)"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
                {['All', ...DETAILED_SERVICES.map(s => s.category)].map((cat) => {
                  const isSelected = catalogCategory === cat || (cat === 'All' && !catalogCategory);
                  return (
                    <button
                      key={cat}
                      onClick={() => setCatalogCategory(cat === 'All' ? '' : cat)}
                      className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all text-xs ${
                        isSelected 
                          ? 'bg-orange-600 text-white shadow-xs' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat.replace(' Services', '')}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DETAILED_SERVICES
                  .filter(section => {
                    if (catalogCategory && catalogCategory !== 'All') {
                      if (section.category !== catalogCategory) return false;
                    }
                    if (catalogSearch.trim()) {
                      const query = catalogSearch.toLowerCase();
                      const matchesCategory = section.category.toLowerCase().includes(query);
                      const matchesItem = section.items.some(i => i.toLowerCase().includes(query));
                      return matchesCategory || matchesItem;
                    }
                    return true;
                  })
                  .map((section, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                          <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0"></span>
                            {section.category}
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                            {section.items.length} Services
                          </span>
                        </div>
                        <ul className="space-y-1.5">
                          {section.items.map((item, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                              <CheckCircle2 size={13} className="text-orange-500 shrink-0 mt-0.5" />
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-gray-400">Construction Mart Verified</span>
                        <button
                          onClick={() => {
                            setSelectedServiceModal(null);
                            onRegister ? onRegister(UserRole.CLIENT) : onSelect(UserRole.CLIENT);
                          }}
                          className="px-3 py-1.5 bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white rounded-xl text-xs font-bold transition-all border border-orange-200"
                        >
                          Book / Inquire →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="px-6 py-3.5 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <span>All 85+ multi-platform services backed by certified quality verification & escrow protection.</span>
              <button 
                onClick={() => setSelectedServiceModal(null)}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all"
              >
                Close Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const auth = useAuth();
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() =>
    auth.user && auth.user.role !== 'SUPERADMIN' ? (auth.user.role as UserRole) : null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'requests' | 'myPosting' | 'messages' | 'vendorProfile' | 'vendorRates' | 'quotation' | 'marketRates'>('dashboard');
  const [showLogin, setShowLogin] = useState(false);
  const [loginInitialMode, setLoginInitialMode] = useState<'login' | 'register'>('login');
  const [loginInitialRole, setLoginInitialRole] = useState<UserRole | undefined>(undefined);
  const [showSplash, setShowSplash] = useState(true);
  const [splashSecondsLeft, setSplashSecondsLeft] = useState(5);
  const prevUserIdRef = React.useRef<string | null>(auth.user?.id || null);

  const triggerSplash = () => {
    setSplashSecondsLeft(5);
    setShowSplash(true);
  };

  useEffect(() => {
    if (!showSplash) return;
    const interval = setInterval(() => {
      setSplashSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowSplash(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showSplash]);

  const openLogin = (mode: 'login' | 'register' = 'login', role?: UserRole) => {
    setLoginInitialMode(mode);
    setLoginInitialRole(role);
    setShowLogin(true);
  };
  const handleLogout = () => {
    setShowLogin(false);
    setSidebarOpen(false);
    setDirectoryOpen(false);
    setActiveTab('dashboard');
    setCurrentRole(null);
    auth.logout();
    triggerSplash();
  };
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('const_mart_local_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) return parsed as ChatMessage[];
      }
    } catch {}
    return INITIAL_MESSAGES;
  });

  // Load chat history from database (Supabase submissions via bookings fallback) and keep in sync
  useEffect(() => {
    const loadRemoteChat = async () => {
      try {
        const submissions = await fetchAllSubmissions();
        const remoteChats = submissions
          .filter((s: any) => s.type === 'chat_message' && s.data)
          .map((s: any) => s.data as ChatMessage);
        if (remoteChats.length) {
          setMessages((prev) => {
            const byId = new Map<string, ChatMessage>();
            [...prev, ...remoteChats].forEach((m) => byId.set(m.id, m));
            const merged = Array.from(byId.values()).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            try { localStorage.setItem('const_mart_local_chat_messages', JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
      } catch {}
    };
    loadRemoteChat();
    // Poll for new messages every 4s so chat syncs across devices without manual refresh
    const interval = setInterval(loadRemoteChat, 4000);
    return () => clearInterval(interval);
  }, []);

  // Persist messages to localStorage on every change (so refresh never loses pending messages)
  useEffect(() => {
    try { localStorage.setItem('const_mart_local_chat_messages', JSON.stringify(messages)); } catch {}
  }, [messages]);

  // Unread chat count — only messages not sent by current user and newer than last time chat was opened
  const [chatLastReadAt, setChatLastReadAt] = useState<string>(() => {
    try { return localStorage.getItem('cm_chat_last_read') || ''; } catch { return ''; }
  });
  useEffect(() => {
    if (activeTab === 'messages') {
      const now = new Date().toISOString();
      try { localStorage.setItem('cm_chat_last_read', now); } catch {}
      setChatLastReadAt(now);
    }
  }, [activeTab]);
  const unreadCount = React.useMemo(() => {
    if (!messages.length) return 0;
    const last = chatLastReadAt ? new Date(chatLastReadAt).getTime() : 0;
    const currentUserId = (auth as any)?.user?.id;
    return messages.filter((m) => {
      const isMe =
        m.senderId === currentUserId ||
        m.senderId === 'user' ||
        m.senderRole?.toUpperCase() === String(currentRole || '').toUpperCase() ||
        (String(currentRole) === UserRole.CLIENT && m.senderRole === 'Client');
      if (isMe) return false;
      const isForMe =
        m.recipientId === currentUserId ||
        m.conversationId === currentUserId ||
        (!m.recipientId && !m.conversationId && (m.senderRole === 'Admin' || m.senderRole === 'System'));
      if (!isForMe) return false;
      if (!chatLastReadAt) return true;
      return new Date(m.timestamp).getTime() > last;
    }).length;
  }, [messages, chatLastReadAt, (auth as any)?.user?.id, currentRole]);

  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS_DATA);
  const [activityRates, setActivityRates] = useState<ActivityRate[]>(INITIAL_ACTIVITY_RATES);
  const [materialRates, setMaterialRates] = useState<MaterialRate[]>(INITIAL_MATERIAL_RATES);
  const [isRateExplorerOpen, setIsRateExplorerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [servicesHeight, setServicesHeight] = useState<number>(100);

  // Shared state for Material Supplier bookings
  const [supplierBookings, setSupplierBookings] = useState<any[]>(() => {
    const saved = localStorage.getItem('construction_mart_supplier_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      { id: 'b-init-1', name: 'Ramesh Pujari', workType: 'Cement Loading & Stacking', helpersCount: 2, reportingTime: 'Started 2 hours ago', cost: 1100, status: 'Active' }
    ];
  });

  // Sync state to local storage and Supabase on change
  useEffect(() => {
    localStorage.setItem('construction_mart_supplier_bookings', JSON.stringify(supplierBookings));
    
    // Save/upsert each booking to Supabase
    const syncToSupabase = async () => {
      for (const booking of supplierBookings) {
        await saveBooking(booking.id, 'supplier', booking.status, booking);
      }
    };
    syncToSupabase();
  }, [supplierBookings]);

  // Load bookings from Supabase on component mount
  useEffect(() => {
    const loadSupabaseSupplierBookings = async () => {
      const records = await fetchAllBookings();
      const supplierRecords = records
        .filter(r => r.booking_type === 'supplier')
        .map(r => r.details);
      
      if (supplierRecords.length > 0) {
        setSupplierBookings(supplierRecords);
        localStorage.setItem('construction_mart_supplier_bookings', JSON.stringify(supplierRecords));
      }
    };
    loadSupabaseSupplierBookings();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('construction_mart_supplier_bookings');
    if (saved) {
      try {
        setSupplierBookings(JSON.parse(saved));
      } catch (e) {}
    }
  }, [currentRole]);

  const handleConfirmSupplierBooking = (bookingId: string) => {
    setSupplierBookings(prev => {
      const updated = prev.map(b => b.id === bookingId ? { ...b, status: 'Confirmed' } : b);
      localStorage.setItem('construction_mart_supplier_bookings', JSON.stringify(updated));
      return updated;
    });
    alert('⚡ Instant booking confirmed! WhatsApp notification alert sent back to material supplier.');
  };

  // Dynamic Active Instant Labour Requests from database (Work Project posts)
  const [labourRequests, setLabourRequests] = useState<WorkRequest[]>([]);
  useEffect(() => {
    const loadLabourRequests = async () => {
      let items: WorkRequest[] = [];
      try {
        items = listLocalWorkRequests();
      } catch (e) {
        items = [];
      }
      try {
        const remote = await fetchAllSubmissions();
        const remoteReqs: WorkRequest[] = remote
          .filter((s: any) => s.type === 'work_request' && s.data)
          .map((s: any) => ({ ...s.data, created_at: s.data.created_at || s.created_at }));
        const byId = new Map<string, WorkRequest>();
        [...items, ...remoteReqs].forEach((r: any) => {
          const existing = byId.get(r.id);
          if (!existing || new Date((r as any).updated_at || r.created_at) > new Date((existing as any).updated_at || existing.created_at)) {
            byId.set(r.id, r);
          }
        });
        items = Array.from(byId.values());
      } catch (e) {
        // offline — local copy is enough
      }
      items = items.filter((r) => r.kind === 'project' && r.status === 'Open')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setLabourRequests(items);
    };
    loadLabourRequests();
    const onStorage = () => loadLabourRequests();
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onStorage);
    const interval = setInterval(loadLabourRequests, 3000);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onStorage);
      clearInterval(interval);
    };
  }, []);
  
  // Apply to labour request (role + start date)
  const [applyReq, setApplyReq] = useState<WorkRequest | null>(null);
  const [applyProfession, setApplyProfession] = useState('');
  const [applyStartDate, setApplyStartDate] = useState('');

  // New Project / Requirement State
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showPostReqDropdown, setShowPostReqDropdown] = useState(false);
  const [newProjectCategory, setNewProjectCategory] = useState<RequirementCategory>('Vendor');

  // Support & About Modals
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showServicesPopupModal, setShowServicesPopupModal] = useState(false);
  const [servicesSearchQuery, setServicesSearchQuery] = useState('');
  const [selectedServiceCategoryTab, setSelectedServiceCategoryTab] = useState<string>('All');
  const servicesCarouselRef = useRef<HTMLDivElement>(null);

  // Client Requires (Vendor page) state
  const [showClientRequiresModal, setShowClientRequiresModal] = useState(false);
  const [selectedRequesterType, setSelectedRequesterType] = useState<'Client' | 'Contractor'>('Client');
  const [selectedReqCategory, setSelectedReqCategory] = useState<'Labours' | 'Materials' | 'Staff'>('Labours');
  const [showClientRequiresDropdown, setShowClientRequiresDropdown] = useState(false);
  const [showContractorRequiresDropdown, setShowContractorRequiresDropdown] = useState(false);
  const [clientReqs, setClientReqs] = useState<ClientRequirement[]>(INITIAL_CLIENT_REQUIREMENTS);
  const [biddingReqId, setBiddingReqId] = useState<string | null>(null);
  const [bidPrice, setBidPrice] = useState('');
  const [bidMessage, setBidMessage] = useState('');

  // Payment State
  const [selectedProjectForPayment, setSelectedProjectForPayment] = useState<Project | null>(null);

  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter requirements based on selectedRequesterType and selectedReqCategory
  const filteredReqs = clientReqs.filter(req => {
    const reqType = req.requesterType || 'Client';
    const reqCat = req.reqCategory || (req.title.toLowerCase().includes('cement') || req.title.toLowerCase().includes('brick') || req.title.toLowerCase().includes('steel') || req.title.toLowerCase().includes('concrete') ? 'Materials' : (req.title.toLowerCase().includes('engineer') || req.title.toLowerCase().includes('safety') || req.title.toLowerCase().includes('surveyor') || req.title.toLowerCase().includes('staff') ? 'Staff' : 'Labours'));
    return reqType === selectedRequesterType && reqCat === selectedReqCategory;
  });

  // Derive the active dashboard role from the logged-in user and trigger 5s splash on login/signup/logout
  useEffect(() => {
    if (!auth.ready) return;
    const currentId = auth.user?.id || null;
    if (prevUserIdRef.current !== currentId) {
      prevUserIdRef.current = currentId;
      triggerSplash();
    }
    if (auth.user && auth.user.role !== 'SUPERADMIN') {
      setCurrentRole(auth.user.role as UserRole);
      setShowLogin(false);
    } else if (!auth.user) {
      setCurrentRole(null);
      setShowLogin(false);
    }
  }, [auth.user, auth.ready]);

  // Navigation Logic
  const goBack = () => {
    if (activeTab !== 'dashboard') {
      setActiveTab('dashboard');
    } else {
      handleLogout();
    }
  };
  
  const goForward = () => {
    // No op for demo
  };

  const handlePaymentSuccess = (projectId: string) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, paymentStatus: PaymentStatus.PAID, status: 'In Progress' } : p
    ));
    setSelectedProjectForPayment(null);
  };

  const handleAssignVendor = (projectId: string, vendor: Vendor) => {
    // 1. Update Project
    const updatedProject = projects.find(p => p.id === projectId);
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, vendorName: vendor.name, status: 'In Progress' } : p
    ));

    // 2. Send Message to Client
    const currentUserIdForMsg = (auth as any)?.user?.id || 'user';
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'admin',
      senderName: 'Admin Panel',
      senderRole: 'Admin',
      text: `Good news! We have assigned '${vendor.name}' to your project '${updatedProject?.title}'. They will contact you shortly.`,
      timestamp: new Date().toISOString(),
      projectId: projectId,
      recipientId: currentUserIdForMsg,
      conversationId: currentUserIdForMsg,
    };
    setMessages(prev => [...prev, newMessage]);
    saveSubmission('chat_message', newMessage).catch(() => {});
  };

  const handleSendMessage = (text: string, peer?: { id: string; name: string; role: string }) => {
    const currentUserId = (auth as any)?.user?.id || 'user';
    const senderName = (auth as any)?.user?.name || (currentRole === UserRole.CLIENT ? 'You' : currentRole!);
    // Use actual role string so isMe / filtering works for all roles (PMC, LABOUR, BROKER, etc.)
    const senderRole = currentRole ? String(currentRole) : 'Client';
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: senderName,
      senderRole: senderRole,
      text: text,
      timestamp: new Date().toISOString(),
      recipientId: peer?.id,
      recipientName: peer?.name,
      recipientRole: peer?.role,
      conversationId: peer?.id,
    };
    setMessages(prev => [...prev, newMsg]);
    saveSubmission('chat_message', newMsg).catch(() => {});
  };

  // 10-second intro splash screen before showing the home screen
  if (showSplash) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 select-none relative overflow-hidden">
        <div className="flex flex-col items-center text-center max-w-xl w-full animate-in fade-in zoom-in-95 duration-500">
          <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center mb-6">
            <img
              src={LOGO_IMAGE_PATH}
              alt="Construction Mart SHK Emblem"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-[42px] font-extrabold tracking-tight leading-none mt-2">
            <span className="text-[#333333]">constructionmart</span>
            <span className="text-[#D97236]">shk</span>
            <span className="text-[#333333]">.com</span>
          </h1>

          <p className="mt-5 text-[#3A3A3A] text-base sm:text-xl md:text-[22px] font-normal leading-snug max-w-md">
            The most trusted marketplace for construction and interior renovation needs.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 w-48">
            <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D97236] transition-all duration-1000 ease-linear"
                style={{ width: `${((5 - splashSecondsLeft) / 5) * 100}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowSplash(false)}
              className="text-xs font-medium text-neutral-400 hover:text-neutral-700 transition-colors tabular-nums"
            >
              Entering in {splashSecondsLeft}s · Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Auth gate: loading, then super admin console or the marketplace home.
  // Guests land on the RoleSelection home page first (sliders + role cards), not the login form.
  if (!auth.ready) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-orange-600" size={32} />
          <span className="text-sm font-semibold text-gray-400">Loading Construction Mart SHK...</span>
        </div>
      </div>
    );
  }
  if (auth.user?.role === 'SUPERADMIN') {
    return <SuperAdminPanel onLogout={handleLogout} />;
  }

  // Reusable overlays (rate explorer drawer + login modal) shown for guests and logged-in users alike.
  const rateExplorerDrawer = isRateExplorerOpen && (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
          onClick={() => setIsRateExplorerOpen(false)}
        />
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-3xl transform transition-transform duration-300 ease-in-out">
            <div className="flex h-full flex-col bg-white shadow-2xl overflow-hidden rounded-l-3xl border-l border-gray-100 animate-in slide-in-from-right duration-300">
              <div className="px-6 py-5 bg-gradient-to-r from-orange-600 to-orange-500 text-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <TrendingUp size={24} className="text-white animate-pulse" />
                  <div>
                    <h2 className="text-lg font-black tracking-tight" id="slide-over-title">Construction Market Rate Explorer</h2>
                    <p className="text-[10px] text-orange-100 font-bold uppercase tracking-wider">Live Regional Pricing Directory</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRateExplorerOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50 custom-scrollbar">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
                  <RateExplorer activityRates={activityRates} materialRates={materialRates} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const loginModal = showLogin && (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 py-10">
        <AuthScreen
          onClose={() => {
            setShowLogin(false);
            triggerSplash();
          }}
          initialMode={loginInitialMode}
          initialRole={loginInitialRole}
        />
      </div>
    </div>
  );

  // Guests: show the home landing page with sliders and role selection.
  if (!auth.user) {
    return (
      <>
        <RoleSelection
          onSelect={(role) => openLogin('login', role)}
          activityRates={activityRates}
          materialRates={materialRates}
          onOpenRateExplorer={() => setIsRateExplorerOpen(true)}
          onRegister={(role) => openLogin('register', role)}
          onBackToHome={triggerSplash}
        />
        {rateExplorerDrawer}
        {loginModal}
      </>
    );
  }

  return (
    <>
        <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100 w-full">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg lg:hidden shrink-0"
            >
              <Menu size={22} />
            </button>
            
            {/* Nav Controls */}
            <div className="hidden lg:flex items-center gap-1 text-gray-400 shrink-0">
               <button onClick={goBack} className="p-1 hover:text-gray-700 hover:bg-gray-100 rounded"><ChevronLeft size={20}/></button>
               <button onClick={goForward} className="p-1 hover:text-gray-700 hover:bg-gray-100 rounded"><ChevronRight size={20}/></button>
            </div>

            <div className="flex items-center min-w-0 cursor-pointer" onClick={() => (auth.user ? handleLogout() : openLogin('login'))} title={auth.user ? "Logout" : "Login / Sign Up"}>
              <Logo size="sm" />
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* + Post Vacancy Button on All Pages */}
            <button
              onClick={() => {
                setShowNewProjectModal(true);
              }}
              className="flex items-center gap-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-3 sm:px-4 py-1.5 rounded-full transition-all text-xs font-black shadow-sm shadow-orange-200 active:scale-95 whitespace-nowrap"
              title="Post Vacancy"
            >
              + Post Vacancy
            </button>

            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm shrink-0">
               <img src={`https://picsum.photos/seed/${currentRole || 'guest'}/100/100`} alt="Avatar" className="w-full h-full object-cover" />
            </div>

            {/* Login / Sign Up (guest) or Logout */}
            {auth.user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors border border-gray-200 shrink-0 whitespace-nowrap"
                title="Logout"
              >
                <LogOut size={16} />
                <span className="text-xs font-bold">Logout</span>
              </button>
            ) : (
              <button
                onClick={() => openLogin('login')}
                className="flex items-center gap-1.5 text-orange-700 hover:text-white hover:bg-orange-600 bg-orange-50 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors border border-orange-200 shrink-0 whitespace-nowrap"
                title="Login / Sign Up"
              >
                <LogIn size={16} />
                <span className="text-xs font-bold">Login / Sign Up</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3 border-t border-gray-50">
           <div className="relative mt-3">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input 
               type="text" 
               placeholder="Search projects..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-all text-sm"
             />
           </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar - Desktop & Mobile Drawer */}
        <aside className={`
          fixed lg:static top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            <div className="p-6 lg:hidden flex justify-end">
              <button onClick={() => setSidebarOpen(false)}><X size={24} /></button>
            </div>
            
            <nav className="flex-1 p-4 space-y-1">
              {/* + Post Vacancy in Sidebar */}
              <button 
                onClick={() => {
                  setShowNewProjectModal(true);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-xl transition-all shadow-sm shadow-orange-200 mb-2"
              >
                + Post Vacancy
              </button>

              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <LayoutDashboard size={20} />
                Dashboard
              </button>

              <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Marketplace
              </div>
              <button 
                onClick={() => setActiveTab('requests')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'requests' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Search size={20} />
                Find
              </button>
              <button 
                onClick={() => setActiveTab('myPosting')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'myPosting' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FileText size={20} />
                My Posting
              </button>

              <button 
                onClick={() => setActiveTab('messages')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'messages' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <MessageSquare size={20} />
                Chat Window
                {unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {currentRole === UserRole.VENDOR && (
                <>
                  <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Vendor Workspace
                  </div>
                  <button 
                    onClick={() => setActiveTab('quotation')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'quotation' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Calculator size={20} />
                    Estimations
                  </button>
                </>
              )}
              
              <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Settings & Support
              </div>

              <button 
                onClick={() => setIsRateExplorerOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-orange-600 transition-colors"
                id="sidebar-rate-explorer-btn"
              >
                <TrendingUp size={20} className="text-orange-600" />
                Construction Market Rate Explorer
              </button>
              
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <User size={20} />
                Profile
              </button>
              
              <button 
                onClick={() => setShowSupportModal(true)} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <HelpCircle size={20} />
                Customer Support
              </button>
              <button 
                onClick={() => setShowAboutModal(true)} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <Info size={20} />
                About Us
              </button>
            </nav>

            <div className="p-4 border-t border-gray-100">
               <button 
                onClick={handleLogout}
                className="w-full py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
               >
                 Sign Out
               </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'requests' && <RequestsView mode="all" onPostVacancy={() => setShowNewProjectModal(true)} />}
          {activeTab === 'myPosting' && <MyPosting />}

          {activeTab === 'messages' && (
             <ChatWindow 
               currentUserRole={currentRole} 
               messages={messages} 
               onSendMessage={handleSendMessage} 
             />
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              {currentRole === UserRole.CLIENT && <ClientProfile />}
              {currentRole === UserRole.VENDOR && <VendorProfile />}
              {currentRole === UserRole.PMC && <PMCProfile />}
              {currentRole === UserRole.LABOUR && <LabourProfile />}
              {currentRole === UserRole.MATERIAL_SUPPLIER && <SupplierProfile />}
              {currentRole === UserRole.JOB && <JobProfile />}
              {currentRole === UserRole.FREELANCER && <FreelancerProfile />}
              {currentRole === UserRole.BROKER && <BrokerProfile />}
              {currentRole === UserRole.CHANNEL_PARTNER && <BrokerProfile />}
              {currentRole === UserRole.ARCHITECT && <FreelancerProfile />}
              {currentRole === UserRole.RMC && <SupplierProfile />}
              {currentRole === UserRole.CONSULTANT && <PMCProfile />}
              {currentRole === UserRole.CONSTRUCTION_FACTORY && <SupplierProfile />}
              {currentRole === UserRole.MEP && <JobProfile />}
            </div>
          )}

          {activeTab === 'vendorProfile' && currentRole === UserRole.VENDOR && (
            <div className="space-y-6">
              <VendorProfileForm 
                vendor={vendors[0]} 
                onUpdate={(updated) => setVendors(prev => prev.map(v => v.id === updated.id ? updated : v))} 
              />
              <AIAssistant mode="vendor" />
            </div>
          )}

          {activeTab === 'quotation' && currentRole === UserRole.VENDOR && (
            <QuotationGenerator 
              vendor={vendors[0]}
              projects={projects}
              activityRates={activityRates}
              materialRates={materialRates}
            />
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Carousel Showcase */}
              <ServiceCarousel items={currentRole === UserRole.JOB ? JOB_VACANCIES_SLIDES : !currentRole ? LANDING_ADS : undefined} />

              {/* Welcome Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {currentRole ? (
                      <>Welcome back, {
                        auth.user?.name
                          ? auth.user.name.replace(/\s*\([^)]*\)\s*$/, '')
                          : currentRole === UserRole.CLIENT ? 'Developer' : 
                            currentRole === UserRole.VENDOR ? 'Vendor / Partner' : 
                            currentRole === UserRole.PMC ? 'PMC / Site Quality Consultant' :
                            currentRole === UserRole.LABOUR ? 'Skilled Worker' : 
                            currentRole === UserRole.MATERIAL_SUPPLIER ? 'Material Supplier' :
                            currentRole === UserRole.JOB ? 'Construction & Engineering Staff' :
                            currentRole === UserRole.FREELANCER ? 'Freelance Consultant' : 
                            currentRole === UserRole.BROKER ? 'Real Estate Broker' : 
                            currentRole === UserRole.CHANNEL_PARTNER ? 'Channel Partner' : 
                            currentRole === UserRole.ARCHITECT ? 'Architect' :
                            currentRole === UserRole.RMC ? 'RMC Concrete Partner' :
                            currentRole === UserRole.CONSULTANT ? 'Structural & Civil Consultant' :
                            currentRole === UserRole.CONSTRUCTION_FACTORY ? 'Construction Factory' :
                            currentRole === UserRole.MEP ? 'MEP Staff & Supervisor' : 'User'
                      }</>
                    ) : (
                      <>Welcome to Construction Mart SHK</>
                    )}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {currentRole ? "Here is what's happening with your projects today." : "India's leading construction & interior marketplace. Browse projects, hire labour, compare market rates and more — sign in to unlock your dashboard."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 relative">
                  {/* Style block for animations */}
                  <style>{`
                    @keyframes custom-buzz {
                      0%, 100% { transform: rotate(0deg) scale(1); }
                      12%, 36%, 60%, 84% { transform: rotate(-3deg) scale(1.03); }
                      24%, 48%, 72%, 96% { transform: rotate(3deg) scale(1.03); }
                    }
                    .animate-custom-buzz {
                      animation: custom-buzz 1.5s ease-in-out infinite;
                    }
                  `}</style>

                  {/* Buzzing Client Requires Button */}
                  {(currentRole === UserRole.VENDOR || 
                    currentRole === UserRole.LABOUR || 
                    currentRole === UserRole.MATERIAL_SUPPLIER || 
                    currentRole === UserRole.JOB ||
                    currentRole === UserRole.FREELANCER) && (
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setShowClientRequiresDropdown(!showClientRequiresDropdown);
                          setShowContractorRequiresDropdown(false);
                        }}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 via-orange-500 to-rose-600 text-white px-5 py-2.5 rounded-lg hover:from-rose-600 hover:to-orange-600 transition-all font-black shadow-md shadow-rose-200 animate-custom-buzz relative"
                      >
                        <Bell className="animate-bounce" size={18} />
                        Developer Requires
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 text-[10px] font-black text-white items-center justify-center border border-white">
                            {clientReqs.filter(r => (r.requesterType || 'Client') === 'Client' && r.status === 'Open').length}
                          </span>
                        </span>
                      </button>

                      {showClientRequiresDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-150 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
                          <div className="p-2 bg-rose-50 border-b border-rose-100 text-[10px] font-black text-rose-800 uppercase tracking-wider text-center">
                            Select Option
                          </div>
                          <button
                            onClick={() => {
                              setSelectedRequesterType('Client');
                              setSelectedReqCategory('Labours');
                              setShowClientRequiresModal(true);
                              setShowClientRequiresDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-black text-gray-800 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2 transition-colors"
                          >
                            👷 1) Labours Needed
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequesterType('Client');
                              setSelectedReqCategory('Materials');
                              setShowClientRequiresModal(true);
                              setShowClientRequiresDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-black text-gray-800 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2 transition-colors border-t border-gray-100"
                          >
                            📦 2) Materials Needed
                          </button>
                          {currentRole === UserRole.JOB && (
                            <button
                              onClick={() => {
                                setSelectedRequesterType('Client');
                                setSelectedReqCategory('Staff');
                                setShowClientRequiresModal(true);
                                setShowClientRequiresDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs font-black text-gray-800 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2 transition-colors border-t border-gray-100"
                            >
                              📐 3) Staff Needed
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Buzzing Contractor Requires Button */}
                  {(currentRole === UserRole.LABOUR || 
                    currentRole === UserRole.MATERIAL_SUPPLIER || 
                    currentRole === UserRole.JOB) && (
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setShowContractorRequiresDropdown(!showContractorRequiresDropdown);
                          setShowClientRequiresDropdown(false);
                        }}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 text-white px-5 py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all font-black shadow-md shadow-blue-200 animate-custom-buzz relative"
                      >
                        <Bell className="animate-bounce" size={18} />
                        Contractor Requires
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-600 text-[10px] font-black text-white items-center justify-center border border-white">
                            {clientReqs.filter(r => r.requesterType === 'Contractor' && r.status === 'Open').length}
                          </span>
                        </span>
                      </button>

                      {showContractorRequiresDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-150 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
                          <div className="p-2 bg-blue-50 border-b border-blue-100 text-[10px] font-black text-blue-800 uppercase tracking-wider text-center">
                            Select Option
                          </div>
                          <button
                            onClick={() => {
                              setSelectedRequesterType('Contractor');
                              setSelectedReqCategory('Labours');
                              setShowClientRequiresModal(true);
                              setShowContractorRequiresDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-black text-gray-800 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors"
                          >
                            👷 1) Labours Needed
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequesterType('Contractor');
                              setSelectedReqCategory('Materials');
                              setShowClientRequiresModal(true);
                              setShowContractorRequiresDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-black text-gray-800 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors border-t border-gray-100"
                          >
                            📦 2) Materials Needed
                          </button>
                          {currentRole === UserRole.JOB && (
                            <button
                              onClick={() => {
                                setSelectedRequesterType('Contractor');
                                setSelectedReqCategory('Staff');
                                setShowClientRequiresModal(true);
                                setShowContractorRequiresDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs font-black text-gray-800 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors border-t border-gray-100"
                            >
                              📐 3) Staff Needed
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Post New Request Button for all main requirements */}
                  {Boolean(currentRole) && (
                    <>
                      <button 
                        onClick={() => {
                          setShowPostReqDropdown(!showPostReqDropdown);
                          setShowClientRequiresDropdown(false);
                          setShowContractorRequiresDropdown(false);
                        }}
                        className="flex items-center justify-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-sm shadow-orange-200"
                      >
                        + Post Vacancy
                        <ChevronDown size={16} className={`transition-transform duration-200 ${showPostReqDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {showPostReqDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
                          <div className="px-3.5 py-2.5 bg-orange-50 border-b border-orange-100 flex items-center justify-between">
                            <span className="text-[10px] font-black text-orange-800 uppercase tracking-wider">
                              Select Requirement Category
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowPostReqDropdown(false)}
                              className="text-orange-600 hover:text-orange-800"
                            >
                              <X size={13} />
                            </button>
                          </div>
                          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                            {MAIN_REQUIREMENT_CATEGORIES.map((cat) => (
                              <button
                                key={cat.key}
                                type="button"
                                onClick={() => {
                                  setNewProjectCategory(cat.key);
                                  setShowPostReqDropdown(false);
                                  setShowNewProjectModal(true);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-orange-50 transition-colors flex items-start justify-between gap-2 group"
                              >
                                <div className="min-w-0">
                                  <p className="text-xs font-black text-gray-800 group-hover:text-orange-700">
                                    {cat.label} Requirement
                                  </p>
                                  <p className="text-[10px] text-gray-500 truncate mt-0.5">
                                    {cat.desc}
                                  </p>
                                </div>
                                <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full border uppercase ${cat.badgeCls}`}>
                                  Post
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* DASHBOARD ROLE PORTALS: ALL LOGINS & REGISTRATIONS IN EXACT SEQUENCE */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-orange-200/90 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-orange-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider shadow-xs">
                        Ecosystem Portals Directory
                      </span>
                      <span className="text-[11px] font-extrabold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                        All 14 Partner Roles · Login & Registration
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1.5 flex items-center gap-2">
                      <Building2 className="text-orange-600" size={24} />
                      Logins & Registrations
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Access specialized logins and registrations in sequence: Developer, Vendor, PMC, Labour, Material Supplier, Construction & Engineering Staff, Freelancer, Broker, Channel Partner, followed by Architect, RMC, Consultant, Construction Factory & MEP.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openLogin('login')}
                      className="px-3.5 py-2 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 text-gray-800 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <LogIn size={14} className="text-orange-600" />
                      <span>Switch Login</span>
                    </button>
                    <button
                      onClick={() => openLogin('register')}
                      className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-xl transition-all shadow-sm shadow-orange-200 flex items-center gap-1.5"
                    >
                      <UserPlus size={14} />
                      <span>+ Register Role</span>
                    </button>
                  </div>
                </div>

                {/* 1. Previous Logins & Registrations: Developer through Channel Partner */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                      1. Core Platform Roles (Up to Channel Partner)
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">Previous Portals Maintained</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5">
                    {[
                      { role: UserRole.CLIENT, label: 'Developer', desc: 'Civil tenders, contracting & escrow', img: developerSymbolImg, icon: Building2, color: 'text-orange-600', ring: 'ring-orange-200', tag: 'Developer' },
                      { role: UserRole.VENDOR, label: 'Vendor', desc: 'Turnkey civil contracting & bids', img: vendorSymbolImg, icon: Briefcase, color: 'text-teal-600', ring: 'ring-teal-200', tag: 'Contractor' },
                      { role: UserRole.PMC, label: 'PMC', desc: 'Site QA/QC audits & measurement verification', img: pmcSymbolImg, icon: ShieldCheck, color: 'text-cyan-600', ring: 'ring-cyan-200', tag: 'Supervision' },
                      { role: UserRole.LABOUR, label: 'Labour', desc: 'Skilled masons, bar benders & helpers', img: labourSymbolImg, icon: HardHat, color: 'text-yellow-600', ring: 'ring-yellow-200', tag: 'Daily Wage' },
                      { role: UserRole.MATERIAL_SUPPLIER, label: 'Material Supplier', desc: 'Bulk cement, steel, sand & raw gear', img: supplierSymbolImg, icon: Package, color: 'text-emerald-600', ring: 'ring-emerald-200', tag: 'Supplier' },
                      { role: UserRole.JOB, label: 'Construction and Engineering Staff', desc: 'Civil site engineers, surveyors & technical staff careers', img: jobSymbolImg, icon: GraduationCap, color: 'text-purple-600', ring: 'ring-purple-200', tag: 'Staff' },
                      { role: UserRole.FREELANCER, label: 'Freelancer', desc: 'AutoCAD drafts, BBS steel & estimation', img: freelancerSymbolImg, icon: Sparkles, color: 'text-pink-600', ring: 'ring-pink-200', tag: 'CAD / BBS' },
                      { role: UserRole.BROKER, label: 'Broker', desc: 'RERA outright properties & mandates', img: brokerSymbolImg, icon: Home, color: 'text-violet-600', ring: 'ring-violet-200', tag: 'Real Estate' },
                      { role: UserRole.CHANNEL_PARTNER, label: 'Channel Partner', desc: 'Client referrals & verified commission payouts', img: brokerSymbolImg, icon: Share2, color: 'text-sky-600', ring: 'ring-sky-200', tag: 'Partner' },
                    ].map((item) => {
                      const IconComp = item.icon;
                      return (
                        <div key={item.role} className="bg-gray-50/70 hover:bg-white border border-gray-200 hover:border-orange-300 rounded-2xl p-4 transition-all flex flex-col justify-between shadow-xs hover:shadow-md group">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className={`w-11 h-11 rounded-xl overflow-hidden shrink-0 ring-1 ${item.ring} bg-white flex items-center justify-center relative shadow-xs`}>
                                <img 
                                  src={item.img} 
                                  alt={item.label} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform relative z-10" 
                                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                                />
                                <IconComp size={20} className={`${item.color} absolute`} />
                              </div>
                              <span className="text-[9px] font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                                {item.tag}
                              </span>
                            </div>
                            <h4 className="text-sm font-extrabold text-gray-900 group-hover:text-orange-600 transition-colors">
                              {item.label}
                            </h4>
                            <p className="text-[11px] text-gray-500 leading-snug mt-1 line-clamp-2">
                              {item.desc}
                            </p>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-150 space-y-1.5">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openLogin('login', item.role)}
                                className="flex-1 py-1.5 px-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                              >
                                <LogIn size={12} />
                                <span>Login</span>
                              </button>
                              <button
                                onClick={() => openLogin('register', item.role)}
                                className="flex-1 py-1.5 px-2 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 text-gray-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                              >
                                <UserPlus size={12} className="text-orange-600" />
                                <span>Register</span>
                              </button>
                            </div>
                            <button
                              onClick={() => setCurrentRole(item.role)}
                              className="w-full py-1 text-[10px] font-bold text-gray-600 hover:text-orange-600 hover:bg-orange-50/50 rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              <span>Switch View</span>
                              <ArrowRight size={10} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Added After Channel Partner: Architect, RMC, Consultant, Construction Factory, MEP */}
                <div className="pt-2 border-t-2 border-dashed border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-orange-900 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse"></span>
                      2. Added After Channel Partner (Architect · RMC · Consultant · Construction Factory · MEP)
                    </span>
                    <span className="text-[10px] font-black text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-300">
                      High Priority Portals
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {/* 10. Architect */}
                    <div className="bg-gradient-to-b from-indigo-50/50 via-white to-white border-2 border-indigo-200 hover:border-indigo-400 rounded-2xl p-4 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-13 h-13 rounded-2xl overflow-hidden shadow-sm ring-2 ring-indigo-200 group-hover:ring-indigo-400 transition-all relative bg-indigo-50 flex items-center justify-center shrink-0">
                            <img 
                              src={architectSymbolImg} 
                              alt="Architect" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 relative z-10"
                              onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                            />
                            <Compass size={26} className="text-indigo-600 absolute" />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                            Architect Studio
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                          <Compass size={16} className="text-indigo-600 shrink-0" />
                          Architect
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                          Architectural drawings, 2D floor plans, municipal sanction drawings & 3D exterior elevations.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-indigo-100 space-y-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openLogin('login', UserRole.ARCHITECT)}
                            className="flex-1 py-2 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-xs"
                          >
                            <LogIn size={13} />
                            <span>Login</span>
                          </button>
                          <button
                            onClick={() => openLogin('register', UserRole.ARCHITECT)}
                            className="flex-1 py-2 px-2 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1"
                          >
                            <UserPlus size={13} className="text-indigo-600" />
                            <span>Register</span>
                          </button>
                        </div>
                        <button
                          onClick={() => setCurrentRole(UserRole.ARCHITECT)}
                          className="w-full py-1 text-[10px] font-bold text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Switch Active View to Architect</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>

                    {/* 11. RMC */}
                    <div className="bg-gradient-to-b from-amber-50/50 via-white to-white border-2 border-amber-200 hover:border-amber-400 rounded-2xl p-4 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-13 h-13 rounded-2xl overflow-hidden shadow-sm ring-2 ring-amber-200 group-hover:ring-amber-400 transition-all relative bg-amber-50 flex items-center justify-center shrink-0">
                            <img 
                              src={rmcSymbolImg} 
                              alt="RMC Plant" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 relative z-10"
                              onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                            />
                            <Truck size={26} className="text-amber-600 absolute" />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            Batching Plant
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-gray-900 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                          <Truck size={16} className="text-amber-600 shrink-0" />
                          RMC (Ready Mix)
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                          Ready-Mix Concrete batching dispatch, transit mixer logistics & boom pump scheduling.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-amber-100 space-y-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openLogin('login', UserRole.RMC)}
                            className="flex-1 py-2 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-xs"
                          >
                            <LogIn size={13} />
                            <span>Login</span>
                          </button>
                          <button
                            onClick={() => openLogin('register', UserRole.RMC)}
                            className="flex-1 py-2 px-2 bg-white hover:bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1"
                          >
                            <UserPlus size={13} className="text-amber-600" />
                            <span>Register</span>
                          </button>
                        </div>
                        <button
                          onClick={() => setCurrentRole(UserRole.RMC)}
                          className="w-full py-1 text-[10px] font-bold text-amber-700 hover:bg-amber-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Switch Active View to RMC</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>

                    {/* 12. Consultant */}
                    <div className="bg-gradient-to-b from-blue-50/50 via-white to-white border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-4 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-13 h-13 rounded-2xl overflow-hidden shadow-sm ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all relative bg-blue-50 flex items-center justify-center shrink-0">
                            <img 
                              src={consultantSymbolImg} 
                              alt="Consultant" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 relative z-10"
                              onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                            />
                            <FileCheck2 size={26} className="text-blue-600 absolute" />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                            Civil & Structural
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                          <FileCheck2 size={16} className="text-blue-600 shrink-0" />
                          Consultant
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                          Structural engineering, stability certificates, geotech soil tests & independent quality audits.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-blue-100 space-y-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openLogin('login', UserRole.CONSULTANT)}
                            className="flex-1 py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-xs"
                          >
                            <LogIn size={13} />
                            <span>Login</span>
                          </button>
                          <button
                            onClick={() => openLogin('register', UserRole.CONSULTANT)}
                            className="flex-1 py-2 px-2 bg-white hover:bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1"
                          >
                            <UserPlus size={13} className="text-blue-600" />
                            <span>Register</span>
                          </button>
                        </div>
                        <button
                          onClick={() => setCurrentRole(UserRole.CONSULTANT)}
                          className="w-full py-1 text-[10px] font-bold text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Switch Active View to Consultant</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>

                    {/* 13. Construction Factory */}
                    <div className="bg-gradient-to-b from-stone-100/70 via-white to-white border-2 border-stone-300 hover:border-stone-500 rounded-2xl p-4 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-13 h-13 rounded-2xl overflow-hidden shadow-sm ring-2 ring-stone-300 group-hover:ring-stone-500 transition-all relative bg-stone-100 flex items-center justify-center shrink-0">
                            <img 
                              src={factorySymbolImg} 
                              alt="Construction Factory" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 relative z-10"
                              onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                            />
                            <Factory size={26} className="text-stone-700 absolute" />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 border border-stone-300">
                            Manufacturing
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-gray-900 group-hover:text-stone-800 transition-colors flex items-center gap-1.5">
                          <Factory size={16} className="text-stone-700 shrink-0" />
                          Construction Factory
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                          Precast concrete panels, AAC blocks, cement batch plant & building manufacturing equipment.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-stone-200 space-y-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openLogin('login', UserRole.CONSTRUCTION_FACTORY)}
                            className="flex-1 py-2 px-2 bg-stone-800 hover:bg-black text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-xs"
                          >
                            <LogIn size={13} />
                            <span>Login</span>
                          </button>
                          <button
                            onClick={() => openLogin('register', UserRole.CONSTRUCTION_FACTORY)}
                            className="flex-1 py-2 px-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-900 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1"
                          >
                            <UserPlus size={13} className="text-stone-700" />
                            <span>Register</span>
                          </button>
                        </div>
                        <button
                          onClick={() => setCurrentRole(UserRole.CONSTRUCTION_FACTORY)}
                          className="w-full py-1 text-[10px] font-bold text-stone-700 hover:bg-stone-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Switch Active View to Factory</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>

                    {/* 14. MEP */}
                    <div className="bg-gradient-to-b from-amber-50/50 via-white to-white border-2 border-amber-300 hover:border-amber-500 rounded-2xl p-4 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-13 h-13 rounded-2xl overflow-hidden shadow-sm ring-2 ring-amber-300 group-hover:ring-amber-500 transition-all relative bg-amber-50 flex items-center justify-center shrink-0">
                            <img 
                              src={mepSymbolImg} 
                              alt="MEP" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 relative z-10" 
                              onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                            />
                            <Wrench size={26} className="text-amber-800 absolute" />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            MEP Services
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-gray-900 group-hover:text-amber-800 transition-colors flex items-center gap-1.5">
                          <Wrench size={16} className="text-amber-800 shrink-0" />
                          MEP Staff & Supervisor
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                          Mechanical, electrical & plumbing staff, supervisors, engineers & labour.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-amber-200 space-y-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openLogin('login', UserRole.MEP)}
                            className="flex-1 py-2 px-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-xs"
                          >
                            <LogIn size={13} />
                            <span>Login</span>
                          </button>
                          <button
                            onClick={() => openLogin('register', UserRole.MEP)}
                            className="flex-1 py-2 px-2 bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1"
                          >
                            <UserPlus size={13} className="text-amber-800" />
                            <span>Register</span>
                          </button>
                        </div>
                        <button
                          onClick={() => setCurrentRole(UserRole.MEP)}
                          className="w-full py-1 text-[10px] font-bold text-amber-800 hover:bg-amber-100/60 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Switch Active View to MEP</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Labour (Labour Naka) Separate Section */}
              {(currentRole === UserRole.CLIENT || currentRole === UserRole.VENDOR || currentRole === UserRole.PMC || currentRole === UserRole.MATERIAL_SUPPLIER || currentRole === UserRole.BROKER || currentRole === UserRole.CHANNEL_PARTNER || currentRole === UserRole.FREELANCER || currentRole === UserRole.ARCHITECT || currentRole === UserRole.RMC || currentRole === UserRole.CONSULTANT || currentRole === UserRole.CONSTRUCTION_FACTORY || currentRole === UserRole.MEP) && (
                <InstantLaboursSection currentRole={currentRole} />
              )}

              {/* Construction Mart Pro Services (Interior, Civil, etc.) */}
              {(currentRole === UserRole.CLIENT || currentRole === UserRole.VENDOR) && (
                <ConstructionServicesPortal currentRole={currentRole} />
              )}

              {/* SPECIFIC DASHBOARD VIEW FOR SKILLED LABOURES */}
              {currentRole === UserRole.LABOUR && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm col-span-2">
                      <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                        👷 Active Instant Labour (Labour Naka) Requests
                      </h3>
                      <div className="space-y-3">
                        {labourRequests.length === 0 ? (
                          <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200 text-center">
                            <p className="text-sm text-gray-500 font-medium">No active labour requests right now.</p>
                            <p className="text-xs text-gray-400 mt-1">New Work Projects posted via Requests will appear here — latest first.</p>
                          </div>
                        ) : labourRequests.map((req) => {
                          const totalWorkers = req.workers?.reduce((s, w) => s + w.count, 0) || 0;
                          const strengthLabel = req.workers?.length
                            ? req.workers.map((w) => `${w.count} ${w.profession}`).join(', ')
                            : (totalWorkers ? `${totalWorkers} Workers` : 'As per description');
                          const shortId = req.id.length > 10 ? req.id.slice(0, 8).toUpperCase() : req.id;
                          return (
                            <div key={req.id} className="bg-gray-50 p-4 rounded-xl border border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{shortId}</span>
                                  <span className="text-sm font-black text-gray-800 truncate">{req.title || req.workers?.[0]?.profession || 'Labour Required'}</span>
                                  {req.workType && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white uppercase">{req.workType}</span>}
                                </div>
                                <p className="text-xs text-gray-500 mt-1 truncate">Required: {strengthLabel} | Timing: {req.timings || 'Flexible'}</p>
                                <p className="text-xs text-indigo-600 font-bold mt-0.5 truncate">Offered wage: {req.paymentPerDay || 'As per discussion'}</p>
                                {req.location && <p className="text-[11px] text-gray-400 mt-0.5 truncate">📍 {req.location} · by {req.userName}</p>}
                              </div>
                              <button 
                                onClick={() => {
                                  setApplyReq(req);
                                  setApplyProfession(req.workers?.[0]?.profession || 'Mason');
                                  setApplyStartDate(new Date().toISOString().split('T')[0]);
                                }}
                                className="text-xs font-bold px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-lg transition-colors shrink-0"
                              >
                                Apply
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Section for Material Supplier Instant Yard Bookings */}
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-black text-gray-800 mb-4 flex items-center gap-2">
                          ⚡ Instant Yard Labour (Labour Naka) Requirements (From Material Suppliers)
                        </h3>
                        {supplierBookings.length === 0 ? (
                          <p className="text-xs text-gray-500 font-medium">No active material yard labour requests at this moment.</p>
                        ) : (
                          <div className="space-y-3">
                            {supplierBookings.map((booking: any) => (
                              <div key={booking.id} className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-orange-700 bg-orange-100 px-2 py-0.5 rounded uppercase">Material Yard Req</span>
                                    <span className="text-sm font-black text-gray-800">{booking.workType}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">Requested Loader: <strong className="text-gray-700">{booking.name}</strong> | Required Helpers: <strong className="text-gray-700">{booking.helpersCount}</strong></p>
                                  <p className="text-xs text-gray-500 mt-0.5">Reporting Time: <strong className="text-orange-600">{booking.reportingTime}</strong></p>
                                  <p className="text-xs text-green-700 font-bold mt-1">Estimated Payout: ₹{booking.cost?.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                  {booking.status === 'Confirmed' || booking.status === 'Active' ? (
                                    <span className="bg-green-100 text-green-800 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                      Confirmed & Dispatched
                                    </span>
                                  ) : (
                                    <button 
                                      onClick={() => handleConfirmSupplierBooking(booking.id)}
                                      className="text-xs font-black px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                                    >
                                      Confirm Booking
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-900 text-white p-6 rounded-2xl col-span-1 shadow-md flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black text-orange-400 bg-orange-950 px-2.5 py-1 rounded uppercase tracking-wider">Tier-1 Class-A Helper</span>
                        <h4 className="text-xl font-bold mt-3">Ramu Yadav</h4>
                        <p className="text-xs text-slate-400 mt-1">Verified Member Since September 2024</p>
                        
                        <div className="mt-6 space-y-3">
                          <div className="flex justify-between items-center text-xs text-slate-300">
                            <span>Rating:</span>
                            <span className="font-bold text-orange-400">⭐ 4.9 (44 shifts)</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-slate-300">
                            <span>Payout:</span>
                            <span className="font-bold">Rupees (₹) Direct Bank</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-slate-300">
                            <span>Current City:</span>
                            <span className="font-bold">Mumbai Region</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-slate-800 mt-6">
                        <p className="text-[10px] text-slate-400 leading-normal">Your pricing list and profile is visible to civil contractors, developers, and homeowners nearby.</p>
                      </div>
                    </div>
                  </div>

                  {/* Apply modal */}
                  {applyReq && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div>
                            <h3 className="text-base font-bold text-gray-900">Apply for Work</h3>
                            <p className="text-xs text-gray-500 mt-1 truncate">{applyReq.title || 'Labour Request'} · {applyReq.location}</p>
                          </div>
                          <button onClick={() => setApplyReq(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"><span className="text-lg leading-none">×</span></button>
                        </div>
                        {applyReq.workers?.length ? (
                          <p className="text-xs text-gray-500 mb-3">This project needs: {applyReq.workers.map((w) => `${w.count} ${w.profession}`).join(', ')}</p>
                        ) : null}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Apply as *</label>
                            <select
                              value={applyProfession}
                              onChange={(e) => setApplyProfession(e.target.value)}
                              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
                            >
                              {(applyReq.workers?.length
                                ? applyReq.workers.map((w) => w.profession)
                                : ['Mason','Carpenter','Electrician','Plumber','Painter','Bar Bender','Welder','Tile Fitter','Helper','Supervisor']
                              ).map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Available from (start date) *</label>
                            <input
                              type="date"
                              value={applyStartDate}
                              onChange={(e) => setApplyStartDate(e.target.value)}
                              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
                              required
                            />
                          </div>
                          <div className="flex gap-3 pt-1">
                            <button
                              onClick={() => setApplyReq(null)}
                              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={async () => {
                                if (!applyProfession || !applyStartDate) {
                                  alert('Please select a role and start date.');
                                  return;
                                }
                                const applicant = auth.user;
                                await saveSubmission('application', {
                                  id: `app-${Date.now()}`,
                                  requestId: applyReq.id,
                                  requestTitle: applyReq.title,
                                  profession: applyProfession,
                                  startDate: applyStartDate,
                                  applicantId: applicant?.id || 'unknown',
                                  applicantName: applicant?.name || 'Labour User',
                                  applicantPhone: applicant?.phone || '',
                                  applicantRole: applicant?.role || 'LABOUR',
                                  location: applyReq.location,
                                  timings: applyReq.timings,
                                  paymentPerDay: applyReq.paymentPerDay,
                                  created_at: new Date().toISOString(),
                                  status: 'Applied',
                                });
                                alert(`Applied as ${applyProfession} starting ${applyStartDate}. The poster (${applyReq.userName}) has been notified.`);
                                setApplyReq(null);
                              }}
                              className="flex-1 py-2.5 rounded-lg bg-slate-900 hover:bg-black text-white text-sm font-bold"
                            >
                              Submit Application
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SPECIFIC DASHBOARD VIEW FOR JOB SEEKERS */}
              {currentRole === UserRole.JOB && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm col-span-2">
                      <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                        💼 Open Site Vacancies & Placement Careers
                      </h3>
                      <div className="space-y-3">
                        {[
                          { title: 'Assistant Site Civil Engineer', company: 'Apex Builders Private Ltd', location: 'Kalyan (Mumbai)', stipend: '₹22,000 - ₹28,000 / month', experience: '1-3 Years req.' },
                          { title: 'Senior Estimation Planner', company: 'BestBuild Contracting Corp', location: 'Navi Mumbai', stipend: '₹45,000 - ₹55,000 / month', experience: '5+ Years req.' },
                          { title: 'Construction Safety Manager', company: 'Core Foundations Ltd', location: 'Thane West', stipend: '₹30,000 - ₹38,000 / month', experience: '2+ Years req.' }
                        ].map((job, idx) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h4 className="text-sm font-black text-gray-800">{job.title}</h4>
                              <p className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded mt-1.5 inline-block font-semibold">{job.company}</p>
                              <div className="text-xs text-gray-400 mt-2 space-y-0.5">
                                <p>Location: {job.location} | Experience: {job.experience}</p>
                                <p className="font-mono text-gray-700 font-bold">Salary: {job.stipend}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => alert(`Application for safety/engineering listing submitted! Your profile details have been sent to hiring supervisors.`)}
                              className="text-xs font-bold px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors whitespace-nowrap"
                            >
                              Apply Now
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-gray-800 text-base mb-3">Post Your Resume</h4>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">Let top-tier builders, architects, and engineering consultants find your application directly in the Directory.</p>
                        <div className="border-2 border-dashed border-gray-200 hover:border-orange-500 rounded-xl p-6 text-center cursor-pointer transition-colors">
                          <Plus className="mx-auto text-gray-400 mb-2" size={24} />
                          <p className="text-xs font-bold text-gray-700">Upload PDF Resume</p>
                          <p className="text-[10px] text-gray-400 mt-1">Maximum file size: 5MB</p>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-100 text-[10px] text-gray-400">
                        * Once uploaded, your professional parameters are accessible by registered contracting partners.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentRole === UserRole.MATERIAL_SUPPLIER && (
                <SupplierDashboard />
              )}

              {currentRole === UserRole.FREELANCER && (
                <FreelancerProfile />
              )}

              {currentRole === UserRole.PMC && (
                <PMCProfile />
              )}

              {currentRole === UserRole.BROKER && (
                <BrokerProfile />
              )}

              {/* Services Grid (Visible to Client mostly, or for info) - WITHOUT SERVICES LOGOS */}
              {false && currentRole === UserRole.CLIENT && (
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {SERVICES_LIST.map((service) => (
                      <div key={service.type} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center cursor-pointer group">
                         {/* Services Logos/Emojis removed as requested */}
                         <h3 className="text-xs font-bold text-gray-800 h-8 flex items-center justify-center">{service.type}</h3>
                         <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{service.desc}</p>
                      </div>
                    ))}
                 </div>
              )}

              {/* Analytics Dashboard */}
              {(currentRole !== UserRole.LABOUR && currentRole !== UserRole.JOB && currentRole !== UserRole.MATERIAL_SUPPLIER && currentRole !== UserRole.FREELANCER && currentRole !== UserRole.PMC && currentRole !== UserRole.BROKER) && (
                <>
                  <Dashboard role={currentRole} projects={filteredProjects} />

                  {/* Project List with Payment Options */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                       <h3 className="font-bold text-gray-800">Your Projects</h3>
                       {searchQuery && (
                         <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                           Filtering by: "{searchQuery}"
                         </span>
                       )}
                    </div>
                    {/* Desktop View Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                           <tr>
                             <th className="px-6 py-3">Title</th>
                             <th className="px-6 py-3">Status</th>
                             <th className="px-6 py-3">Payment</th>
                             <th className="px-6 py-3">Amount</th>
                             <th className="px-6 py-3">Action</th>
                           </tr>
                        </thead>
                        <tbody>
                           {filteredProjects.map((project) => (
                             <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                               <td className="px-6 py-4 font-medium text-gray-900">{project.title}</td>
                               <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded text-xs ${
                                   project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                   project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                 }`}>{project.status}</span>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${project.paymentStatus === PaymentStatus.PAID ? 'bg-green-500' : 'bg-orange-500'}`} />
                                    <span className="text-gray-600">{project.paymentStatus}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-4 font-mono">₹{project.budget.toLocaleString()}</td>
                               <td className="px-6 py-4">
                                 {currentRole === UserRole.CLIENT && project.paymentStatus === PaymentStatus.PENDING && (
                                   <button 
                                     onClick={() => setSelectedProjectForPayment(project)}
                                     className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg hover:bg-black transition-colors"
                                   >
                                     <Wallet size={14} /> Pay Now
                                   </button>
                                 )}
                                 {currentRole === UserRole.VENDOR && project.paymentStatus === PaymentStatus.PAID && (
                                   <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
                                     <Clock size={14} /> Payout Soon
                                   </span>
                                 )}
                               </td>
                             </tr>
                           ))}
                           {filteredProjects.length === 0 && (
                             <tr>
                               <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                 No projects found matching "{searchQuery}"
                               </td>
                             </tr>
                           )}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card-based View without any horizontal scrolling */}
                    <div className="block md:hidden divide-y divide-gray-100">
                      {filteredProjects.map((project) => (
                        <div key={project.id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-gray-900 text-sm leading-snug">{project.title}</h4>
                            <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>{project.status}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs pt-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-400 font-medium">Payment:</span>
                              <div className="flex items-center gap-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${project.paymentStatus === PaymentStatus.PAID ? 'bg-green-500' : 'bg-orange-500'}`} />
                                <span className="text-gray-700 font-medium">{project.paymentStatus}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-gray-400 font-medium mr-1.5">Budget:</span>
                              <span className="font-mono font-bold text-gray-900">₹{project.budget.toLocaleString()}</span>
                            </div>
                          </div>

                          {((currentRole === UserRole.CLIENT && project.paymentStatus === PaymentStatus.PENDING) || 
                            (currentRole === UserRole.VENDOR && project.paymentStatus === PaymentStatus.PAID)) && (
                            <div className="pt-2">
                              {currentRole === UserRole.CLIENT && project.paymentStatus === PaymentStatus.PENDING && (
                                <button 
                                  onClick={() => setSelectedProjectForPayment(project)}
                                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors shadow-sm"
                                >
                                  <Wallet size={14} /> Pay Now
                                </button>
                              )}
                              {currentRole === UserRole.VENDOR && project.paymentStatus === PaymentStatus.PAID && (
                                <div className="flex items-center justify-center gap-1 py-1.5 bg-green-50/50 rounded-lg text-green-700 text-xs font-bold border border-green-100">
                                  <Clock size={13} className="animate-pulse" /> Payout Soon
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      {filteredProjects.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                          No projects found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* GLOBAL OUR SERVICES SLIDER (FIXED-HEIGHT HORIZONTAL SLIDER + POP-UP FULL CATALOG) */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-150 shadow-sm transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                      <Hammer size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-gray-900 text-base">
                          Our Services Directory
                        </h3>
                        <span className="hidden sm:inline-flex text-[10px] font-black text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          15 Verticals · 85+ Services
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Slide horizontally across verticals or pop-up the complete catalog without stretching page length.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Horizontal slider control buttons */}
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-0.5">
                      <button
                        onClick={() => servicesCarouselRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                        className="p-1.5 hover:bg-white text-gray-600 hover:text-orange-600 rounded-lg transition-all shadow-2xs"
                        title="Slide Left"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => servicesCarouselRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                        className="p-1.5 hover:bg-white text-gray-600 hover:text-orange-600 rounded-lg transition-all shadow-2xs"
                        title="Slide Right"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    {/* Pop-up Full Catalog Button */}
                    <button
                      onClick={() => setShowServicesPopupModal(true)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-black transition-all shadow-sm shadow-orange-200 flex items-center gap-1.5 active:scale-95"
                    >
                      <Sparkles size={14} className="animate-pulse" />
                      <span>Pop-Up Catalog</span>
                    </button>
                  </div>
                </div>

                {/* Fixed-Height Horizontal Slider */}
                <div 
                  ref={servicesCarouselRef}
                  className="flex gap-4 overflow-x-auto scroll-smooth py-1 px-0.5 custom-scrollbar snap-x snap-mandatory"
                  style={{ maxHeight: '250px' }}
                >
                  {DETAILED_SERVICES.map((section, idx) => (
                    <div 
                      key={idx} 
                      className="min-w-[270px] sm:min-w-[300px] max-w-[300px] snap-start bg-slate-50/80 hover:bg-white border border-gray-200 hover:border-orange-300 rounded-2xl p-4 flex flex-col justify-between transition-all shadow-2xs hover:shadow-md group h-[230px]"
                    >
                      <div className="overflow-hidden">
                        <div className="flex items-center justify-between gap-1 mb-2 pb-1.5 border-b border-gray-200/80">
                          <h4 className="font-extrabold text-gray-900 text-xs truncate group-hover:text-orange-600 transition-colors flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                            <span className="truncate">{section.category.replace(' Services', '')}</span>
                          </h4>
                          <span className="text-[9px] font-bold text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded-md shrink-0">
                            {section.items.length} items
                          </span>
                        </div>
                        <ul className="space-y-1 pl-1">
                          {section.items.slice(0, 5).map((item, i) => (
                            <li key={i} className="text-[11px] text-gray-600 flex items-start gap-1.5 truncate">
                              <CheckCircle2 size={11} className="text-orange-500 shrink-0 mt-0.5" />
                              <span className="truncate">{item}</span>
                            </li>
                          ))}
                          {section.items.length > 5 && (
                            <li className="text-[10px] text-orange-600 font-bold pl-4">
                              +{section.items.length - 5} more specialized services...
                            </li>
                          )}
                        </ul>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedServiceCategoryTab(section.category);
                          setShowServicesPopupModal(true);
                        }}
                        className="mt-2 pt-2 border-t border-gray-150 text-[11px] font-black text-orange-600 group-hover:text-orange-700 flex items-center justify-between w-full"
                      >
                        <span>View full list in pop-up</span>
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {showClientRequiresModal && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-gray-150 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-100 text-rose-700 rounded-lg animate-pulse">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">🎯 Live {selectedRequesterType === 'Client' ? 'Developer' : selectedRequesterType} Requirements: {selectedReqCategory === 'Staff' ? 'Staff Needed' : selectedReqCategory}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Urgent {selectedReqCategory === 'Staff' ? 'staff' : selectedReqCategory.toLowerCase()} required by verified {selectedRequesterType === 'Client' ? 'developer' : selectedRequesterType.toLowerCase()}s.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowClientRequiresModal(false);
                  setBiddingReqId(null);
                }} 
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category Selector Tabs inside Modal */}
            <div className="mb-4 shrink-0">
              <div className="flex bg-gray-100 p-1 rounded-xl w-full">
                <button
                  type="button"
                  onClick={() => setSelectedReqCategory('Labours')}
                  className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                    selectedReqCategory === 'Labours' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  🔨 Labours Needed
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReqCategory('Materials')}
                  className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                    selectedReqCategory === 'Materials' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  📦 Materials Needed
                </button>
                {currentRole === UserRole.JOB && (
                  <button
                    type="button"
                    onClick={() => setSelectedReqCategory('Staff')}
                    className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                      selectedReqCategory === 'Staff' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    📐 Staff Needed
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100 text-xs text-orange-800 leading-normal font-medium mb-2">
                📢 <strong>{selectedRequesterType === 'Client' ? 'Developer' : selectedRequesterType} Note:</strong> These are verified demands posted directly by premium construction {selectedRequesterType === 'Client' ? 'developer' : selectedRequesterType.toLowerCase()}s. Bidding is 100% direct and carries <strong>0% commission</strong> for registered platform partners.
              </div>

              {filteredReqs.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="font-bold text-sm">No active requirements matching these filters at the moment.</p>
                </div>
              ) : (
                filteredReqs.map((req) => (
                  <div 
                    key={req.id} 
                    className={`border rounded-xl p-4 transition-all ${
                      req.status === 'Bid Submitted' 
                        ? 'bg-slate-50 border-slate-200' 
                        : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          req.urgency === 'Urgently Needed' 
                            ? 'bg-red-100 text-red-800' 
                            : req.urgency === 'Immediate' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          🔥 {req.urgency}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                          {req.category}
                        </span>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                        req.status === 'Bid Submitted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-orange-50 text-orange-700'
                      }`}>
                        {req.status === 'Bid Submitted' ? '✓ Bid Submitted' : '● Receiving Bids'}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-gray-800 tracking-tight leading-snug">
                      {req.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed font-medium">
                      {req.description}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 my-3 border-y border-gray-100 text-xs">
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Estimated Budget</span>
                        <span className="font-black text-gray-800 font-mono">{req.budget}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Location</span>
                        <span className="font-bold text-gray-700">{req.location}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">{selectedRequesterType === 'Client' ? 'Developer' : 'Contractor'} Entity</span>
                        <span className="font-bold text-gray-700 line-clamp-1">{req.client}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Actions</span>
                        <span className="font-medium text-emerald-600 font-bold">Direct Contract</span>
                      </div>
                    </div>

                    {req.status !== 'Bid Submitted' && (
                      <div className="pt-1">
                        {biddingReqId !== req.id ? (
                          <button
                            onClick={() => {
                              setBiddingReqId(req.id);
                              setBidPrice('');
                              setBidMessage('');
                            }}
                            className="w-full py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-black transition-colors"
                          >
                            Submit Direct Estimate / Bid
                          </button>
                        ) : (
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!bidPrice) {
                                alert('Please input your price quotation.');
                                return;
                              }
                              // Update requirement status
                              setClientReqs(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Bid Submitted' } : r));
                              
                              const bidData = {
                                booking_type: 'vendor_bid',
                                requirementId: req.id,
                                requirementTitle: req.title,
                                bidPrice,
                                bidMessage,
                                client: req.client,
                                status: 'Pending Approval'
                              };

                              saveSubmission('booking', bidData);

                              // Add a chat message for the submitted bid/proposal to reflect on the chat window
                              const bidMsg: ChatMessage = {
                                id: Date.now().toString(),
                                senderId: 'vendor-bid',
                                senderName: 'You (Vendor Partner)',
                                senderRole: 'Vendor',
                                text: `💼 ESTIMATE SUBMITTED: We have submitted a quote of ₹${bidPrice} for "${req.title}". Timeline/Terms: ${bidMessage || 'As per specified scope.'}`,
                                timestamp: new Date().toISOString()
                              };
                              setMessages(prev => [...prev, bidMsg]);
                              
                              setBiddingReqId(null);
                              // Alert confirmation message
                              alert(`Successfully submitted direct quotation of ₹${bidPrice} to ${req.client}! They will respond within 24 hours.`);
                            }}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3 mt-2 animate-in slide-in-from-top duration-200"
                          >
                            <div className="flex justify-between items-center pb-1 border-b border-gray-150">
                              <span className="text-xs font-black text-gray-700">Submit Bid Proposal</span>
                              <button 
                                type="button" 
                                onClick={() => setBiddingReqId(null)} 
                                className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                              >
                                Cancel
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-extrabold text-gray-500 uppercase mb-0.5">Your Price Offer (₹) *</label>
                                <input 
                                  type="text" 
                                  required
                                  value={bidPrice}
                                  onChange={e => setBidPrice(e.target.value)}
                                  placeholder="e.g. 1,95,000" 
                                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-extrabold text-gray-500 uppercase mb-0.5">Work Timeline / Terms</label>
                                <input 
                                  type="text" 
                                  value={bidMessage}
                                  onChange={e => setBidMessage(e.target.value)}
                                  placeholder="e.g. Immediate delivery in 2 days" 
                                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                />
                              </div>
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-black transition-colors"
                            >
                              Publish Quote & Submit Proposal
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {req.status === 'Bid Submitted' && (
                      <div className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 p-2.5 rounded-lg border border-emerald-150 mt-1">
                        ✓ Your price offer has been dispatched directly to the client's partner dashboard. They will contact you shortly via email or direct chat.
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-gray-150 mt-4 flex justify-end shrink-0">
              <button 
                onClick={() => {
                  setShowClientRequiresModal(false);
                  setBiddingReqId(null);
                }} 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewProjectModal && (
        <PostRequestModal
          onClose={() => setShowNewProjectModal(false)}
          initialTab="project"
          initialCategory={newProjectCategory}
          onPosted={(req) => {
            if (req.kind === 'project') {
              const reqCatMap: Record<string, 'Labours' | 'Materials' | 'Staff'> = {
                Material: 'Materials',
                Labour: 'Labours',
                Engineer: 'Staff',
                PMC: 'Staff',
                Consultant: 'Staff',
                Architect: 'Staff',
                Freelancer: 'Staff',
                Vendor: 'Labours',
                'Property Agents': 'Staff',
              };
              setClientReqs((prev) => [
                {
                  id: req.id,
                  title: req.title || `${req.requirementCategory || 'Project'} Requirement`,
                  category: req.requirementCategory || 'General',
                  reqCategory: reqCatMap[req.requirementCategory || 'Vendor'] || 'Labours',
                  requesterType: currentRole === UserRole.VENDOR ? 'Contractor' : 'Client',
                  budget: req.paymentPerDay || 'As per quote',
                  location: req.location || 'Mumbai',
                  urgency: 'Immediate',
                  postedTime: 'Just now',
                  description: req.description || 'Direct requirement posted on Construction Mart SHK.',
                  client: req.userName || 'Verified Member',
                  status: 'Open',
                },
                ...prev,
              ]);
            }
          }}
        />
      )}

      {selectedProjectForPayment && (
        <PaymentModal 
          project={selectedProjectForPayment} 
          onClose={() => setSelectedProjectForPayment(null)} 
          onSuccess={handlePaymentSuccess} 
        />
      )}

      {showAboutModal && (
        <div id="about-us-modal" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-150">
              <Logo size="sm" />
              <button onClick={() => setShowAboutModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X size={20}/></button>
            </div>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                <strong>Construction Mart SHK</strong> is India's leading digital marketplace connecting premium clients, certified vendors, and skilled labor for seamless construction and interior renovation works.
              </p>
              <p>
                Founded by <strong className="text-gray-900 font-extrabold">SADDAM HUSAIN KHAN</strong>, Construction Mart SHK simplifies site execution, material procurement, and labor deployment at a guaranteed flat rate of just 10% of the project budget.
              </p>
              <p>
                Our platform ensures transparent, quality-monitored projects, secure escrow-based payouts, and direct contact directories, helping hundreds of homeowners and contracting partners build with trust, speed, and safety.
              </p>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mt-2">
                <p className="text-xs text-orange-900 font-medium">
                  📍 Headquartered in Mumbai, India — serving residential, commercial and civil projects nationwide.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowAboutModal(false)} 
                className="px-4 py-2 bg-gray-950 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                id="btn-close-about"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {showSupportModal && (
        <div id="customer-support-modal" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-150">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="text-orange-500" size={22} /> Customer Support
              </h3>
              <button onClick={() => setShowSupportModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Need help with a project, registration, payment or finding masons? Get in touch with our Support Executive or our Founder immediately.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-150 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 text-orange-600 p-2.5 rounded-full">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 font-semibold text-gray-900">SADDAM HUSAIN KHAN</p>
                      <p className="text-xs text-gray-500">Founder & Chief Director</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Support Helpdesk:</span>
                    <span className="font-bold text-gray-800">24/7 Verified In-App Support</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Official Helpdesk:</span>
                    <span className="font-mono font-bold text-orange-600">support@constructionmartshk.com</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Headquarters:</span>
                    <span className="font-medium text-gray-700">Mumbai Central, India</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-400 text-center italic mt-2">
                Available 24/7 for urgent site challenges and project assistance.
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowSupportModal(false)} 
                className="px-4 py-2 bg-gray-950 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                id="btn-close-support"
              >
                Close Support
              </button>
            </div>
          </div>
        </div>
      )}
        </div>

      {/* Rate Explorer drawer + login modal (shared with the guest home view) */}
      {rateExplorerDrawer}
      {loginModal}
    </>
  );
};

export default App;