import jobCardImage from '../../assets/job-card.png'
import retentionImage from '../../assets/retention.png'

const jobSteps = [
  'Vehicle Received',
  'Inspection',
  'Repair',
  'Quality Check',
  'Delivered',
]

const stats = [
  {
    value: '78%',
    label: 'Repeat Rate',
  },
  {
    value: '4.7★',
    label: 'Avg Rating',
  },
  {
    value: '3.2×',
    label: 'Retention',
  },
]

function LandingPage() {
  return (
    <div className="w-full overflow-hidden bg-[#050505] text-white">

      {/* =========================================
          SECTION 1 - DIGITAL JOB CARD
      ========================================== */}
      <section className="border-b border-white/[0.06] px-5 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28 xl:px-20">
        <div className="mx-auto grid max-w-[1160px] items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Image */}
          <div className="order-1 overflow-hidden rounded-lg border border-white/[0.08]">
            <img
                src={jobCardImage}
                alt="Mechanic working on a car"
                className="h-[420px] w-full object-cover md:h-[500px] lg:h-[560px]"
            />
          </div>

          {/* Content */}
          <div className="order-2">

            <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d8ff3d]">
              — Digital Job Card
            </div>

            <h1 className="max-w-[600px] text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
              Zero Paperwork.
              <br />
              Complete Visibility.
            </h1>

            <p className="mt-7 max-w-[600px] text-base leading-7 text-white/45 md:text-lg">
              Every repair tracked from reception to delivery. Mechanics
              update tasks in real time.
            </p>

            {/* Process */}
            <div className="mt-8 flex flex-wrap items-center gap-2">

              {jobSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-2">

                  <div className="rounded-md border border-[#d8ff3d]/30 bg-[#11140a] px-3 py-2 text-[11px] font-medium text-[#d8ff3d]">
                    {step}
                  </div>

                  {index < jobSteps.length - 1 && (
                    <span className="text-white/25">
                      →
                    </span>
                  )}

                </div>
              ))}

            </div>
          </div>
        </div>
      </section>


      {/* =========================================
          SECTION 2 - CUSTOMER RETENTION
      ========================================== */}
      <section className="border-b border-white/[0.06] px-5 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28 xl:px-20">
        <div className="mx-auto grid max-w-[1160px] items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Content */}
          <div className="order-2 lg:order-1">

            <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d8ff3d]">
              — Customer Retention
            </div>

            <h2 className="max-w-[600px] text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
              Repeat Service.
              <br />
              Loyal Customers.
            </h2>

            <p className="mt-7 max-w-[600px] text-base leading-7 text-white/45 md:text-lg">
              Automated reminders, WhatsApp follow-up, feedback collection
              and loyalty tier management.
            </p>

            {/* Statistics */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">

              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-md border border-white/[0.08] bg-[#101010] px-5 py-5 text-center"
                >
                  <div className="text-2xl font-black text-[#d8ff3d] md:text-3xl">
                    {stat.value}
                  </div>

                  <div className="mt-2 text-xs text-white/40">
                    {stat.label}
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Image */}
          <div className="order-1 overflow-hidden rounded-lg border border-white/[0.08] lg:order-2">
        <img
            src={retentionImage}
            alt="Mechanic repairing a vehicle"
            className="h-[420px] w-full object-cover md:h-[500px] lg:h-[460px]"
        />
          </div>

        </div>
      </section>


      {/* =========================================
          SECTION 3 - FEATURED IN
      ========================================== */}
      <section className="border-b border-white/[0.06] px-5 py-12 md:px-10 lg:px-16">

        <div className="mx-auto max-w-[1160px]">

          <div className="mb-8 text-center text-[10px] uppercase tracking-[0.35em] text-white/25">
            Featured In
          </div>

          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-3 lg:grid-cols-6">

            {[
              'TOPGEAR INDIA',
              'AUTOCAR INDIA',
              'NDTV AUTO',
              'CARWALE',
              'ZIGWHEELS',
              'TEAM-BHP',
            ].map((brand) => (
              <div
                key={brand}
                className="text-xs font-bold tracking-tight text-white/25"
              >
                {brand}
              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =========================================
          SECTION 4 - ACCESS
      ========================================== */}
      <section className="px-5 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28 xl:px-20">

        <div className="mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-2">

          {/* Left Content */}
          <div>

            <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d8ff3d]">
              — Access
            </div>

            <h2 className="max-w-[500px] text-5xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl">
              Manage The
              <br />
              Future.
            </h2>

            <p className="mt-7 max-w-[600px] text-base leading-7 text-white/45 md:text-lg">
              SmartGarage AI CRM for automobile workshops, multi-bay service
              centres and franchise networks.
            </p>

          </div>


          {/* Form */}
          <div className="rounded-lg border border-white/[0.09] bg-[#101010] p-7 md:p-8">

            <h3 className="text-sm font-black uppercase tracking-tight text-white">
              Request Platform Access
            </h3>

            <form className="mt-7 space-y-3">

              {/* First + Last Name */}
              <div className="grid gap-3 sm:grid-cols-2">

                <input
                  type="text"
                  placeholder="First Name"
                  className="h-12 rounded-md border border-white/[0.08] bg-[#151515] px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#d8ff3d]/60"
                />

                <input
                  type="text"
                  placeholder="Last Name"
                  className="h-12 rounded-md border border-white/[0.08] bg-[#151515] px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#d8ff3d]/60"
                />

              </div>

              <input
                type="email"
                placeholder="Email"
                className="h-12 w-full rounded-md border border-white/[0.08] bg-[#151515] px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#d8ff3d]/60"
              />

              <input
                type="tel"
                placeholder="Phone"
                className="h-12 w-full rounded-md border border-white/[0.08] bg-[#151515] px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#d8ff3d]/60"
              />

              <textarea
                placeholder="Workshop name and number of bays..."
                rows="2"
                className="w-full resize-none rounded-md border border-white/[0.08] bg-[#151515] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#d8ff3d]/60"
              />

              <button
                type="submit"
                className="mt-2 h-12 w-full rounded-md bg-[#d8ff3d] px-5 text-xs font-black uppercase tracking-tight text-[#050505] transition-all duration-200 hover:brightness-110"
              >
                Submit Inquiry →
              </button>

            </form>

          </div>

        </div>

      </section>

    </div>
  )
}

export default LandingPage