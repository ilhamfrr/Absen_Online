import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, AlertCircle, ArrowRight, ArrowLeft, Key, ShieldCheck, CheckCircle } from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/forgot-password', { email });
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'We couldn\'t find an account with that email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Left side - Aesthetic Branding (Consistent with Login/Register) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-extrabold text-white leading-tight mb-6 font-display"
          >
            Recover Your <span className="text-primary-400 font-bold underline decoration-primary-500/30">Access</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-slate-400 text-lg leading-relaxed mb-10"
          >
            Don't worry, it happens to the best of us. We'll send you a secure link to reset your credentials.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 py-6 px-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm"
          >
            <div className="h-12 w-12 bg-primary-600/20 rounded-xl text-white flex items-center justify-center border border-primary-500/20">
              <ShieldCheck className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-white font-bold tracking-tight leading-none mb-1">Secure Retrieval</p>
              <p className="text-xs text-slate-400 font-medium">Encrypted reset tokens valid for 60 minutes.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden mb-8">
            <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
              <Key className="h-7 w-7 text-white" />
            </div>
          </div>

          <header className="mb-10">
            <div className="mb-4">
              <Link to="/login" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest gap-2 group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Sign In
              </Link>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2 font-display">Forgot Password?</h2>
            <p className="text-slate-500">Enter your email and we'll send you a reset link</p>
          </header>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full py-3.5 mt-2 shadow-lg shadow-primary-500/20"
                >
                  Send Reset Link
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="h-20 w-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 font-display">Check Your Email</h3>
                <p className="text-slate-500 leading-relaxed mb-8">
                  We've sent a password reset link to <span className="text-slate-900 font-bold">{email}</span>. Please check your inbox and spam folder.
                </p>
                <div className="flex flex-col gap-3">
                  <Button variant="secondary" onClick={() => setIsSuccess(false)} className="w-full">
                    Didn't get the email? Try again
                  </Button>
                  <Link to="/login" className="text-sm font-bold text-primary-600 hover:text-primary-700">
                    Return to Sign In
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="mt-12 text-center border-t border-slate-100 pt-8">
            <p className="text-sm text-slate-500 italic">
              Technical support: <a href="mailto:support@absenonline.com" className="text-slate-700 font-bold hover:underline">support@absenonline.com</a>
            </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
