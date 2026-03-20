import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, LogOut, Menu, X, Bell, User, ChevronRight, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../services/auth';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { title: 'Overview', path: '/dashboard', icon: Home },
    { title: 'Record Attendance', path: '/attendance', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/60 sidebar-gradient">
        <div className="p-8 pb-10 flex items-center gap-3">
          <div className="bg-primary-600 p-2.5 rounded-2xl shadow-lg shadow-primary-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
             <span className="text-xl font-bold tracking-tight block">Absensi</span>
             <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest leading-none">Enterprise</span>
          </div>
        </div>
        
        <nav className="flex-1 px-6 space-y-1.5 focus:outline-none">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-3">Menu</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900 group-hover:px-5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-500'} transition-colors duration-300`} />
                  {item.title}
                </div>
                {isActive && (
                  <motion.div layoutId="active" className="h-1.5 w-1.5 rounded-full bg-white opacity-40 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          <div className="p-4 bg-slate-900 rounded-3xl text-white relative overflow-hidden group mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 relative z-10">Integration</p>
            <p className="text-xs text-slate-300 mb-4 relative z-10 leading-relaxed">Connect with your HR system for better sync.</p>
            <button className="text-xs font-bold bg-white/10 hover:bg-white/20 py-2 px-4 rounded-xl transition-all relative z-10 w-full">
              Upgrade Now
            </button>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-bold text-slate-500 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all duration-300"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Professional Header */}
        <header className={`sticky top-0 z-30 transition-all duration-300 px-4 md:px-8 py-4 ${scrolled ? 'glass shadow-sm py-3' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 lg:hidden">
               <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <Menu className="h-5 w-5 text-slate-600" />
               </button>
               <span className="font-bold text-lg font-display tracking-tight">Absensi</span>
            </div>

            <div className="hidden md:flex items-center bg-white border border-slate-200/60 rounded-2xl px-4 py-2 w-96 shadow-sm focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
              <Search className="h-4 w-4 text-slate-400 mr-2" />
              <input type="text" placeholder="Search for employees, logs..." className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400" />
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
                 <Bell className="h-5 w-5 text-slate-600" />
                 <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
              </button>
              
              <div className="h-10 w-px bg-slate-200 shrink-0 mx-1 hidden sm:block"></div>
              
              <div className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 pl-4 rounded-2xl shadow-sm cursor-pointer hover:border-slate-300 transition-colors group">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 leading-none">{user?.name || 'Sarah Williams'}</p>
                    <p className="text-[10px] text-slate-500 leading-tight mt-1 font-bold uppercase">{user?.role || 'HR Manager'}</p>
                  </div>
                 <div className="h-8 w-8 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700">
                    <User className="h-5 w-5" />
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
        
        {/* Mobile Sidebar */}
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: isSidebarOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden flex flex-col shadow-2xl"
        >
          <div className="p-8 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-xl">
                 <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">Absensi</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-xl bg-slate-50">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          <nav className="mt-8 flex-1 px-6 space-y-1.5 focus:outline-none">
             {menuItems.map((item) => (
               <Link
                 key={item.path}
                 to={item.path}
                 onClick={() => setIsSidebarOpen(false)}
                 className={`flex items-center gap-4 px-4 py-4 text-sm font-bold rounded-2xl transition-all ${
                   location.pathname === item.path
                     ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                     : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                 }`}
               >
                 <item.icon className="h-5 w-5" />
                 {item.title}
               </Link>
             ))}
          </nav>
          <div className="p-6 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-4 py-4 text-sm font-bold text-slate-500 rounded-2xl hover:bg-red-50 hover:text-red-700 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </motion.aside>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-12">
          <div className="max-w-7xl mx-auto pt-4">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
