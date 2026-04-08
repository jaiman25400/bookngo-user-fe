import Image from "next/image";
import Link from "next/link";
import RegionsScroll from "../../components/RegionsScroll";
import SkatingRegionsSection from "../../components/SkatingRegionsSection";
import { FiArrowRight, FiMail, FiInfo, FiPhone } from "react-icons/fi";
import NewsletterForm from "../../components/NewsletterForm";
import HomeVendorSearch from "../../components/HomeVendorSearch";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-screen pt-16">
        <div className="fixed inset-0 -z-50">
          <Image
            src="/images/home-bg.jpg"
            alt="Winter ski resort landscape"
            fill
            priority
            className="object-cover"
            quality={90}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[calc(100vh-4rem)] flex items-center justify-center text-center">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 leading-tight drop-shadow-lg tracking-tight">
              Book Your Winter Adventure
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-7 leading-relaxed drop-shadow-md max-w-2xl mx-auto">
              Discover the best ski resorts and winter activities across Canada
            </p>
            <div className="mb-7 sm:mb-8">
              <HomeVendorSearch />
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                href="/skiing"
                className="group inline-flex items-center justify-center bg-white hover:bg-gray-100 text-gray-900 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                aria-label="Browse ski resorts"
              >
                Browse ski resorts
                <FiArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/skates"
                className="group inline-flex items-center justify-center bg-gray-900/90 hover:bg-gray-900 text-white border border-white/30 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300"
                aria-label="Browse skating rinks and ice skating"
              >
                Browse skating rinks
                <FiArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </div>

      {/* Ice skating by region */}
      <section className="bg-white relative z-10 border-t border-slate-200 py-10 sm:py-12 md:py-16">
        <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
          <SkatingRegionsSection />
        </div>
      </section>

      {/* Ski regions */}
      <section className="bg-white relative z-10 border-t border-slate-200 py-10 sm:py-12 md:py-16">
        <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
          <RegionsScroll />
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative z-10 py-14 md:py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-6">
            <FiMail className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            Stay in the loop
          </h2>
          <p className="text-slate-300 text-base md:text-lg mb-8">
            Get updates on new resorts, skating rinks, and seasonal offers.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* Mission and partner CTA */}
      <section className="relative z-10 py-12 md:py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            <Link
              href="/about"
              className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 p-6 md:p-8 transition-all"
              aria-label="About Us"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white border border-slate-200 mb-4">
                <FiInfo className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                Our goal is to help more people enjoy winter outdoors.
              </h3>
              <p className="text-slate-600 leading-relaxed mb-5">
                Easily discover and book trusted ski resorts and skating rinks
                across Canada. Whether it is your first season or you are a
                long-time winter enthusiast, we help you find a destination
                that matches your style.
              </p>
              <span className="inline-flex items-center text-sky-700 font-semibold">
                Learn about us
                <FiArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/contact"
              className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 p-6 md:p-8 transition-all"
              aria-label="Contact Us"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white border border-slate-200 mb-4">
                <FiPhone className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                Are you a resort or skating venue owner?
              </h3>
              <p className="text-slate-600 leading-relaxed mb-5">
                BookNGo can help you grow your business with online visibility,
                better booking flow, and customer support tools. Contact us to
                discuss partnership and onboarding.
              </p>
              <span className="inline-flex items-center text-sky-700 font-semibold">
                Contact us
                <FiArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
