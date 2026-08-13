import React, { useState } from 'react';
import { Search, Bell, User, SlidersHorizontal, Bookmark } from 'lucide-react';
import { SINGAPORE_DISTRICTS } from '../data/singaporeData';
import { DistrictData } from '../types';

interface TopAppBarProps {
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  onSelectDistrict: (district: DistrictData) => void;
  onOpenCompare: () => void;
  onOpenSaveSearch: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeNavTab,
  setActiveNavTab,
  onSelectDistrict,
  onOpenCompare,
  onOpenSaveSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredDistricts = SINGAPORE_DISTRICTS.filter(
    (d) =>
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.keyCondos.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-20 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 text-slate-100 transition-all duration-200">
      {/* Brand & Main Nav */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveNavTab('Districts')}>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
            <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            PropIntel <span className="text-indigo-400">SG</span>
          </span>
        </div>

        <nav className="hidden lg:flex gap-1 items-center">
          {['Rent', 'Sales', 'Districts', 'Yield Analysis'].map((tab) => {
            const isActive = activeNavTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveNavTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white font-semibold bg-slate-800 shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search districts, condos..."
              className="bg-slate-800/80 border border-slate-700/60 text-white text-xs pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full placeholder-slate-400"
            />
          </div>

          {/* Search Dropdown */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-800/80 p-1">
              {filteredDistricts.length === 0 ? (
                <div className="p-3.5 text-xs text-slate-400 text-center">No matching district or condo found</div>
              ) : (
                filteredDistricts.map((d) => (
                  <div
                    key={d.id}
                    onMouseDown={() => {
                      onSelectDistrict(d);
                      setSearchQuery('');
                    }}
                    className="p-3 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-indigo-300">
                        {d.code} - {d.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {d.region} • ${d.medianPsf.toLocaleString()} PSF
                      </div>
                    </div>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono font-semibold">
                      {d.rentalYield}% yield
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Compare Button */}
        <button
          onClick={onOpenCompare}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700/80 bg-slate-800/50 text-slate-200 text-xs font-semibold hover:bg-slate-800 hover:text-white transition-all shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-300" />
          Compare
        </button>

        {/* Save Search Button */}
        <button
          onClick={onOpenSaveSearch}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Bookmark className="w-3.5 h-3.5" />
          Save Search
        </button>

        {/* Action Icons */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-3 ml-1">
          <button
            title="Notifications"
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
          </button>
          <button
            title="Account"
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
