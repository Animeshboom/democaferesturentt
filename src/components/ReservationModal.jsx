import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle, MessageCircle, Phone, Sparkles, MapPin, ArrowRight, ArrowLeft, QrCode, ShieldCheck } from 'lucide-react';
import InteractiveTableMap from './InteractiveTableMap';
import { RESTAURANT_TABLES } from '../data/floorPlanData';

export default function ReservationModal({
  isOpen,
  onClose,
  initialTable = null,
  initialZone = null
}) {
  // Steps: 1 (Date/Time/Zone) -> 2 (Floor Plan Map) -> 3 (Guest Details) -> 4 (Confirmation)
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    guests: '2 Guests',
    date: '2026-10-10',
    time: '19:30',
    seatingZone: initialZone || initialTable?.zone || 'The Golden Hour Dining Hall',
    name: '',
    phone: '',
    email: '',
    occasion: 'Anniversary Celebration',
    specialNotes: '',
    dietaryProtocols: ['Strict Jain & Sattvic available upon request'],
    tastingMenu: '7-Course Dastarkhwan Feast & Sommelier Pairing (+₹3,500/guest)'
  });

  const toggleDietary = (protocol) => {
    setFormData(prev => {
      const exists = prev.dietaryProtocols.includes(protocol);
      return {
        ...prev,
        dietaryProtocols: exists
          ? prev.dietaryProtocols.filter(p => p !== protocol)
          : [...prev.dietaryProtocols, protocol]
      };
    });
  };

  // Selected table state (defaults to initialTable, or first available in chosen zone or T-01)
  const [selectedTable, setSelectedTable] = useState(
    initialTable || RESTAURANT_TABLES.find(t => t.id === 'T-01') || RESTAURANT_TABLES[0]
  );
  const [bookingRef, setBookingRef] = useState('');

  // Sync when initialTable or initialZone prop is passed
  React.useEffect(() => {
    if (initialTable) {
      setSelectedTable(initialTable);
      if (initialTable.zone) {
        setFormData(prev => ({ ...prev, seatingZone: initialTable.zone }));
      }
      setStep(2); // Jump directly to Cinema-Style Table Floor Map with table locked in!
    } else if (initialZone) {
      setFormData(prev => ({ ...prev, seatingZone: initialZone }));
      const matching = RESTAURANT_TABLES.find(t => t.zone === initialZone && t.status === 'available');
      if (matching) setSelectedTable(matching);
    }
  }, [initialTable, initialZone, isOpen]);

  if (!isOpen) return null;

  const seatingOptions = [
    { id: 'grand-hall', name: 'The Golden Hour Dining Hall', desc: 'Warm brass lattices, chandelier glow & live acoustics' },
    { id: 'saffron-salon', name: 'The Private Saffron Salon', desc: 'Secluded luxury for confidential feasts & groups' },
    { id: 'chef-table', name: "The Chef's Fire Table", desc: 'Front-row view of live tandoor and copper handi plating' },
    { id: 'botanical-bar', name: 'The Rasoi Botanical Lounge', desc: 'High-energy mixology & artisanal Indian spirits' }
  ];

  const handleNextStep = (e) => {
    e?.preventDefault();
    if (step === 1) {
      // Find matching available table for this zone if current doesn't match
      const matchingInZone = RESTAURANT_TABLES.find(
        t => t.zone === formData.seatingZone && t.status === 'available'
      );
      if (matchingInZone) {
        setSelectedTable(matchingInZone);
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      const ref = `TR-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingRef(ref);
      setStep(4);
    }
  };

  const handleWhatsAppConfirm = () => {
    const text = encodeURIComponent(
      `Hello Tisha Restro, I have confirmed a reservation [Ref #${bookingRef}]:\n- Guest: ${formData.name}\n- Date & Time: ${formData.date} at ${formData.time}\n- Party: ${formData.guests}\n- Zone: ${formData.seatingZone}\n- Selected Table: ${selectedTable?.tableNumber} (${selectedTable?.id}) - ${selectedTable?.view}\n- Occasion: ${formData.occasion}\nPlease verify our table reservation.`
    );
    window.open(`https://wa.me/917008665245?text=${text}`, '_blank');
  };

  return (
    <div className="modal-backdrop">
      <div className="relative w-full max-w-3xl my-auto rounded-xl modal-container-card flex flex-col max-h-[92vh] overflow-hidden my-4 sm:my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full border border-[var(--border-subtle)] text-[var(--ivory-300)] hover:text-white hover:border-[var(--brass-500)] transition-all cursor-pointer"
          aria-label="Close reservation modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Stepper Header */}
        <div className="p-4 sm:p-6 border-b border-[var(--border-subtle)] bg-[rgba(20,16,13,0.95)] shrink-0">
          <span className="text-[0.68rem] tracking-[0.25em] uppercase text-[var(--brass-400)] block font-mono mb-1">
            Imperial Table Booking • Step {step} of 4
          </span>
          <h3 className="font-display text-xl sm:text-2xl text-[var(--ivory-50)]">
            {step === 1 && 'Select Date, Time & Zone'}
            {step === 2 && 'Choose Your Exact Table (Floor Plan)'}
            {step === 3 && 'Guest Profile & Special Requests'}
            {step === 4 && 'Imperial Reservation Confirmed'}
          </h3>

          <div className="flex items-center gap-2 mt-3 sm:mt-4">
            <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-[var(--brass-500)]' : 'bg-white/10'}`} />
            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-[var(--brass-500)]' : 'bg-white/10'}`} />
            <div className={`flex-1 h-1 rounded-full ${step >= 3 ? 'bg-[var(--brass-500)]' : 'bg-white/10'}`} />
            <div className={`flex-1 h-1 rounded-full ${step >= 4 ? 'bg-[var(--brass-500)]' : 'bg-white/10'}`} />
          </div>
        </div>

        {/* STEP 1: Date, Time & Zone */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="p-4 sm:p-8 space-y-6 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Guests */}
              <div>
                <label
                  className="block text-xs uppercase tracking-wider font-semibold mb-2"
                  style={{ color: '#dfb958', letterSpacing: '0.12em' }}
                >
                  Party Size
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="modal-form-select"
                >
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>4 Guests</option>
                  <option>6 Guests</option>
                  <option>8 Guests (Private Dining)</option>
                  <option>10+ Guests (Royal Feast)</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label
                  className="block text-xs uppercase tracking-wider font-semibold mb-2"
                  style={{ color: '#dfb958', letterSpacing: '0.12em' }}
                >
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="modal-form-input"
                  style={{ colorScheme: 'dark' }}
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label
                  className="block text-xs uppercase tracking-wider font-semibold mb-2"
                  style={{ color: '#dfb958', letterSpacing: '0.12em' }}
                >
                  Time Slot
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="modal-form-select"
                >
                  <option value="12:30">12:30 PM (Lunch)</option>
                  <option value="13:30">1:30 PM (Lunch)</option>
                  <option value="18:30">6:30 PM (Dinner Sunset)</option>
                  <option value="19:30">7:30 PM (Peak Seating)</option>
                  <option value="20:30">8:30 PM (Imperial Seating)</option>
                  <option value="21:30">9:30 PM (Late Dining)</option>
                </select>
              </div>
            </div>

            {/* Seating Zone Selection */}
            <div>
              <label
                className="block text-xs uppercase tracking-wider font-semibold mb-3"
                style={{ color: '#dfb958', letterSpacing: '0.12em' }}
              >
                Select Architectural Dining Zone
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {seatingOptions.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, seatingZone: zone.name })}
                    className={formData.seatingZone === zone.name ? 'seating-zone-card active' : 'seating-zone-card'}
                  >
                    <h5
                      className="font-display mb-1"
                      style={{ color: '#ffffff', fontSize: '0.92rem', fontWeight: 600 }}
                    >
                      {zone.name}
                    </h5>
                    <p
                      className="font-editorial italic leading-relaxed"
                      style={{ color: '#d4c5b1', fontSize: '0.74rem' }}
                    >
                      {zone.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(197,155,39,0.22)] flex items-center justify-between">
              <span className="text-xs text-[var(--brass-300)] font-editorial italic">
                ✦ Next step: View live floor plan and select table
              </span>
              <button
                type="submit"
                className="btn-brass-primary !py-3 !px-8 text-xs flex items-center gap-2"
                style={{ fontWeight: 700, color: '#0a0807' }}
              >
                <span>Select Your Table on Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Interactive Table Floor Plan Selection */}
        {step === 2 && (
          <div className="p-4 sm:p-8 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[var(--brass-400)] uppercase font-mono tracking-wider">
                  Interactive Dining Room Blueprint
                </span>
                <p className="text-xs text-[var(--ivory-muted)] font-editorial italic">
                  Explore available tables, window views, and distance from live acoustics.
                </p>
              </div>

              <div className="px-3 py-1 rounded bg-[rgba(197,155,39,0.1)] border border-[var(--border-subtle)] text-xs text-[var(--brass-300)] font-mono">
                {formData.date} • {formData.time}
              </div>
            </div>

            {/* Architectural Interactive Map */}
            <InteractiveTableMap
              selectedTableId={selectedTable?.id}
              onSelectTable={(table) => {
                setSelectedTable(table);
                setFormData(prev => ({ ...prev, seatingZone: table.zone }));
              }}
              preferredZone={formData.seatingZone}
              partySize={formData.guests}
            />

            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs uppercase tracking-wider text-[var(--ivory-muted)] hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Date & Zone</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-brass-primary !py-3 !px-8 text-xs flex items-center gap-2"
                disabled={!selectedTable}
              >
                <span>Confirm {selectedTable?.tableNumber} & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Guest Profile & Notes */}
        {step === 3 && (
          <form onSubmit={handleNextStep} className="p-4 sm:p-8 space-y-4 overflow-y-auto">
            {/* Table Locked Banner */}
            <div className="p-3.5 rounded-lg bg-[rgba(197,155,39,0.1)] border border-[var(--brass-500)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--brass-400)] animate-pulse" />
                <span className="text-xs text-[var(--ivory-100)] font-display">
                  Locked Table: <strong className="text-[var(--brass-300)]">{selectedTable?.tableNumber}</strong> ({selectedTable?.id}) • {selectedTable?.zone}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-[0.68rem] text-[var(--brass-400)] underline font-mono cursor-pointer"
              >
                Change Table
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs uppercase tracking-wider font-semibold mb-2"
                  style={{ color: '#dfb958', letterSpacing: '0.12em' }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maharani Gayatri Devi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="modal-form-input"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xs uppercase tracking-wider font-semibold mb-2"
                  style={{ color: '#dfb958', letterSpacing: '0.12em' }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="modal-form-input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs uppercase tracking-wider font-semibold mb-2"
                  style={{ color: '#dfb958', letterSpacing: '0.12em' }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="guest@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="modal-form-input"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xs uppercase tracking-wider font-semibold mb-2"
                  style={{ color: '#dfb958', letterSpacing: '0.12em' }}
                >
                  Dining Occasion
                </label>
                <select
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  className="modal-form-select"
                >
                  <option>Anniversary Celebration</option>
                  <option>Romantic Date Night</option>
                  <option>Family Gathering</option>
                  <option>Executive Business Dinner</option>
                  <option>Special Birthday</option>
                </select>
              </div>
            </div>

            {/* Curated Multi-Course Tasting Menu Pre-selection */}
            <div>
              <label
                className="block text-xs uppercase tracking-wider font-semibold mb-2"
                style={{ color: '#dfb958', letterSpacing: '0.12em' }}
              >
                Curate Tasting Menu & Sommelier Pairing
              </label>
              <select
                value={formData.tastingMenu}
                onChange={(e) => setFormData({ ...formData, tastingMenu: e.target.value })}
                className="modal-form-select"
              >
                <option value="none">Dine-in Ordering (A la carte physical gold-leaf menu)</option>
                <option value="7-course">7-Course Royal Dastarkhwan Feast & Sommelier Pairing (+₹3,500/guest)</option>
                <option value="5-course-veg">5-Course Royal Vegetarian Symphony (+₹2,400/guest)</option>
                <option value="dum-pukht">Nawabi Shahi Dum Pukht Tasting Experience (+₹3,200/guest)</option>
              </select>
            </div>

            {/* Dietary Protocols & Kitchen Care */}
            <div>
              <label
                className="block text-xs uppercase tracking-wider font-semibold mb-2"
                style={{ color: '#dfb958', letterSpacing: '0.12em' }}
              >
                Royal Dietary Protocols & Kitchen Care
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Strict Jain & Sattvic (No onion/garlic)',
                  'Halal Certified Meat',
                  'Nut & Dairy Safety Alert',
                  'Vegan Royal Awadhi'
                ].map((item) => {
                  const active = formData.dietaryProtocols.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleDietary(item)}
                      className={`cursor-pointer px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                        active
                          ? 'bg-[var(--brass-500)] text-[#0a0807] font-semibold border border-[var(--brass-300)] shadow-[0_0_10px_rgba(197,155,39,0.35)]'
                          : 'bg-[#18120e] text-[#d4c5b1] border border-[rgba(197,155,39,0.2)] hover:border-[var(--brass-400)]'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                className="block text-xs uppercase tracking-wider font-semibold mb-2"
                style={{ color: '#dfb958', letterSpacing: '0.12em' }}
              >
                Tableside Requests or Special Notes
              </label>
              <textarea
                rows={2}
                placeholder="Tableside anniversary dessert cloche, specific wine vintages, seating privacy preferences..."
                value={formData.specialNotes}
                onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                className="modal-form-input"
              />
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs uppercase tracking-wider text-[var(--ivory-muted)] hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Table Map</span>
              </button>
              <button type="submit" className="btn-brass-primary !py-3 !px-8 text-xs">
                <span>Confirm Imperial Reservation</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Booking Confirmed & Digital QR Dining Pass */}
        {step === 4 && (
          <div className="p-8 text-center flex flex-col items-center">
            {/* VIP Status & Digital QR Pass */}
            <div className="w-20 h-20 rounded-2xl border-2 border-[var(--brass-400)] flex items-center justify-center bg-[rgba(197,155,39,0.12)] mb-4 relative shadow-[0_0_25px_rgba(197,155,39,0.4)]">
              <QrCode className="w-12 h-12 text-[var(--brass-400)]" />
              <div className="absolute -top-2 -right-2 bg-[#10b981] text-[#0a0807] text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Instant Lock
              </div>
            </div>

            <span className="text-xs uppercase tracking-widest text-[var(--brass-400)] font-mono block mb-1">
              Imperial Digital Pass • Ref #{bookingRef}
            </span>
            <h4 className="font-display text-2xl text-[var(--ivory-50)] mb-3">
              We Await Your Arrival, {formData.name || 'Honoured Guest'}
            </h4>
            <p className="font-editorial text-base text-[var(--ivory-300)] italic max-w-md mb-6">
              Your exact table has been locked in {formData.seatingZone} for {formData.guests} on {formData.date} at {formData.time}. A digital SMS & WhatsApp dining pass has been dispatched.
            </p>

            <div className="w-full max-w-md p-4 rounded-lg bg-[rgba(10,8,7,0.6)] border border-[var(--border-subtle)] text-xs text-left mb-6 space-y-2">
              <div className="flex justify-between border-b border-[rgba(255,255,255,0.06)] pb-1.5">
                <span className="text-[var(--brass-400)] font-semibold">Allocated Table:</span>
                <span className="text-white font-display">{selectedTable?.tableNumber} ({selectedTable?.id})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ivory-muted)]">Table View:</span>
                <span className="text-[var(--brass-300)]">{selectedTable?.view}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ivory-muted)]">Atmosphere:</span>
                <span className="text-white">{selectedTable?.atmosphere}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ivory-muted)]">Dietary Protocols:</span>
                <span className="text-[var(--brass-300)]">
                  {formData.dietaryProtocols.length > 0 ? formData.dietaryProtocols.join(', ') : 'Standard Royal Service'}
                </span>
              </div>
              {formData.tastingMenu !== 'none' && (
                <div className="flex justify-between">
                  <span className="text-[var(--ivory-muted)]">Pre-selected Menu:</span>
                  <span className="text-white">{formData.tastingMenu}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--ivory-muted)]">Dress Code:</span>
                <span className="text-white">Smart Elegant (Collared / Evening)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ivory-muted)]">Occasion:</span>
                <span className="text-white">{formData.occasion}</span>
              </div>
            </div>

            {/* Direct Confirmation Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <button
                onClick={handleWhatsAppConfirm}
                className="btn-brass-primary flex-1 !py-3 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>Receive Pass on WhatsApp</span>
              </button>

              <button
                onClick={onClose}
                className="btn-outline-brass flex-1 !py-3"
              >
                <span>Done</span>
              </button>
            </div>

            <p className="mt-4 text-[0.65rem] text-[var(--ivory-muted)] font-mono">
              ✦ Showcase Concept Booking • Simulated Live Table Lock-in with Instant QR Dining Pass
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
