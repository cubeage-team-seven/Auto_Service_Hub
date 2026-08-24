import './App.css'
import LandingPage from './pages/landing/LandingPage'

const navItems = ['Features', 'Modules', 'AI Engine', 'Pricing', 'About']

function App() {
  return (
    <div className="app-shell min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10 bg-[#050505]">
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 py-4 md:px-8 xl:px-12">
          
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="nav-icon flex h-12 w-12 items-center justify-center rounded-md bg-[#d8ff3d] text-black shadow-[0_0_22px_rgba(216,255,61,0.55)]">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 10.5 12 4l9 6.5" />
                <path d="M5 9.5V18h14v-8.5" />
                <path d="M10 18v-5h4v5" />
              </svg>
            </div>

            <div className="leading-none">
              <div className="text-[clamp(1.1rem,1vw+0.8rem,2rem)] font-black tracking-[-0.06em] text-[#d8ff3d]">
                SMARTGARAGE
              </div>

              <div className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-white/70">
                AI CRM
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="nav-menu hidden flex-1 items-center justify-center gap-10 text-[1.05rem] font-medium text-white/75 lg:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="transition-colors duration-200 hover:text-[#d8ff3d]"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              className="nav-signin rounded-md border border-[#d8ff3d] bg-transparent px-5 py-3 text-base font-semibold text-[#d8ff3d] transition-transform duration-200 hover:scale-[1.02]"
            >
              Sign In
            </button>

            <button
              type="button"
              className="nav-cta rounded-md bg-[#d8ff3d] px-5 py-3 text-base font-semibold text-[#050505] shadow-[0_0_20px_rgba(216,255,61,0.35)] transition-transform duration-200 hover:scale-[1.02]"
            >
              Get Access <span aria-hidden="true">→</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Landing Page */}
      <main className="mx-auto max-w-[1600px] bg-[#050505]">
        <LandingPage />
      </main>
    </div>
  )
}

export default App