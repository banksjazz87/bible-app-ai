"use server";

import type { Stripe } from "stripe";
import { headers } from "next/headers";
import { CURRENCY } from "@/config";
import { formatAmountForStripe } from "@/utils/stripe-helpers";
import { stripe } from "@/lib/stripe";
import { SubscribeFormSchema } from "@/lib/definitions";

export async function createCheckoutSession(data: FormData, customerId: string): Promise<{ client_secret: string | null; url: string | null }> {
	const lookupKey = data.get("lookup_key") as string;
	console.log("key = ", lookupKey);

	const prices = await stripe.prices.retrieve(lookupKey);
	console.log("Prices Here !!!!! ", prices);

	const session = await stripe.checkout.sessions.create({
		ui_mode: "custom",
		// Provide the customer ID of the customer you previously created
		customer: customerId,
		line_items: [
			{
				// Provide the exact Price ID (e.g. price_1234) of the product you want to sell
				price: prices.id,
				quantity: 1,
			},
		],
		mode: "subscription",
		return_url: `${process.env.NEXT_PUBLIC_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
	});

	console.log("Session here ", session);
	return {
		client_secret: session.client_secret,
		url: session.url,
	};
}


export async function createPortalSession(data: FormData) {
	const sessionID = data.get("session") as string;
	const { customer } = await stripe.checkout.sessions.retrieve(sessionID);
	const returnURL = process.env.NEX_PUBLIC_DOMAIN as string;

	const portalSession = await stripe.billingPortal.sessions.create({
		customer: customer as string,
		return_url: returnURL,
	});

	return {
		customer: portalSession.customer,
		url: portalSession.url,
	};
}

export async function createPaymentIntent(data: FormData): Promise<{ client_secret: string }> {
	const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
		amount: formatAmountForStripe(Number(data.get("customDonation") as string), CURRENCY),
		automatic_payment_methods: { enabled: true },
		currency: CURRENCY,
	});

	return { client_secret: paymentIntent.client_secret as string };
}

export async function subscribeAction() {
	const { url } = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{
				price: "price_1SDxaFRv9ZEy80pDmAiLFtd2",
				quantity: 1,
			},
		],
		mode: "subscription",
		success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success`,
		cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,
	});
}


export async function searchCustomer(data: SubscribeFormSchema, field: keyof SubscribeFormSchema) {
	const fieldValue = data[field];

	try {
		const customers = await stripe.customers.search({ query: `${field}: "${fieldValue}"` });

		return {
			code: 200,
			message: "Successfully requested the customers object",
			data: customers.data,
		};
	} catch (e: any) {
		console.log(`The following error occurred in retrieving the customer data: ${e}`);
	}
}

export async function createCustomer(data: SubscribeFormSchema) {
	console.log("This is the selected country ", data.country);

	const email = data.email;
	const firstName = data.firstName;
	const lastName = data.lastName;
	const fullName = `${firstName} ${lastName}`;
	const city = data.city;
	const country = data.country;
	const streetAddress = data.streetAddress;
	const postalCode = data.zipCode;
	const state = data.state;

	const customer = await stripe.customers.create({
		email: email,
		name: fullName,
		shipping: {
			address: {
				city: city,
				country: country,
				line1: streetAddress,
				postal_code: postalCode,
				state: state,
			},
			name: fullName,
		},
		address: {
			city: city,
			country: country,
			line1: streetAddress,
			postal_code: postalCode,
			state: state,
		},
	});
	console.log("Customer Details HERE: ", customer);

	return {
		status: 200,
		customerId: customer.id as string,
	};
}

type ProductResponse = {
	status: number;
	data?: (Stripe.Price & { product: Stripe.Product })[];
	errorMessage?: string;
};

export async function getProducts(): Promise<ProductResponse> {
	try {
		const products: Stripe.Response<Stripe.ApiList<Stripe.Price>> = await stripe.prices.list({ expand: ["data.product"] });
		const productArray = products.data as (Stripe.Price & { product: Stripe.Product })[];

		return {
			status: 200,
			data: productArray,
		};
	} catch (e: any) {
		return {
			status: 500,
			errorMessage: `The following error occurred in getting the products: ${e}`,
		};
	}
}



