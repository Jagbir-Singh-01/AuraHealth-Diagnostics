import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  Tag,
  CreditCard,
  Banknote,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { CartItem, Beneficiary, Booking } from '../types';
import { PROMO_COUPONS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface HomeCollectionBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  selectedCity: string;
  onBookingSuccess: (newBooking: Booking) => void;
}

export const HomeCollectionBookingModal: React.FC<HomeCollectionBookingModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  selectedCity,
  onBookingSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Beneficiaries State
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    { id: 'b-1', name: '', age: 35, gender: 'Male', relation: 'Self', phoneNumber: '' },
  ]);

  // Address State
  const [patientAddress, setPatientAddress] = useState({
    street: '',
    pincode: '',
    city: selectedCity,
    landmark: '',
    phone: '',
    email: '',
  });

  // Slot State
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<string>('06:30 AM - 07:30 AM (Fasting)');

  // Coupon & Payment
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<'CASH_ON_COLLECTION' | 'ONLINE_UPI_CARD'>(
    'ONLINE_UPI_CARD'
  );

  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const collectionFee = subtotal >= 800 ? 0 : 150;
  const finalTotal = Math.max(0, subtotal - appliedDiscount + collectionFee);

  const handleAddBeneficiary = () => {
    setBeneficiaries([
      ...beneficiaries,
      {
        id: `b-${Date.now()}`,
        name: '',
        age: 30,
        gender: 'Female',
        relation: 'Spouse',
      },
    ]);
  };

  const handleRemoveBeneficiary = (id: string) => {
    if (beneficiaries.length === 1) return;
    setBeneficiaries(beneficiaries.filter((b) => b.id !== id));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const found = PROMO_COUPONS.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase()
    );

    if (!found) {
      setCouponError('Invalid coupon code.');
      setAppliedDiscount(0);
      return;
    }

    if (subtotal < found.minOrder) {
      setCouponError(`Minimum order value of ₹${found.minOrder} required for ${found.code}.`);
      setAppliedDiscount(0);
      return;
    }

    let disc = 0;
    if (found.discountPercent) {
      disc = Math.round((subtotal * found.discountPercent) / 100);
    } else if (found.flatDiscount) {
      disc = found.flatDiscount;
    }
    setAppliedDiscount(disc);
  };

  const handleCompleteOrder = () => {
    const bookingNo = `BK-99${Math.floor(1000 + Math.random() * 9000)}`;
    const primaryBeneficiary = beneficiaries[0];

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingNumber: bookingNo,
      createdAt: new Date().toLocaleString(),
      status: 'CONFIRMED',
      bookingType: 'HOME_COLLECTION',
      patientDetails: {
        name: primaryBeneficiary.name || 'Patient',
        phone: patientAddress.phone || primaryBeneficiary.phoneNumber || '9876543210',
        email: patientAddress.email,
        age: primaryBeneficiary.age,
        gender: primaryBeneficiary.gender,
        address: patientAddress.street,
        city: patientAddress.city,
        state: 'North India Hub',
        pincode: patientAddress.pincode || '110016',
        landmark: patientAddress.landmark,
      },
      beneficiaries,
      items: cartItems.map((ci) => ({
        title: ci.item.name,
        type: ci.type,
        price: ci.item.discountPrice,
        forBeneficiaryName: primaryBeneficiary.name || 'Self',
      })),
      slotDate: selectedDate,
      slotTime: selectedSlot,
      subtotal,
      discount: appliedDiscount,
      collectionFee,
      totalAmount: finalTotal,
      paymentMode,
      paymentStatus: paymentMode === 'ONLINE_UPI_CARD' ? 'PAID' : 'PENDING',
      phlebotomist: {
        name: 'Vikas Sharma (Certified Phlebotomist)',
        phone: '+91 98101 22399',
        badgeNumber: 'PHLEB-NORTH-204',
        vaccinationStatus: '100% Vaccinated & Background Verified',
        liveLocationStatus: 'Assigned for morning collection slot',
      },
    };

    setConfirmedBooking(newBooking);
    onBookingSuccess(newBooking);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {}
  };

  const timeSlots = [
    { time: '06:00 AM - 07:00 AM (Fasting)', isFast: true, badge: 'Earliest' },
    { time: '06:30 AM - 07:30 AM (Fasting)', isFast: true, badge: 'Popular' },
    { time: '07:30 AM - 08:30 AM (Fasting)', isFast: true, badge: 'Popular' },
    { time: '08:30 AM - 09:30 AM (Fasting)', isFast: true, badge: 'Fasting' },
    { time: '09:30 AM - 10:30 AM (Fasting)', isFast: true, badge: 'Fasting' },
    { time: '11:00 AM - 12:30 PM (Non-Fasting)', isFast: false, badge: 'Routine' },
    { time: '04:00 PM - 06:00 PM (Evening)', isFast: false, badge: 'Evening' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-brand-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-navy text-white flex items-center justify-center shadow-sm">
              <Truck className="w-5 h-5 text-brand-teal" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-navy">
                {confirmedBooking ? 'Booking Confirmed!' : 'Book Doorstep Home Sample Collection'}
              </h2>
              <p className="text-xs text-slate-500">
                {confirmedBooking
                  ? 'Sample collection team assigned'
                  : `Step ${step} of 3: ${
                      step === 1
                        ? 'Patient Details'
                        : step === 2
                        ? 'Address & Early Morning Slot'
                        : 'Review & Payment'
                    }`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {confirmedBooking ? (
            /* Order Success State */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-pulse-gentle">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-brand-navy">Booking Placed Successfully!</h3>
                <p className="text-xs text-slate-500">
                  Booking Reference Number:{' '}
                  <span className="font-mono font-bold text-brand-600 text-sm">
                    {confirmedBooking.bookingNumber}
                  </span>
                </p>
              </div>

              {/* Phlebotomist Live Card */}
              <div className="bg-gradient-to-r from-brand-50 to-teal-50/50 rounded-2xl p-4 border border-brand-200 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-teal bg-white px-2 py-0.5 rounded border border-brand-200">
                    Phlebotomist Assigned
                  </span>
                  <span className="text-xs font-bold text-emerald-700">● Live Status: Active</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center text-xs">
                    VS
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {confirmedBooking.phlebotomist?.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Badge: {confirmedBooking.phlebotomist?.badgeNumber} | 📞{' '}
                      {confirmedBooking.phlebotomist?.phone}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-xl border border-slate-200 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  <span>
                    Scheduled for <strong className="text-slate-900">{confirmedBooking.slotDate}</strong> at{' '}
                    <strong className="text-slate-900">{confirmedBooking.slotTime}</strong>
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 space-y-1.5 text-left border border-slate-200">
                <div className="font-bold text-slate-800">Fasting Preparation Reminders:</div>
                <div className="text-[11px] text-slate-500">
                  • Please maintain 10-12 hours overnight fasting (water intake is permitted).
                </div>
                <div className="text-[11px] text-slate-500">
                  • Phlebotomist will arrive with sterilized single-use vacutainer needles and cold-chain sample bag.
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                Go to Dashboard / View Status
              </button>
            </div>
          ) : (
            /* Multi-step Flow */
            <div className="space-y-6">
              {/* Step 1: Beneficiaries */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Patient Beneficiaries for Samples
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddBeneficiary}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Family Member
                    </button>
                  </div>

                  <div className="space-y-3">
                    {beneficiaries.map((b, index) => (
                      <div
                        key={b.id}
                        className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-navy">
                            Person #{index + 1} ({b.relation})
                          </span>
                          {beneficiaries.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveBeneficiary(b.id)}
                              className="text-slate-400 hover:text-red-500 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <input
                            type="text"
                            required
                            placeholder="Full Name *"
                            value={b.name}
                            onChange={(e) => {
                              const updated = [...beneficiaries];
                              updated[index].name = e.target.value;
                              setBeneficiaries(updated);
                            }}
                            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />

                          <input
                            type="number"
                            placeholder="Age (Years) *"
                            min={1}
                            max={120}
                            value={b.age}
                            onChange={(e) => {
                              const updated = [...beneficiaries];
                              updated[index].age = parseInt(e.target.value) || 0;
                              setBeneficiaries(updated);
                            }}
                            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />

                          <select
                            value={b.gender}
                            onChange={(e) => {
                              const updated = [...beneficiaries];
                              updated[index].gender = e.target.value as any;
                              setBeneficiaries(updated);
                            }}
                            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Primary Phone */}
                  <div className="pt-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Primary Contact Number (For OTP &amp; WhatsApp Reports) *
                    </label>
                    <div className="relative">
                      <span className="text-xs font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={patientAddress.phone}
                        onChange={(e) =>
                          setPatientAddress({
                            ...patientAddress,
                            phone: e.target.value.replace(/\D/g, ''),
                          })
                        }
                        placeholder="10-digit mobile number"
                        className="w-full pl-12 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Address & Slots */}
              {step === 2 && (
                <div className="space-y-5">
                  {/* Address inputs */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Home Sample Collection Address
                    </h3>
                    <input
                      type="text"
                      required
                      placeholder="House/Flat No., Building Name, Street Address *"
                      value={patientAddress.street}
                      onChange={(e) =>
                        setPatientAddress({ ...patientAddress, street: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="6-digit Pincode *"
                        value={patientAddress.pincode}
                        onChange={(e) =>
                          setPatientAddress({
                            ...patientAddress,
                            pincode: e.target.value.replace(/\D/g, ''),
                          })
                        }
                        className="px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                      />

                      <input
                        type="text"
                        placeholder="Landmark (Optional)"
                        value={patientAddress.landmark}
                        onChange={(e) =>
                          setPatientAddress({ ...patientAddress, landmark: e.target.value })
                        }
                        className="px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  {/* Slot Date & Time */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Select Preferred Date &amp; Morning Fasting Slot</span>
                      <span className="text-brand-teal text-[11px] lowercase">6 AM early slots available</span>
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Collection Date
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`p-2.5 rounded-xl text-left text-xs border transition flex items-center justify-between ${
                            selectedSlot === slot.time
                              ? 'border-brand-500 bg-brand-50 text-brand-900 font-bold ring-1 ring-brand-500'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="truncate">{slot.time}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${
                              slot.badge === 'Earliest'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {slot.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Payment */}
              {step === 3 && (
                <div className="space-y-5">
                  {/* Order Items Summary */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Selected Test Items ({cartItems.length})
                    </h3>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      {cartItems.map((ci) => (
                        <div
                          key={ci.id}
                          className="flex items-center justify-between text-xs text-slate-700"
                        >
                          <span className="truncate pr-2 font-medium">{ci.item.name}</span>
                          <span className="font-bold text-brand-navy shrink-0">
                            ₹{ci.item.discountPrice}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Promo Coupon Form */}
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-brand-teal" /> Have a Promo Code? (Try NORTH20)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter NORTH20 or HEALTHFIRST"
                        className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl uppercase font-mono font-bold"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Coupon Applied! You saved ₹{appliedDiscount}
                      </div>
                    )}
                    {couponError && <div className="text-xs text-red-500">{couponError}</div>}
                  </form>

                  {/* Payment Mode Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Choose Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMode('ONLINE_UPI_CARD')}
                        className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                          paymentMode === 'ONLINE_UPI_CARD'
                            ? 'border-brand-500 bg-brand-50 text-brand-navy font-bold ring-1 ring-brand-500'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-brand-600" />
                        <div>
                          <div className="text-xs">UPI / GPay / Cards</div>
                          <div className="text-[10px] text-slate-400">Instant Confirmation</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMode('CASH_ON_COLLECTION')}
                        className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                          paymentMode === 'CASH_ON_COLLECTION'
                            ? 'border-brand-500 bg-brand-50 text-brand-navy font-bold ring-1 ring-brand-500'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="text-xs">Pay on Collection</div>
                          <div className="text-[10px] text-slate-400">Cash / QR at Home</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Tests Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Coupon Discount</span>
                        <span>-₹{appliedDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Home Sample Collection Fee</span>
                      <span>{collectionFee === 0 ? 'FREE' : `₹${collectionFee}`}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-brand-navy">
                      <span>Total Amount Payable</span>
                      <span>₹{finalTotal}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {!confirmedBooking && (
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && (!beneficiaries[0].name || !patientAddress.phone)) {
                    alert('Please enter patient name and mobile number.');
                    return;
                  }
                  if (step === 2 && (!patientAddress.street || !patientAddress.pincode)) {
                    alert('Please enter delivery address and pincode.');
                    return;
                  }
                  setStep((step + 1) as any);
                }}
                className="px-6 py-2.5 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteOrder}
                className="px-6 py-2.5 bg-gradient-to-r from-brand-coral to-amber-500 hover:from-brand-coral hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Book Home Visit (₹{finalTotal})</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
