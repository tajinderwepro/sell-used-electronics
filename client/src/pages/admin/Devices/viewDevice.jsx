import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../constants/api";

const ViewDevice = () => {
  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const { deviceId } = useParams();

  const getDevice = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getDevice(deviceId);
      setDevice(res.data);
      setSelectedImage(res.data.media?.[0]?.path || "");
    } catch (err) {
      console.error("Failed to fetch device:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDevice();
  }, []);

  if (loading || !device) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-10 bg-white p-6 rounded-2xl shadow-lg">
        {/* Image Section */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2 overflow-auto">
            {device.media.map((img) => (
              <img
                key={img.id}
                src={img.path}
                alt="Thumbnail"
                onClick={() => setSelectedImage(img.path)}
                className={`w-16 h-16 object-cover rounded-md cursor-pointer border ${
                  selectedImage === img.path ? "border-blue-500" : "border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex justify-center items-center bg-gray-100 rounded-lg w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
            <img
              src={selectedImage}
              alt="Main Device"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-3">
            {device.brand} {device.model}
          </h2>

          {/* Tags */}
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 capitalize">
              {device.condition}
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
              {device.status}
            </span>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4 text-sm md:text-base mb-4">
            <div>
              <div className="text-gray-500">Base Price</div>
              <div className="text-green-600 font-medium">₹{device.base_price}</div>
            </div>
            <div>
              <div className="text-gray-500">eBay Avg Price</div>
              <div className="text-gray-800 font-medium">₹{device.ebay_avg_price}</div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <div className="text-gray-500">Category</div>
              {device.category}
            </div>
            <div>
              <div className="text-gray-500">Brand</div>
              {device.brand}
            </div>
            <div>
              <div className="text-gray-500">Model</div>
              {device.model}
            </div>
            <div>
              <div className="text-gray-500">Submitted By</div>
              {device.user?.name} ({device.user?.email})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDevice;
