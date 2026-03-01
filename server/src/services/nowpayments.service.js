const crypto = require('crypto');

const NOWPAYMENTS_API_BASE = 'https://api.nowpayments.io/v1';
const NOWPAYMENTS_SANDBOX_BASE = 'https://api-sandbox.nowpayments.io/v1';

class NOWPaymentsService {
  constructor() {
    this.apiKey = process.env.NOWPAYMENTS_API_KEY;
    this.ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
    this.baseCurrency = process.env.NOWPAYMENTS_BASE_CURRENCY || 'USD';
    this.callbackUrl = process.env.NOWPAYMENTS_CALLBACK_URL;
    this.useSandbox = process.env.NOWPAYMENTS_SANDBOX === 'true';
    this.apiBase = this.useSandbox ? NOWPAYMENTS_SANDBOX_BASE : NOWPAYMENTS_API_BASE;
  }

  /**
   * Create a payment invoice via NOWPayments API
   * @param {Number} amount - Amount in base currency (e.g., USD)
   * @param {String} orderId - Unique order/transaction ID
   * @param {String} orderDescription - Description of the payment
   * @param {String} selectedPayCurrency - Selected cryptocurrency (optional, overrides default)
   * @returns {Promise<Object>} Payment details from NOWPayments
   */
  async createPayment(amount, orderId, orderDescription, selectedPayCurrency = null) {
    if (!this.apiKey) {
      throw new Error('NOWPayments API key is not configured');
    }

    if (!this.callbackUrl) {
      throw new Error('NOWPayments callback URL is not configured');
    }

    try {
      // Use selected currency if provided, otherwise use default from env or fallback
      const payCurrency = selectedPayCurrency || process.env.NOWPAYMENTS_PAY_CURRENCY || 'usdttrc20';
      
      const requestBody = {
        price_amount: amount,
        price_currency: this.baseCurrency.toLowerCase(),
        pay_currency: payCurrency.toLowerCase(), // Required: cryptocurrency to accept payment in
        order_id: orderId,
        order_description: orderDescription || `Deposit of $${amount}`,
        ipn_callback_url: this.callbackUrl
      };

      // Add optional URLs if frontend URL is configured
      if (process.env.FRONTEND_URL) {
        requestBody.success_url = `${process.env.FRONTEND_URL}/dashboard?payment=success`;
        requestBody.cancel_url = `${process.env.FRONTEND_URL}/dashboard?payment=cancelled`;
      }

      console.log('NOWPayments API Request:', {
        url: `${this.apiBase}/payment`,
        apiKey: this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NOT SET',
        sandbox: this.useSandbox,
        body: requestBody
      });

      const response = await fetch(`${this.apiBase}/payment`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();
      console.log('NOWPayments API Response:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText.substring(0, 500) // First 500 chars
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText || response.statusText };
        }
        throw new Error(`NOWPayments API error: ${response.status} - ${errorData.message || errorData.error || response.statusText}`);
      }

      const data = JSON.parse(responseText);
      return data;
    } catch (error) {
      console.error('NOWPayments createPayment error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Get payment status from NOWPayments
   * @param {String} paymentId - NOWPayments payment ID
   * @returns {Promise<Object>} Payment status and details
   */
  async getPaymentStatus(paymentId) {
    if (!this.apiKey) {
      throw new Error('NOWPayments API key is not configured');
    }

    try {
      const response = await fetch(`${this.apiBase}/payment/${paymentId}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`NOWPayments API error: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('NOWPayments getPaymentStatus error:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature from NOWPayments
   * @param {String} body - Raw request body as string
   * @param {String} signature - Signature from x-nowpayments-sig header
   * @returns {Boolean} True if signature is valid
   */
  verifyWebhookSignature(body, signature) {
    if (!this.ipnSecret) {
      console.warn('IPN secret not configured, skipping signature verification');
      return true; // In development, allow without secret
    }

    try {
      // NOWPayments uses HMAC SHA512
      const hmac = crypto.createHmac('sha512', this.ipnSecret);
      hmac.update(body);
      const calculatedSignature = hmac.digest('hex');

      // Compare signatures using constant-time comparison
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(calculatedSignature, 'hex')
      );
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }

  /**
   * Map NOWPayments payment status to our transaction status
   * @param {String} nowpaymentsStatus - Status from NOWPayments
   * @returns {String} Our transaction status
   */
  mapPaymentStatus(nowpaymentsStatus) {
    const statusMap = {
      'waiting': 'pending',
      'confirming': 'pending',
      'confirmed': 'completed',
      'sending': 'pending',
      'partially_paid': 'pending',
      'finished': 'completed',
      'failed': 'failed',
      'refunded': 'cancelled',
      'expired': 'failed'
    };

    return statusMap[nowpaymentsStatus] || 'pending';
  }

  /**
   * Check if payment status indicates completion
   * @param {String} status - Payment status
   * @returns {Boolean} True if payment is completed
   */
  isPaymentCompleted(status) {
    return status === 'confirmed' || status === 'finished';
  }
}

module.exports = new NOWPaymentsService();



