import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  User,
  Settings,
  Shield,
  Plus,
  Trash2,
  AlertCircle,
  Bell,
  DollarSign,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bike,
  Coffee,
  Moon,
  Compass,
  Heart,
  Calendar,
  X
} from 'lucide-react';

// --- MOCK INITIAL DATA ---
const INITIAL_EXPERIENCES = [
  {
    id: 1,
    title: "Sunrise E-Bike Brunch Tour",
    category: "Brunch Rides",
    duration: 1.5,
    price: 45,
    maxGroupSize: 8,
    bikesRequiredPerPerson: 1,
    description: "Kickstart your morning with a scenic ride along the river, stopping at top local cafes for artisanal pastries and brunch. Includes a guide, premium e-bike, and breakfast voucher.",
    image: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=800&auto=format&fit=crop&q=80",
    tier: 1,
    hostName: "Alex Mercer",
    timeSlots: ["09:00", "11:30"]
  },
  {
    id: 2,
    title: "Midnight City Lights Cruise",
    category: "Moonlight Tours",
    duration: 2,
    price: 60,
    maxGroupSize: 10,
    bikesRequiredPerPerson: 1,
    description: "Experience the city lights by night! Cruise past illuminated monuments and iconic skyline vistas under the stars on our high-visibility electric cruisers.",
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&auto=format&fit=crop&q=80",
    tier: 2,
    hostName: "Elena Rostova",
    timeSlots: ["19:30", "21:30"]
  },
  {
    id: 3,
    title: "Historic Monument Photo Hunt",
    category: "Scavenger Hunts",
    duration: 3,
    price: 35,
    maxGroupSize: 12,
    bikesRequiredPerPerson: 1,
    description: "Solve riddles, race other teams, and capture stunning photos of historic monuments in this high-energy e-bike scavenger hunt. Winners get a custom Tourbi gift card!",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80",
    tier: 1,
    hostName: "Marcus Vance",
    timeSlots: ["10:00", "14:00"]
  },
  {
    id: 4,
    title: "Electric Sparks Speed Dating",
    category: "Speed Dating",
    duration: 2,
    price: 50,
    maxGroupSize: 16,
    bikesRequiredPerPerson: 1,
    description: "Meet like-minded singles while enjoying a fun, guided ride through scenic park trails. Rotate partners every 15 minutes, with social drinks included at the final stop.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    tier: 3,
    hostName: "Chloe Dupont",
    timeSlots: ["16:00", "18:30"]
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 101,
    experienceId: 2,
    experienceTitle: "Midnight City Lights Cruise",
    date: "2026-06-10",
    time: "19:30",
    spots: 4,
    customerName: "Sarah Connor",
    customerEmail: "sarah@sky.net",
    totalPaid: 360,
    platformFee: 36,
    bikeFee: 120,
    hostPayout: 204,
    status: "confirmed",
    createdAt: "2026-06-08 14:32"
  },
  {
    id: 102,
    experienceId: 1,
    experienceTitle: "Sunrise E-Bike Brunch Tour",
    date: "2026-06-11",
    time: "09:00",
    spots: 2,
    customerName: "John Doe",
    customerEmail: "john.doe@gmail.com",
    totalPaid: 120,
    platformFee: 27,
    bikeFee: 30,
    hostPayout: 63,
    status: "confirmed",
    createdAt: "2026-06-08 16:15"
  }
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, text: "System Online: 30 electric bikes loaded into the central fleet.", time: "2 hours ago", type: "system", read: false },
  { id: 2, text: "New Booking: Sarah Connor booked 'Midnight City Lights Cruise' for 4 people.", time: "1 hour ago", type: "booking", read: false },
  { id: 3, text: "Maintenance Alert: Bike #12 marked as 'Under Maintenance'.", time: "45 mins ago", type: "system", read: false }
];

