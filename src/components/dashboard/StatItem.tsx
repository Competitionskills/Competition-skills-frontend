import React from 'react';

interface StatItemProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
}

export const StatItem: React.FC<StatItemProps> = ({ title, value, change, positive }) => {
  return (
    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-white rounded-lg hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm text-indigo-500">{title}</p>
        <p className="text-xl font-bold text-indigo-900">{value}</p>
      </div>
      <div className={`px-2 py-1 rounded ${positive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {change}
      </div>
    </div>
  );
};