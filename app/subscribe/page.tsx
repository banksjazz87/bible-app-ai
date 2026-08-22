"use server";
import SubscriptionForm from "./components/SubscriptionForm";
import { Suspense } from "react";
import { getProducts, getSubscriptions } from "../actions/stripe";

export default async function SubscriptionPage() {
	const products = getProducts();
	const subscriptions = getSubscriptions();

	return (
		<Suspense>
			<SubscriptionForm products={products} subscriptions={subscriptions} />
		</Suspense>
	);
}
