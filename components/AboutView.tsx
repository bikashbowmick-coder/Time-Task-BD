
import React from 'react';
import { Target, Heart, Shield, Users, TrendingUp } from 'lucide-react';

const AboutView: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Redefining the <span className="text-indigo-600 dark:text-indigo-400">Digital Marketplace</span></h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Founded in 2023, Time Task BD was built to provide a safe, transparent, and reliable bridge between digital creators and global markets.
          </p>
        </div>
      </section>

      {/* Mission with Image */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Our Mission & Values</h2>
            <div className="space-y-6">
              <p className="text-slate-600 dark:text-slate-300 font-medium text-lg leading-relaxed">
                Our goal is to empower the youth of Bangladesh by providing them with a platform where their digital efforts are valued fairly. We believe in financial independence and the power of the digital economy.
              </p>
              <p className="text-slate-600 dark:text-slate-300 font-medium text-lg leading-relaxed">
                By offering live market rates and instant payouts, we eliminate the guesswork and delays often associated with online work. Our system is built on trust, efficiency, and real-time market synchronization.
              </p>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-lg">TT</div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Official Platform</p>
                    <p className="text-slate-500 text-sm font-medium">Serving the BD Digital Community since 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] rounded-full"></div>
              <div className="relative bg-white dark:bg-slate-900 p-8 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden group">
                 {/* This represents the Time Task BD Branding Image identity */}
                 <div className="aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] flex items-center justify-center p-12 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1584208124888-3a20b9c799e2?q=80&w=800&auto=format&fit=crop" 
                      className="w-full h-full object-cover rounded-[2rem] grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100 opacity-20" 
                      alt="Time Task BD Digital Identity" 
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500">
                       <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white mb-6 shadow-2xl shadow-indigo-200 dark:shadow-none group-hover:scale-110 transition-transform duration-500">
                          <TrendingUp className="w-16 h-16" />
                       </div>
                       <h4 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Time Task <span className="text-indigo-600">BD</span></h4>
                       <div className="flex items-center gap-2 mt-3">
                          <div className="h-px w-8 bg-slate-200 dark:bg-slate-800"></div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Established 2023</p>
                          <div className="h-px w-8 bg-slate-200 dark:bg-slate-800"></div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Prop Icons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Transparency', icon: <TrendingUp />, color: 'blue' },
            { label: 'Community', icon: <Users />, color: 'indigo' },
            { label: 'Security', icon: <Shield />, color: 'green' },
            { label: 'Integrity', icon: <Heart />, color: 'red' }
          ].map((v, i) => (
            <div key={i} className="group p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] text-center transition-all duration-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-indigo-500/10 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
              <div className="w-20 h-20 mx-auto mb-6 bg-white dark:bg-slate-800 rounded-[1.75rem] flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-indigo-200 dark:group-hover:shadow-none">
                {React.cloneElement(v.icon as React.ReactElement<any>, { className: 'w-10 h-10' })}
              </div>
              <h4 className="font-black text-sm uppercase tracking-[0.15em] text-slate-900 dark:text-slate-200">
                {v.label}
              </h4>
              <div className="w-6 h-1 bg-slate-200 dark:bg-slate-700 mx-auto mt-4 rounded-full transition-all duration-500 group-hover:w-12 group-hover:bg-indigo-500"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Team/Vision */}
      <section className="bg-slate-900 dark:bg-indigo-950 py-24 px-4 text-white rounded-[4rem] mx-4 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Target className="w-16 h-16 text-indigo-400 mx-auto mb-8 animate-bounce-subtle" />
          <h2 className="text-4xl font-black mb-6">Our Vision for 2025</h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12">
            To become the leading digital asset broker in South Asia, serving over 100,000 active earners while maintaining the highest standards of ethics and security in the industry.
          </p>
          <div className="inline-grid grid-cols-3 gap-12 border-t border-white/10 pt-12">
            <div>
              <p className="text-3xl font-black text-indigo-400 mb-1">100%</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transparency</p>
            </div>
            <div>
              <p className="text-3xl font-black text-indigo-400 mb-1">24/7</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Availability</p>
            </div>
            <div>
              <p className="text-3xl font-black text-indigo-400 mb-1">Instant</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Payments</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutView;
