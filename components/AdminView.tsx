
import React, { useState, useMemo } from 'react';
import { PlatformPrice, Submission, WithdrawalRequest, User, MarketAssignment } from '../types';
import { PLATFORMS } from '../constants';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar 
} from 'recharts';
import { 
  ShieldAlert, 
  RefreshCcw, 
  Check, 
  X, 
  Database, 
  DollarSign,
  User as UserIcon,
  Download,
  ExternalLink,
  Clock,
  LayoutDashboard,
  Users as UsersIcon,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
  Hash,
  ArrowUpRight,
  PieChart as PieChartIcon,
  History,
  AlertTriangle,
  ArrowRight,
  FileText,
  Copy,
  FileCheck,
  FileX,
  Calendar,
  Filter,
  Zap,
  ShieldCheck,
  Globe,
  Cpu,
  Fingerprint,
  Lock,
  Unlock,
  Target,
  Plus,
  Rocket,
  Banknote,
  Layers,
  FileSpreadsheet,
  Minus,
  Store,
  Tag,
  Eye,
  Info,
  BadgeCheck,
  Wallet
} from 'lucide-react';

interface Props {
  prices: PlatformPrice[];
  submissions: Submission[];
  withdrawals: WithdrawalRequest[];
  assignments: MarketAssignment[];
  users: User[];
  onUpdatePrices: (prices: PlatformPrice[]) => void;
  onProcessSubmission: (id: string, status: 'approved' | 'rejected', verifiedQty?: number, failedQty?: number) => void;
  onProcessWithdrawal: (id: string, status: 'paid' | 'rejected', txId?: string) => void;
  onCreateAssignment: (asgn: Omit<MarketAssignment, 'id' | 'createdAt' | 'currentQuantity' | 'status'>) => void;
  onUnlockUser: (uid: string) => void;
  isLoading?: boolean;
}

type TimeRange = 'today' | '7d' | '30d';

