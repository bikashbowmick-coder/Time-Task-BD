
import React, { useState, useEffect, useMemo } from 'react';
import { PlatformPrice, SiteStats, LeaderboardEntry, Review, MarketAssignment } from '../types';
import { PLATFORMS } from '../constants';
// Added Heart to the lucide-react imports
import { 
  Users, 
  DollarSign, 
  PackageCheck, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Quote, 
  TrendingUp, 
  MessageCircle, 
  Trophy, 
  Crown, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Rocket, 
  ChevronDown,
  Linkedin,
  Twitter,
  Award,
  Mail,
  Heart
} from 'lucide-react';

interface Props {
  prices: PlatformPrice[];
  stats: SiteStats;
  leaderboard: LeaderboardEntry[];
  reviews: Review[];
  assignments: MarketAssignment[];
  onJoin: () => void;
  onNavigate: (view: any) => void;
}

const HomeView: React.FC<Props> = ({ prices, stats, leaderboard, reviews, assignments, onJoin, onNavigate }) => {
  const topThree = (leaderboard || []).slice(0, 3);
  const others = (leaderboard || []).slice(3);

  const founders = [
    {
      name: "Tanvir Ahmed",
      role: "Co-Founder & CEO",
      bio: "Visionary leader with 8+ years in digital brokerage and market synchronization.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Samiul Islam",
      role: "Co-Founder & COO",
      bio: "Operations expert dedicated to streamlining payouts and merchant security protocols.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Nabila Rahman",
      role: "Co-Founder & CMO",
      bio: "Driving the community growth and ensuring the voice of every earner is heard.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
      linkedin: "#",
      twitter: "#"
    }
  ];

  // Default testimonials if no user reviews exist
  const defaultTestimonials = [
    { id: 'd1', displayName: 'Arif Ahmed', location: 'Dhaka', comment: 'Started as a side hustle, now it is my main source of income. Fast bKash payments every time!', rating: 5 },
    { id: 'd2', displayName: 'Sumi Akter', location: 'Chattogram', comment: 'Highly recommended for anyone looking to sell social accounts. Transparent prices and great support.', rating: 5 },
    { id: 'd3', displayName: 'Rohan Islam', location: 'Sylhet', comment: 'The interface is so clean and easy to use. I love the live price board updates.', rating: 5 },
    { id: 'd4', displayName: 'Mehedi Hasan', location: 'Rajshahi', comment: 'The verification team is very professional. I have already earned over ৳20,000 this month alone.', rating: 5 },
    { id: 'd5', displayName: 'Nusrat Jahan', location: 'Khulna', comment: 'Safe harbor for digital creators. Finally a platform that respects our time and effort.', rating: 5 }
  ];

  const displayReviews = useMemo(() => {
    return (reviews && reviews.length > 0) ? reviews : defaultTestimonials;
  }, [reviews]);

  const activeAssignments = useMemo(() => {
    return (assignments || []).filter(a => a.status === 'active');
  }, [assignments]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === displayReviews.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? displayReviews.length - 1 : prev - 1));
  };

  return (
    <div className="pb-20">
      <style>{`
        @keyframes glow {
          0%, 100% { opacity: 0.5; filter: blur(40px); }
          50% { opacity: 0.8; filter: blur(60px); }
        }
        @keyframes drawPath {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes moveGlow {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        @keyframes floatGraph {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-glow { animation: glow 4s ease-in-out infinite; }
        .market-graph-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawPath 4s cubic-bezier(0.4, 0, 0.2, 1) forwards, floatGraph 6s ease-in-out infinite;
        }
        .market-grid {
          background-image: linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* Enhanced Hero Section with Live Market Graph */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-32 pb-48 px-4">
        {/* Market Grid Overlay */}
        <div className="absolute inset-0 market-grid opacity-50 pointer-events-none"></div>

        {/* Animated Background Graph */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40 dark:opacity-20">
          <svg className="w-full h-full max-w-7xl" viewBox="0 0 1000 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="graphGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path 
              className="market-graph-path"
              d="M0,350 Q50,300 100,320 T200,280 T300,310 T400,250 T500,290 T600,220 T700,260 T800,180 T900,220 T1000,150" 
              stroke="url(#graphGradient)" 
              strokeWidth="4" 
              fill="none" 
              filter="url(#neonGlow)"
            />
            {/* The Floating Dot (Live Data Point) */}
            <circle r="6" fill="#fff" filter="url(#neonGlow)">
              <animateMotion 
                dur="10s" 
                repeatCount="indefinite" 
                path="M0,350 Q50,300 100,320 T200,280 T300,310 T400,250 T500,290 T600,220 T700,260 T800,180 T900,220 T1000,150"
              />
            </circle>
          </svg>
        </div>

        {/* Background Glows */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full animate-glow"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-pink-500/10 dark:bg-pink-500/20 rounded-full animate-glow" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-indigo-700 dark:text-indigo-400 text-[10px] font-black mb-10 tracking-[0.25em] uppercase shadow-2xl animate-in fade-in slide-in-from-top-6 duration-1000">
            <span className="flex h-2.5 w-2.5 mr-3">
              <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            Real-time Market Sync: {activeAssignments.length} Global Goals Active
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white mb-10 leading-[0.95] tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Unlock Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-300">Digital Earnings</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-slate-500 dark:text-slate-400 max-w-4xl mx-auto mb-16 font-medium leading-relaxed tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Bangladesh's most trusted social asset brokerage. Join 15,000+ verified merchants converting accounts into <span className="text-slate-900 dark:text-white font-bold underline decoration-indigo-500 underline-offset-4">instant cash</span> since 2023.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <button 
              onClick={onJoin}
              className="relative overflow-hidden px-14 py-7 bg-indigo-600 text-white font-black rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-xl group"
            >
              <span className="relative z-10 flex items-center justify-center gap-4">
                Start Selling Now <ArrowRight className="w-7 h-7 group-hover:translate-x-3 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            <button onClick={() => onNavigate('about')} className="px-14 py-7 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-black rounded-[2.5rem] hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-xl shadow-xl">
              Explore The Mission
            </button>
          </div>
        </div>

        {/* Mouse scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Live Rates Below</span>
           <ChevronDown className="w-5 h-5 text-slate-400" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 mb-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Registered Users', val: stats?.totalUsers || 0, icon: <Users />, color: 'blue' },
            { label: 'Total Paid Out', val: `৳${(stats?.totalPayouts || 0).toLocaleString()}`, icon: <DollarSign />, color: 'green' },
            { label: 'Accounts Today', val: stats?.accountsToday || 0, icon: <PackageCheck />, color: 'purple' }
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center hover:scale-[1.02] transition-transform">
              <div className={`w-14 h-14 bg-${s.color}-50 dark:bg-${s.color}-900/20 rounded-2xl flex items-center justify-center text-${s.color}-600 dark:text-${s.color}-400 mr-5`}>
                {React.cloneElement(s.icon as React.ReactElement<any>, { className: 'w-7 h-7' })}
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{s.label}</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">{s.val}{typeof s.val === 'number' && '+'}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Summary Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="relative bg-white dark:bg-slate-900 p-1 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1522071823990-b997ee71159b?q=80&w=1200&auto=format&fit=crop" className="rounded-[3.25rem] w-full h-[450px] object-cover opacity-90 grayscale-[30%] hover:grayscale-0 transition-all duration-700" alt="Team Work" />
               <div className="absolute bottom-10 left-10 right-10 p-8 glass dark:dark-glass rounded-[2rem] border border-white/20">
                  <p className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Our Mission</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Empowering 100,000+ Youth in Bangladesh through digital micro-tasks.</p>
               </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <Target className="w-3 h-3 mr-2" /> About Time Task BD
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              A Reliable Bridge Between <span className="text-indigo-600">Sellers</span> and Global Markets.
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Founded in 2023, we've revolutionized how social media assets are traded in Bangladesh. We prioritize fairness, security, and lightning-fast payments above all else.
            </p>
            <div className="grid grid-cols-2 gap-6">
               <div className="flex gap-4">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white mb-1">Secure Escrow</h4>
                    <p className="text-xs text-slate-400 font-medium">Safe account handling.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-10 h-10 bg-pink-50 dark:bg-pink-900/20 rounded-xl flex items-center justify-center text-pink-600 flex-shrink-0">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white mb-1">BD Community</h4>
                    <p className="text-xs text-slate-400 font-medium">100% Local support.</p>
                  </div>
               </div>
            </div>
            <button onClick={() => onNavigate('about')} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest group">
               Learn more about our story <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="max-w-7xl mx-auto px-4 py-24 bg-slate-50 dark:bg-slate-900/30 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none"></div>
        
        <div className="text-center mb-20 relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
             <Award className="w-3 h-3 mr-2" /> Global Leadership
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">The Minds Behind <br /> <span className="text-indigo-600">Time Task BD</span></h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            Meet the visionaries driving innovation and integrity in the social asset marketplace of Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
          {founders.map((founder, idx) => (
            <div key={idx} className="group flex flex-col items-center bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative mb-8">
                 <div className="profile-glow-container p-1">
                   <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl relative z-10">
                      <img src={founder.image} alt={founder.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                   </div>
                 </div>
                 <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none border-2 border-white dark:border-slate-900 z-20">
                    <CheckCircle2 className="w-5 h-5" />
                 </div>
              </div>

              <div className="text-center space-y-3 mb-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{founder.name}</h3>
                <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{founder.role}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-2 line-clamp-3">
                   {founder.bio}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-50 dark:border-slate-800 w-full justify-center">
                 <a href={founder.linkedin} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                    <Linkedin className="w-5 h-5" />
                 </a>
                 <a href={founder.twitter} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all">
                    <Twitter className="w-5 h-5" />
                 </a>
                 <a href={`mailto:${founder.name.toLowerCase().replace(' ', '.')}@timetaskbd.com`} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all">
                    <Mail className="w-5 h-5" />
                 </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Market Rates & Active Assignments */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-slate-900 dark:bg-slate-900/50 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden border border-white/5 shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
           
           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 relative z-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Live Market Rates</h2>
              <p className="text-slate-400 font-medium text-lg">Daily fluctuating prices based on global demand.</p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-2xl">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">Global Pulse: Active</span>
            </div>
          </div>

          {/* New Integrated Subsection: Active Assignments */}
          {activeAssignments.length > 0 && (
            <div className="mb-16 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex items-center gap-3 mb-8 px-2">
                  <Rocket className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">High Demand Assignments</h3>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeAssignments.map(asgn => (
                    <div key={asgn.id} className="bg-white/5 border border-white/10 p-7 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <h4 className="text-xl font-black tracking-tight mb-1 group-hover:text-indigo-400 transition-colors uppercase">{asgn.platformName}</h4>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Urgent Requirement</p>
                          </div>
                          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                             <Target className="w-6 h-6" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between items-end">
                             <span className="text-[10px] font-black uppercase text-slate-400">Target Progress</span>
                             <span className="text-lg font-black text-indigo-400">{Math.round((asgn.currentQuantity / asgn.targetQuantity) * 100)}%</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out" 
                               style={{ width: `${(asgn.currentQuantity / asgn.targetQuantity) * 100}%` }}
                             ></div>
                          </div>
                          <div className="pt-2 flex justify-between items-center">
                             <p className="text-[10px] font-bold text-slate-500 uppercase">Goal: {asgn.targetQuantity} Units</p>
                             <p className="text-xs font-black text-white">৳{asgn.pricePerUnit}/Unit</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/10 relative z-10 shadow-inner">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Identity</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Historical Average</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Real-time Payout</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(prices || []).map((price) => {
                    const platformIcon = (PLATFORMS || []).find(p => p.id === price.id)?.icon;
                    return (
                      <tr key={price.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-10 py-8">
                          <div className="flex items-center">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform shadow-lg">
                              {platformIcon ? React.cloneElement(platformIcon as React.ReactElement, { className: 'w-7 h-7 text-white' }) : null}
                            </div>
                            <span className="font-black text-white text-2xl tracking-tight uppercase">{price.name}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-slate-500 font-bold line-through italic text-xl">
                          ৳{price.regularPrice.toFixed(2)}
                        </td>
                        <td className="px-10 py-8">
                          <span className="text-4xl font-black text-indigo-400 tracking-tighter">৳{price.todayPrice.toFixed(2)}</span>
                        </td>
                        <td className="px-10 py-8 text-center">
                          <span className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] inline-flex items-center border ${
                            price.status === 'buying' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {price.status === 'buying' ? (
                              <><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span> Buying</>
                            ) : 'Market Closed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-12 text-center relative z-10">
             <button onClick={onJoin} className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors">
                Scroll for more platform data <ChevronDown className="w-4 h-4 animate-bounce" />
             </button>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 text-[10px] font-black mb-4 tracking-widest uppercase">
            <Trophy className="w-3 h-3 mr-2" />
            Hall of Fame
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Top Earners Leaderboard</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Recognizing the most active and successful earners in our community.</p>
        </div>

        {/* Top 3 Champions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {topThree.map((user, i) => {
            const isFirst = i === 0;
            return (
              <div 
                key={user.uid} 
                className={`relative bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl transition-all duration-500 hover:scale-[1.03] border-4 ${
                  isFirst ? 'border-amber-400 order-first md:order-2 md:scale-110 z-10' : 
                  i === 1 ? 'border-slate-300 dark:border-slate-700 md:order-1' : 'border-orange-300 dark:border-orange-800/40 md:order-3'
                }`}
              >
                {isFirst && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                    <div className="bg-amber-400 p-3 rounded-2xl shadow-xl shadow-amber-200">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-black border-8 shadow-inner ${
                    isFirst ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/40' : 
                    i === 1 ? 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800/40'
                  }`}>
                    {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full" /> : user.displayName[0]}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{user.displayName}</h3>
                  <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-6">Rank #{user.rank}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                       <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">Total Assets</p>
                       <p className="text-lg font-black text-slate-900 dark:text-white">{user.totalSubmissions}</p>
                    </div>
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                       <p className="text-[10px] font-black text-indigo-400 dark:text-indigo-500 uppercase mb-1">Today Earn</p>
                       <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">৳{user.todayEarnings}</p>
                    </div>
                  </div>

                  <div className={`py-3 px-6 rounded-2xl font-black flex items-center justify-between ${
                    isFirst ? 'bg-amber-400 text-white' : 'bg-slate-900 dark:bg-slate-800 text-white'
                  }`}>
                    <span className="text-xs uppercase tracking-widest opacity-80">Competition Score</span>
                    <span className="text-xl">{user.score.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* The Rest of the Top 10 */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
           <div className="overflow-x-auto no-scrollbar">
             <table className="w-full text-left min-w-[700px]">
               <thead>
                 <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rank</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Earner Name</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Total Assets</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Today's Earnings</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Market Score</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {others.map((user) => (
                    <tr key={user.uid} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                      <td className="px-10 py-7">
                        <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-500 text-sm border border-slate-200 dark:border-slate-700 shadow-sm">
                          {user.rank}
                        </span>
                      </td>
                      <td className="px-10 py-7">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 mr-5 group-hover:scale-110 transition-transform shadow-sm">
                            {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-2xl object-cover" /> : user.displayName[0]}
                          </div>
                          <span className="font-black text-lg text-slate-800 dark:text-slate-100 tracking-tight">{user.displayName}</span>
                        </div>
                      </td>
                      <td className="px-10 py-7 text-center">
                        <span className="font-bold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-tight">{user.totalSubmissions} Units</span>
                      </td>
                      <td className="px-10 py-7 text-center">
                        <span className="font-black text-green-600 dark:text-green-400 text-lg">৳{user.todayEarnings.toLocaleString()}</span>
                      </td>
                      <td className="px-10 py-7 text-right">
                        <span className="font-black text-indigo-600 dark:text-indigo-400 text-2xl tracking-tighter">{user.score.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        </div>
      </section>

      {/* Testimonials Slider (LIVE FEEDBACK) */}
      <section className="bg-slate-50 dark:bg-slate-950/50 py-24 px-4 overflow-hidden relative">
         <Quote className="absolute -top-10 -left-10 w-64 h-64 text-slate-200/50 dark:text-slate-800/20 -rotate-12" />
         <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Earner Success Stories</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Real reviews from our verified community members.</p>
          </div>
          
          <div className="relative group max-w-4xl mx-auto">
            {/* Slider Track */}
            <div className="overflow-hidden rounded-[3rem] shadow-2xl">
              <div 
                className="flex transition-transform duration-700 ease-out" 
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {displayReviews.map((t, i) => (
                  <div key={t.id || i} className="w-full flex-shrink-0 px-4 md:px-12 py-12 md:py-20 bg-white dark:bg-slate-900">
                    <div className="flex flex-col items-center text-center">
                      <div className="flex gap-1 mb-8">
                        {[...Array(5)].map((_, starIdx) => (
                          <Star key={starIdx} className={`w-6 h-6 ${starIdx < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-800'}`} />
                        ))}
                      </div>
                      <p className="text-xl md:text-3xl font-bold text-slate-700 dark:text-slate-100 italic mb-12 leading-relaxed max-w-2xl">
                        "{t.comment}"
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-indigo-500/20">
                          {t.displayName?.[0] || 'U'}
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1">{t.displayName}</p>
                          <div className="flex items-center gap-2">
                             <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{t.location || 'Verified Earner'}</span>
                             <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={prevSlide} 
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-10 w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-900 dark:text-white shadow-2xl border border-slate-100 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all z-20"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <button 
              onClick={nextSlide} 
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-10 w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-900 dark:text-white shadow-2xl border border-slate-100 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all z-20"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>

          {/* Progress Indicators (Dots) */}
          <div className="flex justify-center gap-3 mt-12">
            {displayReviews.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-10 bg-indigo-600' : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'}`}
              />
            ))}
          </div>
         </div>
      </section>

      {/* Trust Factors */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Safe & Secure', desc: 'Enterprise-grade encryption for all account details.', icon: <ShieldCheck /> },
            { title: 'Fast Payouts', desc: 'Most withdrawals are processed within 12-24 hours.', icon: <Clock /> },
            { title: 'Best Rates', desc: 'We offer the most competitive market prices in BD.', icon: <TrendingUp className="w-6 h-6" /> },
            { title: '24/7 Support', desc: 'Dedicated team available via Telegram and WhatsApp.', icon: <MessageCircle className="w-6 h-6" /> }
          ].map((feat, i) => (
            <div key={i} className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-6">{feat.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[3.5rem] p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px]"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Ready to Start Earning?</h2>
          <p className="text-indigo-100 mb-10 max-w-xl mx-auto font-medium text-lg leading-relaxed">
            Join the biggest marketplace in Bangladesh. Create your free account and start selling today.
          </p>
          <button 
            onClick={onJoin}
            className="px-12 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:bg-slate-100 hover:translate-y-[-2px] transition-all shadow-xl text-lg"
          >
            Create Your Account Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
