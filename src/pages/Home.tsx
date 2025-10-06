// src/pages/Home.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Star,
  Users,
  Timer,
  HelpCircle,
  Award,
  Gamepad2,
  Target,
  Zap,
  Coins,
  Flame,
  Shield,
  Sword,
  Crown,
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "../components/Header";
import BackgroundImage from "../images/background-img.jpg";
import { useUser } from "../context/userContext";
import ParticipationModal from "../components/participationModal";
import { Competition } from "../types/competition";

type Winner = {
  name: string;
  title?: string;
  points: number;
  rank: string;
  image: string;
};

const API_BASE =
  process.env.REACT_APP_API_URL || "https://api.scoreperks.co.uk/api";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  // --- state
  const [featured, setFeatured] = useState<Competition | null>(null);
  const [loadingFeat, setLoadingFeat] = useState(true);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loadingWinners, setLoadingWinners] = useState(true);
  const [countdown, setCountdown] = useState<string>("");

  // participation modal
  const [participate, setParticipate] = useState<{
    open: boolean;
    comp: Competition | null;
  }>({
    open: false,
    comp: null,
  });
  const [submitting, setSubmitting] = useState(false);

  /* ================= helpers (same philosophy as dashboard) ================= */
  const toDate = (v: any) => {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };
  const computePhase = (c: Competition) => {
    const now = new Date();
    const start = toDate(c.startsAt);
    const end = toDate(c.endsAt);

    if (end && now >= end) return { phase: "ended" as const, isOpen: false };
    if (c.status === "open") {
      return {
        phase: start && now < start ? "upcoming" : "open",
        isOpen: true as const,
      };
    }
    if (start && now < start)
      return { phase: "upcoming" as const, isOpen: false };
    if (end && now < end) return { phase: "open" as const, isOpen: true };
    return { phase: "ended" as const, isOpen: false };
  };

  /* ================= featured selection (deterministic) ================= */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingFeat(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/competitions`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const list: Competition[] = await res.json();
        if (!alive) return;

        const open = list.filter((c) => computePhase(c).isOpen);
        const upcoming = list.filter(
          (c) => computePhase(c).phase === "upcoming"
        );

        const byEnds = (a: Competition, b: Competition) =>
          (toDate(a.endsAt)?.getTime() ?? Infinity) -
          (toDate(b.endsAt)?.getTime() ?? Infinity);
        const byStarts = (a: Competition, b: Competition) =>
          (toDate(a.startsAt)?.getTime() ?? Infinity) -
          (toDate(b.startsAt)?.getTime() ?? Infinity);

        const pick = open.sort(byEnds)[0] ?? upcoming.sort(byStarts)[0] ?? null;
        setFeatured(pick || null);
      } catch (e) {
        console.error("Featured fetch error", e);
        setFeatured(null);
      } finally {
        if (alive) setLoadingFeat(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ensure participants count exists (if list response was slim)
  useEffect(() => {
    if (!featured?._id || typeof featured.participants !== "undefined") return;
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/competitions/${featured._id}`);
        if (!r.ok) return;
        const full: Competition = await r.json();
        if (!alive) return;
        setFeatured((prev) =>
          prev && prev._id === full._id ? { ...prev, ...full } : prev
        );
      } catch {
        /* ignore */
      }
    })();
    return () => {
      alive = false;
    };
  }, [featured?._id]);

  /* ================= winners ================= */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingWinners(true);
        const res = await fetch(
          `${API_BASE}/leaderboard/top?period=week&limit=4`
        );
        const data = await res.json();
        if (!alive) return;
        setWinners(
          Array.isArray(data?.leaders)
            ? data.leaders
            : Array.isArray(data)
              ? data
              : []
        );
      } catch (e) {
        console.error("Winners fetch error", e);
        setWinners([]);
      } finally {
        if (alive) setLoadingWinners(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* ================= countdown ================= */
  useEffect(() => {
    if (!featured?.endsAt) return;
    const end = new Date(featured.endsAt).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, end - now);
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [featured?.endsAt]);

  /* ================= modal confirm ================= */
  const onConfirmParticipate = async (c: { _id: string }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        return;
      }
      setSubmitting(true);

      const res = await fetch(`${API_BASE}/competitions/${c._id}/participate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ticketCount: 1 }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.message || data?.error || "Failed to participate"
        );

      alert("You're in! Good luck ✨");
      // optional: navigate(`/competitions/${c._id}`);
    } catch (e: any) {
      alert(e?.message || "Could not participate");
    } finally {
      setSubmitting(false);
      setParticipate({ open: false, comp: null });
    }
  };

  /* ================= UI consts ================= */
  const heroSlides = [
    {
      image:
        "https://plus.unsplash.com/premium_photo-1729036321929-78202e4fd944?q=80&w=2012&auto=format&fit=crop",
      title: "Daily Login",
      subtitle: "Win Real Money Every Day",
      overlayColor: "from-blue-900/50",
    },
    {
      image:
        "https://images.unsplash.com/photo-1632809199725-72a4245e846b?q=80&w=1932&auto=format&fit=crop",
      title: "Spin To Win/Mystery Box",
      subtitle: "Bigger Prizes, More Opportunities",
      overlayColor: "from-indigo-900/50",
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1714324365626-f03e9213791f?q=80&w=2070&auto=format&fit=crop",
      title: "Win In Competition",
      subtitle: "Participate in competitions. Win amazing prizes",
      overlayColor: "from-purple-900/50",
    },
  ];

  const CustomArrow = ({
    direction,
    onClick,
  }: {
    direction: "prev" | "next";
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${direction === "prev" ? "left-4" : "right-4"}
      z-10 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
      {direction === "prev" ? (
        <ChevronLeft className="w-6 h-6 text-blue-600" />
      ) : (
        <ChevronRight className="w-6 h-6 text-blue-600" />
      )}
    </button>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: "linear",
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
  };

  const bgTint: Record<string, string> = {
    blue: "bg-blue-50",
    indigo: "bg-indigo-50",
    yellow: "bg-yellow-50",
    green: "bg-green-50",
  };

  const cover =
    featured?.bannerUrl ||
    featured?.images?.[0] ||
    featured?.image ||
    "https://images.unsplash.com/photo-1518183214770-9cffbec72538?q=80&auto=format&fit=crop";

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <div className="w-full max-w-full bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        <Slider {...(sliderSettings as any)}>
          {heroSlides.map((slide, index) => (
            <div key={index} className="relative h-[400px]">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transform hover:scale-105 transition-transform duration-[1s]"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${slide.overlayColor} to-transparent`}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative h-full flex items-center justify-center text-center px-4"
              >
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 mb-8">
                    {slide.subtitle}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-block"
                  >
                    <button
                      onClick={() => navigate(user ? "/dashboard" : "/signup")}
                      className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-blue-500/20 flex items-center space-x-2 mx-auto"
                    >
                      <DollarSign className="w-5 h-5" />
                      <span>
                        {user ? "Go to Dashboard" : "Start Winning Now"}
                      </span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Main Content */}
      <div
        className="relative min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="container mx-auto px-4 py-16 max-w-[100vw]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Featured Challenge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Flame className="w-8 h-8 text-orange-500" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Featured Challenge
                  </h2>
                </div>

                <Link
                  to="/competitions"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-indigo-200 
               bg-white/70 backdrop-blur px-3.5 py-1.5 text-sm font-semibold text-indigo-700 
               shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-300
               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span>View all</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:shadow-blue-100 border border-blue-100 overflow-hidden">
                {loadingFeat && (
                  <div className="p-10 text-center text-gray-500">
                    Loading challenge…
                  </div>
                )}

                {!loadingFeat && !featured && (
                  <div className="p-10 text-center text-gray-500">
                    No open competitions right now. Check back soon!
                  </div>
                )}

                {featured && (
                  <>
                    <div className="relative">
                      <img
                        src={cover}
                        alt={featured.title}
                        className="w-full h-48 md:h-56 object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1518183214770-9cffbec72538?q=80&auto=format&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-800">
                          Prestige Tickets Required
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {featured.title}
                        </h3>
                      </div>

                      {/* Metrics: Prize, Heroes (= participants), Time Left */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <DollarSign className="w-6 h-6 mx-auto mb-1" />
                          <span className="block text-sm text-gray-600">
                            Prize Pool
                          </span>
                          <span className="block font-bold text-green-600">
                            {typeof featured.prizePool !== "undefined"
                              ? `£${featured.prizePool}`
                              : "—"}
                          </span>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <Users className="w-6 h-6 mx-auto mb-1" />
                          <span className="block text-sm text-gray-600">
                            Heroes
                          </span>
                          <span className="block font-bold text-blue-600">
                            {(
                              featured.participants?.length ?? 0
                            ).toLocaleString()}
                          </span>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <Timer className="w-6 h-6 mx-auto mb-1" />
                          <span className="block text-sm text-gray-600">
                            Time Left
                          </span>
                          <span className="block font-bold text-indigo-600">
                            {countdown || "—"}
                          </span>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={() =>
                            setParticipate({ open: true, comp: featured })
                          }
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-200"
                        >
                          <Sword className="w-5 h-5" />
                          <span>Participate Now</span>
                        </button>
                      </motion.div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Gamepad2 className="w-8 h-8 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Adventure Guide
                </h2>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 border border-blue-100">
                <div className="space-y-8">
                  {[
                    {
                      icon: <Target className="w-10 h-10 text-blue-600" />,
                      level: "Novice",
                      title: "Choose Your Challenge",
                      description: "Browse epic challenges in the Quest Board",
                      color: "blue",
                    },
                    {
                      icon: <Zap className="w-10 h-10 text-indigo-600" />,
                      level: "Apprentice",
                      title: "Enhance Your Chances",
                      description: "Pay entry fee and join the challenge",
                      color: "indigo",
                    },
                    {
                      icon: <Star className="w-10 h-10 text-yellow-500" />,
                      level: "Hero",
                      title: "Compete & Win",
                      description: "Compete in challenges and rise to glory",
                      color: "yellow",
                    },
                    {
                      icon: <Coins className="w-10 h-10 text-green-600" />,
                      level: "Legend",
                      title: "Claim Your Prize",
                      description: "Receive your winnings directly",
                      color: "green",
                    },
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="relative"
                    >
                      <div
                        className={`flex items-center space-x-4 ${bgTint[step.color]} rounded-xl p-4 transform hover:scale-105 transition-all border border-blue-100 hover:shadow-lg hover:shadow-blue-100`}
                      >
                        <div className="flex-shrink-0 bg-white p-3 rounded-lg">
                          {step.icon}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-600">
                              {step.level}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {step.title}
                          </h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                      {index < 3 && (
                        <div className="h-8 w-1 bg-blue-200 absolute left-7 top-full translate-x-4"></div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Top Winners */}
        <div className="bg-blue-60 py-16 w-full max-w-full">
          <div className="container mx-auto px-4 max-w-[100vw]">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Top Winners This Week
                </h2>
              </div>
              <Link
                to="/leaderboard"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                View Hall of Fame <ChevronRight size={20} />
              </Link>
            </div>

            {loadingWinners ? (
              <div className="p-8 text-center text-gray-500">
                Loading winners…
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {winners.map((hero, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-blue-100 hover:border-blue-200"
                  >
                    <div className="relative mb-4">
                      <img
                        src={hero.image}
                        alt={hero.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover ring-2 ring-blue-100"
                      />
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                        {hero.rank}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 text-center">
                      {hero.name}
                    </h3>
                    <p className="text-blue-600 text-sm mb-3 text-center">
                      {hero.title || "Champion"}
                    </p>
                    <div className="flex items-center justify-center gap-2 font-semibold">
                      <Star className="w-4 h-4" />
                      <span>{hero.points} Points</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Help */}
        <div className="bg-blue-60 py-16 w-full max-w-full">
          <div className="container mx-auto px-4 max-w-[100vw]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Need Guidance?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Visit our Adventurer's Guide for comprehensive tutorials and
                FAQs. Our Guild Masters are ready to assist you!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/help")}
                className="bg-blue-50 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-100 transition-colors"
              >
                Open Adventurer's Guide
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Modal (mount once) */}
        <ParticipationModal
          open={participate.open}
          competition={participate.comp}
          onClose={() => setParticipate({ open: false, comp: null })}
          onConfirm={(c) => onConfirmParticipate(c)}
          isSubmitting={submitting}
        />

        {/* Footer */}
        <footer className="bg-blue-50 border-t border-blue-100 w-full max-w-full">
          <div className="container mx-auto px-4 py-12 max-w-[100vw]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                  <span className="text-xl font-bold text-gray-900">
                    ScorePerk
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  The ultimate realm for legendary competitions and epic
                  rewards.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/competitions"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Quests
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/leaderboard"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Heroes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/how-it-works"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Adventure Guide
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/rules"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Sacred Rules
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Support
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/help"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Guild Support
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Send Message
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Mysteries
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Sacred Scroll
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Join Our Realm
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Discord Guild
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Twitter Scroll
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Instagram Crystal
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      LinkedIn Network
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-blue-100 mt-12 pt-8 text-center text-sm text-gray-500">
              <p>
                &copy; {new Date().getFullYear()} ScorePerk. All rights reserved
                in all realms.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
