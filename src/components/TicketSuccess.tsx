import React from 'react';
import { Check } from 'lucide-react';

interface TicketSuccessProps {
  paymentMethod: 'points' | 'card';
  pointsUsed?: number;
  pointsRemaining?: number;
  amountPaid?: number;
  quantity: number;
  onClose: () => void;
  onPurchaseMore: () => void;
}

const TicketSuccess: React.FC<TicketSuccessProps> = ({
  paymentMethod,
  pointsUsed,
  pointsRemaining,
  amountPaid,
  quantity,
  onClose,
  onPurchaseMore,
}) => {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Tickets Purchased Successfully!</h3>
        <p className="text-gray-600 mt-1">
          {quantity} ticket{quantity !== 1 ? 's have' : ' has'} been added to your account
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Purchase Summary</h4>
        
        {paymentMethod === 'points' ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Points used</span>
              <span className="font-semibold text-indigo-700">{pointsUsed?.toLocaleString()} points</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Points remaining</span>
              <span className="font-semibold text-indigo-700">{pointsRemaining?.toLocaleString()} points</span>
            </div>
            <div className="pt-2 mt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium">Quantity</span>
                <span className="font-semibold text-indigo-700">{quantity} ticket{quantity !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount paid</span>
              <span className="font-semibold text-indigo-700">${amountPaid?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment method</span>
              <span className="font-semibold text-indigo-700">Credit/Debit Card</span>
            </div>
            <div className="pt-2 mt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium">Quantity</span>
                <span className="font-semibold text-indigo-700">{quantity} ticket{quantity !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={onPurchaseMore}
          className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-500 transition-colors"
        >
          Purchase More Tickets
        </button>
        <button 
          onClick={onClose}
          className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TicketSuccess;