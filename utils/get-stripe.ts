import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;
const testMode = true;
const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(testMode ? process.env.NEXT_STRIPE_TEST_PUBLIC_KEY! : process.env.NEXT_STRIPE_PUBLISHABLE_KEY!);
    }
    return stripePromise;
}

export default getStripe;