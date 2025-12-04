"use client";
import * as React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';

const testMode = true;
const stripePromise = loadStripe(testMode ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLIC_KEY! : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({ fetchClientSecret }: { fetchClientSecret: () => Promise<string> }) => {
    const options = {fetchClientSecret};
    return (
        <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={options}
        >
            <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
    )
}

export default CheckoutForm;