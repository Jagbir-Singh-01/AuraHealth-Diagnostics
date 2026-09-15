-- ====================================================================
-- AURAHEALTH DIAGNOSTICS & TELEMEDICINE POSTGRESQL SCHEMA (SUPABASE)
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. ENUMS FOR SYSTEM LIFECYCLES
-- --------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
        'PENDING_TEAM_BOOKING',
        'BOOKED_BY_TEAM',
        'PHLEBOTOMIST_ASSIGNED',
        'SAMPLE_COLLECTED',
        'REPORT_GENERATED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE doctor_appt_status AS ENUM (
        'PENDING_TEAM_CONFIRMATION',
        'CONFIRMED_BY_TEAM',
        'COMPLETED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_mode AS ENUM (
        'PAY_DIRECTLY_TO_LAB',
        'CASH_ON_COLLECTION',
        'DIRECT_UPI_TO_PHLEBOTOMIST',
        'ONLINE_ADVANCE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE consultation_mode AS ENUM (
        'VIDEO',
        'IN_CLINIC'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- --------------------------------------------------------------------
-- 2. REFERENCE & MOCK CATALOG TABLES
-- --------------------------------------------------------------------

-- Cities Table
CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    is_major_hub BOOLEAN DEFAULT TRUE,
    aqi_zone VARCHAR(50) DEFAULT 'Severe AQI Alert',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Diagnostic Lab Brands
CREATE TABLE IF NOT EXISTS lab_brands (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    logo TEXT NOT NULL,
    tagline TEXT,
    rating NUMERIC(2,1) DEFAULT 4.8,
    review_count INT DEFAULT 1000,
    is_nabl_accredited BOOLEAN DEFAULT TRUE,
    is_cap_accredited BOOLEAN DEFAULT FALSE,
    is_iso_certified BOOLEAN DEFAULT TRUE,
    total_centers_north_india INT DEFAULT 50,
    home_collection_speed VARCHAR(100),
    description TEXT,
    badge VARCHAR(100),
    primary_color VARCHAR(20) DEFAULT '#00558F',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medical Tests Catalog
CREATE TABLE IF NOT EXISTS medical_tests (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    sample_type VARCHAR(50) NOT NULL,
    fasting_required BOOLEAN DEFAULT FALSE,
    fasting_hours INT DEFAULT 0,
    turnaround_hours INT DEFAULT 12,
    original_price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2) NOT NULL,
    description TEXT,
    why_needed TEXT,
    ideal_for VARCHAR(100),
    gender VARCHAR(10) DEFAULT 'ALL',
    age_group VARCHAR(50) DEFAULT 'All Age Groups',
    parameters TEXT[] DEFAULT '{}',
    is_popular BOOLEAN DEFAULT FALSE,
    is_smog_related BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Multi-Lab Test Offerings (Price & Turnaround Matrix)
CREATE TABLE IF NOT EXISTS lab_test_offerings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id VARCHAR(50) REFERENCES medical_tests(id) ON DELETE CASCADE,
    lab_id VARCHAR(50) REFERENCES lab_brands(id) ON DELETE CASCADE,
    lab_name VARCHAR(100) NOT NULL,
    lab_short_name VARCHAR(50) NOT NULL,
    original_price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2) NOT NULL,
    turnaround_time VARCHAR(50) NOT NULL,
    accreditation VARCHAR(50) DEFAULT 'NABL Accredited',
    fasting_guidelines TEXT,
    rating NUMERIC(2,1) DEFAULT 4.8,
    is_fastest_reporting BOOLEAN DEFAULT FALSE,
    is_best_price BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health Checkup Packages
CREATE TABLE IF NOT EXISTS health_packages (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    tagline TEXT,
    badge VARCHAR(50),
    total_tests INT DEFAULT 10,
    original_price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2) NOT NULL,
    sample_type VARCHAR(50) NOT NULL,
    fasting_required BOOLEAN DEFAULT TRUE,
    fasting_hours INT DEFAULT 10,
    turnaround_time VARCHAR(50) NOT NULL,
    ideal_for VARCHAR(100),
    age_group VARCHAR(50) DEFAULT 'Adults 25+',
    gender VARCHAR(10) DEFAULT 'ALL',
    highlights TEXT[] DEFAULT '{}',
    description TEXT,
    is_winter_smog_focus BOOLEAN DEFAULT FALSE,
    is_fever_focus BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctor Specialists Directory
CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    qualifications VARCHAR(150) NOT NULL,
    experience_years INT NOT NULL,
    institution VARCHAR(150) NOT NULL,
    city VARCHAR(50) NOT NULL,
    rating NUMERIC(2,1) DEFAULT 4.9,
    review_count INT DEFAULT 100,
    avatar TEXT NOT NULL,
    consultation_fee DECIMAL(10,2) DEFAULT 0,
    is_free_report_review_available BOOLEAN DEFAULT FALSE,
    available_modes TEXT[] DEFAULT '{VIDEO, IN_CLINIC}',
    available_slots_today TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{English, Hindi}',
    about TEXT,
    specialized_conditions TEXT[] DEFAULT '{}',
    nmc_registration_number VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promo Coupons
