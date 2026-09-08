import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// In-Memory Data Store (Easily swappable with MongoDB / PostgreSQL / SQLite)
let bookings = [];
let doctorAppointments = [];
let notifications = [];

// ==========================================
// 1. SYSTEM & HEALTH CHECK ROUTES
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    server: 'AuraHealth Diagnostics Backend',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    stats: {
      totalLabBookings: bookings.length,
      totalDoctorAppointments: doctorAppointments.length,
      activeNotifications: notifications.filter((n) => !n.isRead).length,
    },
  });
});

// ==========================================
// 2. MEDICAL LAB TEST BOOKINGS API
// ==========================================

// Get all lab bookings
app.get('/api/bookings', (req, res) => {
  const { status, city, search } = req.query;
  let result = [...bookings];

  if (status && status !== 'ALL') {
    result = result.filter((b) => b.status === status);
  }
  if (city && city !== 'ALL') {
    result = result.filter((b) => b.patientDetails?.city === city);
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (b) =>
        b.bookingNumber?.toLowerCase().includes(q) ||
        b.patientDetails?.name?.toLowerCase().includes(q) ||
        b.patientDetails?.phone?.includes(q) ||
        b.selectedLabName?.toLowerCase().includes(q)
    );
  }

  res.json(result);
});

// Create new direct lab test booking (Patient Checkout)
app.post('/api/bookings', (req, res) => {
  try {
    const { patientDetails, items, slotDate, slotTime, selectedLabName, selectedLabBrandId, subtotal, discount, collectionFee, totalAmount, beneficiaries } = req.body;

    if (!patientDetails?.name || !patientDetails?.phone) {
      return res.status(400).json({ error: 'Patient name and mobile number are required.' });
    }

    const bookingNumber = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    const testNames = Array.isArray(items) ? items.map((i) => i.title || i.name) : ['Diagnostic Blood Test'];

    const newBooking = {
      id: `bk-${Date.now()}`,
      bookingNumber,
      createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status: 'PENDING_TEAM_BOOKING',
      bookingType: 'HOME_COLLECTION',
      selectedLabName: selectedLabName || 'Agilus Diagnostics',
      selectedLabBrandId: selectedLabBrandId || 'lab-agilus',
      patientDetails: {
        name: patientDetails.name.trim(),
        phone: patientDetails.phone.trim(),
        email: patientDetails.email || '',
        age: patientDetails.age || 40,
        gender: patientDetails.gender || 'Male',
        address: patientDetails.address || '',
        city: patientDetails.city || 'Gurugram',
        state: patientDetails.state || 'Delhi NCR',
        pincode: patientDetails.pincode || '',
        landmark: patientDetails.landmark || '',
      },
      beneficiaries: beneficiaries || [
        {
          id: `ben-self`,
          name: patientDetails.name.trim(),
          age: patientDetails.age || 40,
          gender: patientDetails.gender || 'Male',
          relation: 'Self',
          phoneNumber: patientDetails.phone.trim(),
        },
      ],
      items: items || [],
      slotDate: slotDate || new Date().toISOString().split('T')[0],
      slotTime: slotTime || '06:00 AM - 07:00 AM (Early Fasting)',
      subtotal: subtotal || totalAmount || 0,
      discount: discount || 0,
      collectionFee: collectionFee || 0,
      totalAmount: totalAmount || 0,
      paymentMode: 'PAY_DIRECTLY_TO_LAB',
      paymentStatus: 'PAY_ON_COLLECTION_TO_LAB',
      teamNotes: `Direct test registration received. Assigned to operations concierge for ${selectedLabName || 'Agilus'}.`,
    };

    // Auto-generate high-priority team notification
    const notification = {
      id: `notif-${Date.now()}`,
      type: 'LAB_TEST_BOOKING',
      bookingNumber,
      patientName: newBooking.patientDetails.name,
      patientPhone: newBooking.patientDetails.phone,
      selectedLab: newBooking.selectedLabName,
      testNames,
      totalAmount: newBooking.totalAmount,
      slotTime: `${newBooking.slotDate} (${newBooking.slotTime.split(' ')[0]})`,
      city: newBooking.patientDetails.city,
      timestamp: 'Just now',
      isRead: false,
    };

    bookings.unshift(newBooking);
    notifications.unshift(notification);

    res.status(201).json({
      success: true,
      message: `Booking request ${bookingNumber} created successfully.`,
      booking: newBooking,
      notification,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking request', details: error.message });
  }
});

// Update booking status (e.g. Registered in Lab, Assigned Phlebotomist, Payment Verified)
app.put('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  bookings[index] = {
    ...bookings[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    message: 'Booking updated successfully.',
    booking: bookings[index],
  });
});

// ==========================================
// 3. DOCTOR TELECONSULTATION & REPORT REVIEW API
// ==========================================

