import React, { useState } from 'react';
import { MapPin, Search, Check, X, Building2, Truck } from 'lucide-react';
import { NORTH_INDIA_CITIES } from '../data/mockData';
import { NorthIndiaCity } from '../types';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeCheckResult, setPincodeCheckResult] = useState<{ available: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const filteredCities = NORTH_INDIA_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput || pincodeInput.length !== 6) {
      setPincodeCheckResult({ available: false, message: 'Please enter a valid 6-digit North India pincode.' });
      return;
    }

    const prefix2 = pincodeInput.substring(0, 2);
    const prefix3 = pincodeInput.substring(0, 3);
    const matched = NORTH_INDIA_CITIES.find(
      (c) => c.pincodePrefixes.includes(prefix3) || c.pincodePrefixes.includes(prefix2)
    );

    if (matched) {
      setPincodeCheckResult({
        available: true,
        message: `Doorstep Home Collection & Lab Access available in ${matched.name}!`,
      });
      onSelectCity(matched.name);
    } else {
      setPincodeCheckResult({
        available: true,
        message: `Standard Express Collection available for pincode ${pincodeInput} (via Regional Lab Hub).`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-brand-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy">Select Your North India City</h2>
              <p className="text-xs text-slate-500">
                Pincode-verified doorstep sample collection across 8 Northern States
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Pincode Verification */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-brand-teal" /> Check Serviceability by Pincode
            </label>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode (e.g. 110016, 160022)"
                className="flex-1 px-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold bg-brand-navy text-white rounded-lg hover:bg-brand-darkBlue transition shadow-sm"
              >
                Verify
              </button>
            </form>
            {pincodeCheckResult && (
              <div
                className={`mt-3 text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-2 ${
                  pincodeCheckResult.available
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                <Check className="w-3.5 h-3.5 shrink-0" />
                {pincodeCheckResult.message}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by city (Delhi, Chandigarh, Lucknow, Jaipur...)"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Popular Cities Quick Select */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Popular North India Hubs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {NORTH_INDIA_CITIES.filter((c) => c.isPopular).map((city) => {
                const isSelected = selectedCity.toLowerCase() === city.name.toLowerCase();
                return (
                  <button
                    key={city.name}
                    onClick={() => {
                      onSelectCity(city.name);
                      onClose();
                    }}
                    className={`p-3 rounded-xl text-left border transition flex items-center justify-between group ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/70 text-brand-900 ring-1 ring-brand-500 font-semibold'
                        : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold group-hover:text-brand-600 transition">
                        {city.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{city.state}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* All Cities List */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              All Supported Northern Locations
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredCities.map((city) => {
                const isSelected = selectedCity.toLowerCase() === city.name.toLowerCase();
                return (
                  <button
                    key={city.name}
                    onClick={() => {
                      onSelectCity(city.name);
                      onClose();
                    }}
                    className={`px-3 py-2 rounded-lg text-left text-xs transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-500 text-white font-medium shadow-sm'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{city.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-1 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-brand-teal" /> 10+ Reference Labs & 250+ Collection Points
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
