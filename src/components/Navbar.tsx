import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  FileText,
  Upload,
  ShieldCheck,
  Menu,
  X,
  Clock,
  Activity,
  UserCheck,
  Sparkles,
  Stethoscope,
  Building2,
  User,
  UserPlus,
  Bell,
} from 'lucide-react';
import { PatientProfile } from '../types';

interface NavbarProps {
  selectedCity: string;
  onOpenCityModal: () => void;
  onOpenPrescriptionModal: () => void;
  onOpenCartDrawer: () => void;
  onOpenRegistrationModal: () => void;
  patientProfile: PatientProfile;
  unreadNotificationsCount: number;
  cartCount: number;
  cartTotal: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchFocus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCity,
  onOpenCityModal,
  onOpenPrescriptionModal,
  onOpenCartDrawer,
  onOpenRegistrationModal,
  patientProfile,
  unreadNotificationsCount,
  cartCount,
  cartTotal,
  activeTab,
  setActiveTab,
  onSearchFocus,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-nav">
      {/* Top Utility Bar */}
      <div className="bg-brand-navy text-white text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Location & Toll-Free */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={onOpenCityModal}
              className="flex items-center gap-1.5 bg-brand-darkBlue/80 hover:bg-brand-darkBlue px-3 py-1 rounded-full text-brand-300 hover:text-white transition border border-brand-500/30 text-[11px] font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-teal" />
              <span className="truncate max-w-[150px]">{selectedCity}</span>
              <span className="text-slate-400 text-[10px]">▼</span>
            </button>

            <div className="hidden md:flex items-center gap-1.5 text-slate-300 text-[11px]">
              <Phone className="w-3 h-3 text-brand-teal" />
              <span>North India 24x7 Helpline:</span>
              <a href="tel:18001202872" className="font-bold text-white hover:text-brand-300 transition">
                1800-120-AURA (2872)
              </a>
            </div>

            <div className="hidden lg:flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <Clock className="w-3 h-3" />
              <span>Direct Lab Billing · ₹0 Platform Advance Fee</span>
            </div>
          </div>

