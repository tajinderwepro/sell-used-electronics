import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  BadgeCheck,
  Smartphone,
  Laptop,
  TabletSmartphone,
  User,
  Star,
  TrendingUp,
  HandCoins,
} from "lucide-react";
import { useEffect } from "react";
import Heading from "../components/ui/Heading";
import {
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../constants/theme";
import QuoteForm from "./quote/QuoteForm";
import GeneralLayout from "../layouts/GeneralLayout";
import Modal from "../components/common/Modal";
import { useColorClasses } from "../theme/useColorClasses";
import { useQuoteForm } from "../context/QuoteFormContext";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { showQuoteForm, setShowQuoteForm, formState, resetForm } =
    useQuoteForm();
  const { step, category } = formState;
  const { isAuthenticated } = useAuth();
  const COLOR_CLASSES = useColorClasses();

  useEffect(() => {
    if (isAuthenticated && step === 3) {
      setShowQuoteForm(true);
    }
  }, []);

  const features = [
    {
      icon: <Zap size={32} className={COLOR_CLASSES.primary} />,
      title: "Instant Price Quote",
      desc: "Get real-time pricing for your old devices based on model & condition.",
    },
    {
      icon: <ShieldCheck size={32} className={COLOR_CLASSES.primary} />,
      title: "Secure Pickup & Payment",
      desc: "100% secure doorstep pickup & verified payment within 24 hours.",
    },
    {
      icon: <BadgeCheck size={32} className={COLOR_CLASSES.primary} />,
      title: "Trusted by 50K+ Sellers",
      desc: "Thousands of users rated us 4.8+ stars for seamless selling.",
    },
  ];

  const categories = [
    { icon: <Smartphone size={26} />, label: "Mobiles" },
    { icon: <Laptop size={26} />, label: "Laptops" },
    { icon: <TabletSmartphone size={26} />, label: "Tablets" },
    { icon: <User size={26} />, label: "Accessories" },
  ];

  const faqs = [
    {
      question: "What can I sell?",
      answer:
        "You can sell mobiles, laptops, tablets, smartwatches, and accessories.",
    },
    {
      question: "How does payment work?",
      answer:
        "After pickup & inspection, we pay via UPI/bank within 24 hours.",
    },
    {
      question: "Is pickup really free?",
      answer: "Yes, pickup is 100% free in all major cities and towns.",
    },
  ];

  const testimonials = [
    {
      name: "Michael, New York",
      review:
        "Sold my iPhone 12 in less than 10 minutes. Pickup was quick and payment was super fast!",
      rating: 5,
    },
    {
      name: "Emily, California",
      review:
        "The whole process was so simple. Got the best offer for my old MacBook.",
      rating: 4.5,
    },
    {
      name: "David, Texas",
      review:
        "I’ve sold multiple devices here — always quick, reliable, and no hassle.",
      rating: 5,
    },
  ];

  return (
    <GeneralLayout>
      <main className="text-center px-4 py-16">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto mb-16">
          <Heading
            className={`text-4xl md:text-5xl font-extrabold mb-4 ${COLOR_CLASSES.primary}`}
          >
            Sell Your Old Electronics Instantly
          </Heading>
          <p
            className={`max-w-2xl mx-auto mb-8 text-lg md:text-xl ${COLOR_CLASSES.textSecondary}`}
          >
            Trade in old gadgets for cash at your doorstep. Safe. Fast. Reliable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowQuoteForm(true)}
                className={`inline-flex items-center px-6 py-3 rounded-full text-white ${COLOR_CLASSES.gradientBtn} ${FONT_WEIGHTS.semibold}`}
              >
                Get Instant Quote <ArrowRight className="ml-2" size={20} />
              </button>

              <Link
                to="/register"
                className={`inline-flex items-center px-6 py-3 rounded-full border-2 ${COLOR_CLASSES.borderPrimary} ${COLOR_CLASSES.textPrimary} hover:${COLOR_CLASSES.primaryBgHover} ${FONT_WEIGHTS.semibold}`}
              >
                Become a Seller
              </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 text-center">
          <div>
            <TrendingUp size={28} className={`mx-auto mb-2 ${COLOR_CLASSES.primary}`} />
            <h4 className="text-xl font-bold">50K+</h4>
            <p className={COLOR_CLASSES.textSecondary}>Devices Sold</p>
          </div>
          <div>
            <HandCoins size={28} className={`mx-auto mb-2 ${COLOR_CLASSES.primary}`} />
            <h4 className="text-xl font-bold">Over $240,000</h4>
            <p className={COLOR_CLASSES.textSecondary}>Paid to Sellers</p>
          </div>
          <div>
            <Star size={28} className={`mx-auto mb-2 ${COLOR_CLASSES.primary}`} />
            <h4 className="text-xl font-bold">4.8/5</h4>
            <p className={COLOR_CLASSES.textSecondary}>Average Rating</p>
          </div>
        </section>

        {/* Features */}
        <section className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto mb-20 px-4">
          {features.map(({ icon, title, desc }, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl border ${COLOR_CLASSES.borderGray100} ${COLOR_CLASSES.bgWhite} ${COLOR_CLASSES.shadowLg} text-left`}
            >
              <div className="mb-4">{icon}</div>
              <h3 className={`text-lg font-bold mb-2 ${COLOR_CLASSES.primary}`}>{title}</h3>
              <p className={COLOR_CLASSES.textSecondary}>{desc}</p>
            </div>
          ))}
        </section>

        {/* Testimonials */}
        <section className="mb-20 px-4">
          <Heading className="text-3xl font-bold mb-10">What Sellers Say</Heading>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`p-5 border rounded-xl shadow-sm text-left ${COLOR_CLASSES.bgWhite}`}
              >
                <p className={`italic mb-2 ${COLOR_CLASSES.textSecondary}`}>
                  “{t.review}”
                </p>
                <div className="font-semibold text-sm text-gray-600">— {t.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-20 px-4">
          <Heading className="text-3xl font-bold mb-10 text-center">Popular Categories</Heading>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {categories.map(({ icon, label }, i) => (
              <div
                key={i}
                className={`p-6 rounded-xl border text-center transition-all duration-300 transform hover:scale-105 cursor-pointer ${COLOR_CLASSES.bgWhite} ${COLOR_CLASSES.borderGray200} ${COLOR_CLASSES.shadowLg}`}
              >
                <div className={`mb-4 text-3xl flex justify-center ${COLOR_CLASSES.primary}`}>
                  {icon}
                </div>
                <p className={`font-semibold ${COLOR_CLASSES.textPrimary}`}>{label}</p>
                {/* Optional subtext */}
                <p className={`text-sm mt-1 ${COLOR_CLASSES.textSecondary}`}>Sell your old {label.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-20 px-5">
          <Heading className="text-3xl font-bold mb-10 text-center">FAQs</Heading>
          <div className="max-w-6xl mx-auto divide-y divide-gray-200 dark:divide-gray-700">
            {faqs.map(({ question, answer }, i) => (
              <div key={i} className="py-4 text-left group">
                <h4
                  className={`text-lg font-semibold cursor-pointer transition-colors ${COLOR_CLASSES.primary} group-hover:${COLOR_CLASSES.primaryDark}`}
                >
                  {question}
                </h4>
                <p className={`mt-1 pl-1 text-sm ${COLOR_CLASSES.textSecondary}`}>
                  {answer}
                </p>
              </div>
            ))}
          </div>
        </section>


        {/* Final CTA */}
        <section className="text-center py-12 bg-gray-50 dark:bg-[#1f2733] max-w-6xl mx-auto">
          <Heading className="text-3xl font-bold mb-4">Ready to Cash In?</Heading>
          <p className={`mb-6 ${COLOR_CLASSES.textSecondary}`}>
            Turn your old devices into instant money. Start now.
          </p>
          <button
            onClick={() => setShowQuoteForm(true)}
            className={`px-8 py-4 rounded-full ${COLOR_CLASSES.gradientBtn} ${FONT_WEIGHTS.bold}`}
          >
            Get Started
          </button>
        </section>

        {/* Modal */}
        {showQuoteForm && (
          <Modal
            customWidth
            onClose={() => {
              setShowQuoteForm(false);
              resetForm();
            }}
            title="Get a Quote"
          >
            <QuoteForm onClose={() => setShowQuoteForm(false)} />
          </Modal>
        )}
      </main>
    </GeneralLayout>
  );
}