export default function App() {
  // --- STATE ---
  const [activeRole, setActiveRole] = useState('customer'); // 'customer' | 'host' | 'admin'
  const [experiences, setExperiences] = useState(INITIAL_EXPERIENCES);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Inventory pool state
  const [totalBikes, setTotalBikes] = useState(30);
  const [maintenanceBikes, setMaintenanceBikes] = useState([12]); // Active maintenance list

  // Booking Modal State
  const [bookingExperience, setBookingExperience] = useState(null);
  const [bookingDate, setBookingDate] = useState("2026-06-10");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingSpots, setBookingSpots] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [bookingStep, setBookingStep] = useState(1); // 1 = Details, 2 = Payment, 3 = Confirmation

  // Host Create Experience Form State
  const [newExpTitle, setNewExpTitle] = useState("");
  const [newExpCategory, setNewExpCategory] = useState("Brunch Rides");
  const [newExpDuration, setNewExpDuration] = useState(2);
  const [newExpPrice, setNewExpPrice] = useState(45);
  const [newExpGroupSize, setNewExpGroupSize] = useState(10);
  const [newExpDescription, setNewExpDescription] = useState("");
  const [newExpTier, setNewExpTier] = useState(1); // 1, 2, 3
  const [newExpTimeSlots, setNewExpTimeSlots] = useState(["10:00", "15:00"]);
  const [hostFormError, setHostFormError] = useState("");

  // --- REVENUE CALCULATION UTILITY ---
  const calculateRevenue = (price, spots, duration, tier) => {
    const ticketRevenue = price * spots;
    let platformPercentage = 0.30;
    let bikeHourlyRate = 10;
    
    if (tier === 2) {
      platformPercentage = 0.15;
      bikeHourlyRate = 15;
    } else if (tier === 3) {
      platformPercentage = 0;
      bikeHourlyRate = 20;
    }
    
    const platformFee = ticketRevenue * platformPercentage;
    const hostPayout = ticketRevenue * (1 - platformPercentage);
    const bikeFee = spots * duration * bikeHourlyRate;
    const totalPaid = ticketRevenue + bikeFee;
    
    return {
      ticketRevenue,
      platformFee,
      hostPayout,
      bikeFee,
      totalPaid
    };
  };

  // --- INVENTORY LOCKING UTILITY ---
  const getOccupiedBikes = (date, time) => {
    return bookings
      .filter(b => b.date === date && b.time === time && b.status === "confirmed")
      .reduce((sum, b) => sum + b.spots, 0);
  };

  const getAvailableBikes = (date, time) => {
    const activeBikes = totalBikes - maintenanceBikes.length;
    const occupied = getOccupiedBikes(date, time);
    return Math.max(0, activeBikes - occupied);
  };

  // --- NOTIFICATIONS ADDER ---
  const addNotification = (text, type = "system") => {
    const newNotif = {
      id: Date.now(),
      text,
      time: "Just now",
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // --- ACTIONS ---
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !bookingTime) {
      alert("Please fill all booking details!");
      return;
    }

    const bikesNeeded = bookingSpots;
    const available = getAvailableBikes(bookingDate, bookingTime);

    if (bikesNeeded > available) {
      alert(`Overbooking Error: Only ${available} electric bikes available for this slot.`);
      return;
    }

    const breakdown = calculateRevenue(
      bookingExperience.price,
      bookingSpots,
      bookingExperience.duration,
      bookingExperience.tier
    );

    const newBooking = {
      id: Date.now(),
      experienceId: bookingExperience.id,
      experienceTitle: bookingExperience.title,
      date: bookingDate,
      time: bookingTime,
      spots: bookingSpots,
      customerName,
      customerEmail,
      totalPaid: breakdown.totalPaid,
      platformFee: breakdown.platformFee,
      bikeFee: breakdown.bikeFee,
      hostPayout: breakdown.hostPayout,
      status: "confirmed",
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    setBookings(prev => [newBooking, ...prev]);
    addNotification(`New Booking: ${customerName} booked '${bookingExperience.title}' (${bookingSpots} spots) for ${bookingDate} at ${bookingTime}`, "booking");
    
    setBookingStep(3);
  };

  const handleCreateExperience = (e) => {
    e.preventDefault();
    setHostFormError("");

    if (!newExpTitle || !newExpDescription) {
      setHostFormError("Please fill out all fields.");
      return;
    }

    if (newExpTier === 3 && newExpDuration < 2) {
      setHostFormError("Tier 3 Experiences require a minimum duration of 2 hours.");
      return;
    }

    const newExp = {
      id: Date.now(),
      title: newExpTitle,
      category: newExpCategory,
      duration: parseFloat(newExpDuration),
      price: parseFloat(newExpPrice),
      maxGroupSize: parseInt(newExpGroupSize),
      bikesRequiredPerPerson: 1,
      description: newExpDescription,
      image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80",
      tier: parseInt(newExpTier),
      hostName: "Demo Host",
      timeSlots: newExpTimeSlots
    };

    setExperiences(prev => [newExp, ...prev]);
    addNotification(`Host published new experience: '${newExpTitle}' (${newExpCategory})`, "system");

    setNewExpTitle("");
    setNewExpDescription("");
    setNewExpPrice(45);
    setNewExpDuration(2);
    setNewExpTier(1);
    alert("Experience created successfully and added to Tourbi Marketplace!");
  };

  const toggleMaintenance = (bikeId) => {
    if (maintenanceBikes.includes(bikeId)) {
      setMaintenanceBikes(prev => prev.filter(id => id !== bikeId));
      addNotification(`Bike #${bikeId} returned to service. Central pool availability increased.`, "system");
    } else {
      setMaintenanceBikes(prev => [...prev, bikeId]);
      addNotification(`Bike #${bikeId} put into maintenance. Removing from available fleet.`, "system");
    }
  };

  const handleAddBike = () => {
    const newBikeId = totalBikes + 1;
    setTotalBikes(prev => prev + 1);
    addNotification(`Admin added Bike #${newBikeId} to the rental pool. Total bikes: ${totalBikes + 1}`, "system");
  };

  const handleRemoveBike = () => {
    if (totalBikes <= 1) return;
    setTotalBikes(prev => prev - 1);
    addNotification(`Admin removed a bike from the rental pool. Total bikes: ${totalBikes - 1}`, "system");
  };

  // --- STATS AND ANALYTICS ---
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalPlatformFees = 0;
    let totalBikeFees = 0;
    let totalHostPayouts = 0;

    bookings.forEach(b => {
      if (b.status === "confirmed") {
        totalRevenue += b.totalPaid;
        totalPlatformFees += b.platformFee;
        totalBikeFees += b.bikeFee;
        totalHostPayouts += b.hostPayout;
      }
    });

    const activeFleet = totalBikes - maintenanceBikes.length;
    const occupancyRate = bookings.length > 0 ? ((bookings.reduce((s, b) => s + b.spots, 0) / (activeFleet * 10)) * 100).toFixed(1) : 0;

    return {
      totalRevenue,
      totalPlatformFees,
      totalBikeFees,
      totalHostPayouts,
      activeFleet,
      occupancyRate
    };
  }, [bookings, totalBikes, maintenanceBikes]);

  const filteredExperiences = experiences.filter(exp => 
    categoryFilter === 'All' ? true : exp.category === categoryFilter
  );

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-dark)' }}>
      
      {/* --- NOTIFICATION CENTER DRAWER --- */}
      {showNotifications && (
        <div className="notification-backdrop">
          <div className="notification-panel">
            <div className="flex justify-between items-center pb-4 border-b-line">
              <div className="flex items-center gap-2">
                <Bell className="text-orange" size={20} />
                <h3 className="text-lg font-bold">Platform Notifications</h3>
              </div>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover-opacity"
                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="notification-list">
              {notifications.map(n => (
                <div key={n.id} className="notification-card">
                  <div className="flex items-center justify-center rounded-circle" style={{ 
                    padding: '8px', 
                    width: '32px', 
                    height: '32px',
                    backgroundColor: n.type === 'booking' ? 'rgba(255, 90, 0, 0.15)' : 'rgba(191, 255, 0, 0.15)',
                    color: n.type === 'booking' ? 'var(--color-orange)' : 'var(--color-lime)'
                  }}>
                    {n.type === 'booking' ? <Users size={14} /> : <Bike size={14} />}
                  </div>
                  <div>
                    <p className="text-sm text-white" style={{ lineHeight: '1.4' }}>{n.text}</p>
                    <span className="text-xs text-gray-500 mt-2" style={{ display: 'block' }}>{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => {
                setNotifications([]);
                addNotification("Notifications cleared.", "system");
              }}
              className="btn-outline w-full py-2 text-xs"
              style={{ marginTop: '16px' }}
            >
              CLEAR ALL
            </button>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="header-wrapper flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveRole('customer')}>
            <span className="bg-purple text-white font-extrabold text-xs" style={{ padding: '6px 10px', borderRadius: '100px' }}>king</span>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-white" style={{ letterSpacing: '1px' }}>TOURBI</span>
              <span className="text-lime font-bold" style={{ fontSize: '9px', letterSpacing: '2px', marginTop: '-3px' }}>ELECTRIC EXPERIENCES</span>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-xs font-bold" style={{ marginLeft: '16px' }}>
            <span className="text-gray-300 hover-opacity cursor-pointer">RENT</span>
            <span className="text-gray-300 hover-opacity cursor-pointer">SHOP</span>
            <span className="text-gray-300 hover-opacity cursor-pointer">REPAIRS</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Role selection tab buttons */}
          <div className="flex gap-1 p-1" style={{ backgroundColor: '#02132a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}>
            <button 
              onClick={() => setActiveRole('customer')} 
              className="cursor-pointer"
              style={{
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '800',
                transition: 'all 0.2s',
                backgroundColor: activeRole === 'customer' ? 'var(--color-purple)' : 'transparent',
                color: activeRole === 'customer' ? '#fff' : 'var(--color-text-secondary)'
              }}
            >
              RIDER PORTAL
            </button>
            <button 
              onClick={() => setActiveRole('host')} 
              className="cursor-pointer"
              style={{
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '800',
                transition: 'all 0.2s',
                backgroundColor: activeRole === 'host' ? 'var(--color-orange)' : 'transparent',
                color: activeRole === 'host' ? '#fff' : 'var(--color-text-secondary)'
              }}
            >
              HOST PORTAL
            </button>
            <button 
              onClick={() => setActiveRole('admin')} 
              className="cursor-pointer"
              style={{
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '800',
                transition: 'all 0.2s',
                backgroundColor: activeRole === 'admin' ? 'var(--color-lime)' : 'transparent',
                color: activeRole === 'admin' ? '#000' : 'var(--color-text-secondary)'
              }}
            >
              ADMIN PANEL
            </button>
          </div>

          {/* Alert bell icon */}
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative cursor-pointer hover-opacity"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '8px 10px',
              color: '#fff'
            }}
          >
            <Bell size={16} />
            {notifications.some(n => !n.read) && (
              <span className="absolute rounded-circle bg-orange" style={{ top: '4px', right: '4px', width: '6px', height: '6px' }} />
            )}
          </button>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      {activeRole === 'customer' && (
        <section className="hero-section">
          <div className="hero-pattern" />
          
          <div className="container hero-grid relative">
            <div className="flex flex-col gap-4">
              <h1 className="text-5xl font-extrabold text-white uppercase" style={{ lineHeight: '1.1', letterSpacing: '-1px' }}>
                Experiences <br />
                <span className="text-gray-400">Over Everything.</span>
              </h1>
              
              <div className="flex items-center gap-3" style={{ margin: '8px 0' }}>
                <span className="text-xs font-bold text-lime" style={{ letterSpacing: '2px', backgroundColor: 'rgba(191,255,0,0.1)', padding: '4px 10px', borderRadius: '100px' }}>POWERED BY</span>
                <span className="text-3xl font-extrabold italic text-orange" style={{ letterSpacing: '1px' }}>TOURBI</span>
              </div>
              
              <p className="text-gray-400 text-base" style={{ maxWidth: '450px', lineHeight: '1.6' }}>
                The most innovative touring platform for electric bikes. Whether you're visiting or live here, Tourbi has unforgettable experiences for every vibe and occasion.
              </p>

              <div className="flex flex-wrap gap-4" style={{ marginTop: '16px' }}>
                <button 
                  onClick={() => {
                    const el = document.getElementById('experiences-explore');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  className="btn-primary-purple"
                >
                  <Compass size={16} />
                  BOOK AN EXPERIENCE
                </button>
                <button 
                  onClick={() => setActiveRole('host')} 
                  className="btn-primary-orange"
                >
                  <Sparkles size={16} />
                  CREATE AN EXPERIENCE
                </button>
              </div>
            </div>

            <div className="hero-img-container">
              <img 
                src="https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=800&auto=format&fit=crop&q=80" 
                alt="Tourbi E-Bikes"
              />
              <div className="hero-img-overlay" />
              
              <div className="hero-img-badge glass-panel p-4 flex justify-between items-center">
                <div>
                  <span className="text-xs text-lime font-bold uppercase" style={{ letterSpacing: '1px', display: 'block' }}>Available Fleet</span>
                  <h4 className="text-base font-bold text-white mt-1">{stats.activeFleet} Active E-Bikes</h4>
                </div>
                <span className="rounded-circle bg-lime" style={{ width: '8px', height: '8px', display: 'inline-block', boxShadow: '0 0 10px var(--color-lime)' }} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- MAIN PORTAL PANELS --- */}
      <main className="flex-1 container py-10">

        {/* ========================================================================= */}
        {/* CUSTOMER PORTAL */}
        {/* ========================================================================= */}
        {activeRole === 'customer' && (
          <div id="experiences-explore" className="flex flex-col gap-6 animate-fade-in">
            {/* Header / Intro */}
            <div className="flex justify-between items-center gap-4 pb-6 border-b-line flex-wrap">
              <div>
                <h2 className="text-2xl font-extrabold text-white">TWO WAYS TO EXPERIENCE</h2>
                <p className="text-gray-400 text-xs mt-1">Browse and book tours below or filter by your favorite category.</p>
              </div>

              {/* Category switches */}
              <div className="flex flex-wrap gap-2">
                {['All', 'Brunch Rides', 'Moonlight Tours', 'Scavenger Hunts', 'Speed Dating'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className="cursor-pointer font-bold"
                    style={{
                      border: categoryFilter === cat ? '1px solid var(--color-purple)' : '1px solid rgba(255,255,255,0.08)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      backgroundColor: categoryFilter === cat ? 'var(--color-purple)' : 'rgba(255,255,255,0.03)',
                      color: categoryFilter === cat ? '#fff' : 'var(--color-text-secondary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Experiences Grid */}
            <div className="grid grid-3">
              {filteredExperiences.map(exp => (
                <div 
                  key={exp.id} 
                  className="glass-panel exp-card"
                >
                  <div className="exp-card-img-container">
                    <img 
                      src={exp.image} 
                      alt={exp.title}
                    />
                    <div className="absolute" style={{ top: '16px', right: '16px' }}>
                      <span className={`badge-tier badge-tier-${exp.tier}`}>
                        Tier {exp.tier} Host
                      </span>
                    </div>
                  </div>

                  <div className="exp-card-content">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-lime uppercase" style={{ letterSpacing: '1.5px' }}>
                        {exp.category === "Brunch Rides" && <Coffee size={12} />}
                        {exp.category === "Moonlight Tours" && <Moon size={12} />}
                        {exp.category === "Scavenger Hunts" && <Compass size={12} />}
                        {exp.category === "Speed Dating" && <Heart size={12} />}
                        {exp.category}
                      </div>

                      <h3 className="text-base font-bold text-white mt-1">{exp.title}</h3>
                      <p className="text-gray-400 text-xs line-clamp-3" style={{ lineHeight: '1.6', marginTop: '6px' }}>{exp.description}</p>
                    </div>

                    <div className="flex flex-col gap-4 pt-4 border-t-line mt-4">
                      {/* Metas */}
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{exp.duration} hrs</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          <span>Max {exp.maxGroupSize} spots</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bike size={12} />
                          <span>E-Bike Incl.</span>
                        </div>
                      </div>

                      {/* Pricing and CTA */}
                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <span className="text-xs text-gray-500" style={{ display: 'block', fontSize: '9px', fontWeight: '800' }}>PRICE PER SPOT</span>
                          <span className="text-xl font-black text-white">${exp.price}</span>
                        </div>
                        
                        <button 
                          onClick={() => {
                            setBookingExperience(exp);
                            setBookingTime(exp.timeSlots[0] || "10:00");
                            setBookingStep(1);
                            setCustomerName("");
                            setCustomerEmail("");
                            setBookingSpots(1);
                          }}
                          className="btn-primary-purple"
                          style={{ padding: '8px 16px', fontSize: '11px' }}
                        >
                          BOOK TOUR
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* How it works info card */}
            <div className="grid grid-2 pt-10">
              <div className="glass-panel p-6 flex gap-4 items-start" style={{ borderLeft: '4px solid var(--color-lime)' }}>
                <div className="flex items-center justify-center rounded-circle" style={{ padding: '10px', backgroundColor: 'rgba(191,255,0,0.1)', color: 'var(--color-lime)' }}>
                  <Bike size={20} />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-base font-bold text-white">FOR RIDERS: Choose & Cruise</h4>
                  <p className="text-xs text-gray-400" style={{ lineHeight: '1.6' }}>
                    Select the experience that fits your vibe, pick your preferred date and time, and instantly secure your spot. The electric bike and all safety gear are prepared and locked in automatically.
                  </p>
                </div>
              </div>

              <div className="glass-panel p-6 flex gap-4 items-start" style={{ borderLeft: '4px solid var(--color-orange)' }}>
                <div className="flex items-center justify-center rounded-circle" style={{ padding: '10px', backgroundColor: 'rgba(255,90,0,0.1)', color: 'var(--color-orange)' }}>
                  <Sparkles size={20} />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-base font-bold text-white">FOR CREATORS: We Provide the Fleet</h4>
                  <p className="text-xs text-gray-400" style={{ lineHeight: '1.6' }}>
                    You bring the unique idea and guide the group, we handle the electric bike fleet! Create, customize, and publish your tour while keeping up to 100% of your ticket price depending on your preferred revenue tier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* HOST DASHBOARD */}
        {/* ========================================================================= */}
        {activeRole === 'host' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Host header banner */}
            <div className="glass-panel p-6 flex justify-between items-center gap-4 flex-wrap" style={{ background: 'linear-gradient(to right, #0d122b, #1a1226)' }}>
              <div>
                <span className="text-xs text-orange font-bold uppercase" style={{ letterSpacing: '1px' }}>Host Panel</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Welcome back, Demo Host!</h2>
                <p className="text-gray-400 text-xs mt-1">Manage your experiences, track your bookings, and design new tours.</p>
              </div>
              
              <div className="flex gap-4 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <span className="text-xs text-gray-500" style={{ fontSize: '9px', fontWeight: '800', display: 'block' }}>TOTAL HOST PAYOUT</span>
                  <span className="text-xl font-black text-orange">${stats.totalHostPayouts.toFixed(2)}</span>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '16px' }}>
                  <span className="text-xs text-gray-500" style={{ fontSize: '9px', fontWeight: '800', display: 'block' }}>MY ACTIVE TOURS</span>
                  <span className="text-xl font-black text-white">{experiences.length}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-2">
              
              {/* Creator Form */}
              <div className="glass-panel p-6 flex flex-col gap-6">
                <div className="pb-4 border-b-line">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Plus className="text-orange" size={18} />
                    Publish a New Bike Experience
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Design an experience and map it to our central electric bike inventory.</p>
                </div>

                {hostFormError && (
                  <div className="p-4 rounded-lg flex items-center gap-3 text-xs font-semibold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)' }}>
                    <AlertCircle size={14} />
                    <span>{hostFormError}</span>
                  </div>
                )}

                <form onSubmit={handleCreateExperience} className="flex flex-col gap-4">
                  <div>
                    <label className="form-label">Experience Title</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Cherry Blossom E-Bike Picnic Cruise"
                      value={newExpTitle}
                      onChange={(e) => setNewExpTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-2">
                    <div>
                      <label className="form-label">Category</label>
                      <select 
                        className="form-select"
                        value={newExpCategory}
                        onChange={(e) => setNewExpCategory(e.target.value)}
                      >
                        <option value="Brunch Rides">Brunch Rides</option>
                        <option value="Moonlight Tours">Moonlight Tours</option>
                        <option value="Scavenger Hunts">Scavenger Hunts</option>
                        <option value="Speed Dating">Speed Dating</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Ticket Price ($ per spot)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        min="10" 
                        max="200"
                        value={newExpPrice}
                        onChange={(e) => setNewExpPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-2">
                    <div>
                      <label className="form-label">Duration (Hours)</label>
                      <input 
                        type="number" 
                        step="0.5"
                        className="form-input" 
                        min="0.5" 
                        max="6"
                        value={newExpDuration}
                        onChange={(e) => setNewExpDuration(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Max Group Size</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        min="2" 
                        max="20"
                        value={newExpGroupSize}
                        onChange={(e) => setNewExpGroupSize(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Experience Description</label>
                    <textarea 
                      className="form-textarea" 
                      rows="3" 
                      placeholder="Provide details about the ride routes, sights, safety rules, and what's included..."
                      value={newExpDescription}
                      onChange={(e) => setNewExpDescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* REVENUE TIER SELECTOR */}
                  <div className="p-4 rounded-xl flex flex-col gap-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <label className="form-label">Select Revenue Tier</label>
                    
                    <div className="grid grid-3">
                      <div 
                        onClick={() => setNewExpTier(1)}
                        className="p-3 rounded-lg border cursor-pointer text-center"
                        style={{
                          backgroundColor: newExpTier === 1 ? 'rgba(79,70,229,0.12)' : 'rgba(1,18,38,0.5)',
                          borderColor: newExpTier === 1 ? 'var(--color-purple)' : 'rgba(255,255,255,0.05)'
                        }}
                      >
                        <span className="text-xs font-bold text-white" style={{ display: 'block' }}>Tier 1</span>
                        <span className="text-xs font-bold mt-1" style={{ color: '#818cf8', display: 'block', fontSize: '10px' }}>Host 70% / Plat 30%</span>
                        <span className="text-gray-500 mt-1" style={{ display: 'block', fontSize: '9px' }}>$10 / bike / hr</span>
                      </div>

                      <div 
                        onClick={() => setNewExpTier(2)}
                        className="p-3 rounded-lg border cursor-pointer text-center"
                        style={{
                          backgroundColor: newExpTier === 2 ? 'rgba(191,255,0,0.12)' : 'rgba(1,18,38,0.5)',
                          borderColor: newExpTier === 2 ? 'var(--color-lime)' : 'rgba(255,255,255,0.05)'
                        }}
                      >
                        <span className="text-xs font-bold text-white" style={{ display: 'block' }}>Tier 2</span>
                        <span className="text-xs font-bold mt-1 text-lime" style={{ display: 'block', fontSize: '10px' }}>Host 85% / Plat 15%</span>
                        <span className="text-gray-500 mt-1" style={{ display: 'block', fontSize: '9px' }}>$15 / bike / hr</span>
                      </div>

                      <div 
                        onClick={() => setNewExpTier(3)}
                        className="p-3 rounded-lg border cursor-pointer text-center"
                        style={{
                          backgroundColor: newExpTier === 3 ? 'rgba(255,90,0,0.12)' : 'rgba(1,18,38,0.5)',
                          borderColor: newExpTier === 3 ? 'var(--color-orange)' : 'rgba(255,255,255,0.05)'
                        }}
                      >
                        <span className="text-xs font-bold text-white" style={{ display: 'block' }}>Tier 3</span>
                        <span className="text-xs font-bold mt-1 text-orange" style={{ display: 'block', fontSize: '10px' }}>Host 100% / Plat 0%</span>
                        <span className="text-gray-500 mt-1" style={{ display: 'block', fontSize: '9px' }}>$20 / bike / hr</span>
                      </div>
                    </div>

                    {/* LIVE EARNINGS CALCULATOR DISPLAY */}
                    <div className="calc-card flex flex-col gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>Host Live Earnings Calculator</span>
                      
                      {(() => {
                        const singleCalc = calculateRevenue(
                          parseFloat(newExpPrice) || 0,
                          1,
                          parseFloat(newExpDuration) || 0,
                          newExpTier
                        );
                        return (
                          <div className="flex justify-between items-center pt-2 text-center" style={{ flexWrap: 'wrap', gap: '12px' }}>
                            <div className="flex-1">
                              <span className="text-gray-500 text-xs" style={{ display: 'block', fontSize: '10px' }}>Client Ticket</span>
                              <span className="text-sm font-bold text-white">${singleCalc.ticketRevenue}</span>
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-500 text-xs" style={{ display: 'block', fontSize: '10px' }}>Bike Rental Fee</span>
                              <span className="text-sm font-bold text-white">${singleCalc.bikeFee}</span>
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-500 text-xs" style={{ display: 'block', fontSize: '10px' }}>Plat Commission</span>
                              <span className="text-sm font-bold text-gray-400">${singleCalc.platformFee.toFixed(1)}</span>
                            </div>
                            <div className="flex-1" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
                              <span className="text-orange font-bold text-xs" style={{ display: 'block', fontSize: '10px' }}>Your Net Earnings</span>
                              <span className="text-base font-extrabold text-orange">${singleCalc.hostPayout.toFixed(1)}</span>
                            </div>
                          </div>
                        );
                      })()}
                      
                      <p className="text-gray-500 border-t-line pt-2 mt-2" style={{ fontSize: '9px', lineHeight: '1.4' }}>
                        *Calculated per single spot booked. Under Tier 1 & 2, the bike fee is paid on top of ticket price. For Tier 3, host receives 100% of the ticket price, but pays the bike rental fee ($20/hour) to the platform (with a 2-hour minimum duration enforced).
                      </p>
                    </div>
                  </div>

                  <button type="submit" className="w-full btn-primary-orange font-bold py-3 mt-2" style={{ fontSize: '12px' }}>
                    PUBLISH EXPERIENCE
                  </button>
                </form>
              </div>

              {/* Host listings and bookings */}
              <div className="flex flex-col gap-6">
                
                {/* Active listings */}
                <div className="glass-panel p-6 flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white">My Active Listings</h3>
                  
                  <div className="flex flex-col gap-3">
                    {experiences.map(e => (
                      <div key={e.id} className="p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex gap-3 items-center">
                          <img src={e.image} className="w-12 h-12 rounded-lg" style={{ objectFit: 'cover' }} />
                          <div>
                            <h4 className="text-xs font-bold text-white">{e.title}</h4>
                            <span className="text-gray-500" style={{ fontSize: '10px', marginTop: '2px', display: 'block' }}>{e.category} • ${e.price}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            if(confirm(`Remove Listing '${e.title}'?`)) {
                              setExperiences(prev => prev.filter(item => item.id !== e.id));
                              addNotification(`Host removed experience: ${e.title}`, "system");
                            }
                          }}
                          className="cursor-pointer hover-opacity"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: 'none',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            color: 'var(--color-error)'
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bookings log */}
                <div className="glass-panel p-6 flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white">Bookings Log</h3>
                  
                  <div className="flex flex-col gap-3">
                    {bookings.map(b => (
                      <div key={b.id} className="p-4 rounded-lg flex flex-col gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-orange font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>Booking ID #{b.id}</span>
                            <h4 className="text-xs font-bold text-white mt-0.5">{b.experienceTitle}</h4>
                          </div>
                          <span className="text-lime font-bold uppercase" style={{ 
                            fontSize: '8px', 
                            padding: '2px 6px', 
                            backgroundColor: 'rgba(16,185,129,0.1)', 
                            border: '1px solid rgba(16,185,129,0.3)', 
                            borderRadius: '4px' 
                          }}>
                            CONFIRMED
                          </span>
                        </div>

                        <div className="grid grid-2 text-xs text-gray-400 pt-2 border-t-line mt-1">
                          <div>Date: <span className="text-white font-semibold">{b.date} {b.time}</span></div>
                          <div>Rider: <span className="text-white font-semibold">{b.customerName}</span></div>
                          <div>Spots: <span className="text-white font-semibold">{b.spots} E-bikes</span></div>
                          <div>Payout: <span className="text-orange font-bold">${b.hostPayout.toFixed(2)}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADMIN PORTAL */}
        {/* ========================================================================= */}
        {activeRole === 'admin' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Dashboard stats cards */}
            <div className="grid grid-4">
              <div className="glass-panel p-4 flex flex-col gap-2">
                <span className="text-gray-400 font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>TOTAL PLATFORM FEES</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-lime">${stats.totalPlatformFees.toFixed(2)}</span>
                  <span className="text-gray-500" style={{ fontSize: '9px' }}>Comm. split</span>
                </div>
              </div>

              <div className="glass-panel p-4 flex flex-col gap-2">
                <span className="text-gray-400 font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>BIKE RENTAL REVENUE</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-white">${stats.totalBikeFees.toFixed(2)}</span>
                  <span className="text-lime" style={{ fontSize: '9px', fontWeight: '800' }}>Direct fees</span>
                </div>
              </div>

              <div className="glass-panel p-4 flex flex-col gap-2">
                <span className="text-gray-400 font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>TOTAL REVENUE (GMV)</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-orange">${stats.totalRevenue.toFixed(2)}</span>
                  <span className="text-gray-500" style={{ fontSize: '9px' }}>Gross sales</span>
                </div>
              </div>

              <div className="glass-panel p-4 flex flex-col gap-2">
                <span className="text-gray-400 font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>ACTIVE FLEET SIZE</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-white">{stats.activeFleet}</span>
                  <span className="text-gray-400" style={{ fontSize: '9px' }}>/ {totalBikes} total</span>
                </div>
              </div>
            </div>

            <div className="grid grid-2">
              
              {/* Bike fleet manager list */}
              <div className="glass-panel p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center pb-4 border-b-line flex-wrap gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Bike className="text-lime" size={18} />
                      Central Bike Fleet Management
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">Add, remove, and toggle maintenance status for all electric bikes.</p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={handleAddBike}
                      className="cursor-pointer font-bold flex items-center gap-1"
                      style={{
                        padding: '6px 12px',
                        fontSize: '10px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        borderRadius: '6px'
                      }}
                    >
                      <Plus size={12} /> ADD BIKE
                    </button>
                    <button 
                      onClick={handleRemoveBike}
                      className="cursor-pointer font-bold flex items-center gap-1"
                      style={{
                        padding: '6px 12px',
                        fontSize: '10px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--color-error)',
                        borderRadius: '6px'
                      }}
                    >
                      <Trash2 size={12} /> REMOVE BIKE
                    </button>
                  </div>
                </div>

                {/* Fleet list grid */}
                <div className="grid grid-6">
                  {Array.from({ length: totalBikes }).map((_, index) => {
                    const bikeId = index + 1;
                    const inMaintenance = maintenanceBikes.includes(bikeId);
                    
                    return (
                      <div 
                        key={bikeId}
                        onClick={() => toggleMaintenance(bikeId)}
                        className="p-3 rounded-lg border text-center cursor-pointer flex flex-col justify-between items-center gap-2"
                        style={{
                          backgroundColor: inMaintenance ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255,255,255,0.02)',
                          borderColor: inMaintenance ? 'var(--color-warning)' : 'rgba(255,255,255,0.05)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span className="text-gray-500 font-bold" style={{ fontSize: '9px' }}>BIKE</span>
                        <span className="text-sm font-extrabold text-white">#{bikeId}</span>
                        <span className="font-bold" style={{ 
                          fontSize: '8px', 
                          padding: '1px 4px', 
                          borderRadius: '3px',
                          backgroundColor: inMaintenance ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: inMaintenance ? 'var(--color-warning)' : 'var(--color-success)'
                        }}>
                          {inMaintenance ? 'MAINT' : 'READY'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-gray-500 mt-2" style={{ fontSize: '9px', lineHeight: '1.4' }}>
                  *Admin Tip: Clicking any bike card toggles its 'Maintenance' state. Putting a bike in maintenance instantly lowers the active rental pool capacity. Customers will not be allowed to book slots that exceed the remaining capacity.
                </p>
              </div>

              {/* System Diagnostics & Logs */}
              <div className="flex flex-col gap-6">
                <div className="glass-panel p-6 flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BarChart3 className="text-orange" size={16} />
                    Platform Diagnostics
                  </h3>

                  <div className="flex flex-col gap-4 text-xs">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-gray-400 font-semibold">
                        <span>Active Bike Utilization</span>
                        <span className="text-white font-bold">{stats.occupancyRate}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${Math.min(100, stats.occupancyRate)}%` }}
                        />
                      </div>
                    </div>

                    <div className="border-t-line pt-4 flex flex-col gap-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Bookings Processed</span>
                        <span className="text-white font-bold">{bookings.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Bikes Pool</span>
                        <span className="text-lime font-bold">{stats.activeFleet}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bikes in Shop</span>
                        <span className="text-orange font-bold">{maintenanceBikes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Platform Payout Share</span>
                        <span className="text-white font-bold">
                          ${(stats.totalPlatformFees + stats.totalBikeFees).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Paid to Hosts</span>
                        <span className="text-orange font-bold">${stats.totalHostPayouts.toFixed(2)}</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Booking list overview */}
                <div className="glass-panel p-6 flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white">Global Bookings Log</h3>
                  
                  <div className="flex flex-col gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {bookings.map(b => (
                      <div key={b.id} className="p-3 rounded-lg flex justify-between items-center text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                          <p className="font-bold text-white">{b.customerName}</p>
                          <span className="text-gray-500" style={{ fontSize: '10px' }}>{b.experienceTitle}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lime">${b.totalPaid}</span>
                          <span className="text-gray-500 mt-1" style={{ fontSize: '9px', display: 'block' }}>{b.date} {b.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* BOOKING MODAL & INTERACTIVE CALENDAR */}
      {/* ========================================================================= */}
      {bookingExperience && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in">
            
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <span className="text-orange font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>SECURE BOOKING SYSTEM</span>
                <h3 className="text-base font-bold text-white mt-0.5">{bookingExperience.title}</h3>
              </div>
              <button 
                onClick={() => setBookingExperience(null)}
                className="text-gray-400 hover-opacity cursor-pointer"
                style={{ background: 'transparent', border: 'none' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body flex flex-col gap-6">
              
              {/* Steps indicators */}
              <div className="flex justify-center items-center gap-2 text-xs font-bold border-b-line pb-4">
                <span className="px-2 py-1 rounded" style={{
                  backgroundColor: bookingStep >= 1 ? 'var(--color-purple)' : 'rgba(255,255,255,0.03)',
                  color: bookingStep >= 1 ? '#fff' : 'var(--color-text-secondary)'
                }}>1. RIDE DETAILS</span>
                <ArrowRight size={12} className="text-gray-600" />
                <span className="px-2 py-1 rounded" style={{
                  backgroundColor: bookingStep >= 2 ? 'var(--color-purple)' : 'rgba(255,255,255,0.03)',
                  color: bookingStep >= 2 ? '#fff' : 'var(--color-text-secondary)'
                }}>2. SECURE PAYMENT</span>
                <ArrowRight size={12} className="text-gray-600" />
                <span className="px-2 py-1 rounded" style={{
                  backgroundColor: bookingStep >= 3 ? 'var(--color-purple)' : 'rgba(255,255,255,0.03)',
                  color: bookingStep >= 3 ? '#fff' : 'var(--color-text-secondary)'
                }}>3. CONFIRMATION</span>
              </div>

              {/* STEP 1: Details and Inventory Calendar */}
              {bookingStep === 1 && (
                <div className="grid grid-2">
                  
                  {/* Form fields & calendar selection */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="form-label">Select Booking Date</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min="2026-06-09"
                        max="2026-06-30"
                      />
                    </div>

                    <div className="grid grid-2">
                      <div>
                        <label className="form-label">Select Time Slot</label>
                        <select 
                          className="form-select"
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                        >
                          <option value="">Choose slot...</option>
                          {bookingExperience.timeSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="form-label">Number of Spots</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          min="1" 
                          max={bookingExperience.maxGroupSize}
                          value={bookingSpots}
                          onChange={(e) => setBookingSpots(parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="flex flex-col gap-3 pt-2">
                      <div>
                        <label className="form-label">Full Name</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="John Doe"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label">Email Address</label>
                        <input 
                          type="email" 
                          className="form-input" 
                          placeholder="john@example.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inventory Status Panel */}
                  <div className="flex flex-col gap-4">
                    <div className="p-4 flex flex-col gap-3 text-center" style={{ backgroundColor: '#000c1a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                      <span className="text-xs font-bold text-lime uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>Live Bike Inventory Status</span>
                      
                      {bookingTime ? (
                        (() => {
                          const available = getAvailableBikes(bookingDate, bookingTime);
                          const isOverbooked = bookingSpots > available;
                          
                          return (
                            <div className="flex flex-col gap-3 py-2">
                              <div className="flex flex-col items-center justify-center">
                                <Bike size={32} className={available > 0 ? "text-lime" : "text-red-500"} />
                                <span className="text-2xl font-black mt-2 text-white">{available}</span>
                                <span className="text-gray-500 font-bold" style={{ fontSize: '9px' }}>E-BIKES AVAILABLE</span>
                              </div>

                              <div className="text-xs flex flex-col gap-1">
                                <p className="text-gray-400">For {bookingDate} at {bookingTime}</p>
                                {isOverbooked ? (
                                  <span className="font-bold border" style={{ 
                                    color: 'var(--color-error)', 
                                    backgroundColor: 'rgba(239,68,68,0.1)', 
                                    borderColor: 'rgba(239,68,68,0.2)', 
                                    padding: '6px', 
                                    borderRadius: '4px' 
                                  }}>
                                    Overbooking: Needs {bookingSpots} bikes, only {available} left!
                                  </span>
                                ) : (
                                  <span className="font-bold border text-lime" style={{ 
                                    backgroundColor: 'rgba(191,255,0,0.1)', 
                                    borderColor: 'rgba(191,255,0,0.2)', 
                                    padding: '6px', 
                                    borderRadius: '4px' 
                                  }}>
                                    Inventory Secured ✓
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="py-6 text-gray-500 text-xs flex flex-col items-center justify-center gap-2">
                          <AlertCircle size={20} />
                          <span style={{ lineHeight: '1.4' }}>Please select date, slot, and spots to check inventory availability.</span>
                        </div>
                      )}
                    </div>

                    {/* Quick breakdown preview */}
                    {bookingTime && (
                      <div className="p-4 text-xs flex flex-col gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <span className="font-bold text-white uppercase" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>Cost Breakdown Preview</span>
                        {(() => {
                          const breakdown = calculateRevenue(
                            bookingExperience.price,
                            bookingSpots,
                            bookingExperience.duration,
                            bookingExperience.tier
                          );
                          return (
                            <div className="flex flex-col gap-1 text-gray-400">
                              <div className="flex justify-between">
                                <span>Ticket Price ({bookingSpots} x ${bookingExperience.price})</span>
                                <span className="text-white">${breakdown.ticketRevenue}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Bike Fleet Rental ({bookingSpots} x {bookingExperience.duration} hrs)</span>
                                <span className="text-white">${breakdown.bikeFee}</span>
                              </div>
                              <div className="flex justify-between border-t-line pt-2 font-bold text-white text-sm">
                                <span>Total Paid</span>
                                <span className="text-orange">${breakdown.totalPaid}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* STEP 2: Secure Payment split logic screen */}
              {bookingStep === 2 && (
                <div className="flex flex-col gap-6">
                  
                  {/* Split calculator breakdown card */}
                  <div className="glass-panel p-6 flex flex-col gap-4" style={{ borderLeft: '4px solid var(--color-orange)' }}>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <DollarSign className="text-orange" size={18} />
                      Marketplace Payment Split Breakdown
                    </h4>

                    {(() => {
                      const breakdown = calculateRevenue(
                        bookingExperience.price,
                        bookingSpots,
                        bookingExperience.duration,
                        bookingExperience.tier
                      );
                      return (
                        <div className="flex flex-col gap-4">
                          
                          {/* Top breakdown */}
                          <div className="grid grid-3 pb-4 border-b-line text-center">
                            <div>
                              <span className="text-gray-400 block uppercase" style={{ fontSize: '10px' }}>Rider Pays</span>
                              <span className="text-xl font-black text-white mt-1" style={{ display: 'block' }}>${breakdown.totalPaid.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-orange font-bold block uppercase" style={{ fontSize: '10px' }}>Host Payout ({(bookingExperience.tier === 1 ? 70 : bookingExperience.tier === 2 ? 85 : 100)}%)</span>
                              <span className="text-xl font-black text-orange mt-1" style={{ display: 'block' }}>${breakdown.hostPayout.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-lime font-bold block uppercase" style={{ fontSize: '10px' }}>Platform Share</span>
                              <span className="text-xl font-black text-lime mt-1" style={{ display: 'block' }}>
                                ${(breakdown.platformFee + breakdown.bikeFee).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Specific split itemizations */}
                          <div className="flex flex-col gap-2 text-xs text-gray-400">
                            <div className="flex justify-between">
                              <span>Total Ticket base revenue ({bookingSpots} x ${bookingExperience.price}):</span>
                              <span className="text-white">${breakdown.ticketRevenue.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Platform Commission cut ({bookingExperience.tier === 1 ? '30%' : bookingExperience.tier === 2 ? '15%' : '0%'}):</span>
                              <span className="text-white">${breakdown.platformFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Bike Rental Pool Usage Fee (${bookingExperience.tier === 1 ? 10 : bookingExperience.tier === 2 ? 15 : 20}/hr per e-bike):</span>
                              <span className="text-white">${breakdown.bikeFee.toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <p className="border-t-line pt-2 mt-2 text-gray-500" style={{ fontSize: '9px', lineHeight: '1.4' }}>
                            *Split Payment Security: Stripe will divide the transaction automatically. Host Payout is sent directly to your connected bank account. Platform commission & bike usage fee are routed to the central platform vault.
                          </p>

                        </div>
                      );
                    })()}
                  </div>

                  {/* Simulated credit card forms */}
                  <div className="p-4 rounded-xl flex flex-col gap-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block">Simulate Stripe Checkout</span>
                    
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="form-label">Card Number</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="4242 4242 4242 4242 (Simulated Test Card)"
                          defaultValue="4242424242424242"
                        />
                      </div>

                      <div className="grid grid-2">
                        <div>
                          <label className="form-label">Expiration Date</label>
                          <input type="text" className="form-input" placeholder="MM/YY" defaultValue="12/28" />
                        </div>
                        <div>
                          <label className="form-label">CVC</label>
                          <input type="password" className="form-input" placeholder="•••" defaultValue="123" />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 3: Confirm Booking details */}
              {bookingStep === 3 && (
                <div className="text-center py-6 flex flex-col gap-4">
                  <div className="flex items-center justify-center rounded-circle text-lime" style={{ 
                    padding: '12px', 
                    width: '64px', 
                    height: '64px',
                    margin: '0 auto',
                    backgroundColor: 'rgba(16,185,129,0.1)', 
                    border: '1px solid rgba(16,185,129,0.2)' 
                  }}>
                    <CheckCircle2 size={40} />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-black text-white">Booking Confirmed!</h3>
                    <p className="text-xs text-gray-400" style={{ maxWidth: '380px', margin: '0 auto', lineHeight: '1.6' }}>
                      Thank you! Your electric bike experience is locked. A booking confirmation and calendar invite have been dispatched.
                    </p>
                  </div>

                  {/* Confirmation Table */}
                  <div className="p-4 text-xs flex flex-col gap-2 text-left" style={{ 
                    maxWidth: '400px', 
                    margin: '16px auto 0',
                    backgroundColor: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px' 
                  }}>
                    <div className="flex justify-between border-b-line pb-2">
                      <span className="text-gray-500">Rider:</span>
                      <span className="font-bold text-white">{customerName}</span>
                    </div>
                    <div className="flex justify-between border-b-line pb-2">
                      <span className="text-gray-500">Experience:</span>
                      <span className="font-bold text-white">{bookingExperience.title}</span>
                    </div>
                    <div className="flex justify-between border-b-line pb-2">
                      <span className="text-gray-500">Date/Time:</span>
                      <span className="font-bold text-white">{bookingDate} @ {bookingTime}</span>
                    </div>
                    <div className="flex justify-between border-b-line pb-2">
                      <span className="text-gray-500">Spots Booked:</span>
                      <span className="font-bold text-white">{bookingSpots} Electric Bike(s)</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-gray-500 font-bold">Total Paid:</span>
                      <span className="font-bold text-lime">
                        ${(() => {
                          const breakdown = calculateRevenue(
                            bookingExperience.price,
                            bookingSpots,
                            bookingExperience.duration,
                            bookingExperience.tier
                          );
                          return breakdown.totalPaid.toFixed(2);
                        })()}
                      </span>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer actions */}
            <div className="modal-footer">
              {bookingStep === 1 && (
                <>
                  <button 
                    onClick={() => setBookingExperience(null)}
                    className="btn-outline cursor-pointer"
                    style={{ padding: '8px 16px', fontSize: '11px' }}
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={() => {
                      if (!customerName || !customerEmail || !bookingTime) {
                        alert("Please fill out all rider information and select a time slot.");
                        return;
                      }
                      
                      const available = getAvailableBikes(bookingDate, bookingTime);
                      if (bookingSpots > available) {
                        alert(`Overbooking Error: Only ${available} electric bikes available for this slot.`);
                        return;
                      }

                      setBookingStep(2);
                    }}
                    className="btn-primary-purple cursor-pointer"
                    style={{ padding: '8px 16px', fontSize: '11px' }}
                  >
                    CONTINUE TO CHECKOUT
                    <ArrowRight size={12} />
                  </button>
                </>
              )}

              {bookingStep === 2 && (
                <>
                  <button 
                    onClick={() => setBookingStep(1)}
                    className="btn-outline cursor-pointer"
                    style={{ padding: '8px 16px', fontSize: '11px' }}
                  >
                    BACK
                  </button>
                  <button 
                    onClick={handleConfirmBooking}
                    className="btn-primary-orange cursor-pointer"
                    style={{ padding: '8px 16px', fontSize: '11px' }}
                  >
                    PAY & LOCK INVENTORY
                  </button>
                </>
              )}

              {bookingStep === 3 && (
                <button 
                  onClick={() => setBookingExperience(null)}
                  className="btn-primary-purple cursor-pointer"
                  style={{ padding: '8px 24px', fontSize: '11px' }}
                >
                  DONE
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t-line" style={{ backgroundColor: '#000814', marginTop: 'auto' }}>
        <div className="container grid grid-4">
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-purple text-white font-extrabold text-xs" style={{ padding: '4px 8px', borderRadius: '100px' }}>king</span>
              <span className="text-base font-extrabold text-white" style={{ letterSpacing: '1px' }}>TOURBI</span>
            </div>
            <p className="text-gray-500 text-xs" style={{ lineHeight: '1.6' }}>
              Building unforgettable moments and real connections in DC. Be part of the movement.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-white text-xs" style={{ letterSpacing: '1px' }}>TOP QUALITY E-BIKES</h5>
            <p className="text-gray-500 text-xs" style={{ lineHeight: '1.6' }}>
              Reliable, powerful, and fun to ride. We maintain the highest standards of safety.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-white text-xs" style={{ letterSpacing: '1px' }}>SAFE & RELIABLE</h5>
            <p className="text-gray-500 text-xs" style={{ lineHeight: '1.6' }}>
              Safety first. Always. All trips are monitored and covered by platform policies.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-white text-xs" style={{ letterSpacing: '1px' }}>LOCAL VIBES</h5>
            <p className="text-gray-500 text-xs" style={{ lineHeight: '1.6' }}>
              Real people. Real places. Real memories. Experience the city like a local.
            </p>
          </div>

        </div>

        <div className="container border-t-line" style={{ marginTop: '32px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
          <span>&copy; 2026 TOURBI Technologies Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover-opacity cursor-pointer">Privacy Policy</span>
            <span className="hover-opacity cursor-pointer">Terms of Service</span>
            <span className="hover-opacity cursor-pointer">Support Center</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
