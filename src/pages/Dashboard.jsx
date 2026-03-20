import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle, AlertTriangle, ArrowRight, TrendingUp, Calendar as CalendarIcon, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const StatCard = ({ title, value, change, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -4, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}
    className="bg-white p-7 rounded-3xl border border-slate-200/60 shadow-sm transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
        <MoreVertical className="h-4 w-4 text-slate-400" />
      </button>
    </div>
    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
    <div className="flex items-end gap-3 mt-1">
      <h3 className="text-3xl font-extrabold text-slate-900 font-display">{value}</h3>
      {change && (
        <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
          <TrendingUp className="h-3 w-3 mr-0.5" />
          {change}
        </span>
      )}
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [statsData, setStatsData] = React.useState(null);
  const [activities, setActivities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          api.get('/attendance/stats'),
          api.get('/attendance')
        ]);
        setStatsData(statsRes.data.data);
        setActivities(historyRes.data.data.slice(0, 4)); // Get latest 4
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { title: 'Total Present', value: statsData?.total_present || '0', change: null, icon: CheckCircle, color: 'bg-emerald-500', delay: 0.1 },
    { title: 'Late Entries', value: statsData?.total_late || '0', change: null, icon: Clock, color: 'bg-amber-500', delay: 0.2 },
    { title: 'Status', value: statsData?.last_attendance?.status === 'present' ? 'On Duty' : (statsData?.last_attendance?.status === 'late' ? 'Late' : 'Missing'), icon: AlertTriangle, color: statsData?.last_attendance ? 'bg-primary-600' : 'bg-rose-500', delay: 0.3 },
    { title: 'Last Seen', value: statsData?.last_attendance ? new Date(statsData.last_attendance.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A', icon: Clock, color: 'bg-slate-500', delay: 0.4 },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
               <span className="h-1.5 w-10 bg-primary-600 rounded-full"></span>
               <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.2em]">Operational Insights</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 font-display tracking-tight">Organization Overview</h1>
            <p className="text-slate-500 mt-2 font-medium">Monitoring workforce presence and performance metrics in real-time.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-2xl shadow-sm"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
               <CalendarIcon className="h-4 w-4 text-slate-400" />
               <span className="text-sm font-bold text-slate-700">Oct 12 - Oct 18</span>
            </div>
            <button className="px-4 py-2 text-sm font-bold text-primary-600 hover:bg-primary-50 rounded-xl transition-colors">
               Reports
            </button>
          </motion.div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Action Area */}
          <motion.div 
            variants={item}
            initial="hidden"
            animate="show"
            className="xl:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group border border-slate-800 shadow-2xl"
          >
            <div className="relative z-10 h-full flex flex-col justify-between min-h-[320px]">
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-primary-600/20 text-primary-400 border border-primary-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-6 backdrop-blur-md"
                >
                  Quick Action
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.1] font-display">Precision Location <br /><span className="text-primary-400 italic">Authentication</span></h2>
                <p className="text-slate-400 text-lg max-w-md leading-relaxed mb-10">
                  Ready to mark your presence? Our encrypted geolocation engine ensures accurate reporting for high-performance teams.
                </p>
              </div>
              
              <Link 
                to="/attendance" 
                className="group/btn relative inline-flex items-center justify-between bg-white text-slate-900 px-8 py-5 rounded-[2rem] font-black text-lg transition-all hover:pr-10 hover:shadow-2xl hover:shadow-primary-500/20 self-start"
              >
                <span>Navigate to Check-In</span>
                <div className="ml-4 bg-primary-600 p-2 rounded-full text-white group-hover/btn:translate-x-2 transition-transform duration-500">
                   <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            </div>
            
            {/* Abstract Premium Visuals */}
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-30 select-none pointer-events-none">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600 rounded-full blur-[120px] opacity-20"></div>
               <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 right-0 h-full w-auto text-primary-500/20 group-hover:scale-110 transition-transform duration-[2s]">
                  <path fill="currentColor" d="M45.7,-77.6C58.9,-69.1,69.1,-55.9,76.4,-41.2C83.7,-26.5,88.1,-10.3,87.3,5.6C86.5,21.5,80.5,37.1,70.6,50.1C60.7,63.1,47,73.5,31.7,79.5C16.4,85.5,-0.6,87.1,-17.7,84.1C-34.7,81.1,-51.9,73.5,-65.4,61.4C-78.9,49.3,-88.7,32.7,-91.9,15.2C-95.1,-2.3,-91.7,-20.8,-83.1,-36.4C-74.5,-52,-60.8,-64.7,-45.5,-72.1C-30.2,-79.5,-15.1,-81.6,0.3,-82.2C15.7,-82.8,32.5,-86.1,45.7,-77.6Z" transform="translate(100 100)" />
               </svg>
            </div>
          </motion.div>

          {/* Activity Sidebar */}
          <motion.div 
            variants={item}
            initial="hidden"
            animate="show"
            className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-xl shadow-slate-200/20"
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-slate-900 font-display">Sync Stream</h2>
              <button className="text-xs font-bold text-primary-600 px-4 py-2 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                 History
              </button>
            </div>
            
            <div className="space-y-8">
              {loading ? (
                <div className="flex justify-center py-10">
                   <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : activities.length > 0 ? activities.map((activity, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between group cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden ring-0 group-hover:ring-4 ring-primary-500/10 transition-all duration-300 text-slate-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Precise Location Sync</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-black px-3 py-1 rounded-full mb-1 inline-block ${activity.status === 'present' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                      {activity.status.toUpperCase()}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">{new Date(activity.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </motion.div>
              )) : (
                <p className="text-center py-10 text-slate-400 text-sm font-medium italic">No recent activity detected.</p>
              )}
            </div>
            
            <button className="w-full mt-10 py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50/30 transition-all duration-500">
               View All Activity
            </button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
