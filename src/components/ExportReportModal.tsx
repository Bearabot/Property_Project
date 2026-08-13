import React, { useState } from 'react';
import { X, Download, FileText, Check, Printer } from 'lucide-react';
import { DistrictData, RegionType } from '../types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDistrict: DistrictData;
  selectedRegion: RegionType;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  selectedDistrict,
  selectedRegion,
}) => {
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setIsDone(true);

      // Trigger dummy download
      const reportData = {
        title: `PropIntel SG Market Intelligence Report - ${selectedDistrict.name}`,
        region: selectedRegion,
        district: selectedDistrict.code,
        medianPsf: selectedDistrict.medianPsf,
        yoyGrowth: selectedDistrict.yoyGrowth,
        rentalYield: selectedDistrict.rentalYield,
        affordabilityIndex: selectedDistrict.affordabilityIndex,
        generatedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PropIntel_Report_${selectedDistrict.code}_2026.${format}`;
      a.click();

      setTimeout(() => {
        setIsDone(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <Download className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Export Executive Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl space-y-1.5">
            <div className="text-xs uppercase text-slate-400 font-semibold">
              Target Report Scope
            </div>
            <div className="text-sm font-bold text-white">
              {selectedDistrict.code} - {selectedDistrict.name}
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Includes 2020-2026 PSF trajectory, rental yields, school proximity rankings, and pipeline development supply.
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-slate-400 mb-2 font-semibold">
              Select Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['pdf', 'csv', 'json'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                    format === fmt
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {fmt} Document
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
          >
            {isDone ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> Report Downloaded!
              </>
            ) : isExporting ? (
              'Compiling Report...'
            ) : (
              <>
                <FileText className="w-4 h-4" /> Export {format.toUpperCase()} Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
