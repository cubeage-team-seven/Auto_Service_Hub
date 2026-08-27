import React, { useState } from 'react'
import CustomerPortalLayout from '../../components/layout/CustomerPortalLayout'
import Button from '../../components/common/Button'
import { getFeedbacks, addFeedback } from '../../services/customerPortalService'
import { Star, MessageSquare, CheckCircle2, Sparkles, Send, User } from 'lucide-react'

export default function CustomerFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState(getFeedbacks())
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [serviceTitle, setServiceTitle] = useState('Brake Servicing & Periodical Maintenance')
  const [vehicle, setVehicle] = useState('Audi RS5 Coupe')
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!comment) return

    addFeedback({
      rating,
      serviceTitle,
      vehicle,
      comment,
    })

    setFeedbacks(getFeedbacks())
    setSubmitted(true)
    setComment('')
  }

  return (
    <CustomerPortalLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#d8ff3d]" /> Customer Feedback & Reviews
          </h2>
          <p className="text-xs text-zinc-400">
            Share your workshop experience, rate our technicians, and help us continuously improve our service quality.
          </p>
        </div>

        {/* Feedback Submission Form */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d8ff3d]" /> Rate Your Recent Workshop Visit
          </h3>

          {submitted ? (
            <div className="p-6 rounded-xl bg-[#d8ff3d]/10 border border-[#d8ff3d]/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#d8ff3d] mx-auto" />
              <h4 className="text-lg font-extrabold text-white">Thank You for Your Feedback!</h4>
              <p className="text-xs text-zinc-300">
                Your review has been submitted to our Quality Assurance team. We appreciate your partnership!
              </p>
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Submit Another Review
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star Rating Bar */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-400">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hoverRating || rating)
                            ? 'text-[#d8ff3d] fill-[#d8ff3d]'
                            : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold text-white">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Service & Vehicle Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Service Performed
                  </label>
                  <select
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                  >
                    <option value="Brake Servicing & Periodical Maintenance">
                      Brake Servicing & Periodical Maintenance
                    </option>
                    <option value="Engine Oil Change & AC Sanitization">
                      Engine Oil Change & AC Sanitization
                    </option>
                    <option value="3D Laser Wheel Alignment">
                      3D Laser Wheel Alignment
                    </option>
                    <option value="General Workshop Inspection">
                      General Workshop Inspection
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Vehicle
                  </label>
                  <select
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                  >
                    <option value="Audi RS5 Coupe">Audi RS5 Coupe (MH-12-AB-9901)</option>
                    <option value="BMW M3 Competition">BMW M3 Competition (MH-12-DE-4410)</option>
                    <option value="Porsche Macan GTS">Porsche Macan GTS (MH-12-[#]-8820)</option>
                  </select>
                </div>
              </div>

              {/* Review Comment Textarea */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Your Review & Comments
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you liked about our work, staff, turnaround time, or cleanliness..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#d8ff3d]"
                />
              </div>

              <div className="flex justify-end">
                <Button variant="primary" type="submit" icon={Send}>
                  Submit Customer Review
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Past Reviews List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            Your Previous Reviews & Responses
          </h3>

          <div className="space-y-4">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="glass-card p-5 rounded-2xl border border-zinc-800 space-y-3 bg-zinc-950/60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#d8ff3d]">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#d8ff3d]" />
                    ))}
                  </div>

                  <span className="text-[11px] font-mono text-zinc-500">{fb.date}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{fb.serviceTitle}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Vehicle: {fb.vehicle}</p>
                </div>

                <p className="text-xs text-zinc-300 italic">"{fb.comment}"</p>

                {fb.response && (
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 text-xs space-y-1 mt-2">
                    <p className="font-bold text-[#d8ff3d] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Garage Manager Reply:
                    </p>
                    <p className="text-zinc-400">{fb.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomerPortalLayout>
  )
}
