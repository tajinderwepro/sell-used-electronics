import React, { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";

const ConnectStripe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState(false);

  useEffect(() => {
    if (!user) return;

    axios
      .get(`/users/connect/onboarding-link/${user.id}`)
      .then((res) => {
        window.location.href = res.data.url;
      })
      .catch((err) => {
        console.error("Stripe onboarding failed", err);
        setError(true);
      });
  }, [user]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Failed to connect to Stripe</h2>
        <p className="text-gray-600 mb-6">Please try again or contact support.</p>
        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition"
        >
          Back to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
      <p className="text-lg font-medium text-gray-700">Redirecting you to Stripe onboarding...</p>
    </div>
  );
};

export default ConnectStripe;
