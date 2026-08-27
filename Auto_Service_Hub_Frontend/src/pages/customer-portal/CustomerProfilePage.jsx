import React, { useState } from 'react'
import CustomerPortalLayout from '../../components/layout/CustomerPortalLayout'
import Button from '../../components/common/Button'
import { getCustomerProfile, updateCustomerProfile } from '../../services/customerPortalService'
import { User, Phone, Mail, MapPin, Shield, Check, Save, Sparkles, BellRing, Award } from 'lucide-react'

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState(getCustomerProfile())
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [phone, setPhone] = useState(profile.phone)
  const [address, setAddress] = useState(profile.address)
  const [emergencyContact, setEmergencyContact] = useState(profile.emergencyContact)
  const [preferredBranch, setPreferredBranch] = useState(profile.preferredBranch)
  const [notifEmail, setNotifEmail] = useState(profile.notifications.email)
  const [notifSms, setNotifSms] = useState(profile.notifications.sms)
  const [notifWhatsapp, setNotifWhatsapp] = useState(profile.notifications.whatsapp)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const updated = updateCustomerProfile({
      name,
      email,
      phone,
      address,
      emergencyContact,
      preferredBranch,
      notifications: {
        email: notifEmail,
        sms: notifSms,
        whatsapp: notifWhatsapp,
      },
    })
    setProfile(updated)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <CustomerPortalLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-[#d8ff3d]" /> Customer Profile & Preferences
          </h2>
          <p className="text-xs text-zinc-400">
            Manage your personal contact details, preferred workshop location, and notification settings.
          </p>
        </div>

        {/* Member Badge Summary Banner */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-[#d8ff3d]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#d8ff3d] text-black font-black text-xl flex items-center justify-center shadow-[0_0_20px_rgba(216,255,61,0.4)]">
              JD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">{profile.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#d8ff3d]/20 text-[#d8ff3d] text-[10px] font-extrabold uppercase border border-[#d8ff3d]/40 flex items-center gap-1">
                  <Award className="w-3 h-3" /> VIP Club Member
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Member since <strong className="text-white">{profile.memberSince}</strong> • Account Ref: <span className="font-mono text-zinc-300">{profile.id}</span>
              </p>
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4" /> Profile settings successfully updated!
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Details Card */}
          <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <User className="w-4 h-4 text-[#d8ff3d]" /> Personal & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Primary Residential Address (For Doorstep Valet Pickup)
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
              />
            </div>
          </div>

          {/* Garage Preferences */}
          <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#d8ff3d]" /> Workshop & Communication Channels
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Preferred SmartGarage Branch
              </label>
              <select
                value={preferredBranch}
                onChange={(e) => setPreferredBranch(e.target.value)}
                className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
              >
                <option value="SmartGarage Downtown Performance Center">
                  SmartGarage Downtown Performance Center
                </option>
                <option value="SmartGarage Westside Service Hub">
                  SmartGarage Westside Service Hub
                </option>
                <option value="SmartGarage Airport Express Bay">
                  SmartGarage Airport Express Bay
                </option>
              </select>
            </div>

            {/* Notification Checkboxes */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold text-zinc-400">Receive Live Updates Via:</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifWhatsapp}
                    onChange={(e) => setNotifWhatsapp(e.target.checked)}
                    className="w-4 h-4 accent-[#d8ff3d] rounded"
                  />
                  <span className="text-xs font-semibold text-white">WhatsApp Alerts</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifSms}
                    onChange={(e) => setNotifSms(e.target.checked)}
                    className="w-4 h-4 accent-[#d8ff3d] rounded"
                  />
                  <span className="text-xs font-semibold text-white">SMS Updates</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.checked)}
                    className="w-4 h-4 accent-[#d8ff3d] rounded"
                  />
                  <span className="text-xs font-semibold text-white">Email Receipts</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="primary" type="submit" icon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </CustomerPortalLayout>
  )
}
