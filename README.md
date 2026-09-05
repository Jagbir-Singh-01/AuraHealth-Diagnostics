# AuraHealth Diagnostics | North India's Diagnostic & Telehealth Network

> A modern, full-featured diagnostic laboratory and healthcare web portal inspired by **Agilus Diagnostics**, tailored specifically for the **North India region** (Delhi-NCR, Punjab, Haryana, Uttar Pradesh, Rajasthan, Chandigarh, Himachal Pradesh, Uttarakhand, and Jammu & Kashmir).

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![NABL & CAP](https://img.shields.io/badge/Accreditation-NABL%20%7C%20CAP%20%7C%20ISO%2015189-success)

---

## ✨ Features

### 📍 1. North India Localization & Pincode Serviceability
- Real-time city selector and 6-digit pincode validator for Northern hubs:
  - **Delhi NCR**: New Delhi, Gurugram, Noida, Faridabad, Ghaziabad
  - **Punjab & Tricity**: Chandigarh, Mohali, Panchkula, Ludhiana, Amritsar, Jalandhar
  - **Uttar Pradesh**: Lucknow, Kanpur, Varanasi, Agra, Prayagraj
  - **Rajasthan**: Jaipur, Jodhpur, Udaipur
  - **Uttarakhand & Himachal**: Dehradun, Haridwar, Rishikesh, Shimla

### 🌫️ 2. Winter AQI & Smog Respiratory Care
- Specialized diagnostic panel designed by pulmonologists to counter North India winter smog, stubble smoke, and high PM2.5 pollution:
  - **Total Serum IgE & Absolute Eosinophils** (airway allergy markers)
  - **High-Sensitivity CRP** (systemic smog inflammation indicator)
  - **Vitamin D3 & B12** (immune resilience against winter infections)
  - **Complete Blood Count (CBC) with ESR & Platelet Count**

### 🧪 3. 500+ Pathology Catalog & Preventive Health Packages
- **Full Body Active Checkup (68 parameters)**
- **Platinum Executive Checkup with Vitamins & Cardiac (96 parameters)**
- **Senior Citizen Comprehensive Profile (88 parameters)**
- **Women Hormonal, PCOD & Thyroid Wellness (52 parameters)**
- Single pathology tests: CBC with ESR, HbA1c Sugar with eAG, Vitamin D 25-OH, Vitamin B12, Thyroid Profile Total, Lipid Profile Comprehensive, LFT, KFT with Electrolytes, Fever Profile (Dengue/Typhoid/Malaria), Total PSA, Prenatal Double Marker, etc.

### 🩺 4. Doctor Consultation & Free Report Interpretation
- Consult specialist doctors from top institutions (**AIIMS New Delhi, PGIMER Chandigarh, KGMU Lucknow, Lady Hardinge**).
- **Free 10-Minute Report Review** with in-house pathologists.
- Modes: **HD Video Teleconsultation** or **In-Clinic Lab Visit**.
- Instant appointment reference ID with video room links and calendar reminders.

### 📤 5. 1-Click Doctor Prescription Quick Order
- Drag-and-drop doctor's prescription slip.
- Guaranteed 10-minute customer coordinator callback.

### 🚚 6. Multi-Step Home Sample Collection Booking
- Manage multi-person family beneficiaries (Self, Spouse, Parents, Children).
- **6:00 AM – 11:00 AM Early Morning Fasting Slots**.
- Flexible payment: Instant UPI / GPay / Credit Card or Cash on Collection (COD).
- Promo coupons: `NORTH20` (20% off), `HEALTHFIRST` (₹250 off), `SENIOR25` (25% off).
- **Live Phlebotomist Dispatch Tracking** with badge and vaccination certificate.

### 📄 7. Certified Lab Report Download & Vital Health Tracker
- Patient OTP report lookup.
- NABL & CAP compliant diagnostic report preview with doctor's digital signature and QR verification link.
- One-click print / downloadable format.
- Longitudinal biomarker tracking (HbA1c, Cholesterol, Vitamin D3, Serum IgE) across multiple visits.

### 🏥 8. Interactive North India Lab Locator
- Searchable directory of 10+ reference laboratories and 250+ collection points with operating hours, phone contacts, facilities (Digital X-Ray, 4D Ultrasound, CT/MRI, ECG), and Google Maps integration.

### ⚙️ 9. Admin & Lab Operations Console (`/admin`)
- Real-time booking dispatch board.
- Phlebotomist rider assignment.
- Pathologist test result entry and electronic LIMS report release.
- Live test catalog price management.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/aurahealth-diagnostics.git

# Navigate to directory
cd aurahealth-diagnostics

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to explore the website.

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🛠️ Project Structure

```
aurahealth-diagnostics/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.tsx           # Operations & phlebotomy dispatch
│   │   ├── CartDrawer.tsx               # Slide-over test cart
│   │   ├── CitySelectorModal.tsx        # North India cities & pincode validator
│   │   ├── DoctorConsultation.tsx       # Specialist doctor consult & teleconsult
│   │   ├── Footer.tsx                   # Footer with accreditations & hotlines
│   │   ├── HealthBlogSection.tsx        # Regional health awareness articles
│   │   ├── HealthTracker.tsx            # Multi-visit vital biomarker tracker
│   │   ├── HeroSection.tsx              # Universal test search & action center
│   │   ├── HomeCollectionBookingModal.tsx # Multi-step checkout & slot scheduler
│   │   ├── LabLocator.tsx               # Interactive lab center directory
│   │   ├── Navbar.tsx                   # Multi-tiered navigation & toll-free bar
│   │   ├── PackageGrid.tsx              # Full body checkup packages
│   │   ├── QuickPrescriptionModal.tsx   # Prescription photo upload & callback
│   │   ├── ReportDownloadPortal.tsx     # OTP report download & clinical viewer
│   │   ├── TestCatalog.tsx              # 500+ single blood test browser
│   │   └── WinterSmogBanner.tsx         # North India AQI smog defense panel
│   ├── data/
│   │   └── mockData.ts                  # Tests, packages, doctors, labs dataset
│   ├── types/
│   │   └── index.ts                     # TypeScript data interfaces
│   ├── App.tsx                          # App coordinator & tab router
│   ├── main.tsx                         # React entry point
│   └── index.css                        # Tailwind directives & clinical styles
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 📜 License
This project is open-source under the MIT License.
