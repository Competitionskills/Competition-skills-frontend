import React, { useState } from "react";
import { CreditCard, Coins, AlertCircle, Check, X, Minus, Plus } from "lucide-react";
import { useUser } from "../context/userContext";
import TicketSuccess from "./TicketSuccess";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface BuyTicketsProps {
  isOpen: boolean;
  onClose: () => void;
  /** legacy fallback; real source of truth is userContext.user.points */
  userPoints: number;
  onPurchase: (pointsSpent: number, ticketsQuantity: number) => void;
}

interface PaymentOption {
  id: "points" | "card";
  title: string;
  icon: React.ReactNode;
  description: string;
}

/* ---------- Reusable confirmation dialog ---------- */
const ConfirmDialog: React.FC<{
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ open, title = "Confirm purchase", message, confirmLabel = "Yes, continue", cancelLabel = "Cancel", onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-indigo-900">{title}</h3>
        </div>
        <div className="px-6 py-5">
          <p className="text-slate-700">{message}</p>
        </div>
        <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const BuyTickets: React.FC<BuyTicketsProps> = ({ isOpen, onClose, userPoints, onPurchase }) => {
  const { user, refreshUser } = useUser(); // live user points
  const stripe = useStripe();
  const elements = useElements();

  const [selectedOption, setSelectedOption] = useState<PaymentOption["id"] | null>("points");
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [successInfo, setSuccessInfo] = useState<any>({
    paymentMethod: "points",
    quantity: 1,
  });

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => () => {});

  const ticketCostPoints = 10;
  const ticketCostMoney = 1.99;
  const totalCostPoints = ticketCostPoints * quantity;
  const totalCostMoney = +(ticketCostMoney * quantity).toFixed(2);

  if (!isOpen) return null;

  const pointsAvailable = typeof user?.points === "number" ? user.points : (userPoints ?? 0);
  const token = localStorage.getItem("token");

  const paymentOptions: PaymentOption[] = [
    {
      id: "points",
      title: "Buy with Points",
      icon: <Coins className="h-6 w-6 text-yellow-500" />,
      description: "Use your earned points to purchase tickets",
    },
    {
      id: "card",
      title: "Buy with Card",
      icon: <CreditCard className="h-6 w-6 text-indigo-500" />,
      description: "Pay securely using your credit or debit card",
    },
  ];

  /* ---------- Confirmation helpers ---------- */
  const askConfirm = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmOpen(true);
  };
  const handleConfirmYes = () => {
    setConfirmOpen(false);
    confirmAction();
  };
  const handleConfirmNo = () => setConfirmOpen(false);

  /* ---------- Purchase via Points ---------- */
  const handlePointsPurchase = async () => {
    if (pointsAvailable < totalCostPoints) {
      alert("Not enough points!");
      return;
    }
    try {
      const res = await fetch("https://api.scoreperks.co.uk/api/tickets/buy-prestige-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to buy with points");
        return;
      }

      onPurchase(totalCostPoints, quantity);
      await refreshUser();

      setSuccessInfo({
        paymentMethod: "points",
        pointsUsed: totalCostPoints,
        pointsRemaining:
          typeof user?.points === "number" ? user.points - totalCostPoints : pointsAvailable - totalCostPoints,
        quantity,
      });
      setPurchaseSuccess(true);
    } catch (err) {
      console.error("❌ Error buying ticket with points:", err);
      alert("Failed to buy with points.");
    }
  };

  /* ---------- Purchase via Card (manual flow so we can confirm first) ---------- */
  const handleCardPurchase = async () => {
    if (!stripe || !elements) return;

    try {
      if (!token) {
        alert("Please log in first.");
        return;
      }

      const res = await fetch("https://api.scoreperks.co.uk/api/payments/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Math.round(totalCostMoney * 100) }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(`Error: ${data.error || data.message}`);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardElement! },
      });

      if (error) {
        alert(error.message || "Payment failed");
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        const confirmRes = await fetch("https://api.scoreperks.co.uk/api/payments/confirm-purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        });

        const confirmData = await confirmRes.json();
        if (!confirmRes.ok) {
          alert(confirmData.message || "Error confirming purchase");
          return;
        }

        await refreshUser();
        setSuccessInfo({ paymentMethod: "card", amountPaid: totalCostMoney, quantity });
        setPurchaseSuccess(true);
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("Something went wrong while processing payment.");
    }
  };

  const resetPurchase = () => {
    setPurchaseSuccess(false);
    setSelectedOption("points");
    setQuantity(1);
  };

  const handleClose = () => {
    resetPurchase();
    onClose();
  };

  const incrementQuantity = () => {
    if (selectedOption === "points" && (quantity + 1) * ticketCostPoints <= pointsAvailable) {
      setQuantity((q) => q + 1);
    } else if (selectedOption === "card") {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  return (
    <>
      {/* Main modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex justify-between items-center">
            <h2 className="text-2xl font-bold text-indigo-900">
              {purchaseSuccess ? "Purchase Complete" : "Buy Tickets"}
            </h2>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {paymentOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option.id)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        selectedOption === option.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-3 rounded-lg ${
                            selectedOption === option.id ? "bg-indigo-100" : "bg-gray-100"
                          }`}
                        >
                          {option.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-lg text-indigo-900">{option.title}</h3>
                          <p className="text-gray-600 text-sm">{option.description}</p>
                        </div>
                        <div
                          className={`mt-2 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            selectedOption === option.id ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
                          }`}
                        >
                          {selectedOption === option.id && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedOption && (
                  <div className="mb-6 flex items-center justify-center space-x-4">
                    <button
                      onClick={decrementQuantity}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-5 w-5 text-gray-600" />
                    </button>
                    <span className="text-xl font-semibold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      disabled={selectedOption === "points" && (quantity + 1) * ticketCostPoints > pointsAvailable}
                    >
                      <Plus className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                )}

                {selectedOption === "points" && (
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-indigo-900">Your Points Balance</h3>
                        <p className="text-gray-600">Available points to spend</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-600">
                          {pointsAvailable.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">points</p>
                      </div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-indigo-900">
                            Total cost for {quantity} ticket{quantity !== 1 ? "s" : ""}
                          </p>
                          <p className="text-2xl font-bold text-indigo-600">
                            {totalCostPoints.toLocaleString()} points
                          </p>
                        </div>
                        <button
                          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() =>
                            askConfirm(
                              `Are you sure you want to buy ${quantity} prestige ticket${
                                quantity > 1 ? "s" : ""
                              } for ${totalCostPoints} points?`,
                              handlePointsPurchase
                            )
                          }
                          disabled={totalCostPoints > pointsAvailable}
                        >
                          Purchase Ticket{quantity !== 1 ? "s" : ""}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <AlertCircle className="h-4 w-4" />
                      <p>Points will be deducted immediately upon purchase</p>
                    </div>
                  </div>
                )}

                {selectedOption === "card" && (
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-indigo-900 mb-2">Payment Details</h3>
                      <p className="text-gray-600">Complete your purchase securely</p>
                    </div>

                    {/* We trigger confirmation manually, not on form submit */}
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Details</label>
                      <div className="p-3 border border-gray-300 rounded-lg">
                        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-indigo-900">
                              Total Amount ({quantity} ticket{quantity !== 1 ? "s" : ""})
                            </p>
                            <p className="text-2xl font-bold text-indigo-600">${totalCostMoney}</p>
                          </div>
                          <button
                            type="button"
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-colors"
                            onClick={() =>
                              askConfirm(
                                `Are you sure you want to pay $${totalCostMoney} for ${quantity} prestige ticket${
                                  quantity > 1 ? "s" : ""
                                }?`,
                                handleCardPurchase
                              )
                            }
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

      {/* Confirmation modal */}
      <ConfirmDialog
        open={confirmOpen}
        message={confirmMessage}
        onConfirm={handleConfirmYes}
        onCancel={handleConfirmNo}
        confirmLabel="Yes, purchase"
      />
    </>
  );
};

export default BuyTickets;
