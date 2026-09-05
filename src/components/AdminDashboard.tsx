import React, { useState } from 'react';
import {
  Activity,
  UserCheck,
  Building2,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Bell,
  Send,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Banknote,
} from 'lucide-react';
import { Booking, TeamNotification } from '../types';

interface AdminDashboardProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  notifications: TeamNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<TeamNotification[]>>;
  onNotify: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  setBookings,
  notifications,
  setNotifications,
  onNotify,
}) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(bookings[0] || null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'NOTIFICATIONS'>('REQUESTS');

  // Action input states
  const [assignedRider, setAssignedRider] = useState('Vikas Sharma (Fleet #108 - Certified)');
  const [customLabToken, setCustomLabToken] = useState('');

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const handleRegisterWithLab = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const labPrefix = (booking.selectedLabName || 'AGILUS').split(' ')[0].toUpperCase();
    const generatedToken = `${labPrefix}-LIMS-${Math.floor(1000 + Math.random() * 9000)}`;

    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'BOOKED_BY_TEAM' as const,
          officialLabRefNumber: generatedToken,
          teamNotes: `Registered in ${b.selectedLabName} LIMS on ${new Date().toLocaleTimeString()} by Operations Team.`,
          phlebotomist: {
            name: 'Vikas Sharma',
            phone: '+91 98112 34567',
            badgeNumber: `${labPrefix}-PHLEB-108`,
            vaccinationStatus: 'Fully Vaccinated & Verified',
            liveLocationStatus: 'Assigned for morning collection slot',
          },
        };
      }
      return b;
    });

    setBookings(updated);
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking(updated.find((b) => b.id === bookingId) || null);
    }
    onNotify(`✓ Registered "${booking.bookingNumber}" with ${booking.selectedLabName}! Lab Ref: ${generatedToken}`);
  };

  const handleDispatchConfirmation = (booking: Booking) => {
    onNotify(
      `📲 WhatsApp & SMS confirmation sent to ${booking.patientDetails.name} (+91 ${booking.patientDetails.phone}) with Lab Ref: ${booking.officialLabRefNumber || booking.bookingNumber}.`
    );
  };

  const handleMarkPaymentCollected = (bookingId: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentStatus: 'PAID_TO_LAB' as const,
          status: 'SAMPLE_COLLECTED' as const,
          teamNotes: 'Sample collected & direct payment received by visiting lab phlebotomist.',
        };
      }
      return b;
    });
    setBookings(updated);
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking(updated.find((b) => b.id === bookingId) || null);
    }
    onNotify(`Payment verified for order ${bookingId}. Status updated to Sample Collected.`);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesSearch =
      b.bookingNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.patientDetails.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.selectedLabName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.patientDetails.phone.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-slate-100 min-h-screen pb-16">
      {/* Top Banner */}
      <section className="bg-brand-navy text-white py-8 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-teal bg-teal-950 px-2.5 py-0.5 rounded border border-teal-800">
                Operations &amp; Fulfillment Center
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                ● Live Dispatch Queue
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              Multi-Lab Test Registration &amp; Dispatch Console
            </h1>
            <p className="text-xs text-slate-300">
              Review direct patient test requests, register them in official lab LIMS, dispatch phlebotomists, and track direct-to-lab payments.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('NOTIFICATIONS')}
              className="relative p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex items-center gap-2 text-xs font-bold transition shadow-sm"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Incoming Alerts</span>
              {unreadNotifCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand-coral text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('REQUESTS')}
              className={`p-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'REQUESTS'
                  ? 'bg-brand-teal text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              📋 All Orders ({bookings.length})
            </button>
          </div>
        </div>
      </section>

      {/* Main Operations Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        {/* Real-time incoming notifications banner */}
        {notifications.length > 0 && (
          <div className="bg-amber-500/10 border-2 border-amber-400/40 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm animate-bounce">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-amber-950">
                  {notifications.length} Direct Test Registration Requests Received
                </h4>
                <p className="text-xs text-amber-900 mt-0.5">
                  Latest: <strong>{notifications[0]?.patientName}</strong> requested {notifications[0]?.testNames.join(', ')} with <strong>{notifications[0]?.selectedLab}</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const latest = bookings.find((b) => b.bookingNumber === notifications[0]?.bookingNumber);
                if (latest) {
                  setSelectedBooking(latest);
                  setActiveTab('REQUESTS');
                }
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <span>Process Latest Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Dashboard 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Order Queue */}
          <div className="lg:col-span-5 space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by Patient, Phone, Ref ID, Lab..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Status filter tabs */}
              <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
                {['ALL', 'REQUEST_RECEIVED', 'REGISTERED_WITH_LAB', 'SAMPLE_COLLECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                      statusFilter === st
                        ? 'bg-brand-navy text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'ALL' && 'All Orders'}
                    {st === 'REQUEST_RECEIVED' && '📥 New Requests'}
                    {st === 'REGISTERED_WITH_LAB' && '✓ Lab Registered'}
                    {st === 'SAMPLE_COLLECTED' && '🧪 Collected'}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredBookings.map((b) => {
                const isSelected = selectedBooking?.id === b.id;
                const isNew = b.status === 'PENDING_TEAM_BOOKING';

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className={`p-4 rounded-3xl border-2 cursor-pointer transition bg-white shadow-2xs space-y-2.5 ${
                      isSelected
                        ? 'border-brand-500 ring-2 ring-brand-500/20'
                        : isNew
                        ? 'border-amber-300 hover:border-amber-400 bg-amber-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-brand-navy">
                        {b.bookingNumber}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          b.status === 'PENDING_TEAM_BOOKING'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200 animate-pulse'
                            : b.status === 'BOOKED_BY_TEAM'
                            ? 'bg-sky-100 text-sky-900 border border-sky-200'
                            : b.status === 'SAMPLE_COLLECTED'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {b.status === 'PENDING_TEAM_BOOKING' && '📥 Action Needed: Register in Lab'}
                        {b.status === 'BOOKED_BY_TEAM' && '✓ Registered in Lab LIMS'}
                        {b.status === 'SAMPLE_COLLECTED' && '🧪 Sample Collected'}
                        {b.status === 'REPORT_GENERATED' && '📄 Report Released'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{b.patientDetails.name}</h4>
                      <p className="text-xs text-brand-teal font-semibold">
                        Lab: {b.selectedLabName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>🕒 {b.slotTime}</span>
                      <span className="font-black text-brand-navy">₹{b.totalAmount}</span>
                    </div>
                  </div>
                );
              })}

              {filteredBookings.length === 0 && (
                <div className="bg-white p-8 rounded-3xl text-center border border-slate-200 text-xs text-slate-400">
                  No orders found matching your search.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Detail & Lab Registration Actions */}
          <div className="lg:col-span-7">
            {selectedBooking ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Order Management Console
                    </span>
                    <h3 className="text-xl font-black text-brand-navy mt-0.5">
                      {selectedBooking.patientDetails.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ref #{selectedBooking.bookingNumber} · Created {selectedBooking.createdAt}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Collection Bill</span>
                    <span className="text-2xl font-black text-brand-navy">
                      ₹{selectedBooking.totalAmount}
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded block mt-0.5">
                      {selectedBooking.paymentStatus === 'PAID_TO_LAB'
                        ? '✓ Paid directly to Lab'
                        : 'Pay directly to Lab Phlebotomist'}
                    </span>
                  </div>
                </div>

                {/* Team Action Center */}
                <div className="bg-brand-50 p-5 rounded-3xl border border-brand-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-brand-teal" /> Team Lab Registration &amp; Dispatch Actions:
                    </h4>
                    <span className="text-xs font-bold text-brand-teal bg-white px-2.5 py-0.5 rounded-full border border-brand-200">
                      {selectedBooking.selectedLabName}
                    </span>
                  </div>

                  {selectedBooking.status === 'PENDING_TEAM_BOOKING' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600">
                        This patient requested direct test registration. Click below to register the test into <strong>{selectedBooking.selectedLabName}</strong> LIMS and generate the official lab barcode token:
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleRegisterWithLab(selectedBooking.id)}
                          className="px-5 py-2.5 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-black rounded-xl shadow transition flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Register with {selectedBooking.selectedLabName} LIMS</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedBooking.status === 'BOOKED_BY_TEAM' && (
                    <div className="space-y-3">
                      <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                        <div>
                          <strong>✓ Registered with Lab LIMS:</strong>{' '}
                          <span className="font-mono font-black text-brand-navy">
                            {selectedBooking.officialLabRefNumber}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          Phlebotomist Assigned
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleDispatchConfirmation(selectedBooking)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send WhatsApp / SMS Token to Patient</span>
                        </button>

                        <button
                          onClick={() => handleMarkPaymentCollected(selectedBooking.id)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                        >
                          <Banknote className="w-3.5 h-3.5 text-amber-400" />
                          <span>Mark Paid to Visiting Phlebotomist</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedBooking.status === 'SAMPLE_COLLECTED' && (
                    <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Sample Collected &amp; Direct Payment Received by Lab</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Sample is currently in {selectedBooking.selectedLabName} central testing facility. Clinical report release scheduled within 6 hours.
                      </p>
                    </div>
                  )}
                </div>

                {/* Patient & Location Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Patient Details:
                    </span>
                    <div>
                      <strong className="text-slate-900">{selectedBooking.patientDetails.name}</strong>{' '}
                      <span className="text-slate-500">
                        ({selectedBooking.patientDetails.age} Yrs · {selectedBooking.patientDetails.gender})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-brand-navy font-mono font-semibold">
                      <Phone className="w-3.5 h-3.5 text-brand-teal" />
                      <span>+91 {selectedBooking.patientDetails.phone}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Doorstep Phlebotomy Location:
                    </span>
                    <div className="flex items-start gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-brand-coral shrink-0 mt-0.5" />
                      <span>
                        {selectedBooking.patientDetails.address}, {selectedBooking.patientDetails.city} - {selectedBooking.patientDetails.pincode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ordered Tests List */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Tests Registered with Lab:
                  </span>
                  <div className="space-y-1.5">
                    {selectedBooking.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <strong className="text-slate-800">{it.title}</strong>
                          <span className="text-[10px] text-brand-teal block">
                            Target Lab: {selectedBooking.selectedLabName}
                          </span>
                        </div>
                        <span className="font-bold text-brand-navy">₹{it.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 text-xs text-slate-400">
                Select an order from the queue to view details and register with the lab.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
