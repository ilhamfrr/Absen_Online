import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../services/auth';
import Button from '../components/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/login', { email, password });
      const { token: authToken, user: userData } = response.data.data;
      login(authToken, userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Left side - Aesthetic Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-lg">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl font-extrabold text-white leading-tight mb-6 font-display"
          >
            Modern Workforce <span className="text-primary-400 font-bold underline decoration-primary-500/30">Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-slate-400 text-lg leading-relaxed mb-10"
          >
            Streamline your team attendance with precision. Secure, geolocation-verified, and built for the modern enterprise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4 py-6 px-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-900 bg-slate-700 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="avatar" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-300">Joined by <span className="text-white font-bold">2,400+</span> teams worldwide</p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden mb-8">
            <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
          </div>

          <header className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 font-display">Welcome Back</h2>
            <p className="text-slate-500">Sign in to your account to continue</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block ml-1">Work Email</label>
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

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" title="Recover Access" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3.5 mt-2 shadow-lg shadow-primary-500/20"
            >
              Sign in to Dashboard
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          <footer className="mt-12 text-center border-t border-slate-100 pt-8">
            <p className="text-sm text-slate-500">
              Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:underline">Get started</Link>
            </p>
            <div className="mt-6 flex justify-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-widest">
              <span>Security</span>
              <span>•</span>
              <span>Privacy</span>
              <span>•</span>
              <span>Terms</span>
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
