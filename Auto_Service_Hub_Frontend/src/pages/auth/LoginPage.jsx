import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box,
  UserCheck,
  CreditCard,
  LayoutGrid,
  ClipboardList,
  Wrench,
  Code2,
  Lock,
  Mail,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  X
} from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // If role is passed via query param e.g. /login?role=billing
  const initialRoleParam = searchParams.get('role')

  const roles = [
    {
      id: 'garage-owner',
      title: 'Garage Owner',
      subtitle: 'Executive & Financial Overview',
      description: 'Access revenue metrics, operational KPIs, workshop analytics, and garage settings.',
      icon: LayoutGrid,
      targetPath: '/dashboard',
      defaultEmail: 'owner@smartgarage.ai',
    },
    {
      id: 'service-advisor',
      title: 'Service Advisor',
      subtitle: 'Vehicle Check-in & Job Cards',
      description: 'Manage incoming vehicles, generate job cards, record customer complaints, and track bays.',
      icon: ClipboardList,
      targetPath: '/dashboard',
      defaultEmail: 'advisor@smartgarage.ai',
    },
    {
      id: 'mechanic',
      title: 'Mechanic',
      subtitle: 'Bay Workstation & Diagnostics',
      description: 'View assigned repair tasks, log parts consumed, run AI inspection, and update stage status.',
      icon: Wrench,
      targetPath: '/dashboard',
      defaultEmail: 'mechanic@smartgarage.ai',
    },
    {
      id: 'inventory-manager',
      title: 'Inventory Manager',
      subtitle: 'Stock & Spare Parts Management',
      description: 'Control spare parts catalog, track stock levels, issue part purchase orders, and monitor usage.',
      icon: Box,
      targetPath: '/dashboard',
      defaultEmail: 'inventory@smartgarage.ai',
    },
    {
      id: 'billing',
      title: 'Billing',
      subtitle: 'Invoicing, Estimates & Payments',
      description: 'Manage estimates, GST invoices, payment collection, overdue balances, and financial records.',
      icon: CreditCard,
      targetPath: '/billing',
      defaultEmail: 'billing@smartgarage.ai',
    },
    {
      id: 'customer',
      title: 'Customer',
      subtitle: 'Customer Hub & Self-Service',
      description: 'Access customer database, view vehicles, track live repair progress, and make online payments.',
      icon: UserCheck,
      targetPath: '/customers',
      defaultEmail: 'customer@smartgarage.ai',
    },
    {
      id: 'developer',
      title: 'Developer',
      subtitle: 'API Console & System Integrations',
      description: 'Configure API keys, webhooks, third-party integrations, and custom workflow extensions.',
      icon: Code2,
      targetPath: '/dashboard',
      defaultEmail: 'dev@smartgarage.ai',
    },
  ]

  // Find pre-selected role if query param exists
  const foundInitialRole = roles.find(r => r.id === initialRoleParam)

  const [selectedRole, setSelectedRole] = useState(foundInitialRole || null)
  const [email, setEmail] = useState(foundInitialRole ? foundInitialRole.defaultEmail : '')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSubmitted, setForgotSubmitted] = useState(false)

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setEmail(role.defaultEmail)
    setPassword('password123')
    setError('')
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setError('Please enter a valid email address.')
      return
    }

    if (!password.trim()) {
      setError('Please enter your password.')
      return
    }

    setError('')
    setIsLoading(true)

    // Simulate authenticating delay
    setTimeout(() => {
      setIsLoading(false)
      if (selectedRole) {
        navigate(selectedRole.targetPath)
      } else {
        navigate('/dashboard')
      }
    }, 800)
  }

  const handleForgotSubmit = (e) => {
    e.preventDefault()
    if (!forgotEmail.trim()) return
    setForgotSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#080909] text-[#f0f0f0] flex flex-col justify-between font-sans selection:bg-[#c8f135] selection:text-black">
      {/* Header Bar */}
      <header className="border-b border-[#242626] bg-[#0f1010]/90 backdrop-blur-md px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c8f135] text-black font-extrabold shadow-[0_0_12px_rgba(200,241,53,0.3)]">
              <Box className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <span className="text-base font-extrabold tracking-widest text-[#f0f0f0] uppercase font-display">
              SMARTGARAGE <span className="text-[#c8f135]">AI CRM</span>
            </span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-[#6b6e6e] hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-display uppercase tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </header>

      {/* Main Auth Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center my-auto">
        {!selectedRole ? (
          /* STAGE 1: MODULE / ROLE SELECTION SCREEN */
          <div className="space-y-8 max-w-5xl mx-auto w-full py-4">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8f135]/10 border border-[#c8f135]/30 text-[#c8f135] text-xs font-extrabold uppercase tracking-widest font-display">
                <Sparkles className="w-3.5 h-3.5" /> ACCESS PORTAL & WORKSPACE
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-[#f0f0f0] font-display tracking-tight uppercase">
                SELECT YOUR <span className="text-[#c8f135]">MODULE</span>
              </h1>
              <p className="text-xs md:text-sm text-[#6b6e6e] font-sans">
                Choose your role or workspace module below to proceed to login and access your garage dashboard.
              </p>
            </div>

            {/* 7 Figma Role Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => {
                const Icon = role.icon
                return (
                  <div
                    key={role.id}
                    onClick={() => handleRoleSelect(role)}
                    className="bg-[#141515] border border-[#242626] hover:border-[#c8f135]/60 hover:bg-[#191a1a] rounded-xl p-5 transition-all cursor-pointer space-y-3 group flex flex-col justify-between shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-lg bg-[#191a1a] border border-[#242626] text-[#c8f135] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-[#6b6e6e] uppercase tracking-wider font-mono bg-[#0f1010] px-2 py-0.5 rounded border border-[#242626]">
                          {role.id}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-[#f0f0f0] font-display uppercase tracking-wider group-hover:text-[#c8f135] transition-colors flex items-center justify-between">
                          {role.title}
                          <ArrowRight className="w-4 h-4 text-[#6b6e6e] group-hover:translate-x-1 group-hover:text-[#c8f135] transition-all" />
                        </h3>
                        <p className="text-xs font-semibold text-zinc-400 mt-0.5">{role.subtitle}</p>
                      </div>

                      <p className="text-xs text-[#6b6e6e] leading-relaxed">{role.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#242626] flex items-center justify-between text-[11px] text-[#6b6e6e] font-mono">
                      <span>Login as {role.title}</span>
                      <span className="text-[#c8f135] font-bold">Select →</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* STAGE 2: SIGN IN CREDENTIALS FORM FOR SELECTED ROLE */
          <div className="max-w-md mx-auto w-full space-y-6">
            {/* Top Selected Role Banner */}
            <div className="bg-[#141515] border border-[#242626] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#191a1a] border border-[#242626] text-[#c8f135] flex items-center justify-center">
                  <selectedRole.icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white font-display uppercase tracking-wider">
                    {selectedRole.title}
                  </h2>
                  <p className="text-[11px] text-[#6b6e6e]">{selectedRole.subtitle}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="px-2.5 py-1 rounded bg-[#191a1a] border border-[#242626] text-[#6b6e6e] hover:text-white text-xs font-bold font-display uppercase transition-colors cursor-pointer"
              >
                Change Role
              </button>
            </div>

            {/* Login Card Container */}
            <div className="bg-[#141515] border border-[#242626] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="space-y-1.5 text-center">
                <h1 className="text-2xl font-extrabold text-white uppercase font-display tracking-wider">
                  SIGN IN TO WORKSPACE
                </h1>
                <p className="text-xs text-[#6b6e6e]">
                  Enter your credentials below to access the {selectedRole.title} portal.
                </p>
              </div>

              {/* Validation Error Alert */}
              {error && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f43f5e]/10 border border-[#f43f5e]/40 text-[#f43f5e] text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider font-display">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6b6e6e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="user@smartgarage.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#191a1a] border border-[#242626] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f135] transition-colors"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider font-display">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6b6e6e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-[#191a1a] border border-[#242626] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f135] transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6e6e] hover:text-white p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-[#191a1a] border-[#242626] text-[#c8f135] focus:ring-0 cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email)
                      setForgotSubmitted(false)
                      setIsForgotModalOpen(true)
                    }}
                    className="text-[#c8f135] hover:underline font-semibold font-display uppercase tracking-wider text-[11px] cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-[#c8f135] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(200,241,53,0.3)] hover:bg-[#a8cc20] hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 font-display disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>SIGN IN TO {selectedRole.title.toUpperCase()}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#141515] border border-[#242626] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#242626] pb-3">
              <h3 className="text-sm font-extrabold text-white font-display uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#c8f135]" />
                RESET PASSWORD
              </h3>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="text-[#6b6e6e] hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/40 text-[#22c55e] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-white text-sm font-display">RESET LINK SENT</h4>
                  <p className="text-xs text-[#6b6e6e]">
                    Instructions to reset your password have been sent to <strong className="text-white">{forgotEmail}</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#242626] text-white font-bold text-xs uppercase font-display hover:bg-[#3a3d3d] transition-colors cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                <p className="text-xs text-[#6b6e6e]">
                  Enter your account email address and we'll send you a password reset link.
                </p>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#6b6e6e] uppercase tracking-wider font-display">
                    ACCOUNT EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@smartgarage.ai"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#191a1a] border border-[#242626] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f135]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#242626]">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-[#191a1a] text-zinc-300 font-bold hover:bg-[#242626] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#c8f135] text-black font-extrabold uppercase tracking-wider text-xs font-display hover:bg-[#a8cc20] transition-colors cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#242626] bg-[#0f1010] py-4 px-6 text-center text-xs text-[#6b6e6e]">
        SmartGarage AI CRM Platform &copy; 2026. All rights reserved.
      </footer>
    </div>
  )
}
