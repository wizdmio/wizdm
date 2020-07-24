import { https, config } from 'firebase-functions';
import Stripe from 'stripe';

export const createPaymentIntent = https.onCall( async (data, context) => {
	const { amount, currency } = data;
	
	// Checking that the user is authenticated.
	if (!context.auth) {
		// Throwing an HttpsError so that the client gets the error details.
		throw new https.HttpsError('failed-precondition', 'The function must be called  while authenticated.');
	}
	
	if (!amount || !currency) { throw new https.HttpsError('failed-precondition', 'Missing amount or currency.'); }
	
	try {

		// Use firebase functions:config:set stripe.key="sk_xxxxxxx" to set the variables
    const stripe = new Stripe(config().stripe.key, null);		
		
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
