import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Clock,
  FlaskConical,
  Utensils,
  Plus,
  ArrowRight,
  Info,
  Shield,
  X,
  ChevronRight,
} from 'lucide-react';
import { HEALTH_PACKAGES } from '../data/mockData';
import { HealthPackage } from '../types';

interface PackageGridProps {
  onAddToCart: (pkg: HealthPackage, type: 'PACKAGE') => void;
  selectedPackage: HealthPackage | null;
  setSelectedPackage: (pkg: HealthPackage | null) => void;
}

export const PackageGrid: React.FC<PackageGridProps> = ({
  onAddToCart,
  selectedPackage,
  setSelectedPackage,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Packages (5)' },
    { id: 'Full Body', label: '🌟 Full Body Checkup' },
    { id: 'Winter & Respiratory', label: '🌫️ Winter & Smog AQI' },
    { id: 'Senior Citizen', label: '👴 Senior Citizen Care' },
    { id: 'Women Wellness', label: '🌸 Women & PCOD' },
  ];

  const filteredPackages = HEALTH_PACKAGES.filter((p) => {
    if (activeCategory === 'ALL') return true;
    return p.category === activeCategory;
  });

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Curated Preventive Healthcare
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Popular Health Checkup Packages
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Doctor-designed multi-organ profiles tailored for North Indian lifestyle, dietary, and seasonal factors.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === c.id
                  ? 'bg-brand-navy text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => {
          const discountPercent = Math.round(
            ((pkg.originalPrice - pkg.discountPrice) / pkg.originalPrice) * 100
          );

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
            >
              {/* Top Accent Strip & Badge */}
              <div className="p-6 pb-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      pkg.badge === 'North India Special'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : pkg.badge === 'Best Value'
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {pkg.badge || 'Preventive Checkup'}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-600 transition leading-snug">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{pkg.tagline}</p>
                </div>

                {/* Specs badges */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                  <div className="bg-slate-50 rounded-xl p-2">
                    <div className="text-[10px] text-slate-400 font-medium">Includes</div>
                    <div className="text-xs font-black text-brand-navy mt-0.5">
                      {pkg.parametersCount} Tests
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2">
                    <div className="text-[10px] text-slate-400 font-medium">Turnaround</div>
                    <div className="text-xs font-black text-brand-navy mt-0.5">{pkg.tatHours} Hours</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2">
                    <div className="text-[10px] text-slate-400 font-medium">Fasting</div>
                    <div className="text-[11px] font-bold text-slate-700 mt-0.5 truncate">
                      {pkg.fastingRequired.includes('Fasting') ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>

                {/* Highlights list */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Key Profile Tests:
                  </div>
                  {pkg.highlights.slice(0, 4).map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{h}</span>
                    </div>
                  ))}
                  {pkg.highlights.length > 4 && (
                    <button
                      onClick={() => setSelectedPackage(pkg)}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-0.5 mt-1"
                    >
                      +{pkg.highlights.length - 4} more test profiles
                    </button>
                  )}
                </div>
              </div>

              {/* Price & CTA Bottom Bar */}
              <div className="p-6 pt-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Offer Price</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-brand-navy">₹{pkg.discountPrice}</span>
                    <span className="text-xs text-slate-400 line-through">₹{pkg.originalPrice}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition"
                    title="View Full Test Details"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onAddToCart(pkg, 'PACKAGE')}
                    className="px-4 py-2.5 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-1.5 group-hover:scale-105"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Package Breakdown Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-brand-50 to-white">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600 bg-brand-100/70 px-2.5 py-1 rounded">
                  {selectedPackage.category} Profile
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-brand-navy mt-1">
                  {selectedPackage.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">{selectedPackage.tagline}</p>
              </div>

              <button
                onClick={() => setSelectedPackage(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Overview strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                <div>
                  <div className="text-slate-400 text-[10px]">Total Tests</div>
                  <div className="font-bold text-slate-800">{selectedPackage.parametersCount} Parameters</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Sample Required</div>
                  <div className="font-bold text-slate-800">{selectedPackage.sampleType}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Fasting Prerequisite</div>
                  <div className="font-bold text-slate-800">{selectedPackage.fastingRequired}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Report Available In</div>
                  <div className="font-bold text-slate-800">{selectedPackage.tatHours} Hours</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  About This Health Package
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedPackage.description}
                </p>
              </div>

              {/* Tests Included Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  All Tests Included by Organ &amp; Category
                </h4>
                <div className="space-y-3">
                  {selectedPackage.testsIncluded.map((group, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-2xs"
                    >
                      <div className="text-xs font-bold text-brand-navy flex items-center justify-between">
                        <span>{group.categoryName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {group.testNames.length} Parameters
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {group.testNames.map((testName, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-100"
                          >
                            {testName}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] text-slate-400">Total Price</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-brand-navy">
                    ₹{selectedPackage.discountPrice}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    ₹{selectedPackage.originalPrice}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onAddToCart(selectedPackage, 'PACKAGE');
                    setSelectedPackage(null);
                  }}
                  className="px-6 py-2.5 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Cart &amp; Book</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
