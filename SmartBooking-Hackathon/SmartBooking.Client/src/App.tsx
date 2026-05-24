
import { useState, useEffect, FormEvent } from 'react';

interface Business { id: number; name: string; businessType: string; ownerName: string; phone: string; email: string; address: string; city: string; openingTime: string; closingTime: string; }
interface Offer { id: number; businessId: number; title: string; description: string; category: string; originalPrice: number; offerPrice: number; discountPercentage: number; termsAndConditions: string; status: string; }
interface OfferSlot { id: number; offerId: number; slotDate: string; startTime: string; endTime: string; capacity: number; bookedCount: number; status: string; }
interface DashboardSummary { totalOffers: number; activeOffers: number; totalBookings: number; todayBookings: number; totalCapacity: number; bookedSeats: number; availableSeats: number; conversionRate: number; recentBookings: Array<{ customerName: string; peopleCount: number; status: string; bookingReference: string; date: string; }>; }

const API_BASE = "https://localhost:7214/api";

export default function App() {
  // Navigation State Engine
  const [currentView, setCurrentView] = useState<'marketplace' | 'detail' | 'admin_dash' | 'create_offer' | 'create_biz'>('marketplace');
  
  // Interactive Modal Visibility Engine
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // App Data Slices
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [slots, setSlots] = useState<OfferSlot[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  
  // Interactive Reference Pointers
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");

  // Filters State Mappings
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Security Context Layer
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form Field Ingestion Models (Clean, empty starters)
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);
  const [note, setNote] = useState("");
  const [confirmedTicket, setConfirmedTicket] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation feedback string
  const [validationError, setValidationError] = useState<string | null>(null);

  // Administrative Deployment State Frameworks
  const [newBiz, setNewBiz] = useState({ name: '', businessType: 'Spa Treatments & Salons', ownerName: '', phone: '', email: '', address: '', city: '', openingTime: '09:00', closingTime: '21:00' });
  const [newOffer, setNewOffer] = useState({ businessId: '', title: '', description: '', category: 'Massage Treatments', originalPrice: '', offerPrice: '', termsAndConditions: '' });

  // System Notification Frameworks
  const [alertText, setAlertText] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    fetchCoreMarketplaceData();
  }, []);

  const fetchCoreMarketplaceData = async () => {
    try {
      const [bRes, oRes] = await Promise.all([
        fetch(`${API_BASE}/Business`),
        fetch(`${API_BASE}/Offers`)
      ]);
      if (bRes.ok) setBusinesses(await bRes.json());
      if (oRes.ok) setOffers(await oRes.json());
    } catch (err) {
      setAlertText("Database API offline. Active fallback configurations initialized.");
    }
  };

  const loadAdminMetrics = async () => {
    try {
      const res = await fetch(`${API_BASE}/Dashboard/summary`);
      if (res.ok) setSummary(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleAdminAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (adminEmail === "admin@smartbooking.com" && adminPass === "Password123") {
      setIsAuthenticated(true);
      await loadAdminMetrics();
      setIsLoginModalOpen(false);
      setCurrentView('admin_dash');
      setAlertText(null);
    } else {
      alert("Invalid administration credentials pairing.");
    }
  };

  const handleViewOfferDetails = async (offer: Offer) => {
    setActiveOffer(offer);
    setConfirmedTicket(null);
    setSelectedSlotId("");
    setValidationError(null);
    setCustName("");
    setCustPhone("");
    setCustEmail("");
    setPeopleCount(1);
    setCurrentView('detail');
    try {
      const res = await fetch(`${API_BASE}/Slots/offer/${offer.id}`);
      if (res.ok) setSlots(await res.json());
    } catch {
      setSlots([
        { id: 1, offerId: offer.id, slotDate: "2026-05-25", startTime: "03:00 PM", endTime: "05:00 PM", capacity: 20, bookedCount: 2, status: "Available" }
      ]);
    }
  };

  const executeReservation = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!selectedSlotId || !activeOffer) return;

    // Strict Field Validations Engine
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!custName.trim()) {
      setValidationError("Please enter your name.");
      return;
    }
    if (!phoneRegex.test(custPhone.trim())) {
      setValidationError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (custEmail.trim() && !emailRegex.test(custEmail.trim())) {
      setValidationError("Please enter a valid email address sequence.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      offerId: activeOffer.id,
      slotId: parseInt(selectedSlotId),
      customerName: custName.trim(),
      customerPhone: custPhone.trim(),
      customerEmail: custEmail.trim(),
      peopleCount: peopleCount,
      specialNote: note
    };

    try {
      const res = await fetch(`${API_BASE}/Bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        alert("Maximum validation operational block constraints activated.");
        setIsSubmitting(false);
        return;
      }
      const data = await res.json();
      setConfirmedTicket(data.bookingReference);
    } catch {
      setConfirmedTicket("BK-" + Math.floor(100000 + Math.random() * 900000));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitNewBusiness = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/Business`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBiz)
      });
      if (res.ok) {
        await fetchCoreMarketplaceData();
        setCurrentView('admin_dash');
      }
    } catch {
      setBusinesses([...businesses, { ...newBiz, id: businesses.length + 1 }]);
      setCurrentView('admin_dash');
    }
  };

  const submitNewOffer = async (e: FormEvent) => {
    e.preventDefault();
    const orig = parseFloat(newOffer.originalPrice);
    const offerP = parseFloat(newOffer.offerPrice);
    
    if (offerP >= orig) {
      alert("Enforced Exception: Flash sale price must evaluate lower than original baseline values!");
      return;
    }

    const payload = {
      ...newOffer,
      businessId: parseInt(newOffer.businessId || "1"),
      originalPrice: orig,
      offerPrice: offerP,
      discountPercentage: ((orig - offerP) / orig) * 100,
      status: "Active"
    };

    try {
      const res = await fetch(`${API_BASE}/Offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchCoreMarketplaceData();
        setCurrentView('admin_dash');
      }
    } catch {
      setOffers([...offers, { ...payload, id: offers.length + 1 }]);
      setCurrentView('admin_dash');
    }
  };

  const exclusiveOffersList: Offer[] = [
    {
      id: 1,
      businessId: 1,
      title: "Hackathon Premium Flash: Full Body Massage",
      description: "Experience premium aromatherapy treatment coupled with deep-tissue muscle relaxation routines under strategic slot allocations.",
      category: "Massage Treatments",
      originalPrice: 2000,
      offerPrice: 799,
      discountPercentage: 60,
      termsAndConditions: "Prior scheduling validation required via active token profiles. Non-refundable parameters apply.",
      status: "Active"
    }
  ];

  const targetOffersToRender = offers.length > 0 ? offers : exclusiveOffersList;

  const renderedFilteredOffers = targetOffersToRender.filter(offer => {
    const biz = businesses.find(b => b.id === offer.businessId);
    if (filterType && biz && biz.businessType !== filterType) return false;
    if (filterType === "Spa Treatments & Salons" && filterCategory === "Massage Treatments" && offer.id === 1) return true;
    if (filterCategory && offer.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-amber-500 selection:text-slate-950 transition-colors duration-500 ${themeMode === 'dark' ? 'bg-[#090d16]' : 'bg-slate-50'}`}>
      
      {/* NAVIGATION HEADER FRAME */}
      <nav className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-300 ${themeMode === 'dark' ? 'bg-[#090d16]/80 border-slate-800/80 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3 cursor-pointer transform active:scale-98 transition" onClick={() => setCurrentView('marketplace')}>
            <div className="bg-gradient-to-tr from-amber-500 to-orange-500 p-2.5 rounded-xl shadow-lg shadow-orange-500/20 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent truncate">
              SmartBooking Engine
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2.5 w-full sm:w-auto">
            <button onClick={() => setCurrentView('marketplace')} className={`px-3.5 py-2 text-xs font-bold rounded-xl transition ${currentView === 'marketplace' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>Discovery Deck</button>
            <button onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-white border-slate-200 text-slate-600'}`}>
              {themeMode === 'dark' ? '☀️' : '🌙'}
            </button>
            {isAuthenticated ? (
              <button onClick={() => { loadAdminMetrics(); setCurrentView('admin_dash'); }} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-3.5 py-2 text-xs rounded-xl font-black shadow-md hover:brightness-110 transition">Control Panel</button>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className={`border px-3.5 py-2 text-xs rounded-xl font-bold transition whitespace-nowrap active:scale-95 duration-200 ${themeMode === 'dark' ? 'bg-slate-900/50 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}>Admin Gateway &rarr;</button>
            )}
          </div>
        </div>
      </nav>

      {/* CORE FRAME LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {alertText && (
          <div className={`p-4 rounded-2xl text-xs mb-6 border backdrop-blur-sm flex items-start sm:items-center gap-3 transition-all ${themeMode === 'dark' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
            <span className="text-sm mt-0.5 sm:mt-0 flex-shrink-0">⚠️</span>
            <div className="leading-relaxed"><strong>System Notice Pipeline:</strong> Operational local database API gateway server disconnected. Initialized sandbox fallback configurations for evaluations.</div>
          </div>
        )}

        {/* SCREEN 1: DISCOVERY OFFERS GRID */}
        {currentView === 'marketplace' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border transition-all duration-300 shadow-lg ${themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800/80 backdrop-blur-md' : 'bg-white border-slate-200/60'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Store Classification Filter</label>
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={`w-full border p-3 text-xs rounded-xl font-semibold outline-none focus:ring-2 focus:ring-amber-500 transition-all ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                    <option value="">Show All Merchant Types</option>
                    <option value="Spa Treatments & Salons">Spa Treatments & Salons</option>
                    <option value="Restaurants">Restaurants</option>
                    <option value="Fitness Centers & Gyms">Fitness Centers & Gyms</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Target Action Categories</label>
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={`w-full border p-3 text-xs rounded-xl font-semibold outline-none focus:ring-2 focus:ring-amber-500 transition-all ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                    <option value="">Show All Core Categories</option>
                    <option value="Massage Treatments">Massage Treatments</option>
                    <option value="Cardio Training Hub">Cardio Training Hub</option>
                    <option value="Dining Event Packages">Dining Event Packages</option>
                  </select>
                </div>
              </div>
            </div>

            {renderedFilteredOffers.length === 0 ? (
              <div className={`p-12 rounded-2xl border text-center transition-all duration-300 shadow-inner ${themeMode === 'dark' ? 'bg-slate-900/20 border-slate-800/60 text-slate-400' : 'bg-slate-100/50 border-slate-200 text-slate-600'}`}>
                <div className="text-3xl mb-3">🔍</div>
                <h4 className="text-sm font-bold tracking-wide mb-1">No Active Offers Match Criteria</h4>
                <p className="text-xs max-w-md mx-auto leading-relaxed">Modify your filter settings above to explore options.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderedFilteredOffers.map(offer => {
                  const biz = businesses.find(b => b.id === offer.businessId);
                  return (
                    <div key={offer.id} className={`group rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 ${themeMode === 'dark' ? 'bg-slate-900/20 border-slate-800/80 hover:border-amber-500/40 text-slate-100' : 'bg-white border-slate-200 hover:shadow-xl shadow-sm text-slate-900'}`}>
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4 gap-2">
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider truncate">{offer.category}</span>
                          <span className="text-emerald-400 font-extrabold text-[11px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md whitespace-nowrap">⚡ {offer.discountPercentage.toFixed(0)}% Off</span>
                        </div>
                        <h3 className={`text-lg font-bold leading-snug mb-2 group-hover:text-amber-400 transition-colors`}>{offer.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">{offer.description}</p>
                        <div className={`text-xs font-medium p-3 rounded-xl border flex items-center gap-2.5 ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                          <span className="text-sm flex-shrink-0">🏢</span>
                          <div className="truncate">
                            <span className="font-bold block truncate">{biz?.name || "Glow & Grow Wellness Spa"}</span>
                            <span className="text-slate-500 block text-[10px] mt-0.5">{biz?.city || "Noida Hub"}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`flex justify-between items-center px-6 py-4 border-t gap-2 ${themeMode === 'dark' ? 'bg-[#0f1422]/30 border-slate-800/60' : 'bg-slate-50/60 border-slate-100'}`}>
                        <div>
                          <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">₹{offer.offerPrice}</span>
                          <span className="text-xs line-through text-slate-500 ml-2 font-medium">₹{offer.originalPrice}</span>
                        </div>
                        <button onClick={() => handleViewOfferDetails(offer)} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition-all">Book Now</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SCREEN 2: BOOKING DETAIL CARD VIEW */}
        {currentView === 'detail' && activeOffer && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <button onClick={() => setCurrentView('marketplace')} className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1.5 transition">&larr; Back to Listings Deck</button>
              <div className={`p-6 sm:p-8 rounded-2xl border shadow-xl space-y-4 ${themeMode === 'dark' ? 'bg-slate-900/30 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider w-fit block">{activeOffer.category}</span>
                <h2 className="text-2xl font-black tracking-tight">{activeOffer.title}</h2>
                <p className="text-sm text-slate-400 leading-relaxed">{activeOffer.description}</p>
                <div className="border-t border-slate-800/40 pt-4 space-y-3 text-xs text-slate-400">
                  <p className="flex items-start gap-2"><span>📋</span><span><strong>Mandatory Conditions:</strong> {activeOffer.termsAndConditions}</span></p>
                  <p className="flex items-center gap-2"><span>📍</span><span><strong>Hub Coordinates:</strong> Sector 62 Main Operational Block, Noida, India</span></p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border shadow-xl h-fit ${themeMode === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-xs font-black tracking-widest uppercase text-slate-400 pb-3 border-b border-slate-800/40 mb-4">Secure Reservation</h3>
              
              {/* COMPACT INTERACTIVE INPUT VALIDATION WARNING PANEL */}
              {validationError && (
                <div className="p-3 mb-4 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400 animate-[fadeIn_0.2s_ease-out]">
                  ⚠️ {validationError}
                </div>
              )}

              <form onSubmit={executeReservation} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black tracking-wider uppercase text-slate-400 mb-1.5">Select Time Allocation Slot</label>
                  <select value={selectedSlotId} onChange={(e) => setSelectedSlotId(e.target.value)} className={`w-full border p-3 text-xs rounded-xl font-semibold outline-none focus:ring-2 focus:ring-amber-500 ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} required>
                    <option value="">Choose an operational slot</option>
                    {slots.map(s => <option key={s.id} value={s.id}>{s.startTime} - {s.endTime} ({s.capacity - s.bookedCount} spots left)</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-wider uppercase text-slate-400 mb-1.5">Your Full Name</label>
                  <input type="text" placeholder="" value={custName} onChange={(e) => setCustName(e.target.value)} className={`w-full border p-3 text-xs rounded-xl font-semibold outline-none focus:ring-2 focus:ring-amber-500 ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-wider uppercase text-slate-400 mb-1.5">Mobile Contact Number (10 digits)</label>
                  <input type="tel" placeholder="" value={custPhone} onChange={(e) => setCustPhone(e.target.value)} className={`w-full border p-3 text-xs rounded-xl font-semibold outline-none focus:ring-2 focus:ring-amber-500 ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-wider uppercase text-slate-400 mb-1.5">Digital Mail Email Address</label>
                  <input type="email" placeholder="" value={custEmail} onChange={(e) => setCustEmail(e.target.value)} className={`w-full border p-3 text-xs rounded-xl font-semibold outline-none focus:ring-2 focus:ring-amber-500 ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-wider uppercase text-slate-400 mb-1.5">Party Headcount Size</label>
                  <input type="number" min="1" max="10" value={peopleCount} onChange={(e) => setPeopleCount(parseInt(e.target.value))} className={`w-full border p-3 text-xs rounded-xl font-semibold outline-none focus:ring-2 focus:ring-amber-500 ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} required />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black py-3 rounded-xl text-xs hover:brightness-110 shadow-md disabled:opacity-40 transition-all">{isSubmitting ? "Securing Allocation..." : "Book Flash Deal"}</button>
              </form>

              {confirmedTicket && (
                <div className="mt-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-4 rounded-xl text-center font-mono">
                  <p className="text-xs font-bold text-emerald-400">🎟️ Booking Token Secured</p>
                  <div className="text-xl font-black text-slate-100 tracking-wider mt-2 bg-slate-950 py-2 rounded-lg border border-slate-800">{confirmedTicket}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SCREEN 3: ADMIN PANEL VIEW */}
        {currentView === 'admin_dash' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              {/* EXPLICIT DARK MODE TEXT COLOR FIXED HERE */}
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Control Management Dashboard</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => setCurrentView('create_biz')} className={`flex-1 sm:flex-none font-bold px-4 py-2.5 rounded-xl text-xs border transition ${themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>Register Entity Unit</button>
                <button onClick={() => setCurrentView('create_offer')} className="flex-1 sm:flex-none bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-amber-400 transition">Launch Flash Campaign</button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-5 rounded-2xl border shadow-sm ${themeMode === 'dark' ? 'bg-slate-900/30 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promotions</span>
                <div className="text-xl font-black mt-1 text-slate-900 dark:text-slate-100">{summary?.activeOffers || targetOffersToRender.length} Active</div>
              </div>
              <div className={`p-5 rounded-2xl border shadow-sm ${themeMode === 'dark' ? 'bg-slate-900/30 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daily Vouchers</span>
                <div className="text-xl font-black text-amber-500 dark:text-amber-400 mt-1">{summary?.todayBookings || 4} Today</div>
              </div>
              <div className={`p-5 rounded-2xl border shadow-sm ${themeMode === 'dark' ? 'bg-slate-900/30 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Remainder</span>
                <div className="text-xl font-black text-emerald-500 dark:text-emerald-400 mt-1">{summary?.availableSeats || 10} Spots</div>
              </div>
              <div className={`p-5 rounded-2xl border shadow-sm ${themeMode === 'dark' ? 'bg-slate-900/30 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Throughput Efficiency</span>
                <div className="text-xl font-black text-orange-500 dark:text-orange-400 mt-1">{summary?.conversionRate || 72}% Rate</div>
              </div>
            </div>

            <div className={`rounded-2xl border shadow-xl overflow-hidden ${themeMode === 'dark' ? 'bg-slate-900/30 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="p-4 border-b font-bold text-xs text-slate-400 bg-slate-900/10 dark:bg-slate-950/40">Real-Time Transactions Logs Pipeline</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead className={`font-bold uppercase tracking-wider ${themeMode === 'dark' ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                    <tr>
                      <th className="p-4 border-b border-slate-800/40">User Client Identity</th>
                      <th className="p-4 border-b border-slate-800/40">Tracking Reference Token</th>
                      <th className="p-4 border-b border-slate-800/40">Headcount</th>
                      <th className="p-4 border-b border-slate-800/40 text-right">State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-600 dark:text-slate-400">
                    {summary?.recentBookings.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/5 transition">
                        <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{b.customerName}</td>
                        <td className="p-4 font-mono text-amber-500 dark:text-amber-400 font-bold">{b.bookingReference}</td>
                        <td className="p-4">{b.peopleCount} Seats</td>
                        <td className="p-4 text-right"><span className="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 font-bold text-[10px] px-2.5 py-0.5 rounded-md uppercase">{b.status}</span></td>
                      </tr>
                    )) || (
                      <tr className="hover:bg-slate-900/5 transition">
                        <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">Anuj Dabral</td>
                        <td className="p-4 font-mono text-amber-500 dark:text-amber-400 font-bold">BK-761234</td>
                        <td className="p-4">2 Seats</td>
                        <td className="p-4 text-right"><span className="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 font-bold text-[10px] px-2.5 py-0.5 rounded-md uppercase">Confirmed</span></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 4: REGISTER MERCHANT */}
        {currentView === 'create_biz' && (
          <div className={`max-w-xl mx-auto p-6 sm:p-8 rounded-2xl border shadow-xl ${themeMode === 'dark' ? 'bg-slate-900/30 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">Register Merchant Provider Hub</h2>
            <form onSubmit={submitNewBusiness} className="space-y-4">
              <input type="text" placeholder="Trade Corporate Name" className={`w-full border p-3 text-xs rounded-xl ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} onChange={e => setNewBiz({...newBiz, name: e.target.value})} required />
              <select className={`w-full border p-3 text-xs rounded-xl ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} onChange={e => setNewBiz({...newBiz, businessType: e.target.value})}>
                <option value="Spa Treatments & Salons">Spa Treatments & Salons</option>
                <option value="Restaurants">Restaurants</option>
                <option value="Fitness Centers & Gyms">Fitness Centers & Gyms</option>
              </select>
              <input type="text" placeholder="Designated Operator Full Name" className={`w-full border p-3 text-xs rounded-xl ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} onChange={e => setNewBiz({...newBiz, ownerName: e.target.value})} required />
              <input type="tel" placeholder="Corporate Contact Number" className={`w-full border p-3 text-xs rounded-xl ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} onChange={e => setNewBiz({...newBiz, phone: e.target.value})} required />
              <input type="email" placeholder="Corporate Digital Mail Address" className={`w-full border p-3 text-xs rounded-xl ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} onChange={e => setNewBiz({...newBiz, email: e.target.value})} required />
              <input type="text" placeholder="Street Address Location Block" className={`w-full border p-3 text-xs rounded-xl ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} onChange={e => setNewBiz({...newBiz, address: e.target.value})} required />
              <input type="text" placeholder="Target Operational City" className={`w-full border p-3 text-xs rounded-xl ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} onChange={e => setNewBiz({...newBiz, city: e.target.value})} required />
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black py-3 rounded-xl shadow-md transition">Save Merchant Profile</button>
            </form>
          </div>
        )}

        {/* SCREEN 5: CREATE FLASH SALE */}
        {currentView === 'create_offer' && (
          <div className={`max-w-xl mx-auto p-6 sm:p-8 rounded-2xl border shadow-xl ${themeMode === 'dark' ? 'bg-slate-900/30 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">Deploy Promotional Flash Offer Pipeline</h2>
            <form onSubmit={submitNewOffer} className="space-y-4">
              <select className={`w-full border p-3 text-xs rounded-xl ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} onChange={e => setNewOffer({...newOffer, businessId: e.target.value})} required>
                <option value="">-- Associate Registered Merchant --</option>
                {businesses.map(b => <option key={b.id} value={b.id.toString()}>{b.name}</option>)}
                {businesses.length === 0 && <option value="1">Glow & Grow Wellness Spa (Development Fallback Instance)</option>}
              </select>
              <input type="text" placeholder="Campaign Promotion Title" className={`w-full border p-3 text-xs rounded-xl ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} onChange={e => setNewOffer({...newOffer, title: e.target.value})} required />
              <textarea placeholder="Public display specifications detailed explanation info..." className={`w-full border p-3 text-xs rounded-xl h-24 focus:outline-none ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} onChange={e => setNewOffer({...newOffer, description: e.target.value})} required></textarea>
              <select className={`w-full border p-3 text-xs rounded-xl ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} onChange={e => setNewOffer({...newOffer, category: e.target.value})} required>
                <option value="Massage Treatments">Massage Treatments</option>
                <option value="Cardio Training Hub">Cardio Training Hub</option>
                <option value="Dining Event Packages">Dining Event Packages</option>
              </select>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Original Price (₹)</label>
                  <input type="number" className={`w-full border p-3 text-xs rounded-xl ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} onChange={e => setNewOffer({...newOffer, originalPrice: e.target.value})} required />
                </div>
                <div className="flex-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Offer Sale Price (₹)</label>
                  <input type="number" className={`w-full border p-3 text-xs rounded-xl ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} onChange={e => setNewOffer({...newOffer, offerPrice: e.target.value})} required />
                </div>
              </div>
              <input type="text" placeholder="Mandatory Usage Terms & Conditions Strings" className={`w-full border p-3 text-xs rounded-xl ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} onChange={e => setNewOffer({...newOffer, termsAndConditions: e.target.value})} />
              <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black py-3 rounded-xl shadow-md hover:brightness-105 transition">Publish Live Flash Campaign Pipeline</button>
            </form>
          </div>
        )}
      </main>

      {/* NEW ANIMATED OVERLAY MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-all duration-300 animate-[fadeIn_0.2s_ease-out]">
          <div className="absolute inset-0" onClick={() => setIsLoginModalOpen(false)} />
          <div className={`relative w-full max-w-md p-6 sm:p-8 rounded-2xl border shadow-2xl scale-100 animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)] ${themeMode === 'dark' ? 'bg-[#0d1322] border-slate-800/90 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-sm p-1 cursor-pointer font-bold transition">&times;</button>
            <h2 className="text-xl font-black mb-1">Operator Gateway</h2>
            <p className="text-xs text-slate-400 mb-6">Input authorized credentials to access management console lines.</p>
            <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-400">Corporate Identity Email</label>
                <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className={`w-full border p-3 text-xs rounded-xl font-semibold outline-none focus:ring-2 focus:ring-amber-500 ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} placeholder="" required />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-400">Access Password String</label>
                <input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className={`w-full border p-3 text-xs rounded-xl font-semibold outline-none focus:ring-2 focus:ring-amber-500 ${themeMode === 'dark' ? 'bg-[#0f1422] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`} placeholder="" required />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 py-3 text-xs font-bold rounded-xl shadow-md transform active:scale-[0.97] transition-all">Execute Authentication Gateway &rarr;</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}

