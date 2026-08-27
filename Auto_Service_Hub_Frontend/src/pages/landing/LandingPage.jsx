import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  CreditCard,
  LayoutGrid,
  Users,
  Wrench,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ChevronRight,
  Cpu,
  BarChart3,
  Bot
} from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: CreditCard,
      title: 'Smart Invoicing & Estimates',
      description: 'Generate GST compliant estimates and invoices in seconds with automated tax calculations and instant UPI link sharing.',
      tag: 'Billing',
    },
    {
      icon: Users,
      title: 'Customer Directory & Loyalty',
      description: 'Track customer profiles, multi-vehicle history, visit frequencies, and tiered loyalty levels (Platinum, Gold, Silver, Bronze).',
      tag: 'Customers',
    },
    {
      icon: Bot,
      title: 'AI Diagnostic Assistant',
      description: 'Automated fault diagnosis, part recommendation algorithms, and intelligent labor estimate forecasting.',
      tag: 'AI Core',
    },
    {
      icon: LayoutGrid,
      title: 'Workshop Bay Management',
      description: 'Real-time bay status tracking, technician assignment, inspection checklists, and job card scheduling.',
      tag: 'Operations',
    },
    {
      icon: Wrench,
      title: 'Mechanic Workstation',
      description: 'Digital bay interface for mechanics to log parts, view diagnosis codes, and complete quality control checks.',
      tag: 'Workshop',
    },
    {
      icon: BarChart3,
      title: 'Financial & Revenue Analytics',
      description: 'Comprehensive financial reports, pending collection alerts, daily revenue insights, and growth metrics.',
      tag: 'Analytics',
    },
  ]

  const stats = [
    { value: '10x', label: 'Faster Estimate Generation' },
    { value: '₹4.8L+', label: 'Average Monthly Revenue Tracked' },
    { value: '99.8%', label: 'Invoicing Tax Accuracy' },
    { value: '500+', label: 'Active Smart Garages' },
  ]

  return (
    <div className="min-h-screen bg-[#080909] text-[#f0f0f0] flex flex-col font-sans selection:bg-[#c8f135] selection:text-black">
      {/* Navbar */}
      <header className="border-b border-[#242626] bg-[#0f1010]/90 backdrop-blur-md px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c8f135] text-black font-extrabold shadow-[0_0_12px_rgba(200,241,53,0.3)]">
              <Box className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <span className="text-base font-extrabold tracking-widest text-[#f0f0f0] uppercase font-display">
              SMARTGARAGE <span className="text-[#c8f135]">AI CRM</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#6b6e6e] font-display">
            <a href="#features" className="hover:text-[#c8f135] transition-colors">Features</a>
            <a href="#modules" className="hover:text-[#c8f135] transition-colors">Modules</a>
            <a href="#stats" className="hover:text-[#c8f135] transition-colors">Performance</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-lg bg-[#191a1a] border border-[#242626] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#242626] transition-all font-display cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-lg bg-[#c8f135] text-black text-xs font-extrabold uppercase tracking-wider shadow-[0_0_12px_rgba(200,241,53,0.3)] hover:bg-[#a8cc20] hover:scale-105 transition-all font-display cursor-pointer"
            >
              Get Access
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20 space-y-20">
        <div className="text-center space-y-6 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c8f135]/10 border border-[#c8f135]/30 text-[#c8f135] text-xs font-extrabold uppercase tracking-widest font-display">
            <Sparkles className="w-4 h-4" /> AI-POWERED GARAGE OPERATING SYSTEM
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-[#f0f0f0] font-display tracking-tight uppercase leading-[1.05]">
            TRANSFORM YOUR AUTO WORKSHOP OPERATIONS WITH <span className="text-[#c8f135]">INTELLIGENT CRM</span>
          </h1>

          <p className="text-sm md:text-base text-[#6b6e6e] leading-relaxed max-w-2xl mx-auto">
            The next-generation garage management platform. Streamline billing, customer tracking, job cards, inventory control, and AI diagnostics in one unified visual workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#c8f135] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(200,241,53,0.35)] hover:bg-[#a8cc20] hover:scale-105 transition-all font-display flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#141515] border border-[#242626] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#191a1a] transition-all font-display flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Select Module Portal</span>
              <ChevronRight className="w-4 h-4 text-[#6b6e6e]" />
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div id="features" className="space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[11px] font-extrabold text-[#c8f135] uppercase tracking-widest font-display block">
              PLATFORM CAPABILITIES
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#f0f0f0] font-display uppercase tracking-wider">
              BUILT FOR MODERN WORKSHOP EFFICIENCY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => {
              const Icon = feat.icon
              return (
                <div
                  key={i}
                  className="bg-[#141515] border border-[#242626] hover:border-[#c8f135]/40 rounded-xl p-6 transition-all space-y-4 shadow-lg group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#191a1a] border border-[#242626] text-[#c8f135] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#6b6e6e] uppercase tracking-wider font-mono bg-[#0f1010] px-2 py-0.5 rounded border border-[#242626]">
                      {feat.tag}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-[#f0f0f0] font-display uppercase tracking-wider group-hover:text-[#c8f135] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[#6b6e6e] leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Direct Module Links Section */}
        <div id="modules" className="bg-[#141515] border border-[#242626] rounded-2xl p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#242626] pb-6">
            <div>
              <span className="text-[11px] font-extrabold text-[#c8f135] uppercase tracking-widest font-display block">
                WORKSPACES & PORTALS
              </span>
              <h3 className="text-2xl font-extrabold text-white font-display uppercase tracking-wider mt-1">
                ACCESS CORE GARAGE MODULES
              </h3>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 rounded-xl bg-[#c8f135] text-black font-extrabold text-xs uppercase font-display tracking-wider hover:bg-[#a8cc20] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>View All Role Portals</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => navigate('/login?role=billing')}
              className="bg-[#191a1a] border border-[#242626] hover:border-[#c8f135] rounded-xl p-5 cursor-pointer space-y-2 group transition-all"
            >
              <CreditCard className="w-6 h-6 text-[#c8f135] mb-2" />
              <h4 className="font-extrabold text-white font-display text-base uppercase tracking-wider group-hover:text-[#c8f135] transition-colors">
                Billing & Payments
              </h4>
              <p className="text-xs text-[#6b6e6e]">Invoices, quick estimates, GST breakdown, and overdue tracking.</p>
            </div>

            <div
              onClick={() => navigate('/login?role=customer')}
              className="bg-[#191a1a] border border-[#242626] hover:border-[#c8f135] rounded-xl p-5 cursor-pointer space-y-2 group transition-all"
            >
              <Users className="w-6 h-6 text-[#c8f135] mb-2" />
              <h4 className="font-extrabold text-white font-display text-base uppercase tracking-wider group-hover:text-[#c8f135] transition-colors">
                Customers Hub
              </h4>
              <p className="text-xs text-[#6b6e6e]">Customer directory, loyalty tiers, vehicle count, and balances.</p>
            </div>

            <div
              onClick={() => navigate('/login?role=garage-owner')}
              className="bg-[#191a1a] border border-[#242626] hover:border-[#c8f135] rounded-xl p-5 cursor-pointer space-y-2 group transition-all"
            >
              <LayoutGrid className="w-6 h-6 text-[#c8f135] mb-2" />
              <h4 className="font-extrabold text-white font-display text-base uppercase tracking-wider group-hover:text-[#c8f135] transition-colors">
                Garage Owner
              </h4>
              <p className="text-xs text-[#6b6e6e]">Executive KPIs, workshop bay utilization, and financial summary.</p>
            </div>

            <div
              onClick={() => navigate('/login?role=mechanic')}
              className="bg-[#191a1a] border border-[#242626] hover:border-[#c8f135] rounded-xl p-5 cursor-pointer space-y-2 group transition-all"
            >
              <Wrench className="w-6 h-6 text-[#c8f135] mb-2" />
              <h4 className="font-extrabold text-white font-display text-base uppercase tracking-wider group-hover:text-[#c8f135] transition-colors">
                Mechanic Bay
              </h4>
              <p className="text-xs text-[#6b6e6e]">Digital bay workstation, parts log, and stage inspection checklist.</p>
            </div>
          </div>
        </div>

        {/* Performance Stats Banner */}
        <div id="stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((st, i) => (
            <div key={i} className="bg-[#141515] border border-[#242626] rounded-xl p-6 text-center space-y-1">
              <div className="text-3xl md:text-4xl font-extrabold text-[#c8f135] font-mono tracking-tight">
                {st.value}
              </div>
              <div className="text-xs font-extrabold text-[#6b6e6e] uppercase tracking-wider font-display">
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#242626] bg-[#0f1010] py-8 px-6 text-center text-xs text-[#6b6e6e] space-y-3">
        <div className="flex items-center justify-center gap-2 font-display uppercase tracking-widest text-[#f0f0f0] text-sm">
          <Box className="w-4 h-4 text-[#c8f135]" /> SMARTGARAGE AI CRM
        </div>
        <p>Enterprise Automotive Workshop Management Operating System &copy; 2026. All rights reserved.</p>
      </footer>
    </div>
  )
}
