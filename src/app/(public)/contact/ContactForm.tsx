"use client";

import { useState } from "react";
import { FiSend, FiLoader } from "react-icons/fi";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        Send a message
      </h2>
      {submitted ? (
        <div className="py-6 text-center">
          <p className="text-sky-600 font-semibold mb-2">Thank you for your message.</p>
          <p className="text-slate-600 text-sm">
            We&apos;ll get back to you at the email you provided.
          </p>
        </div>
      ) : (
        <>
          <form
            className="space-y-4"
            onSubmit={handleSubmit}
            noValidate
          >
            {error && (
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Your name"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                placeholder="How can we help?"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-y"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  Send message
                </>
              )}
            </button>
          </form>
          <p className="text-slate-500 text-sm mt-4">
            Messages are sent to our team. Add <code className="bg-slate-100 px-1 rounded">RESEND_API_KEY</code> in .env to receive emails at business.bookngo@gmail.com.
          </p>
        </>
      )}
    </div>
  );
}
