import React from "react";
import "./ServiceAdvisor.css";

const jobs=[
 ['JC-2408','Arjun Mehta','MH-12-AB-4521 | Swift','Ravi Kumar','In Repair','Today 5:00 PM','₹18,500','status-repair'],
 ['JC-2407','Priya Sharma','DL-01-CZ-9834 | Creta','Amit Patel','Quality Check','Today 3:30 PM','₹8,200','status-qc'],
 ['JC-2406','Rohit Desai','GJ-05-XY-7712 | Innova','Suresh Nair','Delivered','Delivered','₹12,400','status-delivered'],
 ['JC-2405','Neha Joshi','MH-14-PQ-3356 | City','Ravi Kumar','Inspection','Today 6:00 PM','₹4,800','status-inspection'],
 ['JC-2404','Vikram Singh','UP-32-GH-1190 | Fortuner','Amit Patel','Received','Tomorrow 12:00 PM','₹32,000','status-received'],
 ['JC-2403','Kavita Rao','KA-03-MN-5567 | Baleno','Deepak Verma','Delivered','Delivered','₹3,200','status-delivered'],
];

export default function Dashboard(){return <div className="sa-page">
  <div className="sa-page-head"><div><div className="sa-kicker">— TODAY, 17 AUGUST 2026</div><h1 className="sa-title">OPERATIONS OVERVIEW</h1></div></div>
  <div className="sa-stats">
    <div className="sa-stat"><div className="sa-stat-label">Today's Jobs</div><div className="sa-stat-value" style={{color:'var(--sa-lime)'}}>14</div><div className="sa-stat-note">8 active · 6 delivered</div></div>
    <div className="sa-stat"><div className="sa-stat-label">Revenue Today</div><div className="sa-stat-value">₹42,500</div><div className="sa-stat-note">+12% vs yesterday</div></div>
    <div className="sa-stat"><div className="sa-stat-label">Pending Invoices</div><div className="sa-stat-value">6</div><div className="sa-stat-note">₹48,294 outstanding</div></div>
    <div className="sa-stat"><div className="sa-stat-label">Low Stock Alerts</div><div className="sa-stat-value">3</div><div className="sa-stat-note">ACF, OIF, TYR</div></div>
  </div>
  <div className="sa-grid-main">
    <section className="sa-card"><div className="sa-card-head">Active Job Cards</div><table className="sa-table"><thead><tr><th>Job ID</th><th>Customer</th><th>Vehicle</th><th>Mechanic</th><th>Status</th><th>ETA</th><th>Amount</th></tr></thead><tbody>{jobs.map(j=><tr key={j[0]}><td className="sa-id">{j[0]}</td><td><strong>{j[1]}</strong></td><td>{j[2]}</td><td><strong>{j[3]}</strong></td><td><span className={`sa-status ${j[7]}`}>{j[4]}</span></td><td>{j[5]}</td><td><strong>{j[6]}</strong></td></tr>)}</tbody></table></section>
    <div className="sa-side-stack">
      <section className="sa-card"><div className="sa-card-head">Mechanic Workload</div><div className="sa-list">{[['Ravi Kumar','3 active'],['Amit Patel','2 active'],['Suresh Nair','0 active'],['Deepak Verma','1 active'],['Kiran Joshi','0 active']].map((x,i)=><div className="sa-list-row" key={x[0]}><div className="sa-list-left"><i className={`sa-dot ${i===2||i===4?'green':''}`}></i><strong>{x[0]}</strong></div><span className="sa-list-count">{x[1]}</span></div>)}</div></section>
      <section className="sa-card"><div className="sa-card-head">AI Alerts</div><div className="sa-alert"><div className="sa-alert-top"><span className="sa-alert-icon">🔍</span>Battery Problem Detected</div><small>85% confidence</small></div><div className="sa-alert"><div className="sa-alert-top"><span className="sa-alert-icon">▦</span>Tyre Replacement Due</div><small>78% confidence</small></div><div className="sa-alert"><div className="sa-alert-top"><span className="sa-alert-icon">◈</span>Low Stock: Oil Filter</div><small>92% confidence</small></div></section>
    </div>
  </div>
  <div className="sa-bottom-grid">
    <section className="sa-card"><div className="sa-card-head">Revenue — This Week</div><div className="sa-chart"><div className="sa-chart-grid">{[34,52,41,67,54,77,43].map((h,i)=><div key={i} className="sa-chart-bar" style={{'--h':`${h}px`}} />)}</div><div className="sa-days">{['M','T','W','T','F','S','S'].map(x=><span key={x}>{x}</span>)}</div></div></section>
    <section className="sa-card"><div className="sa-card-head">Service Distribution</div><div className="sa-bars"><Bar label="Full Service" value="34" width="90%"/><Bar label="Engine & Mechanical" value="18" width="48%" cls="blue"/><Bar label="AC & Electrical" value="12" width="31%" cls="purple"/><Bar label="Tyres & Brakes" value="28" width="74%" cls="green"/></div></section>
  </div>
</div>}
function Bar({label,value,width,cls=''}){return <div className="sa-bar-row"><div className="sa-bar-label"><span>{label}</span><span>{value}</span></div><div className={`sa-progress ${cls}`} style={{'--w':width}}><i/></div></div>}
