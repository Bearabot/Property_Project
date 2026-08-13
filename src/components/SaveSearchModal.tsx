import React, { useState } from 'react';
import { X, Bookmark, Check, BellRing } from 'lucide-react';
import { MetricFilter, PropertyCategory, RegionType, SavedSearch } from '../types';

interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricFilter: MetricFilter;
  propertyCategory: PropertyCategory;
  selectedRegion: RegionType;
}

export const SaveSearchModal: React.FC<SaveSearchModalProps> = ({
  isOpen,
  onClose,
  metricFilter,
  propertyCategory,
  selectedRegion,
}) => {
  const [title, setTitle] = useState('');
  const [enableAlerts, setEnableAlerts] = useState(true);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: 's1',
      title: 'CCR High Yield Condos (>3.8%)',
      date: '2026-08-10',
      metric: 'rental_yield',
      category: 'Condo',
      region: 'CCR',
    },
    {
      id: 's2',
      title: 'D09 & D10 Price Growth Filter',
      date: '2026-08-05',
      metric: 'price_psf',
      category: 'Condo',
      region: 'CCR',
    },
  ]);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      title: title.trim(),
      date: new Date().toISOString().split('T')[0],
      metric: metricFilter,
      category: propertyCategory,
      region: selectedRegion,
    };

    setSavedSearches([newSearch, ...savedSearches]);
    setTitle('');
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <Bookmark className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Save Current Search Criteria</h2>
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
          {/* Active Preset Summary */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 space-y-1 text-xs">
            <div className="text-slate-400 uppercase text-[10px] font-semibold">Active Filters</div>
            <div className="text-slate-200 font-semibold">
              Region: <span className="text-indigo-400">{selectedRegion}</span> • Category:{' '}
              <span className="text-indigo-400">{propertyCategory}</span> • Metric:{' '}
              <span className="text-indigo-400">{metricFilter}</span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1.5 font-semibold">
                Search Preset Name
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Prime CCR Yield Watchlist 2026"
                className="w-full bg-slate-800 border border-slate-700/60 text-white text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="alerts"
                checked={enableAlerts}
                onChange={(e) => setEnableAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="alerts" className="text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer font-medium">
                <BellRing className="w-3.5 h-3.5 text-indigo-400" />
                Send instant notification when new listings match this criteria
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> Preset Saved!
                </>
              ) : (
                'Save Preset'
              )}
            </button>
          </form>

          {/* Existing Saved Searches */}
          <div className="pt-3 border-t border-slate-800">
            <div className="text-xs uppercase text-slate-400 mb-2.5 font-semibold">
              Your Saved Presets
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {savedSearches.map((s) => (
                <div
                  key={s.id}
                  className="bg-slate-800/40 border border-slate-800 p-3 rounded-xl flex justify-between items-center text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{s.title}</div>
                    <div className="text-[10px] text-slate-400">
                      {s.region} • {s.category} • {s.date}
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-semibold">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
