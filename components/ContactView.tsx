
import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mail, 
  MapPin, 
  Send, 
  HelpCircle, 
  MessageCircle, 
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ExternalLink,
  Globe,
  Navigation
} from 'lucide-react';

const ContactView: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook />, url: '#', color: 'blue', handle: '@TimeTaskBD' },
    { name: 'Twitter', icon: <Twitter />, url: '#', color: 'sky', handle: '@TimeTaskBD_Official' },
    { name: 'LinkedIn', icon: <Linkedin />, url: '#', color: 'indigo', handle: 'time-task-bd' },
    { name: 'Instagram', icon: <Instagram />, url: '#', color: 'pink', handle: 'timetask.bd' }
  ];

  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="py-24 px-4 bg-indigo-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/10"></div>
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl font-black mb-6 tracking-tight">How Can We Help?</h1>
          <p className="text-xl text-indigo-100 font-medium max-w-2xl mx-auto">
            Got questions about market rates or pending payouts? Our dedicated support team is here for you 24/7.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Cards */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800">
               <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                 <MessageCircle className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Telegram Support</h3>
               <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-4">Fastest response for technical issues.</p>
               <a href="#" className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest hover:underline">Chat on Telegram</a>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800">
               <div className="w-12 h-12 bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-6">
                 <Phone className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">WhatsApp Direct</h3>
               <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-4">Direct call and message support.</p>
               <a href="#" className="text-green-600 dark:text-green-400 font-black text-xs uppercase tracking-widest hover:underline">Open WhatsApp</a>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800">
               <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6">
                 <Mail className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Email Inquiries</h3>
               <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-4">For business and bulk partnerships.</p>
               <a href="mailto:support@timetaskbd.com" className="text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-widest hover:underline">support@timetaskbd.com</a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl dark:shadow-none shadow-indigo-100/50 border border-slate-100 dark:border-slate-800 h-full">
               <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Send Us a Message</h3>
               <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                      <input required type="text" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                      <input required type="email" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" placeholder="Enter your email" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Subject</label>
                    <select className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium dark:text-white">
                      <option>Payment Issue</option>
                      <option>Account Verification</option>
                      <option>Price Inquiry</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Your Message</label>
                    <textarea required className="w-full h-40 px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none dark:text-white" placeholder="How can we help you today?"></textarea>
                 </div>
                 <button 
                  disabled={sent}
                  type="submit" 
                  className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 hover:translate-y-[-2px] transition-all flex items-center justify-center disabled:opacity-50"
                 >
                   {sent ? 'Message Sent Successfully!' : (
                     <>
                      Send Message <Send className="w-5 h-5 ml-2" />
                     </>
                   )}
                 </button>
               </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-24 px-4 max-w-7xl mx-auto">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-[4rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm relative group">
           <div className="grid grid-cols-1 lg:grid-cols-5 h-full min-h-[500px]">
              <div className="lg:col-span-2 p-12 lg:p-20 flex flex-col justify-center space-y-10 relative z-10 bg-white dark:bg-slate-900">
                 <div>
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                       <MapPin className="w-3 h-3 mr-2" /> Local Presence
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-6">Operational <br /> Headquarters</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                       Centrally located in the heart of the digital economy hub. Our validation teams operate out of Dhaka to ensure 24/7 coverage across all time zones.
                    </p>
                 </div>

                 <div className="space-y-6">
                    <div className="flex gap-5 items-start">
                       <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                          <Navigation className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-1">Corporate Office</h4>
                          <p className="text-sm text-slate-500 font-medium">Motijheel Commercial Area, Dhaka 1000, Bangladesh</p>
                       </div>
                    </div>
                    <div className="flex gap-5 items-start">
                       <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                          <Globe className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-1">Service Area</h4>
                          <p className="text-sm text-slate-500 font-medium">Providing digital brokerage services to users across 64 districts of Bangladesh.</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                    <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:underline">
                       Get Directions <ExternalLink className="w-3 h-3" />
                    </button>
                 </div>
              </div>
              
              <div className="lg:col-span-3 relative overflow-hidden grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 min-h-[400px]">
                 <iframe 
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d116833.8318789391!2d90.33728816401662!3d23.78088745618413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1715456281044!5m2!1sen!2sbd" 
                   width="100%" 
                   height="100%" 
                   style={{ border: 0 }} 
                   allowFullScreen={true} 
                   loading="lazy" 
                   referrerPolicy="no-referrer-when-downgrade"
                   className="absolute inset-0 w-full h-full object-cover"
                   title="Time Task BD Location Map"
                 ></iframe>
                 <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]"></div>
              </div>
           </div>
        </div>
      </section>

      {/* Social Media Links Section */}
      <section className="pb-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            Follow Our Updates
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Connect With Us</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-4">Stay updated with live price surges and marketplace news.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialLinks.map((social) => (
            <a 
              key={social.name}
              href={social.url}
              className="group p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:scale-[1.03] hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col items-center text-center"
            >
              <div className={`w-16 h-16 rounded-[1.5rem] bg-${social.color}-50 dark:bg-${social.color}-900/20 flex items-center justify-center text-${social.color}-600 dark:text-${social.color}-400 mb-6 group-hover:scale-110 transition-transform`}>
                {React.cloneElement(social.icon as React.ReactElement<any>, { className: 'w-8 h-8' })}
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1">{social.name}</h4>
              <p className={`text-sm font-bold text-${social.color}-600 dark:text-${social.color}-400 mb-4 opacity-70`}>{social.handle}</p>
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">
                Visit Profile <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContactView;