const AdminView: React.FC<Props> = ({ 
  prices, 
  submissions, 
  withdrawals, 
  assignments,
  users,
  onUpdatePrices, 
  onProcessSubmission,
  onProcessWithdrawal,
  onCreateAssignment,
  onUnlockUser,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'prices' | 'assignments' | 'verifications' | 'payouts' | 'users'>('dashboard');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [editingPrices, setEditingPrices] = useState<PlatformPrice[]>(prices || []);
  const [fulfillmentModal, setFulfillmentModal] = useState<{ id: string; email: string; amount: number; method: string; address: string } | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);
  const [txIdInput, setTxIdInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [verificationInputs, setVerificationInputs] = useState<Record<string, { verified: number; failed: number }>>({});

  // Assignment Form State
  const [asgnPlatformId, setAsgnPlatformId] = useState(prices?.[0]?.id || '');
  const [asgnTarget, setAsgnTarget] = useState(1000);
  const [asgnInstructions, setAsgnInstructions] = useState('');

  const analytics = useMemo(() => {
    const subs = submissions || [];
    const withds = withdrawals || [];
    const approvedSubs = subs.filter(s => s.status === 'approved');
    
    const totalWorkers = new Set(subs.map(s => s.userId)).size;
    const pendingTasks = subs.filter(s => s.status === 'pending');
    const pendingWithdrawals = withds.filter(w => w.status === 'pending');
    
    const platformBreakdown: Record<string, { name: string, totalPaid: number, totalUnits: number, share: number }> = {};
    let totalMarketVolume = 0;
    let grandTotalPaid = 0;

    approvedSubs.forEach(s => {
      const value = (s.verifiedQuantity || s.quantity) * s.pricePerUnit;
      const units = (s.verifiedQuantity || s.quantity);
      
      if (!platformBreakdown[s.platformId]) {
        platformBreakdown[s.platformId] = { name: s.platformName, totalPaid: 0, totalUnits: 0, share: 0 };
      }
      platformBreakdown[s.platformId].totalPaid += value;
      platformBreakdown[s.platformId].totalUnits += units;
      totalMarketVolume += units;
      grandTotalPaid += value;
    });

    Object.keys(platformBreakdown).forEach(id => {
      platformBreakdown[id].share = totalMarketVolume > 0 
        ? (platformBreakdown[id].totalUnits / totalMarketVolume) * 100 
        : 0;
    });

    const approvedCount = subs.filter(s => s.status === 'approved').length;
    const rejectedCount = subs.filter(s => s.status === 'rejected').length;
    const totalDecided = approvedCount + rejectedCount;
    
    const dataAccuracyValue = totalDecided > 0 ? (approvedCount / totalDecided) * 100 : 98;
    const payoutReliabilityValue = withds.length > 0 
      ? (withds.filter(w => w.status === 'paid').length / (withds.filter(w => w.status !== 'pending').length || 1)) * 100 
      : 100;
    const workerEngagementValue = totalWorkers > 0 ? Math.min(95, (totalWorkers / 10) * 100) : 0;

    const totalPayoutValue = withds
      .filter(w => w.status === 'paid')
      .reduce((acc, w) => acc + w.amount, 0);

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const filterMs = timeRange === 'today' ? dayMs : timeRange === '7d' ? 7 * dayMs : 30 * dayMs;
    
    const chartData: any[] = [];
    const points = timeRange === 'today' ? 12 : timeRange === '7d' ? 7 : 15;
    
    for (let i = points - 1; i >= 0; i--) {
      const pointTime = now - (i * (filterMs / points));
      const dateLabel = timeRange === 'today' 
        ? new Date(pointTime).toLocaleTimeString([], { hour: '2-digit' })
        : new Date(pointTime).toLocaleDateString([], { day: '2-digit', month: 'short' });
      
      const subVal = subs.filter(s => s.submittedAt <= pointTime && s.submittedAt > pointTime - (filterMs / points)).length;
      const payVal = withds.filter(w => w.createdAt <= pointTime && w.createdAt > pointTime - (filterMs / points)).reduce((a,b) => a+b.amount, 0);

      chartData.push({ name: dateLabel, submissions: subVal, payouts: payVal });
    }

    const platformDistMap: Record<string, number> = {};
    subs.forEach(s => {
      platformDistMap[s.platformName] = (platformDistMap[s.platformName] || 0) + s.quantity;
    });
    const platformData = Object.entries(platformDistMap).map(([name, value]) => ({ name, value }));

    return { 
      totalWorkers, 
      pendingTasksCount: pendingTasks.length, 
      pendingWithdrawalsCount: pendingWithdrawals.length, 
      totalPayoutValue,
      platformBreakdown: Object.values(platformBreakdown).sort((a,b) => b.totalPaid - a.totalPaid),
      chartData,
      platformData,
      health: { accuracy: dataAccuracyValue, reliability: payoutReliabilityValue, engagement: workerEngagementValue, uptime: 99.98 }
    };
  }, [submissions, withdrawals, timeRange]);

  const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  const handlePostAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const plat = prices.find(p => p.id === asgnPlatformId);
    if (!plat) return;
    onCreateAssignment({
       platformId: asgnPlatformId,
       platformName: plat.name,
       targetQuantity: asgnTarget,
       pricePerUnit: plat.todayPrice,
       instructions: asgnInstructions
    });
    setAsgnTarget(1000);
    setAsgnInstructions('');
    alert('Assignment posted and users notified!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updatePriceValue = (id: string, field: 'todayPrice' | 'regularPrice', delta: number) => {
    setEditingPrices(prev => prev.map(p => {
      if (p.id === id) {
        const newVal = Math.max(0, parseFloat(((p[field] as number) + delta).toFixed(2)));
        return { ...p, [field]: newVal };
      }
      return p;
    }));
  };

  const toggleMarketStatus = (id: string) => {
    setEditingPrices(prev => prev.map(p => 
      p.id === id ? { ...p, status: p.status === 'buying' ? 'closed' : 'buying' } : p
    ));
  };

  const getUserSummary = (uid: string) => {
    const userSubs = submissions.filter(s => s.userId === uid);
    const userWithds = withdrawals.filter(w => w.userId === uid);
    return {
      totalSubmissions: userSubs.length,
      approvedUnits: userSubs.filter(s => s.status === 'approved').reduce((a,b) => a + (b.verifiedQuantity || b.quantity), 0),
      pendingUnits: userSubs.filter(s => s.status === 'pending').reduce((a,b) => a + b.quantity, 0),
      rejectedBatches: userSubs.filter(s => s.status === 'rejected').length,
      totalPayouts: userWithds.filter(w => w.status === 'paid').reduce((a,b) => a + b.amount, 0),
      withdrawalsCount: userWithds.length
    };
  };

  const HealthGauge = ({ label, value, color, icon, desc }: { label: string, value: number, color: string, icon: React.ReactNode, desc: string }) => (
    <div className="flex flex-col items-center p-8 bg-slate-50/50 dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-100/50 dark:border-slate-700/50 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1">
      <div className="relative w-36 h-36 flex items-center justify-center mb-6">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" className="stroke-slate-200 dark:stroke-slate-700 fill-none" strokeWidth="8" />
          <circle cx="50" cy="50" r="44" className="fill-none transition-all duration-1000 ease-out" stroke={color} strokeWidth="8" strokeDasharray={`${value * 2.764} 276.4`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${color}40)` }} />
        </svg>
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-full shadow-lg mb-0.5" style={{ color }}>{React.cloneElement(icon as React.ReactElement, { size: 18 })}</div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{value.toFixed(1)}%</span>
        </div>
      </div>
      <div className="text-center space-y-1">
        <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{label}</h4>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.1em]">{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-slate-200 dark:border-slate-800 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"><ShieldAlert className="w-6 h-6 text-white" /></div>
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] bg-indigo-50 dark:bg-indigo-900/20 px-4 py-1.5 rounded-full">SYSTEM COMMAND CENTER</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Marketplace Operations</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Global administrator dashboard for Time Task BD.</p>
        </div>

        <nav className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-800/60 overflow-x-auto no-scrollbar w-full lg:w-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'assignments', label: 'Assignments', icon: <Target className="w-4 h-4" /> },
            { id: 'verifications', label: 'Verifications', icon: <Activity className="w-4 h-4" />, badge: analytics.pendingTasksCount },
            { id: 'payouts', label: 'Payouts', icon: <CreditCard className="w-4 h-4" />, badge: analytics.pendingWithdrawalsCount },
            { id: 'users', label: 'User Access', icon: <UsersIcon className="w-4 h-4" />, badge: (users || []).filter(u => u.isWithdrawLocked).length },
            { id: 'prices', label: 'Asset Prices', icon: <Store className="w-4 h-4" /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-4 rounded-[1.75rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 relative whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-indigo-600 shadow-xl dark:shadow-none text-indigo-600 dark:text-white' : 'text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              {tab.icon} {tab.label}
              {tab.badge ? <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] ring-4 ring-slate-100 dark:ring-slate-950 font-black">{tab.badge}</span> : null}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-[500px]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3"><TrendingUp className="w-6 h-6 text-indigo-600" /> Marketplace Trend</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Growth Index: {timeRange.toUpperCase()}</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                  {(['today', '7d', '30d'] as TimeRange[]).map(r => (
                    <button key={r} onClick={() => setTimeRange(r)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${timeRange === r ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>{r}</button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.chartData}>
                    <defs>
                      <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                      <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ec4899" stopOpacity={0.2}/><stop offset="95%" stopColor="#ec4899" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800 }} />
                    <Area type="monotone" dataKey="submissions" stroke="#6366f1" strokeWidth={4} fill="url(#subGrad)" />
                    <Area type="monotone" dataKey="payouts" stroke="#ec4899" strokeWidth={4} fill="url(#payGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-[500px]">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3"><PieChartIcon className="w-6 h-6 text-pink-500" /> Platform Share</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Asset Volume Distribution</p>
              </div>
              <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.platformData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={8} dataKey="value">
                      {(analytics.platformData || []).map((_, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3"><Layers className="w-6 h-6 text-indigo-600" /> Platform Performance Index</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Financial Disbursement by Asset Type</p>
               </div>
               <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">Live Breakdown</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {analytics.platformBreakdown.length === 0 ? (
                 <div className="col-span-full py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 text-center">
                    <Banknote className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No verified payout data available yet</p>
                 </div>
               ) : (
                 analytics.platformBreakdown.map((plat, idx) => {
                   const icon = PLATFORMS.find(p => p.name.toLowerCase().includes(plat.name.toLowerCase()))?.icon;
                   return (
                    <div key={plat.name} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                       <div className="flex items-center justify-between mb-6 relative z-10">
                          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                             {icon ? React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' }) : <Layers className="w-6 h-6 text-indigo-600" />}
                          </div>
                          <div className="text-right">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Volume Share</span>
                             <p className="text-lg font-black text-slate-900 dark:text-white">{plat.share.toFixed(1)}%</p>
                          </div>
                       </div>
                       <div className="space-y-4 relative z-10">
                          <div>
                             <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{plat.name}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Approved Workload: {plat.totalUnits.toLocaleString()} units</p>
                          </div>
                          <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                             <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Total Payout Disbursed</span>
                             <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">৳{plat.totalPaid.toLocaleString()}</p>
                          </div>
                          <div className="h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-indigo-600 transition-all duration-1000" 
                               style={{ width: `${plat.share}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                             ></div>
                          </div>
                       </div>
                    </div>
                   );
                 })
               )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-900 dark:bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-xl"><Cpu className="w-8 h-8 text-white" /></div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Health Metrics</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Real-time Performance & Validation Index</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              <HealthGauge label="Worker Engagement" value={analytics.health.engagement} color="#6366f1" icon={<UsersIcon />} desc="Active Contributor Ratio" />
              <HealthGauge label="Payout Reliability" value={analytics.health.reliability} color="#10b981" icon={<DollarSign />} desc="TX Fulfillment Quality" />
              <HealthGauge label="Data Accuracy" value={analytics.health.accuracy} color="#ec4899" icon={<Fingerprint />} desc="Asset Validation Score" />
              <HealthGauge label="Network Uptime" value={analytics.health.uptime} color="#06b6d4" icon={<Globe />} desc="SLA Availability Index" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-500">
           <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm h-fit">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Plus className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">New Market Goal</h3>
              </div>
              <form onSubmit={handlePostAssignment} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Platform</label>
                    <select value={asgnPlatformId} onChange={(e) => setAsgnPlatformId(e.target.value)} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold">
                       {prices.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Account Quantity</label>
                    <input required type="number" step="100" value={asgnTarget} onChange={(e) => setAsgnTarget(parseInt(e.target.value))} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-black text-xl" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Special Instructions</label>
                    <textarea value={asgnInstructions} onChange={(e) => setAsgnInstructions(e.target.value)} placeholder="e.g. Needs to be 3+ months old..." className="w-full h-32 px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none resize-none font-medium text-sm" />
                 </div>
                 <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                    <Rocket className="w-5 h-5" /> Post Assignment
                 </button>
              </form>
           </div>

           <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3"><Target className="w-8 h-8 text-indigo-600" /> Active Market Requirements</h3>
                 <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">{(assignments || []).filter(a => a.status === 'active').length} Active</span>
              </div>
              <div className="grid grid-cols-1 gap-6">
                 {(assignments || []).length === 0 ? (
                    <div className="p-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                       <Target className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No active assignments posted</p>
                    </div>
                 ) : (
                    assignments.map(asgn => (
                       <div key={asgn.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:border-indigo-500/30">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center font-black text-2xl text-indigo-600">{asgn.platformName[0]}</div>
                             <div>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">{asgn.platformName} Goal</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posted: {new Date(asgn.createdAt).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <div className="flex-1 max-w-xs w-full">
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black uppercase text-slate-500">Collected: {asgn.currentQuantity} / {asgn.targetQuantity}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${asgn.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>{asgn.status}</span>
                             </div>
                             <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-1000 ${asgn.status === 'active' ? 'bg-indigo-600' : 'bg-slate-400'}`} 
                                  style={{ width: `${Math.min(100, (asgn.currentQuantity / asgn.targetQuantity) * 100)}%` }}
                                ></div>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Contract Price</p>
                             <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">৳{asgn.pricePerUnit}</p>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-500">
           <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
             <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3"><UsersIcon className="w-8 h-8 text-indigo-600" /> User Access Control</h3>
             <div className="px-5 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100">{(users || []).filter(u => u.isWithdrawLocked).length} Accounts Locked</div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Status</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Failed Attempts</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(users || []).map(u => (
                    <tr key={u.uid} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all">
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center font-black text-indigo-600 uppercase">{u.displayName?.[0]}</div>
                           <div>
                              <p className="text-sm font-black text-slate-900 dark:text-white">{u.displayName}</p>
                              <p className="text-[10px] font-bold text-slate-400 lowercase">{u.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                         <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${u.isWithdrawLocked ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                            {u.isWithdrawLocked ? <><Lock className="w-3 h-3" /> Withdrawal Locked</> : <><CheckCircle2 className="w-3 h-3" /> Access Granted</>}
                         </span>
                      </td>
                      <td className="px-10 py-7 text-center font-black text-slate-600 dark:text-slate-400">{u.failedPinAttempts || 0} / 3</td>
                      <td className="px-10 py-7 text-right">
                         <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => setSelectedUserDetail(u)}
                              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[10px] font-black rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all uppercase tracking-widest flex items-center gap-2"
                            >
                               <Eye className="w-3.5 h-3.5" /> View Details
                            </button>
                            {u.isWithdrawLocked && (
                               <button onClick={() => onUnlockUser(u.uid)} className="px-4 py-2.5 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-700 transition-all uppercase tracking-widest flex items-center gap-2">
                                  <Unlock className="w-3.5 h-3.5" /> Unlock
                               </button>
                            )}
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'verifications' && (
        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
           <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
             <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3"><Database className="w-8 h-8 text-indigo-600" /> Worker Assets Queue</h3>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">Optimization Active</span>
           </div>
           <div className="overflow-x-auto no-scrollbar">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                   <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-1/6">Contributor</th>
                   <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[10%]">Platform</th>
                   <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[12%]">Data Source</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[30%]">Verification Ledger</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-[12%]">Est. Payout</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-[15%]">Finalize</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                 {(submissions || []).filter(s => s.status === 'pending').map(sub => {
                   const inputs = verificationInputs[sub.id] || { verified: sub.quantity, failed: 0 };
                   return (
                     <tr key={sub.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all group">
                       <td className="px-10 py-8">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-indigo-600 text-sm shadow-inner shrink-0">{sub.userEmail?.[0]?.toUpperCase()}</div>
                           <div className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[150px]">{sub.userEmail?.split('@')[0]}</div>
                         </div>
                       </td>
                       <td className="px-6 py-8">
                          <span className="font-black text-slate-800 dark:text-slate-200 text-[10px] uppercase tracking-tighter bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{sub.platformName}</span>
                       </td>
                       <td className="px-6 py-8">
                          {sub.sheetLink ? (
                            <a 
                              href={sub.sheetLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline font-black text-[10px] uppercase tracking-widest group/link"
                            >
                               <FileSpreadsheet className="w-3.5 h-3.5" /> <span>Open Link</span> <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </a>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-300 uppercase italic">Missing</span>
                          )}
                       </td>
                       <td className="px-10 py-8">
                         <div className="flex items-center gap-4">
                            <div className="flex-1 flex flex-col gap-1">
                               <div className="flex items-center justify-between px-1">
                                  <span className="text-[8px] font-black text-green-500 uppercase">Valid</span>
                                  <span className="text-[8px] font-bold text-slate-400">/ {sub.quantity}</span>
                               </div>
                               <input type="number" max={sub.quantity} min={0} value={inputs.verified} onChange={(e) => setVerificationInputs(prev => ({ ...prev, [sub.id]: { verified: parseInt(e.target.value) || 0, failed: sub.quantity - (parseInt(e.target.value) || 0) } }))} className="w-full h-10 px-3 bg-green-50/30 dark:bg-green-900/5 border border-green-100 dark:border-green-900/20 rounded-xl outline-none font-black text-xs text-green-600 focus:ring-2 focus:ring-green-500" />
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                               <div className="flex items-center justify-between px-1">
                                  <span className="text-[8px] font-black text-red-500 uppercase">Fail</span>
                               </div>
                               <input type="number" max={sub.quantity} min={0} value={inputs.failed} onChange={(e) => setVerificationInputs(prev => ({ ...prev, [sub.id]: { failed: parseInt(e.target.value) || 0, verified: sub.quantity - (parseInt(e.target.value) || 0) } }))} className="w-full h-10 px-3 bg-red-50/30 dark:bg-red-900/5 border border-red-100 dark:border-red-900/20 rounded-xl outline-none font-black text-xs text-red-600 focus:ring-2 focus:ring-red-500" />
                            </div>
                         </div>
                       </td>
                       <td className="px-10 py-8 text-center">
                          <div className="font-black text-indigo-600 dark:text-indigo-400 text-lg tracking-tighter whitespace-nowrap">৳{(inputs.verified * sub.pricePerUnit).toFixed(1)}</div>
                       </td>
                       <td className="px-10 py-8 text-right">
                         <div className="flex justify-end gap-2 shrink-0">
                           <button onClick={() => onProcessSubmission(sub.id, 'approved', inputs.verified, inputs.failed)} className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-md active:scale-95"><Check className="w-5 h-5" /></button>
                           <button onClick={() => onProcessSubmission(sub.id, 'rejected')} className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-md active:scale-95"><X className="w-5 h-5" /></button>
                         </div>
                       </td>
                     </tr>
                   );
                 })}
                 {(submissions || []).filter(s => s.status === 'pending').length === 0 && (
                   <tr>
                      <td colSpan={6} className="py-20 text-center">
                         <Database className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No assets pending verification</p>
                      </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
           <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
             <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4"><CreditCard className="w-8 h-8 text-indigo-600" /> Fulfillment Ledger</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                   <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Details</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Destination</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount to Pay</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Fulfillment</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                 {[...withdrawals].sort((a,b) => b.createdAt - a.createdAt).map(wd => (
                   <tr key={wd.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all group">
                     <td className="px-10 py-8">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{wd.userEmail?.split('@')[0]}</span>
                           <span className="text-[10px] font-bold text-slate-400 truncate">{wd.userEmail}</span>
                        </div>
                     </td>
                     <td className="px-10 py-8">
                        <div className="flex flex-col gap-1">
                           <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{wd.method}</span>
                           <div className="flex items-center gap-2 group/addr">
                              <span className="text-xs font-black text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">{wd.address}</span>
                              <button onClick={() => copyToClipboard(wd.address)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-all opacity-0 group-hover/addr:opacity-100">
                                 <Copy className="w-3 h-3" />
                              </button>
                           </div>
                        </div>
                     </td>
                     <td className="px-10 py-8 font-black text-slate-900 dark:text-white text-3xl tracking-tighter">৳{wd.amount.toFixed(2)}</td>
                     <td className="px-10 py-8 text-right">
                       {wd.status === 'pending' && (
                         <button onClick={() => { setTxIdInput(''); setFulfillmentModal({ id: wd.id, email: wd.userEmail, amount: wd.amount, method: wd.method, address: wd.address }); }} className="px-6 py-3 bg-indigo-600 text-white text-[11px] font-black rounded-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none">Fulfill Pay</button>
                       )}
                       <span className="ml-4 text-[9px] font-black uppercase text-slate-400">{wd.status}</span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeTab === 'prices' && (
        <div className="animate-in fade-in duration-500 space-y-10">
          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
               <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Market Asset Index</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Configure global asset rates & buying status</p>
            </div>
            <button onClick={() => { onUpdatePrices(editingPrices.map(p => ({ ...p, updatedAt: Date.now() }))); alert('Market rates synchronized successfully!'); }} className="px-10 py-5 bg-indigo-600 text-white font-black rounded-[1.75rem] hover:bg-indigo-700 transition-all flex items-center gap-4 shadow-xl shadow-indigo-200 dark:shadow-none">
               <RefreshCcw className="w-5 h-5" /> Push Live Updates
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {(editingPrices || []).map(price => {
              const platformIcon = PLATFORMS.find(p => p.id === price.id)?.icon;
              return (
                <div key={price.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all space-y-8 flex flex-col group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shadow-inner">
                          {platformIcon ? React.cloneElement(platformIcon as React.ReactElement, { className: 'w-7 h-7' }) : <Tag />}
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">{price.name}</h4>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${price.status === 'buying' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                             {price.status === 'buying' ? 'Market Active' : 'Market Closed'}
                          </span>
                       </div>
                    </div>
                    <button onClick={() => toggleMarketStatus(price.id)} className={`w-12 h-6 rounded-full relative transition-all duration-300 shadow-inner border ${price.status === 'buying' ? 'bg-green-500 border-green-600' : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600'}`}>
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 ${price.status === 'buying' ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <div className="space-y-6 relative z-10">
                    {/* Today Price Control */}
                    <div className="space-y-3">
                       <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today's Payout</label>
                          <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Per verified unit</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <button onClick={() => updatePriceValue(price.id, 'todayPrice', -0.5)} className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-slate-400 hover:text-red-500 transition-all"><Minus className="w-4 h-4" /></button>
                          <div className="flex-1 relative">
                             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-300 dark:text-slate-600">৳</span>
                             <input type="number" step="0.1" value={price.todayPrice} onChange={(e) => setEditingPrices(prev => prev.map(p => p.id === price.id ? { ...p, todayPrice: parseFloat(e.target.value) || 0 } : p))} className="w-full pl-10 pr-4 py-4 bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl font-black text-2xl text-indigo-600 dark:text-indigo-400 outline-none text-center shadow-inner focus:border-indigo-500 transition-all" />
                          </div>
                          <button onClick={() => updatePriceValue(price.id, 'todayPrice', 0.5)} className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/10 text-slate-400 hover:text-green-500 transition-all"><Plus className="w-4 h-4" /></button>
                       </div>
                    </div>

                    {/* Regular Price Control */}
                    <div className="space-y-3">
                       <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Regular Price</label>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Historical Anchor</span>
                       </div>
                       <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                          <button onClick={() => updatePriceValue(price.id, 'regularPrice', -0.5)} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-all"><Minus className="w-3.5 h-3.5" /></button>
                          <div className="flex-1 relative">
                             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-300 dark:text-slate-600">৳</span>
                             <input type="number" step="0.1" value={price.regularPrice} onChange={(e) => setEditingPrices(prev => prev.map(p => p.id === price.id ? { ...p, regularPrice: parseFloat(e.target.value) || 0 } : p))} className="w-full pl-8 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl font-bold text-lg text-slate-600 dark:text-slate-400 outline-none text-center shadow-sm focus:border-slate-400 transition-all" />
                          </div>
                          <button onClick={() => updatePriceValue(price.id, 'regularPrice', 0.5)} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-all"><Plus className="w-3.5 h-3.5" /></button>
                       </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center relative z-10">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Pulse</span>
                     <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${price.todayPrice > price.regularPrice ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        <span className="text-[9px] font-black text-slate-500 uppercase">{price.todayPrice > price.regularPrice ? 'Price Surge' : 'Stable Rate'}</span>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* User Detailed Info Modal */}
      {selectedUserDetail && (() => {
        const stats = getUserSummary(selectedUserDetail.uid);
        return (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setSelectedUserDetail(null)}></div>
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] w-full max-w-2xl overflow-hidden relative z-10 shadow-3xl border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-300">
               <div className="p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
                  <div className="flex items-center gap-5">
                     <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-lg">
                        {selectedUserDetail.displayName[0]}
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{selectedUserDetail.displayName}</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{selectedUserDetail.email}</p>
                     </div>
                  </div>
                  <button onClick={() => setSelectedUserDetail(null)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-700">
                     <X className="w-6 h-6 text-slate-400" />
                  </button>
               </div>
               
               <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto no-scrollbar">
                  {/* Financial Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/20 relative overflow-hidden group">
                        <Wallet className="absolute top-1/2 -translate-y-1/2 -right-4 w-24 h-24 text-indigo-600 opacity-[0.03] group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Available Credits</p>
                        <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">৳{selectedUserDetail.balance.toFixed(2)}</h4>
                     </div>
                     <div className="p-8 bg-green-50 dark:bg-green-900/10 rounded-[2.5rem] border border-green-100 dark:border-green-900/20 relative overflow-hidden group">
                        <BadgeCheck className="absolute top-1/2 -translate-y-1/2 -right-4 w-24 h-24 text-green-600 opacity-[0.03] group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest mb-2">Lifetime Earnings</p>
                        <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">৳{selectedUserDetail.totalEarnings.toFixed(2)}</h4>
                     </div>
                  </div>

                  {/* Submission Metrics */}
                  <div className="space-y-4">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Activity className="w-4 h-4" /> Market Activity Ledger</h4>
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                           <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{stats.totalSubmissions}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Batches</p>
                        </div>
                        <div className="p-5 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                           <p className="text-2xl font-black text-green-600 dark:text-green-400 leading-none mb-1">{stats.approvedUnits}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified Units</p>
                        </div>
                        <div className="p-5 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                           <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 leading-none mb-1">{stats.pendingUnits}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pending Units</p>
                        </div>
                        <div className="p-5 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                           <p className="text-2xl font-black text-red-500 leading-none mb-1">{stats.rejectedBatches}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rejected</p>
                        </div>
                     </div>
                  </div>

                  {/* Payment Gateway Configuration */}
                  <div className="space-y-4">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><CreditCard className="w-4 h-4" /> Verified Payout Methods</h4>
                     <div className="grid grid-cols-1 gap-4">
                        {selectedUserDetail.paymentMethods && selectedUserDetail.paymentMethods.length > 0 ? (
                           selectedUserDetail.paymentMethods.filter(m => m.isConfigured).map(m => (
                              <div key={m.id} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 dark:border-slate-700">
                                       <Banknote className="w-6 h-6" />
                                    </div>
                                    <div>
                                       <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{m.methodName}</p>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase">{m.accountName || 'Unnamed Holder'}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-widest">{m.accountNumber}</p>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="p-10 text-center bg-slate-50 dark:bg-slate-950/40 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                              <Info className="w-10 h-10 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No payment methods configured yet</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );
      })()}

      {fulfillmentModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setFulfillmentModal(null)}></div>
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-lg p-12 relative z-10 shadow-3xl border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-300">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Confirm Payment</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Payout Fulfillment Authorization</p>
            
            <div className="space-y-6 mb-10">
               <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Destination Address</p>
                  <div className="flex items-center justify-between">
                     <p className="text-lg font-black text-slate-900 dark:text-white">{fulfillmentModal.address}</p>
                     <button onClick={() => copyToClipboard(fulfillmentModal.address)} className="p-2 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-all">
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                     </button>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{fulfillmentModal.method} Transfer</p>
               </div>

               <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total to Transfer</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">৳{fulfillmentModal.amount.toFixed(2)}</span>
               </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onProcessWithdrawal(fulfillmentModal.id, 'paid', txIdInput); setFulfillmentModal(null); }} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Transaction ID</label>
                <input required autoFocus type="text" value={txIdInput} onChange={(e) => setTxIdInput(e.target.value)} placeholder="e.g. TR-9X28Z..." className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-600 font-mono text-lg font-black dark:text-white transition-all" />
              </div>
              <div className="flex gap-4">
                 <button type="button" onClick={() => setFulfillmentModal(null)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest">Cancel</button>
                 <button type="submit" className="flex-[2] py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-200 dark:shadow-none">Authorize Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
