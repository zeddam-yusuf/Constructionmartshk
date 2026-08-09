import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Users, 
  Calendar, 
  Clock, 
  Moon, 
  Loader2, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  PhoneCall, 
  MapPin, 
  DollarSign, 
  MousePointerClick,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2
} from 'lucide-react';
import { UserRole } from '../types';
import { fetchAllBookings, saveBooking, removeBooking } from '../services/supabase';

interface HourlyBooking {
  id: string;
  laborType: string;
  count: number;
  timeSlot: '1_day_before' | '2nd_half_of_day' | 'night_work';
  status: 'broadcasting' | 'confirmed_by_labor' | 'finalized';
  wage?: string;
  location?: string;
  labourWhoConfirmed?: string;
  phone?: string;
  rating?: number;
  timestamp: string;
}

interface InstantLaboursSectionProps {
  currentRole: UserRole;
}

export const InstantLaboursSection: React.FC<InstantLaboursSectionProps> = ({ currentRole }) => {
  const [instantLaborType, setInstantLaborType] = useState('Carpenter Team (Part A)');
  const [instantCount, setInstantCount] = useState(3);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'1_day_before' | '2nd_half_of_day' | 'night_work'>('1_day_before');
  const [offeredWage, setOfferedWage] = useState('₹850/day');
  const [jobLocation, setJobLocation] = useState('Mumbai Metro');
  const [isExpanded, setIsExpanded] = useState(true);

  // List of bookings (persisted in local state & Supabase)
  const [bookings, setBookings] = useState<HourlyBooking[]>([
    {
      id: 'B-8492',
      laborType: 'Fitter Crew (Part A)',
      count: 4,
      timeSlot: 'night_work',
      status: 'finalized',
      wage: '₹950/day',
      location: 'Noida Sector 62',
      labourWhoConfirmed: 'Devendra Patil (Contractor Representative)',
      phone: '+91 94220 88910',
      rating: 4.9,
      timestamp: 'Today, 2:30 PM'
    },
    {
      id: 'B-8910',
      laborType: 'Slab Mason Team',
      count: 3,
      timeSlot: '1_day_before',
      status: 'confirmed_by_labor',
      wage: '₹900/day',
      location: 'Andheri East, Mumbai',
      labourWhoConfirmed: 'Ramchandra Kharat & Heavy Team',
      phone: '+91 98334 71209',
      rating: 4.8,
      timestamp: 'Today, 11:15 AM'
    }
  ]);

  const [activeBooking, setActiveBooking] = useState<HourlyBooking | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

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

  // Auto response timer to simulate labor acceptance
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (activeBooking && activeBooking.status === 'broadcasting') {
      timeout = setTimeout(() => {
        const confirmedName = getRandomLabourName(activeBooking.laborType);
        const phoneNum = '+91 98334 ' + Math.floor(10000 + Math.random() * 90000);
        const ratingVal = parseFloat((4.5 + Math.random() * 0.5).toFixed(1));

        setBookings(prev => 
          prev.map(b => {
            if (b.id === activeBooking.id) {
              return {
                ...b,
                status: 'confirmed_by_labor',
                labourWhoConfirmed: confirmedName,
                phone: phoneNum,
                rating: ratingVal
              };
            }
            return b;
          })
        );
        setActiveBooking(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: 'confirmed_by_labor',
            labourWhoConfirmed: confirmedName,
            phone: phoneNum,
            rating: ratingVal
          };
        });
        showFeedback('⚡ Local labour team has accepted your shift broadcast! Please review & finalize booking.', 'info');
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [activeBooking?.status]);

  const getRandomLabourName = (type: string) => {
    const firstNames = ['Ramchandra', 'Sanjay', 'Satish', 'Jagdish', 'Bhagwan', 'Santosh', 'Surendra', 'Kishore'];
    const lastNames = ['Kharat', 'Mhatre', 'Rathod', 'Chavan', 'Waghela', 'Shinde', 'Solanki', 'Paswan'];
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${fn} ${ln} & Heavy Team (${type.split(' ')[0]})`;
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
      wage: offeredWage,
      location: jobLocation,
      status: 'broadcasting',
      timestamp: 'Just now'
    };
    
    setBookings(prev => [newBk, ...prev]);
    setActiveBooking(newBk);
    showFeedback(`Your instant labour request ${newId} (${instantCount} ${instantLaborType}) has been broadcasted successfully!`, 'success');
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
    showFeedback('Booking finalized! Direct contact details are unlocked for supervisor coordination.', 'success');
  };

  const handleDeleteBooking = async (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    if (activeBooking?.id === bookingId) {
      setActiveBooking(null);
    }
    await removeBooking(bookingId);
    showFeedback('Instant labour request removed.', 'info');
  };

  return (
    <div className="bg-white rounded-2xl border border-red-200 shadow-md shadow-red-50/50 overflow-hidden my-6">
      {/* SECTION HEADER BAR */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-inner">
            <Zap className="text-yellow-300 animate-bounce" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">Instant Labours Section</h3>
              <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                {currentRole === UserRole.CLIENT ? 'Developer Access' : 'Vendor Access'}
              </span>
            </div>
            <p className="text-xs text-red-100 opacity-90 mt-0.5">
              On-demand workforce shift booking with real-time local technician dispatch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
            <Loader2 className="animate-spin text-yellow-300" size={12} />
            <span className="text-yellow-200">10 Local Views Active</span>
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            title={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-6">
          {feedbackMsg && (
            <div className={`p-4 rounded-xl flex items-center justify-between border ${
              feedbackMsg.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-blue-50 border-blue-200 text-blue-800'
            } animate-in slide-in-from-top-2`}>
              <div className="flex items-center gap-2.5 text-xs font-bold">
                {feedbackMsg.type === 'success' ? <CheckCircle2 size={18} className="text-green-600 shrink-0" /> : <Info size={18} className="text-blue-600 shrink-0" />}
                {feedbackMsg.text}
              </div>
              <button onClick={() => setFeedbackMsg(null)} className="text-xs font-bold text-gray-400 hover:text-gray-600">Dismiss</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* BOOKING FORM COLUMN */}
            <div className="lg:col-span-5 bg-gray-50/80 p-5 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <MousePointerClick size={15} className="text-red-600" />
                  Post New On-Demand Labour Shift
                </h4>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                  Instant Match
                </span>
              </div>

              <form onSubmit={handleInstantBook} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                    Select Work Force Category *
                  </label>
                  <select 
                    value={instantLaborType}
                    onChange={(e) => setInstantLaborType(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  >
                    <optgroup label="--- Structure & Concrete ---">
                      <option>Carpenter Team (Part A)</option>
                      <option>Fitter Crew (Part A)</option>
                      <option>Concrete Casting Squad (Part A)</option>
                      <option>Slab Mason Team</option>
                      <option>Blockwork/Brickwork Crew (Part A)</option>
                      <option>Steel Fabricators (Part A)</option>
                      <option>Scaffolding Riggers (Part A)</option>
                    </optgroup>
                    
                    <optgroup label="--- Finishes & MEP ---">
                      <option>Plaster Specialists (Part A)</option>
                      <option>Tiles & Marble Installers (Part A)</option>
                      <option>Electrician Shift (Part A)</option>
                      <option>Plumbing Experts (Part A)</option>
                      <option>POP Artisans (Part A)</option>
                      <option>Painter Teams (Part B)</option>
                      <option>Waterproofing Crew (Part A)</option>
                    </optgroup>

                    <optgroup label="--- Interior & Utility ---">
                      <option>Block work (Interior)</option>
                      <option>Tile/Marble fixing (Interior)</option>
                      <option>Plumbing (Interior)</option>
                      <option>POP & False ceiling (Interior)</option>
                      <option>Furniture & Modular Kitchen (Interior)</option>
                    </optgroup>

                    <optgroup label="--- General & Helpers ---">
                      <option>General Labour Helper Squad</option>
                      <option>Debris Disposal Crew (Part A)</option>
                      <option>Demolition Services (Part B)</option>
                    </optgroup>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                      Worker Count *
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden">
                      <button 
                        type="button" 
                        onClick={() => setInstantCount(Math.max(1, instantCount - 1))}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                      >
                        -
                      </button>
                      <input 
                        type="number"
                        min="1"
                        max="50"
                        value={instantCount}
                        onChange={(e) => setInstantCount(parseInt(e.target.value) || 1)}
                        className="w-full text-center py-2 text-xs font-black text-gray-800 outline-none"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setInstantCount(Math.min(50, instantCount + 1))}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                      Offered Wage Rate
                    </label>
                    <input 
                      type="text"
                      value={offeredWage}
                      onChange={(e) => setOfferedWage(e.target.value)}
                      placeholder="e.g. ₹850/day"
                      className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                    Job Location / City
                  </label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text"
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      placeholder="e.g. Mumbai, Noida, Bengaluru"
                      className="w-full bg-white border border-gray-300 pl-8 pr-3 py-2 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">
                    Select Preferred Dispatch Schedule
                  </label>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTimeSlot('1_day_before')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                        selectedTimeSlot === '1_day_before'
                          ? 'bg-rose-50 border-rose-400 text-rose-800 font-extrabold ring-1 ring-rose-300'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Calendar size={15} />
                      <span className="text-[9px] text-center uppercase tracking-tight block font-bold leading-tight">
                        1 Day Before (Tomorrow)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTimeSlot('2nd_half_of_day')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                        selectedTimeSlot === '2nd_half_of_day'
                          ? 'bg-rose-50 border-rose-400 text-rose-800 font-extrabold ring-1 ring-rose-300'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Clock size={15} />
                      <span className="text-[9px] text-center uppercase tracking-tight block font-bold leading-tight">
                        2nd Half (Afternoon)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTimeSlot('night_work')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                        selectedTimeSlot === 'night_work'
                          ? 'bg-rose-50 border-rose-400 text-rose-800 font-extrabold ring-1 ring-rose-300'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Moon size={15} />
                      <span className="text-[9px] text-center uppercase tracking-tight block font-bold leading-tight">
                        Night Shift Work
                      </span>
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black py-3.5 rounded-xl shadow-md hover:shadow-red-200 transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  <Zap size={16} className="text-yellow-300" />
                  Broadcast Instant Labour Shift
                </button>
              </form>
            </div>

            {/* LIVE BROADCAST STATUS DASHBOARD */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-150">
                <span className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping shrink-0" />
                  Your Active Shift Requests
                </span>
                <span className="text-[10px] bg-red-50 text-red-700 border border-red-150 font-black px-2.5 py-0.5 rounded-full">
                  {bookings.length} Shifts Live
                </span>
              </div>

              {bookings.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center space-y-2">
                  <AlertCircle size={32} className="text-gray-300" />
                  <p className="text-sm font-bold text-gray-600">No active shift requests</p>
                  <p className="text-xs text-gray-400">Fill the instant request form on the left to broadcast to local worker crews.</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                  {bookings.map((bk) => {
                    const isSelected = activeBooking?.id === bk.id;
                    return (
                      <div 
                        key={bk.id} 
                        className={`p-4 rounded-xl border transition-all ${
                          isSelected 
                            ? 'bg-red-50/30 border-red-300 shadow ring-2 ring-red-100' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveBooking(bk)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                {bk.id}
                              </span>
                              <h5 className="font-black text-sm text-gray-900">{bk.laborType}</h5>
                              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                {bk.count} {bk.count === 1 ? 'Worker' : 'Workers'}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mt-1.5 flex-wrap">
                              <span>Rate: <strong className="text-green-700 font-bold">{bk.wage || 'Standard'}</strong></span>
                              <span>•</span>
                              <span>Location: <strong className="text-gray-700 font-bold">{bk.location || 'Mumbai Metro'}</strong></span>
                            </div>
                          </div>
                          
                          <div className="self-start sm:self-auto uppercase tracking-wider text-[10px] font-black">
                            {bk.status === 'broadcasting' && (
                              <span className="text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                                <Loader2 className="animate-spin" size={10} />
                                Live Broadcast
                              </span>
                            )}
                            {bk.status === 'confirmed_by_labor' && (
                              <span className="text-indigo-700 bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1 animate-bounce">
                                <UserCheck size={10} />
                                Labour Confirmed
                              </span>
                            )}
                            {bk.status === 'finalized' && (
                              <span className="text-green-700 bg-green-100 border border-green-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                                <CheckCircle2 size={10} />
                                Finalized & Locked
                              </span>
                            )}
                          </div>
                        </div>

                        {/* DETAILS & ACTION BUTTONS */}
                        <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            {bk.labourWhoConfirmed ? (
                              <div className="text-xs">
                                <p className="font-black text-gray-800 flex items-center gap-1.5">
                                  <Users size={12} className="text-indigo-600" />
                                  Confirmed Crew: <span className="text-indigo-700">{bk.labourWhoConfirmed}</span>
                                  {bk.rating && <span className="text-orange-500 font-bold">⭐ {bk.rating}</span>}
                                </p>
                                {bk.status === 'finalized' && bk.phone && (
                                  <p className="text-xs text-green-700 font-extrabold flex items-center gap-1.5 mt-1">
                                    <PhoneCall size={12} />
                                    Contact Representative: {bk.phone}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
                                <Loader2 size={11} className="animate-spin" />
                                Dispatched to 10 local workers. Waiting for crew acceptance...
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            {bk.status === 'confirmed_by_labor' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  finalizeBooking(bk.id);
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-xs font-black shadow-sm transition-all flex items-center gap-1"
                              >
                                <CheckCircle2 size={13} />
                                Finalize & Contact
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBooking(bk.id);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete shift request"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
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
