import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DistrictData, MetricFilter, PropertyCategory } from '../types';
import { ArrowUpRight, ArrowDownRight, MapPin, Building2, School, Flame } from 'lucide-react';

interface MapCanvasProps {
  districts: DistrictData[];
  selectedDistrict: DistrictData | null;
  onSelectDistrict: (district: DistrictData) => void;
  metricFilter: MetricFilter;
  setMetricFilter: (metric: MetricFilter) => void;
  propertyCategory: PropertyCategory;
  setPropertyCategory: (cat: PropertyCategory) => void;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
  metricFilter,
  setMetricFilter,
  propertyCategory,
  setPropertyCategory,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [1.3250, 103.8200], // Singapore center
        zoom: 12,
        minZoom: 11,
        maxZoom: 16,
        zoomControl: false,
      });

      // Dark theme tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control to bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Pan to selected district
  useEffect(() => {
    if (mapInstanceRef.current && selectedDistrict) {
      mapInstanceRef.current.setView([selectedDistrict.lat, selectedDistrict.lng], 13, {
        animate: true,
      });
    }
  }, [selectedDistrict]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    districts.forEach((district) => {
      const isSelected = selectedDistrict?.id === district.id;

      // Color coding based on metric
      let colorClass = 'bg-emerald-500 shadow-emerald-500/50';
      let valueDisplay = `$${district.medianPsf.toLocaleString()} PSF`;

      if (metricFilter === 'rental_yield') {
        valueDisplay = `${district.rentalYield}% Yield`;
        colorClass = district.rentalYield >= 4.0 ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-amber-500 shadow-amber-500/50';
      } else if (metricFilter === 'price_to_income') {
        valueDisplay = `${district.affordabilityIndex}x Income`;
        colorClass = district.affordabilityIndex > 14 ? 'bg-indigo-500 shadow-indigo-500/50' : 'bg-emerald-500 shadow-emerald-500/50';
      } else if (metricFilter === 'school_proximity') {
        valueDisplay = `${district.topTierSchoolsCount} Top Schools`;
        colorClass = 'bg-indigo-500 shadow-indigo-500/50';
      } else if (metricFilter === 'pipeline') {
        valueDisplay = `${district.pipelineProjects.length} Pipeline`;
        colorClass = 'bg-purple-500 shadow-purple-500/50';
      }

      // Create Custom HTML Icon
      const customHtml = `
        <div class="group relative cursor-pointer flex flex-col items-center">
          <div class="w-5 h-5 ${colorClass} rounded-full border-2 border-white shadow-lg ${
        isSelected ? 'scale-125 ring-4 ring-indigo-400 animate-pulse' : ''
      }"></div>
          <div class="mt-1 px-2.5 py-1 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-[11px] font-semibold text-white rounded-xl shadow-md whitespace-nowrap">
            ${district.code} • ${valueDisplay}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-leaflet-pin',
        iconSize: [100, 40],
        iconAnchor: [50, 20],
      });

      const marker = L.marker([district.lat, district.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectDistrict(district);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [districts, selectedDistrict, metricFilter, onSelectDistrict]);

  return (
    <main className="flex-1 ml-0 md:ml-80 relative h-[calc(100vh-80px)] bg-slate-950 overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Controls Top Center */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex flex-wrap items-center justify-center gap-3 bg-slate-900/95 backdrop-blur-xl p-2.5 rounded-2xl border border-slate-800 shadow-2xl">
        {/* Metric Selector Dropdown */}
        <select
          value={metricFilter}
          onChange={(e) => setMetricFilter(e.target.value as MetricFilter)}
          className="bg-slate-800 border border-slate-700/60 text-white text-xs font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="price_psf">Property Price (Median PSF)</option>
          <option value="rental_yield">Rental Yield (%)</option>
          <option value="price_to_income">Price vs Annual Income (Multiple)</option>
          <option value="mortgage_vs_rent">Mortgage vs Rent Premium</option>
          <option value="school_proximity">School Proximity (1-2km)</option>
          <option value="pipeline">Upcoming Developments</option>
        </select>

        {/* Category Pills */}
        <div className="flex bg-slate-800/80 rounded-xl p-1 border border-slate-700/60">
          {(['HDB', 'Condo', 'Landed'] as PropertyCategory[]).map((cat) => {
            const isActive = propertyCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setPropertyCategory(cat)}
                className={`px-3.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Key / Legend (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 shadow-xl max-w-xs">
        <div className="text-[11px] font-mono uppercase text-slate-400 mb-2 font-semibold flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-400" /> Market Intensity Legend
        </div>
        <div className="flex items-center gap-2.5 text-[10px] font-medium text-slate-300">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> High Yield
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> Premium PSF
          </span>
        </div>
      </div>
    </main>
  );
};
