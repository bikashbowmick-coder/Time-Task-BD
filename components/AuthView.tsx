
import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface Props {
  type: 'login' | 'register';
  onSuccess: (user: User) => void;
}

const AuthView: React.FC<Props> = ({ type, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Forgot Password States
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isResetting) {
      handleResetPassword();
      return;
    }
    
    setLoading(true);

    // Simulated Auth Logic
    setTimeout(() => {
      const isAdmin = email.includes('admin');
      const mockUser: User = {
        uid: `user_${Date.now()}`,
        email: email,
        displayName: name || email.split('@')[0],
        role: isAdmin ? 'admin' : 'user',
        balance: isAdmin ? 1000 : 0,
        totalEarnings: 0,
      };
      setLoading(false);
      onSuccess(mockUser);
    }, 1000);
  };

  const handleResetPassword = () => {
    setLoading(true);
    // Simulated Password Reset Email Logic
    setTimeout(() => {
      setLoading(false);
      setResetSuccess(true);
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    
    // Simulated Google OAuth Flow
    setTimeout(() => {
      const mockGoogleUser: User = {
        uid: `google_${Date.now()}`,
        email: 'google.user@gmail.com',
        displayName: 'Google Explorer',
        role: 'user',
        balance: 0,
        totalEarnings: 0,
      };
      setGoogleLoading(false);
      onSuccess(mockGoogleUser);
    }, 1500);
  };

  if (isResetting && resetSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-none shadow-indigo-100 border border-slate-100 dark:border-slate-800 p-10 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Check Your Inbox</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
            We've sent a password reset link to <span className="font-bold text-slate-900 dark:text-white">{email}</span>. Please follow the instructions to regain access.
          </p>
          <button 
            onClick={() => {
              setIsResetting(false);
              setResetSuccess(false);
            }}
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-none shadow-indigo-100 border border-slate-100 dark:border-slate-800 p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {isResetting ? 'Reset Password' : (type === 'login' ? 'Welcome Back' : 'Create Account')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium px-4">
            {isResetting 
              ? 'Enter your email to receive a recovery link' 
              : (type === 'login' ? 'Continue your earning journey' : 'Start earning in minutes')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isResetting && type === 'register' && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600" />
              <input 
                required
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium dark:text-white"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600" />
            <input 
              required
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium dark:text-white"
            />
          </div>
          
          {!isResetting && (
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600" />
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium dark:text-white"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {type === 'login' && (
                <div className="text-right px-1">
                  <button 
                    type="button"
                    onClick={() => setIsResetting(true)}
                    className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>
          )}

          <button 
            disabled={loading || googleLoading}
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 hover:translate-y-[-2px] transition-all flex items-center justify-center disabled:opacity-70"
          >
            {loading ? 'Processing...' : (
              <>
                {isResetting ? 'Send Reset Link' : (type === 'login' ? 'Login' : 'Sign Up')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
          
          {isResetting && (
            <button 
              type="button"
              onClick={() => setIsResetting(false)}
              className="w-full py-4 bg-transparent text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center hover:text-slate-700 dark:hover:text-slate-200 transition-all"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Login
            </button>
          )}
        </form>

        {!isResetting && (
          <>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100 dark:border-slate-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 dark:text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] disabled:opacity-70"
              >
                {googleLoading ? (
                  <span className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.94 0 3.51.68 4.75 1.81l3.51-3.51C17.92 1.19 15.21 0 12 0 7.31 0 3.25 2.67 1.21 6.6l3.96 3.07C6.12 7.08 8.83 5.04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.46-5.02 3.46-8.73z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.17 14.67c-.25-.73-.39-1.52-.39-2.33s.14-1.6.39-2.33L1.21 6.6C.44 8.22 0 10.06 0 12s.44 3.78 1.21 5.4l3.96-3.07z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.97-1.09 7.96-2.96l-3.76-2.91c-1.08.75-2.48 1.19-4.2 1.19-3.17 0-5.88-2.04-6.84-4.93l-3.96 3.07C3.25 21.33 7.31 24 12 24z"
                    />
                  </svg>
                )}
                Google Sign-in
              </button>
            </div>
          </>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
           <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-2">Pro Tip</p>
           <p className="text-xs text-slate-500 dark:text-slate-400 italic">
             {isResetting 
               ? "Remembered your password? Just head back to login." 
               : "Google Sign-in is the fastest way to join our community!"}
           </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
