"use server";

// import { getCurrentUserSubscriptionDetails } from "@/app/actions/stripe";
import { Suspense } from "react";
import { InvoiceSkeleton, ChargesSkeleton } from "./components/Skeletons";
import { getCustomerInvoices, listCustomerCharges } from "@/app/actions/stripe";
import InvoiceTable from "./components/InvoiceTable";
import ChargesTable from "./components/ChargesTable";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SubscriptionPage() {
	const customerInvoices = getCustomerInvoices();
	// const customerCharges = listCustomerCharges();

	return (
		<main>
			<section className="mt-16 flex flex-col gap-2">
				<small>Billing</small>
				<h2 className="font-bold text-2xl">Billing Details</h2>
				<p className="text-gray-600">Manage your subscription, payment method, and view your invoices.</p>
			</section>
			<div className="grid grid-cols-3 gap-12">
				<Card>
					<CardHeader className="flex flex-row content-center justify-between">
						<CardTitle className="text-sm">Current Plan</CardTitle>
						<Badge variant="outline" className="bg-green-200">Active</Badge>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">Pro Plan</p>
					</CardContent>
					<CardFooter>
						<p>$5.00</p>
					</CardFooter>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Current Plan</CardTitle>
						<CardDescription>Card Description</CardDescription>
						<CardAction>Card Action</CardAction>
					</CardHeader>
					<CardContent>
						<p>Card Content</p>
					</CardContent>
					<CardFooter>
						<p>Card Footer</p>
					</CardFooter>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Current Plan</CardTitle>
						<CardDescription>Card Description</CardDescription>
						<CardAction>Card Action</CardAction>
					</CardHeader>
					<CardContent>
						<p>Card Content</p>
					</CardContent>
					<CardFooter>
						<p>Card Footer</p>
					</CardFooter>
				</Card>
			</div>
			<Suspense fallback={<InvoiceSkeleton />}>
				<InvoiceTable invoices={customerInvoices} />
			</Suspense>

			<Suspense fallback={<ChargesSkeleton />}>
				<ChargesTable />
			</Suspense>
		</main>
	);
}
