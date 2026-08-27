import React from 'react'
import DashboardLayout from '../../layout/DashboardLayout'
import { Search, Calendar, Package } from 'lucide-react'

export default function DashboardPage() {
  const activeJobs = [
    { id: 'JC-2488', customer: 'Arjun Mehta', vehicle: 'MH-12-AB-4521 | Swift', mechanic: 'Ravi Kumar', status: 'In Repair', statusType: 'inrepair', eta: 'Today 5:00 PM', amount: '₹18,500' },
    { id: 'JC-2487', customer: 'Priya Sharma', vehicle: 'DL-01-CZ-9834 | Creta', mechanic: 'Amit Patel', status: 'Quality Check', statusType: 'quality', eta: 'Today 3:30 PM', amount: '₹8,200' },
    { id: 'JC-2486', customer: 'Rohit Desai', vehicle: 'GJ-05-XY-7712 | Innova', mechanic: 'Suresh Nair', status: 'Delivered', statusType: 'delivered', eta: 'Delivered', amount: '₹12,400' },
    { id: 'JC-2485', customer: 'Neha Joshi', vehicle: 'MH-14-PQ-3356 | City', mechanic: 'Ravi Kumar', status: 'Inspection', statusType: 'inspection', eta: 'Today 6:00 PM', amount: '₹4,800' },
    { id: 'JC-2484', customer: 'Vikram Singh', vehicle: 'UP-32-GH-1190 | Fortuner', mechanic: 'Amit Patel', status: 'Received', statusType: 'received', eta: 'Tomorrow 12:00 PM', amount: '₹32,000' },
    { id: 'JC-2483', customer: 'Kavita Rao', vehicle: 'KA-03-MN-5587 | Baleno', mechanic: 'Deepak Verma', status: 'Delivered', statusType: 'delivered', eta: 'Delivered', amount: '₹3,200' },
  ]

  const mechanicWorkload = [
    { name: 'Ravi Kumar', active: '3 active', color: 'bg-[#bfff00]' },
    { name: 'Amit Patel', active: '2 active', color: 'bg-[#bfff00]' },
    { name: 'Suresh Nair', active: '0 active', color: 'bg-emerald-500' },
    { name: 'Deepak Verma', active: '1 active', color: 'bg-[#bfff00]' },
    { name: 'Kiran Joshi', active: '0 active', color: 'bg-[#bfff00]' },
  ]

  const getStatusBadge = (status, type) => {
    switch (type) {
      case 'inrepair':
      case 'delivered':
        return <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-[#0f291e] border border-[#22c55e]/60 text-[#4ade80]">{status}</span>
      case 'quality':
        return <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-[#21152d] border border-[#a855f7]/60 text-[#c084fc]">{status}</span>
      case 'inspection':
        return <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-[#2a1b0e] border border-[#f97316]/60 text-[#fb923c]">{status}</span>
      case 'received':
        return <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-[#111f33] border border-[#3b82f6]/60 text-[#60a5fa]">{status}</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-zinc-800 border border-zinc-700 text-zinc-300">{status}</span>
    }
  }

  return (
    <DashboardLayout activeModule="Dashboard">
      <div className="space-y-6">
        {/* Subheader Title Area */}
        <div className="space-y-1">
          <div className="text-xs font-bold text-[#bfff00] tracking-widest uppercase font-mono flex items-center gap-1.5">
            <span>— TODAY, 17 AUGUST 2026</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider font-display">
            OPERATIONS OVERVIEW
          </h1>
        </div>

        {/* 4 Stat KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1 */}
          <div className="bg-[#121215] border border-[#1e1e24] rounded-xl p-4.5 space-y-1.5 hover:border-[#2a2a35] transition-all">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-display block">TODAY'S JOBS</span>
            <div className="text-3xl md:text-4xl font-extrabold text-[#bfff00] font-mono tracking-tight">14</div>
            <p className="text-xs text-zinc-400 font-medium">8 active • 6 delivered</p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#121215] border border-[#1e1e24] rounded-xl p-4.5 space-y-1.5 hover:border-[#2a2a35] transition-all">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-display block">REVENUE TODAY</span>
            <div className="text-3xl md:text-4xl font-extrabold text-white font-mono tracking-tight">₹42,500</div>
            <p className="text-xs text-[#4ade80] font-semibold">+12% vs yesterday</p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#121215] border border-[#1e1e24] rounded-xl p-4.5 space-y-1.5 hover:border-[#2a2a35] transition-all">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-display block">PENDING INVOICES</span>
            <div className="text-3xl md:text-4xl font-extrabold text-white font-mono tracking-tight">6</div>
            <p className="text-xs text-zinc-400 font-medium">₹48,294 outstanding</p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#121215] border border-[#1e1e24] rounded-xl p-4.5 space-y-1.5 hover:border-[#2a2a35] transition-all">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-display block">LOW STOCK ALERTS</span>
            <div className="text-3xl md:text-4xl font-extrabold text-white font-mono tracking-tight">3</div>
            <p className="text-xs text-zinc-400 font-medium">ACF, OIF, TYR</p>
          </div>
        </div>

        {/* Active Job Cards & Right Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Active Job Cards Table (3 Cols) */}
          <div className="lg:col-span-3 bg-[#121215] border border-[#1e1e24] rounded-xl p-5 space-y-4 shadow-xl">
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider font-display">
              ACTIVE JOB CARDS
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1c1c22] text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono bg-[#16161c]">
                    <th className="py-3 px-3.5">JOB ID</th>
                    <th className="py-3 px-3.5">CUSTOMER</th>
                    <th className="py-3 px-3.5">VEHICLE</th>
                    <th className="py-3 px-3.5">MECHANIC</th>
                    <th className="py-3 px-3.5">STATUS</th>
                    <th className="py-3 px-3.5">ETA</th>
                    <th className="py-3 px-3.5 text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18181f]">
                  {activeJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-[#16161b] transition-colors border-b border-[#18181f]/80">
                      <td className="py-3.5 px-3.5 font-mono font-bold text-sm text-[#bfff00] tracking-wide">{job.id}</td>
                      <td className="py-3.5 px-3.5 font-bold text-sm text-white">{job.customer}</td>
                      <td className="py-3.5 px-3.5 text-xs text-zinc-300 font-medium">{job.vehicle}</td>
                      <td className="py-3.5 px-3.5 text-xs text-zinc-200 font-medium">{job.mechanic}</td>
                      <td className="py-3.5 px-3.5">{getStatusBadge(job.status, job.statusType)}</td>
                      <td className="py-3.5 px-3.5 text-xs text-zinc-400 font-medium">{job.eta}</td>
                      <td className="py-3.5 px-3.5 font-bold font-mono text-sm text-white text-right">{job.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side Column (1 Col) */}
          <div className="space-y-4">
            {/* Mechanic Workload Card */}
            <div className="bg-[#121215] border border-[#1e1e24] rounded-xl p-4.5 space-y-3.5">
              <h3 className="text-xs font-extrabold text-zinc-300 uppercase tracking-widest font-display">
                MECHANIC WORKLOAD
              </h3>
              <div className="space-y-2.5">
                {mechanicWorkload.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-[#18181f] last:border-0">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${m.color}`} />
                      <span className="text-sm font-semibold text-white">{m.name}</span>
                    </div>
                    <span className="text-xs font-mono font-medium text-zinc-400 bg-[#18181d] px-2 py-0.5 rounded border border-[#22222a]">{m.active}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Alerts Card */}
            <div className="bg-[#121215] border border-[#1e1e24] rounded-xl p-4.5 space-y-3.5">
              <h3 className="text-xs font-extrabold text-zinc-300 uppercase tracking-widest font-display">
                AI ALERTS
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2 rounded-lg bg-[#16161c] border border-[#202028]">
                  <Search className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-white">Battery Problem Detected</p>
                    <p className="text-[11px] text-zinc-400 font-medium mt-0.5">85% confidence</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-lg bg-[#16161c] border border-[#202028]">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-white">Tyre Replacement Due</p>
                    <p className="text-[11px] text-zinc-400 font-medium mt-0.5">78% confidence</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-lg bg-[#16161c] border border-[#202028]">
                  <Package className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-white">Low Stock: Oil Filter</p>
                    <p className="text-[11px] text-zinc-400 font-medium mt-0.5">92% confidence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Revenue Chart Placeholder & Service Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Revenue This Week */}
          <div className="lg:col-span-3 bg-[#121215] border border-[#1e1e24] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-extrabold text-zinc-300 uppercase tracking-widest font-display">
              REVENUE — THIS WEEK
            </h3>
            <div className="h-40 flex items-end justify-between px-6 pt-6 border-b border-[#1c1c22] pb-2 text-xs text-zinc-400 font-mono font-bold">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
          </div>

          {/* Service Distribution Progress Bars */}
          <div className="lg:col-span-2 bg-[#121215] border border-[#1e1e24] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-extrabold text-zinc-300 uppercase tracking-widest font-display">
              SERVICE DISTRIBUTION
            </h3>
            <div className="space-y-3.5 text-xs">
              {/* Item 1 */}
              <div>
                <div className="flex justify-between font-bold text-white mb-1.5 text-xs">
                  <span>Full Service</span>
                  <span className="text-zinc-400 font-mono">34</span>
                </div>
                <div className="w-full bg-[#1c1c22] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#bfff00] h-full rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              {/* Item 2 */}
              <div>
                <div className="flex justify-between font-bold text-white mb-1.5 text-xs">
                  <span>Engine & Mechanical</span>
                  <span className="text-zinc-400 font-mono">18</span>
                </div>
                <div className="w-full bg-[#1c1c22] h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              {/* Item 3 */}
              <div>
                <div className="flex justify-between font-bold text-white mb-1.5 text-xs">
                  <span>AC & Electrical</span>
                  <span className="text-zinc-400 font-mono">12</span>
                </div>
                <div className="w-full bg-[#1c1c22] h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: '30%' }} />
                </div>
              </div>

              {/* Item 4 */}
              <div>
                <div className="flex justify-between font-bold text-white mb-1.5 text-xs">
                  <span>Tyres & Brakes</span>
                  <span className="text-zinc-400 font-mono">28</span>
                </div>
                <div className="w-full bg-[#1c1c22] h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
