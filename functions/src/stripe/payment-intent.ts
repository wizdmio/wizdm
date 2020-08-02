import { https, config } from 'firebase-functions';
import Stripe from 'stripe';

export const createPaymentIntent = https.onCall( async (data, context) => {
	const { amount, currency } = data;

	const stripeConfig = config().stripe;
	
	// Checking that the user is authenticated unless configured otherwise.
	if (!stripeConfig.skipAuth && !context.auth) {
		// Throwing an HttpsError so that the client gets the error details.
		throw new https.HttpsError('unauthenticated', 'The function must be called  while authenticated.');
	}
	
	// Ensure the critical parameters are present
	if (!amount || !currency) { 
		throw new https.HttpsError('failed-precondition', 'Missing amount or currency.'); 
	}

	// Checks for the amout being a positive number
	if(amount <= 0) { 
		throw new https.HttpsError('out-of-range', 'Amount must be a positive integer.'); 
	}
	
	try {

		// Use firebase functions:config:set stripe.key="sk_xxxxxxx" to set the variables
    const stripe = new Stripe(stripeConfig.key, null);		
		
		// Creates the payment intent
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency
		});
		
		console.log('Payment intent created! ', paymentIntent.id);
		
		// Returns the payment intent to the client to proceed with confirming it based upon the client_secret.
		return paymentIntent;
		
	} catch(err) { throw new https.HttpsError(err.code, err.message); }
});
