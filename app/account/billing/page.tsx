"use server";

// import { getCurrentUserSubscriptionDetails } from "@/app/actions/stripe";
import { Suspense } from "react";
import BillingTable from "./components/BillingTable";
import BillingSkeleton from "./components/BillingSkeleton";

export default async function SubscriptionPage() {
    // const subscriptionData = getCurrentUserSubscriptionDetails();

    return (
			<main>
				<section className="mt-16 flex flex-col gap-4">
					<h2 className="font-bold text-2xl">Subscription Details</h2>
				</section>
				{/* <Suspense fallback={<BillingSkeleton />}>
					<BillingTable />
				</Suspense> */}
            <BillingTable />
			</main>
		);
}
