/*import * as checkout from '@paypal/checkout-server-sdk';

function client() {
	
	const config = functions.config().paypal || {};
	const clientId = config.clientId         || 'PAYPAL-SANDBOX-CLIENT-ID';
	const clientSecret = config.clientSecret || 'PAYPAL-SANDBOX-CLIENT-SECRET';
	
	return new checkoutNodeJssdk.core.PayPalHttpClient({ clientId, clientSecret });
}

export const donateWithPaypal = functions.https.onCall((data, context) => {
	
	// Checking that the user is authenticated.
	if (!context.auth) {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError('failed-precondition', 'The function must be called  while authenticated.');
	}
	
	if (!data.orderId) {

		throw new functions.https.HttpsError('failed-precondition', 'Missing order id.');
	}
	
	const request = new checkout.orders.OrdersGetRequest(data.orderId);
	  
	try {
		
		const order = await client().execute(request);
		
		const unit = order.result.purchase_units[0];

		if (unit.custom_id === 'wallet10' && unit.amount.value === '9.99') {
			
		}
		
	} catch (err) { throw new functions.https.HttpsError(err.code, err.message); }


	 
	const user = context.auth.uid;
	 
	return { user };
});
*/