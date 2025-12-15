
import React, { useState, useEffect } from 'react';
import { 
  Mail, Lock, User, ArrowRight, Command, Loader2, CheckCircle, 
  ArrowLeft, Chrome, Building2, Briefcase, Eye, EyeOff, AlertCircle, ShieldCheck,
  Key, Globe, ChevronRight
} from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
  onBack?: () => void;
}

type AuthView = 'login' | 'signup' | 'forgot-password' | 'sso' | 'magic-link';

// --- Assets ---

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0H10.9091V10.9091H0V0Z" fill="#F25022"/>
    <path d="M12.0908 0H23V10.9091H12.0908V0Z" fill="#7FBA00"/>
    <path d="M0 12.0908H10.9091V22.9999H0V12.0908Z" fill="#00A4EF"/>
    <path d="M12.0908 12.0908H23V22.9999H12.0908V12.0908Z" fill="#FFB900"/>
  </svg>
);

// --- Sub-Components ---

const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden bg-[#050505]">
    <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-600/20 blur-[120px] animate-blob" />
    <div className="absolute top-[20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-purple-600/20 blur-[120px] animate-blob animation-delay-2000" />
    <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-emerald-600/20 blur-[120px] animate-blob animation-delay-4000" />
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
  </div>
);

const FloatingInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  icon: Icon,
  showPasswordToggle = false,
  autoFocus = false
}: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`relative mb-5 group ${error ? 'animate-shake' : ''}`}>
      <div className={`
        relative flex items-center border rounded-xl transition-all duration-200
        bg-gray-50 focus-within:bg-white focus-within:border-black focus-within:shadow-[0_0_0_1px_black]
        ${error ? 'border-red-300 bg-red-50/10' : 'border-gray-200 hover:border-gray-300'}
      `}>
        <div className="pl-4 text-gray-400 group-focus-within:text-black transition-colors">
          <Icon size={18} />
        </div>
        
        <div className="relative flex-1">
            <input
              name={name}
              type={inputType}
              value={value}
              onChange={onChange}
              autoFocus={autoFocus}
              placeholder=" " 
              className="peer w-full px-4 pt-5 pb-2 text-sm bg-transparent outline-none text-gray-900 placeholder-transparent"
            />
            <label className="
              absolute left-4 top-3.5 text-gray-400 text-sm transition-all duration-200 pointer-events-none font-medium
              peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5
              peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-gray-500
              peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-gray-500
            ">
              {label}
            </label>
        </div>
        
        {showPasswordToggle && (
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <div className="absolute -bottom-5 left-1 flex items-center gap-1 text-[10px] text-red-500 font-medium animate-slide-up">
          <AlertCircle size={10} /> {error}
        </div>
      )}
    </div>
  );
};

