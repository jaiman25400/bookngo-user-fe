import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiTarget,
  FiZap,
  FiShield,
  FiMapPin,
  FiHeart,
} from "react-icons/fi";

export const metadata = {
  title: "About Us | Book N Go",
  description:
    "Learn about Book N Go — your gateway to skiing, snowboarding, tubing, and ice skating across Canada.",
};

const IMG = {
  ski: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
  snowboard: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
  tubing: "https://images.unsplash.com/photo-1548777123-e216912df7d8?w=800&q=80",
  skating: "https://images.unsplash.com/photo-1517963879433-6ad2b061d934?w=800&q=80",
  winter: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80",
};

export default function AboutPage() {
  const activities = [
    {
      title: "Skiing",
      description:
        "Discover and book ski slopes at top resorts across Canada. Find runs for every level — from gentle greens to challenging blacks — and enjoy the winter mountains with family or friends.",
      image: IMG.ski,
    },
    {
      title: "Snowboarding",
      description:
        "Hit the slopes on a snowboard. We connect you with resorts that offer terrain parks, half-pipes, groomed runs, and backcountry access for every style of rider.",
      image: IMG.snowboard,
    },
    {
      title: "Tubing",
      description:
        "Family-friendly snow tubing at winter parks and resorts. Safe, fun, and easy to book for all ages. No experience needed — just slide and smile.",
      image: IMG.tubing,
    },
    {
      title: "Ice Skating",
      description:
        "Skating rings and outdoor ice experiences across Canada. From community skating rings to scenic frozen trails and lake skating, find your glide year-round.",
      image: IMG.skating,
    },
  ];

  const values = [
    { icon: FiZap, title: "Easy booking", description: "Simple, clear booking so you spend less time planning and more time on the snow and ice." },
    { icon: FiShield, title: "Trusted partners", description: "We work with verified resorts, skating rings, and parks so you can book with confidence." },
    { icon: FiMapPin, title: "Canadian focus", description: "We are focused on winter experiences across Canada — from coast to coast." },
    { icon: FiHeart, title: "Real support", description: "Need help? Our team is here for questions about your booking or your next adventure." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Hero — centered */}
      <section className="bg-gradient-to-br from-sky-600 to-blue-700 text-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-sky-200 font-semibold text-sm uppercase tracking-wider">
            About Book N Go
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-6">
            Your Winter Adventure Starts Here
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            We help you discover and book skiing, snowboarding, tubing, and ice
            skating experiences across Canada — all in one place.
          </p>
        </div>
      </section>

      {/* Our Story — image LEFT, text RIGHT */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
            <Image
              src={IMG.winter}
              alt="Winter landscape in Canada"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
              Our Story
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Book N Go was built for everyone who loves winter — whether you&apos;re
              a first-timer or a seasoned skier, a family looking for tubing or
              friends planning a skate. We saw how hard it could be to find and
              book winter activities in one place, so we created a single platform
              focused on what matters: skiing, snowboarding, tubing, and ice skating.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              We partner with resorts, skating rings, and winter parks across Canada to give
              you a clear view of what&apos;s available, when, and how to book. Our
              goal is simple: make it easy to get outside and enjoy winter.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision — text LEFT, image RIGHT */}
      <section className="bg-white border-y border-slate-200 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8">
                Mission &amp; Vision
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 p-5 rounded-2xl bg-sky-50 border border-sky-100">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-sky-600 flex items-center justify-center">
                    <FiTarget className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Our Mission</h3>
                    <p className="text-slate-600 text-sm">
                      To connect people with winter experiences they love — through
                      easy discovery, transparent booking, and trusted partners.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center">
                    <FiArrowRight className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Our Vision</h3>
                    <p className="text-slate-600 text-sm">
                      To be the go-to place for booking winter activities in Canada —
                      find, compare, and book in a few clicks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={IMG.ski}
                alt="Skiing in the mountains"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Activities — alternating image left/right per block */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 text-center">
          Activities We Focus On
        </h2>
        <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
          Four core winter activities so we can do them really well.
        </p>
        <div className="space-y-20">
          {activities.map((activity, i) => (
            <div
              key={activity.title}
              className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
            >
              <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                    <FiCheckCircle className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{activity.title}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Book N Go — centered cards */}
      <section className="bg-white border-y border-slate-200 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 text-center">
            Why Book N Go
          </h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
            Simple values that make your winter booking easier and more reliable.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-sky-200 hover:bg-sky-50/30 transition-colors text-center md:text-left"
              >
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center mb-4 mx-auto md:mx-0">
                  <Icon className="w-5 h-5 text-sky-600" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-600 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-100 border-t border-slate-200 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-600 mb-8">
            Explore ski slopes and skating rings near you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/skiing"
              className="inline-flex items-center bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Ski Slopes
              <FiArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/skates"
              className="inline-flex items-center bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Skating Rings
              <FiArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center border-2 border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
