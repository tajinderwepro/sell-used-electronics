import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Heading from "../components/ui/Heading";
import { COLOR_CLASSES, FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS } from "../constants/theme";
import QuoteForm from "./quote/QuoteForm";
import HomeLayout from "../layouts/HomeLayout";
import Modal from "../components/common/Modal";
export default function Home() {
    const [showQuoteForm, setShowQuoteForm] = useState(false);
  return (
    <>
    <HomeLayout>
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
        <Heading
          className={`${FONT_SIZES["5xl"]} md:${FONT_SIZES["6xl"]} ${FONT_WEIGHTS.extrabold} mb-6 ${COLOR_CLASSES.primary}`}
        >
          Sell Used Electronics
        </Heading>
        <p className={`${FONT_SIZES.lg} md:${FONT_SIZES.xl} mb-8 max-w-2xl ${COLOR_CLASSES.textSecondary}`}>
          Trade in your old gadgets or discover amazing deals on refurbished phones, laptops, tablets and
          more!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link
            onClick={() => setShowQuoteForm(true)}
            className={`inline-flex items-center px-6 py-3 rounded-full text-lg ${FONT_WEIGHTS.semibold} ${COLOR_CLASSES.primaryBg} text-white ${COLOR_CLASSES.shadowMd} transition-all duration-200 ${COLOR_CLASSES.primaryBgHover}`}
          >
            Get a Quote
            <ArrowRight className="ml-2" size={20} />
          </Link>
          <Link
            to="/register"
            className={`inline-flex items-center px-6 py-3 border-2 rounded-full text-lg ${FONT_WEIGHTS.semibold} ${COLOR_CLASSES.borderPrimary} ${COLOR_CLASSES.primaryLightBg} ${COLOR_CLASSES.primary}`}
          >
            Register
          </Link>
        </div>

        {/* Features */}
        <section className="grid gap-6 md:grid-cols-3 max-w-5xl w-full px-4">
          {[
            {
              title: "Instant Selling",
              desc: "List your old devices and get paid fast with zero hassle.",
            },
            {
              title: "Verified Products",
              desc: "Buy certified refurbished devices with full warranty.",
            },
            {
              title: "Secure Transactions",
              desc: "Enjoy a safe & seamless buying and selling experience.",
            },
          ].map(({ title, desc }, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl shadow border ${COLOR_CLASSES.borderGray100} ${COLOR_CLASSES.bgWhite} ${COLOR_CLASSES.shadowLg} transition`}
            >
              <h3 className={`${FONT_SIZES.xl} ${FONT_WEIGHTS.bold} mb-2 ${COLOR_CLASSES.primary}`}>
                {title}
              </h3>
              <p className={COLOR_CLASSES.textSecondary}>{desc}</p>
            </div>
          ))}
        </section>
      </main>
      {showQuoteForm && (
       <Modal onClose={() => setShowQuoteForm(false)} title={"Get a Quote"}>
         <QuoteForm onClose={() => setShowQuoteForm(false)} />
       </Modal>
      )}
    </HomeLayout>
    </>
  );
}
