import React from 'react';
import { UserRole, Project, MonthlyStat, PaymentStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { IndianRupee, Briefcase, CheckCircle, Users, Activity, Wallet } from 'lucide-react';

interface DashboardProps {
  role: UserRole;
  projects: Project[];
}

// Mock Data for Charts
const dataClient: MonthlyStat[] = [
  { name: 'Jan', value: 2000 },
  { name: 'Feb', value: 4500 },
  { name: 'Mar', value: 1200 },
  { name: 'Apr', value: 8000 },
  { name: 'May', value: 3000 },
  { name: 'Jun', value: 5500 },
];

const dataVendor: MonthlyStat[] = [
  { name: 'Jan', value: 5000 },
  { name: 'Feb', value: 7200 },
  { name: 'Mar', value: 4000 },
  { name: 'Apr', value: 12000 },
  { name: 'May', value: 8500 },
  { name: 'Jun', value: 9000 },
];

const dataChannelPartner: MonthlyStat[] = [
  { name: 'Jan', value: 800 },
  { name: 'Feb', value: 1500 },
  { name: 'Mar', value: 1200 },
  { name: 'Apr', value: 2500 },
  { name: 'May', value: 1800 },
  { name: 'Jun', value: 2200 },
];

const Dashboard: React.FC<DashboardProps> = ({ role, projects }) => {
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  
  // Calculate specific totals based on role and Payment Status
  let totalMoney = 0;
  let chartData: MonthlyStat[] = [];
  let moneyLabel = '';
  let subText = '';

  if (role === UserRole.CLIENT) {
    // Client sees total spent (Full Budget)
    totalMoney = projects
      .filter(p => p.paymentStatus === PaymentStatus.PAID)
      .reduce((acc, curr) => acc + curr.budget, 0); 
    chartData = dataClient;
    moneyLabel = 'Total Spent';
    subText = 'Successfully processed payments';
  } else if (role === UserRole.VENDOR) {
    // Vendor sees 90% of budget (10% fee deducted)
    totalMoney = projects
      .filter(p => p.paymentStatus === PaymentStatus.PAID)
      .reduce((acc, curr) => acc + (curr.budget * 0.9), 0);
    chartData = dataVendor;
    moneyLabel = 'Total Earnings';
    subText = 'After 10% platform fee deduction';
  } else {
    // Channel Partner/Platform sees the 10% fee revenue
    totalMoney = projects
      .filter(p => p.paymentStatus === PaymentStatus.PAID)
      .reduce((acc, curr) => acc + (curr.budget * 0.1), 0);
    chartData = dataChannelPartner;
    moneyLabel = 'Total Commission';
    subText = '10% brokerage fees collected';
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Projects Completed</p>
            <h3 className="text-2xl font-bold text-gray-800">{completedProjects}</h3>
          </div>
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <CheckCircle size={24} />
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">{role === UserRole.CHANNEL_PARTNER ? 'Matches Active' : 'Active Projects'}</p>
            <h3 className="text-2xl font-bold text-gray-800">{activeProjects}</h3>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Briefcase size={24} />
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">{moneyLabel}</p>
            <h3 className="text-2xl font-bold text-gray-800">₹{totalMoney.toLocaleString()}</h3>
            <p className="text-xs text-gray-400 mt-1">{subText}</p>
          </div>
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
            <IndianRupee size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Financial Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {role === UserRole.CLIENT ? (
                 <BarChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} />
                 <YAxis axisLine={false} tickLine={false} />
                 <Tooltip cursor={{ fill: '#f3f4f6' }} />
                 <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
               </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Work History / Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {projects.slice(0, 4).map((project) => (
              <div key={project.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className={`mt-1 w-2 h-2 rounded-full ${
                  project.status === 'Completed' ? 'bg-green-500' : 
                  project.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-gray-800">{project.title}</h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        project.paymentStatus === PaymentStatus.PAID ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                        {project.paymentStatus === PaymentStatus.PAID ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{project.status} • {project.date}</p>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-gray-400">No recent activity.</p>}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
            View All History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;