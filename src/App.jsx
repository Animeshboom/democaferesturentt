import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import HeroSection from './components/HeroSection';
import ScrollStoryBar from './components/ScrollStoryBar';
import MenuSection from './components/MenuSection';
import DishDetailModal from './components/DishDetailModal';
import OurStorySection from './components/OurStorySection';
import ChefSection from './components/ChefSection';
import ExperienceSection from './components/ExperienceSection';
import GallerySection from './components/GallerySection';
import ReviewsSection from './components/ReviewsSection';
import AIConciergeModal from './components/AIConciergeModal';
import ReservationModal from './components/ReservationModal';
import CartDrawer from './components/CartDrawer';
import BusinessValueSection from './components/BusinessValueSection';
import LocationSection from './components/LocationSection';
import FinalCTASection from './components/FinalCTASection';
import Footer from './components/Footer';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  // Modals & Drawers state
  const [selectedDish, setSelectedDish] = useState(null);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [reservationInitialTable, setReservationInitialTable] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState([
    {
      id: 'awadhi-biryani',
      name: 'Awadhi Dum Gosht Biryani',
      price: 38,
      currency: '$',
      image: '/images/hero_biryani.jpg',
      quantity: 1,
      customSpice: 1
    }
  ]);

  // Toast notification
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Scroll listener for hero story progression
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollY / (window.innerHeight * 1.5)));
      setScrollProgress(progress);

      // Map scroll progress to 10 cinematic story scenes
      const sceneIdx = Math.min(9, Math.floor(progress * 10));
      setActiveSceneIndex(sceneIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart actions
  const handleAddToCart = (dish) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + (dish.quantity || 1) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          price: dish.price,
          currency: dish.currency || '$',
          image: dish.image,
          quantity: dish.quantity || 1,
          customSpice: dish.customSpice !== undefined ? dish.customSpice : (dish.spiceLevel || 1)
        }
      ];
    });
    showToast(`Added ${dish.name} to order`);
  };

  const handleUpdateCartQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveCartItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--ivory-100)] relative selection:bg-[var(--brass-500)] selection:text-black">
      {/* Film grain and background glow */}
      <div className="grain-overlay" />
      <div className="ambient-glow-top" />

      {/* Custom Desktop Cursor */}
      <CustomCursor />

      {/* Smooth Loading Screen */}
      {isLoading && <LoadingScreen onLoaded={() => setIsLoading(false)} />}

      {/* Sticky Luxury Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenConcierge={() => setIsConciergeOpen(true)}
      />

      {/* Main Experience Flow */}
      <main>
        {/* 1. Cinematic Hero Section with 3D/Reel/Pinterest */}
        <HeroSection
          scrollProgress={scrollProgress}
          activeSceneIndex={activeSceneIndex}
          onExploreMenu={() => {}}
          onReserveTable={() => setIsReservationOpen(true)}
        />

        {/* 2. 10-Scene Cinematic Hero Story Sequence */}
        <ScrollStoryBar
          activeSceneIndex={activeSceneIndex}
          onSelectScene={(idx) => setActiveSceneIndex(idx)}
        />

        {/* 3. Interactive Menu Repertoire */}
        <MenuSection
          onSelectDish={(dish) => setSelectedDish(dish)}
          onAddToCart={handleAddToCart}
        />

        {/* 4. Our Story: The Story Behind Every Plate */}
        <OurStorySection />

        {/* 5. Chef Section: Chef Kabir Vardhan */}
        <ChefSection />

        {/* 6. The Tisha Experience: 4 Architectural Sanctuaries */}
        <ExperienceSection onReserve={() => setIsReservationOpen(true)} />

        {/* 7. Visual Chronicle: Hybrid Masonry Gallery */}
        <GallerySection />

        {/* 8. Gastronomic Acclaim: Reviews & Social Proof */}
        <ReviewsSection />

        {/* 9. Digital Hospitality Philosophy: Business Value */}
        <BusinessValueSection />

        {/* 10. Location, Valet & Interactive Vector Map */}
        <LocationSection onReserve={() => setIsReservationOpen(true)} />

        {/* 11. Final Full-Screen Cinematic Ending */}
        <FinalCTASection
          onReserveTable={() => setIsReservationOpen(true)}
          onExploreMenu={() => {}}
        />
      </main>

      {/* Refined Minimal Footer */}
      <Footer onOpenReservation={() => setIsReservationOpen(true)} />

      {/* Interactive Modals & Drawers */}
      <DishDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToCart={handleAddToCart}
      />

      <AIConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        onSelectDish={(dish) => setSelectedDish(dish)}
        onAddToCart={handleAddToCart}
        onOpenReservation={(table) => {
          setIsConciergeOpen(false);
          setReservationInitialTable(table || null);
          setIsReservationOpen(true);
        }}
      />

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => {
          setIsReservationOpen(false);
          setReservationInitialTable(null);
        }}
        initialTable={reservationInitialTable}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[200] px-4 py-3 rounded bg-[rgba(18,15,13,0.95)] border border-[var(--brass-500)] text-xs text-[var(--ivory-50)] shadow-2xl flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[var(--brass-400)] animate-ping" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
