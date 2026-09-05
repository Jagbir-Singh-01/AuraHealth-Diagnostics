import React, { useState } from 'react';
import {
  X,
  Building2,
  Clock,
  Star,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';
import { TestItem, HealthPackage, LabTestOffering } from '../types';

interface LabComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TestItem | HealthPackage | null;
  onSelectLabOffering: (item: TestItem | HealthPackage, offering: LabTestOffering) => void;
  selectedCity: string;
}

export const LabComparisonModal: React.FC<LabComparisonModalProps> = ({
  isOpen,
  onClose,
  item,
  onSelectLabOffering,
  selectedCity,
}) => {
  const [sortBy, setSortBy] = useState<'PRICE_LOW' | 'TAT_FAST' | 'RATING_HIGH'>('PRICE_LOW');
  const [filterNablOnly, setFilterNablOnly] = useState(false);

  if (!isOpen || !item) return null;

  const offerings = [...(item.labOfferings || [])];

  const filteredOfferings = offerings.filter((offering) => {
    if (filterNablOnly && !offering.isNablAccredited) return false;
    return true;
  });

  filteredOfferings.sort((a, b) => {
    if (sortBy === 'PRICE_LOW') return a.discountPrice - b.discountPrice;
    if (sortBy === 'TAT_FAST') return a.tatHours - b.tatHours;
    if (sortBy === 'RATING_HIGH') return b.rating - a.rating;
    return 0;
  });

  const lowestPrice = Math.min(...offerings.map((o) => o.discountPrice));
  const fastestTat = Math.min(...offerings.map((o) => o.tatHours));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-brand-navy via-brand-darkBlue to-brand-800 text-white">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-teal bg-teal-950/70 px-2.5 py-0.5 rounded border border-teal-800/70">
                Step 2 &amp; 3: Multi-Lab Price &amp; Quality Comparison
              </span>
              <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                📍 {selectedCity}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-1">
              Compare Labs for &ldquo;{item.name}&rdquo;
            </h2>
            <p className="text-xs text-slate-300">
              {item.parametersCount} Parameters Included · Fasting: {item.fastingRequired} · Sample: {item.sampleType}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sort & Filter Strip */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Sort by:</span>
            <button
              onClick={() => setSortBy('PRICE_LOW')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                sortBy === 'PRICE_LOW'
                  ? 'bg-brand-navy text-white shadow-sm font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Lowest Price 💰
            </button>
            <button
              onClick={() => setSortBy('TAT_FAST')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                sortBy === 'TAT_FAST'
                  ? 'bg-brand-navy text-white shadow-sm font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Fastest Report ⚡
            </button>
            <button
              onClick={() => setSortBy('RATING_HIGH')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                sortBy === 'RATING_HIGH'
                  ? 'bg-brand-navy text-white shadow-sm font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Top Rated ⭐
            </button>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-700 font-semibold">
            <input
              type="checkbox"
              checked={filterNablOnly}
              onChange={(e) => setFilterNablOnly(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>NABL / CAP Certified Only</span>
          </label>
        </div>

        {/* Offerings List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {filteredOfferings.map((offering) => {
            const isLowestPrice = offering.discountPrice === lowestPrice;
            const isFastest = offering.tatHours === fastestTat;
            const discountPct = Math.round(
              ((offering.originalPrice - offering.discountPrice) / offering.originalPrice) * 100
            );

            return (
              <div
                key={offering.labId}
                className="bg-white rounded-2xl border-2 border-slate-200/90 hover:border-brand-500 shadow-sm hover:shadow-md transition-all p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Lab Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-black text-brand-navy">{offering.labName}</span>

                    {offering.labBadge && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full">
                        {offering.labBadge}
                      </span>
                    )}

                    {isLowestPrice && (
                      <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" /> Best Price in {selectedCity}
                      </span>
                    )}

                    {isFastest && (
                      <span className="text-[10px] font-extrabold bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3 text-sky-600" /> Fastest TAT ({offering.tatHours}h)
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{offering.rating}</span>
                      <span className="text-slate-400 text-[10px]">({offering.reviewCount} reviews)</span>
                    </div>

                    <span className="text-slate-300">•</span>

                    <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{offering.isCapAccredited ? 'NABL & CAP Accredited' : 'NABL Certified'}</span>
                    </div>

                    <span className="text-slate-300">•</span>

                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                      <Clock className="w-3.5 h-3.5 text-brand-teal" />
                      <span>Report in {offering.tatText}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl flex items-center gap-2 border border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-brand-navy" />
                    <span>
                      Earliest Home Phlebotomist Slot: <strong className="text-brand-navy">{offering.earliestSlot}</strong>
                    </span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-brand-navy">₹{offering.discountPrice}</span>
                      <span className="text-xs text-slate-400 line-through">₹{offering.originalPrice}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">
                      Save {discountPct}% OFF
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectLabOffering(item, offering);
                      onClose();
                    }}
                    className="px-5 py-2.5 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl shadow-md hover:shadow transition flex items-center gap-1.5"
                  >
                    <span>Book with {offering.labShortName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-teal" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredOfferings.length === 0 && (
            <div className="text-center py-10 space-y-2">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-xs text-slate-500 font-semibold">
                No labs matching the selected filter criteria.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
