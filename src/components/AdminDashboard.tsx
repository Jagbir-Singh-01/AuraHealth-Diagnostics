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
  Stethoscope,
  Video,
  Calendar,
  User,
  MessageSquare,
  Award,
  Link2,
} from 'lucide-react';
import { Booking, TeamNotification, DoctorAppointment } from '../types';

interface AdminDashboardProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  doctorAppointments: DoctorAppointment[];
  setDoctorAppointments: React.Dispatch<React.SetStateAction<DoctorAppointment[]>>;
  notifications: TeamNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<TeamNotification[]>>;
  onNotify: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  setBookings,
  doctorAppointments,
  setDoctorAppointments,
  notifications,
  setNotifications,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<'LAB_REQUESTS' | 'DOCTOR_REQUESTS' | 'NOTIFICATIONS'>('LAB_REQUESTS');
  
  // Lab Bookings State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(bookings[0] || null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Doctor Consultations State
  const [selectedDoctorAppt, setSelectedDoctorAppt] = useState<DoctorAppointment | null>(doctorAppointments[0] || null);
  const [doctorStatusFilter, setDoctorStatusFilter] = useState<string>('ALL');
  const [doctorSearchFilter, setDoctorSearchFilter] = useState<string>('');

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  // --- Lab Booking Handlers ---
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

  const handleDispatchLabConfirmation = (booking: Booking) => {
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

  // --- Doctor Appointment Handlers ---
  const handleConfirmDoctorAppointment = (apptId: string) => {
    const appt = doctorAppointments.find((a) => a.id === apptId);
    if (!appt) return;

    const generatedMeetLink = `https://meet.aurahealth.in/room/${appt.appointmentNumber.toLowerCase()}`;

    const updated = doctorAppointments.map((a) => {
      if (a.id === apptId) {
        return {
          ...a,
          status: 'CONFIRMED_BY_TEAM' as const,
          meetLink: generatedMeetLink,
          teamNotes: `Doctor calendar confirmed by Operations Coordinator on ${new Date().toLocaleTimeString()}. Video room generated.`,
          confirmedByOperatorName: 'Patient Care Desk',
        };
      }
      return a;
    });

    setDoctorAppointments(updated);
    if (selectedDoctorAppt?.id === apptId) {
      setSelectedDoctorAppt(updated.find((a) => a.id === apptId) || null);
    }
    onNotify(`✓ Confirmed appointment "${appt.appointmentNumber}" for ${appt.doctorName}! Video link generated.`);
  };

  const handleDispatchDoctorRoomLink = (appt: DoctorAppointment) => {
    onNotify(
      `📲 Encrypted Video Room Link & SMS dispatched to ${appt.patientName} (+91 ${appt.patientPhone}) for ${appt.doctorName} (${appt.appointmentTime}).`
    );
  };

  const handleMarkDoctorConsultComplete = (apptId: string) => {
    const updated = doctorAppointments.map((a) => {
      if (a.id === apptId) {
        return {
          ...a,
          status: 'COMPLETED' as const,
          teamNotes: 'Teleconsultation completed successfully. Digital e-prescription sent to patient WhatsApp.',
        };
      }
      return a;
    });
    setDoctorAppointments(updated);
    if (selectedDoctorAppt?.id === apptId) {
      setSelectedDoctorAppt(updated.find((a) => a.id === apptId) || null);
    }
    onNotify(`Doctor Consultation ${apptId} marked as completed.`);
  };

  const handleMarkNotifRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
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

  const filteredDoctorAppts = doctorAppointments.filter((a) => {
    const matchesStatus = doctorStatusFilter === 'ALL' || a.status === doctorStatusFilter;
    const matchesSearch =
      a.appointmentNumber.toLowerCase().includes(doctorSearchFilter.toLowerCase()) ||
      a.patientName.toLowerCase().includes(doctorSearchFilter.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(doctorSearchFilter.toLowerCase()) ||
      a.doctorSpecialty.toLowerCase().includes(doctorSearchFilter.toLowerCase()) ||
      a.patientPhone.toLowerCase().includes(doctorSearchFilter.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingLabCount = bookings.filter((b) => b.status === 'PENDING_TEAM_BOOKING').length;
  const pendingDocCount = doctorAppointments.filter((a) => a.status === 'PENDING_TEAM_CONFIRMATION').length;

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
                ● Live Operations Dispatch Queue
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              Multi-Lab Registration &amp; Doctor Consultation Operations Portal
            </h1>
            <p className="text-xs text-slate-300">
              Manage patient medical test requests with labs, schedule doctor teleconsultations/report reviews, and dispatch WhatsApp meeting tokens.
            </p>
          </div>

          {/* Quick Metrics & Tab Switcher */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveTab('LAB_REQUESTS')}
              className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'LAB_REQUESTS'
                  ? 'bg-brand-teal text-brand-navy font-black shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Lab Bookings ({bookings.length})</span>
              {pendingLabCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black flex items-center justify-center animate-pulse">
                  {pendingLabCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('DOCTOR_REQUESTS')}
              className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'DOCTOR_REQUESTS'
                  ? 'bg-brand-coral text-white font-black shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-white" />
              <span>Doctor Consults ({doctorAppointments.length})</span>
              {pendingDocCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-300 text-slate-900 text-[10px] font-black flex items-center justify-center animate-bounce">
                  {pendingDocCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('NOTIFICATIONS')}
              className={`relative p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'NOTIFICATIONS'
                  ? 'bg-amber-400 text-slate-900 font-black shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Alerts</span>
              {unreadNotifCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand-coral text-white text-[10px] font-black flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 1: DOCTOR CONSULTATIONS CONSOLE */}
      {activeTab === 'DOCTOR_REQUESTS' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Doctor Appointments List */}
            <div className="lg:col-span-5 space-y-4">
              {/* Search & Filter */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search patient, doctor, phone, or symptoms..."
                    value={doctorSearchFilter}
                    onChange={(e) => setDoctorSearchFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {['ALL', 'PENDING_TEAM_CONFIRMATION', 'CONFIRMED_BY_TEAM', 'COMPLETED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setDoctorStatusFilter(st)}
                      className={`px-3 py-1 rounded-full whitespace-nowrap font-bold transition text-[11px] ${
                        doctorStatusFilter === st
                          ? 'bg-brand-navy text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'ALL' && 'All Consults'}
                      {st === 'PENDING_TEAM_CONFIRMATION' && '⚠️ Action Needed'}
                      {st === 'CONFIRMED_BY_TEAM' && '✓ Confirmed'}
                      {st === 'COMPLETED' && 'Completed'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultations List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredDoctorAppts.map((appt) => {
                  const isSelected = selectedDoctorAppt?.id === appt.id;
                  const isActionNeeded = appt.status === 'PENDING_TEAM_CONFIRMATION';

                  return (
                    <div
                      key={appt.id}
                      onClick={() => setSelectedDoctorAppt(appt)}
                      className={`p-4 rounded-3xl border-2 cursor-pointer transition bg-white shadow-2xs space-y-2.5 ${
                        isSelected
                          ? 'border-brand-500 ring-2 ring-brand-500/20'
                          : isActionNeeded
                          ? 'border-amber-300 hover:border-amber-400 bg-amber-50/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-brand-navy">
                          {appt.appointmentNumber}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            appt.status === 'PENDING_TEAM_CONFIRMATION'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200 animate-pulse'
                              : appt.status === 'CONFIRMED_BY_TEAM'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {appt.status === 'PENDING_TEAM_CONFIRMATION' && '⚠️ Confirm with Doctor'}
                          {appt.status === 'CONFIRMED_BY_TEAM' && '✓ Video Link Dispatched'}
                          {appt.status === 'COMPLETED' && '✓ Completed & Rx Sent'}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900">{appt.patientName}</h4>
                          <span className="text-[10px] font-extrabold text-brand-teal bg-teal-50 px-2 py-0.5 rounded">
                            {appt.consultationMode === 'VIDEO' ? '📹 Video' : '🏥 In-Clinic'}
                          </span>
                        </div>
                        <p className="text-xs text-brand-navy font-semibold flex items-center gap-1 mt-0.5">
                          <Stethoscope className="w-3.5 h-3.5 text-brand-teal" />
                          <span>{appt.doctorName} ({appt.doctorSpecialty.split(' ')[0]})</span>
                        </p>
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                        "{appt.symptoms}"
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>🕒 {appt.appointmentTime} ({appt.appointmentDate})</span>
                        <span className="font-black text-brand-navy">
                          {appt.feePaid === 0 ? 'FREE Review' : `₹${appt.feePaid}`}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredDoctorAppts.length === 0 && (
                  <div className="bg-white p-8 rounded-3xl text-center border border-slate-200 text-xs text-slate-400">
                    No doctor consultation requests found matching criteria.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Doctor Consultation Detail & Scheduling Actions */}
            <div className="lg:col-span-7">
              {selectedDoctorAppt ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Doctor Teleconsultation Console
                      </span>
                      <h3 className="text-xl font-black text-brand-navy mt-0.5">
                        {selectedDoctorAppt.patientName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Ref #{selectedDoctorAppt.appointmentNumber} · Requested {selectedDoctorAppt.createdAt || 'Today'}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Consultation Fee</span>
                      <span className="text-2xl font-black text-brand-navy">
                        {selectedDoctorAppt.feePaid === 0 ? 'FREE' : `₹${selectedDoctorAppt.feePaid}`}
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded block mt-0.5">
                        {selectedDoctorAppt.feePaid === 0 ? 'Sponsored Report Review' : 'Direct Doctor Payment'}
                      </span>
                    </div>
                  </div>

                  {/* Operations Team Scheduling Action Box */}
                  <div className="bg-brand-50 p-5 rounded-3xl border border-brand-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-brand-teal" /> Operations Scheduling &amp; Dispatch Actions:
                      </h4>
                      <span className="text-xs font-bold text-brand-teal bg-white px-2.5 py-0.5 rounded-full border border-brand-200">
                        {selectedDoctorAppt.doctorName}
                      </span>
                    </div>

                    {selectedDoctorAppt.status === 'PENDING_TEAM_CONFIRMATION' && (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-600">
                          The patient requested a teleconsultation for <strong>{selectedDoctorAppt.appointmentTime}</strong>. Click below to verify the doctor's calendar, confirm the booking, and generate the encrypted HD Video Room Link:
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleConfirmDoctorAppointment(selectedDoctorAppt.id)}
                            className="px-5 py-2.5 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-black rounded-xl shadow transition flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Confirm with Doctor &amp; Generate HD Video Room Link</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedDoctorAppt.status === 'CONFIRMED_BY_TEAM' && (
                      <div className="space-y-3">
                        <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <strong>✓ Appointment Confirmed &amp; Room Generated:</strong>
                            <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                              Active Room
                            </span>
                          </div>
                          <div className="font-mono text-xs font-black text-brand-navy truncate bg-white p-2 rounded-xl border border-emerald-200">
                            {selectedDoctorAppt.meetLink}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleDispatchDoctorRoomLink(selectedDoctorAppt)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Video Link to Patient (WhatsApp &amp; SMS)</span>
                          </button>

                          <button
                            onClick={() => handleMarkDoctorConsultComplete(selectedDoctorAppt.id)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Mark Consult Completed &amp; Upload Rx</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedDoctorAppt.status === 'COMPLETED' && (
                      <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Teleconsultation Completed &amp; Digital Prescription Dispatched</span>
                        </div>
                        <p className="text-[11px] text-emerald-800">
                          The consultation concluded successfully. Verified NMC digital prescription delivered to patient WhatsApp.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Patient & Consultation Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Patient Information:
                      </span>
                      <div>
                        <strong className="text-slate-900">{selectedDoctorAppt.patientName}</strong>{' '}
                        <span className="text-slate-500">
                          ({selectedDoctorAppt.patientAge} Yrs · {selectedDoctorAppt.patientGender})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-brand-navy font-mono font-semibold">
                        <Phone className="w-3.5 h-3.5 text-brand-teal" />
                        <span>+91 {selectedDoctorAppt.patientPhone}</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        📍 {selectedDoctorAppt.patientCity || 'North India'}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Assigned Medical Specialist:
                      </span>
                      <strong className="text-slate-900 block">{selectedDoctorAppt.doctorName}</strong>
                      <div className="text-brand-teal font-semibold text-[11px]">
                        {selectedDoctorAppt.doctorSpecialty}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {selectedDoctorAppt.doctorInstitution || 'AIIMS / PGI Clinical Board'}
                      </div>
                    </div>
                  </div>

                  {/* Reason & Symptoms */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Patient Stated Reason / Symptoms for Consultation:
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      "{selectedDoctorAppt.symptoms}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 text-xs text-slate-400">
                  Select a consultation from the queue to view details and coordinate with the doctor.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: MEDICAL LAB TEST DISPATCH CONSOLE */}
      {activeTab === 'LAB_REQUESTS' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Orders List */}
            <div className="lg:col-span-5 space-y-4">
              {/* Search & Status Filter */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by order ID, patient, lab, or phone..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {['ALL', 'PENDING_TEAM_BOOKING', 'BOOKED_BY_TEAM', 'SAMPLE_COLLECTED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-full whitespace-nowrap font-bold transition text-[11px] ${
                        statusFilter === st
                          ? 'bg-brand-navy text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'ALL' && 'All Lab Orders'}
                      {st === 'PENDING_TEAM_BOOKING' && '📥 Needs Lab Booking'}
                      {st === 'BOOKED_BY_TEAM' && '✓ Registered in Lab'}
                      {st === 'SAMPLE_COLLECTED' && 'Sample Collected'}
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
                            onClick={() => handleDispatchLabConfirmation(selectedBooking)}
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
      )}

      {/* SECTION 3: INCOMING NOTIFICATIONS LOG */}
      {activeTab === 'NOTIFICATIONS' && (
        <section className="max-w-4xl mx-auto px-4 sm:px-8 py-8 animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-brand-navy flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <span>Real-Time Incoming Patient Requests ({notifications.length})</span>
            </h2>
            <button
              onClick={() =>
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
              }
              className="text-xs font-bold text-brand-teal hover:underline"
            >
              Mark all as read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkNotifRead(notif.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                  notif.isRead
                    ? 'bg-white border-slate-200 text-slate-600'
                    : 'bg-amber-50/70 border-amber-300 text-amber-950 ring-1 ring-amber-400/40 shadow-sm'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        notif.type === 'DOCTOR_CONSULTATION'
                          ? 'bg-brand-coral text-white'
                          : 'bg-brand-navy text-white'
                      }`}
                    >
                      {notif.type === 'DOCTOR_CONSULTATION' ? '🩺 Doctor Consult' : '🔬 Lab Test Request'}
                    </span>
                    <span className="font-mono text-xs font-bold">{notif.bookingNumber}</span>
                    <span className="text-[10px] text-slate-400">🕒 {notif.timestamp}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {notif.patientName} (+91 {notif.patientPhone}) · {notif.city}
                  </h4>

                  <p className="text-xs text-slate-600">
                    <strong>Target:</strong> {notif.selectedLab} · <strong>Slot:</strong> {notif.slotTime} · <strong>Amount:</strong> {notif.totalAmount === 0 ? 'FREE Review' : `₹${notif.totalAmount}`}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (notif.type === 'DOCTOR_CONSULTATION') {
                        setActiveTab('DOCTOR_REQUESTS');
                      } else {
                        setActiveTab('LAB_REQUESTS');
                      }
                    }}
                    className="px-3 py-1.5 bg-brand-navy hover:bg-brand-darkBlue text-white text-[11px] font-bold rounded-xl shadow transition"
                  >
                    Manage →
                  </button>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 text-xs text-slate-400">
                No new notification alerts in the queue.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
