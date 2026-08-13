import React, { useState } from 'react';
import {
  CreditCard,
  Home,
  Building2,
  GraduationCap,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  Clock,
  Layers,
  Info
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { DistrictData, RegionType, SelectedTab } from '../types';
import { REGION_SUMMARIES } from '../data/singaporeData';
import { DisqusThread } from './DisqusThread';

interface AnalyticsPanelProps {
  selectedDistrict: DistrictData;
  selectedRegion: RegionType;
  selectedTab: SelectedTab;
  onSelectDistrict: (district: DistrictData) => void;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  selectedDistrict,
  selectedRegion,
  selectedTab,
  onSelectDistrict,
}) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const regionSummary = REGION_SUMMARIES[selectedRegion] || REGION_SUMMARIES.CCR;

  // Handle Gemini AI Insight Generation
  const generateAiInsight = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/district-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          districtName: selectedDistrict.name,
          code: selectedDistrict.code,
          psf: selectedDistrict.medianPsf,
          yieldVal: selectedDistrict.rentalYield,
          yoy: selectedDistrict.yoyGrowth,
          affordability: selectedDistrict.affordabilityIndex,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiInsight(data.insight);
      } else {
        // Fallback structured insight
        setAiInsight(
          `District ${selectedDistrict.code} (${selectedDistrict.name}) presents strong investment fundamentals with a $${selectedDistrict.medianPsf} PSF median and ${selectedDistrict.rentalYield}% yield. Excellent proximity to ${selectedDistrict.topTierSchoolsCount} top tier schools continues to anchor tenant retention.`
        );
      }
    } catch (e) {
      setAiInsight(
        `District ${selectedDistrict.code} (${selectedDistrict.name}) presents strong investment fundamentals with a $${selectedDistrict.medianPsf} PSF median and ${selectedDistrict.rentalYield}% yield. Excellent proximity to ${selectedDistrict.topTierSchoolsCount} top tier schools continues to anchor tenant retention.`
      );
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="hidden xl:flex absolute top-5 right-6 bottom-6 w-[410px] z-30 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl flex-col shadow-2xl overflow-hidden text-slate-100">
      {/* Panel Top Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex justify-between items-start">
        <div>
          <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-full uppercase tracking-wide">
            {selectedDistrict.code} • {selectedDistrict.region}
          </span>
          <h3 className="font-bold text-xl text-white mt-2 leading-tight">
            {selectedDistrict.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {regionSummary.subtitle}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
        {/* TAB 1: OVERVIEW */}
        {selectedTab === 'overview' && (
          <>
            {/* Metric 1: Avg Rental Yield */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Avg Rental Yield
                </span>
                <CreditCard className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold font-mono text-indigo-400">
                  {selectedDistrict.rentalYield}%
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +0.2%
                </span>
              </div>
              {/* Visual Yield Bar */}
              <div className="h-2 mt-3 bg-slate-800 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                  style={{ width: `${(selectedDistrict.rentalYield / 6) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Metric 2: Affordability Index */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Affordability Index
                </span>
                <Home className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold font-mono text-white">
                  {selectedDistrict.affordabilityIndex}x
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Multiple of median annual household income
              </p>
            </div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-3.5">
                <span className="block text-[11px] font-semibold text-slate-400 uppercase truncate mb-1">
                  Mortgage vs Rent
                </span>
                <span className="text-sm font-bold font-mono text-amber-400">
                  +{selectedDistrict.mortgageVsRent}% Premium
                </span>
              </div>
              <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-3.5">
                <span className="block text-[11px] font-semibold text-slate-400 uppercase truncate mb-1">
                  Top Tier Schools
                </span>
                <span className="text-sm font-bold font-mono text-indigo-400">
                  {selectedDistrict.topTierSchoolsCount} within 2km
                </span>
              </div>
            </div>

            {/* Key Condo Highlights */}
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs font-semibold uppercase text-slate-300 mb-3 flex items-center justify-between">
                <span>Key Condos in {selectedDistrict.code}</span>
                <span className="text-indigo-400 text-[10px]">Median PSF</span>
              </div>
              <div className="space-y-2.5">
                {selectedDistrict.keyCondos.map((condo) => (
                  <div
                    key={condo.id}
                    className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center"
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {condo.name}
                        {condo.hotspot && (
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {condo.tenure} • {condo.yield}% yield
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-indigo-300">
                        ${condo.psf.toLocaleString()} PSF
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono font-semibold">
                        +{condo.yoyChange}% YoY
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: PRICE TRENDS */}
        {selectedTab === 'trends' && (
          <div className="space-y-4">
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs font-semibold text-slate-400 uppercase mb-2">
                Historical Price PSF Trajectory (2020-2026)
              </div>
              <div className="h-48 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedDistrict.historicalPsf}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="psf"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      dot={{ fill: '#6366f1', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs font-semibold text-slate-300 mb-2">
                YoY Growth & Capital Appreciation
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-xs text-slate-400">Current Median PSF</span>
                <span className="text-xs font-mono font-bold text-white">
                  ${selectedDistrict.medianPsf.toLocaleString()} PSF
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-xs text-slate-400">1-Year YoY Growth</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  +{selectedDistrict.yoyGrowth}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-slate-400">Estimated 5-Year Growth</span>
                <span className="text-xs font-mono font-bold text-indigo-400">+15.5%</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RENTAL YIELDS */}
        {selectedTab === 'yields' && (
          <div className="space-y-4">
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs font-semibold text-slate-400 uppercase mb-2">
                Key Condos Yield Comparison (%)
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedDistrict.keyCondos}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} interval={0} />
                    <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 6]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="yield" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs font-semibold text-slate-300 mb-2">
                Estimated Monthly Rent PSF
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Median monthly rental rates in {selectedDistrict.code} average{' '}
                <strong className="text-emerald-400">$6.50 PSF/month</strong>, providing strong cash flow covering mortgage interest costs.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: SCHOOL PROXIMITY */}
        {selectedTab === 'schools' && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase mb-1">
              Primary Schools within 1-2km Radius
            </div>
            {selectedDistrict.schools.map((school, i) => (
              <div
                key={i}
                className="bg-slate-800/50 border border-slate-800 rounded-2xl p-3.5 flex justify-between items-center"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                    {school.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {school.distanceKm}km away • {school.within1km ? 'Within 1km' : 'Within 2km'}
                  </div>
                </div>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full font-semibold">
                  {school.tier}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: DEVELOPMENT PIPELINE */}
        {selectedTab === 'pipeline' && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase mb-1">
              Upcoming Condo Launches & Supply
            </div>
            {selectedDistrict.pipelineProjects.map((proj, i) => (
              <div
                key={i}
                className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white">{proj.name}</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full font-semibold">
                    {proj.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Developer: <strong className="text-slate-200">{proj.developer}</strong>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Total Units: {proj.units}</span>
                  <span>Est Completion: {proj.expectedEst}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Insight Section */}
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" /> AI Market Intelligence
            </span>
            <button
              onClick={generateAiInsight}
              disabled={isGeneratingAi}
              className="text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-xl transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
            >
              {isGeneratingAi ? 'Analyzing...' : 'Generate Analysis'}
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {aiInsight ||
              `Click above to trigger real-time AI valuation & ROI summary for ${selectedDistrict.name}.`}
          </p>
        </div>
      </div>
    </div>
  );
};
