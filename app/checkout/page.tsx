"use client";

import { useSearchParams } from "next/navigation";
import * as React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getCheckoutSession } from "../actions/stripe";
import CheckoutForm from "./components/CheckoutForm";

    
export default function Page() {
    // const searchParams = useSearchParams();
    // const session_id = searchParams.get("session_id");

    // const getClientSecret = async () => {
    //     if (session_id) {
    //         const session = await getCheckoutSession(session_id);
    //         return session.client_secret as string;
    //     }
    //     return "";
    // }

    return (
			<main>
				{/* <section> */}
                <h1 className="font-mono font-extrabold text-5xl text-center">Checkout</h1>
                {/* <p>{`The current session ID is ${session_id}`}</p>
            </section>
                <CheckoutForm fetchClientSecret={getClientSecret} /> */}
            
			</main>
		);
}
