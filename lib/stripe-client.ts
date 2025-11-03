import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

const testMode = true;
const apiKey = testMode ? process.env.NEXT_STRIPE_TEST_PUBLIC_KEY! : process.env.NEXT_STRIPE_PUBLISHABLE_KEY!;

export const getStripe = () => {
	if (!stripePromise) {
		stripePromise = loadStripe(apiKey);
	}
	return stripePromise;
};
