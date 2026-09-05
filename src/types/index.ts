export interface TestParameter {
  name: string;
  normalRange?: string;
  unit?: string;
  description?: string;
}

export interface LabBrand {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  isNablAccredited: boolean;
  isCapAccredited: boolean;
  isIsoCertified: boolean;
  totalCentersNorthIndia: number;
  homeCollectionSpeed: string;
  description: string;
  badge?: string;
  primaryColor: string;
}

export interface LabTestOffering {
  labId: string;
  labName: string;
  labShortName: string;
  labLogo: string;
  labBadge?: string;
  originalPrice: number;
  discountPrice: number;
  tatHours: number;
  tatText: string;
  rating: number;
  reviewCount: number;
  isNablAccredited: boolean;
  isCapAccredited: boolean;
  earliestSlot: string;
  sampleType: string;
  fastingRequired: string;
  homeCollectionAvailable: boolean;
  centerVisitAvailable: boolean;
}

export interface TestItem {
  id: string;
  name: string;
  code: string;
  category: 'Routine Pathology' | 'Diabetes' | 'Thyroid' | 'Heart' | 'Liver & Kidney' | 'Vitamins' | 'Seasonal & Fever' | 'Cancer Screening' | 'Allergy & Smog' | 'Women Health';
  sampleType: string;
  fastingRequired: string;
  tatHours: number;
  originalPrice: number;
  discountPrice: number;
  parametersCount: number;
  parametersList: string[];
  description: string;
  whyTakeThisTest: string;
  preparationInstructions: string[];
  isPopular?: boolean;
  isWinterSeasonal?: boolean;
  genderRestriction?: 'ALL' | 'MALE_ONLY' | 'FEMALE_ONLY';
  labOfferings: LabTestOffering[];
}

export interface HealthPackage {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  category: 'Full Body' | 'Senior Citizen' | 'Winter & Respiratory' | 'Women Wellness' | 'Men Health' | 'Diabetes & Heart';
  originalPrice: number;
  discountPrice: number;
  parametersCount: number;
  sampleType: string;
  fastingRequired: string;
  tatHours: number;
  idealFor: string;
  ageGroup: string;
  gender: 'ALL' | 'MALE' | 'FEMALE';
  testsIncluded: {
    categoryName: string;
    testNames: string[];
  }[];
  highlights: string[];
  description: string;
  labOfferings: LabTestOffering[];
}

export interface LabCenter {
  id: string;
  name: string;
  labBrandId: string;
  labBrandName: string;
  state: 'Delhi NCR' | 'Punjab' | 'Haryana' | 'Uttar Pradesh' | 'Rajasthan' | 'Himachal Pradesh' | 'Uttarakhand' | 'Jammu & Kashmir' | 'Chandigarh';
  city: string;
  area: string;
  address: string;
  pincode: string;
  phone: string;
  operatingHours: string;
  email: string;
  isNablAccredited: boolean;
  isRegionalReferenceLab: boolean;
  facilities: string[];
  mapEmbedQuery: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  relation: 'Self' | 'Spouse' | 'Father' | 'Mother' | 'Son' | 'Daughter' | 'Other';
  phoneNumber?: string;
}

export interface PatientProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  preExistingConditions: string[];
  savedBeneficiaries: Beneficiary[];
  registeredAt: string;
  isLoggedIn: boolean;
}

export interface CartItem {
  id: string;
  itemId: string;
  type: 'TEST' | 'PACKAGE';
  item: TestItem | HealthPackage;
  selectedLabOffering: LabTestOffering;
  beneficiaryIds: string[];
}

export interface TeamNotification {
  id: string;
  bookingNumber: string;
  patientName: string;
  patientPhone: string;
  selectedLab: string;
  testNames: string[];
  totalAmount: number;
  slotTime: string;
  city: string;
  timestamp: string;
  isRead: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  officialLabRefNumber?: string;
  createdAt: string;
  status: 'REQUEST_RECEIVED' | 'REGISTERED_WITH_LAB' | 'PHLEBOTOMIST_ASSIGNED' | 'SAMPLE_COLLECTED' | 'REPORT_GENERATED';
  bookingType: 'HOME_COLLECTION' | 'LAB_VISIT';
  selectedLabName: string;
  selectedLabBrandId?: string;
  patientDetails: {
    name: string;
    phone: string;
    email?: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    address?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  beneficiaries: Beneficiary[];
  items: {
    title: string;
    type: 'TEST' | 'PACKAGE';
    price: number;
    labName: string;
    forBeneficiaryName: string;
  }[];
  slotDate: string;
  slotTime: string;
  subtotal: number;
  discount: number;
  collectionFee: number;
  totalAmount: number;
  paymentMode: 'PAY_DIRECTLY_TO_LAB' | 'CASH_ON_COLLECTION' | 'DIRECT_UPI_TO_PHLEBOTOMIST';
  paymentStatus: 'PAY_ON_COLLECTION_TO_LAB' | 'PAID_TO_LAB' | 'PENDING';
  teamAssignedAgent?: string;
  teamNotes?: string;
  phlebotomist?: {
    name: string;
    phone: string;
    badgeNumber: string;
    vaccinationStatus: string;
    liveLocationStatus: string;
  };
  reportId?: string;
}

export interface ReportParameterResult {
  name: string;
  resultValue: string;
  numericValue?: number;
  unit: string;
  referenceRange: string;
  status: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  methodology?: string;
}

export interface DiagnosticReport {
  id: string;
  reportNumber: string;
  bookingNumber: string;
  barcode: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  referringDoctor: string;
  sampleCollectedAt: string;
  sampleReceivedAt: string;
  reportGeneratedAt: string;
  labBranch: string;
  nablRegNumber: string;
  qrVerificationUrl: string;
  groups: {
    groupName: string;
    parameters: ReportParameterResult[];
  }[];
  doctorRemarks: string;
  pathologist: {
    name: string;
    designation: string;
    degrees: string;
    signatureText: string;
  };
}

export interface PrescriptionRecord {
  id: string;
  patientName: string;
  phone: string;
  city: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
  remarks: string;
  status: 'RECEIVED' | 'UNDER_DOCTOR_REVIEW' | 'TESTS_IDENTIFIED' | 'ORDER_CONFIRMED';
  estimatedCost?: number;
}

export interface NorthIndiaCity {
  name: string;
  state: string;
  isPopular: boolean;
  homeCollectionAvailable: boolean;
  pincodePrefixes: string[];
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: 'General Physician' | 'Pulmonologist (Chest & Smog)' | 'Diabetologist & Endocrinologist' | 'Cardiologist' | 'Gynecologist' | 'Pathologist & Lab Report Consultant';
  degrees: string;
  institution: string;
  experienceYears: number;
  languages: string[];
  rating: number;
  reviewCount: number;
  consultationFee: number;
  isFreeReportReviewAvailable?: boolean;
  avatarUrl: string;
  city: string;
  about: string;
  availableSlotsToday: string[];
  availableModes: ('VIDEO' | 'IN_CLINIC')[];
}

export interface DoctorAppointment {
  id: string;
  appointmentNumber: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  consultationMode: 'VIDEO' | 'IN_CLINIC';
  appointmentDate: string;
  appointmentTime: string;
  symptoms: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  feePaid: number;
  meetLink?: string;
}
