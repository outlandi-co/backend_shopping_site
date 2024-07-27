import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();
const Environment = paypal.core.SandboxEnvironment;
const client = new paypal.core.PayPalHttpClient(new Environment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET));

export const processPayPalPayment = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount
        }
      }]
    });

    const order = await client.execute(request);

    return { success: true, order };
  } catch (error) {
    console.error('Error processing PayPal payment:', error);
    return { success: false, error: 'Internal Server Error' };
  }
};
