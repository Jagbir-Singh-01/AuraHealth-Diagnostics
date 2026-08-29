import React from 'react';
import {
  Activity,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Heart,
  ExternalLink,
  MessageCircle,
  Stethoscope,
} from 'lucide-react';
import { NORTH_INDIA_CITIES } from '../data/mockData';

interface FooterProps {
  onSelectCity: (city: string) => void;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCity, setActiveTab }) => {
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Main 4-Column Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-500 text-white flex items-center justify-center shadow-md">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-white">AuraHealth</span>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal ml-1 bg-teal-950 px-1.5 py-0.5 rounded border border-teal-800">
                  Diagnostics
                </span>
                <p className="text-[10px] text-slate-400">North India's Leading Lab &amp; Telehealth Network</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Operating state-of-the-art NABL &amp; CAP accredited reference laboratories and over 250 collection centers across Delhi NCR, Punjab, Haryana, Uttar Pradesh, Rajasthan, Himachal Pradesh, Uttarakhand, and J&amp;K.
            </p>

            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-300">
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> NABL Accredited
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> CAP Certified
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ISO 15189:2022
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Patient Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className="hover:text-brand-teal transition text-brand-teal font-bold flex items-center gap-1"
                >
                  <Stethoscope className="w-3 h-3" /> Doctor Consultation
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('packages')}
                  className="hover:text-brand-teal transition"
                >
                  Health Checkup Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('tests')}
                  className="hover:text-brand-teal transition"
                >
                  Book Blood Tests
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('smog')}
                  className="hover:text-brand-teal transition text-amber-300"
                >
                  Winter Smog Defense Panel
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="hover:text-brand-teal transition"
                >
                  Download Smart Report
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('labs')}
                  className="hover:text-brand-teal transition"
                >
                  Find Nearest Lab
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Tests */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Popular North India Tests
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <span className="text-slate-400">•</span> Complete Blood Count (CBC with ESR)
              </li>
              <li>
                <span className="text-slate-400">•</span> HbA1c Glycosylated Sugar Average
              </li>
              <li>
                <span className="text-slate-400">•</span> Vitamin D3 &amp; Vitamin B12 Levels
              </li>
              <li>
                <span className="text-slate-400">•</span> Lipid Profile Comprehensive
              </li>
              <li>
                <span className="text-slate-400">•</span> Total IgE &amp; Aeroallergen Panel
              </li>
              <li>
                <span className="text-slate-400">•</span> Liver Function &amp; Kidney Function Test
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              24x7 North India Helpline
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-teal shrink-0" />
                <div>
                  <div className="font-bold text-white text-sm">1800-120-AURA (2872)</div>
                  <div className="text-[10px] text-slate-400">Toll-Free Patient Support</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/919810122399"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition font-medium"
                >
                  WhatsApp Booking: +91 98101 22399
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-teal shrink-0" />
                <span>support@aurahealth.in</span>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                <span>Home Sample Collection: 6:00 AM - 8:00 PM (All 7 Days)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Northern Cities Hubs Grid */}
        <div className="pt-8 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Doorstep Sample Collection &amp; Teleconsultation Cities:
          </h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {NORTH_INDIA_CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => onSelectCity(c.name)}
                className="bg-slate-800/60 hover:bg-brand-darkBlue px-2.5 py-1 rounded-lg text-slate-300 hover:text-white transition text-[11px] border border-slate-700/60"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 AuraHealth Diagnostics &amp; Telehealth Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-slate-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-300">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-300">
              NABL Accreditations
            </a>
            <a href="#" className="hover:text-slate-300">
              Medical Board Guidelines
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
