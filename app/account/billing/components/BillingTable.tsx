"use client";


import { JSX, use } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { APIResult } from "@/lib/definitions";
import { Stripe } from "stripe";
import { getDate, getNextBillingDate, formatAmountForDisplay } from "@/utils/stripe-helpers";

type BillingTableProps = {
	invoices: Promise<APIResult<Stripe.Invoice[]>>
}

export default function BillingTable({ invoices }: BillingTableProps): JSX.Element {

	const invoiceData = use(invoices);
	console.log("Invoice Data HERE: ", invoiceData);


	return (
		<section className="mt-4">
			{!invoiceData.success && <p>No Data Found</p>}
			{invoiceData.success && (
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
						{invoiceData.data.map((data: Stripe.Invoice, y: number) => (
							<TableRow key={`row_num_${y}`}>
								<TableCell>{data.number}</TableCell>
								<TableCell>{data.lines.data[0].description }</TableCell>
								<TableCell>{`${getDate(data.period_start)} - ${getDate(data.period_end)}`}</TableCell>
								<TableCell>{ }</TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</section>
	);
}