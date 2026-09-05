import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  Building2,
  User,
  Sparkles,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { CartItem, Booking, PatientProfile, TeamNotification } from '../types';
import { PROMO_COUPONS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface HomeCollectionBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  selectedCity: string;
  patientProfile: PatientProfile;
  onBookingSuccess: (booking: Booking, notification: TeamNotification) => void;
}

export const HomeCollectionBookingModal: React.FC<HomeCollectionBookingModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  selectedCity,
  patientProfile,
  onBookingSuccess,
}) => {
  const [slotDate, setSlotDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [slotTime, setSlotTime] = useState<string>('06:00 AM - 07:00 AM (Early Fasting)');

  // Patient Address & Details (Auto-filled from patientProfile or editable)
  const [name, setName] = useState<string>(patientProfile.fullName || '');
  const [phone, setPhone] = useState<string>(patientProfile.phone || '');
  const [email, setEmail] = useState<string>(patientProfile.email || '');
  const [address, setAddress] = useState<string>(patientProfile.address || '');
  const [pincode, setPincode] = useState<string>(patientProfile.pincode || '');
  const [landmark, setLandmark] = useState<string>('Near Main Road');

  // Coupon state
  const [couponInput, setCouponInput] = useState<string>('NORTH20');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(PROMO_COUPONS[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const collectionFee = subtotal >= 800 ? 0 : 150;
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount) {
      discount = appliedCoupon.flatDiscount;
    }
  }
  const totalAmount = Math.max(0, subtotal - discount + collectionFee);

  const timeSlots = [
    '06:00 AM - 07:00 AM (Early Fasting)',
    '07:00 AM - 08:00 AM (Fasting)',
    '08:00 AM - 09:00 AM (Fasting)',
    '09:00 AM - 10:00 AM (Fasting)',
    '10:00 AM - 11:00 AM (Standard)',
    '04:00 PM - 05:00 PM (Non-Fasting)',
    '05:00 PM - 06:00 PM (Non-Fasting)',
  ];

  const handleApplyCoupon = () => {
    const found = PROMO_COUPONS.find(
      (c) => c.code.toUpperCase() === couponInput.trim().toUpperCase()
    );
    if (found) {
      if (subtotal >= found.minOrder) {
        setAppliedCoupon(found);
      } else {
        alert(`Coupon ${found.code} requires a minimum order of ₹${found.minOrder}`);
      }
    } else {
      alert('Invalid Promo Code. Try "NORTH20" or "HEALTHFIRST"');
    }
  };

  const handleConfirmDirectRegistration = () => {
    if (!name.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      alert('Please fill in your Full Name, Mobile Number, and complete Doorstep Address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const bookingNumber = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
      const primaryLab = cartItems[0]?.selectedLabOffering?.labName || 'Agilus Diagnostics';
      const testNames = cartItems.map((ci) => ci.item.name);

      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        bookingNumber,
        createdAt: new Date().toLocaleString(),
        status: 'REQUEST_RECEIVED', // Sent to our operations team to register with lab
        bookingType: 'HOME_COLLECTION',
        selectedLabName: primaryLab,
        selectedLabBrandId: cartItems[0]?.selectedLabOffering?.labId || 'lab-agilus',
        patientDetails: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          age: patientProfile.age || 42,
          gender: patientProfile.gender || 'Male',
          address: address.trim(),
          city: selectedCity,
          state: 'Delhi NCR',
          pincode: pincode.trim(),
          landmark: landmark.trim(),
        },
        beneficiaries: patientProfile.savedBeneficiaries.length > 0 ? patientProfile.savedBeneficiaries : [
          { id: `ben-self`, name: name.trim(), age: 42, gender: 'Male', relation: 'Self', phoneNumber: phone.trim() }
        ],
        items: cartItems.map((ci) => ({
          title: ci.item.name,
          type: ci.type,
          price: ci.selectedLabOffering?.discountPrice || ci.item.discountPrice,
          labName: ci.selectedLabOffering?.labName || primaryLab,
          forBeneficiaryName: name.trim(),
        })),
        slotDate,
        slotTime,
        subtotal,
        discount,
        collectionFee,
        totalAmount,
        paymentMode: 'PAY_DIRECTLY_TO_LAB',
        paymentStatus: 'PAY_ON_COLLECTION_TO_LAB',
        teamNotes: 'Direct Test Registration requested. Pending official LIMS lab token assignment by team.',
      };

      const notification: TeamNotification = {
        id: `notif-${Date.now()}`,
        bookingNumber,
        patientName: name.trim(),
        patientPhone: phone.trim(),
        selectedLab: primaryLab,
        testNames,
        totalAmount,
        slotTime: `${slotDate} (${slotTime.split(' ')[0]})`,
        city: selectedCity,
        timestamp: 'Just now',
        isRead: false,
      };

      setConfirmedBooking(newBooking);
      onBookingSuccess(newBooking, notification);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-brand-navy to-brand-800 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-teal bg-teal-950/70 px-2 py-0.5 rounded border border-teal-800/70">
                Direct Medical Test Registration
              </span>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                ₹0 Advance Fee
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-1">
              {confirmedBooking ? 'Test Request Submitted!' : 'Register Tests for Home Collection'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {confirmedBooking ? (
            /* Confirmation Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                  <Bell className="w-3.5 h-3.5 text-emerald-600" /> Operations Team Notified for Lab Registration
                </span>
                <h3 className="text-xl font-black text-brand-navy mt-1">
                  Test Request Registered Successfully!
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Request Ref ID:{' '}
                  <span className="font-mono font-bold text-brand-600">
                    {confirmedBooking.bookingNumber}
                  </span>
                </p>
              </div>

              {/* Direct to Lab Notice */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-left space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Direct Payment to Laboratory on Sample Collection:</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  You do not need to pay anything on this website. Our team is registering your test with <strong>{confirmedBooking.selectedLabName}</strong>. You will pay the amount of <strong className="text-slate-900">₹{confirmedBooking.totalAmount}</strong> directly to the visiting certified phlebotomist via <strong>UPI / GPay / Cash</strong>.
                </p>
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Chosen Lab:</span>
                  <strong className="text-brand-navy">{confirmedBooking.selectedLabName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scheduled Fasting Slot:</span>
                  <strong className="text-slate-800">
                    {confirmedBooking.slotDate} at {confirmedBooking.slotTime}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Patient:</span>
                  <strong className="text-slate-800">
                    {confirmedBooking.patientDetails.name} ({confirmedBooking.patientDetails.phone})
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Doorstep Address:</span>
                  <span className="text-slate-700 truncate max-w-[260px]">
                    {confirmedBooking.patientDetails.address}, {confirmedBooking.patientDetails.pincode}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-brand-navy text-white text-xs font-bold rounded-xl hover:bg-brand-darkBlue transition"
              >
                Done
              </button>
            </div>
          ) : (
            /* Direct Registration Form */
            <div className="space-y-4">
              {/* Direct payment guarantee banner */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-3.5 rounded-2xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-950">
                    Direct Payment to Lab · ₹0 Platform Advance Fee
                  </h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Our team registers your test directly with the selected laboratory network. You pay only upon sample collection directly to the certified phlebotomist.
                  </p>
                </div>
              </div>

              {/* Selected Tests & Labs Summary */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Tests to Register ({cartItems.length}):
                </span>
                <div className="space-y-1.5">
                  {cartItems.map((ci) => (
                    <div
                      key={ci.id}
                      className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-100"
                    >
                      <div>
                        <strong className="text-slate-800 block">{ci.item.name}</strong>
                        <span className="text-[10px] text-brand-teal font-semibold">
                          Lab: {ci.selectedLabOffering?.labName || 'Agilus Diagnostics'}
                        </span>
                      </div>
                      <span className="font-bold text-brand-navy">
                        ₹{ci.selectedLabOffering?.discountPrice || ci.item.discountPrice}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slot Date & Early Morning Fasting Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Fasting Date &amp; 6:00 AM Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                    className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono"
                  />
                  <select
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                  >
                    {timeSlots.map((ts) => (
                      <option key={ts} value={ts}>
                        {ts}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Patient Contact & Address Details */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Patient Contact &amp; Doorstep Address
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Patient Full Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Mobile Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="House / Flat No., Landmark *"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="col-span-2 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Pincode *"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
              </div>

              {/* Coupon Bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Coupon (e.g. NORTH20)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl uppercase font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition"
                >
                  Apply
                </button>
              </div>

              {/* Direct Lab Billing Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Lab Test Charges:</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Direct Lab Discount ({appliedCoupon?.code}):</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Home Phlebotomist Fee:</span>
                  <span>{collectionFee === 0 ? 'FREE' : `₹${collectionFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-brand-navy pt-2 border-t border-slate-200">
                  <span>Amount to Pay to Lab on Collection:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              {/* Direct Registration Submit CTA */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmDirectRegistration}
                className="w-full py-3.5 bg-gradient-to-r from-brand-coral to-amber-500 hover:from-brand-coral hover:to-amber-600 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Bell className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Alerting Team & Registering with Lab...'
                    : `Direct Register Tests · Pay ₹${totalAmount} to Lab on Collection`}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
