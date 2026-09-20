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
import { Field, FieldLabel } from "@/components/ui/field";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type ChargesTableProps = {
	charges: Promise<APIResult<Stripe.Charge[]>>;
};

export default function ChargesTable({ charges }: ChargesTableProps): JSX.Element {
	const chargesData = use(charges);
	console.log("//CHARGES DATA FOLLOWS//");
	console.log(chargesData);

	return (
		<section className="mt-4">
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

			<div className="flex items-center justify-between gap-4">
				<Pagination className="mx-0 w-auto">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious href="#" />
						</PaginationItem>
						<PaginationItem>
							<PaginationNext href="#" />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
				<Field
					orientation="horizontal"
					className="w-fit"
				>
					<FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
					<Select defaultValue="10" onValueChange={() => alert('pagination count changed')}>
						<SelectTrigger
							className="w-20"
							id="select-rows-per-page"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent align="start">
							<SelectGroup>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="25">25</SelectItem>
								<SelectItem value="50">50</SelectItem>
								<SelectItem value="100">100</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</Field>
			</div>
		</section>
	);
}
