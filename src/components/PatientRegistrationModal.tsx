import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Users,
  Plus,
  Trash2,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { PatientProfile, Beneficiary } from '../types';
import { NORTH_INDIA_CITIES } from '../data/mockData';
import confetti from 'canvas-confetti';

interface PatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientProfile: PatientProfile;
  setPatientProfile: (profile: PatientProfile) => void;
  onNotify: (msg: string) => void;
}

export const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({
  isOpen,
  onClose,
  patientProfile,
  setPatientProfile,
  onNotify,
}) => {
  const [activeStep, setActiveStep] = useState<'LOGIN' | 'PROFILE' | 'BENEFICIARIES'>('PROFILE');
  const [fullName, setFullName] = useState(patientProfile.fullName);
  const [phone, setPhone] = useState(patientProfile.phone);
  const [email, setEmail] = useState(patientProfile.email);
  const [age, setAge] = useState(patientProfile.age);
  const [gender, setGender] = useState(patientProfile.gender);
  const [bloodGroup, setBloodGroup] = useState(patientProfile.bloodGroup || 'B+');
  const [address, setAddress] = useState(patientProfile.address);
  const [city, setCity] = useState(patientProfile.city);
  const [pincode, setPincode] = useState(patientProfile.pincode);
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    patientProfile.preExistingConditions
  );

  // New beneficiary form
  const [newBenName, setNewBenName] = useState('');
  const [newBenAge, setNewBenAge] = useState(30);
  const [newBenGender, setNewBenGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [newBenRelation, setNewBenRelation] = useState<'Spouse' | 'Father' | 'Mother' | 'Son' | 'Daughter' | 'Other'>('Spouse');

  if (!isOpen) return null;

  const conditionsList = [
    'Diabetes / Pre-diabetes',
    'Hypertension / High BP',
    'Thyroid Disorder',
    'High Cholesterol',
    'Asthma / Smog Allergy',
    'Senior Citizen (60+)',
    'PCOD / PCOS',
  ];

  const handleToggleCondition = (cond: string) => {
    if (selectedConditions.includes(cond)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== cond));
    } else {
      setSelectedConditions([...selectedConditions, cond]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Please fill in your Full Name and Mobile Number.');
      return;
    }

    const updatedProfile: PatientProfile = {
      ...patientProfile,
      fullName,
      phone,
      email,
      age,
      gender,
      bloodGroup,
      address,
      city,
      pincode,
      preExistingConditions: selectedConditions,
      isLoggedIn: true,
    };

    setPatientProfile(updatedProfile);
    onNotify(`Patient profile for "${fullName}" saved successfully!`);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}
    onClose();
  };

  const handleAddBeneficiary = () => {
    if (!newBenName) {
      alert('Please enter member name');
      return;
    }
    const newBen: Beneficiary = {
      id: `ben-${Date.now()}`,
      name: newBenName,
      age: newBenAge,
      gender: newBenGender,
      relation: newBenRelation,
    };
    const updated = {
      ...patientProfile,
      savedBeneficiaries: [...patientProfile.savedBeneficiaries, newBen],
    };
    setPatientProfile(updated);
    setNewBenName('');
    onNotify(`Added ${newBenName} (${newBenRelation}) to family profile.`);
  };

  const handleRemoveBeneficiary = (id: string) => {
    const updated = {
      ...patientProfile,
      savedBeneficiaries: patientProfile.savedBeneficiaries.filter((b) => b.id !== id),
    };
    setPatientProfile(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-brand-navy via-brand-darkBlue to-brand-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <User className="w-6 h-6 text-brand-teal" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-teal bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/60">
                Step 1 of 3: Patient Registration
              </span>
              <h2 className="text-lg font-black tracking-tight text-white mt-0.5">
                {patientProfile.isLoggedIn ? 'Manage Patient Profile' : 'Patient Registration / Sign In'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveStep('PROFILE')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeStep === 'PROFILE'
                ? 'border-brand-500 text-brand-navy'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            👤 Primary Patient Info
          </button>
          <button
            onClick={() => setActiveStep('BENEFICIARIES')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeStep === 'BENEFICIARIES'
                ? 'border-brand-500 text-brand-navy'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-brand-teal" />
            <span>Family Members ({patientProfile.savedBeneficiaries.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeStep === 'PROFILE' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mobile Number (For Reports &amp; OTP) *
                  </label>
                  <div className="relative">
                    <span className="text-xs font-bold text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-11 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Age *</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    City (North India)
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {NORTH_INDIA_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.state})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Home Collection Address &amp; Pincode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Flat / House No., Landmark..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="col-span-2 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="6-digit Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
              </div>

              {/* Health Conditions Chips */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Pre-existing Health Conditions (Helps lab doctors recommend tests):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {conditionsList.map((cond) => {
                    const isSelected = selectedConditions.includes(cond);
                    return (
                      <button
                        type="button"
                        key={cond}
                        onClick={() => handleToggleCondition(cond)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition ${
                          isSelected
                            ? 'bg-brand-navy text-white border-brand-navy'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {cond}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-brand-coral to-amber-500 hover:from-brand-coral hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Save &amp; Continue to Search Tests</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {activeStep === 'BENEFICIARIES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Add family members to book tests from different diagnostic labs in a single order:
              </p>

              {/* Existing Beneficiaries List */}
              <div className="space-y-2">
                {patientProfile.savedBeneficiaries.map((ben) => (
                  <div
                    key={ben.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                        {ben.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {ben.name}{' '}
                          <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">
                            {ben.relation}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {ben.age} Yrs · {ben.gender}
                        </div>
                      </div>
                    </div>

                    {ben.relation !== 'Self' && (
                      <button
                        onClick={() => handleRemoveBeneficiary(ben.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Member */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-brand-teal" /> Add New Family Member
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newBenName}
                    onChange={(e) => setNewBenName(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <select
                    value={newBenRelation}
                    onChange={(e) => setNewBenRelation(e.target.value as any)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Age"
                    min={1}
                    max={120}
                    value={newBenAge}
                    onChange={(e) => setNewBenAge(parseInt(e.target.value) || 0)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <select
                    value={newBenGender}
                    onChange={(e) => setNewBenGender(e.target.value as any)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddBeneficiary}
                  className="w-full py-2 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl transition"
                >
                  Save Family Member
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
