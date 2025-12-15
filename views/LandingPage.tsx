
import React, { useRef, useState, useEffect } from 'react';
import { 
  Command, ArrowRight, CheckCircle, Layout, Users, TrendingUp, Shield, 
  Zap, Globe, ChevronRight, BarChart3, Lock, Server, MessageSquare, Play,
  CreditCard, PieChart, Layers, Briefcase, Workflow
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  // Navigation Refs
  const featuresRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const enterpriseRef = useRef<HTMLDivElement>(null);

  // State
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSolution, setActiveSolution] = useState<'sales' | 'finance' | 'hr'>('sales');

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth Scroll Handler
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    const yOffset = -80; // Navbar offset
    const element = ref.current;
    if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col font-sans text-white overflow-x-hidden selection:bg-blue-500 selection:text-white cursor-none">
      
      {/* --- Dynamic Background --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-600/5 blur-[100px]" />
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      {/* --- Navbar --- */}
      <nav 
        className={`
            fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b
            ${isScrolled ? 'bg-[#050505]/80 backdrop-blur-xl border-white/10 py-3' : 'bg-transparent border-transparent py-5'}
        `}
      >
        <div className="flex items-center justify-between px-6 lg:px-12 w-full max-w-[1400px] mx-auto">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform">
              <Command size={16} strokeWidth={3} />
            </div>
            <span className="font-bold text-lg tracking-tight">GlassFlow</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <button onClick={() => scrollToSection(featuresRef)} className="hover:text-white transition-colors cursor-pointer">Features</button>
            <button onClick={() => scrollToSection(solutionsRef)} className="hover:text-white transition-colors cursor-pointer">Solutions</button>
            <button onClick={() => scrollToSection(enterpriseRef)} className="hover:text-white transition-colors cursor-pointer">Enterprise</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin} 
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button 
              onClick={onGetStarted} 
              className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-40 pb-20 px-6 text-center max-w-7xl mx-auto">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          New: AI-Powered Analytics
        </div>
        
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 drop-shadow-2xl">
          The Operating System <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-white">for Modern Business.</span>
        </h1>
        
        {/* Subhead */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Unify your CRM, Finance, and HR into one fluid, crystal-clear interface. 
          Designed for speed, built for scale.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-5 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <button 
            onClick={onGetStarted}
            className="px-8 py-4 bg-blue-600 text-white rounded-full text-base font-bold hover:bg-blue-500 transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] flex items-center gap-2 group hover:-translate-y-1 cursor-pointer"
          >
            Start Free Trial <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => scrollToSection(solutionsRef)}
            className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full text-base font-medium hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-sm cursor-pointer"
          >
            <Play size={16} fill="currentColor" /> Watch Demo
          </button>
        </div>

        {/* Dashboard Mockup (3D Tilt Effect) */}
        <div className="mt-24 relative w-full max-w-6xl aspect-[16/9] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 perspective-1000 group">
            {/* Glow Behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
            
            {/* The Interface */}
            <div className="relative w-full h-full bg-[#0a0a0a] rounded-xl border border-white/10 shadow-2xl overflow-hidden transform group-hover:scale-[1.01] transition-transform duration-700 ease-out">
                {/* Mock Header */}
                <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-4 gap-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <div className="h-6 w-64 bg-white/5 rounded-md"></div>
                </div>
                
                {/* Mock Body */}
                <div className="flex h-full">
                    {/* Sidebar */}
                    <div className="w-64 border-r border-white/10 bg-white/[0.02] p-4 flex flex-col gap-4">
                        <div className="h-8 w-8 bg-white/10 rounded-lg"></div>
                        <div className="space-y-2 mt-4">
                            {[1,2,3,4,5].map(i => <div key={i} className="h-8 w-full bg-white/5 rounded-md" />)}
                        </div>
                    </div>
                    {/* Main */}
                    <div className="flex-1 p-8 grid grid-cols-3 gap-6 overflow-hidden">
                        {/* Widgets */}
                        <div className="col-span-2 h-64 bg-white/5 rounded-xl border border-white/5 p-4 relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
                            {/* Chart Line */}
                            <svg className="w-full h-full absolute bottom-0 left-0" preserveAspectRatio="none">
                                <path d="M0,100 Q150,50 300,80 T600,20 T900,60" fill="none" stroke="#3b82f6" strokeWidth="2" />
                            </svg>
                        </div>
                        <div className="col-span-1 h-64 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col gap-3">
                             <div className="h-12 w-12 rounded-full bg-emerald-500/20 mb-2"></div>
                             <div className="h-8 w-24 bg-white/10 rounded"></div>
                             <div className="h-4 w-16 bg-white/5 rounded"></div>
                        </div>
                        <div className="col-span-1 h-40 bg-white/5 rounded-xl border border-white/5"></div>
                        <div className="col-span-1 h-40 bg-white/5 rounded-xl border border-white/5"></div>
                        <div className="col-span-1 h-40 bg-white/5 rounded-xl border border-white/5"></div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- Marquee Section --- */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-[100vw] overflow-hidden relative">
            <div className="flex gap-20 animate-marquee whitespace-nowrap opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Duplicate logos for infinite loop */}
                {[...Array(2)].map((_, setIndex) => (
                    <React.Fragment key={setIndex}>
                        <div className="flex items-center gap-3 text-xl font-bold"><Globe className="text-blue-500" /> Acme Global</div>
                        <div className="flex items-center gap-3 text-xl font-bold"><Zap className="text-yellow-500" /> BoltShift</div>
                        <div className="flex items-center gap-3 text-xl font-bold"><Layers className="text-purple-500" /> Layer8</div>
                        <div className="flex items-center gap-3 text-xl font-bold"><Shield className="text-emerald-500" /> SecureFlow</div>
                        <div className="flex items-center gap-3 text-xl font-bold"><Layout className="text-pink-500" /> GridLock</div>
                        <div className="flex items-center gap-3 text-xl font-bold"><Globe className="text-blue-500" /> Acme Global</div>
                        <div className="flex items-center gap-3 text-xl font-bold"><Zap className="text-yellow-500" /> BoltShift</div>
                    </React.Fragment>
                ))}
            </div>
            {/* Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
        </div>
      </section>

      {/* --- Features (Bento Grid) --- */}
      <section ref={featuresRef} className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything you need.<br/>Nothing you don't.</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Replace your fragmented stack with one cohesive operating system.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                {/* Large Card 1 */}
                <div className="md:col-span-2 bg-[#0a0a0a] rounded-3xl border border-white/10 p-8 relative overflow-hidden group hover:border-white/20 transition-all cursor-default">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:opacity-30 transition-opacity">
                        <BarChart3 size={180} />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-end">
                        <div className="p-3 bg-blue-500/20 w-fit rounded-xl mb-4 text-blue-400"><Layout size={24} /></div>
                        <h3 className="text-2xl font-bold mb-2">Unified Dashboard</h3>
                        <p className="text-gray-400">Real-time insights across all departments. Customize widgets to see exactly what matters to your role.</p>
                    </div>
                </div>

                {/* Tall Card */}
                <div className="md:row-span-2 bg-[#0a0a0a] rounded-3xl border border-white/10 p-8 relative overflow-hidden group hover:border-white/20 transition-all cursor-default">
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] group-hover:bg-purple-500/30 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="p-3 bg-purple-500/20 w-fit rounded-xl mb-4 text-purple-400"><Workflow size={24} /></div>
                        <h3 className="text-2xl font-bold mb-2">Automation</h3>
                        <p className="text-gray-400 mb-8">Set up triggers and actions to put your busy work on autopilot.</p>
                        {/* Visual Mock of Automation */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-xs text-gray-300">New Lead Created</span>
                            </div>
                            <div className="flex justify-center"><ArrowRight size={14} className="rotate-90 text-gray-600" /></div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-xs text-gray-300">Send Welcome Email</span>
                            </div>
                            <div className="flex justify-center"><ArrowRight size={14} className="rotate-90 text-gray-600" /></div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <span className="text-xs text-gray-300">Notify Sales Team</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Small Card 2 */}
                <div className="bg-[#0a0a0a] rounded-3xl border border-white/10 p-8 group hover:border-white/20 transition-all cursor-default">
                    <div className="p-3 bg-emerald-500/20 w-fit rounded-xl mb-4 text-emerald-400"><CreditCard size={24} /></div>
                    <h3 className="text-xl font-bold mb-2">Smart Finance</h3>
                    <p className="text-sm text-gray-400">Invoices, expenses, and payroll in one ledger.</p>
                </div>

                {/* Small Card 3 */}
                <div className="bg-[#0a0a0a] rounded-3xl border border-white/10 p-8 group hover:border-white/20 transition-all cursor-default">
                    <div className="p-3 bg-orange-500/20 w-fit rounded-xl mb-4 text-orange-400"><Users size={24} /></div>
                    <h3 className="text-xl font-bold mb-2">People Ops</h3>
                    <p className="text-sm text-gray-400">Onboarding to offboarding, handle the full employee lifecycle.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- Interactive Solutions Tab --- */}
      <section ref={solutionsRef} className="py-24 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                
                {/* Left: Content & Tabs */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Built for every team.</h2>
                    
                    <div className="space-y-6">
                        {/* Sales Tab */}
                        <div 
                            className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${activeSolution === 'sales' ? 'bg-white/10 border-white/20' : 'hover:bg-white/5 border-transparent'}`}
                            onClick={() => setActiveSolution('sales')}
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <div className={`p-2 rounded-lg ${activeSolution === 'sales' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                    <TrendingUp size={20} />
                                </div>
                                <h3 className={`text-xl font-bold ${activeSolution === 'sales' ? 'text-white' : 'text-gray-400'}`}>Sales & CRM</h3>
                            </div>
                            <p className={`text-sm leading-relaxed ${activeSolution === 'sales' ? 'text-gray-300 block' : 'text-gray-500 hidden'}`}>
                                Visualize your pipeline, track deal value, and automate follow-ups. Never let a lead slip through the cracks again.
                            </p>
                        </div>

                        {/* Finance Tab */}
                        <div 
                            className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${activeSolution === 'finance' ? 'bg-white/10 border-white/20' : 'hover:bg-white/5 border-transparent'}`}
                            onClick={() => setActiveSolution('finance')}
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <div className={`p-2 rounded-lg ${activeSolution === 'finance' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                    <PieChart size={20} />
                                </div>
                                <h3 className={`text-xl font-bold ${activeSolution === 'finance' ? 'text-white' : 'text-gray-400'}`}>Finance</h3>
                            </div>
                            <p className={`text-sm leading-relaxed ${activeSolution === 'finance' ? 'text-gray-300 block' : 'text-gray-500 hidden'}`}>
                                Real-time cashflow analysis, automated invoicing, and expense tracking linked directly to projects.
                            </p>
                        </div>

                        {/* HR Tab */}
                        <div 
                            className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${activeSolution === 'hr' ? 'bg-white/10 border-white/20' : 'hover:bg-white/5 border-transparent'}`}
                            onClick={() => setActiveSolution('hr')}
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <div className={`p-2 rounded-lg ${activeSolution === 'hr' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                    <Users size={20} />
                                </div>
                                <h3 className={`text-xl font-bold ${activeSolution === 'hr' ? 'text-white' : 'text-gray-400'}`}>Human Resources</h3>
                            </div>
                            <p className={`text-sm leading-relaxed ${activeSolution === 'hr' ? 'text-gray-300 block' : 'text-gray-500 hidden'}`}>
                                Manage your org chart, run payroll in clicks, and handle leave requests without the paperwork.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Dynamic Visual */}
                <div className="relative h-[500px] bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent z-10"></div>
                    
                    {/* Animated Content based on Active Tab */}
                    {activeSolution === 'sales' && (
                        <div className="absolute inset-0 p-8 flex flex-col animate-in fade-in zoom-in-95 duration-500">
                             <div className="flex items-center justify-between mb-8">
                                <h4 className="text-lg font-bold text-white">Pipeline</h4>
                                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">Active Deals: $2.4M</span>
                             </div>
                             <div className="flex gap-4 h-full">
                                <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-3 flex flex-col gap-3">
                                    <div className="text-xs text-gray-400 font-bold uppercase">New Leads</div>
                                    <div className="bg-white/10 p-3 rounded-lg border border-white/5"><div className="h-2 w-20 bg-gray-500 rounded mb-2"></div><div className="h-2 w-12 bg-gray-600 rounded"></div></div>
                                    <div className="bg-white/10 p-3 rounded-lg border border-white/5"><div className="h-2 w-20 bg-gray-500 rounded mb-2"></div><div className="h-2 w-12 bg-gray-600 rounded"></div></div>
                                </div>
                                <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-3 flex flex-col gap-3">
                                    <div className="text-xs text-gray-400 font-bold uppercase">Negotiation</div>
                                    <div className="bg-blue-600 p-3 rounded-lg border border-white/10 shadow-lg shadow-blue-900/50">
                                        <div className="flex justify-between items-start mb-2"><div className="h-2 w-16 bg-white/80 rounded"></div><div className="w-4 h-4 rounded-full bg-white/20"></div></div>
                                        <div className="h-4 w-12 bg-white rounded mb-1"></div>
                                    </div>
                                </div>
                                <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-3 flex flex-col gap-3 opacity-50">
                                    <div className="text-xs text-gray-400 font-bold uppercase">Closed Won</div>
                                    <div className="bg-green-900/40 p-3 rounded-lg border border-green-500/20">
                                        <div className="h-2 w-16 bg-green-500/50 rounded mb-2"></div><div className="h-2 w-12 bg-green-500/30 rounded"></div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}

                    {activeSolution === 'finance' && (
                        <div className="absolute inset-0 p-8 flex flex-col animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-lg font-bold text-white">Revenue Overview</h4>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-gray-400"><CreditCard size={16}/></div>
                                </div>
                            </div>
                            <div className="flex-1 flex items-end justify-between gap-4 pb-4 border-b border-white/10">
                                {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                                    <div key={i} className="w-full bg-purple-500/20 rounded-t-lg relative group">
                                        <div 
                                            className="absolute bottom-0 left-0 right-0 bg-purple-600 rounded-t-lg transition-all duration-500" 
                                            style={{ height: `${h}%` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <div className="text-xs text-gray-400">Net Profit</div>
                                    <div className="text-2xl font-bold text-white mt-1">$128,400</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <div className="text-xs text-gray-400">Expenses</div>
                                    <div className="text-2xl font-bold text-red-400 mt-1">$32,150</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSolution === 'hr' && (
                        <div className="absolute inset-0 p-8 flex flex-col animate-in fade-in zoom-in-95 duration-500">
                             <div className="grid grid-cols-2 gap-4 mb-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10"></div>
                                        <div>
                                            <div className="h-2 w-20 bg-gray-600 rounded mb-1.5"></div>
                                            <div className="h-2 w-12 bg-gray-700 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                             </div>
                             <div className="mt-auto bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl">
                                 <div className="flex justify-between items-center mb-2">
                                     <span className="text-sm font-bold text-emerald-400">Payroll Run</span>
                                     <span className="text-xs text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Ready</span>
                                 </div>
                                 <div className="w-full h-2 bg-emerald-900/50 rounded-full overflow-hidden">
                                     <div className="w-[100%] h-full bg-emerald-500"></div>
                                 </div>
                                 <div className="mt-2 text-xs text-emerald-500/70">All checks validated.</div>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </section>

      {/* --- Enterprise Section --- */}
      <section ref={enterpriseRef} className="py-32 relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
             <div className="flex flex-col lg:flex-row gap-20">
                 <div className="flex-1">
                     <span className="text-blue-500 font-bold text-sm uppercase tracking-widest mb-2 block">Enterprise Grade</span>
                     <h2 className="text-4xl font-bold text-white mb-6">Security is not an afterthought.</h2>
                     <p className="text-gray-400 text-lg leading-relaxed mb-10">
                         Built for organizations that demand the highest standards of data protection, compliance, and control.
                     </p>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                         <div className="flex gap-4">
                             <div className="mt-1"><Lock className="text-blue-500" /></div>
                             <div>
                                 <h4 className="text-white font-bold mb-1">SOC 2 Type II</h4>
                                 <p className="text-sm text-gray-500">Independently audited security controls.</p>
                             </div>
                         </div>
                         <div className="flex gap-4">
                             <div className="mt-1"><Shield className="text-purple-500" /></div>
                             <div>
                                 <h4 className="text-white font-bold mb-1">GDPR Compliant</h4>
                                 <p className="text-sm text-gray-500">Full data sovereignty and privacy tools.</p>
                             </div>
                         </div>
                         <div className="flex gap-4">
                             <div className="mt-1"><Server className="text-emerald-500" /></div>
                             <div>
                                 <h4 className="text-white font-bold mb-1">99.99% Uptime</h4>
                                 <p className="text-sm text-gray-500">Enterprise SLA guarantees.</p>
                             </div>
                         </div>
                         <div className="flex gap-4">
                             <div className="mt-1"><Zap className="text-yellow-500" /></div>
                             <div>
                                 <h4 className="text-white font-bold mb-1">SSO & SAML</h4>
                                 <p className="text-sm text-gray-500">Okta, Azure AD, and Google Workspace.</p>
                             </div>
                         </div>
                     </div>
                 </div>

                 <div className="flex-1 flex items-center justify-center">
                     <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
                         <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px]"></div>
                         
                         <div className="space-y-6 relative z-10">
                             <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                 <span className="text-sm font-bold text-white">Access Control</span>
                                 <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded">Active</span>
                             </div>
                             
                             {[1, 2, 3].map((i) => (
                                 <div key={i} className="flex items-center justify-between">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded-full bg-white/10"></div>
                                         <div>
                                             <div className="h-2 w-24 bg-white/20 rounded mb-1"></div>
                                             <div className="h-2 w-16 bg-white/10 rounded"></div>
                                         </div>
                                     </div>
                                     <div className="w-10 h-5 rounded-full bg-white/5 border border-white/10 relative">
                                         <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-green-500 rounded-full"></div>
                                     </div>
                                 </div>
                             ))}

                             <button className="w-full py-3 mt-4 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
                                 View Audit Logs
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24 px-6 relative z-10">
         <div className="max-w-5xl mx-auto bg-gradient-to-b from-blue-900/40 to-[#0a0a0a] border border-white/10 rounded-3xl p-12 md:p-24 text-center relative overflow-hidden">
             {/* Glows */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/30 blur-[120px] pointer-events-none"></div>
             
             <div className="relative z-10">
                 <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Ready to see clearly?</h2>
                 <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                     Join over 10,000 forward-thinking companies running on GlassFlow. Start your 14-day free trial today.
                 </p>
                 <div className="flex flex-col sm:flex-row justify-center gap-4">
                     <button 
                         onClick={onGetStarted}
                         className="px-10 py-4 bg-white text-black rounded-full text-lg font-bold hover:bg-gray-200 transition-colors shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
                     >
                         Get Started Now
                     </button>
                     <button 
                         onClick={onGetStarted}
                         className="px-10 py-4 bg-transparent border border-white/20 text-white rounded-full text-lg font-medium hover:bg-white/10 transition-colors backdrop-blur-sm cursor-pointer"
                     >
                         Talk to Sales
                     </button>
                 </div>
             </div>
         </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-white/10 bg-[#050505] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center">
                        <Command size={16} />
                    </div>
                    <span className="font-bold text-xl tracking-tight">GlassFlow</span>
                </div>
                <p className="text-gray-500 text-sm max-w-xs mb-6 leading-relaxed">
                    The operating system for modern business. Design, build, and scale with clarity and precision.
                </p>
                <div className="flex gap-4">
                    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                        <Globe size={16} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                        <MessageSquare size={16} />
                    </button>
                </div>
            </div>
            
            <div>
                <h4 className="font-bold text-white mb-6">Product</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                    <li><button onClick={() => scrollToSection(featuresRef)} className="hover:text-white transition-colors cursor-pointer">Features</button></li>
                    <li><button onClick={() => scrollToSection(solutionsRef)} className="hover:text-white transition-colors cursor-pointer">Solutions</button></li>
                    <li><button onClick={onGetStarted} className="hover:text-white transition-colors cursor-pointer">Pricing</button></li>
                    <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-white mb-6">Company</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Careers</a> <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded ml-1">Hiring</span></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-white mb-6">Legal</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                    <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
            <p>&copy; {new Date().getFullYear()} GlassFlow Inc. All rights reserved.</p>
            <div className="flex gap-6">
                <span>System Status: <span className="text-green-500">Operational</span></span>
            </div>
        </div>
      </footer>

      {/* Marquee Keyframes Injection */}
      <style>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
