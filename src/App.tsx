import React, { useState } from 'react';
import { SINGAPORE_DISTRICTS } from './data/singaporeData';
import { DistrictData, MetricFilter, PropertyCategory, RegionType, SelectedTab } from './types';
import { TopAppBar } from './components/TopAppBar';
import { SideNavBar } from './components/SideNavBar';
import { MapCanvas } from './components/MapCanvas';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { CompareModal } from './components/CompareModal';
import { SaveSearchModal } from './components/SaveSearchModal';
import { ExportReportModal } from './components/ExportReportModal';
import { DisqusThread } from './components/DisqusThread';
import { X, Settings, HelpCircle, Check, Info } from 'lucide-react';

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState<string>('Districts');
  const [selectedRegion, setSelectedRegion] = useState<RegionType>('CCR');
  const [selectedTab, setSelectedTab] = useState<SelectedTab>('overview');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData>(
    SINGAPORE_DISTRICTS[0] // D09 Orchard by default
  );
  const [metricFilter, setMetricFilter] = useState<MetricFilter>('price_psf');
  const [propertyCategory, setPropertyCategory] = useState<PropertyCategory>('Condo');

  // Modals state
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSaveSearchOpen, setIsSaveSearchOpen] = useState(false);
  const [isExportReportOpen, setIsExportReportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Filter districts based on region selection
  const displayedDistricts =
    selectedRegion === 'ALL'
      ? SINGAPORE_DISTRICTS
      : SINGAPORE_DISTRICTS.filter((d) => d.region === selectedRegion);

  return (
    <div className="bg-slate-950 text-slate-100 font-sans min-h-screen w-screen overflow-hidden flex flex-col antialiased">
      {/* Top Header */}
      <TopAppBar
        activeNavTab={activeNavTab}
        setActiveNavTab={setActiveNavTab}
        onSelectDistrict={setSelectedDistrict}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenSaveSearch={() => setIsSaveSearchOpen(true)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 pt-20 relative overflow-y-auto">
        {/* Interactive Dashboard Area */}
        <div className="flex relative h-[calc(100vh-80px)] overflow-hidden">
          {/* Left Sidebar */}
          <SideNavBar
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            selectedRegion={selectedRegion}
            setSelectedRegion={(region) => {
              setSelectedRegion(region);
              const firstInRegion = SINGAPORE_DISTRICTS.find(
                (d) => region === 'ALL' || d.region === region
              );
              if (firstInRegion) setSelectedDistrict(firstInRegion);
            }}
            onOpenExportReport={() => setIsExportReportOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
          />

          {/* Central Map Canvas */}
          <MapCanvas
            districts={displayedDistricts}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            metricFilter={metricFilter}
            setMetricFilter={setMetricFilter}
            propertyCategory={propertyCategory}
            setPropertyCategory={setPropertyCategory}
          />

          {/* Right Analytics Overlay Panel */}
          <AnalyticsPanel
            selectedDistrict={selectedDistrict}
            selectedRegion={selectedRegion}
            selectedTab={selectedTab}
            onSelectDistrict={setSelectedDistrict}
          />
        </div>

        {/* Bottom Landing Page Discussion Forum Section */}
        <section id="disqus-discussion-section" className="w-full bg-slate-950 border-t border-slate-800/80 py-10 px-4 md:px-8 md:pl-88">
          <div className="max-w-6xl mx-auto">
            <DisqusThread
              identifier="propintel-sg-landing-forum"
              title="PropIntel SG Community Discussion Forum"
            />
          </div>
        </section>
      </div>

      {/* Modals */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        districts={SINGAPORE_DISTRICTS}
        defaultDistrict={selectedDistrict}
      />

      <SaveSearchModal
        isOpen={isSaveSearchOpen}
        onClose={() => setIsSaveSearchOpen(false)}
        metricFilter={metricFilter}
        propertyCategory={propertyCategory}
        selectedRegion={selectedRegion}
      />

      <ExportReportModal
        isOpen={isExportReportOpen}
        onClose={() => setIsExportReportOpen(false)}
        selectedDistrict={selectedDistrict}
        selectedRegion={selectedRegion}
      />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <Settings className="w-4 h-4" />
                </div>
                Platform Settings
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1.5">
                  Default Map Provider
                </label>
                <select className="w-full bg-slate-800 border border-slate-700/60 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>CartoDB Dark Matter (High Contrast)</option>
                  <option>Vector Satellite Hybrid</option>
                  <option>Urban Planning Blueprint</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1.5">
                  Currency Units
                </label>
                <select className="w-full bg-slate-800 border border-slate-700/60 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>SGD ($ PSF)</option>
                  <option>USD ($ PSF)</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-lg shadow-indigo-500/20"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <HelpCircle className="w-4 h-4" />
                </div>
                PropIntel SG User Guide
              </h3>
              <button onClick={() => setIsHelpOpen(false)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Map Heatmaps:</strong> Use top floating controls to toggle between Median PSF, Rental Yield %, Affordability Index, School Proximity, and Development Pipeline.
              </p>
              <p>
                <strong className="text-white">District Pins:</strong> Click any pin on Singapore map to isolate details in the Right Analytics Panel.
              </p>
              <p>
                <strong className="text-white">Compare Tool:</strong> Click 'Compare' in top bar to analyze 2 districts side-by-side.
              </p>
              <p>
                <strong className="text-white">AI Market Insights:</strong> Click 'Generate Analysis' in the right panel to run instant AI valuation summaries.
              </p>
            </div>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-lg shadow-indigo-500/20"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
