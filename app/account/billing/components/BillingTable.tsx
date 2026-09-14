"use client";


import { JSX, use } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { APIResult } from "@/lib/definitions";
import { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";

type BillingTableProps = {
	invoices: Promise<APIResult<Stripe.Invoice[]>>
}

export default function BillingTable({ invoices }: BillingTableProps): JSX.Element {

	const invoiceData = use(invoices);
	
	if (invoiceData.success) {
		console.log(invoiceData.data);
	}

	return (
		<section className="mt-4">
			{<p>No Data found</p>}
			<Table>
				<TableCaption>A list of your most recent transactions.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="font-bold">Invoice #</TableHead>
						<TableHead className="font-bold">Description</TableHead>
						<TableHead className="font-bold">Billing Period</TableHead>
						<TableHead className="font-bold">Amount</TableHead>
						<TableHead className="font-bold">Status</TableHead>
						<TableHead className="font-bold">Invoice Date</TableHead>
						<TableHead className="font-bold">Actions</TableHead>
						<TableHead className="center"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{/* {invoiceData.status === 200 &&
						invoiceData((data: Stripe.Subscription, y: number) => (
							<TableRow key={`thread_num_${y}`}>
								<TableCell>{StripeProducts.get(data.items.data[0].plan.product as string)}</TableCell>
								<TableCell className="capitalize">{`${data.items.data[0].plan.interval}ly`}</TableCell>
								<TableCell>{data.items.data[0].plan.amount ? `$${data.items.data[0].plan.amount / 100}` : "$0.00"}</TableCell>
								<TableCell>{getDate(data.start_date)}</TableCell>
								<TableCell>{getNextBillingDate(data.billing_cycle_anchor)}</TableCell>
								<TableCell>{data.canceled_at ? getDate(data.canceled_at) : "-"}</TableCell>
								<TableCell>{data.cancel_at ? getDate(data.cancel_at) : "-"}</TableCell>
								<TableCell className="capitalize"></TableCell>
								<TableCell> 
							</TableRow> */}
				</TableBody>
			</Table>
		</section>
	);
}