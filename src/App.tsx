import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WinterSmogBanner } from './components/WinterSmogBanner';
import { PackageGrid } from './components/PackageGrid';
import { TestCatalog } from './components/TestCatalog';
import { MultiLabExplorer } from './components/MultiLabExplorer';
import { LabLocator } from './components/LabLocator';
import { ReportDownloadPortal } from './components/ReportDownloadPortal';
import { HealthTracker } from './components/HealthTracker';
import { AdminDashboard } from './components/AdminDashboard';
import { DoctorConsultation } from './components/DoctorConsultation';
import { HealthBlogSection } from './components/HealthBlogSection';
import { Footer } from './components/Footer';
import { CitySelectorModal } from './components/CitySelectorModal';
import { QuickPrescriptionModal } from './components/QuickPrescriptionModal';
import { PatientRegistrationModal } from './components/PatientRegistrationModal';
import { LabComparisonModal } from './components/LabComparisonModal';
import { CartDrawer } from './components/CartDrawer';
import { HomeCollectionBookingModal } from './components/HomeCollectionBookingModal';
import { CartItem, HealthPackage, TestItem, Booking, PatientProfile, LabTestOffering, TeamNotification } from './types';
import { INITIAL_BOOKINGS, HEALTH_PACKAGES, INITIAL_EMPTY_PATIENT_PROFILE, POPULAR_TESTS } from './data/mockData';
import { Check, Bell } from 'lucide-react';

export function App() {
  const [selectedCity, setSelectedCity] = useState<string>('Gurugram (Gurgaon)');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [notifications, setNotifications] = useState<TeamNotification[]>([]);
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(INITIAL_EMPTY_PATIENT_PROFILE);

  // Modals state
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Lab Comparison Modal
  const [comparisonItem, setComparisonItem] = useState<TestItem | HealthPackage | null>(null);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // Selected package/test for detailed modal
  const [selectedPackage, setSelectedPackage] = useState<HealthPackage | null>(null);
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);

  // Toast notification
  const [toast, setToast] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleLogout = () => {
    setPatientProfile(INITIAL_EMPTY_PATIENT_PROFILE);
    showToast('Logged out. You can now register a new patient.');
  };

  const handleOpenTestComparison = (item: TestItem | HealthPackage) => {
    setComparisonItem(item);
    setIsComparisonModalOpen(true);
  };

  const handleSelectLabOffering = (
    item: TestItem | HealthPackage,
    offering: LabTestOffering
  ) => {
    const existingIndex = cartItems.findIndex((ci) => ci.itemId === item.id);
    const type: 'TEST' | 'PACKAGE' = 'category' in item && item.category.includes('Routine') || 'code' in item ? 'TEST' : 'PACKAGE';

    const newCartItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random()}`,
      itemId: item.id,
      type,
      item,
      selectedLabOffering: offering,
      beneficiaryIds: ['self'],
    };

    if (existingIndex > -1) {
      setCartItems((prev) => {
        const copy = [...prev];
        copy[existingIndex] = newCartItem;
        return copy;
      });
      showToast(`Updated "${item.name}" with ${offering.labName}!`);
    } else {
      setCartItems((prev) => [...prev, newCartItem]);
      showToast(`Added "${item.name}" (${offering.labShortName}) to direct test queue!`);
    }

    setIsCartDrawerOpen(true);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.id !== id));
  };

  const handleBookingSuccess = (newBooking: Booking, newNotification: TeamNotification) => {
    setBookings((prev) => [newBooking, ...prev]);
    setNotifications((prev) => [newNotification, ...prev]);
    setCartItems([]);
    showToast(`🔔 Direct test registration sent to operations team for ${newBooking.selectedLabName}!`);
  };

  const handleSearchFocus = () => {
    setActiveTab('home');
    setTimeout(() => {
      searchInputRef.current?.focus();
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }, 100);
  };

  const cartTotal = cartItems.reduce(
    (sum, ci) => sum + (ci.selectedLabOffering?.discountPrice || ci.item.discountPrice),
    0
  );

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        selectedCity={selectedCity}
        onOpenCityModal={() => setIsCityModalOpen(true)}
        onOpenPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
        onOpenCartDrawer={() => setIsCartDrawerOpen(true)}
        onOpenRegistrationModal={() => setIsRegistrationModalOpen(true)}
        patientProfile={patientProfile}
        unreadNotificationsCount={unreadNotificationsCount}
        cartCount={cartItems.length}
        cartTotal={cartTotal}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchFocus={handleSearchFocus}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              selectedCity={selectedCity}
              onOpenCityModal={() => setIsCityModalOpen(true)}
              onOpenPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
              onOpenRegistrationModal={() => setIsRegistrationModalOpen(true)}
              patientProfile={patientProfile}
              onOpenTestComparison={handleOpenTestComparison}
              searchInputRef={searchInputRef}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-8">
              <WinterSmogBanner
                onSelectPackage={(pkg) => handleOpenTestComparison(pkg)}
                onAddToCart={(pkg) => handleOpenTestComparison(pkg)}
              />
            </div>

            <TestCatalog
              onOpenTestComparison={handleOpenTestComparison}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />

            <PackageGrid
              onAddToCart={(pkg) => handleOpenTestComparison(pkg)}
              selectedPackage={selectedPackage}
              setSelectedPackage={setSelectedPackage}
            />

            <HealthTracker />

            <HealthBlogSection />
          </>
        )}

        {activeTab === 'compare-labs' && (
          <MultiLabExplorer
            selectedCity={selectedCity}
            onOpenTestComparison={handleOpenTestComparison}
          />
        )}

        {activeTab === 'tests' && (
          <div className="py-6">
            <TestCatalog
              onOpenTestComparison={handleOpenTestComparison}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="py-6">
            <PackageGrid
              onAddToCart={(pkg) => handleOpenTestComparison(pkg)}
              selectedPackage={selectedPackage}
              setSelectedPackage={setSelectedPackage}
            />
          </div>
        )}

        {activeTab === 'doctors' && <DoctorConsultation selectedCity={selectedCity} />}

        {activeTab === 'smog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
            <WinterSmogBanner
              onSelectPackage={(pkg) => handleOpenTestComparison(pkg)}
              onAddToCart={(pkg) => handleOpenTestComparison(pkg)}
            />
            <PackageGrid
              onAddToCart={(pkg) => handleOpenTestComparison(pkg)}
              selectedPackage={selectedPackage}
              setSelectedPackage={setSelectedPackage}
            />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-8">
            <ReportDownloadPortal />
            <HealthTracker />
          </div>
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            bookings={bookings}
            setBookings={setBookings}
            notifications={notifications}
            setNotifications={setNotifications}
            onNotify={showToast}
          />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <PatientRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        patientProfile={patientProfile}
        setPatientProfile={setPatientProfile}
        onLogout={handleLogout}
        onNotify={showToast}
      />

      <LabComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        item={comparisonItem}
        onSelectLabOffering={handleSelectLabOffering}
        selectedCity={selectedCity}
      />

      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={(city) => {
          setSelectedCity(city);
          showToast(`Location set to ${city}`);
        }}
      />

      <QuickPrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        selectedCity={selectedCity}
      />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsBookingModalOpen(true)}
      />

      <HomeCollectionBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        cartItems={cartItems}
        subtotal={cartTotal}
        selectedCity={selectedCity}
        patientProfile={patientProfile}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Footer */}
      <Footer
        onSelectCity={(city) => {
          setSelectedCity(city);
          showToast(`Location updated to ${city}`);
        }}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

export default App;
