"use client";
import SubscriptionForm from "./components/SubscriptionForm";
import { Suspense } from "react";
import { getProducts } from "../actions/stripe";

export default function SubscriptionPage() {
	const products = getProducts();

	return (
		<Suspense>
			<SubscriptionForm products={products} />
		</Suspense>
	);
}
