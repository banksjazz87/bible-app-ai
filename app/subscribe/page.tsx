"use server";
import SubscriptionForm from "./components/SubscriptionForm";
import { Suspense } from "react";
import { getProducts } from "../actions/stripe";

export default async function SubscriptionPage() {
	const products = getProducts();

	return (
		<Suspense>
			<SubscriptionForm products={products} />
		</Suspense>
	);
}
