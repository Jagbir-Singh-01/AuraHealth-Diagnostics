import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Booking, DoctorAppointment, TeamNotification, TestItem, HealthPackage, Doctor, LabBrand } from '../types';
import {
  POPULAR_TESTS,
  HEALTH_PACKAGES,
  DOCTOR_SPECIALISTS,
  LAB_BRANDS,
  INITIAL_BOOKINGS,
  INITIAL_DOCTOR_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

const STORAGE_KEY_BOOKINGS = 'aurahealth_ops_bookings';
const STORAGE_KEY_DOCTOR_APPTS = 'aurahealth_ops_doctor_appts';
const STORAGE_KEY_NOTIFICATIONS = 'aurahealth_ops_notifications';

// LocalStorage helpers
const getLocalData = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setLocalData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Could not save ${key} to localStorage:`, e);
  }
};

export const clearOperationsLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_BOOKINGS);
    localStorage.removeItem(STORAGE_KEY_DOCTOR_APPTS);
    localStorage.removeItem(STORAGE_KEY_NOTIFICATIONS);
  } catch (e) {}
};

export interface DbServiceStatus {
  isPostgresConnected: boolean;
  driver: 'SUPABASE_POSTGRESQL' | 'LOCAL_PERSISTENT_STORAGE';
}

export const getDbStatus = (): DbServiceStatus => {
  return {
    isPostgresConnected: isSupabaseConfigured(),
    driver: isSupabaseConfigured() ? 'SUPABASE_POSTGRESQL' : 'LOCAL_PERSISTENT_STORAGE',
  };
};

// ==========================================
// 1. LAB TEST BOOKINGS
// ==========================================

export const fetchBookingsFromDb = async (): Promise<Booking[]> => {
  if (!isSupabaseConfigured() || !supabase) {
    return getLocalData<Booking[]>(STORAGE_KEY_BOOKINGS, [...INITIAL_BOOKINGS]);
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getLocalData<Booking[]>(STORAGE_KEY_BOOKINGS, [...INITIAL_BOOKINGS]);
    }

    const mapped = data.map((row: any) => ({
      id: row.id,
      bookingNumber: row.booking_number,
      officialLabRefNumber: row.official_lab_ref_number,
      createdAt: row.created_at ? new Date(row.created_at).toLocaleString() : 'Recently',
      status: row.status,
      bookingType: row.booking_type || 'HOME_COLLECTION',
      selectedLabName: row.selected_lab_name,
      selectedLabBrandId: row.selected_lab_brand_id,
      patientDetails: {
        name: row.patient_name,
        phone: row.patient_phone,
        email: row.patient_email,
        age: row.patient_age || 40,
        gender: row.patient_gender || 'Male',
        address: row.address,
        city: row.city,
        state: row.state || 'Delhi NCR',
        pincode: row.pincode,
        landmark: row.landmark,
      },
      beneficiaries: [],
      items: [],
      slotDate: row.slot_date,
      slotTime: row.slot_time,
      subtotal: Number(row.subtotal) || 0,
      discount: Number(row.discount) || 0,
      collectionFee: Number(row.collection_fee) || 0,
      totalAmount: Number(row.total_amount) || 0,
      paymentMode: row.payment_mode || 'PAY_DIRECTLY_TO_LAB',
      paymentStatus: row.payment_status || 'PAY_ON_COLLECTION_TO_LAB',
      bookedByOperatorName: row.booked_by_operator_name,
      teamNotes: row.team_notes,
      phlebotomist: row.phlebotomist_name
        ? {
            name: row.phlebotomist_name,
            phone: row.phlebotomist_phone || '+91 98112 34567',
            badgeNumber: row.phlebotomist_badge || 'PHLEB-101',
            vaccinationStatus: 'Fully Vaccinated',
            liveLocationStatus: 'Assigned for sample collection',
          }
        : undefined,
    }));

    setLocalData(STORAGE_KEY_BOOKINGS, mapped);
    return mapped;
  } catch (err) {
    return getLocalData<Booking[]>(STORAGE_KEY_BOOKINGS, [...INITIAL_BOOKINGS]);
  }
};

export const saveBookingToDb = async (
  booking: Booking,
  notification: TeamNotification
): Promise<{ success: boolean; error?: string }> => {
  // Always persist to localStorage for instant survival across page reloads
  const currentBookings = getLocalData<Booking[]>(STORAGE_KEY_BOOKINGS, [...INITIAL_BOOKINGS]);
  setLocalData(STORAGE_KEY_BOOKINGS, [booking, ...currentBookings]);

  const currentNotifs = getLocalData<TeamNotification[]>(STORAGE_KEY_NOTIFICATIONS, [...INITIAL_NOTIFICATIONS]);
  setLocalData(STORAGE_KEY_NOTIFICATIONS, [notification, ...currentNotifs]);

  if (!isSupabaseConfigured() || !supabase) {
    return { success: true };
  }

  try {
    await supabase.from('bookings').insert({
      booking_number: booking.bookingNumber,
      patient_name: booking.patientDetails.name,
      patient_phone: booking.patientDetails.phone,
      patient_email: booking.patientDetails.email || null,
      patient_age: booking.patientDetails.age,
      patient_gender: booking.patientDetails.gender,
      address: booking.patientDetails.address || '',
      city: booking.patientDetails.city,
      state: booking.patientDetails.state || 'Delhi NCR',
      pincode: booking.patientDetails.pincode,
      landmark: booking.patientDetails.landmark || null,
      selected_lab_name: booking.selectedLabName,
      selected_lab_brand_id: booking.selectedLabBrandId || 'lab-agilus',
      slot_date: booking.slotDate,
      slot_time: booking.slotTime,
      subtotal: booking.subtotal,
      discount: booking.discount,
      collection_fee: booking.collectionFee,
      total_amount: booking.totalAmount,
      payment_mode: booking.paymentMode,
      payment_status: booking.paymentStatus,
      status: booking.status,
      team_notes: booking.teamNotes,
    });

    await supabase.from('team_notifications').insert({
      type: notification.type || 'LAB_TEST_BOOKING',
      booking_number: notification.bookingNumber,
      patient_name: notification.patientName,
      patient_phone: notification.patientPhone,
      selected_lab: notification.selectedLab,
      test_names: notification.testNames,
      total_amount: notification.totalAmount,
      slot_time: notification.slotTime,
      city: notification.city,
      is_read: false,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const updateBookingInDb = async (
  bookingNumber: string,
  updates: Partial<Booking>
): Promise<boolean> => {
  // Always update in localStorage
  const currentBookings = getLocalData<Booking[]>(STORAGE_KEY_BOOKINGS, [...INITIAL_BOOKINGS]);
  const updated = currentBookings.map((b) => (b.bookingNumber === bookingNumber ? { ...b, ...updates } : b));
  setLocalData(STORAGE_KEY_BOOKINGS, updated);

  if (!isSupabaseConfigured() || !supabase) return true;

  try {
    const payload: any = {};
    if (updates.status) payload.status = updates.status;
    if (updates.officialLabRefNumber) payload.official_lab_ref_number = updates.officialLabRefNumber;
    if (updates.teamNotes) payload.team_notes = updates.teamNotes;
    if (updates.paymentStatus) payload.payment_status = updates.paymentStatus;
    if (updates.phlebotomist) {
      payload.phlebotomist_name = updates.phlebotomist.name;
      payload.phlebotomist_phone = updates.phlebotomist.phone;
      payload.phlebotomist_badge = updates.phlebotomist.badgeNumber;
    }

    const { error } = await supabase
      .from('bookings')
      .update(payload)
      .eq('booking_number', bookingNumber);

    return !error;
  } catch (err) {
    return false;
  }
};

// ==========================================
// 2. DOCTOR TELECONSULTATION APPOINTMENTS
// ==========================================

export const fetchDoctorAppointmentsFromDb = async (): Promise<DoctorAppointment[]> => {
  if (!isSupabaseConfigured() || !supabase) {
    return getLocalData<DoctorAppointment[]>(STORAGE_KEY_DOCTOR_APPTS, [...INITIAL_DOCTOR_APPOINTMENTS]);
  }

  try {
    const { data, error } = await supabase
      .from('doctor_appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getLocalData<DoctorAppointment[]>(STORAGE_KEY_DOCTOR_APPTS, [...INITIAL_DOCTOR_APPOINTMENTS]);
    }

    const mapped = data.map((row: any) => ({
      id: row.id,
      appointmentNumber: row.appointment_number,
      createdAt: row.created_at ? new Date(row.created_at).toLocaleString() : 'Recently',
      doctorId: row.doctor_id || 'doc-01',
      doctorName: row.doctor_name,
      doctorSpecialty: row.doctor_specialty,
      doctorInstitution: row.doctor_institution,
      patientName: row.patient_name,
      patientAge: Number(row.patient_age) || 35,
      patientGender: row.patient_gender || 'Male',
      patientPhone: row.patient_phone,
      patientCity: row.patient_city || 'North India',
      consultationMode: row.consultation_mode || 'VIDEO',
      appointmentDate: row.appointment_date,
      appointmentTime: row.appointment_time,
      symptoms: row.symptoms || '',
      status: row.status || 'PENDING_TEAM_CONFIRMATION',
      feePaid: Number(row.fee_paid) || 0,
      isSponsoredFreeReview: Boolean(row.is_sponsored_free_review),
      meetLink: row.meet_link,
      confirmedByOperatorName: row.confirmed_by_operator_name,
      teamNotes: row.team_notes,
    }));

    setLocalData(STORAGE_KEY_DOCTOR_APPTS, mapped);
    return mapped;
  } catch (err) {
    return getLocalData<DoctorAppointment[]>(STORAGE_KEY_DOCTOR_APPTS, [...INITIAL_DOCTOR_APPOINTMENTS]);
  }
};

export const saveDoctorAppointmentToDb = async (
  appt: DoctorAppointment,
  notification: TeamNotification
): Promise<{ success: boolean; error?: string }> => {
  // Always persist to localStorage
  const currentAppts = getLocalData<DoctorAppointment[]>(STORAGE_KEY_DOCTOR_APPTS, [...INITIAL_DOCTOR_APPOINTMENTS]);
  setLocalData(STORAGE_KEY_DOCTOR_APPTS, [appt, ...currentAppts]);

  const currentNotifs = getLocalData<TeamNotification[]>(STORAGE_KEY_NOTIFICATIONS, [...INITIAL_NOTIFICATIONS]);
  setLocalData(STORAGE_KEY_NOTIFICATIONS, [notification, ...currentNotifs]);

  if (!isSupabaseConfigured() || !supabase) {
    return { success: true };
  }

  try {
    await supabase.from('doctor_appointments').insert({
      appointment_number: appt.appointmentNumber,
      doctor_id: appt.doctorId,
      doctor_name: appt.doctorName,
      doctor_specialty: appt.doctorSpecialty,
      doctor_institution: appt.doctorInstitution,
      patient_name: appt.patientName,
      patient_age: appt.patientAge,
      patient_gender: appt.patientGender,
      patient_phone: appt.patientPhone,
      patient_city: appt.patientCity,
      consultation_mode: appt.consultationMode,
      appointment_date: appt.appointmentDate,
      appointment_time: appt.appointmentTime,
      symptoms: appt.symptoms,
      fee_paid: appt.feePaid,
      is_sponsored_free_review: appt.isSponsoredFreeReview,
      status: appt.status,
      meet_link: appt.meetLink || null,
      team_notes: appt.teamNotes || null,
    });

    await supabase.from('team_notifications').insert({
      type: notification.type || 'DOCTOR_CONSULTATION',
      booking_number: notification.bookingNumber,
      patient_name: notification.patientName,
      patient_phone: notification.patientPhone,
      selected_lab: notification.selectedLab,
      test_names: notification.testNames,
      total_amount: notification.totalAmount,
      slot_time: notification.slotTime,
      city: notification.city,
      is_read: false,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const updateDoctorAppointmentInDb = async (
  appointmentNumber: string,
  updates: Partial<DoctorAppointment>
): Promise<boolean> => {
  // Always update in localStorage
  const currentAppts = getLocalData<DoctorAppointment[]>(STORAGE_KEY_DOCTOR_APPTS, [...INITIAL_DOCTOR_APPOINTMENTS]);
  const updated = currentAppts.map((a) => (a.appointmentNumber === appointmentNumber ? { ...a, ...updates } : a));
  setLocalData(STORAGE_KEY_DOCTOR_APPTS, updated);

  if (!isSupabaseConfigured() || !supabase) return true;

  try {
    const payload: any = {};
    if (updates.status) payload.status = updates.status;
    if (updates.meetLink) payload.meet_link = updates.meetLink;
    if (updates.teamNotes) payload.team_notes = updates.teamNotes;
    if (updates.confirmedByOperatorName) payload.confirmed_by_operator_name = updates.confirmedByOperatorName;

    const { error } = await supabase
      .from('doctor_appointments')
      .update(payload)
      .eq('appointment_number', appointmentNumber);

    return !error;
  } catch (err) {
    return false;
  }
};

// ==========================================
// 3. REALTIME NOTIFICATIONS
// ==========================================

export const fetchNotificationsFromDb = async (): Promise<TeamNotification[]> => {
  if (!isSupabaseConfigured() || !supabase) {
    return getLocalData<TeamNotification[]>(STORAGE_KEY_NOTIFICATIONS, [...INITIAL_NOTIFICATIONS]);
  }

  try {
    const { data, error } = await supabase
      .from('team_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getLocalData<TeamNotification[]>(STORAGE_KEY_NOTIFICATIONS, [...INITIAL_NOTIFICATIONS]);
    }

    const mapped = data.map((row: any) => ({
      id: row.id,
      type: row.type || 'LAB_TEST_BOOKING',
      bookingNumber: row.booking_number,
      patientName: row.patient_name,
      patientPhone: row.patient_phone,
      selectedLab: row.selected_lab,
      testNames: row.test_names || [],
      totalAmount: Number(row.total_amount) || 0,
      slotTime: row.slot_time,
      city: row.city,
      timestamp: row.created_at ? new Date(row.created_at).toLocaleTimeString() : 'Just now',
      isRead: Boolean(row.is_read),
    }));

    setLocalData(STORAGE_KEY_NOTIFICATIONS, mapped);
    return mapped;
  } catch (err) {
    return getLocalData<TeamNotification[]>(STORAGE_KEY_NOTIFICATIONS, [...INITIAL_NOTIFICATIONS]);
  }
};

export const markNotificationReadInDb = async (id: string): Promise<boolean> => {
  const currentNotifs = getLocalData<TeamNotification[]>(STORAGE_KEY_NOTIFICATIONS, [...INITIAL_NOTIFICATIONS]);
  const updated = currentNotifs.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  setLocalData(STORAGE_KEY_NOTIFICATIONS, updated);

  if (!isSupabaseConfigured() || !supabase) return true;
  const { error } = await supabase.from('team_notifications').update({ is_read: true }).eq('id', id);
  return !error;
};

// ==========================================
// 4. REALTIME WEBSOCKET SUBSCRIPTION
// ==========================================

export const subscribeToRealtimeUpdates = (
  onNewBooking?: (booking: Booking) => void,
  onNewAppointment?: (appt: DoctorAppointment) => void,
  onNewNotification?: (notif: TeamNotification) => void
) => {
  if (!isSupabaseConfigured() || !supabase) {
    return () => {};
  }

  const channel = supabase
    .channel('aurahealth-realtime-ops')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'team_notifications' },
      (payload) => {
        if (onNewNotification && payload.new) {
          onNewNotification({
            id: payload.new.id,
            type: payload.new.type,
            bookingNumber: payload.new.booking_number,
            patientName: payload.new.patient_name,
            patientPhone: payload.new.patient_phone,
            selectedLab: payload.new.selected_lab,
            testNames: payload.new.test_names || [],
            totalAmount: Number(payload.new.total_amount) || 0,
            slotTime: payload.new.slot_time,
            city: payload.new.city,
            timestamp: 'Just now',
            isRead: Boolean(payload.new.is_read),
          });
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// ==========================================
// 5. CATALOG & REFERENCE DATA (HYBRID POSTGRES / MOCK)
// ==========================================

export const getCatalogTests = async (): Promise<TestItem[]> => {
  if (!isSupabaseConfigured() || !supabase) return POPULAR_TESTS;
  try {
    const { data, error } = await supabase.from('medical_tests').select('*, lab_test_offerings(*)');
    if (error || !data || data.length === 0) return POPULAR_TESTS;
    return data.map((t: any) => ({
      id: t.id,
      name: t.name,
      code: t.code,
      category: t.category,
      sampleType: t.sample_type,
      fastingRequired: t.fasting_required ? `${t.fasting_hours || 8} Hours Fasting` : 'No Fasting Required',
      tatHours: t.turnaround_hours || 12,
      originalPrice: Number(t.original_price),
      discountPrice: Number(t.discount_price),
      parametersCount: (t.parameters || []).length || 1,
      parametersList: t.parameters || [],
      description: t.description || '',
      whyTakeThisTest: t.why_needed || '',
      preparationInstructions: t.fasting_required ? ['8-10 Hours overnight fasting required', 'Water is allowed'] : ['No special preparation needed'],
      isPopular: t.is_popular,
      isWinterSeasonal: t.is_smog_related,
      genderRestriction: 'ALL',
      labOfferings: (t.lab_test_offerings || []).map((o: any) => ({
        labId: o.lab_id,
        labName: o.lab_name,
        labShortName: o.lab_short_name,
        labLogo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&auto=format&fit=crop&q=80',
        originalPrice: Number(o.original_price),
        discountPrice: Number(o.discount_price),
        tatHours: 8,
        tatText: o.turnaround_time,
        rating: Number(o.rating) || 4.8,
        reviewCount: 1000,
        isNablAccredited: true,
        isCapAccredited: false,
        earliestSlot: '6:00 AM',
        sampleType: t.sample_type,
        fastingRequired: o.fasting_guidelines || 'Standard',
        homeCollectionAvailable: true,
        centerVisitAvailable: true,
      })),
    }));
  } catch (e) {
    return POPULAR_TESTS;
  }
};

export const getCatalogDoctors = async (): Promise<Doctor[]> => {
  if (!isSupabaseConfigured() || !supabase) return DOCTOR_SPECIALISTS;
  try {
    const { data, error } = await supabase.from('doctors').select('*');
    if (error || !data || data.length === 0) return DOCTOR_SPECIALISTS;
    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      title: 'Senior Consultant',
      specialty: d.specialty,
      degrees: d.qualifications || 'MBBS, MD',
      institution: d.institution,
      experienceYears: d.experience_years,
      languages: d.languages || ['English', 'Hindi'],
      rating: Number(d.rating) || 4.9,
      reviewCount: d.review_count || 100,
      consultationFee: Number(d.consultation_fee) || 0,
      isFreeReportReviewAvailable: Boolean(d.is_free_report_review_available),
      avatarUrl: d.avatar,
      city: d.city,
      about: d.about || '',
      availableSlotsToday: d.available_slots_today || [],
      availableModes: d.available_modes || ['VIDEO', 'IN_CLINIC'],
    }));
  } catch (e) {
    return DOCTOR_SPECIALISTS;
  }
};

export const getCatalogPackages = async (): Promise<HealthPackage[]> => {
  if (!isSupabaseConfigured() || !supabase) return HEALTH_PACKAGES;
  try {
    const { data, error } = await supabase.from('health_packages').select('*');
    if (error || !data || data.length === 0) return HEALTH_PACKAGES;
    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      tagline: p.tagline || '',
      badge: p.badge,
      originalPrice: Number(p.original_price),
      discountPrice: Number(p.discount_price),
      parametersCount: p.total_tests || 30,
      sampleType: p.sample_type || 'Blood & Urine',
      fastingRequired: p.fasting_required ? `${p.fasting_hours || 10} Hours Fasting` : 'No Fasting Required',
      tatHours: 12,
      idealFor: p.ideal_for || 'General Health',
      ageGroup: p.age_group || 'All Age Groups',
      gender: p.gender || 'ALL',
      highlights: p.highlights || [],
      description: p.description || '',
      testsIncluded: [],
      labOfferings: [],
    }));
  } catch (e) {
    return HEALTH_PACKAGES;
  }
};

export const getCatalogLabs = async (): Promise<LabBrand[]> => {
  if (!isSupabaseConfigured() || !supabase) return LAB_BRANDS;
  try {
    const { data, error } = await supabase.from('lab_brands').select('*');
    if (error || !data || data.length === 0) return LAB_BRANDS;
    return data.map((l: any) => ({
      id: l.id,
      name: l.name,
      shortName: l.short_name,
      logo: l.logo,
      tagline: l.tagline,
      rating: Number(l.rating) || 4.8,
      reviewCount: l.review_count,
      isNablAccredited: l.is_nabl_accredited,
      isCapAccredited: l.is_cap_accredited,
      isIsoCertified: l.is_iso_certified,
      totalCentersNorthIndia: l.total_centers_north_india,
      homeCollectionSpeed: l.home_collection_speed,
      description: l.description,
      badge: l.badge,
      primaryColor: l.primary_color || '#00558F',
    }));
  } catch (e) {
    return LAB_BRANDS;
  }
};
