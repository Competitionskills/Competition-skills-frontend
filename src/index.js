import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// ✅ Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51RmhOCFW9n2BdCkE7OqPEUVIRv0iMx3GOMOxoOBW1jlYoJuUD44B5hEXV3MsPJF8bTLdmBI2d1OqFMJudP87R2wj00D3IxvMDR');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* ✅ Wrap your app with Elements */}
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>
);

reportWebVitals();
