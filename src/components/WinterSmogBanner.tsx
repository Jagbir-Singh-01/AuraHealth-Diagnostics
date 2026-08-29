import React from 'react';
import { Wind, AlertTriangle, ShieldCheck, Check, Sparkles, ArrowRight, Activity, ThermometerSnowflake } from 'lucide-react';
import { HEALTH_PACKAGES } from '../data/mockData';
import { HealthPackage } from '../types';

interface WinterSmogBannerProps {
  onSelectPackage: (pkg: HealthPackage) => void;
  onAddToCart: (pkg: HealthPackage, type: 'PACKAGE') => void;
}

export const WinterSmogBanner: React.FC<WinterSmogBannerProps> = ({
  onSelectPackage,
  onAddToCart,
}) => {
  const smogPackage = HEALTH_PACKAGES.find((p) => p.id === 'pkg-winter-smog-01') || HEALTH_PACKAGES[0];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-brand-navy to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-slate-800 my-8">
      {/* Decorative background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Context & Symptom Checklist */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
              <ThermometerSnowflake className="w-3.5 h-3.5" /> North India Winter &amp; Smog Alert
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-950/80 text-red-300 px-3 py-1 rounded-full border border-red-500/30">
              <Wind className="w-3.5 h-3.5" /> PM2.5 / PM10 Defense
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
              Protect Your Lungs &amp; Immunity Against North India's Toxic Winter Smog
            </h2>
            <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
              Every winter, severe atmospheric inversions and agricultural stubble smoke in Punjab, Haryana, Delhi NCR, and UP trap microscopic PM2.5 pollutants. These trigger hidden airway inflammation, spike systemic hs-CRP, and severely deplete Vitamin D.
            </p>
          </div>

          {/* Smog Symptoms Checklist */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/80 space-y-2.5">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Watch Out for These Smog Symptoms:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>Persistent morning dry cough &amp; throat ache</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>Burning sensation in eyes &amp; sneezing fits</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>Shortness of breath during outdoor walks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>Unexplained winter fatigue &amp; low immunity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Highlight Package Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-6 border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-teal bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-500/20">
                Recommended Checkup
              </span>
              <h3 className="text-lg font-bold text-white mt-1.5">
                {smogPackage.name}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-amber-400">₹{smogPackage.discountPrice}</div>
              <div className="text-xs text-slate-400 line-through">₹{smogPackage.originalPrice}</div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Includes Total IgE Allergy Screen, Absolute Eosinophils, High-Sensitivity CRP, Vitamin D3/B12, Complete Blood Count, Liver &amp; Kidney profiles.
          </p>

          <div className="space-y-1.5 pt-2 border-t border-slate-700/80">
            {smogPackage.highlights.slice(0, 4).map((hl, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{hl}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <button
              onClick={() => onSelectPackage(smogPackage)}
              className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition text-center"
            >
              View All 74 Tests
            </button>
            <button
              onClick={() => onAddToCart(smogPackage, 'PACKAGE')}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-brand-coral hover:from-amber-600 hover:to-brand-coral text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-1.5"
            >
              <span>Book at ₹{smogPackage.discountPrice}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
