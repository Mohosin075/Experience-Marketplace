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
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  ShoppingBag,
  Wrench,
  TrendingUp,
  Tag
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
    type: "experience", // "experience" | "rental" | "repair"
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
    type: "experience",
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

const INITIAL_MAINTENANCE = [
  { id: 1, bikeId: 5, date: "2026-06-10", reason: "Brake fluid replacement" },
  { id: 2, bikeId: 12, date: "2026-06-11", reason: "Tire tread damage" },
  { id: 3, bikeId: 18, date: "2026-06-10", reason: "Battery diagnostic alert" }
];

const SHOP_PRODUCTS = [
  { id: 1, title: "Tourbi Cruiser S1 E-Bike", price: 1299, image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80", description: "Premium 750W motor electric cruiser with integrated battery and hydraulic disc brakes." },
  { id: 2, title: "Tourbi Pro Helmet", price: 65, image: "https://images.unsplash.com/photo-1557053910-d9eebed02761?w=800&auto=format&fit=crop&q=80", description: "High-protection safety helmet with integrated LED taillight." },
  { id: 3, title: "Tourbi Fast Charger 4A", price: 49, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80", description: "High-speed battery charger compatible with all Tourbi e-bike models." },
  { id: 4, title: "Heavy Duty U-Lock", price: 35, image: "https://images.unsplash.com/photo-1549492423-400259a2e574?w=800&auto=format&fit=crop&q=80", description: "Double-loop hardened steel lock to secure your bike anywhere." }
];

export default function App() {
  // --- STATE ---
  const [activeRole, setActiveRole] = useState('customer'); // 'customer' | 'host' | 'admin'
  const [activeCustomerSubTab, setActiveCustomerSubTab] = useState('explore'); // 'explore' | 'rent' | 'shop' | 'repairs' | 'my-bookings'
  
  // User Profile States
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileSubTab, setProfileSubTab] = useState('info'); // 'info' | 'payment' | 'security'
  const [profileName, setProfileName] = useState("Mohosin Ahmed");
  const [profileEmail, setProfileEmail] = useState("mohosin.ahmed@gmail.com");
  const [profilePhone, setProfilePhone] = useState("+880 1712-345678");
  const [linkedCard, setLinkedCard] = useState("Visa ending in 4242");
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const [experiences, setExperiences] = useState(INITIAL_EXPERIENCES);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Fleet management states
  const [totalBikes, setTotalBikes] = useState(30);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState(INITIAL_MAINTENANCE);

  // Booking Modal State (Experiences)
  const [bookingExperience, setBookingExperience] = useState(null);
  const [bookingDate, setBookingDate] = useState("2026-06-10");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingSpots, setBookingSpots] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [bookingStep, setBookingStep] = useState(1);

  // Direct Rental State
  const [rentDate, setRentDate] = useState("2026-06-10");
  const [rentTime, setRentTime] = useState("10:00");
  const [rentDuration, setRentDuration] = useState(2);
  const [rentBikesCount, setRentBikesCount] = useState(1);
  const [rentCustomerName, setRentCustomerName] = useState("");
  const [rentCustomerEmail, setRentCustomerEmail] = useState("");
  const [rentBookingStep, setRentBookingStep] = useState(0); // 0 = Closed, 1 = Checkout, 2 = Success

  // Shop / Purchase State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shopCheckoutStep, setShopCheckoutStep] = useState(0); // 0 = Closed, 1 = Checkout, 2 = Success
  const [shopName, setShopName] = useState("");
  const [shopEmail, setShopEmail] = useState("");
  const [shopAddress, setShopAddress] = useState("");

  // Repair Scheduling State
  const [repairBikeBrand, setRepairBikeBrand] = useState("Tourbi");
  const [repairServiceType, setRepairServiceType] = useState("Brake Tune-up");
  const [repairDate, setRepairDate] = useState("2026-06-10");
  const [repairTime, setRepairTime] = useState("10:00");
  const [repairNotes, setRepairNotes] = useState("");
  const [repairName, setRepairName] = useState("");
  const [repairEmail, setRepairEmail] = useState("");
  const [repairBookingStep, setRepairBookingStep] = useState(0); // 0 = Closed, 1 = Success

  // Boarding Pass modal
  const [viewingPassBooking, setViewingPassBooking] = useState(null);

  // Host Create Experience Form State
  const [newExpTitle, setNewExpTitle] = useState("");
  const [newExpCategory, setNewExpCategory] = useState("Brunch Rides");
  const [newExpDuration, setNewExpDuration] = useState(2);
  const [newExpPrice, setNewExpPrice] = useState(45);
  const [newExpGroupSize, setNewExpGroupSize] = useState(10);
  const [newExpDescription, setNewExpDescription] = useState("");
  const [newExpTier, setNewExpTier] = useState(1);
  const [newExpTimeSlots, setNewExpTimeSlots] = useState(["10:00", "15:00"]);
  const [hostFormError, setHostFormError] = useState("");

  // Host Dynamic Calculator Sliders
  const [calcPriceSlider, setCalcPriceSlider] = useState(55);
  const [calcBookingsSlider, setCalcBookingsSlider] = useState(25);
  const [calcTierSlider, setCalcTierSlider] = useState(1);

  // Admin New Maintenance state
  const [adminMaintBikeId, setAdminMaintBikeId] = useState("1");
  const [adminMaintDate, setAdminMaintDate] = useState("2026-06-10");
  const [adminMaintReason, setAdminMaintReason] = useState("");

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

  // --- INVENTORY & MAINTENANCE LOCKING UTILITY ---
  const getMaintenanceCountForDate = (dateString) => {
    return maintenanceSchedule.filter(m => m.date === dateString).length;
  };

  const getOccupiedBikes = (date, time) => {
    return bookings
      .filter(b => b.date === date && b.time === time && b.status === "confirmed")
      .reduce((sum, b) => sum + (b.spots || 1), 0);
  };

  const getAvailableBikes = (date, time) => {
    const maintenanceCount = getMaintenanceCountForDate(date);
    const activeFleet = Math.max(0, totalBikes - maintenanceCount);
    const occupied = getOccupiedBikes(date, time);
    return Math.max(0, activeFleet - occupied);
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

    const available = getAvailableBikes(bookingDate, bookingTime);
    if (bookingSpots > available) {
      alert(`Overbooking Error: Only ${available} e-bikes are available for this date and time.`);
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
      type: "experience",
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
    addNotification(`New Booking Confirmed: ${customerName} booked '${bookingExperience.title}' (${bookingSpots} spots) for ${bookingDate} at ${bookingTime}`, "booking");
    setBookingStep(3);
  };

  // Direct Rental Action
  const handleConfirmRental = (e) => {
    e.preventDefault();
    if (!rentCustomerName || !rentCustomerEmail) {
      alert("Please fill all details!");
      return;
    }

    const available = getAvailableBikes(rentDate, rentTime);
    if (rentBikesCount > available) {
      alert(`Overbooking Error: Only ${available} e-bikes left for renting.`);
      return;
    }

    const rentalTotal = rentBikesCount * rentDuration * 15; // flat rate $15/hr
    const newBooking = {
      id: Date.now(),
      type: "rental",
      experienceTitle: `Direct E-Bike Rental (${rentDuration} Hrs)`,
      date: rentDate,
      time: rentTime,
      spots: rentBikesCount,
      customerName: rentCustomerName,
      customerEmail: rentCustomerEmail,
      totalPaid: rentalTotal,
      platformFee: rentalTotal,
      bikeFee: rentalTotal,
      hostPayout: 0,
      status: "confirmed",
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    setBookings(prev => [newBooking, ...prev]);
    addNotification(`New Rental Confirmed: ${rentCustomerName} rented ${rentBikesCount} e-bike(s) for ${rentDuration} hours.`, "system");
    setRentBookingStep(2);
  };

  // Product Purchase Action
  const handleConfirmPurchase = (e) => {
    e.preventDefault();
    if (!shopName || !shopEmail || !shopAddress) {
      alert("Please fill all checkout fields.");
      return;
    }

    addNotification(`Product Ordered: ${shopName} purchased '${selectedProduct.title}' for $${selectedProduct.price}.`, "system");
    setShopCheckoutStep(2);
  };

  // Repair Scheduling Action
  const handleConfirmRepair = (e) => {
    e.preventDefault();
    if (!repairName || !repairEmail || !repairNotes) {
      alert("Please fill out your details and repair description.");
      return;
    }

    const serviceCharge = repairServiceType === "Brake Tune-up" ? 45 
                        : repairServiceType === "Flat Tire Patch" ? 25 
                        : repairServiceType === "Battery Diagnostic" ? 60 
                        : 120;

    const newBooking = {
      id: Date.now(),
      type: "repair",
      experienceTitle: `Certified Repair: ${repairServiceType} (${repairBikeBrand})`,
      date: repairDate,
      time: repairTime,
      spots: 0,
      customerName: repairName,
      customerEmail: repairEmail,
      totalPaid: serviceCharge,
      platformFee: serviceCharge,
      bikeFee: 0,
      hostPayout: 0,
      status: "confirmed",
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    setBookings(prev => [newBooking, ...prev]);
    addNotification(`Repair Scheduled: ${repairName} scheduled a ${repairServiceType} for ${repairDate} at ${repairTime}.`, "system");
    setRepairBookingStep(1);
  };

  const handleCancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (window.confirm(`Are you sure you want to cancel this booking? Your payment will be fully refunded.`)) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      addNotification(`Booking Cancelled: ${booking.customerName} cancelled their slot for '${booking.experienceTitle}'`, "booking");
    }
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
    alert("Experience created successfully!");
  };

  const handleAddBike = () => {
    const newBikeId = totalBikes + 1;
    setTotalBikes(prev => prev + 1);
    addNotification(`Admin added Bike #${newBikeId} to the pool. Total: ${totalBikes + 1}`, "system");
  };

  const handleRemoveBike = () => {
    if (totalBikes <= 1) return;
    setTotalBikes(prev => prev - 1);
    addNotification(`Admin removed Bike #${totalBikes} from the pool. Total: ${totalBikes - 1}`, "system");
  };

  const handleAddMaintenance = (e) => {
    e.preventDefault();
    if (!adminMaintReason) {
      alert("Please describe the maintenance reason.");
      return;
    }

    const bikeIdNum = parseInt(adminMaintBikeId);
    const newMaint = {
      id: Date.now(),
      bikeId: bikeIdNum,
      date: adminMaintDate,
      reason: adminMaintReason
    };

    setMaintenanceSchedule(prev => [...prev, newMaint]);
    addNotification(`Maintenance Scheduled: Bike #${bikeIdNum} is flagged for maintenance on ${adminMaintDate}`, "system");
    setAdminMaintReason("");
  };

  const handleRemoveMaintenance = (id) => {
    const scheduled = maintenanceSchedule.find(m => m.id === id);
    if (!scheduled) return;
    setMaintenanceSchedule(prev => prev.filter(m => m.id !== id));
    addNotification(`Maintenance Cleared: Bike #${scheduled.bikeId} returned to service for ${scheduled.date}`, "system");
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

    const activeBikesToday = Math.max(0, totalBikes - getMaintenanceCountForDate("2026-06-10"));
    const occupancyRate = bookings.filter(b => b.status === "confirmed").length > 0 
      ? ((bookings.filter(b => b.status === "confirmed").reduce((s, b) => s + (b.spots || 0), 0) / (totalBikes * 5)) * 100).toFixed(1)
      : 0;

    return {
      totalRevenue,
      totalPlatformFees,
      totalBikeFees,
      totalHostPayouts,
      activeBikesToday,
      occupancyRate
    };
  }, [bookings, totalBikes, maintenanceSchedule]);

  const filteredExperiences = experiences.filter(exp => 
    categoryFilter === 'All' ? true : exp.category === categoryFilter
  );

  const juneDays = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    return `2026-06-${day < 10 ? '0' + day : day}`;
  });

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

      {/* --- BOARDING PASS MODAL --- */}
      {viewingPassBooking && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="text-base font-bold text-white">Boarding Ticket</h3>
              <button 
                onClick={() => setViewingPassBooking(null)}
                className="text-gray-400 hover-opacity cursor-pointer"
                style={{ background: 'transparent', border: 'none' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body text-center" style={{ padding: '32px 24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #02132a, #0c1938)',
                border: '2px dashed rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'left',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <span className="text-orange font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>TOURBI E-BIKES</span>
                    <h4 className="text-sm font-bold text-white mt-1">{viewingPassBooking.experienceTitle}</h4>
                  </div>
                  <span className="bg-lime text-black font-extrabold" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '9px' }}>BOARDING PASS</span>
                </div>

                <div className="border-t-line pb-4 pt-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '11px' }}>
                  <div>
                    <span className="text-gray-500 block uppercase" style={{ fontSize: '8px' }}>Customer Name</span>
                    <span className="text-white font-bold">{viewingPassBooking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block uppercase" style={{ fontSize: '8px' }}>Ticket ID</span>
                    <span className="text-white font-bold">#TRB-{viewingPassBooking.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block uppercase" style={{ fontSize: '8px' }}>Date & Time</span>
                    <span className="text-white font-bold">{viewingPassBooking.date} @ {viewingPassBooking.time}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block uppercase" style={{ fontSize: '8px' }}>Reserved Inventory</span>
                    <span className="text-white font-bold">{viewingPassBooking.spots > 0 ? `${viewingPassBooking.spots} E-Bike(s)` : 'Personal Bike Repair'}</span>
                  </div>
                </div>

                <div className="border-t-line pt-4 text-center">
                  <div style={{
                    backgroundColor: '#fff',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    width: '120px',
                    height: '120px',
                    backgroundImage: 'url("https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=tourbi-boarding-pass-verification")',
                    backgroundSize: 'cover',
                    margin: '0 auto'
                  }} />
                  <span className="text-gray-500 block mt-2" style={{ fontSize: '8px' }}>SCAN QR CODE AT SERVICE WINDOW</span>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => window.print()}
                  className="btn-outline flex-1"
                >
                  <Printer size={14} /> PRINT PASS
                </button>
                <button 
                  onClick={() => setViewingPassBooking(null)}
                  className="btn-primary-purple flex-1"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="header-wrapper flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveRole('customer'); setActiveCustomerSubTab('explore'); }}>
            <span className="bg-purple text-white font-extrabold text-xs" style={{ padding: '6px 10px', borderRadius: '100px' }}>king</span>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-white" style={{ letterSpacing: '1px' }}>TOURBI</span>
              <span className="text-lime font-bold" style={{ fontSize: '9px', letterSpacing: '2px', marginTop: '-3px' }}>ELECTRIC EXPERIENCES</span>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-xs font-bold" style={{ marginLeft: '16px' }}>
            <span 
              className="hover-opacity cursor-pointer" 
              style={{ color: activeCustomerSubTab === 'rent' ? 'var(--color-lime)' : 'var(--color-text-secondary)' }}
              onClick={() => { setActiveRole('customer'); setActiveCustomerSubTab('rent'); }}
            >
              RENT
            </span>
            <span 
              className="hover-opacity cursor-pointer" 
              style={{ color: activeCustomerSubTab === 'shop' ? 'var(--color-lime)' : 'var(--color-text-secondary)' }}
              onClick={() => { setActiveRole('customer'); setActiveCustomerSubTab('shop'); }}
            >
              SHOP
            </span>
            <span 
              className="hover-opacity cursor-pointer" 
              style={{ color: activeCustomerSubTab === 'repairs' ? 'var(--color-lime)' : 'var(--color-text-secondary)' }}
              onClick={() => { setActiveRole('customer'); setActiveCustomerSubTab('repairs'); }}
            >
              REPAIRS
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1 p-1" style={{ backgroundColor: '#02132a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}>
            <button 
              onClick={() => {
                setActiveRole('customer');
                setActiveCustomerSubTab('explore');
              }} 
              className="cursor-pointer"
              style={{
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '800',
                transition: 'all 0.2s',
                backgroundColor: (activeRole === 'customer' && (activeCustomerSubTab === 'explore' || activeCustomerSubTab === 'my-bookings')) ? 'var(--color-purple)' : 'transparent',
                color: (activeRole === 'customer' && (activeCustomerSubTab === 'explore' || activeCustomerSubTab === 'my-bookings')) ? '#fff' : 'var(--color-text-secondary)'
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

          {/* --- USER PROFILE dropdown --- */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 cursor-pointer hover-opacity"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#fff'
              }}
            >
              <div 
                className="rounded-circle font-black text-black flex items-center justify-center bg-lime"
                style={{ width: '24px', height: '24px', fontSize: '10px' }}
              >
                {profileName.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-xs font-bold text-white hidden-mobile" style={{ display: 'inline-block' }}>{profileName}</span>
            </button>

            {showProfileDropdown && (
              <div 
                className="glass-panel animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '42px',
                  right: '0',
                  width: '240px',
                  zIndex: '1000',
                  padding: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'linear-gradient(135deg, #001226, #020c17)'
                }}
              >
                <div className="pb-3 border-b-line mb-2 text-left">
                  <span className="text-gray-400 font-bold uppercase" style={{ fontSize: '8px', letterSpacing: '0.5px' }}>Current Role</span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    {activeRole === 'admin' ? '🛡️ System Admin' : activeRole === 'host' ? '⚡ Experience Host' : '🚲 Tour Rider'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setProfileSubTab('info');
                      setProfileModalOpen(true);
                    }}
                    className="text-left py-2 px-3 rounded-lg hover-bg text-xs text-gray-300 font-bold w-full cursor-pointer flex items-center gap-2"
                    style={{ background: 'none', border: 'none' }}
                  >
                    <User size={14} className="text-lime" /> Profile Settings
                  </button>
                  
                  <button 
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setProfileSubTab('payment');
                      setProfileModalOpen(true);
                    }}
                    className="text-left py-2 px-3 rounded-lg hover-bg text-xs text-gray-300 font-bold w-full cursor-pointer flex items-center gap-2"
                    style={{ background: 'none', border: 'none' }}
                  >
                    <DollarSign size={14} className="text-orange" /> Payment Methods
                  </button>

                  <button 
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setProfileSubTab('security');
                      setProfileModalOpen(true);
                    }}
                    className="text-left py-2 px-3 rounded-lg hover-bg text-xs text-gray-300 font-bold w-full cursor-pointer flex items-center gap-2"
                    style={{ background: 'none', border: 'none' }}
                  >
                    <Shield size={14} className="text-purple" /> Password & Security
                  </button>

                  <button 
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setActiveRole('customer');
                      setActiveCustomerSubTab('my-bookings');
                    }}
                    className="text-left py-2 px-3 rounded-lg hover-bg text-xs text-gray-300 font-bold w-full cursor-pointer flex items-center gap-2"
                    style={{ background: 'none', border: 'none' }}
                  >
                    <CalendarCheck size={14} className="text-lime" /> My Bookings & Tickets
                  </button>

                  <div className="border-t-line my-2" />

                  <button 
                    onClick={() => {
                      setShowProfileDropdown(false);
                      if (confirm("Are you sure you want to log out of this session?")) {
                        setActiveRole('customer');
                        setActiveCustomerSubTab('explore');
                        addNotification("Logged out successfully.", "system");
                      }
                    }}
                    className="text-left py-2 px-3 rounded-lg hover-bg text-xs font-bold w-full cursor-pointer text-red-400 flex items-center gap-2"
                    style={{ background: 'none', border: 'none' }}
                  >
                    <X size={14} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      {activeRole === 'customer' && activeCustomerSubTab === 'explore' && (
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
                The most innovative touring platform for electric bikes. Book city-wide rides and explore beautiful monument loops with centralized inventory locking.
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
                  <span className="text-xs text-lime font-bold uppercase" style={{ letterSpacing: '1px', display: 'block' }}>Available Today</span>
                  <h4 className="text-base font-bold text-white mt-1">{stats.activeBikesToday} E-Bikes Active</h4>
                </div>
                <span className="rounded-circle bg-lime" style={{ width: '8px', height: '8px', display: 'inline-block', boxShadow: '0 0 10px var(--color-lime)' }} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- MAIN BODY --- */}
      <main className="flex-1 container py-10">

        {/* ========================================================================= */}
        {/* CUSTOMER PORTAL */}
        {/* ========================================================================= */}
        {activeRole === 'customer' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            
            {/* Sub-tab navigation */}
            <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <button 
                onClick={() => setActiveCustomerSubTab('explore')}
                className="btn-tab cursor-pointer"
                style={{
                  color: activeCustomerSubTab === 'explore' ? '#fff' : 'var(--color-text-secondary)',
                  borderBottom: activeCustomerSubTab === 'explore' ? '2px solid var(--color-purple)' : 'none',
                  borderRadius: '0',
                  padding: '8px 4px',
                  background: 'none'
                }}
              >
                Experience Marketplace
              </button>
              <button 
                onClick={() => setActiveCustomerSubTab('rent')}
                className="btn-tab cursor-pointer"
                style={{
                  color: activeCustomerSubTab === 'rent' ? '#fff' : 'var(--color-text-secondary)',
                  borderBottom: activeCustomerSubTab === 'rent' ? '2px solid var(--color-purple)' : 'none',
                  borderRadius: '0',
                  padding: '8px 4px',
                  background: 'none'
                }}
              >
                Direct Bike Rentals
              </button>
              <button 
                onClick={() => setActiveCustomerSubTab('shop')}
                className="btn-tab cursor-pointer"
                style={{
                  color: activeCustomerSubTab === 'shop' ? '#fff' : 'var(--color-text-secondary)',
                  borderBottom: activeCustomerSubTab === 'shop' ? '2px solid var(--color-purple)' : 'none',
                  borderRadius: '0',
                  padding: '8px 4px',
                  background: 'none'
                }}
              >
                E-Bike Store
              </button>
              <button 
                onClick={() => setActiveCustomerSubTab('repairs')}
                className="btn-tab cursor-pointer"
                style={{
                  color: activeCustomerSubTab === 'repairs' ? '#fff' : 'var(--color-text-secondary)',
                  borderBottom: activeCustomerSubTab === 'repairs' ? '2px solid var(--color-purple)' : 'none',
                  borderRadius: '0',
                  padding: '8px 4px',
                  background: 'none'
                }}
              >
                Repair Services
              </button>
              <button 
                onClick={() => setActiveCustomerSubTab('my-bookings')}
                className="btn-tab cursor-pointer"
                style={{
                  color: activeCustomerSubTab === 'my-bookings' ? '#fff' : 'var(--color-text-secondary)',
                  borderBottom: activeCustomerSubTab === 'my-bookings' ? '2px solid var(--color-purple)' : 'none',
                  borderRadius: '0',
                  padding: '8px 4px',
                  background: 'none'
                }}
              >
                My Bookings & Tickets
              </button>
            </div>

            {/* SUBTAB 1: Explore Grid */}
            {activeCustomerSubTab === 'explore' && (
              <div id="experiences-explore" className="flex flex-col gap-6">
                <div className="flex justify-between items-center gap-4 pb-6 border-b-line flex-wrap">
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">TWO WAYS TO EXPERIENCE</h2>
                    <p className="text-gray-400 text-xs mt-1">Browse tours below, sync your calendar, and lock bike allocations instantly.</p>
                  </div>

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

                <div className="grid grid-3">
                  {filteredExperiences.map(exp => (
                    <div key={exp.id} className="glass-panel exp-card">
                      <div className="exp-card-img-container">
                        <img src={exp.image} alt={exp.title} />
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

                          <div className="flex justify-between items-center pt-2">
                            <div>
                              <span className="text-gray-500" style={{ display: 'block', fontSize: '9px', fontWeight: '800' }}>PRICE PER SPOT</span>
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
              </div>
            )}

            {/* SUBTAB 2: Direct Rentals (Interactive) */}
            {activeCustomerSubTab === 'rent' && (
              <div className="grid grid-2">
                
                {/* Form parameters */}
                <div className="glass-panel p-6 flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Direct E-Bike Rentals</h2>
                    <p className="text-gray-400 text-xs mt-1">Rent professional electric bikes by the hour from our central fleet pool.</p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); setRentBookingStep(1); }} className="flex flex-col gap-4">
                    <div className="grid grid-2">
                      <div>
                        <label className="form-label">Rental Date</label>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={rentDate} 
                          onChange={(e) => setRentDate(e.target.value)}
                          min="2026-06-10"
                        />
                      </div>
                      <div>
                        <label className="form-label">Start Time</label>
                        <select className="form-select" value={rentTime} onChange={(e) => setRentTime(e.target.value)}>
                          {["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-2">
                      <div>
                        <label className="form-label">Duration (Hours)</label>
                        <select className="form-select" value={rentDuration} onChange={(e) => setRentDuration(parseInt(e.target.value))}>
                          {[1, 2, 3, 4, 6, 8].map(h => (
                            <option key={h} value={h}>{h} Hour{h > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Quantity (Bikes)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          min="1" 
                          max="10" 
                          value={rentBikesCount} 
                          onChange={(e) => setRentBikesCount(parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>

                    {/* Customer info fields */}
                    <div>
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="John Doe" 
                        value={rentCustomerName} 
                        onChange={(e) => setRentCustomerName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="john@example.com" 
                        value={rentCustomerEmail} 
                        onChange={(e) => setRentCustomerEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="calc-card p-4 rounded-xl flex flex-col gap-2 mt-2">
                      <span className="text-gray-500 font-bold uppercase" style={{ fontSize: '9px' }}>Rental Pricing Summary</span>
                      <div className="flex justify-between text-xs">
                        <span>Base Rate:</span>
                        <span className="text-white">$15.00 / hour</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Total Calculation:</span>
                        <span className="text-white">{rentBikesCount} bike(s) × {rentDuration} hour(s)</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-white border-t-line pt-2 mt-2">
                        <span>Total Cost:</span>
                        <span className="text-lime">${rentBikesCount * rentDuration * 15}</span>
                      </div>
                    </div>

                    <button type="submit" className="btn-primary-purple py-3 font-bold mt-2">
                      CONTINUE TO PAYMENT
                    </button>
                  </form>
                </div>

                {/* Right Column: Fleet occupancy visualizer */}
                <div className="flex flex-col gap-6">
                  <div className="glass-panel p-6 text-center flex flex-col gap-4">
                    <h3 className="text-base font-bold text-white">Live Central Fleet Check</h3>
                    <p className="text-gray-500 text-xs">Verify if e-bikes are available for direct checkout.</p>
                    
                    {(() => {
                      const av = getAvailableBikes(rentDate, rentTime);
                      const isOver = rentBikesCount > av;
                      return (
                        <div className="flex flex-col items-center gap-3 py-4">
                          <Bike size={48} className={isOver ? "text-red-500" : "text-lime"} />
                          <div className="mt-2">
                            <span className="text-3xl font-black text-white">{av}</span>
                            <span className="text-xs text-gray-500 block uppercase font-bold mt-1">E-Bikes Free Today</span>
                          </div>

                          {isOver ? (
                            <span className="p-2 border text-red-500 font-bold text-xs rounded-lg bg-red-900 bg-opacity-20 border-red-500">
                              Selected {rentBikesCount} exceeds remaining available pool size ({av}).
                            </span>
                          ) : (
                            <span className="p-2 border text-lime font-bold text-xs rounded-lg bg-emerald-950 bg-opacity-20 border-emerald-800">
                              Available slots secured ✓
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>
            )}

            {/* SUBTAB 3: E-Bike Store (Interactive) */}
            {activeCustomerSubTab === 'shop' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Tourbi E-Bike Store</h2>
                  <p className="text-gray-400 text-xs mt-1">Purchase premium brand electric cruisers and certified accessories.</p>
                </div>

                <div className="grid grid-4">
                  {SHOP_PRODUCTS.map(p => (
                    <div key={p.id} className="glass-panel p-4 flex flex-col justify-between gap-4">
                      <img src={p.image} className="w-full h-40 rounded-lg" style={{ objectFit: 'cover' }} />
                      <div>
                        <span className="text-xs font-bold text-lime uppercase" style={{ fontSize: '9px' }}>Tourbi Shop</span>
                        <h3 className="text-sm font-bold text-white mt-1">{p.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{p.description}</p>
                      </div>
                      <div className="flex justify-between items-center border-t-line pt-3 mt-1">
                        <span className="text-base font-black text-white">${p.price}</span>
                        <button 
                          onClick={() => {
                            setSelectedProduct(p);
                            setShopCheckoutStep(1);
                            setShopName("");
                            setShopEmail("");
                            setShopAddress("");
                          }}
                          className="btn-primary-orange py-1 px-3 text-xs"
                        >
                          BUY NOW
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 4: Repair Services (Interactive) */}
            {activeCustomerSubTab === 'repairs' && (
              <div className="grid grid-2">
                
                {/* Form repair parameters */}
                <div className="glass-panel p-6 flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Certified Repair Service</h2>
                    <p className="text-gray-400 text-xs mt-1">Book repair appointments for your personal e-bike at our workshop.</p>
                  </div>

                  <form onSubmit={handleConfirmRepair} className="flex flex-col gap-4">
                    <div className="grid grid-2">
                      <div>
                        <label className="form-label">Bike Manufacturer</label>
                        <select className="form-select" value={repairBikeBrand} onChange={(e) => setRepairBikeBrand(e.target.value)}>
                          {["Tourbi", "Rad Power", "Lectric", "Aventon", "Super73", "Other"].map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Service Type</label>
                        <select className="form-select" value={repairServiceType} onChange={(e) => setRepairServiceType(e.target.value)}>
                          <option value="Brake Tune-up">Brake Tune-up ($45)</option>
                          <option value="Flat Tire Patch">Flat Tire Patch ($25)</option>
                          <option value="Battery Diagnostic">Battery Diagnostic ($60)</option>
                          <option value="Full Overhaul">Full Overhaul ($120)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-2">
                      <div>
                        <label className="form-label">Preferred Date</label>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={repairDate} 
                          onChange={(e) => setRepairDate(e.target.value)}
                          min="2026-06-10"
                        />
                      </div>
                      <div>
                        <label className="form-label">Time Slot</label>
                        <select className="form-select" value={repairTime} onChange={(e) => setRepairTime(e.target.value)}>
                          {["09:00", "11:00", "13:00", "15:00", "17:00"].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Describe Bike Issues</label>
                      <textarea 
                        className="form-textarea" 
                        rows="3" 
                        placeholder="Please describe issue (e.g. rear brakes squeaking, throttle not engaging...)"
                        value={repairNotes}
                        onChange={(e) => setRepairNotes(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-2">
                      <div>
                        <label className="form-label">Full Name</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={repairName} 
                          onChange={(e) => setRepairName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Email Address</label>
                        <input 
                          type="email" 
                          className="form-input" 
                          value={repairEmail} 
                          onChange={(e) => setRepairEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary-orange py-3 font-bold mt-2">
                      BOOK WORKSHOP APPOINTMENT
                    </button>
                  </form>
                </div>

                {/* Right column placeholder visuals */}
                <div className="glass-panel p-6 flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Wrench className="text-orange" size={18} />
                    Certified Repair Standards
                  </h3>
                  <div className="flex flex-col gap-4 mt-2">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="font-bold text-white block text-xs">1. Expert Mechanics</span>
                      <span className="text-gray-400 text-xs block mt-1">All repairs are executed by trained mechanics specializing in electric batteries and hub motors.</span>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="font-bold text-white block text-xs">2. Fast turnaround</span>
                      <span className="text-gray-400 text-xs block mt-1">Minor repairs (tires, brake adjustments) are finished within 2 hours of check-in.</span>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="font-bold text-white block text-xs">3. Centralized tracking</span>
                      <span className="text-gray-400 text-xs block mt-1">Review status updates and download workshop boarding passes in the Rider Portal.</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* SUBTAB 5: My Bookings & Tickets */}
            {activeCustomerSubTab === 'my-bookings' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-xl font-extrabold text-white">My Ride Boarding Passes & Appointments</h2>
                  <p className="text-gray-400 text-xs mt-1">Access your boarding passes, verify active rentals, or check repair slots.</p>
                </div>

                {bookings.filter(b => b.status !== 'cancelled').length === 0 ? (
                  <div className="glass-panel p-8 text-center text-gray-500 flex flex-col gap-2 items-center">
                    <CalendarCheck size={36} />
                    <span>No active boarding tickets found. Book a tour, rent a bike, or schedule repairs.</span>
                  </div>
                ) : (
                  <div className="grid grid-2">
                    {bookings.filter(b => b.status !== 'cancelled').map(b => (
                      <div key={b.id} className="glass-panel p-6 flex flex-col justify-between gap-4 border-l-4 border-l-purple">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-orange font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>
                              {b.type === "rental" ? "Direct Rental" : b.type === "repair" ? "Workshop" : "Experience Ticket"}
                            </span>
                            <h3 className="text-base font-bold text-white mt-1">{b.experienceTitle}</h3>
                          </div>
                          <span className="text-lime font-bold uppercase" style={{ 
                            fontSize: '8px', 
                            padding: '2px 6px', 
                            backgroundColor: 'rgba(16,185,129,0.1)', 
                            border: '1px solid rgba(16,185,129,0.3)', 
                            borderRadius: '4px' 
                          }}>
                            Active
                          </span>
                        </div>

                        <div className="grid grid-2 text-xs text-gray-400 border-t-line border-b-line py-3">
                          <div>Ticket Ref: <span className="text-white font-bold">#TRB-{b.id}</span></div>
                          <div>Spots Reserved: <span className="text-white font-bold">{b.spots > 0 ? `${b.spots} E-Bike(s)` : 'Personal Bike Repair'}</span></div>
                          <div>Departure/Slot: <span className="text-white font-bold">{b.date} @ {b.time}</span></div>
                          <div>Total Charged: <span className="text-white font-bold">${b.totalPaid}</span></div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => setViewingPassBooking(b)}
                            className="btn-primary-purple flex-1 py-2 text-xs"
                          >
                            VIEW BOARDING PASS
                          </button>
                          <button 
                            onClick={() => handleCancelBooking(b.id)}
                            className="btn-outline py-2 text-xs"
                            style={{ color: 'var(--color-error)' }}
                          >
                            CANCEL APPOINTMENT
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* HOST PORTAL */}
        {/* ========================================================================= */}
        {activeRole === 'host' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            
            {/* Host Banner */}
            <div className="glass-panel p-6 flex justify-between items-center gap-4 flex-wrap" style={{ background: 'linear-gradient(to right, #0d122b, #1a1226)' }}>
              <div>
                <span className="text-xs text-orange font-bold uppercase" style={{ letterSpacing: '1px' }}>Host Panel</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Welcome back, Demo Host!</h2>
                <p className="text-gray-400 text-xs mt-1">Design bike tours, simulate your projected earnings, and check payouts.</p>
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

            {/* Interactive Calculator Slider */}
            <div className="glass-panel p-6 flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="text-lime" size={16} />
                  Interactive Monthly Revenue Projector
                </h3>
                <p className="text-gray-500 text-xs mt-1">Adjust the sliders to simulate expected monthly profits and splits.</p>
              </div>

              <div className="grid grid-3" style={{ gap: '24px' }}>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="form-label flex justify-between">
                      <span>Ticket Price ($)</span>
                      <span className="text-white font-bold">${calcPriceSlider}</span>
                    </label>
                    <input 
                      type="range" 
                      min="15" 
                      max="150" 
                      value={calcPriceSlider} 
                      onChange={(e) => setCalcPriceSlider(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--color-orange)' }}
                    />
                  </div>

                  <div>
                    <label className="form-label flex justify-between">
                      <span>Spots Booked / Month</span>
                      <span className="text-white font-bold">{calcBookingsSlider} spots</span>
                    </label>
                    <input 
                      type="range" 
                      min="5" 
                      max="200" 
                      value={calcBookingsSlider} 
                      onChange={(e) => setCalcBookingsSlider(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--color-orange)' }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="form-label">Select Projector Tier</label>
                  <div className="flex flex-col gap-2">
                    {[1, 2, 3].map(t => (
                      <div 
                        key={t}
                        onClick={() => setCalcTierSlider(t)}
                        className="p-2 rounded-lg border cursor-pointer text-xs flex justify-between items-center"
                        style={{
                          backgroundColor: calcTierSlider === t ? 'rgba(79,70,229,0.12)' : 'rgba(1,18,38,0.5)',
                          borderColor: calcTierSlider === t ? 'var(--color-purple)' : 'rgba(255,255,255,0.05)'
                        }}
                      >
                        <span className="font-bold text-white">Tier {t}</span>
                        <span style={{ color: t === 3 ? 'var(--color-orange)' : t === 2 ? 'var(--color-lime)' : '#818cf8' }}>
                          {t === 1 ? '70% host / $10 fee' : t === 2 ? '85% host / $15 fee' : '100% host / $20 fee'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl flex flex-col justify-between" style={{ backgroundColor: '#000c1a', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {(() => {
                    const duration = 2.0;
                    const calc = calculateRevenue(calcPriceSlider, calcBookingsSlider, duration, calcTierSlider);
                    return (
                      <div className="flex flex-col gap-2">
                        <span className="text-gray-500 font-bold uppercase" style={{ fontSize: '9px' }}>Estimated Monthly Breakdown</span>
                        <div className="flex justify-between text-xs">
                          <span>Total Ticket Sales:</span>
                          <span className="text-white">${calc.ticketRevenue.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Est. Platform Comm:</span>
                          <span className="text-white">${calc.platformFee.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Est. Bike Usage Fees:</span>
                          <span className="text-white">${calc.bikeFee.toFixed(0)}</span>
                        </div>
                        <div className="border-t-line pt-2 mt-2 flex justify-between items-baseline">
                          <span className="text-orange font-bold text-xs">Net Host Earnings:</span>
                          <span className="text-lg font-black text-orange">${calc.hostPayout.toFixed(0)}</span>
                        </div>
                      </div>
                    );
                  })()}
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

                  <div className="p-4 rounded-xl flex flex-col gap-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <label className="form-label">Select Revenue Tier</label>
                    <div className="grid grid-3">
                      {[1, 2, 3].map(tierNum => (
                        <div 
                          key={tierNum}
                          onClick={() => setNewExpTier(tierNum)}
                          className="p-3 rounded-lg border cursor-pointer text-center"
                          style={{
                            backgroundColor: newExpTier === tierNum ? 'rgba(79,70,229,0.12)' : 'rgba(1,18,38,0.5)',
                            borderColor: newExpTier === tierNum ? 'var(--color-purple)' : 'rgba(255,255,255,0.05)'
                          }}
                        >
                          <span className="text-xs font-bold text-white" style={{ display: 'block' }}>Tier {tierNum}</span>
                          <span className="text-xs font-bold mt-1" style={{ 
                            color: tierNum === 3 ? 'var(--color-orange)' : tierNum === 2 ? 'var(--color-lime)' : '#818cf8', 
                            display: 'block', 
                            fontSize: '10px' 
                          }}>
                            {tierNum === 1 ? 'Host 70%' : tierNum === 2 ? 'Host 85%' : 'Host 100%'}
                          </span>
                          <span className="text-gray-500 mt-1" style={{ display: 'block', fontSize: '9px' }}>
                            ${tierNum === 1 ? '10' : tierNum === 2 ? '15' : '20'}/bike/hr
                          </span>
                        </div>
                      ))}
                    </div>

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
                    </div>
                  </div>

                  <button type="submit" className="w-full btn-primary-orange font-bold py-3 mt-2" style={{ fontSize: '12px' }}>
                    PUBLISH EXPERIENCE
                  </button>
                </form>
              </div>

              {/* Host list & active bookings */}
              <div className="flex flex-col gap-6">
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

                <div className="glass-panel p-6 flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white">Bookings Log</h3>
                  <div className="flex flex-col gap-3">
                    {bookings.filter(b => b.type === "experience").map(b => (
                      <div key={b.id} className="p-4 rounded-lg flex flex-col gap-2" style={{ 
                        backgroundColor: 'rgba(255,255,255,0.02)', 
                        border: '1px solid rgba(255,255,255,0.05)',
                        opacity: b.status === 'cancelled' ? '0.4' : '1' 
                      }}>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-orange font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>Booking ID #{b.id}</span>
                            <h4 className="text-xs font-bold text-white mt-0.5">{b.experienceTitle}</h4>
                          </div>
                          <span className="font-bold uppercase" style={{ 
                            fontSize: '8px', 
                            padding: '2px 6px', 
                            backgroundColor: b.status === 'cancelled' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', 
                            border: b.status === 'cancelled' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(16,185,129,0.3)', 
                            color: b.status === 'cancelled' ? 'var(--color-error)' : 'var(--color-success)',
                            borderRadius: '4px' 
                          }}>
                            {b.status.toUpperCase()}
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
                <span className="text-gray-400 font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>ACTIVE FLEET TODAY</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-white">{stats.activeBikesToday}</span>
                  <span className="text-gray-400" style={{ fontSize: '9px' }}>/ {totalBikes} total</span>
                </div>
              </div>
            </div>

            <div className="grid grid-2">
              <div className="flex flex-col gap-6">
                <div className="glass-panel p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center pb-4 border-b-line flex-wrap gap-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Bike className="text-lime" size={18} />
                        Central Bike Fleet
                      </h3>
                      <p className="text-gray-500 text-xs mt-1">Add or remove physical e-bikes to increase platform booking capacity.</p>
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

                  <div className="grid grid-6">
                    {Array.from({ length: totalBikes }).map((_, index) => {
                      const bikeId = index + 1;
                      const hasMaintToday = maintenanceSchedule.some(m => m.bikeId === bikeId && m.date === "2026-06-10");
                      
                      return (
                        <div 
                          key={bikeId}
                          className="p-3 rounded-lg border text-center flex flex-col justify-between items-center gap-2"
                          style={{
                            backgroundColor: hasMaintToday ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255,255,255,0.02)',
                            borderColor: hasMaintToday ? 'var(--color-warning)' : 'rgba(255,255,255,0.05)',
                            transition: 'all 0.2s'
                          }}
                        >
                          <span className="text-gray-500 font-bold" style={{ fontSize: '9px' }}>BIKE</span>
                          <span className="text-sm font-extrabold text-white">#{bikeId}</span>
                          <span className="font-bold" style={{ 
                            fontSize: '8px', 
                            padding: '1px 4px', 
                            borderRadius: '3px',
                            backgroundColor: hasMaintToday ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: hasMaintToday ? 'var(--color-warning)' : 'var(--color-success)'
                          }}>
                            {hasMaintToday ? 'MAINT' : 'READY'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-panel p-6 flex flex-col gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <CalendarIcon className="text-orange" size={18} />
                      Lock Maintenance Schedules (By Date)
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">Mark individual e-bikes for maintenance on specific dates. These bikes are locked out of customer booking lists automatically.</p>
                  </div>

                  <form onSubmit={handleAddMaintenance} className="grid grid-3" style={{ gap: '16px', alignItems: 'end' }}>
                    <div>
                      <label className="form-label">Bike ID</label>
                      <select 
                        className="form-select"
                        value={adminMaintBikeId}
                        onChange={(e) => setAdminMaintBikeId(e.target.value)}
                      >
                        {Array.from({ length: totalBikes }).map((_, i) => (
                          <option key={i+1} value={i+1}>Bike #{i+1}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Lock Date</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={adminMaintDate}
                        onChange={(e) => setAdminMaintDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <button type="submit" className="btn-primary-orange w-full" style={{ padding: '10px' }}>
                        LOCK BIKE
                      </button>
                    </div>
                  </form>

                  <div className="flex flex-col gap-2 mt-4" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                    <span className="text-gray-500 font-bold uppercase" style={{ fontSize: '9px' }}>Current Scheduled Lockouts</span>
                    {maintenanceSchedule.map(m => (
                      <div key={m.id} className="p-3 rounded-lg flex justify-between items-center text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                          <span className="font-bold text-white">Bike #{m.bikeId}</span>
                          <span className="text-gray-500" style={{ marginLeft: '8px' }}>on {m.date}</span>
                        </div>
                        <button 
                          onClick={() => handleRemoveMaintenance(m.id)}
                          className="cursor-pointer font-bold"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-error)',
                            fontSize: '10px'
                          }}
                        >
                          RELEASE
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Analytics */}
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
                        <span className="text-gray-400">Total Bookings (All time)</span>
                        <span className="text-white font-bold">{bookings.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Bookings Today</span>
                        <span className="text-white font-bold">
                          {bookings.filter(b => b.date === "2026-06-10" && b.status === "confirmed").length}
                        </span>
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

                <div className="glass-panel p-6 flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white">Global Bookings Log</h3>
                  <div className="flex flex-col gap-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {bookings.map(b => (
                      <div key={b.id} className="p-3 rounded-lg flex justify-between items-center text-xs" style={{ 
                        backgroundColor: 'rgba(255,255,255,0.02)', 
                        border: '1px solid rgba(255,255,255,0.05)',
                        opacity: b.status === 'cancelled' ? '0.4' : '1'
                      }}>
                        <div>
                          <p className="font-bold text-white">{b.customerName}</p>
                          <span className="text-gray-500" style={{ fontSize: '10px' }}>{b.experienceTitle} {b.spots > 0 ? `(${b.spots} spots)` : ''}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lime" style={{ textDecoration: b.status === 'cancelled' ? 'line-through' : 'none' }}>
                            ${b.totalPaid}
                          </span>
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
      {/* DIRECT RENTAL CHECKOUT MODAL */}
      {/* ========================================================================= */}
      {rentBookingStep === 1 && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="text-base font-bold text-white">E-Bike Rental Checkout</h3>
              <button onClick={() => setRentBookingStep(0)} className="text-gray-400 hover-opacity" style={{ background: 'transparent', border: 'none' }}><X size={18} /></button>
            </div>

            <div className="modal-body flex flex-col gap-4">
              <div className="calc-card p-4 rounded-xl flex flex-col gap-2">
                <span className="text-orange font-bold uppercase" style={{ fontSize: '9px' }}>Platform Direct Rental Invoice</span>
                <div className="flex justify-between text-xs">
                  <span>E-Bikes:</span>
                  <span className="text-white">{rentBikesCount} Bike(s)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Schedule:</span>
                  <span className="text-white">{rentDate} at {rentTime}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Duration:</span>
                  <span className="text-white">{rentDuration} hour(s)</span>
                </div>
                <div className="border-t-line pt-2 mt-2 flex justify-between font-bold text-white">
                  <span>Total Bill (Rider Pays):</span>
                  <span className="text-lime">${rentBikesCount * rentDuration * 15}</span>
                </div>
              </div>

              {/* Simulated Card checkout */}
              <div className="p-4 rounded-xl flex flex-col gap-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-xs font-bold text-gray-400 uppercase">Stripe Checkout Simulator</span>
                <div>
                  <label className="form-label">Card Number</label>
                  <input type="text" className="form-input" defaultValue="4242424242424242" />
                </div>
                <div className="grid grid-2">
                  <div>
                    <label className="form-label">Expiry</label>
                    <input type="text" className="form-input" defaultValue="12/28" />
                  </div>
                  <div>
                    <label className="form-label">CVC</label>
                    <input type="password" className="form-input" defaultValue="123" />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setRentBookingStep(0)} className="btn-outline">CANCEL</button>
              <button onClick={handleConfirmRental} className="btn-primary-purple">CONFIRM & RENT</button>
            </div>
          </div>
        </div>
      )}

      {/* RENTAL SUCCESS MODAL */}
      {rentBookingStep === 2 && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="modal-body py-6 flex flex-col gap-4">
              <div className="flex items-center justify-center rounded-circle text-lime" style={{ 
                padding: '12px', width: '64px', height: '64px', margin: '0 auto',
                backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' 
              }}>
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Rental Reserved!</h3>
                <p className="text-xs text-gray-400 mt-2">Your electric bikes are locked and prepared. Grab your passes in **My Bookings**.</p>
              </div>
              <button 
                onClick={() => { setRentBookingStep(0); setActiveCustomerSubTab('my-bookings'); }} 
                className="btn-primary-purple w-full mt-4"
              >
                GO TO MY TICKETS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRODUCT CHECKOUT MODAL */}
      {/* ========================================================================= */}
      {shopCheckoutStep === 1 && selectedProduct && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="text-base font-bold text-white">Product Checkout</h3>
              <button onClick={() => setShopCheckoutStep(0)} className="text-gray-400 hover-opacity" style={{ background: 'transparent', border: 'none' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleConfirmPurchase} className="modal-body flex flex-col gap-4">
              <div className="p-3 rounded-lg flex gap-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <img src={selectedProduct.image} className="w-16 h-16 rounded" style={{ objectFit: 'cover' }} />
                <div>
                  <h4 className="text-xs font-bold text-white">{selectedProduct.title}</h4>
                  <span className="text-lime font-black text-sm block mt-1">${selectedProduct.price}</span>
                </div>
              </div>

              <div>
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" value={shopName} onChange={(e) => setShopName(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={shopEmail} onChange={(e) => setShopEmail(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Delivery Address</label>
                <input type="text" className="form-input" placeholder="123 Main St, Washington DC" value={shopAddress} onChange={(e) => setShopAddress(e.target.value)} required />
              </div>

              <div className="p-4 rounded-xl flex flex-col gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-xs font-bold text-gray-500 uppercase">Secure Payment splits</span>
                {(() => {
                  const platShare = selectedProduct.price * 0.10; // 10% platform share
                  const supplierShare = selectedProduct.price * 0.90; // 90% supplier
                  return (
                    <div className="flex flex-col gap-1 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Supplier share:</span>
                        <span>${supplierShare.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform fee (10%):</span>
                        <span>${platShare.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="modal-footer" style={{ padding: '16px 0 0' }}>
                <button type="button" onClick={() => setShopCheckoutStep(0)} className="btn-outline">CANCEL</button>
                <button type="submit" className="btn-primary-orange">PAY & SECURE ORDER</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHOP SUCCESS MODAL */}
      {shopCheckoutStep === 2 && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="modal-body py-6 flex flex-col gap-4">
              <div className="flex items-center justify-center rounded-circle text-lime" style={{ 
                padding: '12px', width: '64px', height: '64px', margin: '0 auto',
                backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' 
              }}>
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Order Confirmed!</h3>
                <p className="text-xs text-gray-400 mt-2">Your payment has been split and processed. Delivery details sent to **{shopEmail}**.</p>
              </div>
              <button onClick={() => setShopCheckoutStep(0)} className="btn-primary-purple w-full mt-4">DONE</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REPAIR SUCCESS MODAL */}
      {/* ========================================================================= */}
      {repairBookingStep === 1 && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="modal-body py-6 flex flex-col gap-4">
              <div className="flex items-center justify-center rounded-circle text-lime" style={{ 
                padding: '12px', width: '64px', height: '64px', margin: '0 auto',
                backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' 
              }}>
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Appointment Scheduled!</h3>
                <p className="text-xs text-gray-400 mt-2">Workshop slot has been locked for your bike repair. Ticket available under **My Bookings**.</p>
              </div>
              <button 
                onClick={() => { setRepairBookingStep(0); setActiveCustomerSubTab('my-bookings'); }} 
                className="btn-primary-purple w-full mt-4"
              >
                GO TO MY TICKETS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EXPERIENCE BOOKING MODAL */}
      {/* ========================================================================= */}
      {bookingExperience && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <div>
                <span className="text-orange font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>SECURE BOOKING SYSTEM</span>
                <h3 className="text-base font-bold text-white mt-0.5">{bookingExperience.title}</h3>
              </div>
              <button onClick={() => setBookingExperience(null)} className="text-gray-400 hover-opacity cursor-pointer" style={{ background: 'transparent', border: 'none' }}><X size={18} /></button>
            </div>

            <div className="modal-body flex flex-col gap-6">
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

              {bookingStep === 1 && (
                <div className="grid grid-2">
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-2">
                      <div>
                        <label className="form-label">Select Time Slot</label>
                        <select className="form-select" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)}>
                          <option value="">Choose slot...</option>
                          {bookingExperience.timeSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="form-label">Spots to Reserve</label>
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

                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-input" placeholder="John Doe" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                      </div>
                      <div>
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-input" placeholder="john@example.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                      </div>
                    </div>

                    {bookingTime && (
                      <div className="p-4 text-xs flex flex-col gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <span className="font-bold text-white uppercase" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>Cost Breakdown Preview</span>
                        {(() => {
                          const breakdown = calculateRevenue(bookingExperience.price, bookingSpots, bookingExperience.duration, bookingExperience.tier);
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

                  <div className="flex flex-col gap-3">
                    <label className="form-label text-center">Select Date (June 2026)</label>
                    <div style={{ backgroundColor: 'rgba(0,12,26,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                          <span key={d} className="text-gray-500 font-bold text-center" style={{ fontSize: '9px' }}>{d}</span>
                        ))}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                        <div />
                        {juneDays.map((dateStr, idx) => {
                          const dayNum = idx + 1;
                          const available = bookingTime ? getAvailableBikes(dateStr, bookingTime) : totalBikes - getMaintenanceCountForDate(dateStr);
                          const isSelected = bookingDate === dateStr;
                          const isMaintLock = getMaintenanceCountForDate(dateStr) === totalBikes;
                          const isFullyBooked = available <= 0;

                          return (
                            <div 
                              key={dateStr}
                              onClick={() => { if (!isFullyBooked && !isMaintLock) setBookingDate(dateStr); }}
                              style={{
                                aspectRatio: '1', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '4px 2px',
                                backgroundColor: isSelected ? 'var(--color-orange)' : isMaintLock ? 'rgba(239,68,68,0.1)' : isFullyBooked ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.03)',
                                border: isSelected ? '1px solid var(--color-orange)' : isFullyBooked || isMaintLock ? '1px dashed rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.05)',
                                color: isSelected ? '#000' : isFullyBooked || isMaintLock ? 'var(--color-text-muted)' : '#fff',
                                opacity: isFullyBooked || isMaintLock ? '0.4' : '1', pointerEvents: isFullyBooked || isMaintLock ? 'none' : 'auto', cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '9px', fontWeight: '800' }}>{dayNum}</span>
                              <span style={{ fontSize: '7px', fontWeight: '700', color: isSelected ? '#000' : isFullyBooked ? 'var(--color-error)' : 'var(--color-lime)' }}>
                                {isMaintLock ? 'LOCK' : isFullyBooked ? 'FULL' : `${available} left`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="flex flex-col gap-6">
                  <div className="glass-panel p-6 flex flex-col gap-4" style={{ borderLeft: '4px solid var(--color-orange)' }}>
                    <h4 className="text-base font-bold text-white flex items-center gap-2"><DollarSign className="text-orange" size={18} />Marketplace Payment Split Breakdown</h4>
                    {(() => {
                      const breakdown = calculateRevenue(bookingExperience.price, bookingSpots, bookingExperience.duration, bookingExperience.tier);
                      return (
                        <div className="flex flex-col gap-4">
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

                          <div className="flex flex-col gap-2 text-xs text-gray-400">
                            <div className="flex justify-between">
                              <span>Total Ticket base revenue ({bookingSpots} x ${bookingExperience.price}):</span>
                              <span>${breakdown.ticketRevenue.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Platform Commission cut ({bookingExperience.tier === 1 ? '30%' : bookingExperience.tier === 2 ? '15%' : '0%'}):</span>
                              <span>${breakdown.platformFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Bike Rental Pool Usage Fee (${bookingExperience.tier === 1 ? 10 : bookingExperience.tier === 2 ? 15 : 20}/hr per e-bike):</span>
                              <span>${breakdown.bikeFee.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="p-4 rounded-xl flex flex-col gap-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block">Simulate Stripe Checkout</span>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="form-label">Card Number</label>
                        <input type="text" className="form-input" defaultValue="4242424242424242" />
                      </div>
                      <div className="grid grid-2">
                        <div>
                          <label className="form-label">Expiration Date</label>
                          <input type="text" className="form-input" defaultValue="12/28" />
                        </div>
                        <div>
                          <label className="form-label">CVC</label>
                          <input type="password" className="form-input" defaultValue="123" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="text-center py-6 flex flex-col gap-4">
                  <div className="flex items-center justify-center rounded-circle text-lime" style={{ 
                    padding: '12px', width: '64px', height: '64px', margin: '0 auto',
                    backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' 
                  }}>
                    <CheckCircle2 size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Booking Confirmed!</h3>
                    <p className="text-xs text-gray-400 mt-2">Thank you! Your e-bike inventory has been locked. You can view your boarding tickets in **My Bookings**.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {bookingStep === 1 && (
                <>
                  <button onClick={() => setBookingExperience(null)} className="btn-outline">CANCEL</button>
                  <button 
                    onClick={() => {
                      if (!customerName || !customerEmail || !bookingTime) {
                        alert("Please fill out all rider information.");
                        return;
                      }
                      setBookingStep(2);
                    }} 
                    className="btn-primary-purple"
                  >
                    CONTINUE TO CHECKOUT <ArrowRight size={12} />
                  </button>
                </>
              )}

              {bookingStep === 2 && (
                <>
                  <button onClick={() => setBookingStep(1)} className="btn-outline">BACK</button>
                  <button onClick={handleConfirmBooking} className="btn-primary-orange">PAY & LOCK INVENTORY</button>
                </>
              )}

              {bookingStep === 3 && (
                <button onClick={() => { setBookingExperience(null); setActiveCustomerSubTab('my-bookings'); }} className="btn-primary-purple">VIEW MY TICKETS</button>
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
            <p className="text-gray-500 text-xs" style={{ lineHeight: '1.6' }}>Building unforgettable moments and real connections. Be part of the movement.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-white text-xs" style={{ letterSpacing: '1px' }}>TOP QUALITY E-BIKES</h5>
            <p className="text-gray-500 text-xs" style={{ lineHeight: '1.6' }}>Reliable, powerful, and fun. We maintain the highest standards of safety.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-white text-xs" style={{ letterSpacing: '1px' }}>SAFE & RELIABLE</h5>
            <p className="text-gray-500 text-xs" style={{ lineHeight: '1.6' }}>Safety first. Always. All trips are monitored and covered by platform policies.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-white text-xs" style={{ letterSpacing: '1px' }}>LOCAL VIBES</h5>
            <p className="text-gray-500 text-xs" style={{ lineHeight: '1.6' }}>Real people. Real places. Real memories. Experience the city like a local.</p>
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

      {/* ========================================================================= */}
      {/* USER PROFILE MODAL */}
      {/* ========================================================================= */}
      {profileModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings size={18} className="text-lime" /> Account Settings
              </h3>
              <button 
                onClick={() => setProfileModalOpen(false)} 
                className="text-gray-400 hover-opacity" 
                style={{ background: 'transparent', border: 'none' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body flex flex-col gap-4">
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                {['info', 'payment', 'security'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setProfileSubTab(tab)}
                    className="font-bold cursor-pointer"
                    style={{
                      border: 'none',
                      background: 'none',
                      color: profileSubTab === tab ? 'var(--color-lime)' : 'var(--color-text-secondary)',
                      borderBottom: profileSubTab === tab ? '2px solid var(--color-lime)' : 'none',
                      padding: '6px 12px',
                      fontSize: '11px'
                    }}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              {profileSubTab === 'info' && (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={profileEmail} 
                      onChange={(e) => setProfileEmail(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={profilePhone} 
                      onChange={(e) => setProfilePhone(e.target.value)} 
                    />
                  </div>
                </div>
              )}

              {profileSubTab === 'payment' && (
                <div className="flex flex-col gap-4">
                  <div className="p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <span className="text-white font-bold block text-xs">{linkedCard}</span>
                      <span className="text-gray-500 text-xs mt-0.5 block">Default checkout card</span>
                    </div>
                    <span className="bg-purple text-white font-extrabold" style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9px' }}>ACTIVE</span>
                  </div>

                  <div>
                    <label className="form-label">Add/Update Card Details</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. MasterCard ending in 9876" 
                      onChange={(e) => { if(e.target.value) setLinkedCard(e.target.value); }} 
                    />
                  </div>
                </div>
              )}

              {profileSubTab === 'security' && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <span className="text-white font-bold block text-xs">Two-Factor Authentication (2FA)</span>
                      <span className="text-gray-500 text-xs mt-0.5 block">Secure bookings with temporary code checkouts.</span>
                    </div>
                    <button
                      onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                      className="font-bold cursor-pointer"
                      style={{
                        backgroundColor: twoFactorAuth ? 'var(--color-lime)' : 'rgba(255,255,255,0.1)',
                        color: twoFactorAuth ? '#000' : '#fff',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '10px'
                      }}
                    >
                      {twoFactorAuth ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  <div>
                    <label className="form-label">Update Account Password</label>
                    <input type="password" placeholder="••••••••" className="form-input" disabled />
                    <span className="text-gray-500 block mt-1" style={{ fontSize: '9px' }}>OAuth single sign-on managed via Google authentication.</span>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => {
                  setProfileModalOpen(false);
                  addNotification("Account profile updated successfully.", "system");
                }} 
                className="btn-primary-purple w-full py-2 text-xs"
              >
                SAVE & CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