const PasswordStrength = ({ password }: { password: string }) => {
  if (!password) return null;
  
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(password);
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];

  return (
    <div className="flex flex-col gap-1 mt-1 mb-6 animate-fade-in">
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < strength ? colors[strength-1] : 'bg-gray-100'}`} 
          />
        ))}
      </div>
      <div className="flex justify-between items-center text-[10px] text-gray-400 px-0.5">
          <span>Password strength</span>
          <span className={`font-medium ${strength > 2 ? 'text-emerald-600' : 'text-gray-500'}`}>
             {labels[Math.min(strength - 1, 3)] || 'Too short'}
          </span>
      </div>
    </div>
  );
};

// --- Main Component ---

const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [view, setView] = useState<AuthView>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Specific Loading States for social buttons
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    agreedToTerms: false,
    ssoDomain: ''
  });

  // Clear state when switching views
  useEffect(() => {
    setErrors({});
    setSuccessMessage('');
    setFormData(prev => ({ ...prev, password: '' })); // Clear sensitive data
  }, [view]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /\S+@\S+\.\S+/;
    
    if (view === 'sso') {
        if (!formData.ssoDomain) newErrors.ssoDomain = 'Company domain is required';
        else if (!formData.ssoDomain.includes('.')) newErrors.ssoDomain = 'Invalid domain format';
    } else if (view !== 'magic-link' && view !== 'forgot-password') {
        // Basic validation for main flows
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email address';
    } else {
        // Special case for magic link and forgot password
         if (!formData.email) newErrors.email = 'Email is required';
         else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email address';
    }

    if (['login', 'signup'].includes(view)) {
       if (!formData.password) newErrors.password = 'Password is required';
       else if (view === 'signup' && formData.password.length < 8) newErrors.password = 'Must be at least 8 characters';
    }

    if (view === 'signup') {
        if (!formData.name) newErrors.name = 'Full name is required';
        if (!formData.companyName) newErrors.companyName = 'Company name is required';
        if (!formData.agreedToTerms) newErrors.terms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulateRequest = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await simulateRequest();

    if (view === 'login' || view === 'signup') {
        onLogin();
    } else if (view === 'forgot-password') {
        setSuccessMessage('We have sent a password reset link to your email.');
    } else if (view === 'magic-link') {
        setSuccessMessage('Check your inbox! We sent you a magic link to sign in.');
    } else if (view === 'sso') {
        // Mock SSO redirection
        // In reality this would go to IdP
        onLogin();
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoadingProvider(provider);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLoadingProvider(null);
    onLogin();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (errors[e.target.name]) {
        setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  // --- Render Helpers ---

  const renderSocialButtons = () => (
    <div className="grid grid-cols-2 gap-3 mb-6">
        <button 
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={!!loadingProvider}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-700 disabled:opacity-50 bg-white"
        >
            {loadingProvider === 'google' ? <Loader2 size={16} className="animate-spin" /> : <Chrome size={18} />}
            Google
        </button>
        <button 
            type="button"
            onClick={() => handleSocialLogin('microsoft')}
            disabled={!!loadingProvider}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-700 disabled:opacity-50 bg-white"
        >
            {loadingProvider === 'microsoft' ? <Loader2 size={16} className="animate-spin" /> : <MicrosoftIcon />}
            Microsoft
        </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-gray-900 selection:bg-black selection:text-white">
      
      {/* LEFT PANEL: Form Area */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 lg:p-12 relative z-10 bg-white">
        
        {/* Nav: Back Button */}
        <div className="absolute top-8 left-8 lg:left-12">
             {onBack ? (
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-black transition-colors group px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>
             ) : (
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center shadow-lg hover:rotate-3 transition-transform">
                        <Command size={16} />
                    </div>
                    <span className="font-bold text-lg tracking-tight">GlassFlow</span>
                </div>
             )}
        </div>

        <div className="w-full max-w-[400px] mt-16 lg:mt-0 animate-fade-in-up">
            
            {/* View Title */}
            <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-black">
                    {view === 'login' && 'Welcome back'}
                    {view === 'signup' && 'Create account'}
                    {view === 'forgot-password' && 'Reset password'}
                    {view === 'sso' && 'Sign in with SSO'}
                    {view === 'magic-link' && 'Use Magic Link'}
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                    {view === 'login' && 'Enter your credentials to access your workspace.'}
                    {view === 'signup' && 'Start your 14-day free trial. No credit card required.'}
                    {view === 'forgot-password' && 'We’ll send you a secure link to reset your password.'}
                    {view === 'sso' && 'Enter your company domain to authenticate via your Identity Provider.'}
                    {view === 'magic-link' && 'We’ll email you a magic link for a password-free sign in.'}
                </p>
            </div>

            {/* Success Notification */}
            {successMessage ? (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl flex items-start gap-3 animate-fade-in">
                    <CheckCircle size={18} className="shrink-0 mt-0.5 text-green-600" />
                    <div className="flex-1">
                        <p className="font-medium">Success</p>
                        <p className="text-xs opacity-90 mt-0.5">{successMessage}</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Primary Form */}
                    <form onSubmit={handleSubmit} className="space-y-1">
                        
                        {/* SSO View */}
                        {view === 'sso' && (
                            <div className="animate-slide-in-right">
                                <FloatingInput 
                                    label="Company Domain" 
                                    name="ssoDomain" 
                                    icon={Globe} 
                                    value={formData.ssoDomain} 
                                    onChange={handleChange}
                                    error={errors.ssoDomain}
                                    autoFocus
                                />
                            </div>
                        )}

                        {/* Magic Link & Forgot Password Views */}
                        {(view === 'magic-link' || view === 'forgot-password') && (
                            <div className="animate-slide-in-right">
                                <FloatingInput 
                                    label="Work Email" 
                                    name="email" 
                                    type="email"
                                    icon={Mail} 
                                    value={formData.email} 
                                    onChange={handleChange}
                                    error={errors.email}
                                    autoFocus
                                />
                            </div>
                        )}

                        {/* Login & Signup Views */}
                        {(view === 'login' || view === 'signup') && (
                            <div className="space-y-1 animate-slide-in-right">
                                {view === 'signup' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <FloatingInput 
                                            label="Full Name" 
                                            name="name" 
                                            icon={User} 
                                            value={formData.name} 
                                            onChange={handleChange}
                                            error={errors.name}
                                        />
                                        <FloatingInput 
                                            label="Company" 
                                            name="companyName" 
                                            icon={Building2} 
                                            value={formData.companyName} 
                                            onChange={handleChange}
                                            error={errors.companyName}
                                        />
                                    </div>
                                )}

                                <FloatingInput 
                                    label="Work Email" 
                                    name="email" 
                                    type="email"
                                    icon={Mail} 
                                    value={formData.email} 
                                    onChange={handleChange}
                                    error={errors.email}
                                />

                                <FloatingInput 
                                    label="Password" 
                                    name="password" 
                                    icon={Lock} 
                                    showPasswordToggle
                                    value={formData.password} 
                                    onChange={handleChange}
                                    error={errors.password}
                                />
                                {view === 'signup' && <PasswordStrength password={formData.password} />}
                            </div>
                        )}

                        {/* View Specific Options */}
                        {view === 'login' && (
                            <div className="flex items-center justify-between mb-6">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black" />
                                    <span className="text-xs text-gray-500 group-hover:text-black transition-colors">Remember me</span>
                                </label>
                                <button 
                                    type="button"
                                    onClick={() => setView('forgot-password')}
                                    className="text-xs font-medium text-black hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {view === 'signup' && (
                            <div className="mb-6">
                                <label className={`flex items-start gap-2 cursor-pointer group ${errors.terms ? 'animate-shake' : ''}`}>
                                    <input 
                                        type="checkbox" 
                                        name="agreedToTerms"
                                        checked={formData.agreedToTerms}
                                        onChange={handleChange}
                                        className="w-4 h-4 mt-0.5 rounded border-gray-300 text-black focus:ring-black accent-black" 
                                    />
                                    <span className={`text-xs leading-relaxed ${errors.terms ? 'text-red-500' : 'text-gray-500'}`}>
                                        I agree to the <a href="#" className="text-black underline">Terms of Service</a> and <a href="#" className="text-black underline">Privacy Policy</a>.
                                    </span>
                                </label>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    {view === 'login' && 'Sign In'}
                                    {view === 'signup' && 'Create Account'}
                                    {view === 'forgot-password' && 'Send Reset Link'}
                                    {view === 'magic-link' && 'Send Magic Link'}
                                    {view === 'sso' && 'Continue with SSO'}
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Secondary Actions / Dividers */}
                    {['login', 'signup'].includes(view) && (
                        <div className="mt-8 mb-6">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                                    <span className="bg-white px-3 text-gray-400 font-semibold">Or continue with</span>
                                </div>
                            </div>

                            {renderSocialButtons()}

                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => setView('sso')}
                                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <ShieldCheck size={14} /> SSO Login
                                </button>
                                <button 
                                    onClick={() => setView('magic-link')}
                                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <Key size={14} /> Magic Link
                                </button>
                            </div>
                        </div>
                    )}

                    {/* View Switcher Links */}
                    <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
                        {view === 'login' && (
                            <p>
                                Don't have an account?{' '}
                                <button onClick={() => setView('signup')} className="text-black font-semibold hover:underline">
                                    Sign up for free
                                </button>
                            </p>
                        )}
                        {(view === 'signup' || view === 'forgot-password' || view === 'sso' || view === 'magic-link') && (
                            <button onClick={() => setView('login')} className="text-black font-semibold hover:underline flex items-center gap-2 mx-auto text-sm">
                                <ArrowLeft size={14} /> Back to standard login
                            </button>
                        )}
                    </div>
                </>
            )}

            {/* Footer */}
            <div className="mt-12 flex justify-center gap-6 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                <a href="#" className="hover:text-black transition-colors">Privacy</a>
                <a href="#" className="hover:text-black transition-colors">Terms</a>
                <a href="#" className="hover:text-black transition-colors">Contact</a>
            </div>
        </div>
      </div>

      {/* RIGHT PANEL: Aurora Experience - Sticky */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-black items-center justify-center p-12 sticky top-0 h-screen">
          
          <AuroraBackground />
          
          <div className="relative z-10 max-w-lg">
             <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-2xl animate-fade-in-up">
                {/* Decoration */}
                <div className="flex gap-2 mb-8">
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>

                <h2 className="text-3xl font-light text-white leading-tight mb-6">
                    "GlassFlow transformed how we handle operations. It's the operating system for modern business."
                </h2>

                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" 
                        alt="Testimonial" 
                        className="w-12 h-12 rounded-full border-2 border-white/20 object-cover" 
                    />
                    <div>
                        <h4 className="text-white font-semibold text-sm">Sarah Jenkins</h4>
                        <p className="text-white/40 text-xs">VP of Operations, TechNova</p>
                    </div>
                    <div className="ml-auto flex gap-1">
                        {[1,2,3,4,5].map(i => <ShieldCheck key={i} size={14} className="text-emerald-500" />)}
                    </div>
                </div>
             </div>

             <div className="mt-8 flex justify-between items-center text-white/30 text-xs font-mono">
                 <span className="flex items-center gap-2"><Lock size={12} /> SECURE 256-BIT ENCRYPTION</span>
                 <span className="flex items-center gap-2"><ShieldCheck size={12} /> SOC2 TYPE II CERTIFIED</span>
             </div>
          </div>
      </div>
      
      {/* CSS Keyframes for Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
            animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(10px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right {
            animation: slideInRight 0.3s ease-out forwards;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slideUp 0.3s ease-out forwards;
        }
        /* Autofill overrides */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active{
            -webkit-box-shadow: 0 0 0 30px white inset !important;
            -webkit-text-fill-color: black !important;
            transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default Auth;
