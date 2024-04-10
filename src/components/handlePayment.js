import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51P3zfDSJHmXaOywmjW3iQkmddsGMMRK3V3GzaShVJo8i8fELx3HG8SnZlxTcgaNT6GxNDo0BULaVUIiFUZiM38c500iuVpCBqk');

export const handlePayment = async (token, products, productQuantities) => {
  try {
    const response = await fetch('http://localhost:3001/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ products, productQuantities }),
    });

    if (!response.ok) {
      throw new Error('Failed to initiate payment');
    }

    const session = await response.json();

    const stripe = await stripePromise;
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
      // Handle error, show message to user, etc.
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    // Handle error, show message to user, etc.
  }
};

export default handlePayment;
