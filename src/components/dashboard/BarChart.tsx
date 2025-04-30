import React from 'react';
import { Star, Crown, Target } from 'lucide-react';

export const BarChart: React.FC = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const values = [6.5, 8.5, 4.5, 7.5, 5.5, 9.0, 8.0, 7.0];
  const maxValue = Math.max(...values);
  const achievements = {
    'Mar': { type: 'star', color: 'text-yellow-500' },
    'Jun': { type: 'crown', color: 'text-purple-500' },
    'Aug': { type: 'target', color: 'text-green-500' }
  };
  
  return (
    <div className="w-full h-full flex items-end">
      <div className="flex-1 flex items-end justify-between h-full relative">
        <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-between">
          {[10, 8, 6, 4, 2, 0].map((value, i) => (
            <div key={i} className="w-full flex items-center">
              <span className="text-xs text-indigo-400 w-8">{value}</span>
              <div className="flex-1 border-b border-indigo-100 border-dashed h-0"></div>
            </div>
          ))}
        </div>
        
        <div className="flex items-end justify-between w-full relative z-10">
          {months.map((month, i) => (
            <div key={i} className="relative flex flex-col items-center group w-1/8">
              <div className="relative">
                {achievements[month as keyof typeof achievements] && (
                  <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 ${achievements[month as keyof typeof achievements].color}`}>
                    {achievements[month as keyof typeof achievements].type === 'star' && <Star className="w-5 h-5" />}
                    {achievements[month as keyof typeof achievements].type === 'crown' && <Crown className="w-5 h-5" />}
                    {achievements[month as keyof typeof achievements].type === 'target' && <Target className="w-5 h-5" />}
                  </div>
                )}
                <div 
                  className="w-6 md:w-8 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-300 group-hover:from-indigo-500 group-hover:to-indigo-300 relative overflow-hidden"
                  style={{ height: `${(values[i] / 10) * 200}px` }}
                >
                  <div className="absolute inset-0 bg-white/20 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </div>
              </div>
              <div className="flex flex-col items-center mt-2">
                <span className="text-xs font-medium text-indigo-500">{month}</span>
                <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {values[i]}
                </span>
              </div>
              {values[i] === maxValue && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                  Best Month!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};