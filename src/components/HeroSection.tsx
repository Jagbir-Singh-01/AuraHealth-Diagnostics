import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Upload,
  ShieldCheck,
  Clock,
  Truck,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Plus,
  Flame,
  Zap,
} from 'lucide-react';
import { POPULAR_TESTS, HEALTH_PACKAGES } from '../data/mockData';
import { TestItem, HealthPackage } from '../types';

interface HeroSectionProps {
  selectedCity: string;
  onOpenCityModal: () => void;
  onOpenPrescriptionModal: () => void;
  onAddToCart: (item: TestItem | HealthPackage, type: 'TEST' | 'PACKAGE') => void;
  onSelectPackage: (pkg: HealthPackage) => void;
  onSelectTest: (test: TestItem) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCity,
  onOpenCityModal,
  onOpenPrescriptionModal,
  onAddToCart,
  onSelectPackage,
  onSelectTest,
  searchInputRef,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search results on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchingTests = POPULAR_TESTS.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchingPackages = HEALTH_PACKAGES.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMatches = matchingTests.length + matchingPackages.length;

  return (
    <section className="relative bg-gradient-to-b from-brand-50 via-white to-slate-50 pt-8 pb-14 px-4 sm:px-8 overflow-hidden">
      {/* Background Subtle Medical Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Decorative Blur Circles */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Top Regional Announcement Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-900 to-brand-darkBlue text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Serving across {selectedCity} & Northern Region</span>
            <button
              onClick={onOpenCityModal}
              className="text-brand-teal hover:underline text-[11px] font-bold ml-1"
            >
              (Change City)
            </button>
          </div>
        </div>

        {/* Hero Main Copy */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-brand-navy tracking-tight leading-tight">
            Advanced Pathology &amp; Health Checkups at Your Doorstep
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Accurate, NABL-accredited diagnostic testing with 6:00 AM early morning home sample collection,
            barcoded sample integrity, and same-day smart digital reports.
          </p>
        </div>

        {/* Universal Search & Quick Action Center */}
        <div className="max-w-3xl mx-auto" ref={searchContainerRef}>
          <div className="relative shadow-2xl rounded-2xl bg-white p-2 border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition">
            <div className="flex items-center gap-3 px-3 py-1.5">
              <Search className="w-5 h-5 text-brand-500 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setShowResults(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                placeholder="Search any test, package or organ (e.g. HbA1c, Vitamin D, Winter Smog, Full Body)..."
                className="w-full text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setShowResults(true)}
                className="hidden sm:inline-flex items-center gap-1 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm"
              >
                Search
              </button>
            </div>

            {/* Live Search Autocomplete Dropdown */}
            {showResults && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[70vh] overflow-y-auto z-50 divide-y divide-slate-100 animate-fade-in">
                {totalMatches === 0 ? (
                  <div className="p-8 text-center text-slate-500 space-y-3">
                    <p className="text-sm">No exact match for "{searchQuery}".</p>
                    <p className="text-xs text-slate-400">
                      Need help finding a specific test? Upload your doctor prescription or call our 24x7 helpline.
                    </p>
                    <button
                      onClick={onOpenPrescriptionModal}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-brand-50 px-4 py-2 rounded-xl"
                    >
                      <Upload className="w-4 h-4" /> Upload Prescription Instead
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Packages Section */}
                    {matchingPackages.length > 0 && (
                      <div className="p-3">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" /> Health Packages ({matchingPackages.length})
                        </div>
                        <div className="space-y-1 mt-1">
                          {matchingPackages.map((pkg) => (
                            <div
                              key={pkg.id}
                              className="p-3 hover:bg-slate-50 rounded-xl transition flex items-center justify-between gap-3 group cursor-pointer"
                              onClick={() => {
                                onSelectPackage(pkg);
                                setShowResults(false);
                              }}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-brand-navy group-hover:text-brand-600 transition truncate">
                                    {pkg.name}
                                  </span>
                                  {pkg.badge && (
                                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                      {pkg.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">{pkg.tagline}</p>
                                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-3">
                                  <span>🧪 {pkg.parametersCount} Parameters</span>
                                  <span>⏳ Report in {pkg.tatHours} hrs</span>
                                  <span>🍽️ {pkg.fastingRequired}</span>
                                </div>
                              </div>
                              <div className="text-right shrink-0 flex items-center gap-3">
                                <div>
                                  <div className="text-sm font-black text-brand-navy">₹{pkg.discountPrice}</div>
                                  <div className="text-[10px] text-slate-400 line-through">₹{pkg.originalPrice}</div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToCart(pkg, 'PACKAGE');
                                    setShowResults(false);
                                  }}
                                  className="p-2 bg-brand-50 hover:bg-brand-500 text-brand-600 hover:text-white rounded-lg transition"
                                  title="Add to Cart"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Single Blood Tests Section */}
                    {matchingTests.length > 0 && (
                      <div className="p-3">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-brand-teal" /> Individual Blood Tests ({matchingTests.length})
                        </div>
                        <div className="space-y-1 mt-1">
                          {matchingTests.map((t) => (
                            <div
                              key={t.id}
                              className="p-3 hover:bg-slate-50 rounded-xl transition flex items-center justify-between gap-3 group cursor-pointer"
                              onClick={() => {
                                onSelectTest(t);
                                setShowResults(false);
                              }}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition truncate">
                                    {t.name}
                                  </span>
                                  <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                                    {t.code}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">{t.description}</p>
                                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-3">
                                  <span>🩸 {t.sampleType}</span>
                                  <span>⏳ Report in {t.tatHours} hrs</span>
                                  <span>🍽️ {t.fastingRequired}</span>
                                </div>
                              </div>
                              <div className="text-right shrink-0 flex items-center gap-3">
                                <div>
                                  <div className="text-sm font-black text-brand-navy">₹{t.discountPrice}</div>
                                  <div className="text-[10px] text-slate-400 line-through">₹{t.originalPrice}</div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToCart(t, 'TEST');
                                    setShowResults(false);
                                  }}
                                  className="p-2 bg-brand-50 hover:bg-brand-500 text-brand-600 hover:text-white rounded-lg transition"
                                  title="Add to Cart"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Quick Trending Filter Pills */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold">Popular Searches:</span>
            <button
              onClick={() => {
                const pkg = HEALTH_PACKAGES.find((p) => p.id === 'pkg-winter-smog-01');
                if (pkg) onSelectPackage(pkg);
              }}
              className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold transition flex items-center gap-1"
            >
              <Flame className="w-3 h-3 text-amber-500" /> Winter Smog Care (₹1499)
            </button>
            <button
              onClick={() => {
                const test = POPULAR_TESTS.find((t) => t.id === 't-cbc-01');
                if (test) onSelectTest(test);
              }}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
            >
              CBC with ESR (₹299)
            </button>
            <button
              onClick={() => {
                const test = POPULAR_TESTS.find((t) => t.id === 't-hba1c-02');
                if (test) onSelectTest(test);
              }}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
            >
              HbA1c Sugar (₹399)
            </button>
            <button
              onClick={() => {
                const test = POPULAR_TESTS.find((t) => t.id === 't-vitd-03');
                if (test) onSelectTest(test);
              }}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
            >
              Vitamin D3 (₹699)
            </button>
            <button
              onClick={() => {
                const pkg = HEALTH_PACKAGES.find((p) => p.id === 'pkg-active-02');
                if (pkg) onSelectPackage(pkg);
              }}
              className="px-3 py-1 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-800 font-semibold transition"
            >
              Full Body Checkup (₹999)
            </button>
          </div>
        </div>

        {/* Prescription Upload Quick Banner */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-brand-navy via-brand-darkBlue to-brand-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal bg-teal-950/70 px-3 py-1 rounded-full border border-teal-500/30">
              <Upload className="w-3.5 h-3.5" /> 1-Click Prescription Quick Order
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Have a Doctor's Prescription?</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Don't know which tests to select? Simply upload a photo of your doctor's slip. Our medical team will verify the tests, apply best discounts, and call you in 10 minutes.
            </p>
          </div>

          <button
            onClick={onOpenPrescriptionModal}
            className="shrink-0 px-6 py-3.5 bg-gradient-to-r from-brand-coral to-amber-500 hover:from-brand-coral/90 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Prescription</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trust Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">6:00 AM Early Slots</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Convenient morning fasting sample draw</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">NABL &amp; CAP Certified</div>
              <div className="text-[11px] text-slate-500 mt-0.5">100% automated gold-standard analyzers</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-brand-teal flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Free Home Collection</div>
              <div className="text-[11px] text-slate-500 mt-0.5">On health packages across North India</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">6-Hour Smart Reports</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Instant WhatsApp &amp; PDF download</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
