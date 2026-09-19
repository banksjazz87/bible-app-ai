"use client";

import { JSX, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { APIResult } from "@/lib/definitions";
import { Stripe } from "stripe";
import { getDate, formatAmountForDisplay } from "@/utils/stripe-helpers";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type BillingTableProps = {
	invoices: Promise<APIResult<Stripe.Invoice[]>>;
};

export default function InvoiceTable({ invoices }: BillingTableProps): JSX.Element {
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
							<TableHead className="font-bold">Billing Period</TableHead>
							<TableHead className="font-bold">Amount</TableHead>
							<TableHead className="font-bold">Status</TableHead>	
							<TableHead className="font-bold pl-8">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invoiceData.data.map((data: Stripe.Invoice, y: number) => (
							<TableRow key={`row_num_${y}`}>
								<TableCell>{data.number}</TableCell>
								<TableCell>{`${getDate(data.period_start)} - ${getDate(data.period_end)}`}</TableCell>
								<TableCell>{formatAmountForDisplay(data.amount_paid, "USD")}</TableCell>
								<TableCell className="capitalize">{data.status}</TableCell>
								<TableCell>
									{data.invoice_pdf ? (
										<Button variant="secondary">
											<Link
												className="flex align-middle gap-2"
												target="_blank"
												rel="noopener"
												href={data.invoice_pdf}
											>
												<FontAwesomeIcon className="self-center" icon={faDownload}></FontAwesomeIcon>
												Invoice
											</Link>
										</Button>
									) : (
										"-"
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</section>
	);
}
