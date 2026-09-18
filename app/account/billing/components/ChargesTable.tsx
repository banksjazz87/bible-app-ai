"use client";

import { JSX, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { APIResult } from "@/lib/definitions";
import { Stripe } from "stripe";
import { getDate, getNextBillingDate, formatAmountForDisplay } from "@/utils/stripe-helpers";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ChargesTableProps = {
	charges: Promise<APIResult<Stripe.Charge[]>>;
};

export default function ChargesTable({charges}: ChargesTableProps): JSX.Element {
    const chargesData = use(charges);
    console.log("//CHARGES DATA FOLLOWS//")
    console.log(chargesData);

    return (
			<section className="mt-4">
				{!chargesData.success && <p>No Data Found</p>}
				{chargesData.success && (
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
							</TableRow>
						</TableHeader>
						<TableBody>
							{/* {chargesData.data.map((data: Stripe.Charge, y: number) => (
								<TableRow key={`row_num_${y}`}>
									<TableCell>{data.number}</TableCell>
									<TableCell>{data.lines.data[0].description}</TableCell>
									<TableCell>{`${getDate(data.period_start)} - ${getDate(data.period_end)}`}</TableCell>
									<TableCell>{formatAmountForDisplay(data.amount_paid, "USD")}</TableCell>
									<TableCell className="capitalize">{data.status}</TableCell>
									<TableCell>{data.status_transitions.finalized_at ? getDate(data.status_transitions.finalized_at) : "-"}</TableCell>
									<TableCell>
										{data.invoice_pdf ? (
											<Button variant="secondary">
												<Link
													target="_blank"
													rel="noopener"
													href={data.invoice_pdf}
												>
													<FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
													Invoice
												</Link>
											</Button>
										) : (
											"-"
										)}

										<Button
											variant="secondary"
											onClick={() => receiptRequestHandler(data.created)}
										>
											Receipt
										</Button>
									</TableCell>
								</TableRow>
							))} */}
						</TableBody>
					</Table>
				)}
			</section>
		);
}