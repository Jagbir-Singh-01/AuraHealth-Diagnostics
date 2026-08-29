import React, { useState } from 'react';
import {
  UserCheck,
  Truck,
  CheckCircle2,
  Clock,
  FlaskConical,
  FileCheck,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { Booking, TestItem } from '../types';
import { INITIAL_BOOKINGS, POPULAR_TESTS } from '../data/mockData';

interface AdminDashboardProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  setBookings,
}) => {
  const [selectedCityFilter, setSelectedCityFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'orders' | 'pathology' | 'catalog'>('orders');

  // Phlebotomist Dispatch Assignment
  const [assigningBooking, setAssigningBooking] = useState<Booking | null>(null);
  const [selectedRider, setSelectedRider] = useState('Vikas Sharma (Gurgaon Hub - Fleet #108)');

  const sampleRiders = [
    'Vikas Sharma (Gurgaon Hub - Fleet #108)',
    'Harjit Singh (Chandigarh Tricity Hub - Fleet #042)',
    'Amitabh Dixit (South Delhi Green Park Hub - Fleet #015)',
    'Suresh Meena (Jaipur C-Scheme Hub - Fleet #088)',
    'Mohd. Tariq (Lucknow Hazratganj Hub - Fleet #063)',
  ];

  const handleUpdateStatus = (bookingId: string, newStatus: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const handleAssignRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningBooking) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === assigningBooking.id
          ? {
              ...b,
              status: 'PHLEBOTOMIST_ASSIGNED',
              phlebotomist: {
                name: selectedRider.split('(')[0].trim(),
                phone: '+91 98112 44990',
                badgeNumber: selectedRider.match(/Fleet #\d+/)?.[0] || 'PHLEB-NORTH',
                vaccinationStatus: '100% Vaccinated & Verified',
                liveLocationStatus: 'En-route to patient pickup',
              },
            }
          : b
      )
    );

    setAssigningBooking(null);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesCity =
      selectedCityFilter === 'ALL' || b.patientDetails.city.includes(selectedCityFilter);
    const matchesStatus =
      selectedStatusFilter === 'ALL' || b.status === selectedStatusFilter;
    return matchesCity && matchesStatus;
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-coral bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5" /> North India Operations Console
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Lab &amp; Phlebotomy Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor real-time doorstep sample collections, rider dispatch, and pathologist report release.
          </p>
        </div>

        {/* Console Tab Pills */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'orders'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Live Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('pathology')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'pathology'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔬 Pathologist Sign-Off
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'catalog'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏷️ Test Pricing
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400">Total Bookings</div>
          <div className="text-2xl font-black text-brand-navy mt-1">{bookings.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Across Delhi-NCR, PB &amp; UP
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400">Sample Dispatches</div>
          <div className="text-2xl font-black text-brand-teal mt-1">
            {bookings.filter((b) => b.status === 'PHLEBOTOMIST_ASSIGNED').length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Active Phlebotomists</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400">Reports Released</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {bookings.filter((b) => b.status === 'REPORT_GENERATED').length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Digitally Signed &amp; QR Verified</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400">Gross Revenue</div>
          <div className="text-2xl font-black text-brand-navy mt-1">₹{totalRevenue}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Online UPI &amp; Cash on Collection</div>
        </div>
      </div>

      {/* Tab 1: Orders Queue */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Filter Location:</span>
              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              >
                <option value="ALL">All Northern Hubs</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Gurugram">Gurugram</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Lucknow">Lucknow</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Status:</span>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">New Confirmed</option>
                <option value="PHLEBOTOMIST_ASSIGNED">Rider Assigned</option>
                <option value="REPORT_GENERATED">Report Ready</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold bg-slate-50/50">
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Location &amp; Slot</th>
                  <th className="py-3 px-4">Tests Ordered</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-brand-navy">
                      {b.bookingNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{b.patientDetails.name}</div>
                      <div className="text-[11px] text-slate-400">📞 {b.patientDetails.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium truncate max-w-[180px]">
                        {b.patientDetails.address}, {b.patientDetails.city}
                      </div>
                      <div className="text-[10px] text-brand-600 flex items-center gap-1 mt-0.5 font-semibold">
                        <Clock className="w-3 h-3" /> {b.slotDate} ({b.slotTime})
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-700 font-medium truncate max-w-[200px]">
                        {b.items.map((i) => i.title).join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-black text-slate-900">₹{b.totalAmount}</div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          b.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.paymentStatus} ({b.paymentMode === 'ONLINE_UPI_CARD' ? 'UPI' : 'COD'})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'REPORT_GENERATED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'PHLEBOTOMIST_ASSIGNED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => setAssigningBooking(b)}
                          className="px-2.5 py-1 bg-brand-navy hover:bg-brand-darkBlue text-white text-[11px] font-bold rounded-lg transition"
                        >
                          Assign Rider
                        </button>
                      )}
                      {b.status === 'PHLEBOTOMIST_ASSIGNED' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'REPORT_GENERATED')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition"
                        >
                          Sign Report
                        </button>
                      )}
                      {b.status === 'REPORT_GENERATED' && (
                        <span className="text-[11px] font-bold text-emerald-600">✓ Delivered</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Pathologist Sign-off Demo */}
      {activeTab === 'pathology' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-brand-navy">
                Digital Report Authorisation &amp; LIMS Sign-Off
              </h3>
              <p className="text-xs text-slate-500">
                NABL ISO 15189 protocol: Review abnormal flags and affix digital cryptographic signature.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-700">Dr. Sunita Aggarwal, MD</span>
              <div className="text-[10px] text-emerald-600">AIIMS Fellow / CAP Certified</div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
            <div className="font-bold text-slate-800">Pending Approval Queue:</div>
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-800">
                  Sample Barcode: AUR-DEL-89421 (Patient: Rajesh Sharma, 48M)
                </div>
                <div className="text-slate-500 text-[11px]">
                  Fasting Sugar: 124 mg/dL (High) • HbA1c: 6.8% (High) • Serum IgE: 320 IU/mL (High)
                </div>
              </div>
              <button
                onClick={() => alert('Digital Certificate verified and report approved!')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Affix Signature &amp; Send to WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Catalog Pricing Manager */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-brand-navy">
              Live Pathology Tests &amp; Pricing Engine
            </h3>
            <span className="text-xs text-slate-500">14 Active Tests in North India Catalog</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {POPULAR_TESTS.slice(0, 6).map((test) => (
              <div
                key={test.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-brand-navy">{test.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {test.category} • Code: {test.code}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">₹{test.discountPrice}</div>
                  <div className="text-[10px] text-slate-400 line-through">₹{test.originalPrice}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phlebotomist Assignment Modal */}
      {assigningBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <h3 className="text-base font-bold text-brand-navy">
              Assign Phlebotomist Rider to {assigningBooking.bookingNumber}
            </h3>
            <p className="text-xs text-slate-500">
              Patient: <strong className="text-slate-800">{assigningBooking.patientDetails.name}</strong> •{' '}
              {assigningBooking.patientDetails.city} ({assigningBooking.slotTime})
            </p>

            <form onSubmit={handleAssignRider} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Select Certified Phlebotomist
                </label>
                <select
                  value={selectedRider}
                  onChange={(e) => setSelectedRider(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {sampleRiders.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningBooking(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl transition"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
