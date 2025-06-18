import React from 'react';

const RiskScoreBadge = ({ score }) => {
  let borderColor = '';
  let bgColor = '';
  let textColor = '';

  if (score > 75) {
    borderColor = 'border-red-700';
    bgColor = 'bg-red-100';
    textColor = 'text-red-700';
  } else if (score >= 50 && score <= 75) {
    borderColor = 'border-yellow-600';
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-600';
  } else {
    borderColor = 'border-green-700';
    bgColor = 'bg-green-100';
    textColor = 'text-green-700';
  }

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border ${borderColor} ${bgColor} ${textColor}`}
    >
      {score}
    </div>
  );
};

export default RiskScoreBadge;
