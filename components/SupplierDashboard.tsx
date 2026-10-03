import React, { useState, useEffect } from 'react';
import { fetchAllBookings, saveBooking } from '../services/supabase';
import { 
  Package, 
  TrendingUp, 
  ShoppingBag, 
  FileText, 
  Truck, 
  MapPin, 
  DollarSign, 
  Plus, 
  Trash2, 
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Zap,
  Calendar,
  Users,
  ShieldCheck
} from 'lucide-react';

interface MaterialItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  availableStock: string;
  category: string;
}

export default function SupplierDashboard() {
  const [materials, setMaterials] = useState<MaterialItem[]>([
    { id: 'mat-1', name: 'UltraTech OPC Cement 53 Grade', unit: 'Bag (50kg)', price: 410, availableStock: '1,200 Bags', category: 'Cement' },
    { id: 'mat-2', name: 'Tata Tiscon Fe 550D TMT Steel', unit: 'Metric Ton (MT)', price: 68000, availableStock: '45 Tons', category: 'Steel' },
    { id: 'mat-3', name: 'Premium River Sand (Clean washed)', unit: 'Brass', price: 6500, availableStock: '180 Brass', category: 'Aggregates' },
    { id: 'mat-4', name: 'Red Clay Bricks (Class I)', unit: '1,000 Pcs', price: 7500, availableStock: '40,000 Pcs', category: 'Bricks' },
    { id: 'mat-5', name: 'AAC Lightweight Blocks (600x200x150)', unit: 'Cubic Meter (CUM)', price: 3800, availableStock: '250 CUM', category: 'Blocks' }
  ]);

  const [orders, setOrders] = useState([
    { id: 'ORD-9021', client: 'Kamla Real Estate developers', material: 'TMT Steel TMT Fe 550D', qty: '12 Metric Tons', status: 'Quote Submitted', value: '₹8,16,000', date: 'Today' },
    { id: 'ORD-9022', client: 'Sharma Contractors', material: 'OPC Cement 53 Grade', qty: '400 Bags', status: 'Pending Quote', value: 'Estimating...', date: 'Today' },
    { id: 'ORD-9023', client: 'Local Homeowner (A. K. Mehta)', material: 'AAC Blocks & Sand', qty: '30 CUM + 5 Brass', status: 'Inbound Inquiry', value: 'Estimating...', date: 'Yesterday' }
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Cement');
  const [newItemUnit, setNewItemUnit] = useState('Bag');
  const [newItemPrice, setNewItemPrice] = useState<number>(100);
  const [newItemStock, setNewItemStock] = useState('500 Units');

  const [showAddForm, setShowAddForm] = useState(false);

  // Instant Labour Booking Hub states
  const initialLabourers = [
    { id: 'lab-1', name: 'Ramesh Pujari', specialization: 'Heavy Loader (Cement/Steel)', rating: '4.9', location: 'Turbhe MIDC', distance: '0.8 km', experience: '4 yrs', completedOrders: 182, rate: '₹550 / day' },
    { id: 'lab-2', name: 'Sunil Yadav', specialization: 'Brick Stacker & Sand Shoveler', rating: '4.8', location: 'Turbhe Yard', distance: '1.2 km', experience: '3 yrs', completedOrders: 145, rate: '₹500 / day' },
    { id: 'lab-3', name: 'Amit Verma', specialization: 'General Helper', rating: '4.7', location: 'Vashi Station', distance: '3.5 km', experience: '2 yrs', completedOrders: 92, rate: '₹485 / day' },
    { id: 'lab-4', name: 'Dinesh Kadam', specialization: 'Cement Bag Specialist', rating: '4.9', location: 'Turbhe Naka', distance: '1.5 km', experience: '5 yrs', completedOrders: 210, rate: '₹520 / day' }
  ];

  const [selectedLabourId, setSelectedLabourId] = useState<string>('lab-1');
  const [helpersCount, setHelpersCount] = useState<number>(2);
  const [workType, setWorkType] = useState<string>('Cement Loading');
  const [reportingTime, setReportingTime] = useState<string>('Immediate (Within 1 Hour)');
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState<string>('');
  
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

  // Save/upsert bookings to Supabase on change
  useEffect(() => {
    localStorage.setItem('construction_mart_supplier_bookings', JSON.stringify(supplierBookings));
    
    const syncToSupabase = async () => {
      for (const booking of supplierBookings) {
        await saveBooking(booking.id, 'supplier', booking.status, booking);
      }
    };
    syncToSupabase();
  }, [supplierBookings]);

  const selectedLabour = initialLabourers.find(l => l.id === selectedLabourId);

  const handleBookLabour = () => {
    const chosen = initialLabourers.find(l => l.id === selectedLabourId);
    if (!chosen) return;
    
    const cost = parseInt(chosen.rate.replace(/[^0-9]/g, '')) * helpersCount;
    const newBooking = {
      id: `b-${Date.now()}`,
      name: chosen.name,
      workType: workType,
      helpersCount: helpersCount,
      reportingTime: reportingTime,
      cost: cost,
      status: 'Pending Confirmation'
    };
    
    setSupplierBookings([newBooking, ...supplierBookings]);
    setBookingSuccessMessage(`⚡ Success! Booking alert sent to ${chosen.name} via WhatsApp. They will report in ${reportingTime}.`);
    
    setTimeout(() => {
      setBookingSuccessMessage('');
    }, 6000);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: MaterialItem = {
      id: `mat-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      unit: newItemUnit,
      price: newItemPrice,
      availableStock: newItemStock,
    };

    setMaterials([...materials, newItem]);
    setNewItemName('');
    setNewItemStock('500 Units');
    setShowAddForm(false);
  };

  const handleRemoveItem = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const handleAcceptOrder = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'Quote Submitted', value: '₹' + (o.qty.includes('Bags') ? '1,64,000' : '2,15,000') } : o));
    alert('Material quote offer sent directly to developer via ConSmart material desk.');
  };

  return (
    <div className="space-y-6">
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Products Listed</span>
            <h4 className="text-2xl font-black text-gray-800 mt-1">{materials.length} Items</h4>
            <p className="text-[10px] text-green-600 font-bold mt-1">● Active on Marketplace</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Package size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Inbound Quote Inquiries</span>
            <h4 className="text-2xl font-black text-gray-800 mt-1">
              {orders.filter(o => o.status === 'Pending Quote' || o.status === 'Inbound Inquiry').length} Pending
            </h4>
            <p className="text-[10px] text-orange-600 font-bold mt-1">Action required soon</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Sales Inquiries</span>
            <h4 className="text-2xl font-black text-gray-800 mt-1">₹8.16 Lakhs</h4>
            <p className="text-[10px] text-green-600 font-bold mt-1">Quote success conversion: 84%</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Logistics Dispatch Fleet</span>
            <h4 className="text-2xl font-black text-gray-800 mt-1">Ready</h4>
            <p className="text-[10px] text-gray-500 mt-1">Mumbai-wide delivery active</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Truck size={22} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Material Inventory Management Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Instant Labour Booking Hub Section */}
          <div id="instant-labour-booking-hub" className="bg-gradient-to-br from-orange-50/60 via-white to-amber-50/40 p-6 rounded-2xl border border-orange-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500 text-white rounded-xl shadow-md shadow-orange-100">
                  <Zap size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    ⚡ Instant Yard Labour (Labour Naka) Booking Hub
                    <span className="bg-orange-100 text-orange-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Direct & Verified</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Book certified heavy loaders and stacking helpers for material dispatch, yard loading, and deliveries.</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Coordinated via</span>
                <span className="text-xs font-black text-green-600 flex items-center gap-1 justify-end">💬 WhatsApp Alerts</span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Available Laborers List */}
              <div className="xl:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    👥 Available Loaders near Turbhe MIDC
                  </span>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">4 Workers Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {initialLabourers.map((labour) => {
                    const isSelected = selectedLabourId === labour.id;
                    return (
                      <div 
                        key={labour.id}
                        onClick={() => setSelectedLabourId(labour.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                            : 'bg-white text-gray-800 border-gray-150 hover:border-orange-355 hover:bg-orange-50/10'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-black tracking-tight">{labour.name}</h4>
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded mt-1 inline-block uppercase ${
                                isSelected ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-700 border border-orange-100'
                              }`}>
                                {labour.specialization}
                              </span>
                            </div>
                            <span className="text-[10px] font-black text-amber-500 flex items-center gap-0.5">
                              ⭐ {labour.rating}
                            </span>
                          </div>

                          <div className="mt-4 space-y-1.5 text-[11px]">
                            <div className={`flex items-center gap-1.5 ${isSelected ? 'text-slate-300' : 'text-gray-500'}`}>
                              <MapPin size={12} className="text-orange-500 shrink-0" />
                              <span>{labour.location} ({labour.distance})</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${isSelected ? 'text-slate-300' : 'text-gray-500'}`}>
                              <Clock size={12} className="text-orange-500 shrink-0" />
                              <span>Experience: {labour.experience}</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${isSelected ? 'text-slate-300' : 'text-gray-500'}`}>
                              <ShieldCheck size={12} className="text-green-500 shrink-0" />
                              <span>Verified: {labour.completedOrders} orders</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-dashed border-gray-150 flex justify-between items-center">
                          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Daily Rate</span>
                          <span className={`text-xs font-black ${isSelected ? 'text-orange-400' : 'text-slate-900'}`}>{labour.rate}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Booking Config / Quick Checkout */}
              <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-1.5">
                    <Calendar size={14} className="text-orange-500" />
                    Configure Booking
                  </h4>

                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Labour Selected</label>
                      <div className="p-3 bg-slate-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 flex items-center justify-between">
                        <span>{selectedLabour ? selectedLabour.name : 'Choose a worker on the left'}</span>
                        {selectedLabour && (
                          <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">{selectedLabour.specialization}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Shift / Work Type</label>
                      <select 
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value)}
                        className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      >
                        <option value="Cement Loading">Cement Loading & Stacking</option>
                        <option value="Sand Shoveling">Sand Shoveling & Filling</option>
                        <option value="Steel Loading">Steel Rebar Handling</option>
                        <option value="Brick Stacking">Clay Brick Stacking</option>
                        <option value="General Stacking">General Yard Helper shift</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Helpers Required</label>
                        <input 
                          type="number" 
                          min="1"
                          max="10"
                          value={helpersCount}
                          onChange={(e) => setHelpersCount(Math.max(1, Number(e.target.value)))}
                          className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Reporting Time</label>
                        <select 
                          value={reportingTime}
                          onChange={(e) => setReportingTime(e.target.value)}
                          className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        >
                          <option value="Immediate (Within 1 Hour)">Immediate (1 Hr)</option>
                          <option value="Today (2:00 PM)">Today (2 PM)</option>
                          <option value="Tomorrow (Morning 8:00 AM)">Tomorrow (8 AM)</option>
                          <option value="Night shift (8:00 PM)">Night shift (8 PM)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500 font-medium">Est. Subtotal:</span>
                    <span className="text-sm font-black text-slate-900">
                      ₹{selectedLabour ? (parseInt(selectedLabour.rate.replace(/[^0-9]/g, '')) * helpersCount).toLocaleString('en-IN') : '0'}
                    </span>
                  </div>

                  {bookingSuccessMessage ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-2.5 rounded-lg text-xs font-bold text-center animate-in fade-in zoom-in-95 duration-200">
                      {bookingSuccessMessage}
                    </div>
                  ) : (
                    <button 
                      onClick={handleBookLabour}
                      disabled={!selectedLabourId}
                      className={`w-full py-2.5 rounded-lg font-black text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                        selectedLabourId 
                          ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-100' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Zap size={14} />
                      Book & Notify via WhatsApp
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Current Bookings History */}
            {supplierBookings.length > 0 && (
              <div className="pt-4 border-t border-orange-100">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Users size={14} className="text-orange-500" />
                  Active Yard Bookings ({supplierBookings.length})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                        <th className="pb-2">Worker</th>
                        <th className="pb-2">Work Type</th>
                        <th className="pb-2">Helpers</th>
                        <th className="pb-2">Reporting</th>
                        <th className="pb-2">Est. Cost</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {supplierBookings.map((booking) => (
                        <tr key={booking.id} className="text-gray-700 font-bold">
                          <td className="py-2.5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            {booking.name}
                          </td>
                          <td className="py-2.5 text-gray-500">{booking.workType}</td>
                          <td className="py-2.5">{booking.helpersCount} helpers</td>
                          <td className="py-2.5 text-orange-600">{booking.reportingTime}</td>
                          <td className="py-2.5 font-mono">₹{booking.cost.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 text-right">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                              booking.status === 'Confirmed' || booking.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <Package size={18} className="text-orange-500" />
                  Your Active Material Pricing Catalog
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Control wholesale prices visible to ConSmart construction managers.</p>
              </div>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddItem} className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-3">
                <h4 className="text-xs font-bold text-orange-950">Add New Materials / Tools to Inventory</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Material Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Birla Super Cement (A1)" 
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Category</label>
                    <select 
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
                    >
                      <option>Cement</option>
                      <option>Steel</option>
                      <option>Aggregates</option>
                      <option>Bricks</option>
                      <option>Blocks</option>
                      <option>Tools & Equipment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Measurement Unit</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bag (50kg), Metric Ton, Brass" 
                      value={newItemUnit}
                      onChange={(e) => setNewItemUnit(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Wholesale Unit Price (₹)</label>
                    <input 
                      type="number" 
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Stock Quantity Available</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 1,500 Bags, 80 Tons" 
                      value={newItemStock}
                      onChange={(e) => setNewItemStock(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="text-xs font-semibold px-3 py-1.5 text-gray-600 hover:bg-gray-150 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-lg"
                  >
                    Publish to Catalog
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {materials.map((mat) => (
                <div key={mat.id} className="bg-slate-50 hover:bg-white p-4 rounded-xl border border-gray-150 flex justify-between items-center transition-all">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/50">
                        {mat.category}
                      </span>
                      <h4 className="text-sm font-bold text-gray-800">{mat.name}</h4>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-3">
                      <span>Available: <span className="font-semibold text-gray-700">{mat.availableStock}</span></span>
                      <span>Unit: <span className="font-semibold text-gray-700">{mat.unit}</span></span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-gray-400">Wholesale Rate</span>
                      <p className="text-sm font-black text-orange-600">₹{mat.price.toLocaleString('en-IN')}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(mat.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Material Inquiries Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <ShoppingBag size={18} className="text-orange-500" />
                Active Order Inquiries
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Submit quotes directly to projects looking for materials.</p>
            </div>

            <div className="space-y-3.5">
              {orders.map((order) => (
                <div key={order.id} className="p-4 rounded-xl border border-gray-150 bg-gray-50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">{order.id}</span>
                      <h4 className="text-xs font-black text-gray-800 mt-1">{order.client}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.status === 'Quote Submitted' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Requested: <span className="font-bold text-gray-800">{order.material}</span></p>
                    <p>Volume / Quantity: <span className="font-bold text-gray-800">{order.qty}</span></p>
                    <p className="text-[10px] text-gray-400">Date Received: {order.date}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-[11px] font-bold text-gray-700">
                      Value: <span className="text-orange-600">{order.value}</span>
                    </div>
                    {order.status !== 'Quote Submitted' && (
                      <button 
                        onClick={() => handleAcceptOrder(order.id)}
                        className="text-[11px] font-bold text-white bg-slate-900 hover:bg-black px-3 py-1 rounded transition-colors flex items-center gap-1"
                      >
                        Submit Quote <ArrowUpRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
