import { Client, Environment, ApiError } from 'square';
import dotenv from 'dotenv';

dotenv.config();
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox
});

export const processSquarePayment = async (req, res) => {
  try {
    const { amount, currency, source } = req.body;

    const paymentsApi = client.paymentsApi;
    const response = await paymentsApi.createPayment({
      sourceId: source,
      amountMoney: {
        amount: amount * 100, // Square API uses cents
        currency
      },
      idempotencyKey: new Date().getTime().toString()
    });

    return { success: true, response };
  } catch (error) {
    console.error('Error processing Square payment:', error);
    if (error instanceof ApiError) {
      return { success: false, error: error.errors };
    } else {
      return { success: false, error: 'Internal Server Error' };
    }
  }
};
