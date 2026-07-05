import React, { useState, useMemo, useEffect } from 'react';
import { Project, Vendor, ServiceType, Client, ChannelPartner, PaymentStatus } from '../types';
import { fetchAllSubmissions, saveSubmission, removeSubmission } from '../services/supabase';
import { Briefcase, UserCheck, AlertCircle, CheckCircle, Search, X, Users, Hammer, Shield, BarChart3, TrendingUp, IndianRupee, PieChart as PieChartIcon, Filter, Database, Trash2, Mail, FileCheck, Layers, Calendar, ShieldCheck, CheckCircle2, Building2, Phone } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface AdminPanelProps {
  projects: Project[];
  vendors: Vendor[];
  clients: Client[];
  channelPartners: ChannelPartner[];
  onAssignVendor: (projectId: string, vendor: Vendor) => void;
}

type AdminView = 'submissions' | 'requests' | 'vendors' | 'clients' | 'labours' | 'jobPlacement' | 'analytics';

interface LabourResource {
  id: string;
  name: string;
  trade: string;
  experience: string;
  dailyRate: number;
  phone: string;
  region: string;
  status: 'Available' | 'Assigned' | 'On Break';
}

interface JobPlacement {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  experienceRequired: string;
  appliedCount: number;
  status: 'Active' | 'Closed';
}

const MOCK_LABOURS: LabourResource[] = [
  { id: 'l1', name: 'Ramesh Kumar', trade: 'Mason / Bricklayer', experience: '5 Years', dailyRate: 750, phone: '+91 98765-43210', region: 'Mumbai', status: 'Available' },
  { id: 'l2', name: 'Sanjay Singh', trade: 'Carpenter Team Lead', experience: '8 Years', dailyRate: 900, phone: '+91 98765-43211', region: 'Mumbai', status: 'Assigned' },
  { id: 'l3', name: 'Amit Sharma', trade: 'Electrician (Grade A)', experience: '4 Years', dailyRate: 800, phone: '+91 98765-43212', region: 'Navi Mumbai', status: 'Available' },
  { id: 'l4', name: 'Vijay Patil', trade: 'Concrete Casting Specialist', experience: '6 Years', dailyRate: 700, phone: '+91 98765-43213', region: 'Thane', status: 'Available' },
  { id: 'l5', name: 'Deepak Yadav', trade: 'Plumber / Pipe Fitter', experience: '3 Years', dailyRate: 650, phone: '+91 98765-43214', region: 'Kalyan', status: 'On Break' }
];

