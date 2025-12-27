
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, PlatformPrice, Submission, WithdrawalRequest, UserPaymentMethod, Review, MarketAssignment } from '../types';
import { PAYOUT_CONFIG } from '../constants';
import { 
  Send, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  X,
  TrendingUp,
  ArrowDownCircle,
  Settings,
  Zap,
  FileSpreadsheet,
  Loader2,
  History,
  ArrowUpCircle,
  Link as LinkIcon,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ShieldCheck,
  ListTodo,
  ExternalLink,
  RotateCcw,
  Star,
  MessageSquare,
  MessageCircle,
  ShieldEllipsis,
  Info,
  Banknote,
  Lock,
  KeyRound,
  ShieldAlert,
  Fingerprint,
  Target,
  Rocket
} from 'lucide-react';

interface Props {
  user: User;
  prices: PlatformPrice[];
  submissions: Submission[];
  withdrawals: WithdrawalRequest[];
  assignments: MarketAssignment[];
  onNewSubmission: (sub: Omit<Submission, 'id' | 'status' | 'submittedAt' | 'userId' | 'userEmail'>) => void;
  onNewWithdrawal: (req: { amount: number; method: string; address: string }) => void;
  onUpdateUser: (updatedUser: User) => void;
  onResubmit?: (id: string, newLink: string) => void;
  isLoading?: boolean;
  onNewReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
}

