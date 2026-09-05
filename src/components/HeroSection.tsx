import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Upload,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  User,
} from 'lucide-react';
import { POPULAR_TESTS, HEALTH_PACKAGES, LAB_BRANDS } from '../data/mockData';
import { TestItem, HealthPackage, PatientProfile } from '../types';

interface HeroSectionProps {
  selectedCity: string;
  onOpenCityModal: () => void;
  onOpenPrescriptionModal: () => void;
  onOpenRegistrationModal: () => void;
  patientProfile: PatientProfile;
  onOpenTestComparison: (item: TestItem | HealthPackage) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCity,
  onOpenCityModal,
  onOpenPrescriptionModal,
  onOpenRegistrationModal,
  patientProfile,
  onOpenTestComparison,
  searchInputRef,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredTests = POPULAR_TESTS.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.parametersList.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPackages = HEALTH_PACKAGES.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative bg-gradient-to-b from-brand-50/70 via-white to-slate-50 py-10 sm:py-16 overflow-hidden border-b border-slate-200/70">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-8">
        {/* Step Indicator Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 shadow-sm max-w-4xl mx-auto">
          {/* Step 1 */}
          <button
            onClick={onOpenRegistrationModal}
            className="flex items-center gap-2.5 text-left p-2 rounded-2xl hover:bg-slate-50 transition flex-1 min-w-[200px]"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 font-black flex items-center justify-center text-xs shrink-0">
              1
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Step 1: Patient Profile
              </span>
              <span className="text-xs font-bold text-brand-navy truncate block">
                {patientProfile.isLoggedIn ? `👤 ${patientProfile.fullName}` : 'Register / Sign In'}
              </span>
            </div>
          </button>

          <div className="hidden sm:block h-6 w-px bg-slate-200" />

          {/* Step 2 */}
          <div className="flex items-center gap-2.5 p-2 flex-1 min-w-[200px]">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-black flex items-center justify-center text-xs shrink-0">
              2
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Step 2: Type Test Name
              </span>
              <span className="text-xs font-bold text-teal-900 block">
                Search CBC, HbA1c, etc.
              </span>
            </div>
          </div>

          <div className="hidden sm:block h-6 w-px bg-slate-200" />

          {/* Step 3 */}
          <div className="flex items-center gap-2.5 p-2 flex-1 min-w-[200px]">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs shrink-0">
              3
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Step 3: Compare &amp; Book
              </span>
              <span className="text-xs font-bold text-amber-900 block">
                Compare 7 Lab Chains
              </span>
            </div>
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>NABL &amp; CAP Certified Multi-Lab Diagnostic Network · {selectedCity}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-navy tracking-tight leading-tight">
            Type Any Medical Test &amp; <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-navy via-brand-500 to-brand-teal">
              Compare Across Top Labs
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Compare prices, sample collection turnaround times, and accreditations across <strong>Agilus, Dr. Lal PathLabs, Max Lab, Metropolis, Thyrocare, and Apollo</strong>.
          </p>
        </div>

        {/* Universal Type-to-Search Input */}
        <div className="max-w-3xl mx-auto relative">
          <div className="bg-white p-2.5 sm:p-3 rounded-3xl shadow-xl border-2 border-slate-200 focus-within:border-brand-500 transition duration-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* City Selector In Search */}
            <button
              onClick={onOpenCityModal}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition border border-slate-200 shrink-0 justify-between sm:justify-start"
            >
              <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                <MapPin className="w-3.5 h-3.5 text-brand-teal" />
                <span className="truncate">{selectedCity}</span>
              </div>
              <span className="text-slate-400 text-[10px]">▼</span>
            </button>

            {/* Live Search Input */}
            <div className="flex-1 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Type test name (e.g. CBC, HbA1c, Vitamin D, Thyroid, Lipid, Smog)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Prescription Upload Quick Button */}
            <button
              onClick={onOpenPrescriptionModal}
              className="px-4 py-2.5 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-2xl transition flex items-center justify-center gap-1.5 shadow-sm shrink-0"
            >
              <Upload className="w-3.5 h-3.5 text-brand-teal" />
              <span>Upload Rx</span>
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-30 max-h-96 overflow-y-auto animate-fade-in p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Matching Tests &amp; Lab Comparisons:
              </div>

              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  onClick={() => {
                    onOpenTestComparison(test);
                    setSearchQuery('');
                  }}
                  className="p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition flex items-center justify-between gap-3 border border-transparent hover:border-slate-200"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{test.name}</span>
                      <span className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded font-mono">
                        {test.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {test.parametersCount} Parameters · Fasting: {test.fastingRequired}
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    <div>
                      <span className="text-xs font-bold text-emerald-600 block">
                        From ₹{Math.min(...test.labOfferings.map((o) => o.discountPrice))}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {test.labOfferings.length} Labs available
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-brand-navy text-white text-[10px] font-bold rounded-lg flex items-center gap-1">
                      Compare <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}

              {filteredTests.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500">
                  No direct test matches for &ldquo;{searchQuery}&rdquo;. Try typing &ldquo;CBC&rdquo;, &ldquo;HbA1c&rdquo;, &ldquo;Vitamin D&rdquo;, or upload your prescription.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Test Search Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold text-xs mr-1">Popular Tests:</span>
          {POPULAR_TESTS.slice(0, 6).map((t) => (
            <button
              key={t.id}
              onClick={() => onOpenTestComparison(t)}
              className="px-3 py-1.5 bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 rounded-full font-semibold text-slate-700 hover:text-brand-navy transition text-xs shadow-2xs flex items-center gap-1.5"
            >
              <span>{t.name.split(' (')[0]}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                ₹{Math.min(...t.labOfferings.map((o) => o.discountPrice))}
              </span>
            </button>
          ))}
        </div>

        {/* Lab Brands Bar */}
        <div className="pt-6 border-t border-slate-200/80 max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Compare across North India&rsquo;s Top NABL / CAP Accredited Diagnostic Chains:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs">
            {LAB_BRANDS.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-2xs"
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.primaryColor }} />
                <span className="font-bold text-slate-800">{b.name}</span>
                <span className="text-[10px] text-amber-500 font-bold">★ {b.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
