export enum UserRole {
  CLIENT = 'CLIENT',
  VENDOR = 'VENDOR',
  PMC = 'PMC',
  CHANNEL_PARTNER = 'CHANNEL_PARTNER',
  LABOUR = 'LABOUR',
  MATERIAL_SUPPLIER = 'MATERIAL_SUPPLIER',
  JOB = 'JOB SEEKER',
  JOB_SEEKER = 'JOB SEEKER',
  FREELANCER = 'FREELANCER',
  BROKER = 'BROKER',
  ARCHITECT = 'ARCHITECT',
  RMC = 'RMC',
  CONSULTANT = 'CONSULTANT',
  CONSTRUCTION_FACTORY = 'CONSTRUCTION_FACTORY',
  MEP = 'MEP',
}

export enum ServiceType {
  CONSTRUCTION = 'Construction Services',
  INTERIOR = 'Interior & Renovation',
  BUILDING_SOCIETY = 'Building Society Services',
  HOME = 'Home Services',
  PLACEMENT = 'Placement Services',
}

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  RELEASED = 'Released',
}

export interface Project {
  id: string;
  title: string;
  description: string;
  serviceType: ServiceType;
  budget: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  paymentStatus: PaymentStatus;
  date: string;
  clientName: string;
  vendorName?: string;
  channelPartnerName?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email: string;
}

export interface MonthlyStat {
  name: string;
  value: number;
}

export interface WhatsappContact {
  name: string;
  role: string;
  number: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string; // 'Admin' | 'Client' | 'Vendor' | 'Channel Partner'
  text: string;
  timestamp: string;
  projectId?: string; // Optional: link message to a specific project context
  recipientId?: string;
  recipientName?: string;
  recipientRole?: string;
  conversationId?: string;
}

export interface Vendor {
  id: string;
  name: string;
  specialty: ServiceType;
  rating: number;
  email: string;
  phone: string;
  joinedDate: string;
  // Regional Profile Data
  region?: string;
  experience?: string;
  contractTypes?: string[];
  laborStrength?: number;
}

export interface ActivityRate {
  id: string;
  vendorId: string;
  region: string;
  activity: string;
  unit: string;
  rate: number;
}

export interface MaterialRate {
  id: string;
  vendorId: string;
  region: string;
  material: string;
  unit: string;
  rate: number;
}

export interface QuotationItem {
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
}

export interface Quotation {
  id: string;
  projectId?: string;
  clientName: string;
  vendorName: string;
  date: string;
  items: QuotationItem[];
  totalAmount: number;
  region: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  totalProjects: number;
}

export interface ChannelPartner {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  activeMatches: number;
}