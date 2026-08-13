import React, { useState } from 'react';
import { X, Check, SlidersHorizontal, Plus, ArrowRight } from 'lucide-react';
import { DistrictData } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  districts: DistrictData[];
  defaultDistrict: DistrictData;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  districts,
  defaultDistrict,
}) => {
  const [district1Id, setDistrict1Id] = useState<string>(defaultDistrict.id);
  const [district2Id, setDistrict2Id] = useState<string>(
    districts.find((d) => d.id !== defaultDistrict.id)?.id || 'D01'
  );

  if (!isOpen) return null;

  const d1 = districts.find((d) => d.id === district1Id) || defaultDistrict;
  const d2 = districts.find((d) => d.id === district2Id) || districts[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">District Side-by-Side Comparison</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-2 font-semibold">
                District 1
              </label>
              <select
                value={district1Id}
                onChange={(e) => setDistrict1Id(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/60 text-white text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name} ({d.region})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase text-slate-400 mb-2 font-semibold">
                District 2
              </label>
              <select
                value={district2Id}
                onChange={(e) => setDistrict2Id(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/60 text-white text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name} ({d.region})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
            {/* Row 1: Region */}
            <div className="grid grid-cols-3 p-4 items-center text-sm">
              <span className="text-xs uppercase text-slate-400 font-semibold">Region Zone</span>
              <span className="font-semibold text-indigo-400">{d1.region}</span>
              <span className="font-semibold text-indigo-400">{d2.region}</span>
            </div>

            {/* Row 2: Median PSF */}
            <div className="grid grid-cols-3 p-4 items-center text-sm">
              <span className="text-xs uppercase text-slate-400 font-semibold">Median Price PSF</span>
              <span className="font-mono font-bold text-white">${d1.medianPsf.toLocaleString()}</span>
              <span className="font-mono font-bold text-white">${d2.medianPsf.toLocaleString()}</span>
            </div>

            {/* Row 3: YoY Growth */}
            <div className="grid grid-cols-3 p-4 items-center text-sm">
              <span className="text-xs uppercase text-slate-400 font-semibold">YoY PSF Growth</span>
              <span className="font-mono font-bold text-emerald-400">+{d1.yoyGrowth}%</span>
              <span className="font-mono font-bold text-emerald-400">+{d2.yoyGrowth}%</span>
            </div>

            {/* Row 4: Rental Yield */}
            <div className="grid grid-cols-3 p-4 items-center text-sm">
              <span className="text-xs uppercase text-slate-400 font-semibold">Avg Rental Yield</span>
              <span className="font-mono font-bold text-indigo-300">{d1.rentalYield}%</span>
              <span className="font-mono font-bold text-indigo-300">{d2.rentalYield}%</span>
            </div>

            {/* Row 5: Affordability */}
            <div className="grid grid-cols-3 p-4 items-center text-sm">
              <span className="text-xs uppercase text-slate-400 font-semibold">Affordability Multiple</span>
              <span className="text-white">{d1.affordabilityIndex}x Income</span>
              <span className="text-white">{d2.affordabilityIndex}x Income</span>
            </div>

            {/* Row 6: Schools */}
            <div className="grid grid-cols-3 p-4 items-center text-sm">
              <span className="text-xs uppercase text-slate-400 font-semibold">Top Schools (2km)</span>
              <span className="text-white">{d1.topTierSchoolsCount} Schools</span>
              <span className="text-white">{d2.topTierSchoolsCount} Schools</span>
            </div>

            {/* Row 7: Pipeline Supply */}
            <div className="grid grid-cols-3 p-4 items-center text-sm">
              <span className="text-xs uppercase text-slate-400 font-semibold">Pipeline Developments</span>
              <span className="text-slate-300">{d1.pipelineProjects.length} Projects</span>
              <span className="text-slate-300">{d2.pipelineProjects.length} Projects</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-lg shadow-indigo-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
