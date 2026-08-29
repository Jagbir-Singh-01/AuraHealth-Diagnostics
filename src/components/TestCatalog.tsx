import React, { useState } from 'react';
import {
  Search,
  Plus,
  Info,
  Clock,
  FlaskConical,
  Utensils,
  Check,
  X,
  Sparkles,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { POPULAR_TESTS } from '../data/mockData';
import { TestItem } from '../types';

interface TestCatalogProps {
  onAddToCart: (test: TestItem, type: 'TEST') => void;
  selectedTest: TestItem | null;
  setSelectedTest: (test: TestItem | null) => void;
}

export const TestCatalog: React.FC<TestCatalogProps> = ({
  onAddToCart,
  selectedTest,
  setSelectedTest,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    { id: 'ALL', label: 'All Pathology Tests' },
    { id: 'Routine Pathology', label: '🩸 Routine Hemogram' },
    { id: 'Diabetes', label: '🩺 Diabetes & Sugar' },
    { id: 'Vitamins', label: '☀️ Vitamins & Minerals' },
    { id: 'Thyroid', label: '🦋 Thyroid Panel' },
    { id: 'Heart', label: '❤️ Heart & Lipid' },
    { id: 'Liver & Kidney', label: '🧪 Liver & Kidney' },
    { id: 'Allergy & Smog', label: '🌫️ Allergy & Smog' },
    { id: 'Seasonal & Fever', label: '🌡️ Seasonal Fever & Dengue' },
    { id: 'Cancer Screening', label: '🔬 Cancer Biomarkers' },
    { id: 'Women Health', label: '🌸 Prenatal & Women' },
  ];

  const filteredTests = POPULAR_TESTS.filter((t) => {
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <FlaskConical className="w-3.5 h-3.5" /> Pathology Directory
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Book Individual Diagnostic Tests
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Over 500+ NABL accredited pathology and biochemistry parameters with home collection options.
          </p>
        </div>

        {/* Search inside catalog */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by test name or code..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Category Horizontal Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === c.id
                ? 'bg-brand-navy text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTests.map((test) => {
          const discountPercent = Math.round(
            ((test.originalPrice - test.discountPrice) / test.originalPrice) * 100
          );

          return (
            <div
              key={test.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {test.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {test.isWinterSeasonal && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        Winter Care
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {discountPercent}% OFF
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-600 transition leading-snug">
                    {test.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{test.description}</p>
                </div>

                {/* Badges / Specs */}
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-1">
                  <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100 flex items-center gap-1">
                    <FlaskConical className="w-3 h-3 text-brand-teal" /> {test.sampleType}
                  </span>
                  <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-500" /> {test.tatHours}h Report
                  </span>
                  <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100 flex items-center gap-1">
                    <Utensils className="w-3 h-3 text-amber-500" /> {test.fastingRequired}
                  </span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-brand-navy">₹{test.discountPrice}</span>
                    <span className="text-xs text-slate-400 line-through">₹{test.originalPrice}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTest(test)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                    title="View Test Details"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onAddToCart(test, 'TEST')}
                    className="px-3.5 py-2 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTests.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Tests Found</h3>
          <p className="text-xs text-slate-500">
            We couldn't find any test matching "{searchTerm}". Please try a different search or contact our lab desk.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
            }}
            className="text-xs font-bold text-brand-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Single Test Modal */}
      {selectedTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-brand-50 to-white">
              <div>
                <span className="text-[10px] font-mono font-bold bg-brand-100 text-brand-800 px-2 py-0.5 rounded">
                  {selectedTest.code}
                </span>
                <h2 className="text-xl font-black text-brand-navy mt-1">{selectedTest.name}</h2>
                <span className="text-xs text-slate-500">{selectedTest.category}</span>
              </div>
              <button
                onClick={() => setSelectedTest(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-2xl text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Sample</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedTest.sampleType}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Fasting</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedTest.fastingRequired}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Report In</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedTest.tatHours} Hours</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Why Is This Test Conducted?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedTest.whyTakeThisTest}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Parameters Measured ({selectedTest.parametersList.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTest.parametersList.map((p, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Patient Preparation Instructions
                </h4>
                <ul className="space-y-1 text-xs text-slate-600">
                  {selectedTest.preparationInstructions.map((prep, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{prep}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-brand-navy">₹{selectedTest.discountPrice}</span>
                <span className="text-xs text-slate-400 line-through">₹{selectedTest.originalPrice}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTest(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onAddToCart(selectedTest, 'TEST');
                    setSelectedTest(null);
                  }}
                  className="px-5 py-2.5 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add to Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
