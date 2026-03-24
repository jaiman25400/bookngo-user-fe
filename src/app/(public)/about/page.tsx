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
  snowboard:
    "https://facts.net/wp-content/uploads/2023/05/man-snowboarding.jpeg",
   
  tubing:
    "https://blog.trekaroo.com/wp-content/uploads/2022/02/Snow-Tubing-in-Banff-by-Mt-Norquay.jpg",
  skating:
    "https://okcmom.com/wp-content/uploads/2022/12/OKC-Ice-Skating-Oklahoma-City.png",
  winter: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80",
};

export default function AboutPage() {
  const activities = [
    {
      title: "Skiing",
      description:
        "Discover ski resorts across Canada and book with confidence. From beginner-friendly runs to advanced terrain, it is easy to find a slope that fits your day.",
      image: IMG.ski,
    },
    {
      title: "Ice Skating",
      description:
        "Find indoor and outdoor skating rings across Canada, from city favorites to scenic winter trails. Book quickly and get on the ice sooner.",
      image: IMG.skating,
    },
    {
      title: "Snowboarding",
      description:
        "Explore snowboard-friendly resorts with terrain parks, groomed runs, and options for every skill level. Plan your trip in minutes.",
      image: IMG.snowboard,
    },
    {
      title: "Tubing",
      description:
        "Book family-friendly tubing sessions at winter parks and resorts. No experience needed, just pick a time and enjoy the ride.",
      image: IMG.tubing,
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
              Book N Go started with a simple idea: planning winter activities
              should feel exciting, not complicated. We wanted one place where
              people can quickly compare options, check availability, and book
              without jumping between multiple websites.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              Today, we work with resorts, skating rings, and winter parks
              across Canada to make that possible. Whether you&apos;re planning a
              weekend trip or a same-day outing, Book N Go helps you spend less
              time searching and more time enjoying winter.
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
                      Help people discover and book great winter experiences
                      quickly, clearly, and confidently.
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
                      Be Canada&apos;s most trusted platform for planning winter
                      activities from first search to final booking.
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
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 -mx-1 px-1 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="snap-start flex-shrink-0 w-[78vw] sm:w-auto p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-sky-200 hover:bg-sky-50/30 transition-colors text-center md:text-left"
              >
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center mb-4 mx-auto md:mx-0">
                  <Icon className="w-5 h-5 text-sky-600" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-600 text-sm">{description}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500 sm:hidden">
            Swipe to see more
          </p>
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
