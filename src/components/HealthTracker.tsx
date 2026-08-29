import React, { useState } from 'react';
import { Activity, TrendingUp, TrendingDown, Sparkles, CheckCircle, AlertCircle, Heart } from 'lucide-react';

export const HealthTracker: React.FC = () => {
  const [activeParam, setActiveParam] = useState<'hba1c' | 'cholesterol' | 'vitd' | 'ige'>('hba1c');

  const trackerData = {
    hba1c: {
      name: 'HbA1c (Glycosylated Hemoglobin)',
      unit: '%',
      normalRange: '< 5.7% (Normal), 5.7-6.4% (Prediabetes)',
      currentValue: 6.8,
      status: 'BORDERLINE / PREDIABETIC',
      statusColor: 'text-amber-600 bg-amber-50 border-amber-200',
      trend: 'improving',
      history: [
        { date: 'Oct 2025', val: 7.4, status: 'HIGH' },
        { date: 'Feb 2026', val: 7.1, status: 'HIGH' },
        { date: 'Aug 2026', val: 6.8, status: 'BORDERLINE' },
      ],
      insight: 'Your 3-month sugar average has dropped by 0.6% over the last 10 months following lifestyle changes. Continue dietary fiber management to reach target < 6.0%.'
    },
    cholesterol: {
      name: 'Total Cholesterol',
      unit: 'mg/dL',
      normalRange: '< 200 mg/dL (Desirable)',
      currentValue: 218,
      status: 'BORDERLINE HIGH',
      statusColor: 'text-amber-600 bg-amber-50 border-amber-200',
      trend: 'improving',
      history: [
        { date: 'Oct 2025', val: 245, status: 'HIGH' },
        { date: 'Feb 2026', val: 228, status: 'BORDERLINE' },
        { date: 'Aug 2026', val: 218, status: 'BORDERLINE' },
      ],
      insight: 'Total cholesterol reduced from 245 to 218 mg/dL. Adding 30 minutes of aerobic walking daily will help boost HDL good cholesterol.'
    },
    vitd: {
      name: 'Vitamin D 25-Hydroxy',
      unit: 'ng/mL',
      normalRange: '30 - 100 ng/mL (Optimal)',
      currentValue: 16.4,
      status: 'DEFICIENT',
      statusColor: 'text-red-600 bg-red-50 border-red-200',
      trend: 'improving',
      history: [
        { date: 'Oct 2025', val: 11.2, status: 'DEFICIENT' },
        { date: 'Feb 2026', val: 14.5, status: 'DEFICIENT' },
        { date: 'Aug 2026', val: 16.4, status: 'DEFICIENT' },
      ],
      insight: 'Extremely prevalent in North India due to indoor work and pollution filters. Supplementation with 60,000 IU weekly recommended under medical advice.'
    },
    ige: {
      name: 'Total Serum IgE (Smog & Aeroallergen Reactivity)',
      unit: 'IU/mL',
      normalRange: '< 100 IU/mL (Normal)',
      currentValue: 320,
      status: 'ELEVATED / ALLERGIC',
      statusColor: 'text-red-600 bg-red-50 border-red-200',
      trend: 'stable',
      history: [
        { date: 'Oct 2025', val: 340, status: 'ELEVATED' },
        { date: 'Feb 2026', val: 290, status: 'ELEVATED' },
        { date: 'Aug 2026', val: 320, status: 'ELEVATED' },
      ],
      insight: 'Elevated IgE reflects seasonal respiratory sensitization to particulate matter, dust mites, and crop smoke common in Delhi-NCR/Punjab.'
    }
  };

  const selected = trackerData[activeParam];

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-8">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5" /> Longitudinal Health Tracker
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-brand-navy">
              Smart Vital Trends for Rajesh Sharma
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative analysis of vital pathology parameters across consecutive diagnostic visits.
            </p>
          </div>

          {/* Biomarker Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
            <button
              onClick={() => setActiveParam('hba1c')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeParam === 'hba1c'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🩸 HbA1c Sugar
            </button>
            <button
              onClick={() => setActiveParam('cholesterol')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeParam === 'cholesterol'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ❤️ Cholesterol
            </button>
            <button
              onClick={() => setActiveParam('vitd')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeParam === 'vitd'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ☀️ Vitamin D
            </button>
            <button
              onClick={() => setActiveParam('ige')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeParam === 'ige'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌫️ Smog IgE
            </button>
          </div>
        </div>

        {/* Vital Metric Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {selected.name}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-brand-navy">{selected.currentValue}</span>
              <span className="text-sm font-semibold text-slate-500">{selected.unit}</span>
            </div>
            <div
              className={`inline-block text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${selected.statusColor}`}
            >
              {selected.status}
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
              Standard Biological Range: <br />
              <strong className="text-slate-700">{selected.normalRange}</strong>
            </div>
          </div>

          {/* Historical Trend Graph Bars */}
          <div className="md:col-span-8 space-y-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Parameter Progression (Last 3 Lab Visits)
            </div>

            <div className="grid grid-cols-3 gap-3">
              {selected.history.map((hist, idx) => {
                const heightPercent = Math.min(100, Math.max(25, (hist.val / (selected.currentValue * 1.3)) * 100));

                return (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-between text-center space-y-3"
                  >
                    <span className="text-[11px] font-bold text-slate-500">{hist.date}</span>

                    <div className="w-12 bg-slate-200 rounded-full h-24 flex items-end justify-center p-1">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-full transition-all duration-500 ${
                          idx === selected.history.length - 1
                            ? 'bg-brand-500 shadow-md'
                            : 'bg-slate-400'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="text-sm font-black text-brand-navy">
                        {hist.val} <span className="text-[10px] font-normal">{selected.unit}</span>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          hist.status === 'NORMAL'
                            ? 'text-emerald-700 bg-emerald-100'
                            : 'text-amber-800 bg-amber-100'
                        }`}
                      >
                        {hist.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Smart Medical Insight */}
            <div className="bg-brand-50/70 p-4 rounded-2xl border border-brand-200 text-xs text-brand-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Medical Trend Summary:</strong>
                <p className="mt-0.5 leading-relaxed">{selected.insight}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
