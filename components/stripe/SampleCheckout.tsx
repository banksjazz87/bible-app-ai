"use client";

import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo } from "react";
import SubscriptionForm from "@/app/subscribe/components/SubscriptionForm";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_STRIPE_PUBLISHABLE_KEY!);

export default function SampleCheckout() {
	const promise = useMemo( async () => {
		return fetch("/create-checkout-session", {
			method: "POST",
		})
			.then((res) => res.json())
			.then((data) => data.clientSecret);
	}, []);

	return (
		<CheckoutProvider
			stripe={stripePromise}
			options={{ clientSecret: promise }}
		>
			<SubscriptionForm />
		</CheckoutProvider>
	);
}