// Get all doctor appointments
app.get('/api/doctor-appointments', (req, res) => {
  const { status, doctorId, search } = req.query;
  let result = [...doctorAppointments];

  if (status && status !== 'ALL') {
    result = result.filter((a) => a.status === status);
  }
  if (doctorId && doctorId !== 'ALL') {
    result = result.filter((a) => a.doctorId === doctorId);
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (a) =>
        a.appointmentNumber?.toLowerCase().includes(q) ||
        a.patientName?.toLowerCase().includes(q) ||
        a.doctorName?.toLowerCase().includes(q) ||
        a.patientPhone?.includes(q)
    );
  }

  res.json(result);
});

// Create new doctor consultation request
app.post('/api/doctor-appointments', (req, res) => {
  try {
    const { doctorId, doctorName, doctorSpecialty, doctorInstitution, patientName, patientAge, patientGender, patientPhone, patientCity, consultationMode, appointmentDate, appointmentTime, symptoms, feePaid, isSponsoredFreeReview } = req.body;

    if (!patientName || !patientPhone) {
      return res.status(400).json({ error: 'Patient Name and Mobile Number are required.' });
    }

    const apptNo = `DOC-APT-${Math.floor(10000 + Math.random() * 90000)}`;
    const mode = consultationMode || 'VIDEO';

    const newAppointment = {
      id: `apt-${Date.now()}`,
      appointmentNumber: apptNo,
      createdAt: 'Just now',
      doctorId: doctorId || 'doc-general',
      doctorName: doctorName || 'Senior Specialist Physician',
      doctorSpecialty: doctorSpecialty || 'General Medicine',
      doctorInstitution: doctorInstitution || 'AIIMS / PGIMER Specialist Board',
      patientName: patientName.trim(),
      patientAge: Number(patientAge) || 35,
      patientGender: patientGender || 'Male',
      patientPhone: patientPhone.trim(),
      patientCity: patientCity || 'Delhi NCR',
      consultationMode: mode,
      appointmentDate: appointmentDate || new Date().toISOString().split('T')[0],
      appointmentTime: appointmentTime || '05:00 PM',
      symptoms: symptoms || 'Routine medical review & test report discussion',
      status: 'PENDING_TEAM_CONFIRMATION',
      feePaid: feePaid || 0,
      isSponsoredFreeReview: isSponsoredFreeReview !== undefined ? isSponsoredFreeReview : (feePaid === 0),
      meetLink: mode === 'VIDEO' ? `https://meet.aurahealth.in/room/${apptNo.toLowerCase()}` : undefined,
    };

    // Auto-generate notification for Operations Team
    const notification = {
      id: `notif-${Date.now()}`,
      type: 'DOCTOR_CONSULTATION',
      bookingNumber: apptNo,
      patientName: newAppointment.patientName,
      patientPhone: newAppointment.patientPhone,
      selectedLab: `${newAppointment.doctorName} (${newAppointment.doctorSpecialty})`,
      testNames: [newAppointment.isSponsoredFreeReview ? 'Free 10-Min Report Review' : 'Doctor Specialist Teleconsult'],
      totalAmount: newAppointment.feePaid,
      slotTime: `${newAppointment.appointmentTime} on ${newAppointment.appointmentDate}`,
      city: newAppointment.patientCity,
      timestamp: 'Just now',
      isRead: false,
    };

    doctorAppointments.unshift(newAppointment);
    notifications.unshift(notification);

    res.status(201).json({
      success: true,
      message: `Doctor appointment request ${apptNo} submitted.`,
      appointment: newAppointment,
      notification,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create doctor consultation request', details: error.message });
  }
});

// Confirm doctor appointment and generate HD meeting room link
app.put('/api/doctor-appointments/:id', (req, res) => {
  const { id } = req.params;
  const index = doctorAppointments.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Doctor appointment not found.' });
  }

  doctorAppointments[index] = {
    ...doctorAppointments[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    message: 'Doctor appointment updated successfully.',
    appointment: doctorAppointments[index],
  });
});

// ==========================================
// 4. OPERATIONS TEAM NOTIFICATIONS API
// ==========================================

// Get all notifications
app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

// Mark single notification as read
app.put('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notif = notifications.find((n) => n.id === id);
  if (notif) {
    notif.isRead = true;
    res.json({ success: true, notification: notif });
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
});

// Mark all notifications as read
app.post('/api/notifications/mark-all-read', (req, res) => {
  notifications = notifications.map((n) => ({ ...n, isRead: true }));
  res.json({ success: true, count: notifications.length });
});

// ==========================================
// 5. STATIC FILES & CLIENT-SIDE SPA ROUTING
// ==========================================
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback for React SPA client routes (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  next();
});

// ==========================================
// 6. SERVER STARTUP
// ==========================================
app.listen(PORT, () => {
  console.log('====================================================');
  console.log('🩺 AuraHealth Diagnostics Full-Stack Backend Online');
  console.log(`🌐 Server URL:        http://localhost:${PORT}`);
  console.log(`📊 Health Check:      http://localhost:${PORT}/api/health`);
  console.log(`🔬 Lab Bookings API:  http://localhost:${PORT}/api/bookings`);
  console.log(`🩺 Doctor Appts API:  http://localhost:${PORT}/api/doctor-appointments`);
  console.log(`🔔 Notifications API: http://localhost:${PORT}/api/notifications`);
  console.log('====================================================');
});
