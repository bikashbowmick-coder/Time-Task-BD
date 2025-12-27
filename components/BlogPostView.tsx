
import React from 'react';
import { BlogPost } from '../types';
import { 
  Calendar, 
  User, 
  ChevronLeft, 
  Clock, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Tag, 
  Quote,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface Props {
  post: BlogPost;
  onBack: () => void;
}

const BlogPostView: React.FC<Props> = ({ post, onBack }) => {
  return (
    <div className="bg-white dark:bg-slate-950 pb-24 animate-in fade-in duration-700">
      {/* Article Hero */}
      <div className="relative h-[400px] md:h-[600px] overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover grayscale-[0.2] brightness-75 scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-slate-950/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all mb-4"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Intelligence
            </button>
            
            <div className="flex flex-wrap gap-3">
              <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                {post.category}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Clock className="w-3 h-3 inline mr-1" /> 5 Min Read
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 pt-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-black shadow-lg">
                    {post.author[0]}
                  </div>
                  <div>
                    <p className="text-white font-black text-sm leading-none">{post.author}</p>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">{post.authorRole}</p>
                  </div>
               </div>
               <div className="h-8 w-px bg-white/20"></div>
               <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-widest">{post.date}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Body */}
          <div className="lg:col-span-8 space-y-12">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-8">
                 <Quote className="w-8 h-8 fill-current opacity-20" />
                 <p className="text-2xl md:text-3xl font-black tracking-tight leading-relaxed italic border-l-4 border-indigo-600 pl-6">
                   {post.excerpt}
                 </p>
              </div>

              <div className="space-y-8 text-slate-600 dark:text-slate-300 text-lg leading-loose font-medium">
                {post.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* In-article CTA */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
               <div className="relative z-10 space-y-6">
                  <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                     <TrendingUp className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Ready to apply these insights?</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-lg">Join thousands of verified earners in Bangladesh and start selling your social assets at the highest market rates today.</p>
                  <button className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center gap-3 text-sm uppercase tracking-widest">
                     Start Selling Now <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
               </div>
            </div>

            {/* Author Bio Section */}
            <div className="pt-12 border-t border-slate-100 dark:border-slate-800">
               <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-black shadow-inner shrink-0">
                     {post.author[0]}
                  </div>
                  <div className="text-center md:text-left flex-1">
                     <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white leading-none">{post.author}</h4>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800/40 w-fit mx-auto md:mx-0">
                           <ShieldCheck className="w-3 h-3" /> Verified Author
                        </span>
                     </div>
                     <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                        Dedicated to bringing you the most accurate marketplace intelligence. {post.author} has over 5 years of experience in the social asset trading ecosystem of South Asia.
                     </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            {/* Share Widget */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Share2 className="w-3 h-3" /> Spread the Knowledge
               </h4>
               <div className="grid grid-cols-3 gap-4">
                  <button className="w-full h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                     <Facebook className="w-6 h-6" />
                  </button>
                  <button className="w-full h-14 bg-sky-50 dark:bg-sky-900/20 rounded-2xl flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white transition-all">
                     <Twitter className="w-6 h-6" />
                  </button>
                  <button className="w-full h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                     <Linkedin className="w-6 h-6" />
                  </button>
               </div>
            </div>

            {/* Platform Trust */}
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
               <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
               <div className="relative z-10 space-y-6">
                  <CheckCircle2 className="w-10 h-10 text-indigo-200" />
                  <h4 className="text-2xl font-black leading-tight tracking-tight">Trust Guaranteed by Time Task BD</h4>
                  <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-80">Every guide on our intelligence platform is vetted by senior system administrators to ensure accuracy and merchant safety.</p>
                  <ul className="space-y-3">
                     {['Daily price surges', '24h payout cycles', 'Encrypted data layers'].map(f => (
                        <li key={f} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                           <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full"></span> {f}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            {/* Trending Tags */}
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Related Categories
               </h4>
               <div className="flex flex-wrap gap-3">
                  {['Earnings', 'Security', 'Facebook', 'TikTok', 'Payouts', 'Tutorials'].map(tag => (
                     <button key={tag} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                        {tag}
                     </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostView;
