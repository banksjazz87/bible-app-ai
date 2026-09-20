"use server";
import SubscriptionForm from "./components/SubscriptionForm";
import { Suspense } from "react";

export default async function SubscriptionPage() {

	return (
		<Suspense>
			<SubscriptionForm />
		</Suspense>
	);
}
