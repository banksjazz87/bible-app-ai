"use server";

import { use  }from "react";
import CheckoutForm from "./components/CheckoutForm";
type SearchParamsProps = {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
};  
    
export default async function Page({ searchParams }: SearchParamsProps) {
    const { session_id } = await searchParams;

    async function fetchClientSecret(): Promise<string> {
        return session_id as string;
    }
    return (
			<main>
				<section>
                <h1 className="font-mono font-extrabold text-5xl text-center">Checkout</h1>
                <p>{`The current session ID is ${session_id}`}</p>
            </section>
            <CheckoutForm
                fetchClientSecret={() => Promise.resolve(fetchClientSecret())}
            />
			</main>
		);
}