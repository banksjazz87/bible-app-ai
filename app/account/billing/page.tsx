"use server";

// import { getCurrentUserSubscriptionDetails } from "@/app/actions/stripe";
import { Suspense } from "react";
import { InvoiceSkeleton, ChargesSkeleton} from "./components/Skeletons";
import { getCustomerInvoices, listCustomerCharges } from "@/app/actions/stripe";
import InvoiceTable from "./components/InvoiceTable";
import ChargesTable from "./components/ChargesTable";

export default async function SubscriptionPage() {
	const customerInvoices = getCustomerInvoices();
	const customerCharges = listCustomerCharges();

    return (
			<main>
				<section className="mt-16 flex flex-col gap-4">
					<h2 className="font-bold text-2xl">Invoice Details</h2>
				</section>
				<Suspense fallback={<InvoiceSkeleton />}>
					<InvoiceTable invoices={customerInvoices} />
				</Suspense>

				<Suspense fallback={<ChargesSkeleton />}>
					<ChargesTable charges={customerCharges } />
				</Suspense>
			</main>
		);
}
