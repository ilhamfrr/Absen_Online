import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle, Navigation, AlertCircle, Clock, Shield, Zap } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import api from '../services/api';

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState([]);

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/attendance');
      setHistory(response.data.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const getGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              long: position.coords.longitude,
            });
          },
          (err) => {
            reject(new Error('Location access required for verification.'));
          }
        );
      }
    });
  };

  const handleCheckIn = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const loc = await getGeolocation();
      setLocation(loc);
      
      // Call API
      await api.post('/checkin', {
        lat: loc.lat,
        long: loc.long,
      });

      setSuccess(true);
      fetchHistory();
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
               <span className="h-1.5 w-10 bg-primary-600 rounded-full"></span>
               <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.2em]">Presence Protocol</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 font-display">Biometric Sync</h1>
            <p className="text-slate-500 mt-2 font-medium">Capture high-precision location data for shift validation.</p>
          </motion.div>
          
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Server Time</span>
                <span className="text-sm font-black text-slate-900">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
             </div>
             <div className="h-8 w-px bg-slate-200"></div>
             <div className="bg-emerald-500 h-2.5 w-2.5 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 md:p-14 border border-slate-200/60 relative overflow-hidden"
          >
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10 select-none">
              <Zap className="h-48 w-48 rotate-12" />
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="relative mb-10">
                <div className="h-32 w-32 bg-primary-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary-500/40 relative z-10 rotate-3 group overflow-hidden">
                  <Navigation className={`h-14 w-14 text-white ${loading ? 'animate-bounce' : ''}`} />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </div>
                {/* Orbital dots */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary-100 rounded-full animate-[spin_10s_linear_infinite]">
                   <div className="absolute -top-1.5 left-1/2 h-3 w-3 bg-primary-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-primary-50 rounded-full animate-[spin_7s_linear_infinite_reverse]">
                   <div className="absolute top-1/2 -right-1.5 h-3 w-3 bg-primary-300 rounded-full border-2 border-white"></div>
                </div>
              </div>

              <div className="space-y-4 mb-12">
                <h2 className="text-2xl font-black text-slate-900 font-display">Verified Check-In</h2>
                <p className="text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                  Your coordinates will be cryptographically hashed and recorded for attendance audit.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full bg-rose-50 border border-rose-100 rounded-2xl p-5 mb-8 flex items-center gap-4"
                  >
                    <div className="h-10 w-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                      <AlertCircle className="h-6 w-6 text-rose-600" />
                    </div>
                    <p className="text-sm font-bold text-rose-700 text-left">{error}</p>
                  </motion.div>
                )}

                {success && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-emerald-900 text-lg leading-tight">Sync Complete</p>
                        <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-tighter">Loc: {location?.lat.toFixed(6)}, {location?.long.toFixed(6)}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                variant="primary"
                className="w-full py-5 text-lg font-black rounded-3xl group relative overflow-hidden"
                onClick={handleCheckIn}
                isLoading={loading}
                disabled={success}
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                   {success ? 'Presence Recorded' : 'Initialize Protocol'}
                   {!success && !loading && <Zap className="h-5 w-5 fill-white" />}
                </div>
              </Button>

              {location && (
                <div className="mt-8 flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Geo-Lock Active</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Guidelines Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden relative group">
               <Shield className="h-10 w-10 text-primary-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
               <h3 className="text-xl font-black mb-4 font-display">Security Protocol</h3>
               <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                  To maintain the integrity of our workforce data, all check-ins are verified against the organization's perimeter.
               </p>
               <ul className="space-y-4">
                  {[
                    'Stay within 50m of designated zone',
                    'Ensure GPS signal is high-precision',
                    'VPN/Proxy bypass is prohibited',
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-3 text-xs font-bold text-slate-200">
                       <CheckCircle className="h-4 w-4 text-primary-400 shrink-0" />
                       {tip}
                    </li>
                  ))}
               </ul>
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-lg shadow-slate-200/20">
               <div className="flex items-center gap-4 mb-6">
                  <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center">
                     <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <h4 className="font-black text-slate-900 font-display">History Log</h4>
               </div>
                <div className="space-y-4">
                  {history.length > 0 ? history.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                       <div className="text-left">
                          <p className="text-xs font-bold text-slate-900">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{item.status}</p>
                       </div>
                       <span className="text-[10px] font-black text-slate-500">{new Date(item.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )) : (
                    <p className="text-center py-4 text-xs text-slate-400 italic">No logs found.</p>
                  )}
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;
