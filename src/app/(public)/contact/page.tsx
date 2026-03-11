import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiMessageCircle,
} from "react-icons/fi";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us | Book N Go",
  description:
    "Get in touch with Book N Go — questions about skiing, snowboarding, tubing, or ice skating bookings.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-600 to-blue-700 text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-sky-200 font-semibold text-sm uppercase tracking-wider">
            Get in touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto">
            Have a question about skiing, snowboarding, tubing, or ice skating
            bookings? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                Reach out
              </h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <FiMail className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Email</p>
                    <a
                      href="mailto:business.bookngo@gmail.com"
                      className="text-sky-600 hover:text-sky-700"
                    >
                      business.bookngo@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <FiPhone className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Phone</p>
                    <a
                      href="tel:+12269757793"
                      className="text-sky-600 hover:text-sky-700"
                    >
                      +1 226 975 7793
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Office</p>
                    <p className="text-slate-600">
                      Canada
                      <br />
                      Serving ski and skating destinations nationwide
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-sky-50 border border-sky-100">
              <div className="flex items-start gap-3">
                <FiMessageCircle className="w-6 h-6 text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">
                    Booking &amp; support
                  </p>
                  <p className="text-slate-600 text-sm mt-1">
                    For help with existing bookings (ski slopes, skating rings,
                    tubing, or snowboarding), include your booking reference in
                    your message.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
