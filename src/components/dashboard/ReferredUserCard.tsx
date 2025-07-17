import React from 'react';
import { ReferralUser } from '../../types/user';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

interface ReferredUserCardProps {
  user: ReferralUser;
}

const ReferredUserCard: React.FC<ReferredUserCardProps> = ({ user }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg border border-indigo-100 p-3 transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden flex-shrink-0">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white text-xs font-bold">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h4 className="font-medium text-indigo-800 truncate">{user.username}</h4>
            {user.status === 'active' && (
              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-indigo-500 truncate">{user.email}</p>
        </div>
        
        <div className="text-right flex-shrink-0">
          {user.status === 'active' ? (
            <div className="text-right">
              <span className="block text-xs text-indigo-500">Generated</span>
              <span className="font-medium text-green-600">+{user.pointsGenerated} pts</span>
            </div>
          ) : (
            <div className="flex items-center text-amber-500 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              <span>Pending</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 flex items-center">
        <Calendar className="h-3 w-3 mr-1 text-indigo-300" />
        <span>Joined {formatDate(user.joinDate)}</span>
      </div>
    </div>
  );
};

export default ReferredUserCard;