import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-slate-100 flex flex-col justify-between text-gray-800">
      
      {/* Header - full width */}
      <header className="w-full ">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-[#0066CC]">Sell Used Electronics</h1>
          <nav className="space-x-4">
            <Link to="/login" className="text-sm text-gray-700 hover:text-[#FF6600]">Login</Link>
            <Link to="/register" className="text-sm text-gray-700 hover:text-[#FF6600]">Register</Link>
          </nav>
        </div>
      </header>

      {/* Main content wrapper with padding */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-10">
        <div className="max-w-3xl">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight text-[#0066CC] mb-6">
            Buy & Sell Used Electronics
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Trade in your old gadgets or discover amazing deals on refurbished phones, laptops, tablets and more!
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 text-white bg-[#FF6600] hover:bg-orange-600 rounded-full text-lg font-semibold transition-all duration-200 shadow-lg"
            >
              Login to Get Started
              <ArrowRight className="ml-2" size={20} />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border-2 border-[#0066CC] text-[#0066CC] hover:bg-[#E6F0FF] rounded-full text-lg font-semibold transition-all duration-200"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-16 grid gap-6 md:grid-cols-3 text-center max-w-5xl w-full mx-auto">
          {[
            { title: "Instant Selling", desc: "List your old devices and get paid fast with zero hassle." },
            { title: "Verified Products", desc: "Buy certified refurbished devices with full warranty." },
            { title: "Secure Transactions", desc: "Enjoy a safe & seamless buying and selling experience." }
          ].map(({ title, desc }, idx) => (
            <div key={idx} className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition border border-gray-100">
              <h3 className="text-xl font-bold mb-2 text-[#FF6600]">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer - full width */}
      <footer className="w-full bg-slate-800 text-white text-center text-sm py-6">
        © {new Date().getFullYear()} ElectroTrade. All rights reserved.
      </footer>
    </div>
  );
}
