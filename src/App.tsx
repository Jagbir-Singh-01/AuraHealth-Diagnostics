import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WinterSmogBanner } from './components/WinterSmogBanner';
import { PackageGrid } from './components/PackageGrid';
import { TestCatalog } from './components/TestCatalog';
import { LabLocator } from './components/LabLocator';
import { ReportDownloadPortal } from './components/ReportDownloadPortal';
import { HealthTracker } from './components/HealthTracker';
import { AdminDashboard } from './components/AdminDashboard';
import { DoctorConsultation } from './components/DoctorConsultation';
import { HealthBlogSection } from './components/HealthBlogSection';
import { Footer } from './components/Footer';
import { CitySelectorModal } from './components/CitySelectorModal';
import { QuickPrescriptionModal } from './components/QuickPrescriptionModal';
import { CartDrawer } from './components/CartDrawer';
import { HomeCollectionBookingModal } from './components/HomeCollectionBookingModal';
import { CartItem, HealthPackage, TestItem, Booking } from './types';
import { INITIAL_BOOKINGS, HEALTH_PACKAGES } from './data/mockData';
import { Check, Sparkles } from 'lucide-react';

export function App() {
  const [selectedCity, setSelectedCity] = useState<string>('Gurugram (Gurgaon)');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Modals state
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Selected for detailed modal
  const [selectedPackage, setSelectedPackage] = useState<HealthPackage | null>(null);
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);

  // Toast notification
  const [toast, setToast] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleAddToCart = (item: TestItem | HealthPackage, type: 'TEST' | 'PACKAGE') => {
    const existingIndex = cartItems.findIndex((ci) => ci.itemId === item.id);
    if (existingIndex > -1) {
      showToast(`"${item.name}" is already in your cart.`);
      setIsCartDrawerOpen(true);
      return;
    }

    const newCartItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random()}`,
      itemId: item.id,
      type,
      item,
      beneficiaryIds: ['self'],
    };

    setCartItems((prev) => [...prev, newCartItem]);
    showToast(`Added "${item.name}" to cart!`);
    setIsCartDrawerOpen(true);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.id !== id));
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setCartItems([]);
  };

  const handleSearchFocus = () => {
    setActiveTab('home');
    setTimeout(() => {
      searchInputRef.current?.focus();
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }, 100);
  };

  const cartTotal = cartItems.reduce((sum, ci) => sum + ci.item.discountPrice, 0);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        selectedCity={selectedCity}
        onOpenCityModal={() => setIsCityModalOpen(true)}
        onOpenPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
        onOpenCartDrawer={() => setIsCartDrawerOpen(true)}
        cartCount={cartItems.length}
        cartTotal={cartTotal}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchFocus={handleSearchFocus}
      />

      {/* Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              selectedCity={selectedCity}
              onOpenCityModal={() => setIsCityModalOpen(true)}
              onOpenPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
              onAddToCart={handleAddToCart}
              onSelectPackage={(pkg) => setSelectedPackage(pkg)}
              onSelectTest={(test) => setSelectedTest(test)}
              searchInputRef={searchInputRef}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-8">
              <WinterSmogBanner
                onSelectPackage={(pkg) => setSelectedPackage(pkg)}
                onAddToCart={handleAddToCart}
              />
            </div>

            <PackageGrid
              onAddToCart={handleAddToCart}
              selectedPackage={selectedPackage}
              setSelectedPackage={setSelectedPackage}
            />

            <TestCatalog
              onAddToCart={handleAddToCart}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />

            <HealthTracker />

            <HealthBlogSection />
          </>
        )}

        {activeTab === 'doctors' && <DoctorConsultation selectedCity={selectedCity} />}

        {activeTab === 'packages' && (
          <div className="py-6">
            <PackageGrid
              onAddToCart={handleAddToCart}
              selectedPackage={selectedPackage}
              setSelectedPackage={setSelectedPackage}
            />
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="py-6">
            <TestCatalog
              onAddToCart={handleAddToCart}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          </div>
        )}

        {activeTab === 'smog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
            <WinterSmogBanner
              onSelectPackage={(pkg) => setSelectedPackage(pkg)}
              onAddToCart={handleAddToCart}
            />
            <PackageGrid
              onAddToCart={handleAddToCart}
              selectedPackage={selectedPackage}
              setSelectedPackage={setSelectedPackage}
            />
          </div>
        )}

        {activeTab === 'labs' && <LabLocator />}

        {activeTab === 'reports' && (
          <div className="space-y-8">
            <ReportDownloadPortal />
            <HealthTracker />
          </div>
        )}

        {activeTab === 'admin' && (
          <AdminDashboard bookings={bookings} setBookings={setBookings} />
        )}
      </main>

      {/* Global Modals & Drawers */}
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
