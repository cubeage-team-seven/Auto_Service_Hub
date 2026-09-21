import React, { useMemo, useState } from "react";
import "./ServiceAdvisor.css";
const rows=[
['C-1041','Arjun Mehta','+91 98201 45678','arjun.mehta@gmail.com','2','12','17 Aug 2026','Gold','₹0'],
['C-1040','Priya Sharma','+91 91234 56789','priya.sharma@gmail.com','1','8','17 Aug 2026','Silver','₹0'],
['C-1039','Rohit Desai','+91 99876 54321','rohit.desai@gmail.com','3','21','16 Aug 2026','Platinum','₹0'],
['C-1038','Neha Joshi','+91 88765 43210','neha.joshi@gmail.com','1','5','17 Aug 2026','Bronze','₹2,400'],
['C-1037','Vikram Singh','+91 77654 32109','vikram.singh@gmail.com','2','15','15 Aug 2026','Gold','₹0'],
['C-1036','Kavita Rao','+91 66543 21098','kavita.rao@gmail.com','1','4','16 Aug 2026','Bronze','₹0'],
['C-1035','Sunil Nair','+91 55432 10987','sunil.nair@gmail.com','1','9','12 Aug 2026','Silver','₹1,800'],
['C-1034','Divya Kapoor','+91 44321 09876','divya.kapoor@gmail.com','2','7','10 Aug 2026','Silver','₹0'],
];
export default function Customers(){const[q,setQ]=useState('');const data=useMemo(()=>rows.filter(r=>r.join(' ').toLowerCase().includes(q.toLowerCase())),[q]);return <div className="sa-page"><div className="sa-page-head"><div><h1 className="sa-title">CUSTOMERS</h1></div><button className="sa-primary">+ NEW CUSTOMER</button></div><div className="sa-toolbar"><div style={{position:'relative'}}><input className="sa-search" placeholder="Search by name or phone..." value={q} onChange={e=>setQ(e.target.value)}/></div></div><div className="sa-wide-table"><table className="sa-table"><thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Vehicles</th><th>Visits</th><th>Last Visit</th><th>Loyalty</th><th>Balance</th></tr></thead><tbody>{data.map(r=><tr key={r[0]}><td className="sa-id">{r[0]}</td><td><strong>{r[1]}</strong></td><td><strong>{r[2]}</strong></td><td>{r[3]}</td><td>{r[4]}</td><td>{r[5]}</td><td>{r[6]}</td><td><span className={`sa-status ${r[7]==='Gold'?'status-inspection':r[7]==='Platinum'?'status-received':r[7]==='Bronze'?'status-inspection':'status-received'}`}>{r[7]}</span></td><td style={{color:r[8]!=='₹0'?'#ef4d55':undefined,fontWeight:r[8]!=='₹0'?'700':undefined}}>{r[8]}</td></tr>)}</tbody></table></div></div>}
