import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-purple-600 via-blue-600 to-indigo-400 text-white">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="text-2xl font-bold text-white">GadgetZone</div>
        <nav className="space-x-4 text-sm md:text-base">
          <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
          <Link to="/products" className="hover:text-yellow-300 transition">Products</Link>
          <Link to="/contact" className="hover:text-yellow-300 transition">Contact</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-md">
          Sell & Buy Used Electronics Easily
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10">
          Turn your old gadgets into cash. Find great deals on second-hand phones, laptops, tablets, and more!
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-yellow-400 text-gray-900 hover:bg-yellow-300 rounded-full text-lg font-semibold transition-all duration-200 shadow-lg"
          >
            Login to Get Started
            <ArrowRight className="ml-2" size={20} />
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 border border-white text-white hover:bg-white hover:text-indigo-700 rounded-full text-lg font-semibold transition-all duration-200"
          >
            Register
          </Link>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-3 text-center max-w-5xl">
          <div className="p-6 bg-white/10 rounded-xl shadow-md hover:bg-white/20 transition">
            <h3 className="text-xl font-bold mb-2 text-yellow-300">Sell Instantly</h3>
            <p className="text-white/80">
              List your old phones, laptops, and gadgets with ease and get the best prices.
            </p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl shadow-md hover:bg-white/20 transition">
            <h3 className="text-xl font-bold mb-2 text-yellow-300">Great Deals</h3>
            <p className="text-white/80">
              Buy gently used devices at amazing discounts directly from trusted users.
            </p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl shadow-md hover:bg-white/20 transition">
            <h3 className="text-xl font-bold mb-2 text-yellow-300">Safe & Secure</h3>
            <p className="text-white/80">
              Verified users, secure payments, and trusted deliveries for peace of mind.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/10 border-t border-white/20 py-6 px-4 text-center text-sm text-white/70">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto">
          <p>&copy; {new Date().getFullYear()} GadgetZone. All rights reserved.</p>
          <div className="space-x-4 mt-2 md:mt-0">
            <Link to="/privacy" className="hover:text-yellow-300">Privacy</Link>
            <Link to="/terms" className="hover:text-yellow-300">Terms</Link>
            <Link to="/support" className="hover:text-yellow-300">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
