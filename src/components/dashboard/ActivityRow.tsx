import React from 'react';

interface ActivityRowProps {
  name: string;
  activity: string;
  details: string;
  time: string;
  type: 'purchase' | 'competition' | 'achievement';
}

export const ActivityRow: React.FC<ActivityRowProps> = ({ name, activity, details, time, type }) => {
  const getActivityStyle = (type: string) => {
    const styles = {
      purchase: 'bg-green-100 text-green-600',
      competition: 'bg-purple-100 text-purple-600',
      achievement: 'bg-yellow-100 text-yellow-600'
    };
    return styles[type as keyof typeof styles] || 'bg-indigo-100 text-indigo-600';
  };

  return (
    <tr className="border-b border-indigo-100 hover:bg-indigo-50/50 transition-colors">
      <td className="py-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="font-medium text-sm text-indigo-900">{name}</span>
        </div>
      </td>
      <td className="py-4">
        <span className={`px-2 py-1 text-xs rounded-full ${getActivityStyle(type)}`}>
          {activity}
        </span>
      </td>
      <td className="py-4 text-sm font-medium text-indigo-600">{details}</td>
      <td className="py-4 text-sm text-indigo-500">{time}</td>
    </tr>
  );
};