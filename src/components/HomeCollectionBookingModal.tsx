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
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { CartItem, Booking, Beneficiary, PatientProfile } from '../types';
import { PROMO_COUPONS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface HomeCollectionBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  selectedCity: string;
  patientProfile: PatientProfile;
  onBookingSuccess: (booking: Booking) => void;
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
  const [step, setStep] = useState<number>(1);
  const [slotDate, setSlotDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [slotTime, setSlotTime] = useState<string>('06:00 AM - 07:00 AM (Early Fasting)');
  const [paymentMode, setPaymentMode] = useState<'CASH_ON_COLLECTION' | 'ONLINE_UPI_CARD'>('ONLINE_UPI_CARD');

  // Patient Address & Details (Auto-filled from patientProfile)
  const [name, setName] = useState<string>(patientProfile.fullName);
  const [phone, setPhone] = useState<string>(patientProfile.phone);
  const [email, setEmail] = useState<string>(patientProfile.email);
  const [address, setAddress] = useState<string>(patientProfile.address);
  const [pincode, setPincode] = useState<string>(patientProfile.pincode);
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

  const handleConfirmOrder = () => {
    if (!name || !phone || !address || !pincode) {
      alert('Please fill in complete address and contact details.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const bookingNumber = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
      const primaryLab = cartItems[0]?.selectedLabOffering?.labName || 'Agilus Diagnostics';

      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        bookingNumber,
        createdAt: new Date().toLocaleString(),
        status: 'PHLEBOTOMIST_ASSIGNED',
        bookingType: 'HOME_COLLECTION',
        selectedLabName: primaryLab,
        patientDetails: {
          name,
          phone,
          email,
          age: patientProfile.age || 45,
          gender: patientProfile.gender || 'Male',
          address,
          city: selectedCity,
          state: 'Delhi NCR',
          pincode,
          landmark,
        },
        beneficiaries: patientProfile.savedBeneficiaries,
        items: cartItems.map((ci) => ({
          title: ci.item.name,
          type: ci.type,
          price: ci.selectedLabOffering?.discountPrice || ci.item.discountPrice,
          labName: ci.selectedLabOffering?.labName || 'Certified Lab',
          forBeneficiaryName: name,
        })),
        slotDate,
        slotTime,
        subtotal,
        discount,
        collectionFee,
        totalAmount,
        paymentMode,
        paymentStatus: paymentMode === 'ONLINE_UPI_CARD' ? 'PAID' : 'PENDING',
        phlebotomist: {
          name: 'Vikas Sharma',
          phone: '+91 98112 88990',
          badgeNumber: `PHLEB-${primaryLab.substring(0, 3).toUpperCase()}-108`,
          vaccinationStatus: 'Fully Vaccinated & Verified',
          liveLocationStatus: 'Assigned for morning collection slot',
        },
      };

      setConfirmedBooking(newBooking);
      onBookingSuccess(newBooking);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-brand-navy to-brand-800 text-white">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-teal bg-teal-950/70 px-2 py-0.5 rounded border border-teal-800/70">
              Multi-Lab Doorstep Phlebotomy Checkout
            </span>
            <h2 className="text-lg font-black text-white mt-0.5">
              {confirmedBooking ? 'Booking Confirmed!' : 'Schedule Home Sample Collection'}
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
            /* Success confirmation */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-brand-navy">Sample Collection Booked!</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Booking Number:{' '}
                  <span className="font-mono font-bold text-brand-600">
                    {confirmedBooking.bookingNumber}
                  </span>
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Diagnostic Laboratory:</span>
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
                  <span className="text-slate-400">Assigned Phlebotomist:</span>
                  <strong className="text-emerald-700">
                    {confirmedBooking.phlebotomist?.name} ({confirmedBooking.phlebotomist?.badgeNumber})
                  </strong>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-brand-navy text-white text-xs font-bold rounded-xl hover:bg-brand-darkBlue transition"
              >
                Close &amp; Track in Operations Console
              </button>
            </div>
          ) : (
            /* Multi-step checkout form */
            <div className="space-y-4">
              {/* Selected Tests & Labs Summary */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Tests &amp; Selected Labs ({cartItems.length}):
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

              {/* Step 1: Slot Date & Early Morning Fasting Picker */}
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

              {/* Step 2: Patient Details */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Patient Contact &amp; Doorstep Address
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Patient Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Address / Flat / Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="col-span-2 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Pincode"
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

              {/* Payment Mode & Price Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount ({appliedCoupon?.code}):</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Home Phlebotomist Fee:</span>
                  <span>{collectionFee === 0 ? 'FREE' : `₹${collectionFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-brand-navy pt-2 border-t border-slate-200">
                  <span>Total Payable:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              {/* Payment Selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode('ONLINE_UPI_CARD')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2 ${
                    paymentMode === 'ONLINE_UPI_CARD'
                      ? 'border-brand-500 bg-brand-50 text-brand-navy font-bold ring-1 ring-brand-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-brand-teal" />
                  <div>
                    <div className="text-xs">Instant Online UPI / Card</div>
                    <div className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('CASH_ON_COLLECTION')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2 ${
                    paymentMode === 'CASH_ON_COLLECTION'
                      ? 'border-brand-500 bg-brand-50 text-brand-navy font-bold ring-1 ring-brand-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-brand-coral" />
                  <div>
                    <div className="text-xs">Cash on Collection</div>
                    <div className="text-[10px] text-slate-400">Pay Phlebotomist</div>
                  </div>
                </button>
              </div>

              {/* Submit */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmOrder}
                className="w-full py-3.5 bg-gradient-to-r from-brand-coral to-amber-500 hover:from-brand-coral hover:to-amber-600 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Confirming with Lab Dispatch...' : `Confirm Booking · ₹${totalAmount}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
