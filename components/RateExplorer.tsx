import React, { useState, useMemo } from 'react';
import { ActivityRate, MaterialRate, ServiceType } from '../types';
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  Info, 
  Activity, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  Grid,
  Droplet,
  Palette,
  FlaskConical,
  Settings,
  Truck,
  Hammer,
  Briefcase
} from 'lucide-react';

interface RateExplorerProps {
  activityRates: ActivityRate[];
  materialRates: MaterialRate[];
}

const RateExplorer: React.FC<RateExplorerProps> = ({ activityRates, materialRates }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'activities' | 'materials'>('activities');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const regions = useMemo(() => {
    const allRegions = [
      ...activityRates.map(r => r.region),
      ...materialRates.map(r => r.region)
    ];
    return ['All', ...Array.from(new Set(allRegions))];
  }, [activityRates, materialRates]);

  const categories = [
    'All',
    'Basic Materials & Civil',
    'Flooring',
    'Plumbing',
    'Wall Decor',
    'Chemicals',
    'Machineries',
    'Construction Vehicles'
  ];

  const getCategory = (itemName: string): string => {
    const lower = itemName.toLowerCase();
    if (lower.includes('tile') || lower.includes('marble') || lower.includes('flooring') || lower.includes('granite') || lower.includes('parquet')) {
      return 'Flooring';
    }
    if (lower.includes('plumb') || lower.includes('pipe') || lower.includes('drain') || lower.includes('valve') || lower.includes('basin') || lower.includes('fittings') || lower.includes('sewer')) {
      return 'Plumbing';
    }
    if (lower.includes('wall') || lower.includes('paint') || lower.includes('decor') || lower.includes('ceiling') || lower.includes('pop ') || lower.includes('gypsum') || lower.includes('plaster') || lower.includes('emulsion')) {
      return 'Wall Decor';
    }
    if (lower.includes('chemical') || lower.includes('waterproof') || lower.includes('grout') || lower.includes('resin') || lower.includes('epoxy') || lower.includes('admixture') || lower.includes('adjuvant') || lower.includes('damp')) {
      return 'Chemicals';
    }
    if (lower.includes('machin') || lower.includes('generator') || lower.includes('breaker') || lower.includes('mixer') || lower.includes('trowel') || lower.includes('compactor') || lower.includes('saw') || lower.includes('drill') || lower.includes('hoist') || lower.includes('lift')) {
      return 'Machineries';
    }
    if (lower.includes('vehicle') || lower.includes('dumper') || lower.includes('truck') || lower.includes('jcb') || lower.includes('crane') || lower.includes('hydra') || lower.includes('transit mixer') || lower.includes('hywa')) {
      return 'Construction Vehicles';
    }
    return 'Basic Materials & Civil';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Flooring': return <Grid size={14} className="text-orange-500 shrink-0" />;
      case 'Plumbing': return <Droplet size={14} className="text-blue-500 shrink-0" />;
      case 'Wall Decor': return <Palette size={14} className="text-purple-500 shrink-0" />;
      case 'Chemicals': return <FlaskConical size={14} className="text-green-500 shrink-0" />;
      case 'Machineries': return <Settings size={14} className="text-amber-500 shrink-0" />;
      case 'Construction Vehicles': return <Truck size={14} className="text-red-500 shrink-0" />;
      case 'Basic Materials & Civil': return <Hammer size={14} className="text-indigo-500 shrink-0" />;
      default: return <Briefcase size={14} className="text-gray-500 shrink-0" />;
    }
  };

  const marketData = useMemo(() => {
    const data = activeTab === 'activities' ? activityRates : materialRates;
    
    // Group by item name and region
    const grouped: Record<string, { 
      name: string, 
      unit: string, 
      min: number, 
      max: number, 
      avg: number, 
      count: number,
      region: string,
      category: string
    }> = {};

    data.forEach(rate => {
      if (selectedRegion !== 'All' && rate.region !== selectedRegion) return;
      
      const itemName = 'activity' in rate ? rate.activity : rate.material;
      const key = `${itemName}-${rate.region}`;
      const category = getCategory(itemName);

      if (selectedCategory !== 'All' && category !== selectedCategory) return;

      if (!grouped[key]) {
        grouped[key] = {
          name: itemName,
          unit: rate.unit,
          min: rate.rate,
          max: rate.rate,
          avg: rate.rate,
          count: 1,
          region: rate.region,
          category: category
        };
      } else {
        const item = grouped[key];
        item.min = Math.min(item.min, rate.rate);
        item.max = Math.max(item.max, rate.rate);
        item.avg = (item.avg * item.count + rate.rate) / (item.count + 1);
        item.count += 1;
      }
    });

    return Object.values(grouped).filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activityRates, materialRates, activeTab, selectedRegion, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-10 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                <TrendingUp size={32} />
                Market Rate Explorer
              </h2>
              <p className="text-orange-100 mt-2 text-sm max-w-md">
                Live regional pricing data aggregated from verified vendors. Plan your project budget with real market insights.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-200" size={18} />
                <select
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                  }}
                  className="pl-10 pr-8 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold appearance-none outline-none backdrop-blur-md transition-all cursor-pointer"
                >
                  {regions.map(r => <option key={r} value={r} className="text-gray-900">{r}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Navigation */}
        <div className="p-6 border-b border-gray-50 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => {
                  setActiveTab('activities');
                  setSelectedCategory('All');
                }}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'activities' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'
                }`}
              >
                <Activity size={14} /> Service Activities
              </button>
              <button
                onClick={() => {
                  setActiveTab('materials');
                  setSelectedCategory('All');
                }}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'materials' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'
                }`}
              >
                <Package size={14} /> Material Prices
              </button>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Horizontal category filters */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Filter by Specialty Category</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-orange-200'
                  }`}
                >
                  {getCategoryIcon(cat)}
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rates Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketData.map((item, idx) => (
              <div key={idx} className="group bg-white border border-gray-100 p-5 rounded-2xl hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="max-w-[70%]">
                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{item.region}</span>
                      <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate" title={item.name}>{item.name}</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-black text-gray-900">₹{item.avg.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-gray-400 font-bold">PER {item.unit.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="mt-2.5 mb-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full border border-gray-200">
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="space-y-2 pt-4 border-t border-gray-50">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-gray-500 flex items-center gap-1">
                        <ArrowDownRight size={12} className="text-green-500" /> Min Market Rate
                      </span>
                      <span className="text-gray-700 font-bold">₹{item.min.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-gray-500 flex items-center gap-1">
                        <ArrowUpRight size={12} className="text-red-400" /> Max Market Rate
                      </span>
                      <span className="text-gray-700 font-bold">₹{item.max.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400 bg-gray-50 p-2 rounded-lg font-medium">
                    <Info size={12} />
                    Based on {item.count} vendor {item.count === 1 ? 'quote' : 'quotes'} in this region.
                  </div>
                </div>
              </div>
            ))}
          </div>

          {marketData.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-gray-400">
                <Search size={32} />
              </div>
              <p className="text-gray-500 font-medium">No results found for your search criteria.</p>
              <button 
                onClick={() => {setSelectedRegion('All'); setSelectedCategory('All'); setSearchQuery('');}}
                className="text-orange-600 font-bold text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RateExplorer;
