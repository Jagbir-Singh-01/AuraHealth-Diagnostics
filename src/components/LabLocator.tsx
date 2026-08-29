import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  ShieldCheck,
  Building2,
  Navigation,
  Search,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { LAB_CENTERS } from '../data/mockData';
import { LabCenter } from '../types';

export const LabLocator: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFacility, setSelectedFacility] = useState<string>('ALL');
  const [activeLab, setActiveLab] = useState<LabCenter | null>(LAB_CENTERS[0]);

  const states = [
    { id: 'ALL', label: 'All North India (10+)' },
    { id: 'Delhi NCR', label: 'Delhi NCR' },
    { id: 'Punjab', label: 'Punjab' },
    { id: 'Chandigarh', label: 'Chandigarh' },
    { id: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { id: 'Rajasthan', label: 'Rajasthan' },
    { id: 'Uttarakhand', label: 'Uttarakhand' },
  ];

  const facilitiesList = [
    { id: 'ALL', label: 'All Facilities' },
    { id: 'NABL', label: 'NABL Accredited' },
    { id: 'Digital X-Ray', label: 'Digital X-Ray' },
    { id: 'Ultrasound', label: 'Ultrasound Doppler' },
    { id: 'CT/MRI', label: 'CT & MRI Imaging' },
  ];

  const filteredLabs = LAB_CENTERS.filter((lab) => {
    const matchesState = selectedState === 'ALL' || lab.state === selectedState;
    const matchesSearch =
      lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.pincode.includes(searchQuery);

    let matchesFacility = true;
    if (selectedFacility === 'NABL') matchesFacility = lab.isNablAccredited;
    else if (selectedFacility === 'Digital X-Ray')
      matchesFacility = lab.facilities.some((f) => f.includes('X-Ray'));
    else if (selectedFacility === 'Ultrasound')
      matchesFacility = lab.facilities.some((f) => f.includes('Ultrasound'));
    else if (selectedFacility === 'CT/MRI')
      matchesFacility = lab.facilities.some((f) => f.includes('CT') || f.includes('MRI'));

    return matchesState && matchesSearch && matchesFacility;
  });

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Building2 className="w-3.5 h-3.5" /> Regional Diagnostic Centers
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
          Find an AuraHealth Lab Near You
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Walk into any of our 10+ NABL accredited reference laboratories and 250+ collection centers across North India.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, area or pincode (e.g. Green Park, Sector 35)..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* State Dropdown */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          >
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Facility Filter */}
          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          >
            {facilitiesList.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Labs List + Map / Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Lab Cards List */}
        <div className="lg:col-span-7 space-y-4 max-h-[750px] overflow-y-auto pr-1">
          {filteredLabs.map((lab) => {
            const isSelected = activeLab?.id === lab.id;

            return (
              <div
                key={lab.id}
                onClick={() => setActiveLab(lab)}
                className={`p-5 rounded-2xl border transition cursor-pointer ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/40 ring-1 ring-brand-500 shadow-md'
                    : 'border-slate-200 bg-white hover:border-brand-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{lab.name}</span>
                      {lab.isRegionalReferenceLab && (
                        <span className="text-[10px] font-extrabold bg-brand-navy text-white px-2 py-0.5 rounded">
                          Reference Lab
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-brand-600 font-medium mt-0.5">
                      {lab.city} • {lab.area}
                    </div>
                  </div>

                  {lab.isNablAccredited && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                      NABL Certified
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 mt-3 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{lab.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{lab.operatingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${lab.phone}`} className="font-semibold text-brand-navy hover:underline">
                      {lab.phone}
                    </a>
                  </div>
                </div>

                {/* Facilities Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                  {lab.facilities.map((fac, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredLabs.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No diagnostic labs found matching your filters. Try selecting "All North India".
            </div>
          )}
        </div>

        {/* Right Column: Active Lab Detail Spotlight & Map View */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          {activeLab && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-5">
              {/* Map Preview Simulator */}
              <div className="h-44 rounded-2xl bg-gradient-to-tr from-slate-800 via-brand-navy to-brand-700 relative overflow-hidden flex flex-col justify-end p-4 text-white">
                <div className="absolute inset-0 opacity-20 bg-grid-pattern pointer-events-none" />
                <div className="relative z-10 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-teal">
                    Center Location
                  </div>
                  <div className="text-sm font-black">{activeLab.name}</div>
                  <div className="text-xs text-slate-300 truncate">{activeLab.city} Hub</div>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-brand-teal" />
                </div>
              </div>

              {/* Lab Highlights */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-brand-navy">Center Capabilities</h3>
                <div className="grid grid-cols-1 gap-2">
                  {activeLab.facilities.map((fac, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Actions */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <a
                  href={`tel:${activeLab.phone}`}
                  className="w-full py-2.5 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Phone className="w-4 h-4" /> Call Lab Desk: {activeLab.phone}
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(activeLab.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4 text-brand-teal" /> Open in Google Maps
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
