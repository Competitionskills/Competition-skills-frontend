import React, { useState } from 'react';
import { CreditCard, Coins, ChevronRight, AlertCircle, Check, X, Plus, Minus } from 'lucide-react';
import TicketSuccess from './TicketSuccess';

interface BuyTicketsProps {
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
  onPurchase: (pointsSpent: number, ticketsQuantity: number) => void;
}

interface PaymentOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const BuyTickets: React.FC<BuyTicketsProps> = ({ isOpen, onClose, userPoints, onPurchase }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [successInfo, setSuccessInfo] = useState<{
    paymentMethod: 'points' | 'card';
    pointsUsed?: number;
    pointsRemaining?: number;
    amountPaid?: number;
    quantity: number;
  }>({ paymentMethod: 'points', quantity: 1 });

  if (!isOpen) return null;

  const ticketCostPoints = 10;
  const ticketCostMoney = 1.99;
  const totalCostPoints = ticketCostPoints * quantity;
  const totalCostMoney = +(ticketCostMoney * quantity).toFixed(2);

  const paymentOptions: PaymentOption[] = [
    {
      id: 'points',
      title: 'Buy with Points',
      icon: <Coins className="h-6 w-6 text-yellow-500" />,
      description: 'Use your earned points to purchase tickets'
    },
    {
      id: 'card',
      title: 'Buy with Card',
      icon: <CreditCard className="h-6 w-6 text-indigo-500" />,
      description: 'Pay securely using your credit or debit card'
    }
  ];

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessInfo({
      paymentMethod: 'card',
      amountPaid: totalCostMoney,
      quantity
    });
    setPurchaseSuccess(true);
  };

  const handlePointsPurchase = () => {
    const newPointsBalance = userPoints - totalCostPoints;
    onPurchase(totalCostPoints, quantity);
    setSuccessInfo({
      paymentMethod: 'points',
      pointsUsed: totalCostPoints,
      pointsRemaining: newPointsBalance,
      quantity
    });
    setPurchaseSuccess(true);
  };

  const resetPurchase = () => {
    setPurchaseSuccess(false);
    setSelectedOption(null);
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
    setQuantity(1);
  };

  const handleClose = () => {
    resetPurchase();
    onClose();
  };

  const incrementQuantity = () => {
    if (selectedOption === 'points' && (quantity + 1) * ticketCostPoints <= userPoints) {
      setQuantity(q => q + 1);
    } else if (selectedOption === 'card') {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches?.[0] ?? '';
    const parts: string[] = [];
  
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-900">
            {purchaseSuccess ? 'Purchase Complete' : 'Buy Tickets'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {purchaseSuccess ? (
            <TicketSuccess 
              paymentMethod={successInfo.paymentMethod}
              pointsUsed={successInfo.pointsUsed}
              pointsRemaining={successInfo.pointsRemaining}
              amountPaid={successInfo.amountPaid}
              quantity={successInfo.quantity}
              onClose={handleClose}
              onPurchaseMore={resetPurchase}
            />
          ) : (
            <>
              {/* Payment Options */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      selectedOption === option.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        selectedOption === option.id
                          ? 'bg-indigo-100'
                          : 'bg-gray-100'
                      }`}>
                        {option.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-lg text-indigo-900">{option.title}</h3>
                        <p className="text-gray-600 text-sm">{option.description}</p>
                      </div>
                      <div className={`mt-2 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === option.id
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedOption === option.id && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quantity Selector */}
              {selectedOption && (
                <div className="mb-6 flex items-center justify-center space-x-4">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-5 w-5 text-gray-600" />
                  </button>
                  <span className="text-xl font-semibold text-gray-900 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    disabled={selectedOption === 'points' && totalCostPoints > userPoints}
                  >
                    <Plus className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              )}

              {/* Points Payment Section */}
              {selectedOption === 'points' && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-900">Your Points Balance</h3>
                      <p className="text-gray-600">Available points to spend</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">{userPoints.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">points</p>
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-900">Total cost for {quantity} ticket{quantity !== 1 ? 's' : ''}</p>
                        <p className="text-2xl font-bold text-indigo-600">{totalCostPoints.toLocaleString()} points</p>
                      </div>
                      <button 
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handlePointsPurchase}
                        disabled={totalCostPoints > userPoints}
                      >
                        Purchase Ticket{quantity !== 1 ? 's' : ''}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <AlertCircle className="h-4 w-4" />
                    <p>Points will be deducted immediately upon purchase</p>
                  </div>
                </div>
              )}

              {/* Card Payment Section */}
              {selectedOption === 'card' && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-2">Payment Details</h3>
                    <p className="text-gray-600">Complete your purchase securely</p>
                  </div>

                  <form onSubmit={handleCardSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="1234 5678 9012 3456"
                        />
                        <div className="absolute right-3 top-2.5 flex space-x-2">
                          <img src="https://raw.githubusercontent.com/danielmconrad/payment-icons/master/min/flat/visa.svg" alt="Visa" className="h-6" />
                          <img src="https://raw.githubusercontent.com/danielmconrad/payment-icons/master/min/flat/mastercard.svg" alt="Mastercard" className="h-6" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-indigo-900">Total Amount ({quantity} ticket{quantity !== 1 ? 's' : ''})</p>
                          <p className="text-2xl font-bold text-indigo-600">${totalCostMoney}</p>
                        </div>
                        <button 
                          type="submit"
                          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-colors"
                        >
                          Complete Purchase
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <AlertCircle className="h-4 w-4" />
                    <p>Your payment information is encrypted and secure</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyTickets;