import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-gray-100 flex flex-col items-center justify-center px-4 py-10 text-gray-800">
      {/* Hero Section */}
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-blue-700 mb-6">
          Sell & Buy Used Electronics Easily
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Turn your old gadgets into cash. Find great deals on second-hand phones, laptops, tablets, and more!
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-all duration-200 shadow-lg"
          >
            Login to Get Started
            <ArrowRight className="ml-2" size={20} />
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full text-lg font-semibold transition-all duration-200"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="mt-16 grid gap-6 md:grid-cols-3 text-center max-w-5xl">
        <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition">
          <h3 className="text-xl font-bold mb-2">Sell Instantly</h3>
          <p className="text-gray-600">
            List your old phones, laptops, and gadgets with ease and get the best prices.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition">
          <h3 className="text-xl font-bold mb-2">Great Deals</h3>
          <p className="text-gray-600">
            Buy gently used devices at amazing discounts directly from trusted users.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition">
          <h3 className="text-xl font-bold mb-2">Safe & Secure</h3>
          <p className="text-gray-600">
            Verified users, secure payments, and trusted deliveries for peace of mind.
          </p>
        </div>
      </div>
    </div>
  );
}
