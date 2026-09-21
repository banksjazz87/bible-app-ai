"use server";

// import { getCurrentUserSubscriptionDetails } from "@/app/actions/stripe";
import { Suspense } from "react";
import { InvoiceSkeleton, ChargesSkeleton} from "./components/Skeletons";
import { getCustomerInvoices, listCustomerCharges } from "@/app/actions/stripe";
import InvoiceTable from "./components/InvoiceTable";
import ChargesTable from "./components/ChargesTable";

export default async function SubscriptionPage({ searchParams }: {
	searchParams: Promise<{ billCount?: string }>
}) {

	const { billCount } = await searchParams;
	const requestedNumberOfCharges = Number(billCount) || 10;
	const customerInvoices = getCustomerInvoices();
	const customerCharges = listCustomerCharges(requestedNumberOfCharges);

    return (
			<main>
				<section className="mt-16 flex flex-col gap-4">
					<h2 className="font-bold text-2xl">Invoice Details</h2>
				</section>
				<Suspense fallback={<InvoiceSkeleton />}>
					<InvoiceTable invoices={customerInvoices} />
				</Suspense>

				<Suspense fallback={<ChargesSkeleton />}>
					<ChargesTable
						charges={customerCharges}
						count={requestedNumberOfCharges}
					/>
				</Suspense>
			</main>
		);
}