          {/* Right: Accreditations, Patient Login & Operations */}
          <div className="flex items-center gap-3 text-[11px] text-slate-300 ml-auto">
            {/* Patient Registration / Profile Trigger */}
            <button
              onClick={onOpenRegistrationModal}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black transition ${
                patientProfile.isLoggedIn
                  ? 'bg-brand-500/30 text-white border border-brand-500/50'
                  : 'bg-gradient-to-r from-brand-coral to-amber-500 text-white shadow-sm hover:opacity-95 ring-2 ring-amber-400/30'
              }`}
            >
              {patientProfile.isLoggedIn ? (
                <>
                  <User className="w-3.5 h-3.5 text-brand-teal" />
                  <span>Hello, {patientProfile.fullName.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register / Sign In</span>
                </>
              )}
            </button>

            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> NABL &amp; CAP Labs
            </span>

            <div className="h-3 w-px bg-slate-700 hidden sm:block" />

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded transition relative ${
                activeTab === 'admin'
                  ? 'bg-brand-coral text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>Operations Portal</span>
              {unreadNotificationsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[9px] font-black flex items-center justify-center animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-navy via-brand-darkBlue to-brand-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
            <Activity className="w-6 h-6 text-brand-teal" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-brand-navy">AuraHealth</span>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                Multi-Lab
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              Compare &amp; Direct Register Across Certified Diagnostic Labs
            </p>
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden xl:flex flex-1 max-w-sm mx-2">
          <div
            onClick={onSearchFocus}
            className="w-full relative flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-400 cursor-text transition group shadow-inner"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition mr-2.5" />
            <span className="truncate">Type test name (CBC, HbA1c, Vitamin D)...</span>
            <kbd className="ml-auto text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-700">
          <button
            onClick={() => setActiveTab('compare-labs')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'compare-labs'
                ? 'text-brand-navy bg-brand-50 font-bold ring-1 ring-brand-500/20'
                : 'hover:text-brand-navy hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-brand-teal" />
            <span>Compare Labs</span>
            <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded-full">
              7 Chains
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-2 rounded-lg transition ${
              activeTab === 'tests'
                ? 'text-brand-600 bg-brand-50 font-bold'
                : 'hover:text-brand-600 hover:bg-slate-50'
            }`}
          >
            All Tests
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`px-3 py-2 rounded-lg transition ${
              activeTab === 'packages'
                ? 'text-brand-600 bg-brand-50 font-bold'
                : 'hover:text-brand-600 hover:bg-slate-50'
            }`}
          >
            Packages
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1 ${
              activeTab === 'doctors'
                ? 'text-brand-teal bg-teal-50 font-bold ring-1 ring-brand-teal/30'
                : 'text-brand-teal hover:bg-teal-50/60 font-bold'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-brand-teal" />
            <span>Doctor Consult</span>
          </button>

          <button
            onClick={() => setActiveTab('smog')}
            className={`px-3 py-2 rounded-lg transition relative flex items-center gap-1 ${
              activeTab === 'smog'
                ? 'text-amber-800 bg-amber-50 font-bold'
                : 'text-amber-700 hover:bg-amber-50/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Winter AQI</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'text-brand-600 bg-brand-50 font-bold'
                : 'hover:text-brand-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-brand-teal" />
            <span>Reports</span>
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Upload Prescription */}
          <button
            onClick={onOpenPrescriptionModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-navy bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200"
          >
            <Upload className="w-3.5 h-3.5 text-brand-navy" />
            <span>Upload Rx</span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={onOpenCartDrawer}
            className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-brand-navy transition flex items-center gap-2"
            aria-label="View Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-coral text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-bounce">
                {cartCount}
              </span>
            )}
            {cartTotal > 0 && (
              <span className="hidden lg:inline text-xs font-bold text-slate-900">
                ₹{cartTotal}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl md:hidden text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3 animate-fade-in shadow-lg">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRegistrationModal();
            }}
            className={`w-full p-3 text-left rounded-xl text-xs font-bold flex items-center justify-between transition ${
              patientProfile.isLoggedIn
                ? 'bg-brand-50 text-brand-navy border border-brand-200'
                : 'bg-gradient-to-r from-brand-coral to-amber-500 text-white shadow-sm'
            }`}
          >
            <span>
              {patientProfile.isLoggedIn
                ? `👤 Hello, ${patientProfile.fullName}`
                : '👤 Register Patient / Sign In'}
            </span>
            <span className="text-[10px] underline">
              {patientProfile.isLoggedIn ? 'Edit Profile →' : 'Register Now →'}
            </span>
          </button>

          <div
            onClick={() => {
              setMobileMenuOpen(false);
              onSearchFocus();
            }}
            className="w-full flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-400"
          >
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <span>Type test name (CBC, HbA1c, Vitamin D)...</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                setActiveTab('compare-labs');
                setMobileMenuOpen(false);
              }}
              className="p-3 text-left bg-teal-50 rounded-xl text-xs font-bold text-teal-900 border border-teal-200"
            >
              🏢 Compare Labs
            </button>
            <button
              onClick={() => {
                setActiveTab('tests');
                setMobileMenuOpen(false);
              }}
              className="p-3 text-left bg-slate-50 rounded-xl text-xs font-semibold text-slate-800"
            >
              🩸 Blood Tests
            </button>
            <button
              onClick={() => {
                setActiveTab('packages');
                setMobileMenuOpen(false);
              }}
              className="p-3 text-left bg-slate-50 rounded-xl text-xs font-semibold text-slate-800"
            >
              📦 Packages
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="p-3 text-left bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              ⚙️ Operations Portal ({unreadNotificationsCount} Alerts)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
