import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, BadgeCheck, Smartphone, Laptop, TabletSmartphone, User } from "lucide-react";
import { useEffect, useState } from "react";
import Heading from "../components/ui/Heading";
import {  FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS } from "../constants/theme";
import QuoteForm from "./quote/QuoteForm";
import GeneralLayout from "../layouts/GeneralLayout";
import Modal from "../components/common/Modal";
import { useColorClasses } from "../theme/useColorClasses";
import { useQuoteForm } from "../context/QuoteFormContext";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { showQuoteForm, setShowQuoteForm,formState,resetForm } = useQuoteForm();
  const { step, category, model, condition, price } = formState;
  const { isAuthenticated } = useAuth();

  const COLOR_CLASSES = useColorClasses();
  const features = [
    {
      icon: <Zap size={30} className={COLOR_CLASSES.primary} />,
      title: "Instant Price Quote",
      desc: "Get the best price instantly for your device based on model and condition.",
    },
    {
      icon: <ShieldCheck size={30} className={COLOR_CLASSES.primary} />,
      title: "Secure Pickup & Payment",
      desc: "We offer free pickup and process secure payments once verified.",
    },
    {
      icon: <BadgeCheck size={30} className={COLOR_CLASSES.primary} />,
      title: "Trusted by Thousands",
      desc: "Rated 4.8+ by customers who trust us to resell or recycle their gadgets.",
    },
  ];

  const categories = [
    { icon: <Smartphone size={28} />, label: "Mobiles" },
    { icon: <Laptop size={28} />, label: "Laptops" },
    { icon: <TabletSmartphone size={28} />, label: "Tablets" },
    { icon: <User size={28} />, label: "Accessories" },
  ];

  const faqs = [
    {
      question: "What devices can I sell?",
      answer: "You can sell phones, laptops, tablets, smartwatches, and more. We accept all major brands.",
    },
    {
      question: "How do I get paid?",
      answer: "Once your device is picked up and inspected, payment is processed to your preferred method within 24 hours.",
    },
    {
      question: "Is pickup really free?",
      answer: "Yes! We provide free pickup in major cities and towns at your convenience.",
    },
  ];
  useEffect(()=>{
    if(isAuthenticated && step === 3){
       setShowQuoteForm(true)
    }
  },[])
  
  return (
    <>
      <GeneralLayout>
        <main className="flex-grow text-center px-4 py-20">
          {/* Hero Section */}
          <div className="max-w-5xl mx-auto">
            <Heading className={`${FONT_SIZES["5xl"]} md:${FONT_SIZES["6xl"]} ${FONT_WEIGHTS.extrabold} mb-6 ${COLOR_CLASSES.primary}`}>
              Sell Your Old Electronics
            </Heading>
            <p className={`mb-8 max-w-2xl mx-auto ${FONT_SIZES.lg} md:${FONT_SIZES.xl} ${COLOR_CLASSES.textSecondary}`}>
              Trade in used phones, laptops, tablets, and more. Get paid fast with zero hassle.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <button
                onClick={() => setShowQuoteForm(true)}
                className={`inline-flex items-center px-6 py-3 rounded-full ${FONT_SIZES.lg} ${FONT_WEIGHTS.semibold} text-white ${COLOR_CLASSES.primaryBg} ${COLOR_CLASSES.primaryBgHover} ${COLOR_CLASSES.shadowMd} transition-all`}
              >
                Get Instant Quote <ArrowRight className="ml-2" size={20} />
              </button>
              <Link to="/register" className={`inline-flex items-center px-6 py-3 border-2 rounded-full ${FONT_SIZES.lg} ${FONT_WEIGHTS.semibold} ${COLOR_CLASSES.borderPrimary} ${COLOR_CLASSES.primaryLightBg} ${COLOR_CLASSES.primary}`}>
                Become a Seller
              </Link>
            </div>
          </div>

          {/* Features */}
          <section className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto w-full px-4 mb-20">
            {features.map(({ icon, title, desc }, idx) => (
              <div key={idx} className={`p-6 rounded-xl border ${COLOR_CLASSES.borderGray100} ${COLOR_CLASSES.bgWhite} ${COLOR_CLASSES.shadowLg} text-left`}>
                <div className="mb-4">{icon}</div>
                <h3 className={`${FONT_SIZES.xl} ${FONT_WEIGHTS.bold} mb-2 ${COLOR_CLASSES.primary}`}>{title}</h3>
                <p className={COLOR_CLASSES.textSecondary}>{desc}</p>
              </div>
            ))}
          </section>

          {/* Top Categories */}
          <section className="mb-20 px-4">
            <Heading className={`${FONT_SIZES["4xl"]} ${FONT_WEIGHTS.bold} mb-10`}>Popular Categories</Heading>
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {categories.map(({ icon, label }, i) => (
                <div key={i} className={`p-6 border ${COLOR_CLASSES.borderGray200} rounded-lg ${COLOR_CLASSES.bgWhite} ${COLOR_CLASSES.shadowMd} flex flex-col items-center`}>
                  <div className={`mb-2 ${COLOR_CLASSES.primary}`}>{icon}</div>
                  <p className={`${FONT_WEIGHTS.medium}`}>{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-20 px-4">
            <Heading className={`${FONT_SIZES["4xl"]} ${FONT_WEIGHTS.bold} mb-10`}>FAQs</Heading>
            <div className="max-w-4xl mx-auto text-left space-y-6">
              {faqs.map(({ question, answer }, i) => (
                <div key={i}>
                  <h4 className={`${COLOR_CLASSES.primary} ${FONT_WEIGHTS.semibold}`}>{question}</h4>
                  <p className={`${COLOR_CLASSES.textSecondary}`}>{answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <div className={`py-12  w-full`}>
            <Heading className={`${FONT_SIZES["4xl"]} ${FONT_WEIGHTS.extrabold} mb-6`}>Ready to Cash In?</Heading>
            <p className={`mb-8 ${COLOR_CLASSES.textSecondary}`}>Start now and turn your old devices into instant money.</p>
            <button
              onClick={() => setShowQuoteForm(true)}
              className={`px-8 py-4 rounded-full text-white ${COLOR_CLASSES.primaryBg} ${COLOR_CLASSES.primaryBgHover} ${FONT_WEIGHTS.bold} ${COLOR_CLASSES.shadowMd}`}
            >
              Get Started
            </button>
          </div>
        </main>

        {/* Quote Modal */}
        {showQuoteForm && (
          <Modal onClose={() =>{setShowQuoteForm(false);resetForm()}} title={"Get a Quote"}>
            <QuoteForm onClose={() => setShowQuoteForm(false)} />
          </Modal>
        )}
      </GeneralLayout>
    </>
  );
}
