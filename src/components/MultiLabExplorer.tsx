import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Star,
  Clock,
  MapPin,
  CheckCircle2,
  Search,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { LAB_BRANDS, POPULAR_TESTS, HEALTH_PACKAGES } from '../data/mockData';
import { LabBrand, TestItem } from '../types';

interface MultiLabExplorerProps {
  selectedCity: string;
  onOpenTestComparison: (test: TestItem) => void;
}

export const MultiLabExplorer: React.FC<MultiLabExplorerProps> = ({
  selectedCity,
  onOpenTestComparison,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<LabBrand | null>(LAB_BRANDS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBrands = LAB_BRANDS.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-brand-navy via-brand-darkBlue to-brand-800 text-white py-12 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-teal-500/20 text-brand-teal px-3.5 py-1 rounded-full border border-teal-500/30">
            <Building2 className="w-3.5 h-3.5" /> North India Multi-Lab Diagnostic Network
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Compare &amp; Book Across Certified Diagnostic Labs
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Choose from India&rsquo;s most trusted NABL &amp; CAP accredited laboratory networks. Compare test prices, report turnaround times, and home sample collection slots in <strong>{selectedCity}</strong>.
          </p>
        </div>
      </section>

      {/* Lab Brands Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search diagnostic labs (Agilus, Dr Lal, Max Lab, Metropolis, Thyrocare)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-800"
          />
        </div>

        {/* Labs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className={`bg-white rounded-3xl border-2 transition-all duration-300 p-6 flex flex-col justify-between space-y-4 ${
                selectedBrand?.id === brand.id
                  ? 'border-brand-500 shadow-card-hover ring-2 ring-brand-500/20'
                  : 'border-slate-200/90 shadow-card hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                {/* Header with Badge & Rating */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-lg font-black text-brand-navy">{brand.name}</span>
                    <p className="text-xs text-brand-teal font-semibold mt-0.5">{brand.tagline}</p>
                  </div>
                  {brand.badge && (
                    <span className="text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full shrink-0">
                      {brand.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{brand.rating}</span>
                    <span className="text-slate-400 text-[10px]">({brand.reviewCount} reviews)</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{brand.isCapAccredited ? 'NABL & CAP' : 'NABL Certified'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{brand.description}</p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <div className="text-slate-700 flex items-center justify-between">
                    <span className="text-slate-500">North India Centers:</span>
                    <strong className="text-brand-navy">{brand.totalCentersNorthIndia}+ Centers</strong>
                  </div>
                  <div className="text-slate-700 flex items-center justify-between">
                    <span className="text-slate-500">Home Collection:</span>
                    <strong className="text-emerald-700">{brand.homeCollectionSpeed}</strong>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  setSelectedBrand(brand);
                  // Open first popular test for comparison
                  if (POPULAR_TESTS[0]) onOpenTestComparison(POPULAR_TESTS[0]);
                }}
                className="w-full py-2.5 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center gap-2"
              >
                <span>Compare Tests in {brand.shortName}</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-teal" />
              </button>
            </div>
          ))}
        </div>

        {/* Popular Tests Multi-Lab Comparison Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-1 rounded">
                Live Price &amp; Speed Matrix
              </span>
              <h3 className="text-xl font-black text-brand-navy mt-1">
                Compare Top Pathology Tests Across Laboratories
              </h3>
            </div>
            <p className="text-xs text-slate-400">Showing accredited labs serving {selectedCity}</p>
          </div>

          <div className="space-y-4">
            {POPULAR_TESTS.slice(0, 5).map((test) => (
              <div
                key={test.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-brand-navy">{test.name}</h4>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                      {test.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {test.parametersCount} Parameters · {test.fastingRequired} · Sample: {test.sampleType}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Starting from</span>
                    <span className="text-base font-black text-emerald-600">
                      ₹{Math.min(...test.labOfferings.map((o) => o.discountPrice))}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenTestComparison(test)}
                    className="px-4 py-2 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>Compare {test.labOfferings.length} Labs</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-teal" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
