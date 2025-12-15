
import React, { useState } from 'react';
import { Check, X, Command, ArrowRight, ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Minus, ShieldCheck, Zap, Globe, Sparkles, Layout } from 'lucide-react';

interface PackagesProps {
  onSelect: (plan: string) => void;
  onLoginClick: () => void;
  onBack: () => void;
}

const Packages: React.FC<PackagesProps> = ({ onSelect, onLoginClick, onBack }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const plans = [
    {
      name: 'Starter',
      price: 0,
      description: 'Perfect for freelancers and solo founders just starting out.',
      features: ['Up to 100 Leads', 'Basic CRM Pipeline', '1 User Seat', 'Community Support', 'Email Integration'],
      highlight: false,
      cta: 'Start for Free'
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? 29 : 24,
      period: billingCycle === 'monthly' ? '/mo' : '/mo billed yearly',
      description: 'For growing teams requiring advanced automation and reporting.',
      features: ['Unlimited Leads', 'Sales & Pipeline Automation', 'Up to 5 Users', 'Priority Email Support', 'Custom Dashboards', 'API Access'],
      highlight: true,
      cta: 'Get Professional'
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 99 : 82,
      period: billingCycle === 'monthly' ? '/mo' : '/mo billed yearly',
      description: 'Full-scale solution for organizations needing control and security.',
      features: ['Unlimited Users', 'Advanced Roles & Permissions', 'Audit Logs & SSO', 'Dedicated Account Manager', 'SLA Support', 'On-premise Deployment Option'],
      highlight: false,
      cta: 'Contact Sales'
    }
  ];

  const featuresList = [
    { category: 'Core Features', items: [
      { name: 'Lead Management', starter: true, pro: true, ent: true },
      { name: 'Pipeline View', starter: true, pro: true, ent: true },
      { name: 'Contact History', starter: '30 Days', pro: 'Unlimited', ent: 'Unlimited' },
      { name: 'File Storage', starter: '1 GB', pro: '50 GB', ent: 'Unlimited' },
    ]},
    { category: 'Automation & API', items: [
      { name: 'Workflow Automations', starter: false, pro: '5 Active', ent: 'Unlimited' },
      { name: 'Webhooks', starter: false, pro: true, ent: true },
      { name: 'API Rate Limit', starter: false, pro: '1k req/min', ent: '10k req/min' },
    ]},
    { category: 'Security & Control', items: [
      { name: 'Two-Factor Auth', starter: true, pro: true, ent: true },
      { name: 'SAML SSO', starter: false, pro: false, ent: true },
      { name: 'Audit Logs', starter: false, pro: false, ent: true },
      { name: 'Custom Roles', starter: false, pro: true, ent: true },
    ]},
    { category: 'Support', items: [
      { name: 'Support Channel', starter: 'Community', pro: 'Email', ent: 'Dedicated Agent' },
      { name: 'SLA Response Time', starter: '-', pro: '24h', ent: '1h' },
    ]}
  ];

  const faqs = [
    { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades and at the end of the billing cycle for downgrades." },
    { q: "Do you offer discounts for non-profits?", a: "We sure do! Contact our sales team with your documentation, and we'll get you set up with a 50% lifetime discount." },
    { q: "What happens if I exceed my lead limit?", a: "On the Starter plan, you won't be able to add new leads until you archive old ones or upgrade. Professional and Enterprise plans have unlimited leads." },
    { q: "Is my data secure?", a: "Absolutely. We use bank-grade AES-256 encryption at rest and in transit. Our Enterprise plan includes SOC 2 Type II compliance reports." },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col font-sans text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="flex items-center justify-between px-6 lg:px-12 py-4 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-6">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
                <div className="flex items-center gap-2 cursor-pointer group" onClick={onBack}>
                    <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform">
                        <Command size={16} strokeWidth={3} />
                    </div>
                    <span className="font-bold text-lg tracking-tight hidden sm:block text-white">GlassFlow</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 hidden sm:inline">Already have an account?</span>
                <button onClick={onLoginClick} className="text-sm font-bold text-white hover:text-blue-400 transition-colors">Log in</button>
            </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center pt-24 pb-20 px-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-6 backdrop-blur-sm">
            <Sparkles size={12} className="text-yellow-400" />
            Simple Pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
            Plans that scale with your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">ambition.</span>
          </h1>
          <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-xl mx-auto">
            Transparent pricing. No hidden fees. Switch or cancel anytime.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 w-fit mx-auto backdrop-blur-md">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Yearly <span className="text-[9px] font-bold text-black bg-emerald-400 px-1.5 py-0.5 rounded uppercase tracking-wide">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full px-4">
          {plans.map((plan, idx) => (
            <div 
              key={plan.name}
              className={`
                relative flex flex-col p-8 rounded-3xl transition-all duration-300 backdrop-blur-md
                ${plan.highlight 
                  ? 'bg-gradient-to-b from-white/10 to-white/5 border border-white/20 shadow-2xl shadow-blue-900/20 scale-105 z-10' 
                  : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] shadow-xl'}
              `}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-blue-500/30 border border-white/20">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                <p className="text-sm leading-relaxed text-gray-400 min-h-[40px]">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tighter text-white">${plan.price}</span>
                <span className="text-sm font-medium text-gray-500">{plan.name === 'Starter' ? '/mo' : plan.period}</span>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-3 group">
                    <div className={`mt-0.5 p-0.5 rounded-full shrink-0 ${plan.highlight ? 'bg-white text-black' : 'bg-white/10 text-gray-300 group-hover:bg-white group-hover:text-black transition-colors'}`}>
                      <Check size={10} strokeWidth={4} />
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{feat}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onSelect(plan.name)}
                className={`
                  w-full py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group
                  ${plan.highlight 
                    ? 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10' 
                    : 'bg-white/10 text-white hover:bg-white hover:text-black border border-white/10'}
                `}
              >
                {plan.cta} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="py-24 border-y border-white/5 bg-white/[0.02] relative z-10">
          <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-white mb-4">Compare Plans</h2>
                  <p className="text-gray-400">Deep dive into the features included in each tier.</p>
              </div>

              <div className="bg-white/5 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm overflow-hidden">
                  <div className="grid grid-cols-4 bg-white/5 p-6 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-gray-500 sticky top-0">
                      <div className="col-span-1">Feature</div>
                      <div className="col-span-1 text-center text-white">Starter</div>
                      <div className="col-span-1 text-center text-blue-400">Professional</div>
                      <div className="col-span-1 text-center text-purple-400">Enterprise</div>
                  </div>
                  
                  <div className="divide-y divide-white/5">
                      {featuresList.map((category) => (
                          <React.Fragment key={category.category}>
                              <div className="px-6 py-4 bg-white/[0.02] text-xs font-bold text-gray-300 uppercase tracking-wider border-y border-white/5">
                                  {category.category}
                              </div>
                              {category.items.map((item, i) => (
                                  <div key={i} className="grid grid-cols-4 px-6 py-4 text-sm hover:bg-white/5 transition-colors group">
                                      <div className="col-span-1 font-medium text-gray-300 group-hover:text-white transition-colors">{item.name}</div>
                                      <div className="col-span-1 text-center flex justify-center text-gray-500">
                                          {item.starter === true ? <Check size={16} className="text-white" /> : item.starter === false ? <Minus size={16} className="text-gray-600" /> : item.starter}
                                      </div>
                                      <div className="col-span-1 text-center flex justify-center text-gray-500 font-medium">
                                          {item.pro === true ? <Check size={16} className="text-blue-400" /> : item.pro === false ? <Minus size={16} className="text-gray-600" /> : <span className="text-blue-200">{item.pro}</span>}
                                      </div>
                                      <div className="col-span-1 text-center flex justify-center text-gray-500 font-medium">
                                          {item.ent === true ? <Check size={16} className="text-purple-400" /> : item.ent === false ? <Minus size={16} className="text-gray-600" /> : <span className="text-purple-200">{item.ent}</span>}
                                      </div>
                                  </div>
                              ))}
                          </React.Fragment>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* Enterprise CTA */}
      <div className="py-32 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
              <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
              <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs font-medium uppercase tracking-wider mb-6 backdrop-blur-md">
                  <ShieldCheck size={14} className="text-blue-400" /> Enterprise Grade
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">Need a custom solution?</h2>
              <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                  For large organizations with unique requirements, we offer custom billing, dedicated instances, and personalized onboarding.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => onSelect('Enterprise')}
                    className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                  >
                      Contact Enterprise Sales
                  </button>
                  <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-medium hover:bg-white/10 transition-colors backdrop-blur-sm">
                      View Documentation
                  </button>
              </div>
          </div>
      </div>

      {/* FAQ */}
      <div className="py-24 max-w-3xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400">Have a question? We're here to help.</p>
          </div>
          
          <div className="space-y-4">
              {faqs.map((faq, i) => (
                  <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
                      <button 
                        onClick={() => toggleFaq(i)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                      >
                          <span className="font-medium text-white text-base">{faq.q}</span>
                          {openFaqIndex === i ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="p-6 pt-0 text-sm text-gray-400 leading-relaxed border-t border-white/5">
                              {faq.a}
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
      
      {/* Footer */}
      <div className="py-12 border-t border-white/10 bg-[#050505] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Command size={16} className="text-white" />
                <span className="font-bold text-white">GlassFlow</span>
                <span className="mx-2">•</span>
                <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
            </div>
            <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Security</a>
                <a href="#" className="hover:text-white transition-colors">Status</a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