const MOCK_JOB_PLACEMENTS: JobPlacement[] = [
  { id: 'j1', title: 'Assistant Site Civil Engineer', company: 'Apex Builders Private Ltd', location: 'Kalyan (Mumbai)', salary: '₹22,000 - ₹28,000 / month', experienceRequired: '1-3 Years', appliedCount: 14, status: 'Active' },
  { id: 'j2', title: 'Senior Estimation Planner', company: 'BestBuild Contracting Corp', location: 'Navi Mumbai', salary: '₹45,000 - ₹55,000 / month', experienceRequired: '5+ Years', appliedCount: 8, status: 'Active' },
  { id: 'j3', title: 'Construction Safety Manager', company: 'Core Foundations Ltd', location: 'Thane West', salary: '₹30,000 - ₹38,000 / month', experienceRequired: '2+ Years', appliedCount: 19, status: 'Active' },
  { id: 'j4', title: 'Architect & CAD Draftsman', company: 'Design Elevations Corp', location: 'Mumbai Central', salary: '₹35,000 - ₹42,000 / month', experienceRequired: '3+ Years', appliedCount: 22, status: 'Active' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminPanel: React.FC<AdminPanelProps> = ({ projects, vendors, clients, channelPartners, onAssignVendor }) => {
  const [currentView, setCurrentView] = useState<AdminView>('submissions');
  const [liveSubmissions, setLiveSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  const fetchSubmissionsFromDb = async () => {
    const list = await fetchAllSubmissions();
    setLiveSubmissions(list);
    setLoadingSubmissions(false);
  };

  useEffect(() => {
    fetchSubmissionsFromDb();
    const interval = setInterval(fetchSubmissionsFromDb, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id: string, type: string, status: string, originalData: any) => {
    const updatedData = { ...originalData, status };
    await saveSubmission(type, updatedData);
    await fetchSubmissionsFromDb();
    alert(`Status updated to "${status}"!`);
  };

  const handleDeleteSubmission = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this submission permanently from Supabase?')) {
      await removeSubmission(id);
      await fetchSubmissionsFromDb();
      alert('Submission deleted from database.');
    }
  };

  const [filter, setFilter] = useState<'All' | 'Pending' | 'In Progress'>('All');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [vendorSearch, setVendorSearch] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('All');

  const filteredProjects = projects.filter(p => {
    const matchesStatus = filter === 'All' ? true : p.status === filter;
    const matchesSearch = p.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                         p.clientName.toLowerCase().includes(globalSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                         v.specialty.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                         v.email.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                         v.phone.includes(globalSearchQuery);
    const matchesSpecialty = specialtyFilter === 'All' ? true : v.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    c.phone.includes(globalSearchQuery)
  );

  const filteredChannelPartners = channelPartners.filter(s => 
    s.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    s.phone.includes(globalSearchQuery)
  );

  const filteredLabours = MOCK_LABOURS.filter(l => 
    l.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    l.trade.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    l.region.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    l.phone.includes(globalSearchQuery)
  );

  const filteredJobPlacements = MOCK_JOB_PLACEMENTS.filter(j => 
    j.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    j.company.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    j.location.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  // Analytics Calculations
  const analyticsData = useMemo(() => {
    const paidProjects = projects.filter(p => p.paymentStatus === PaymentStatus.PAID);
    
    // Financials
    const totalTurnover = paidProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalRevenue = totalTurnover * 0.10; // 10% Platform Fee

    // Monthly Data
    const monthlyRevenueMap: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize months
    months.forEach(m => monthlyRevenueMap[m] = 0);

    paidProjects.forEach(p => {
      const date = new Date(p.date);
      const month = date.toLocaleString('default', { month: 'short' });
      if (monthlyRevenueMap[month] !== undefined) {
        monthlyRevenueMap[month] += (p.budget * 0.10);
      }
    });

    // Mock data population if empty (for demo purposes)
    if (paidProjects.length < 5) {
       monthlyRevenueMap['Jan'] += 1200;
       monthlyRevenueMap['Feb'] += 1900;
       monthlyRevenueMap['Mar'] += 1500;
       monthlyRevenueMap['Apr'] += 2200;
       monthlyRevenueMap['May'] += 2800;
    }

    const monthlyChartData = Object.keys(monthlyRevenueMap).map(key => ({
      name: key,
      revenue: monthlyRevenueMap[key]
    }));

    // Service Breakdown
    const serviceStats: Record<string, { 
      count: number, 
      vendors: Set<string>, 
      channelPartners: Set<string>, 
      clients: Set<string>,
      totalValue: number
    }> = {};

    Object.values(ServiceType).forEach(type => {
      serviceStats[type] = { 
        count: 0, 
        vendors: new Set(), 
        channelPartners: new Set(), 
        clients: new Set(), 
        totalValue: 0 
      };
    });
    
    projects.forEach(p => {
      if (!serviceStats[p.serviceType]) return;
      
      serviceStats[p.serviceType].count++;
      serviceStats[p.serviceType].totalValue += p.budget;
      serviceStats[p.serviceType].clients.add(p.clientName);
      if (p.vendorName) serviceStats[p.serviceType].vendors.add(p.vendorName);
      if (p.channelPartnerName) serviceStats[p.serviceType].channelPartners.add(p.channelPartnerName);
    });

    const serviceTableData = Object.keys(serviceStats).map(key => ({
      service: key,
      projects: serviceStats[key].count,
      uniqueVendors: serviceStats[key].vendors.size,
      uniqueChannelPartners: serviceStats[key].channelPartners.size,
      uniqueClients: serviceStats[key].clients.size,
      valuation: serviceStats[key].totalValue
    })).sort((a, b) => b.projects - a.projects);

    return { totalTurnover, totalRevenue, monthlyChartData, serviceTableData };
  }, [projects]);

  const toggleDropdown = (projectId: string) => {
    if (activeDropdown === projectId) {
      setActiveDropdown(null);
      setVendorSearch('');
    } else {
      setActiveDropdown(projectId);
      setVendorSearch('');
    }
  };

  const getFilteredVendorsForAssignment = (serviceType: ServiceType) => {
    let available = vendors.filter(v => v.specialty === serviceType);
    if (vendorSearch.trim()) {
      const query = vendorSearch.toLowerCase();
      available = available.filter(v => v.name.toLowerCase().includes(query));
    }
    return available;
  };

  const handleAssign = (projectId: string, vendor: Vendor) => {
    onAssignVendor(projectId, vendor);
    setActiveDropdown(null);
    setVendorSearch('');
  };

  const renderAnalytics = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm text-gray-500 font-medium mb-1">Yearly Turnover (GMV)</p>
            <h3 className="text-3xl font-bold text-gray-900">₹{analyticsData.totalTurnover.toLocaleString()}</h3>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +12.5% from last year
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-blue-50 to-transparent opacity-50" />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
           <div className="relative z-10">
            <p className="text-sm text-gray-500 font-medium mb-1">Net Platform Revenue</p>
            <h3 className="text-3xl font-bold text-gray-900">₹{analyticsData.totalRevenue.toLocaleString()}</h3>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <IndianRupee size={14} /> 10% Service Fee Applied
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-green-50 to-transparent opacity-50" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
           <div className="relative z-10">
            <p className="text-sm text-gray-500 font-medium mb-1">Active Projects</p>
            <h3 className="text-3xl font-bold text-gray-900">{projects.filter(p => p.status === 'In Progress').length}</h3>
            <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
              <Briefcase size={14} /> Currently Ongoing
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-orange-50 to-transparent opacity-50" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
             <BarChart3 size={20} className="text-blue-500"/> Monthly Revenue Trend
           </h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={analyticsData.monthlyChartData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                 <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={(value) => `₹${value}`} />
                 <Tooltip formatter={(value) => `₹${value}`} cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
             <PieChartIcon size={20} className="text-orange-500"/> Project Distribution
           </h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={analyticsData.serviceTableData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="projects"
                 >
                   {analyticsData.serviceTableData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Legend verticalAlign="bottom" height={36} iconType="circle" />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Detailed Service Analytics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Service Performance Analytics</h3>
          <p className="text-sm text-gray-500">Breakdown of resources deployed per service category</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Service Category</th>
                <th className="px-6 py-4">Total Projects</th>
                <th className="px-6 py-4">Clients Served</th>
                <th className="px-6 py-4">Vendors Assigned</th>
                <th className="px-6 py-4">Channel Partners Deployed</th>
                <th className="px-6 py-4">Total Valuation</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.serviceTableData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    {row.service}
                  </td>
                  <td className="px-6 py-4">{row.projects}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-gray-400" />
                      {row.uniqueClients}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Hammer size={14} className="text-gray-400" />
                      {row.uniqueVendors}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Shield size={14} className="text-gray-400" />
                      {row.uniqueChannelPartners}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600">
                    ₹{row.valuation.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRequestsTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] animate-in fade-in">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-4">Request Details</th>
              <th className="px-6 py-4">Service Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Assigned Vendor</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{project.title}</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">{project.description}</div>
                  <div className="text-[10px] text-gray-400 mt-1">Client: {project.clientName}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-50 text-blue-700 py-1 px-2 rounded-md text-xs border border-blue-100">
                    {project.serviceType}
                  </span>
                </td>
                <td className="px-6 py-4">
                   {project.status === 'Pending' ? (
                     <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full w-fit text-xs">
                       <AlertCircle size={12} /> Pending
                     </span>
                   ) : (
                     <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit text-xs">
                       <CheckCircle size={12} /> {project.status}
                     </span>
                   )}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {project.vendorName || <span className="text-gray-400 italic">Unassigned</span>}
                </td>
                <td className="px-6 py-4">
                  {!project.vendorName ? (
                    <div className="relative">
                       <button 
                         onClick={() => toggleDropdown(project.id)}
                         className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${activeDropdown === project.id ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white hover:bg-black'}`}
                       >
                          <UserCheck size={14} /> Assign Vendor
                       </button>
                       
                       {activeDropdown === project.id && (
                         <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-20 animate-in fade-in slide-in-from-top-2">
                            <div className="p-3 border-b border-gray-50 bg-gray-50 rounded-t-xl">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Select Vendor</span>
                                <button onClick={() => setActiveDropdown(null)} className="text-gray-400 hover:text-gray-600">
                                  <X size={14} />
                                </button>
                              </div>
                              <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                  autoFocus
                                  type="text"
                                  placeholder="Search vendor name..."
                                  value={vendorSearch}
                                  onChange={(e) => setVendorSearch(e.target.value)}
                                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                            <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                               {getFilteredVendorsForAssignment(project.serviceType).length > 0 ? (
                                 getFilteredVendorsForAssignment(project.serviceType).map(vendor => (
                                   <button 
                                    key={vendor.id}
                                    onClick={() => handleAssign(project.id, vendor)}
                                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg flex justify-between items-center transition-colors"
                                   >
                                     <span className="font-medium">{vendor.name}</span>
                                     <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">★ {vendor.rating}</span>
                                   </button>
                                 ))
                               ) : (
                                 <div className="px-3 py-4 text-center text-xs text-gray-400">
                                   {vendorSearch ? 'No matching vendors' : 'No vendors for this service type'}
                                 </div>
                               )}
                            </div>
                         </div>
                       )}
                    </div>
                  ) : (
                    <button disabled className="text-gray-400 text-xs border border-gray-200 px-3 py-1.5 rounded-lg cursor-not-allowed">
                       Assigned
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  {globalSearchQuery ? `No requests matching "${globalSearchQuery}"` : 'No projects found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  );

  const renderVendorsTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-4">Vendor Name</th>
            <th className="px-6 py-4">Specialty</th>
            <th className="px-6 py-4">Contact</th>
            <th className="px-6 py-4">Rating</th>
            <th className="px-6 py-4">Joined</th>
          </tr>
        </thead>
        <tbody>
          {filteredVendors.map((vendor) => (
            <tr key={vendor.id} className="border-b border-gray-50 hover:bg-gray-50/50">
              <td className="px-6 py-4 font-medium text-gray-900">{vendor.name}</td>
              <td className="px-6 py-4">
                <span className="bg-blue-50 text-blue-700 py-1 px-2 rounded-md text-xs border border-blue-100">
                  {vendor.specialty}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600">
                <div className="text-xs">{vendor.email}</div>
                <div className="text-[10px] text-gray-400">{vendor.phone}</div>
              </td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full w-fit text-xs font-bold">
                  ★ {vendor.rating}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500 text-xs">{vendor.joinedDate}</td>
            </tr>
          ))}
          {filteredVendors.length === 0 && (
             <tr>
               <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                 No vendors found matching the current filters.
               </td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderClientsTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-4">Client Name</th>
            <th className="px-6 py-4">Contact Info</th>
            <th className="px-6 py-4">Projects Posted</th>
            <th className="px-6 py-4">Joined</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50/50">
              <td className="px-6 py-4 font-medium text-gray-900">{client.name}</td>
              <td className="px-6 py-4 text-gray-600">
                <div className="text-xs">{client.email}</div>
                <div className="text-[10px] text-gray-400">{client.phone}</div>
              </td>
              <td className="px-6 py-4 text-gray-800 font-bold">{client.totalProjects}</td>
              <td className="px-6 py-4 text-gray-500 text-xs">{client.joinedDate}</td>
            </tr>
          ))}
          {filteredClients.length === 0 && (
             <tr>
               <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                 No clients found matching "{globalSearchQuery}"
               </td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderLaboursTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-4">Labour Name</th>
            <th className="px-6 py-4">Trade & Skill</th>
            <th className="px-6 py-4">Experience</th>
            <th className="px-6 py-4">Daily Rate</th>
            <th className="px-6 py-4">Contact & Region</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredLabours.map((labour) => (
            <tr key={labour.id} className="border-b border-gray-50 hover:bg-gray-50/50">
              <td className="px-6 py-4 font-medium text-gray-900">{labour.name}</td>
              <td className="px-6 py-4">
                <span className="bg-orange-50 text-orange-700 py-1 px-2 rounded-md text-xs border border-orange-100 font-bold">
                  {labour.trade}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600">{labour.experience}</td>
              <td className="px-6 py-4 text-gray-900 font-bold font-mono">₹{labour.dailyRate} / day</td>
              <td className="px-6 py-4 text-gray-600">
                <div className="text-xs">{labour.phone}</div>
                <div className="text-[10px] text-gray-400">{labour.region}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                  labour.status === 'Available' ? 'bg-green-100 text-green-800' :
                  labour.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {labour.status}
                </span>
              </td>
            </tr>
          ))}
          {filteredLabours.length === 0 && (
             <tr>
               <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                 No labours found matching "{globalSearchQuery}"
               </td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderJobPlacementsTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-4">Job Title</th>
            <th className="px-6 py-4">Company Name</th>
            <th className="px-6 py-4">Location</th>
            <th className="px-6 py-4">Required Exp</th>
            <th className="px-6 py-4">Compensation</th>
            <th className="px-6 py-4">Applications</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobPlacements.map((job) => (
            <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50/50">
              <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
              <td className="px-6 py-4 text-orange-600 font-bold">{job.company}</td>
              <td className="px-6 py-4 text-gray-500 text-xs">{job.location}</td>
              <td className="px-6 py-4 text-gray-600">{job.experienceRequired}</td>
              <td className="px-6 py-4 text-gray-800 font-mono font-bold text-xs">{job.salary}</td>
              <td className="px-6 py-4">
                <span className="bg-gray-100 text-gray-800 py-1 px-2 rounded font-bold text-xs">
                  {job.appliedCount} Applied
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                  job.status === 'Active' ? 'bg-green-100 text-green-800 animate-pulse' : 'bg-gray-100 text-gray-800'
                }`}>
                  {job.status}
                </span>
              </td>
            </tr>
          ))}
          {filteredJobPlacements.length === 0 && (
             <tr>
               <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                 No job vacancies found matching "{globalSearchQuery}"
               </td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderSubmissionsTable = () => {
    // Search and category filters
    const filtered = liveSubmissions.filter(sub => {
      const typeStr = (sub.type || '').toLowerCase();
      const statusStr = (sub.status || '').toLowerCase();
      const payload = sub.data || {};
      const name = (payload.fullName || payload.clientName || payload.name || payload.title || '').toLowerCase();
      const email = (payload.email || '').toLowerCase();
      const mobile = (payload.mobile || payload.clientPhone || '').toLowerCase();
      const city = (payload.city || payload.location || '').toLowerCase();
      
      const query = globalSearchQuery.toLowerCase();
      return typeStr.includes(query) || statusStr.includes(query) || name.includes(query) || email.includes(query) || mobile.includes(query) || city.includes(query);
    });

    const stats = {
      total: liveSubmissions.length,
      registrations: liveSubmissions.filter(s => s.type === 'registration').length,
      properties: liveSubmissions.filter(s => s.type === 'property').length,
      inquiries: liveSubmissions.filter(s => s.type === 'inquiry').length,
      serviceRequests: liveSubmissions.filter(s => s.type === 'service_request').length,
      bookings: liveSubmissions.filter(s => s.type === 'booking').length,
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Dynamic Database Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl shadow-sm text-white">
            <span className="block text-[10px] text-slate-300 font-extrabold uppercase tracking-wider">Total Records</span>
            <span className="text-2xl font-black">{stats.total}</span>
            <span className="block text-[9px] text-slate-400 mt-0.5">Synced live with Supabase</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-150">
            <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Users size={10} className="text-orange-500" /> Registrations
            </span>
            <span className="text-2xl font-black text-gray-800">{stats.registrations}</span>
            <span className="block text-[9px] text-gray-400 mt-0.5">Labours, Vendors, Architects</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-150">
            <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Building2 size={10} className="text-blue-500" /> Properties
            </span>
            <span className="text-2xl font-black text-gray-800">{stats.properties}</span>
            <span className="block text-[9px] text-gray-400 mt-0.5">Brokers & Builder uploads</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-150">
            <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Mail size={10} className="text-emerald-500" /> Inquiries
            </span>
            <span className="text-2xl font-black text-gray-800">{stats.inquiries}</span>
            <span className="block text-[9px] text-gray-400 mt-0.5">Contact forms & enqs</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-150">
            <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Layers size={10} className="text-purple-500" /> Service Reqs
            </span>
            <span className="text-2xl font-black text-gray-800">{stats.serviceRequests}</span>
            <span className="block text-[9px] text-gray-400 mt-0.5">Client works requested</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-150">
            <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Calendar size={10} className="text-amber-500" /> Bookings
            </span>
            <span className="text-2xl font-black text-gray-800">{stats.bookings}</span>
            <span className="block text-[9px] text-gray-400 mt-0.5">Labour & Yard orders</span>
          </div>
        </div>

        {/* Database Live View */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-150 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Database className="text-orange-600 animate-pulse" size={18} />
                Live Supabase Database Connection
              </h3>
              <p className="text-xs text-gray-500">
                Review, approve, or reject user profiles, contacts, inquiries, and service requests from your Supabase client.
              </p>
            </div>
            <button 
              onClick={fetchSubmissionsFromDb} 
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-lg transition-colors flex items-center gap-1.5"
            >
              <TrendingUp size={12} /> Sync Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-black text-gray-500 uppercase tracking-wider bg-gray-100/60 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Title / Name</th>
                  <th className="px-6 py-3">Contact Details</th>
                  <th className="px-6 py-3">Professional / Submission Details</th>
                  <th className="px-6 py-3">Created At</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((sub) => {
                  const payload = sub.data || {};
                  
                  // Extract fields correctly based on type
                  const name = payload.fullName || payload.clientName || payload.name || payload.title || 'N/A';
                  const email = payload.email || 'N/A';
                  const mobile = payload.mobile || payload.clientPhone || payload.phone || 'N/A';
                  const city = payload.city || payload.location || 'N/A';
                  const specialty = payload.category || payload.specialty || payload.serviceType || 'N/A';
                  const status = sub.status || payload.status || 'Pending';
                  
                  // Define badge styles
                  const typeColors: Record<string, string> = {
                    registration: 'bg-orange-50 text-orange-700 border-orange-100',
                    property: 'bg-blue-50 text-blue-700 border-blue-100',
                    inquiry: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                    service_request: 'bg-purple-50 text-purple-700 border-purple-100',
                    booking: 'bg-amber-50 text-amber-700 border-amber-100',
                  };

                  const typeColor = typeColors[sub.type] || 'bg-gray-50 text-gray-700 border-gray-100';

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider ${typeColor}`}>
                          <Layers size={10} />
                          {sub.type}
                        </span>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="font-extrabold text-slate-800 text-sm">{name}</div>
                        {payload.companyName && (
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mt-0.5">
                            🏢 {payload.companyName}
                          </div>
                        )}
                        {payload.gstNumber && (
                          <span className="inline-block mt-1 text-[9px] font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded">
                            GST: {payload.gstNumber}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-xs">
                        <div className="font-bold text-gray-700 flex items-center gap-1.5">
                          <Mail size={12} className="text-gray-400" /> {email}
                        </div>
                        <div className="text-gray-500 font-medium mt-1 flex items-center gap-1.5">
                          <Phone size={12} className="text-gray-400" /> {mobile}
                        </div>
                        <div className="text-slate-400 font-bold text-[10px] mt-1 uppercase tracking-wide">
                          📍 {city}
                        </div>
                      </td>
                      <td className="px-6 py-4.5 text-xs">
                        {sub.type === 'registration' && (
                          <div className="space-y-1 text-gray-600">
                            <div>Role Category: <span className="font-extrabold text-slate-700">{specialty}</span></div>
                            {payload.experience && <div>Experience: <span className="font-bold text-slate-700">{payload.experience}</span></div>}
                            {payload.charges && <div>Charges/Rate: <span className="font-bold text-orange-600 font-mono">{payload.charges}</span></div>}
                          </div>
                        )}
                        {sub.type === 'property' && (
                          <div className="space-y-1 text-gray-600">
                            <div>Category: <span className="font-extrabold text-slate-700 uppercase">{payload.type} for {payload.action}</span></div>
                            <div>Price Offered: <span className="font-extrabold text-emerald-600 font-mono">₹{payload.price} Lakhs</span></div>
                            <div>Area: <span className="font-bold text-slate-700">{payload.area} sqft</span> ({payload.expectedYield}% ROI)</div>
                          </div>
                        )}
                        {sub.type === 'inquiry' && (
                          <div className="space-y-1 text-gray-600">
                            <div className="font-bold text-indigo-600">Property Lead Inquiry</div>
                            <div>Property ID: <span className="font-mono bg-gray-50 px-1 py-0.5 text-slate-500">{payload.propertyId || 'N/A'}</span></div>
                            <div className="line-clamp-1 italic text-slate-400">"{payload.propertyTitle || 'N/A'}"</div>
                          </div>
                        )}
                        {sub.type === 'service_request' && (
                          <div className="space-y-1 text-gray-600">
                            <div>Service: <span className="font-extrabold text-slate-700">{specialty}</span></div>
                            {payload.description && <div className="line-clamp-2 italic text-slate-500">"{payload.description}"</div>}
                            <div>Budget: <span className="font-bold text-emerald-600 font-mono">₹{payload.budget}</span></div>
                          </div>
                        )}
                        {sub.type === 'booking' && (
                          <div className="space-y-1 text-gray-600">
                            <div>Booking Type: <span className="font-extrabold text-slate-700 uppercase">{payload.booking_type}</span></div>
                            {payload.workType && <div>Work Type: <span className="font-bold text-slate-700">{payload.workType}</span></div>}
                            {payload.reportingTime && <div>Time/Date: <span className="font-bold text-slate-700">{payload.reportingTime}</span></div>}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-[10px] text-gray-400 font-bold font-mono">
                        {sub.created_at ? new Date(sub.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                          status.toLowerCase().includes('approve') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          status.toLowerCase().includes('reject') ? 'bg-rose-50 text-rose-700 border-rose-100' :
                          'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            status.toLowerCase().includes('approve') ? 'bg-emerald-500' :
                            status.toLowerCase().includes('reject') ? 'bg-rose-500' :
                            'bg-amber-500 animate-pulse'
                          }`} />
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right whitespace-nowrap text-xs">
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => handleUpdateStatus(sub.id, sub.type, 'Approved', payload)}
                            title="Approve Profile / Document / Listing"
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors font-bold flex items-center gap-1"
                          >
                            <ShieldCheck size={14} /> Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(sub.id, sub.type, 'Rejected', payload)}
                            title="Reject Submission"
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors font-bold"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleDeleteSubmission(sub.id)}
                            title="Delete Permanently"
                            className="p-1.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      {loadingSubmissions ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs text-gray-500 font-bold">Synchronizing live records with Supabase...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 py-4">
                          <Database size={32} className="text-gray-300 mb-1" />
                          <div className="text-xs font-bold text-gray-500">No database submissions found matching your search.</div>
                          <div className="text-[10px] text-gray-400">Try registering or submitting a property listing, contact form or booking.</div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Admin Control Center</h2>
           <p className="text-gray-500 text-sm">Manage service requests, analytics and user database.</p>
        </div>
        
        {/* Top Navigation for Admin View */}
        <div className="flex flex-wrap gap-1 p-1 bg-gray-100 rounded-lg overflow-x-auto max-w-full">
          <button 
            onClick={() => setCurrentView('submissions')}
            className={`px-3 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${currentView === 'submissions' ? 'bg-orange-600 text-white shadow-md' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'}`}
          >
            <Database size={14} className={currentView === 'submissions' ? 'animate-pulse' : ''} /> Supabase Database
          </button>
          <button 
            onClick={() => setCurrentView('requests')}
            className={`px-3 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${currentView === 'requests' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Briefcase size={14} /> Requests
          </button>
          <button 
            onClick={() => setCurrentView('analytics')}
            className={`px-3 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${currentView === 'analytics' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <BarChart3 size={14} /> Analytics
          </button>
          <button 
            onClick={() => setCurrentView('vendors')}
            className={`px-3 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${currentView === 'vendors' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Hammer size={14} /> Vendors
          </button>
          <button 
            onClick={() => setCurrentView('clients')}
            className={`px-3 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${currentView === 'clients' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Users size={14} /> Clients
          </button>
          <button 
            onClick={() => setCurrentView('labours')}
            className={`px-3 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${currentView === 'labours' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Users size={14} /> Labours
          </button>
          <button 
            onClick={() => setCurrentView('jobPlacement')}
            className={`px-3 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${currentView === 'jobPlacement' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Briefcase size={14} /> Job Placement
          </button>
        </div>
      </div>

      {/* Search and Filters Sub-header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${currentView === 'submissions' ? 'all Supabase records' : currentView === 'requests' ? 'requests' : currentView === 'jobPlacement' ? 'jobs' : currentView} by name, trade, email or location...`} 
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-all text-sm"
            />
            {globalSearchQuery && (
              <button 
                onClick={() => setGlobalSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {currentView === 'vendors' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
               <Filter size={16} className="text-gray-400 hidden sm:block" />
               <select 
                 value={specialtyFilter}
                 onChange={(e) => setSpecialtyFilter(e.target.value)}
                 className="w-full sm:w-48 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
               >
                 <option value="All">All Specialties</option>
                 {Object.values(ServiceType).map(type => (
                   <option key={type} value={type}>{type}</option>
                 ))}
               </select>
            </div>
          )}
        </div>

        {currentView === 'requests' && (
          <div className="flex gap-2">
            {['All', 'Pending', 'In Progress'].map((f) => (
               <button
                 key={f}
                 onClick={() => setFilter(f as any)}
                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                   filter === f ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                 }`}
               >
                 {f}
               </button>
            ))}
          </div>
        )}
      </div>

      {currentView === 'submissions' && renderSubmissionsTable()}
      {currentView === 'requests' && renderRequestsTable()}
      {currentView === 'analytics' && renderAnalytics()}
      {currentView === 'vendors' && renderVendorsTable()}
      {currentView === 'clients' && renderClientsTable()}
      {currentView === 'labours' && renderLaboursTable()}
      {currentView === 'jobPlacement' && renderJobPlacementsTable()}

      {/* Click outside listener for dropdown */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-10 bg-transparent"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};

export default AdminPanel;