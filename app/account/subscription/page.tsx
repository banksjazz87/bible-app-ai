"use server";

import { getCurrentUserSubscriptionDetails } from "@/app/actions/stripe";
import { Suspense } from "react";
import SubscriptionLayout from "./components/SubscriptionLayout";

export default async function SubscriptionPage() {
	const subscriptionData = getCurrentUserSubscriptionDetails();

	return (
		<main>
			<section className="mt-16 flex flex-col gap-4">
				<h2 className="font-bold text-2xl">Subscription Details</h2>
			</section>
			<Suspense fallback={<div>Loading...</div>}>
				<SubscriptionLayout subscriptionData={subscriptionData} />
			</Suspense>
		</main>
	);
}
