"use server";

import { use  }from "react";
type SearchParamsProps = {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
};  
    
export default async function Page({ searchParams }: SearchParamsProps) {
    const { session_id } = await searchParams;
    return (
			<main>
				<section>
                <h1 className="font-mono font-extrabold text-5xl text-center">Checkout</h1>
                <p>{`The current session ID is ${session_id}`}</p>
            </section>
            
			</main>
		);
}