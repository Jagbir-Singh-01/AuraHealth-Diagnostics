import React, { useState } from 'react';
import {
  Upload,
  X,
  FileText,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  Camera,
} from 'lucide-react';
import { NORTH_INDIA_CITIES } from '../data/mockData';

interface QuickPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
}

export const QuickPrescriptionModal: React.FC<QuickPrescriptionModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
}) => {
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(selectedCity);
  const [remarks, setRemarks] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rxRefId, setRxRefId] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone) {
      alert('Please provide your name and mobile number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      const generatedId = `RX-DEL-${Math.floor(10000 + Math.random() * 90000)}`;
      setRxRefId(generatedId);
    }, 1200);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setUploadedFile(null);
    setPatientName('');
    setPhone('');
    setRemarks('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-brand-50 via-white to-brand-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-md">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-navy">Upload Doctor's Prescription</h2>
              <p className="text-xs text-slate-500">Quick 2-minute booking with doctor test mapping</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-brand-navy">Prescription Received!</h3>
                <p className="text-xs text-slate-500">
                  Reference Token: <span className="font-mono font-bold text-brand-600">{rxRefId}</span>
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-700 space-y-2 max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Call back promised within 10 minutes</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Our senior medical officer is reviewing your prescription for <span className="font-semibold text-slate-800">{patientName}</span>. We will call you on <span className="font-semibold text-slate-800">+91 {phone}</span> to confirm your test list and home collection slot.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-brand-navy text-white text-xs font-bold rounded-xl shadow-md hover:bg-brand-darkBlue transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload Zone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-brand-50/20 transition cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="space-y-2 pointer-events-none">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 text-brand-600 flex items-center justify-center mx-auto">
                    {uploadedFile ? <FileText className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                  </div>
                  {uploadedFile ? (
                    <div>
                      <div className="text-xs font-bold text-slate-800 truncate max-w-xs mx-auto">
                        {uploadedFile.name}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        Ready to upload ({(uploadedFile.size / 1024).toFixed(1)} KB)
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        Take a photo or upload prescription
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Supports JPG, PNG, PDF up to 15MB
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Patient Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Mobile Number (For Callback &amp; WhatsApp Reports) *
                </label>
                <div className="relative">
                  <span className="text-xs font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    className="w-full pl-12 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  City in North India *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {NORTH_INDIA_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Remarks / Symptoms */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Doctor Name or Any Specific Tests (Optional)
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Dr. Verma prescribed fasting sugar and lipid profile..."
                  className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Medical Privacy guaranteed. NABL &amp; CAP protocol compliant.</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-brand-navy to-brand-darkBlue hover:from-brand-darkBlue hover:to-brand-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Prescription...</span>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Submit &amp; Request Callback</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
