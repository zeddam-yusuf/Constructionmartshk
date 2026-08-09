import React from 'react';
import { Search } from 'lucide-react';

interface PortalSearchBarProps {
  segmentTitle: string;
  subTabLabel: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  appliedSearchQuery: string;
  setAppliedSearchQuery: (q: string) => void;
}

export const PortalSearchBar: React.FC<PortalSearchBarProps> = ({
  segmentTitle,
  subTabLabel,
  searchQuery,
  setSearchQuery,
  appliedSearchQuery,
  setAppliedSearchQuery
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-gray-50/80 p-4 rounded-xl border border-gray-200 animate-in fade-in duration-200">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder={`Search in ${segmentTitle} Services (${subTabLabel})...`}
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
  );
};
