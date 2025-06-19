import React from 'react';
import clsx from 'clsx';

const DashboardCard = ({ count, label, color = 'from-indigo-500 via-purple-500 to-pink-500' }) => {
  return (
    <div
      className={clsx(
        "relative w-full sm:w-60 h-32 rounded-2xl p-4 shadow-xl overflow-hidden group transition-transform duration-300 hover:scale-105",
        "bg-gradient-to-br",
        color
      )}
    >
      {/* Glow Ring */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-transparent rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>

      {/* Glass Layer */}
      <div className="relative z-10 flex flex-col justify-between h-full text-white">
        <div className="text-sm uppercase tracking-wide font-semibold opacity-90">
          {label}
        </div>
        <div className="text-4xl font-extrabold tracking-tight">{count}</div>
      </div>

      {/* Glow Border Effect */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors"></div>
    </div>
  );
};

export default DashboardCard;
