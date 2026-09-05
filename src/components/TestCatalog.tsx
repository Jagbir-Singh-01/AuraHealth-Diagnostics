import React, { useState } from 'react';
import {
  Search,
  Filter,
  Clock,
  Droplet,
  Info,
  ShieldCheck,
  Check,
  ChevronRight,
  Sparkles,
  Building2,
  ArrowRight,
  Star,
} from 'lucide-react';
import { POPULAR_TESTS } from '../data/mockData';
import { TestItem, LabTestOffering } from '../types';

interface TestCatalogProps {
  onOpenTestComparison: (test: TestItem) => void;
  selectedTest: TestItem | null;
  setSelectedTest: (test: TestItem | null) => void;
}

export const TestCatalog: React.FC<TestCatalogProps> = ({
  onOpenTestComparison,
  selectedTest,
  setSelectedTest,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const categories = [
    { id: 'ALL', label: 'All Tests' },
    { id: 'Routine Pathology', label: 'Routine Blood' },
    { id: 'Diabetes', label: 'Diabetes & Sugar' },
    { id: 'Thyroid', label: 'Thyroid' },
    { id: 'Heart', label: 'Lipid & Heart' },
    { id: 'Liver & Kidney', label: 'Liver & Kidney' },
    { id: 'Vitamins', label: 'Vitamins & Iron' },
    { id: 'Allergy & Smog', label: 'Smog & Allergy' },
    { id: 'Seasonal & Fever', label: 'Fever & Dengue' },
  ];

  const filteredTests = POPULAR_TESTS.filter((test) => {
    const matchesCategory = activeCategory === 'ALL' || test.category === activeCategory;
    const matchesSearch =
      test.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      test.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      test.parametersList.some((p) => p.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-12 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600 bg-brand-50 px-2.5 py-1 rounded">
              Step 2 &amp; 3: Pathology Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Type or Select Any Medical Test to Compare Labs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Transparent pricing, turnaround times, and NABL certifications from Agilus, Dr. Lal, Max Lab, Metropolis, and Thyrocare.
            </p>
          </div>

          {/* Search within catalog */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by test or parameter..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const lowestPrice = Math.min(...test.labOfferings.map((o) => o.discountPrice));
            const labsCount = test.labOfferings.length;

            return (
              <div
                key={test.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded font-mono">
                      {test.code}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {test.category}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-600 transition leading-snug">
                      {test.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{test.description}</p>
                  </div>

                  {/* Test Specs */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Sample Type:</span>
                      <strong className="text-slate-800 truncate block">{test.sampleType}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Fasting:</span>
                      <strong className="text-slate-800 truncate block">{test.fastingRequired}</strong>
                    </div>
                  </div>

                  {/* Lab Brands Bar Preview */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Available at {labsCount} Diagnostic Labs:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {test.labOfferings.map((offering) => (
                        <span
                          key={offering.labId}
                          className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                        >
                          {offering.labShortName} (₹{offering.discountPrice})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Compare Labs CTA */}
                <div className="p-6 pt-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Starting from</span>
                    <span className="text-lg font-black text-brand-navy">₹{lowestPrice}</span>
                  </div>

                  <button
                    onClick={() => onOpenTestComparison(test)}
                    className="px-4 py-2.5 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                  >
                    <Building2 className="w-3.5 h-3.5 text-brand-teal" />
                    <span>Compare &amp; Book Labs</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-teal" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTests.length === 0 && (
          <div className="p-12 text-center bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-slate-700">No Tests Found</h4>
            <p className="text-xs text-slate-400">
              Try searching with another keyword or browse our full packages.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
