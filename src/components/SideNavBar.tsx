import React from 'react';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  GraduationCap,
  Hammer,
  MessageSquare,
  Download,
  Settings,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { RegionType, SelectedTab } from '../types';

interface SideNavBarProps {
  selectedTab: SelectedTab;
  setSelectedTab: (tab: SelectedTab) => void;
  selectedRegion: RegionType;
  setSelectedRegion: (region: RegionType) => void;
  onOpenExportReport: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  selectedTab,
  setSelectedTab,
  selectedRegion,
  setSelectedRegion,
  onOpenExportReport,
  onOpenSettings,
  onOpenHelp,
}) => {
  const navItems = [
    { id: 'overview' as SelectedTab, label: 'Market Overview', icon: BarChart3 },
    { id: 'trends' as SelectedTab, label: 'Price Trends', icon: TrendingUp },
    { id: 'yields' as SelectedTab, label: 'Rental Yields', icon: CreditCard },
    { id: 'schools' as SelectedTab, label: 'School Proximity', icon: GraduationCap },
    { id: 'pipeline' as SelectedTab, label: 'Development Pipeline', icon: Hammer },
    { id: 'forum' as SelectedTab, label: 'Discussion Forum', icon: MessageSquare },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-20 h-[calc(100vh-80px)] z-40 w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex-col justify-between shadow-xl">
      <div>
        {/* Header / Analyst Profile Area */}
        <div className="p-5 border-b border-slate-800">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-800/80 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600/80">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                  alt="District Analyst Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-semibold truncate">Alex Rivera</p>
                <p className="text-[10px] text-indigo-400 font-medium">Senior Property Analyst</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full bg-slate-700/80 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-4/5 rounded-full"></div>
            </div>
          </div>

          <div className="relative">
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-semibold">
              Region Filter
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as RegionType)}
              className="w-full bg-slate-800 text-slate-200 text-xs py-2 px-3 pr-7 rounded-xl border border-slate-700/70 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none truncate font-medium"
            >
              <option value="CCR">CCR - Core Central Region</option>
              <option value="RCR">RCR - Rest of Central</option>
              <option value="OCR">OCR - Outside Central</option>
              <option value="ALL">All Singapore Districts</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 bottom-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-4 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedTab(item.id)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 font-bold scale-[0.99]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-5 border-t border-slate-800 bg-slate-900/60">
        <button
          onClick={onOpenExportReport}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-semibold rounded-xl transition-colors border border-slate-700/60 shadow-sm mb-3"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Export Executive Report</span>
        </button>

        <div className="flex justify-around items-center pt-1">
          <button
            onClick={onOpenSettings}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={onOpenHelp}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Help & Guides"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
