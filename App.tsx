
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X, 
  TrendingUp,
  Wallet,
  Clock,
  MessageCircle,
  Moon,
  Sun,
  Bell,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ChevronDown,
  ShieldCheck,
  Zap,
  Facebook,
  Twitter,
  Instagram,
  Phone
} from 'lucide-react';
import { User, PlatformPrice, Submission, SiteStats, WithdrawalRequest, LeaderboardEntry, AppNotification, Review, MarketAssignment, BlogPost } from './types.ts';
import { INITIAL_PRICES } from './constants.tsx';
import HomeView from './components/HomeView.tsx';
import DashboardView from './components/DashboardView.tsx';
import AdminView from './components/AdminView.tsx';
import AuthView from './components/AuthView.tsx';
import AboutView from './components/AboutView.tsx';
import BlogView from './components/BlogView.tsx';
import ContactView from './components/ContactView.tsx';
import BlogPostView from './components/BlogPostView.tsx';

type View = 'home' | 'dashboard' | 'admin' | 'login' | 'register' | 'about' | 'blog' | 'contact' | 'blog-post';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('ttbd_theme') as Theme) || 'light');

  const [prices, setPrices] = useState<PlatformPrice[]>(INITIAL_PRICES);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [assignments, setAssignments] = useState<MarketAssignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('ttbd_reviews');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('ttbd_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem('ttbd_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const savedUser = localStorage.getItem('ttbd_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setCurrentUser(parsed);
      setUsers(prev => {
        if (!prev.find(u => u.uid === parsed.uid)) {
          return [...prev, parsed];
        }
        return prev;
      });
    }
  }, []);

  const userNotifications = useMemo(() => {
    if (!currentUser) return [];
    return notifications.filter(n => 
      n.userId === currentUser.uid || 
      n.userId === 'all' || 
      (currentUser.role === 'admin' && n.userId === 'admin')
    ).sort((a, b) => b.createdAt - a.createdAt);
  }, [notifications, currentUser]);

  const unreadCount = useMemo(() => userNotifications.filter(n => !n.read).length, [userNotifications]);

  const addNotification = (userId: string, title: string, message: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random()}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: Date.now(),
    };
    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);
    setTimeout(() => setActiveToast(null), 5000);
  };

  const markNotifAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.filter(n => n.userId !== currentUser.uid && n.userId !== 'all' && (currentUser.role !== 'admin' || n.userId !== 'admin')));
  };

  const leaderboardData: LeaderboardEntry[] = useMemo(() => [
    { uid: '1', displayName: 'Rakib Hasan', totalSubmissions: 1240, todayEarnings: 850, score: 15400, rank: 1 },
    { uid: '2', displayName: 'Sabbir Ahmed', totalSubmissions: 980, todayEarnings: 620, score: 12100, rank: 2 },
    { uid: '3', displayName: 'Mitu Akter', totalSubmissions: 850, todayEarnings: 540, score: 10200, rank: 3 },
  ], []);

  const stats: SiteStats = {
    totalUsers: users.length + 1540,
    totalPayouts: (withdrawals || []).filter(w => w.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0) + 42500,
    accountsToday: (submissions || []).filter(s => {
      const today = new Date().setHours(0, 0, 0, 0);
      return s.submittedAt >= today;
    }).reduce((acc, curr) => acc + curr.quantity, 0) + 124,
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setNotifMenuOpen(false);
    setProfileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    navigateTo('blog-post');
  };

  const handleLogout = () => {
    localStorage.removeItem('ttbd_user');
    setCurrentUser(null);
    navigateTo('home');
  };

  const toggleTheme = () => {
    document.body.classList.add('theme-toggling');
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    setTimeout(() => {
      document.body.classList.remove('theme-toggling');
    }, 600);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.uid === updatedUser.uid ? updatedUser : u));
    if (currentUser?.uid === updatedUser.uid) {
      setCurrentUser(updatedUser);
      localStorage.setItem('ttbd_user', JSON.stringify(updatedUser));
    }
  };

  const handleUnlockUser = (uid: string) => {
    setUsers(prev => (prev || []).map(u => {
      if (u.uid === uid) {
        const updated = { ...u, isWithdrawLocked: false, failedPinAttempts: 0 };
        if (currentUser?.uid === uid) {
          setCurrentUser(updated);
          localStorage.setItem('ttbd_user', JSON.stringify(updated));
        }
        addNotification(uid, 'Withdrawal Unlocked! 🔓', 'Your withdrawal access has been restored by admin.', 'success');
        return updated;
      }
      return u;
    }));
  };

  const handleCreateAssignment = (asgn: Omit<MarketAssignment, 'id' | 'createdAt' | 'currentQuantity' | 'status'>) => {
    const newAsgn: MarketAssignment = {
      ...asgn,
      id: `asgn_${Date.now()}`,
      currentQuantity: 0,
      status: 'active',
      createdAt: Date.now()
    };
    setAssignments(prev => [newAsgn, ...prev]);
    // Broadcast to all users
    addNotification('all', 'New Market Assignment! 🚀', `Admin requires ${asgn.targetQuantity} units for ${asgn.platformName}. Start submitting!`, 'warning');
  };

  const handleSubmission = (sub: Omit<Submission, 'id' | 'status' | 'submittedAt' | 'userId' | 'userEmail'>) => {
    if (!currentUser) return;
    const newSub: Submission = {
      ...sub,
      id: `sub_${Date.now()}`,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      status: 'pending',
      submittedAt: Date.now(),
    };
    setSubmissions([newSub, ...(submissions || [])]);
    addNotification('admin', 'New Asset Batch', `${currentUser.displayName} submitted ${sub.quantity} units for ${sub.platformName}.`, 'info');
  };

  const handleProcessSubmission = (id: string, status: 'approved' | 'rejected', verifiedQty?: number, failedQty?: number) => {
    setSubmissions(prev => (prev || []).map(s => {
      if (s.id === id) {
        const finalVerified = verifiedQty !== undefined ? verifiedQty : (status === 'approved' ? s.quantity : 0);
        const earning = finalVerified * s.pricePerUnit;
        if (status === 'approved') {
          setUsers(prevUsers => (prevUsers || []).map(u => (u.uid === s.userId ? { ...u, balance: u.balance + earning, totalEarnings: u.totalEarnings + earning } : u)));
          if (currentUser?.uid === s.userId) {
             setCurrentUser(prev => prev ? { ...prev, balance: prev.balance + earning, totalEarnings: prev.totalEarnings + earning } : null);
          }
          addNotification(s.userId, 'Submission Approved! ✅', `Earned ৳${earning.toFixed(2)}`, 'success');
          
          // Update Assignment progress if match
          setAssignments(prevAsgns => (prevAsgns || []).map(a => {
            if (a.platformId === s.platformId && a.status === 'active') {
              const newQty = a.currentQuantity + finalVerified;
              return { ...a, currentQuantity: newQty, status: newQty >= a.targetQuantity ? 'completed' : 'active' };
            }
            return a;
          }));
        }
        return { ...s, status, processedAt: Date.now(), verifiedQuantity: finalVerified, failedQuantity: failedQty };
      }
      return s;
    }));
  };

  const handleWithdrawalRequest = (req: { amount: number; method: string; address: string }) => {
    if (!currentUser) return;
    const newReq: WithdrawalRequest = {
      id: `wd_${Date.now()}`,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      amount: req.amount,
      method: req.method,
      address: req.address,
      status: 'pending',
      createdAt: Date.now(),
    };
    setWithdrawals([newReq, ...(withdrawals || [])]);
    const updatedUser = { ...currentUser, balance: currentUser.balance - req.amount };
    handleUpdateUser(updatedUser);
    addNotification('admin', 'New Payout Request', `${currentUser.displayName} requested ৳${req.amount.toFixed(2)}`, 'warning');
  };

  const handleProcessWithdrawal = (id: string, status: 'paid' | 'rejected', txId?: string) => {
    setWithdrawals(prev => (prev || []).map(w => {
      if (w.id === id) {
        if (status === 'rejected') {
          setUsers(prevUsers => (prevUsers || []).map(u => {
            if (u.uid === w.userId) {
              const updated = { ...u, balance: u.balance + w.amount };
              if (currentUser?.uid === u.uid) setCurrentUser(updated);
              return updated;
            }
            return u;
          }));
        }
        addNotification(w.userId, status === 'paid' ? 'Paid! 💸' : 'Rejected ❌', `৳${w.amount.toFixed(2)} payout processed.`, status === 'paid' ? 'success' : 'error');
        return { ...w, status, transactionId: txId };
      }
      return w;
    }));
  };

  const handleNewReview = (review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      createdAt: Date.now()
    };
    setReviews([newReview, ...(reviews || [])]);
    addNotification('admin', 'New Platform Review', `${review.displayName} gave us ${review.rating} stars!`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 flex flex-col transition-all duration-500 ease-in-out">
      
      {/* Global Toast */}
      {activeToast && (
        <div className="fixed top-24 right-4 md:right-8 z-[100] w-full max-w-sm animate-in slide-in-from-right-8 duration-500">
          <div className={`p-5 rounded-3xl shadow-2xl border flex gap-4 glass dark:dark-glass ${
            activeToast.type === 'success' ? 'border-green-500/30' : 
            activeToast.type === 'error' ? 'border-red-500/30' : 
            activeToast.type === 'warning' ? 'border-amber-500/30' : 'border-indigo-500/30'
          }`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              activeToast.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 
              activeToast.type === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 
              activeToast.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30'
            }`}>
              {activeToast.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : 
               activeToast.type === 'error' ? <AlertCircle className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm font-black text-slate-950 dark:text-white leading-tight mb-1">{activeToast.title}</p>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 line-clamp-2">{activeToast.message}</p>
            </div>
            <button onClick={() => setActiveToast(null)} className="h-fit p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Live Chat */}
      <div className="fixed bottom-8 right-8 z-[100] group">
         <div className="absolute bottom-full right-0 mb-4 px-5 py-3 glass dark:dark-glass rounded-2xl border border-slate-100 dark:border-white/10 shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
            <p className="text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-widest flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               Need Help? Chat with us
            </p>
         </div>
         <a 
           href="https://wa.me/8801700000000" 
           target="_blank" 
           rel="noopener noreferrer"
           className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-95 transition-all duration-300 animate-whatsapp relative z-10"
         >
           <MessageCircle className="w-8 h-8 fill-white" />
         </a>
      </div>

      <header className="sticky top-0 z-50 glass dark:dark-glass border-b border-slate-200 dark:border-white/10 shadow-lg transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center cursor-pointer group" onClick={() => navigateTo('home')}>
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300 mr-3.5">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white transition-colors">
                Time Task <span className="text-indigo-600">BD</span>
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-10">
              <div className="flex items-center gap-10">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'blog', label: 'Blog' },
                  { id: 'about', label: 'About' },
                  { id: 'contact', label: 'Contact Us' }
                ].map(link => (
                  <button 
                    key={link.id}
                    onClick={() => navigateTo(link.id as any)} 
                    className={`text-[12px] font-black tracking-widest transition-all uppercase px-1 py-1 relative group ${
                      currentView === link.id || (link.id === 'blog' && currentView === 'blog-post')
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                  >
                    {link.label}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 ${currentView === link.id || (link.id === 'blog' && currentView === 'blog-post') ? 'w-[85%]' : 'w-0 group-hover:w-[85%]'}`}></span>
                  </button>
                ))}
              </div>
              
              <div className="h-8 w-px bg-slate-300 dark:bg-white/10 mx-2"></div>

              <div className="flex items-center gap-6">
                {currentUser ? (
                  <div className="flex items-center gap-4">
                    <div className="relative" ref={notifRef}>
                      <button 
                        onClick={() => {
                          setNotifMenuOpen(!notifMenuOpen);
                          setProfileMenuOpen(false);
                        }} 
                        className={`p-3 rounded-full transition-all duration-300 relative flex items-center justify-center ${
                          notifMenuOpen 
                          ? 'bg-indigo-600 text-white shadow-lg' 
                          : 'bg-slate-100 dark:bg-white/10 text-slate-950 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20'
                        }`}
                      >
                        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-tada' : ''}`} />
                        {unreadCount > 0 && (
                          <span className={`absolute -top-1 -right-1 w-5 h-5 text-[9px] font-black rounded-full flex items-center justify-center ring-2 transition-all ${
                            notifMenuOpen ? 'bg-white text-indigo-600 ring-indigo-600' : 'bg-red-500 text-white ring-white dark:ring-[#020617] animate-pulse'
                          }`}>
                            {unreadCount}
                          </span>
                        )}
                      </button>
                      
                      {notifMenuOpen && (
                        <div className="absolute top-full right-0 mt-5 w-80 bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-white/10 overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300 z-[100]">
                          <div className="p-7 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                            <h4 className="text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-widest">Market Alerts</h4>
                            <button onClick={clearNotifications} className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline flex items-center gap-1">
                               <Trash2 className="w-3 h-3" /> Clear
                            </button>
                          </div>
                          <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                            {userNotifications.length === 0 ? (
                              <div className="p-20 text-center">
                                <Bell className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No New Alerts</p>
                              </div>
                            ) : (
                              userNotifications.map(n => (
                                <div key={n.id} onClick={() => markNotifAsRead(n.id)} className={`p-6 border-b border-slate-50 dark:border-white/5 last:border-none cursor-pointer transition-all duration-300 ${!n.read ? 'bg-indigo-50/40 dark:bg-indigo-500/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                                  <p className="text-[11px] font-black text-slate-950 dark:text-white mb-1.5 leading-tight">{n.title}</p>
                                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed mb-2">{n.message}</p>
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-60">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={toggleTheme}
                      className="p-3 rounded-full bg-slate-100 dark:bg-white/10 text-slate-950 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-all border border-transparent dark:border-white/10"
                    >
                      {theme === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-400" />}
                    </button>

                    <div className="relative ml-2" ref={profileRef}>
                      <div className="profile-glow-container">
                        <button 
                          onClick={() => {
                            setProfileMenuOpen(!profileMenuOpen);
                            setNotifMenuOpen(false);
                          }} 
                          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 overflow-hidden bg-white dark:bg-slate-800 ${profileMenuOpen ? 'ring-2 ring-indigo-500' : ''}`}
                        >
                          <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-black text-sm uppercase">
                            {currentUser.displayName[0]}
                          </div>
                        </button>
                      </div>

                      {profileMenuOpen && (
                        <div className="absolute top-full right-0 mt-6 w-80 bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300 z-[100]">
                          <div className="p-8 bg-slate-50 dark:bg-white/5 border-b border-slate-50 dark:border-white/5 text-center">
                             <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg mx-auto mb-4">
                               {currentUser.displayName[0]}
                             </div>
                             <h4 className="text-[14px] font-black text-slate-950 dark:text-white truncate mb-1">{currentUser.displayName}</h4>
                             <p className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">{currentUser.role === 'admin' ? 'Platform Administrator' : 'Verified Merchant'}</p>
                             
                             <div className="mt-6 bg-white dark:bg-slate-900 p-5 rounded-[1.75rem] border border-slate-100 dark:border-white/10 shadow-sm flex items-center justify-between">
                                <div className="text-left space-y-0.5">
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Earned Credit</p>
                                  <p className="text-xl font-black text-slate-950 dark:text-white tracking-tighter">৳{currentUser.balance.toFixed(2)}</p>
                                </div>
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                  <Wallet className="w-6 h-6" />
                                </div>
                             </div>
                          </div>

                          <div className="p-4 space-y-1.5">
                             <button onClick={() => navigateTo('dashboard')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${currentView === 'dashboard' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-indigo-600'}`}>
                                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                             </button>
                             {currentUser.role === 'admin' && (
                               <button onClick={() => navigateTo('admin')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${currentView === 'admin' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-indigo-600'}`}>
                                  <ShieldCheck className="w-4 h-4" /> Admin Controls
                               </button>
                             )}
                             <button onClick={() => navigateTo('contact')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${currentView === 'contact' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-indigo-600'}`}>
                                <MessageCircle className="w-4 h-4" /> Contact Support
                             </button>
                          </div>

                          <div className="p-4 border-t border-slate-50 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
                               <LogOut className="w-4 h-4" /> End Session
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={toggleTheme}
                      className="p-3 rounded-full bg-slate-100 dark:bg-white/10 text-slate-950 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
                    >
                      {theme === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-400" />}
                    </button>
                    <button onClick={() => navigateTo('login')} className="text-[12px] font-black uppercase tracking-wider text-slate-950 dark:text-white hover:text-indigo-600 transition-colors">Login</button>
                    <button onClick={() => navigateTo('register')} className="px-9 py-3.5 bg-indigo-600 text-white text-[12px] font-black rounded-full shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 hover:translate-y-[-2px] transition-all tracking-widest uppercase">Start Earning</button>
                  </div>
                )}
              </div>
            </nav>

            <div className="lg:hidden flex items-center gap-4">
              <button onClick={toggleTheme} className="p-3 text-slate-950 dark:text-white bg-slate-100 dark:bg-white/10 rounded-full transition-colors">
                {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-3 text-slate-950 dark:text-white bg-slate-100 dark:bg-white/10 rounded-full transition-colors">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#080d18] border-b border-slate-100 dark:border-white/5 p-10 space-y-8 shadow-2xl animate-in slide-in-from-top-6 duration-300 z-[100]">
            <div className="grid grid-cols-1 gap-4">
              {['home', 'blog', 'about', 'contact'].map(link => (
                <button key={link} onClick={() => navigateTo(link as any)} className={`py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest text-center transition-all ${currentView === link || (link === 'blog' && currentView === 'blog-post') ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-950 dark:text-slate-100'}`}>
                  {link === 'contact' ? 'Contact Us' : link.charAt(0).toUpperCase() + link.slice(1)}
                </button>
              ))}
            </div>
            <hr className="border-slate-50 dark:border-white/10" />
            {!currentUser ? (
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => navigateTo('login')} className="py-5 font-black uppercase text-[11px] tracking-widest text-slate-950 dark:text-white bg-slate-100 dark:bg-white/5 rounded-2xl">Login</button>
                <button onClick={() => navigateTo('register')} className="py-5 font-black uppercase text-[11px] tracking-widest text-white bg-indigo-600 rounded-2xl">Register</button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center gap-6 p-7 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-inner">
                   <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg">{currentUser.displayName[0]}</div>
                   <div>
                      <p className="text-[12px] font-black text-slate-950 dark:text-white uppercase tracking-tight mb-0.5">{currentUser.displayName}</p>
                      <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">৳{currentUser.balance.toFixed(2)}</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <button onClick={() => navigateTo('dashboard')} className="flex items-center justify-center gap-4 py-5 bg-indigo-600 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-xl">
                    <LayoutDashboard className="w-5 h-5" /> Dashboard Home
                  </button>
                  {currentUser.role === 'admin' && (
                    <button onClick={() => navigateTo('admin')} className="flex items-center justify-center gap-4 py-5 bg-slate-900 dark:bg-slate-700 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl">
                      <ShieldCheck className="w-5 h-5" /> Admin Panel
                    </button>
                  )}
                  <button onClick={handleLogout} className="flex items-center justify-center gap-4 py-5 bg-red-50 dark:bg-red-900/10 text-red-600 font-black uppercase text-[11px] tracking-widest rounded-2xl">
                    <LogOut className="w-5 h-5" /> Logout Session
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-grow transition-colors duration-500">
        {currentView === 'home' && <HomeView assignments={assignments} reviews={reviews} prices={prices} stats={stats} leaderboard={leaderboardData} onJoin={() => navigateTo(currentUser ? 'dashboard' : 'register')} onNavigate={navigateTo} />}
        {currentView === 'dashboard' && currentUser && <DashboardView assignments={assignments} user={currentUser} prices={prices} submissions={submissions.filter(s => s.userId === currentUser.uid)} withdrawals={withdrawals.filter(w => w.userId === currentUser.uid)} onNewSubmission={handleSubmission} onNewWithdrawal={handleWithdrawalRequest} onUpdateUser={handleUpdateUser} onResubmit={() => {}} isLoading={false} onNewReview={handleNewReview} />}
        {currentView === 'admin' && currentUser?.role === 'admin' && <AdminView prices={prices} assignments={assignments} submissions={submissions} onUpdatePrices={setPrices} onProcessSubmission={handleProcessSubmission} onProcessWithdrawal={handleProcessWithdrawal} onCreateAssignment={handleCreateAssignment} withdrawals={withdrawals} users={users} onUnlockUser={handleUnlockUser} isLoading={false} />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'blog' && <BlogView onReadPost={handleOpenPost} />}
        {currentView === 'blog-post' && selectedPost && <BlogPostView post={selectedPost} onBack={() => navigateTo('blog')} />}
        {currentView === 'contact' && <ContactView />}
        {(currentView === 'login' || currentView === 'register') && <AuthView type={currentView} onSuccess={(u) => { setUsers(prev => [...prev.filter(existing => existing.uid !== u.uid), u]); setCurrentUser(u); localStorage.setItem('ttbd_user', JSON.stringify(u)); navigateTo('dashboard'); }} />}
      </main>

      <footer className="bg-[#020617] text-slate-500 py-24 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-8">
              <div className="bg-indigo-600 p-3 rounded-2xl mr-4"><TrendingUp className="w-6 h-6 text-white" /></div>
              <span className="text-3xl font-black text-white tracking-tight">Time Task <span className="text-indigo-500">BD</span></span>
            </div>
            <p className="text-[15px] leading-relaxed max-w-md mb-8 font-medium text-slate-400">The premier digital asset ecosystem in Bangladesh. Empowering verified merchants through secure marketplace operations and real-time market insights.</p>
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-indigo-600 transition-all cursor-pointer"><Facebook className="w-5 h-5 text-white" /></div>
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-sky-500 transition-all cursor-pointer"><Twitter className="w-5 h-5 text-white" /></div>
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-pink-600 transition-all cursor-pointer"><Instagram className="w-5 h-5 text-white" /></div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-[11px] mb-10">Ecosystem Link</h4>
            <ul className="space-y-5 text-[12px] font-black uppercase tracking-wider">
              <li><button onClick={() => navigateTo('home')} className="hover:text-indigo-400 transition-all">Platform Home</button></li>
              <li><button onClick={() => navigateTo('blog')} className="hover:text-indigo-400 transition-all">Market Intelligence</button></li>
              <li><button onClick={() => navigateTo('contact')} className="hover:text-indigo-400 transition-all">Merchant Support</button></li>
              <li><button onClick={() => navigateTo('about')} className="hover:text-indigo-400 transition-all">Our Mission</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-[11px] mb-10">Safe Harbor</h4>
            <ul className="space-y-5 text-[12px] font-black uppercase tracking-wider text-slate-400">
              <li><button className="hover:text-indigo-400 transition-all">Terms of Service</button></li>
              <li><button className="hover:text-indigo-400 transition-all">Privacy Shield</button></li>
              <li><button className="hover:text-indigo-400 transition-all">Asset Verification</button></li>
              <li><button className="hover:text-indigo-400 transition-all">Payout Guidelines</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
          <div>&copy; {new Date().getFullYear()} Time Task BD. Distributed Autonomous Network.</div>
          <div className="flex gap-12">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Network Healthy</span>
            <span>Uptime: 99.98%</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