CREATE TABLE IF NOT EXISTS promo_coupons (
    code VARCHAR(30) PRIMARY KEY,
    discount_percent INT,
    flat_discount DECIMAL(10,2),
    min_order DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. PATIENTS & OPERATIONS TABLES
-- --------------------------------------------------------------------

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    age INT,
    gender VARCHAR(10),
    blood_group VARCHAR(10),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50) DEFAULT 'Delhi NCR',
    pincode VARCHAR(10),
    pre_existing_conditions TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Diagnostic Lab Test Bookings (Direct Concierge Registration)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(30) UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    patient_name VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(15) NOT NULL,
    patient_email VARCHAR(100),
    patient_age INT DEFAULT 40,
    patient_gender VARCHAR(10) DEFAULT 'Male',
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) DEFAULT 'Delhi NCR',
    pincode VARCHAR(10) NOT NULL,
    landmark VARCHAR(100),
    booking_type VARCHAR(30) DEFAULT 'HOME_COLLECTION',
    selected_lab_name VARCHAR(100) NOT NULL,
    selected_lab_brand_id VARCHAR(50) NOT NULL,
    official_lab_ref_number VARCHAR(50),
    slot_date DATE NOT NULL,
    slot_time VARCHAR(50) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    collection_fee DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_mode payment_mode DEFAULT 'PAY_DIRECTLY_TO_LAB',
    payment_status VARCHAR(50) DEFAULT 'PAY_ON_COLLECTION_TO_LAB',
    status booking_status DEFAULT 'PENDING_TEAM_BOOKING',
    booked_by_operator_name VARCHAR(100),
    team_notes TEXT,
    phlebotomist_name VARCHAR(100),
    phlebotomist_phone VARCHAR(15),
    phlebotomist_badge VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking Line Items (Tests / Packages in Order)
CREATE TABLE IF NOT EXISTS booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    item_title VARCHAR(150) NOT NULL,
    item_type VARCHAR(20) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    lab_name VARCHAR(100) NOT NULL,
    for_beneficiary_name VARCHAR(100) NOT NULL
);

-- Doctor Teleconsultations & Report Reviews
CREATE TABLE IF NOT EXISTS doctor_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_number VARCHAR(30) UNIQUE NOT NULL,
    doctor_id VARCHAR(50) REFERENCES doctors(id) ON DELETE SET NULL,
    doctor_name VARCHAR(100) NOT NULL,
    doctor_specialty VARCHAR(100) NOT NULL,
    doctor_institution VARCHAR(150),
    patient_name VARCHAR(100) NOT NULL,
    patient_age INT NOT NULL,
    patient_gender VARCHAR(10) NOT NULL,
    patient_phone VARCHAR(15) NOT NULL,
    patient_city VARCHAR(50) NOT NULL,
    consultation_mode consultation_mode DEFAULT 'VIDEO',
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(30) NOT NULL,
    symptoms TEXT,
    fee_paid DECIMAL(10,2) DEFAULT 0,
    is_sponsored_free_review BOOLEAN DEFAULT FALSE,
    status doctor_appt_status DEFAULT 'PENDING_TEAM_CONFIRMATION',
    meet_link TEXT,
    confirmed_by_operator_name VARCHAR(100),
    team_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Realtime Operations Desk Notifications
CREATE TABLE IF NOT EXISTS team_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(30) NOT NULL,
    booking_number VARCHAR(30) NOT NULL,
    patient_name VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(15) NOT NULL,
    selected_lab VARCHAR(100) NOT NULL,
    test_names TEXT[] NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    slot_time VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. PERFORMANCE INDEXES
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_doctor_appts_status ON doctor_appointments(status);
CREATE INDEX IF NOT EXISTS idx_doctor_appts_created ON doctor_appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON team_notifications(is_read) WHERE is_read = FALSE;

-- --------------------------------------------------------------------
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Allow public read access to catalog tables
CREATE POLICY "Public Read Catalog Tests" ON medical_tests FOR SELECT USING (true);
CREATE POLICY "Public Read Catalog Brands" ON lab_brands FOR SELECT USING (true);
CREATE POLICY "Public Read Catalog Offerings" ON lab_test_offerings FOR SELECT USING (true);
CREATE POLICY "Public Read Catalog Packages" ON health_packages FOR SELECT USING (true);
CREATE POLICY "Public Read Catalog Doctors" ON doctors FOR SELECT USING (true);
CREATE POLICY "Public Read Catalog Coupons" ON promo_coupons FOR SELECT USING (true);
CREATE POLICY "Public Read Catalog Cities" ON cities FOR SELECT USING (true);

-- Allow public anonymous inserts and reads for patient bookings & appointments
CREATE POLICY "Public Insert Bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public Update Bookings" ON bookings FOR UPDATE USING (true);

CREATE POLICY "Public Insert Booking Items" ON booking_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Booking Items" ON booking_items FOR SELECT USING (true);

CREATE POLICY "Public Insert Doctor Appts" ON doctor_appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Doctor Appts" ON doctor_appointments FOR SELECT USING (true);
CREATE POLICY "Public Update Doctor Appts" ON doctor_appointments FOR UPDATE USING (true);

CREATE POLICY "Public Insert Notifications" ON team_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Notifications" ON team_notifications FOR SELECT USING (true);
CREATE POLICY "Public Update Notifications" ON team_notifications FOR UPDATE USING (true);

CREATE POLICY "Public Insert Patients" ON patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Patients" ON patients FOR SELECT USING (true);
CREATE POLICY "Public Update Patients" ON patients FOR UPDATE USING (true);

-- --------------------------------------------------------------------
-- 6. ENABLE REALTIME PUBLICATION FOR LIVE WEBSOCKET SYNC
-- --------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE doctor_appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE team_notifications;
