"use client";

import { JSX, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { APIResult } from "@/lib/definitions";
import { Stripe } from "stripe";
import { getDate, getNextBillingDate, formatAmountForDisplay } from "@/utils/stripe-helpers";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



type ChargesTableProps = {
	charges: Promise<APIResult<Stripe.Charge[]>>;
};

export default function ChargesTable({ charges }: ChargesTableProps): JSX.Element {
	const chargesData = use(charges);
	console.log("//CHARGES DATA FOLLOWS//");
	console.log(chargesData);

	return (
		<section className="mt-4 pb-32">
			<h2 className="font-bold text-2xl">Billing Table</h2>
			{!chargesData.success && <p>No Data Found</p>}
			{chargesData.success && (
				<Table className="mt-4">
					<TableCaption>A list of your most recent transactions.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="font-bold">Date</TableHead>
							<TableHead className="font-bold">Description</TableHead>
							<TableHead className="font-bold">Charge/Refund</TableHead>
							<TableHead className="font-bold">Status</TableHead>
							<TableHead className="font-bold">Amount</TableHead>
							<TableHead className="font-bold pl-10">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{chargesData.data.map((data: Stripe.Charge, y: number) => (
							<TableRow key={`row_num_${y}`}>
								<TableCell>{getDate(data.created)}</TableCell>
								<TableCell>{data.description}</TableCell>
								<TableCell className="capitalize">{data.refunded ? "refund" : "charge"}</TableCell>
								<TableCell className="capitalize">{`${data.status}`}</TableCell>
								<TableCell>{formatAmountForDisplay(data.amount, "USD")}</TableCell>
								<TableCell>
									{data.receipt_url ? (
										<Button variant="secondary">
											<Link
												className="flex gap-2"
												target="_blank"
												rel="noopener"
												href={data.receipt_url}
											>
												<FontAwesomeIcon
													icon={faReceipt}
													className="self-center"
												></FontAwesomeIcon>
												Receipt
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
            <Button>Load More</Button>

		
		</section>
	);
}
