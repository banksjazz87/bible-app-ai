"use client";

import { CheckoutProvider } from '@stripe/react-stripe-js/checkout';
import UICheckoutForm from '@/components/stripe/UICheckoutForm';
import { initStripe } from '@/lib/stripe';
import { CheckoutForm } from '@/components/stripe/CheckoutForm';
import { loadStripe } from "@stripe/stripe-js";


type StripeProviderProps = {
    clientSecret: string;
}

export default async function StripeCheckoutProvider({clientSecret}: StripeProviderProps) {
    const stripePromise = initStripe;
    return (
        <CheckoutProvider
            stripe={stripePromise}
            options={{clientSecret}}
        >
            <CheckoutForm />
            <UICheckoutForm />
        </CheckoutProvider>     
    )
}