const DashboardView: React.FC<Props> = ({ user, prices, submissions, withdrawals, assignments, onNewSubmission, onNewWithdrawal, onUpdateUser, onResubmit, isLoading, onNewReview }) => {
  const [platformId, setPlatformId] = useState(prices?.[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [sheetLink, setSheetLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [historyTab, setHistoryTab] = useState<'submissions' | 'withdrawals'>('submissions');

  const [showSetupModal, setShowSetupModal] = useState<UserPaymentMethod | null>(null);
  const [setupName, setSetupName] = useState('');
  const [setupNumber, setSetupNumber] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [verifyPinInput, setVerifyPinInput] = useState('');
  const [countdown, setCountdown] = useState<string | null>(null);

  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Review States
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const userMethods = useMemo(() => {
    const existing = user?.paymentMethods || [];
    return (PAYOUT_CONFIG || []).map(config => {
      const found = existing.find(m => m.id === config.id);
      return found || {
        id: config.id,
        methodName: config.name,
        accountName: '',
        accountNumber: '',
        isConfigured: false
      };
    });
  }, [user?.paymentMethods]);

  const activePrices = (prices || []).filter(p => p.status === 'buying');
  const activeMethod = userMethods[activeSlide];

  const activeAssignments = useMemo(() => {
    return (assignments || []).filter(a => a.status === 'active');
  }, [assignments]);

  const isLockedByTime = useMemo(() => {
    if (!user?.pinResetAt) return false;
    const lockDuration = 24 * 60 * 60 * 1000;
    const timePassed = Date.now() - user.pinResetAt;
    return timePassed < lockDuration;
  }, [user?.pinResetAt]);

  const isLockedBySecurity = !!user?.isWithdrawLocked;

  useEffect(() => {
    if (!isLockedByTime || !user?.pinResetAt) {
      setCountdown(null);
      return;
    }
    const timer = setInterval(() => {
      const remaining = (user.pinResetAt! + 24 * 60 * 60 * 1000) - Date.now();
      if (remaining <= 0) {
        setCountdown(null);
        clearInterval(timer);
      } else {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((remaining % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${mins}m ${secs}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isLockedByTime, user?.pinResetAt]);

  const stats = useMemo(() => {
    const subs = submissions || [];
    const withds = withdrawals || [];
    const totalEarned = subs
      .filter(s => s.status === 'approved')
      .reduce((acc, curr) => acc + ((curr.verifiedQuantity ?? curr.quantity) * curr.pricePerUnit), 0);
    const totalWithdrawn = withds
      .filter(w => w.status === 'paid')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const pendingEarnings = subs
      .filter(s => s.status === 'pending')
      .reduce((acc, curr) => acc + (curr.quantity * curr.pricePerUnit), 0);
    return { totalEarned, totalWithdrawn, pendingEarnings };
  }, [submissions, withdrawals]);

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetLink) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onNewSubmission({ 
        platformId, 
        platformName: activePrices.find(p=>p.id===platformId)?.name || '', 
        quantity, 
        pricePerUnit: activePrices.find(p=>p.id===platformId)?.todayPrice || 0, 
        details: `Batch: ${new Date().toLocaleDateString()}`, 
        sheetLink 
      });
      setIsSubmitting(false);
      setSuccessMsg('Task Submitted Successfully');
      setSheetLink('');
      setQuantity(1);
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 1200);
  };

  const handleSetupSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSetupModal) return;
    const updatedMethods = userMethods.map(m => 
      m.id === showSetupModal.id ? { ...m, accountName: setupName, accountNumber: setupNumber, isConfigured: true } : m
    );
    onUpdateUser({ ...user, paymentMethods: updatedMethods });
    setShowSetupModal(null);
    setSetupName('');
    setSetupNumber('');
  };

  const handleSetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput !== confirmPinInput) {
      alert("PINs do not match!");
      return;
    }
    if (pinInput.length < 4) {
      alert("PIN must be at least 4 digits.");
      return;
    }
    const isReset = !!user?.paymentPin;
    const updatedUser = { 
      ...user, 
      paymentPin: pinInput,
      pinResetAt: isReset ? Date.now() : undefined,
      failedPinAttempts: 0,
      isWithdrawLocked: false
    };
    onUpdateUser(updatedUser);
    setShowPinModal(false);
    setPinInput('');
    setConfirmPinInput('');
    if (isReset) {
      alert("Security PIN reset. Withdrawals are now locked for 24 hours.");
    } else {
      alert("Security PIN setup successful!");
    }
  };

  const handleWithdrawSubmit = () => {
    if (isLockedBySecurity) return;
    if (isLockedByTime) return;

    if (!user?.paymentPin) {
      setShowPinModal(true);
      return;
    }

    if (verifyPinInput !== user.paymentPin) {
      const currentAttempts = (user.failedPinAttempts || 0) + 1;
      const remaining = 3 - currentAttempts;
      
      if (currentAttempts >= 3) {
        onUpdateUser({ ...user, isWithdrawLocked: true, failedPinAttempts: currentAttempts });
        alert("CRITICAL ERROR: Too many incorrect attempts. Your withdrawal access is now LOCKED. Please contact support via WhatsApp/Telegram to verify your identity.");
      } else {
        onUpdateUser({ ...user, failedPinAttempts: currentAttempts });
        alert(`SECURITY WARNING: Incorrect PIN! You have ${remaining} attempts remaining before an account lock.`);
      }
      setVerifyPinInput('');
      return;
    }

    if (!activeMethod || !activeMethod.isConfigured) {
      alert('Please setup your account details first.');
      return;
    }
    if (withdrawAmount < 100) {
      alert('Minimum withdrawal ৳100.00');
      return;
    }
    if (withdrawAmount > user.balance) {
      alert('Insufficient balance.');
      return;
    }

    setIsWithdrawing(true);
    setTimeout(() => {
      onNewWithdrawal({ 
        amount: withdrawAmount, 
        method: activeMethod.methodName, 
        address: `${activeMethod.accountName} (${activeMethod.accountNumber})` 
      });
      setIsWithdrawing(false);
      setWithdrawAmount(0);
      setVerifyPinInput('');
      // Reset failed attempts on successful unlock
      onUpdateUser({ ...user, failedPinAttempts: 0 });
    }, 1000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) {
       alert("Please select a star rating first.");
       return;
    }
    onNewReview({
       userId: user.uid,
       displayName: user.displayName,
       rating: userRating,
       comment: reviewComment,
       location: 'User Dashboard'
    });
    alert("Thank you for your review! It has been submitted to the platform.");
    setUserRating(0);
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      
      {/* Active Assignments Banner */}
      {activeAssignments.length > 0 && (
        <div className="bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden border border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/10 rounded-[1.75rem] flex items-center justify-center text-indigo-400">
                   <Target className="w-9 h-9" />
                </div>
                <div>
                   <h2 className="text-2xl font-black tracking-tight mb-1">Active Market Assignments</h2>
                   <p className="text-slate-400 font-medium text-sm">Targeted goals set by administrators with guaranteed priority processing.</p>
                </div>
             </div>
             <div className="flex flex-wrap gap-4 justify-center md:justify-end flex-1">
                {activeAssignments.map(asgn => (
                   <div key={asgn.id} className="bg-white/5 border border-white/10 p-5 rounded-[2rem] min-w-[200px] flex-1 max-w-[300px]">
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{asgn.platformName}</span>
                         <span className="text-[10px] font-black text-slate-500">{Math.round((asgn.currentQuantity / asgn.targetQuantity) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                         <div 
                           className="h-full bg-indigo-500 transition-all duration-1000" 
                           style={{ width: `${(asgn.currentQuantity / asgn.targetQuantity) * 100}%` }}
                         ></div>
                      </div>
                      <p className="text-sm font-black tracking-tight">Need {asgn.targetQuantity - asgn.currentQuantity} more units</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Reward: ৳{asgn.pricePerUnit}/unit</p>
                   </div>
                ))}
             </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center transition-all hover:translate-y-[-2px]">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mr-4"><TrendingUp className="w-6 h-6" /></div>
          <div><p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Total Earned</p><h4 className="text-xl font-black text-slate-900 dark:text-white">৳{stats.totalEarned.toFixed(2)}</h4></div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center transition-all hover:translate-y-[-2px]">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-4"><ArrowDownCircle className="w-6 h-6" /></div>
          <div><p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Total Withdrawn</p><h4 className="text-xl font-black text-slate-900 dark:text-white">৳{stats.totalWithdrawn.toFixed(2)}</h4></div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center transition-all hover:translate-y-[-2px]">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4"><Clock className="w-6 h-6" /></div>
          <div><p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Pending Review</p><h4 className="text-xl font-black text-slate-900 dark:text-white">৳{stats.pendingEarnings.toFixed(2)}</h4></div>
        </div>
        <div className="bg-indigo-600 p-6 rounded-[2rem] border border-indigo-700 shadow-lg flex items-center text-white transition-all hover:translate-y-[-2px]">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mr-4"><Wallet className="w-6 h-6" /></div>
          <div><p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-0.5">Available Balance</p><h4 className="text-xl font-black">৳{user?.balance.toFixed(2)}</h4></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-1 border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col relative overflow-hidden h-full">
          <div className="p-9 flex flex-col h-full space-y-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none"><ArrowUpCircle className="w-6 h-6 text-white" /></div>
                <div><h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Withdraw Funds</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Payout Gateway</p></div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-widest border border-slate-100 dark:border-slate-700">Secured <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 ml-1" /></div>
            </div>

            {isLockedBySecurity ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-10 space-y-8 animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 shadow-2xl shadow-red-200 dark:shadow-none">
                  <ShieldAlert className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Security Lock Active</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Your withdrawal access has been automatically restricted due to 3 failed PIN attempts. To restore access, verify your identity with our admin support team.</p>
                </div>
                <div className="flex flex-col w-full gap-4">
                   <a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-green-500 text-white font-black rounded-2xl shadow-xl hover:bg-green-600 transition-all flex items-center justify-center gap-3">
                      <MessageCircle className="w-6 h-6" /> Contact via WhatsApp
                   </a>
                   <a href="https://t.me/timetaskbd" target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-slate-900 dark:bg-slate-800 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
                      <Send className="w-6 h-6" /> Support on Telegram
                   </a>
                </div>
              </div>
            ) : isLockedByTime ? (
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-[2.5rem] p-10 border border-amber-100 dark:border-amber-900/20 text-center space-y-6 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center text-amber-600 mx-auto">
                  <Clock className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight">Temporary Cooldown</h4>
                  <p className="text-sm font-medium text-amber-700/70 dark:text-amber-300/60 px-4">Withdrawals are disabled for 24 hours after a PIN change for account protection.</p>
                </div>
                <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/20 shadow-inner">
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Unlocks In</p>
                  <p className="text-4xl font-black text-amber-600 font-mono tracking-tighter">{countdown}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Select Payment Gateway</p>
                    <button onClick={() => setShowPinModal(true)} className="text-[9px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-indigo-100 dark:border-indigo-800/40 flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5" /> {user?.paymentPin ? 'Reset PIN' : 'Setup PIN'}
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50/50 dark:bg-slate-950/20">
                      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                        {(userMethods || []).map((method) => {
                          const config = PAYOUT_CONFIG.find(c => c.id === method.id);
                          return (
                            <div key={method.id} className="w-full flex-shrink-0 p-3">
                              <div 
                                className="relative overflow-hidden rounded-[2.5rem] p-8 h-full transition-all duration-500 min-h-[220px]"
                                style={{ backgroundColor: config?.color + '08', border: `1px solid ${config?.color}15` }}
                              >
                                <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-30" style={{ backgroundColor: config?.color }}></div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                  <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg border border-white dark:border-slate-800">
                                      {React.cloneElement(config?.icon as React.ReactElement<any>, { className: 'w-7 h-7', style: { color: config?.color } })}
                                    </div>
                                    <div>
                                      <h4 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">{method.methodName}</h4>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Instant Transfer Active</p>
                                    </div>
                                  </div>
                                  <button onClick={() => { setSetupName(method.accountName); setSetupNumber(method.accountNumber); setShowSetupModal(method); }} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md hover:bg-indigo-600 hover:text-white transition-all text-slate-400">
                                    <Settings className="w-6 h-6" />
                                  </button>
                                </div>
                                <div className="space-y-4 relative z-10">
                                  <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[2rem] border border-white dark:border-slate-800/40 flex flex-col justify-center">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receiver Address</span>
                                      {method.isConfigured ? (
                                        <span className="flex items-center gap-1.5 text-[9px] font-black text-green-500 uppercase tracking-widest"><CheckCircle2 className="w-3 h-3" /> Linked</span>
                                      ) : (
                                        <span className="flex items-center gap-1.5 text-[9px] font-black text-amber-500 uppercase tracking-widest"><AlertCircle className="w-3 h-3" /> Not Configured</span>
                                      )}
                                    </div>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-widest font-mono">{method.accountNumber || '01XXXXXXXXX'}</p>
                                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase">{method.accountName || 'No Holder Name'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <button onClick={() => setActiveSlide(prev => (prev === 0 ? userMethods.length - 1 : prev - 1))} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-11 h-11 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-900 dark:text-white shadow-2xl border border-slate-100 dark:border-slate-700 hover:scale-110 opacity-0 group-hover:opacity-100 transition-all z-20"><ChevronLeft className="w-5 h-5" /></button>
                    <button onClick={() => setActiveSlide(prev => (prev === userMethods.length - 1 ? 0 : prev + 1))} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-11 h-11 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-900 dark:text-white shadow-2xl border border-slate-100 dark:border-slate-700 hover:scale-110 opacity-0 group-hover:opacity-100 transition-all z-20"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="flex-grow flex flex-col space-y-7">
                  <div className="bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400"><Fingerprint className="w-5 h-5" /></div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Security Intelligence</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Guard (Attempts: {user?.failedPinAttempts || 0}/3)</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Minimum Limit</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">৳100.00</p>
                      </div>
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Maximum Balance</p>
                        <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">৳{user?.balance.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Enter Payout Amount</p>
                        <div className="flex gap-2">
                          {[50, 100].map(pct => (
                            <button key={pct} onClick={() => setWithdrawAmount(Number((user?.balance * (pct/100)).toFixed(2)))} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-400 uppercase rounded-lg hover:bg-indigo-600 hover:text-white transition-all">{pct}%</button>
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-300 dark:text-slate-700">৳</span>
                        <input type="number" value={withdrawAmount || ''} onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))} placeholder="0.00" className="w-full pl-16 pr-8 py-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.25rem] outline-none focus:border-indigo-600 font-black text-4xl text-slate-900 dark:text-white shadow-inner transition-all" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] px-1">Verify Security PIN</p>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input type="password" maxLength={6} value={verifyPinInput} onChange={(e) => setVerifyPinInput(e.target.value)} placeholder="••••••" className="w-full pl-16 pr-8 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-2xl font-black tracking-[1em] dark:text-white transition-all" />
                      </div>
                    </div>

                    <button onClick={handleWithdrawSubmit} disabled={isWithdrawing || withdrawAmount < 100 || !activeMethod?.isConfigured || !verifyPinInput} className="w-full py-7 bg-indigo-600 text-white font-black rounded-[2.5rem] shadow-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50 text-xl flex items-center justify-center gap-4">
                      {isWithdrawing ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Zap className="w-6 h-6 fill-white" /> Confirm Withdrawal</>}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8 h-full">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3"><Send className="w-6 h-6 text-indigo-600" /> Submit Asset Batch</h3>
              {successMsg && (
                <div className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 animate-in fade-in slide-in-from-right-2"><CheckCircle2 className="w-3 h-3 mr-1.5 inline" /> {successMsg}</div>
              )}
            </div>
            <form onSubmit={handleTaskSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Asset Category</label>
                  <div className="relative">
                    <select value={platformId} onChange={(e) => setPlatformId(e.target.value)} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 dark:text-slate-300 appearance-none">
                      {activePrices.map(p => <option key={p.id} value={p.id}>{p.name} (৳{p.todayPrice})</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Quantity (Units)</label>
                  <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-black text-slate-800 dark:text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Google Sheet Link</label>
                <div className="relative">
                   <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                   <input required type="url" placeholder="https://docs.google.com/spreadsheets/d/..." value={sheetLink} onChange={(e) => setSheetLink(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 dark:text-white" />
                </div>
              </div>
              <button disabled={isSubmitting || !sheetLink} type="submit" className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all disabled:opacity-50 text-lg flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />} Start Verification
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden group flex-grow flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full"></div>
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-500"><Star className="w-6 h-6 fill-amber-500" /></div>
               <div><h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Rate Your Experience</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Community Rating</p></div>
            </div>
            <form onSubmit={handleReviewSubmit} className="flex-grow flex flex-col justify-between space-y-6">
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setUserRating(s)} className="transition-transform hover:scale-125 focus:outline-none">
                    <Star className={`w-10 h-10 md:w-12 md:h-12 transition-colors ${s <= userRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-800 hover:text-amber-300'}`} />
                  </button>
                ))}
              </div>
              <div className="relative flex-grow min-h-[120px]">
                <MessageSquare className="absolute left-5 top-5 w-5 h-5 text-slate-400" />
                <textarea 
                  required 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience selling with us..." 
                  className="w-full h-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] resize-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white" 
                />
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]">
                Submit Platform Review
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-8 mb-4 md:mb-0">
            <button onClick={() => setHistoryTab('submissions')} className={`flex items-center gap-3 pb-3 transition-all relative group ${historyTab === 'submissions' ? 'text-indigo-600 font-black' : 'text-slate-400 font-bold hover:text-slate-600 dark:hover:text-slate-200'}`}>
              <ListTodo className={`w-5 h-5 ${historyTab === 'submissions' ? 'text-indigo-600' : ''}`} /> Task Ledger
              {historyTab === 'submissions' && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full"></span>}
            </button>
            <button onClick={() => setHistoryTab('withdrawals')} className={`flex items-center gap-3 pb-3 transition-all relative group ${historyTab === 'withdrawals' ? 'text-indigo-600 font-black' : 'text-slate-400 font-bold hover:text-slate-600 dark:hover:text-slate-200'}`}>
              <History className={`w-5 h-5 ${historyTab === 'withdrawals' ? 'text-indigo-600' : ''}`} /> Payout History
              {historyTab === 'withdrawals' && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full"></span>}
            </button>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">{historyTab === 'submissions' ? `${(submissions || []).length} Total Submissions` : `${(withdrawals || []).length} Total Payouts`}</span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          {historyTab === 'submissions' ? (
            <table className="w-full text-left min-w-[1000px] table-fixed">
              <thead><tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800"><th className="w-[12%] px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th><th className="w-[12%] px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</th><th className="w-[16%] px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sheet Link</th><th className="w-[10%] px-4 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Batch</th><th className="w-[8%] px-4 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Valid</th><th className="w-[8%] px-4 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Fail</th><th className="w-[12%] px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Payout</th><th className="w-[12%] px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th><th className="w-[10%] px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th></tr></thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {(submissions || []).map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all">
                    <td className="px-8 py-6"><p className="font-black text-[11px] text-slate-900 dark:text-slate-100">{new Date(sub.submittedAt).toLocaleDateString()}</p></td>
                    <td className="px-6 py-6 text-[11px] font-black uppercase">{sub.platformName}</td>
                    <td className="px-6 py-6"><a href={sub.sheetLink} target="_blank" className="text-indigo-600 underline text-[9px] truncate block">View Data</a></td>
                    <td className="px-4 py-6 text-center font-black">{sub.quantity}</td>
                    <td className="px-4 py-6 text-center font-black text-green-600">{sub.verifiedQuantity || 0}</td>
                    <td className="px-4 py-6 text-center font-black text-red-500">{sub.failedQuantity || 0}</td>
                    <td className="px-6 py-6 text-center font-black text-indigo-600">৳{((sub.verifiedQuantity || 0) * sub.pricePerUnit).toFixed(1)}</td>
                    <td className="px-6 py-6 text-center"><span className="text-[8px] font-black uppercase px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">{sub.status}</span></td>
                    <td className="px-8 py-6 text-right"><span className="text-slate-300">--</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left min-w-[800px]">
              <thead><tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800"><th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th><th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th><th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Gateway</th><th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {(withdrawals || []).map(wd => (
                  <tr key={wd.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all">
                    <td className="px-10 py-8 text-xs font-black">{new Date(wd.createdAt).toLocaleDateString()}</td>
                    <td className="px-10 py-8 font-black text-2xl tracking-tighter">৳{wd.amount.toFixed(2)}</td>
                    <td className="px-10 py-8 text-center"><span className="text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg">{wd.method}</span></td>
                    <td className="px-10 py-8 text-right font-black text-[9px] uppercase">{wd.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showSetupModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowSetupModal(null)}></div>
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-md shadow-2xl relative z-10 animate-in zoom-in duration-300 border border-slate-100 dark:border-slate-800">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Setup {showSetupModal.methodName}</h3>
              <button onClick={() => setShowSetupModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSetupSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Holder Name</label>
                <input required type="text" value={setupName} onChange={(e)=>setSetupName(e.target.value)} placeholder="e.g. Rakib Hasan" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none font-bold dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number / Wallet ID</label>
                <input required type="text" value={setupNumber} onChange={(e)=>setSetupNumber(e.target.value)} placeholder="01XXXXXXXXX" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none font-black text-xl dark:text-white" />
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all text-lg shadow-xl">Save Gateway Details</button>
            </form>
          </div>
        </div>
      )}

      {showPinModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setShowPinModal(false)}></div>
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-md shadow-2xl relative z-10 animate-in zoom-in duration-300 border border-slate-100 dark:border-slate-800 p-10">
            <div className="text-center space-y-4 mb-8">
               <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto"><KeyRound className="w-8 h-8" /></div>
               <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user?.paymentPin ? 'Reset Security PIN' : 'Setup Security PIN'}</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                 {user?.paymentPin ? 'Warning: Resetting PIN will lock withdrawals for 24 hours.' : 'Create a security PIN to secure your fund withdrawals.'}
               </p>
            </div>
            <form onSubmit={handleSetPin} className="space-y-6">
              <div className="space-y-4">
                <input required type="password" maxLength={6} placeholder="Enter New PIN (4-6 Digits)" value={pinInput} onChange={(e)=>setPinInput(e.target.value)} className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-2xl font-black text-center tracking-[0.5em] dark:text-white" />
                <input required type="password" maxLength={6} placeholder="Confirm New PIN" value={confirmPinInput} onChange={(e)=>setConfirmPinInput(e.target.value)} className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-2xl font-black text-center tracking-[0.5em] dark:text-white" />
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all uppercase tracking-[0.2em] text-xs">Authorize & Save PIN</button>
              <button type="button" onClick={() => setShowPinModal(false)} className="w-full text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">Cancel Request</button>
            </form>
          </div>
        </div>
      )}
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};
export default DashboardView;
