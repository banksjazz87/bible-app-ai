"use client";
import SubscriptionForm from "./components/SubscriptionForm";
import { Suspense } from "react";

export default function SubscriptionPage() {
	return (
		<Suspense>
			<SubscriptionForm />
		</Suspense>
	);
}
