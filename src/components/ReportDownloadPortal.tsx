import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  CheckCircle2,
  ShieldCheck,
  Printer,
  QrCode,
  AlertTriangle,
  Lock,
  ArrowRight,
  Sparkles,
  ChevronDown,
  User,
  Calendar,
} from 'lucide-react';
import { SAMPLE_REPORTS } from '../data/mockData';
import { DiagnosticReport } from '../types';

export const ReportDownloadPortal: React.FC = () => {
  const [searchPhone, setSearchPhone] = useState('9876543210');
  const [bookingIdInput, setBookingIdInput] = useState('BK-992144');
  const [otp, setOtp] = useState('1234');
  const [isOtpSent, setIsOtpSent] = useState(true);
  const [activeReport, setActiveReport] = useState<DiagnosticReport | null>(SAMPLE_REPORTS[0]);
  const [loading, setLoading] = useState(false);

  const handleFetchReport = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const found =
        SAMPLE_REPORTS.find(
          (r) =>
            r.bookingNumber.toLowerCase() === bookingIdInput.toLowerCase() ||
            r.patientPhone.includes(searchPhone)
        ) || SAMPLE_REPORTS[0];

      setActiveReport(found);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <FileText className="w-3.5 h-3.5" /> Patient Medical Records
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
          Download Certified Diagnostic Reports
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Access authenticated, doctor-signed pathology test results with QR code verification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Lookup Form */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-navy border-b border-slate-100 pb-3">
            <Lock className="w-4 h-4 text-brand-500" />
            <span>Secure Patient OTP Lookup</span>
          </div>

          <form onSubmit={handleFetchReport} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Registered Mobile Number
              </label>
              <div className="relative">
                <span className="text-xs font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full pl-12 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Booking ID / Lab Order No.
              </label>
              <input
                type="text"
                required
                value={bookingIdInput}
                onChange={(e) => setBookingIdInput(e.target.value)}
                placeholder="e.g. BK-992144"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>

            {isOtpSent && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Enter 4-digit SMS OTP (Demo: 1234)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1234"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-center tracking-widest font-bold"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Retrieving Record...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Access Clinical Report</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Note */}
          <div className="bg-brand-50/60 p-3 rounded-xl border border-brand-100 text-[11px] text-brand-900 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-500" /> Demo Patient Available:
            </div>
            <div>
              Preloaded with <strong>Rajesh Sharma</strong> (Booking: <code>BK-992144</code>) Complete Hemogram, HbA1c, Lipid, and Winter Smog IgE panel.
            </div>
          </div>
        </div>

        {/* Right Column: Authentic Clinical Diagnostic Report Viewer */}
        <div className="lg:col-span-8 space-y-4">
          {activeReport ? (
            <div className="space-y-4">
              {/* Action Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-navy">
                    Report ID: {activeReport.reportNumber}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Verified &amp; Signed
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-4 py-1.5 bg-brand-navy hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Official Clinical Report Sheet (Printable) */}
              <div
                id="clinical-report-sheet"
                className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-slate-800"
              >
                {/* Lab Letterhead Header */}
                <div className="border-b-2 border-brand-navy pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-brand-navy">AuraHealth</span>
                      <span className="text-xs font-bold text-brand-teal uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Diagnostics
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-700">
                      Central Reference &amp; Research Laboratory
                    </div>
                    <div className="text-[10px] text-slate-500">
                      NABL Accreditation No: {activeReport.nablRegNumber}
                    </div>
                  </div>

                  <div className="text-right sm:text-right space-y-1">
                    <div className="font-mono text-xs text-slate-400 tracking-widest">
                      {activeReport.barcode}
                    </div>
                    <div className="text-[11px] font-bold text-brand-navy">
                      {activeReport.reportNumber}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                      <ShieldCheck className="w-3 h-3" /> CAP &amp; ISO 15189:2022 Certified
                    </div>
                  </div>
                </div>

                {/* Patient Demographics Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Patient Name:</span>
                    <strong className="text-brand-navy text-xs">{activeReport.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Age / Gender:</span>
                    <strong className="text-slate-800">
                      {activeReport.patientAge} Yrs / {activeReport.patientGender}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sample Collected:</span>
                    <span className="text-[11px] text-slate-700 font-medium">
                      {activeReport.sampleCollectedAt}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Ref. Doctor:</span>
                    <span className="text-[11px] text-slate-700 font-medium truncate block">
                      {activeReport.referringDoctor}
                    </span>
                  </div>
                </div>

                {/* Test Results Groups */}
                <div className="space-y-6">
                  {activeReport.groups.map((grp, gIdx) => (
                    <div key={gIdx} className="space-y-2">
                      <div className="bg-brand-navy text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                        {grp.groupName}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                              <th className="py-2 px-3">Test / Biomarker</th>
                              <th className="py-2 px-3">Observed Value</th>
                              <th className="py-2 px-3">Biological Reference</th>
                              <th className="py-2 px-3">Unit</th>
                              <th className="py-2 px-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {grp.parameters.map((param, pIdx) => (
                              <tr
                                key={pIdx}
                                className={param.status !== 'NORMAL' ? 'bg-amber-50/40' : ''}
                              >
                                <td className="py-2.5 px-3 font-medium text-slate-800">
                                  {param.name}
                                </td>
                                <td className="py-2.5 px-3 font-bold text-slate-900">
                                  {param.resultValue}
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                                  {param.referenceRange}
                                </td>
                                <td className="py-2.5 px-3 text-slate-500">{param.unit}</td>
                                <td className="py-2.5 px-3">
                                  {param.status === 'NORMAL' ? (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                      NORMAL
                                    </span>
                                  ) : param.status === 'HIGH' ? (
                                    <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                                      HIGH ▲
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                                      LOW ▼
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pathologist Clinical Interpretation & Doctor Remarks */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Pathologist Clinical Impression &amp; Remarks:
                  </div>
                  <p className="text-slate-600 leading-relaxed italic">
                    "{activeReport.doctorRemarks}"
                  </p>
                </div>

                {/* Footer Signatures */}
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-end justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-xl p-1.5 flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-slate-800" />
                    </div>
                    <div className="text-[10px] text-slate-500 space-y-0.5">
                      <div className="font-bold text-slate-700">Scan to Verify Authenticity</div>
                      <div>{activeReport.qrVerificationUrl}</div>
                      <div>End of Clinical Report</div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-serif italic font-bold text-slate-800 text-sm">
                      {activeReport.pathologist.signatureText}
                    </div>
                    <div className="font-bold text-xs text-brand-navy">
                      {activeReport.pathologist.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {activeReport.pathologist.degrees}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {activeReport.pathologist.designation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">No Report Loaded</p>
              <p className="text-xs text-slate-400 mt-1">
                Enter your mobile number and booking ID on the left to view and download your report.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
