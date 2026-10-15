"use client";

import { JSX } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";

const testMode = process.env.NEXT_PUBLIC_STRIPE_TEST_MODE;
const stripePromise = loadStripe(testMode ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLIC_KEY! : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentMethods({
	fetchClientSecret,
}: {
	fetchClientSecret: () => Promise<
		| {
				customerSessionClientSecret: string;
				clientSecret: string | null;
		  }
		| undefined
	>;
}): JSX.Element {
    const options = fetchClientSecret();

	return (
		<EmbeddedCheckoutProvider
			stripe={stripePromise}
            options={}
		>
			<EmbeddedCheckout />
		</EmbeddedCheckoutProvider>
	);
}