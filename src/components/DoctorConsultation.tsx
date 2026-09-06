import React, { useState } from 'react';
import {
  Stethoscope,
  Video,
  Building2,
  Calendar,
  Clock,
  Star,
  ShieldCheck,
  CheckCircle2,
  Phone,
  User,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  X,
  MessageSquare,
  Award,
  FileText,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  Lock,
  Check,
  Zap,
} from 'lucide-react';
import { DOCTOR_SPECIALISTS, NORTH_INDIA_CITIES } from '../data/mockData';
import { Doctor, DoctorAppointment } from '../types';
import confetti from 'canvas-confetti';

interface DoctorConsultationProps {
  selectedCity: string;
}

export const DoctorConsultation: React.FC<DoctorConsultationProps> = ({ selectedCity }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [consultationMode, setConsultationMode] = useState<'ALL' | 'VIDEO' | 'IN_CLINIC'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Booking Modal State
  const [bookingMode, setBookingMode] = useState<'VIDEO' | 'IN_CLINIC'>('VIDEO');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [patientName, setPatientName] = useState<string>('');
  const [patientAge, setPatientAge] = useState<number>(45);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [confirmedAppointment, setConfirmedAppointment] = useState<DoctorAppointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const specialties = [
    { id: 'ALL', label: 'All Specialists', count: DOCTOR_SPECIALISTS.length },
    { id: 'Pathologist & Lab Report Consultant', label: '🔬 Free Report Interpretation', count: 1 },
    { id: 'Pulmonologist (Chest & Smog)', label: '🌫️ Pulmonology & Winter Smog', count: 1 },
    { id: 'Diabetologist & Endocrinologist', label: '🩺 Diabetes & Thyroid', count: 1 },
    { id: 'Cardiologist', label: '❤️ Heart & Cardiac Risk', count: 1 },
    { id: 'Gynecologist', label: '🌸 Gynecology & PCOD', count: 1 },
    { id: 'General Physician', label: '🩺 General Physician', count: 1 },
  ];

  const faqs = [
    {
      q: 'How does the Free 10-Minute Report Interpretation work?',
      a: 'Whenever you book any blood test or health checkup on AuraHealth Diagnostics, you automatically get an optional complimentary 10-minute video session with our Senior Pathologist Dr. Sunita Aggarwal (AIIMS New Delhi) to review out-of-range parameters, fasting sugars, liver/kidney biomarkers, and next steps.',
    },
    {
      q: 'Are digital prescriptions issued during video consultations legally valid?',
      a: 'Yes, 100%. All doctors on our platform are NMC (National Medical Commission) registered. Digital e-prescriptions generated bear the physician’s registration number and digital signature, making them valid at all retail pharmacies, Apollo Pharmacy, MedPlus, and diagnostic centers across India.',
    },
    {
      q: 'Can I consult a doctor for reports done at other diagnostic laboratories?',
      a: 'Absolutely. You can upload existing lab reports from Dr. Lal PathLabs, Agilus, Max Lab, Metropolis, SRL, or local hospital labs. Our specialists will review your PDF and answer all your medical queries.',
    },
    {
      q: 'How do I join the video consultation after booking?',
      a: 'Once your appointment is confirmed, you will immediately receive an SMS and WhatsApp message with your secure encrypted video room link. Simply click the link on your mobile or laptop at your appointment time—no app download required.',
    },
  ];

  const testimonials = [
    {
      name: 'Gurpreet Singh',
      city: 'Chandigarh',
      doctor: 'Dr. Rajeshwar Varma (Pulmonology)',
      rating: 5,
      comment: 'Consulted Dr. Varma during the high AQI smog period for severe dry cough. He prescribed an effective nebulization plan and reviewed my blood eosinophils in detail. Exceptional doctor!',
    },
    {
      name: 'Meenakshi Sharma',
      city: 'Gurugram',
      doctor: 'Dr. Sunita Aggarwal (Pathologist)',
      rating: 5,
      comment: 'The free 10-min report review was a lifesaver. Dr. Sunita clearly explained why my Vitamin D was low and guided me on the right supplement dosage without any panic.',
    },
    {
      name: 'Rameshwar Dayal',
      city: 'Jaipur',
      doctor: 'Dr. Arvind Singhal (Cardiology)',
      rating: 5,
      comment: 'Very thorough explanation of my Lipid profile and cardiac risk markers. The digital prescription arrived on WhatsApp within 5 minutes of finishing the video call.',
    },
  ];

  const filteredDoctors = DOCTOR_SPECIALISTS.filter((doc) => {
    const matchesSpecialty = selectedSpecialty === 'ALL' || doc.specialty === selectedSpecialty;
    const matchesMode =
      consultationMode === 'ALL' || doc.availableModes.includes(consultationMode as any);
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.about.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSpecialty && matchesMode && matchesSearch;
  });

  const handleOpenBooking = (doc: Doctor, mode: 'VIDEO' | 'IN_CLINIC' = 'VIDEO') => {
    setSelectedDoctor(doc);
    setBookingMode(mode);
    setSelectedSlot(doc.availableSlotsToday[0] || '05:00 PM');
    setConfirmedAppointment(null);
  };

  const handleConfirmAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !patientName || !patientPhone) {
      alert('Please fill in the patient name and mobile number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const apptNo = `DOC-APT-${Math.floor(10000 + Math.random() * 90000)}`;
      const appt: DoctorAppointment = {
        id: `apt-${Date.now()}`,
        appointmentNumber: apptNo,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        patientName,
        patientAge,
        patientGender,
        patientPhone,
        consultationMode: bookingMode,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot,
        symptoms: symptoms || 'Routine medical review',
        status: 'CONFIRMED',
        feePaid: selectedDoctor.consultationFee,
        meetLink:
          bookingMode === 'VIDEO'
            ? `https://meet.aurahealth.in/room/${apptNo.toLowerCase()}`
            : undefined,
      };

      setConfirmedAppointment(appt);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (err) {}
    }, 1000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Hero Banner for Doctor Consultation */}
      <section className="bg-gradient-to-r from-brand-navy via-brand-darkBlue to-brand-800 text-white py-12 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-teal-500/20 text-brand-teal px-3.5 py-1 rounded-full border border-teal-500/30">
              <Stethoscope className="w-3.5 h-3.5" /> North India Specialist Medical Board
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-950/80 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Free 10-Min Report Interpretation
            </span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Consult Top Medical Specialists &amp; Discuss Your Test Reports
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Connect with leading doctors from premier institutions like <strong>AIIMS New Delhi, PGIMER Chandigarh, Medanta Gurugram, and KGMU Lucknow</strong>. Book instant HD video teleconsultations or in-clinic visits in {selectedCity}.
            </p>
          </div>

          {/* Quick Value Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-4xl text-xs">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
              <Video className="w-4 h-4 text-brand-teal shrink-0" />
              <div>
                <strong className="block text-white">Video in 15 Mins</strong>
                <span className="text-slate-400 text-[11px]">Instant Tele-consult</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <strong className="block text-white">AIIMS / PGI Faculty</strong>
                <span className="text-slate-400 text-[11px]">15+ Years Experience</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <strong className="block text-white">Digital Prescription</strong>
                <span className="text-slate-400 text-[11px]">Direct WhatsApp Delivery</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-brand-teal shrink-0" />
              <div>
                <strong className="block text-white">100% Confidential</strong>
                <span className="text-slate-400 text-[11px]">Encrypted Medical Room</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Report Interpretation Callout Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6">
        <div className="bg-gradient-to-r from-amber-500 via-brand-coral to-amber-600 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-400/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white text-amber-900 px-2.5 py-0.5 rounded-full">
                Complementary Patient Care
              </span>
              <h3 className="text-lg sm:text-xl font-black mt-1">
                Got Diagnostic Test Results? Get a Free 10-Min Doctor Review
              </h3>
              <p className="text-xs text-amber-100 mt-0.5 max-w-2xl">
                Our in-house pathologist <strong>Dr. Sunita Aggarwal (AIIMS New Delhi)</strong> will explain your out-of-range parameters, fasting glucose, vitamin deficiencies, and advise clinical next steps.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const pathologist = DOCTOR_SPECIALISTS.find((d) => d.id === 'doc-01');
              if (pathologist) handleOpenBooking(pathologist, 'VIDEO');
            }}
            className="shrink-0 px-6 py-3 bg-white text-brand-navy hover:bg-slate-100 text-xs font-black rounded-2xl shadow-md transition flex items-center gap-2"
          >
            <span>Book Free Report Consultation</span>
            <ArrowRight className="w-4 h-4 text-brand-coral" />
          </button>
        </div>
      </section>

      {/* Doctor Directory Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-6">
        {/* Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, specialty, disease, or institution..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Mode Switcher */}
            <div className="md:col-span-6 flex items-center gap-2 justify-start md:justify-end">
              <button
                onClick={() => setConsultationMode('ALL')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  consultationMode === 'ALL'
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All Modes
              </button>
              <button
                onClick={() => setConsultationMode('VIDEO')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  consultationMode === 'VIDEO'
                    ? 'bg-brand-teal text-white shadow-sm font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Video Teleconsult
              </button>
              <button
                onClick={() => setConsultationMode('IN_CLINIC')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  consultationMode === 'IN_CLINIC'
                    ? 'bg-brand-navy text-white shadow-sm font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> In-Clinic Visit
              </button>
            </div>
          </div>

          {/* Specialty Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1 border-t border-slate-100">
            {specialties.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSpecialty(s.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedSpecialty === s.id
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                {/* Doctor Avatar & Basic Info */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-100 shadow-sm group-hover:scale-105 transition"
                    />
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse"
                      title="Available for Teleconsult Today"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                        {doc.experienceYears}+ Yrs Exp
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{doc.rating}</span>
                        <span className="text-slate-400 text-[10px]">({doc.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-600 transition leading-snug mt-1">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-brand-teal font-semibold truncate mt-0.5">
                      {doc.specialty}
                    </p>
                  </div>
                </div>

                {/* Institution & Qualifications */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{doc.institution}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{doc.degrees}</div>
                </div>

                {/* About & Languages */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{doc.about}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>🗣️ {doc.languages.join(', ')}</span>
                  <span>📍 {doc.city}</span>
                </div>

                {/* Slots info */}
                <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> Next Available Slot:
                  </span>
                  <strong className="font-mono font-bold">{doc.availableSlotsToday[0]}</strong>
                </div>
              </div>

              {/* Card Footer: Pricing & Booking Actions */}
              <div className="p-6 pt-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Consultation Fee</div>
                  {doc.consultationFee === 0 ? (
                    <span className="text-base font-black text-emerald-600">FREE</span>
                  ) : (
                    <span className="text-lg font-black text-brand-navy">₹{doc.consultationFee}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenBooking(doc, 'VIDEO')}
                    className="px-3.5 py-2 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5 text-brand-teal" />
                    <span>Book Video</span>
                  </button>

                  <button
                    onClick={() => handleOpenBooking(doc, 'IN_CLINIC')}
                    className="p-2 bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl transition"
                    title="Book In-Clinic Lab Visit"
                  >
                    <Building2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No Doctors Found</h3>
            <p className="text-xs text-slate-400">
              No specialists matched your filter criteria. Try resetting the specialty filter.
            </p>
            <button
              onClick={() => {
                setSelectedSpecialty('ALL');
                setConsultationMode('ALL');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 3-Step Process: How Online Doctor Consultation Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-teal bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Simple 3-Step Care
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy">
              How Video Doctor Consultations Work
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Get medical advice, report interpretation, and official prescriptions from the comfort of your home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-navy text-white font-black flex items-center justify-center text-sm shadow">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Select Specialist &amp; Time Slot</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose a verified specialist from AIIMS, PGI, or Medanta and pick your preferred time slot today or tomorrow.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-teal text-white font-black flex items-center justify-center text-sm shadow">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Receive WhatsApp &amp; SMS Link</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get an encrypted video room link directly on your WhatsApp and SMS. Tap the link to join directly without installing apps.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Discuss Reports &amp; Get Digital Rx</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review your diagnostic tests with the doctor and receive a certified digital prescription valid across all pharmacies in India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Patient Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-teal">
                Verified Patient Experiences
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-brand-navy">
                What North Indian Families Say About Our Doctors
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ✓ Verified Patient
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic">"{t.comment}"</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-slate-900 block">{t.name}</strong>
                    <span className="text-[10px] text-slate-400">{t.city}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-brand-teal text-right max-w-[140px] truncate">
                    {t.doctor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pt-12 space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-brand-navy">
            Doctor Consultation FAQs
          </h2>
          <p className="text-xs text-slate-500">
            Everything you need to know about our teleconsultation service and report interpretations.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs font-bold text-slate-800 hover:text-brand-navy"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-brand-teal shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-2 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Appointment Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-brand-50 to-white">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDoctor.avatarUrl}
                  alt={selectedDoctor.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-brand-200"
                />
                <div>
                  <h2 className="text-base font-bold text-brand-navy">
                    Book with {selectedDoctor.name}
                  </h2>
                  <p className="text-xs text-slate-500">{selectedDoctor.specialty}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {confirmedAppointment ? (
                /* Success State */
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-brand-navy">
                      Consultation Confirmed!
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Appointment ID:{' '}
                      <span className="font-mono font-bold text-brand-600">
                        {confirmedAppointment.appointmentNumber}
                      </span>
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Doctor:</span>
                      <strong className="text-slate-800">{confirmedAppointment.doctorName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date &amp; Time:</span>
                      <strong className="text-slate-800">
                        {confirmedAppointment.appointmentDate} at {confirmedAppointment.appointmentTime}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mode:</span>
                      <strong className="text-brand-navy">
                        {confirmedAppointment.consultationMode === 'VIDEO'
                          ? '📹 HD Video Teleconsult'
                          : '🏥 In-Clinic Lab Visit'}
                      </strong>
                    </div>
                    {confirmedAppointment.meetLink && (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-[10px] text-slate-400 block mb-1">
                          Video Room Link (Also sent on SMS/WhatsApp):
                        </span>
                        <a
                          href={confirmedAppointment.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-brand-600 font-bold hover:underline block truncate"
                        >
                          {confirmedAppointment.meetLink}
                        </a>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedDoctor(null)}
                    className="w-full py-3 bg-brand-navy text-white text-xs font-bold rounded-xl hover:bg-brand-darkBlue transition"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* Booking Form */
                <form onSubmit={handleConfirmAppointment} className="space-y-4">
                  {/* Mode Selector */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Consultation Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBookingMode('VIDEO')}
                        className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                          bookingMode === 'VIDEO'
                            ? 'border-brand-500 bg-brand-50 text-brand-navy font-bold ring-1 ring-brand-500'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Video className="w-4 h-4 text-brand-teal" />
                        <div>
                          <div className="text-xs">Video Call</div>
                          <div className="text-[10px] text-slate-400">Consult from Home</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingMode('IN_CLINIC')}
                        className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                          bookingMode === 'IN_CLINIC'
                            ? 'border-brand-500 bg-brand-50 text-brand-navy font-bold ring-1 ring-brand-500'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-brand-navy" />
                        <div>
                          <div className="text-xs">Clinic Visit</div>
                          <div className="text-[10px] text-slate-400">{selectedDoctor.city}</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Date & Time Slot Picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Select Available Time Slot
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 max-h-36 overflow-y-auto">
                      {selectedDoctor.availableSlotsToday.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2 rounded-xl text-xs font-semibold border transition ${
                            selectedSlot === slot
                              ? 'bg-brand-navy text-white border-brand-navy'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="space-y-2.5 pt-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Patient Information
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Patient Full Name *"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Age *"
                        min={1}
                        max={120}
                        value={patientAge}
                        onChange={(e) => setPatientAge(parseInt(e.target.value) || 0)}
                        className="px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value as any)}
                        className="px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="relative">
                      <span className="text-xs font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        placeholder="Mobile Number (For WhatsApp link) *"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-12 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Reason for Consultation / Symptoms
                    </label>
                    <textarea
                      rows={2}
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="e.g. Discussing elevated sugar and winter cough..."
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  {/* Fee Summary & Submit */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Total Consultation Fee:</span>
                      <div className="text-base font-black text-brand-navy">
                        {selectedDoctor.consultationFee === 0
                          ? 'FREE (Sponsored by AuraHealth)'
                          : `₹${selectedDoctor.consultationFee}`}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-gradient-to-r from-brand-coral to-amber-500 hover:from-brand-coral hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
                    >
                      {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
