"use client";

import { JSX, useEffect, useState, useEffectEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChargesResponse } from "@/lib/definitions";
import { ChargesSkeleton, ChargesPartialSkeleton } from "./Skeletons";
import { Stripe } from "stripe";
import { getDate, formatAmountForDisplay } from "@/utils/stripe-helpers";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "@/components/ui/spinner";

async function fetchPastCharges(currentCount: number): Promise<ChargesResponse> {
	const fetchCharges = await fetch(`/api/billing-details?count=${currentCount}`);
	const charges = await fetchCharges.json();
	return charges;
}

export default function ChargesTable(): JSX.Element {
	const [count, setCount] = useState<number>(10);
	const [isPending, setIsPending] = useState<boolean>(false);
	const [chargesData, setChargesData] = useState<null | Stripe.Charge[]>(null);
	const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

	const updatePendingState = useEffectEvent((): void => setIsPending(!isPending));
	const updateLoadStatus = useEffectEvent((): void => setIsFirstLoad(false));
	const setInitCount = useEffectEvent((value: number): void => setCount(value));

	useEffect(() => setInitCount(10), []);

	useEffect((): void => {
		updatePendingState();
		fetchPastCharges(count)
			.then((data) => {
				if (data.success && data?.billingDetails) {
                    const billingData = data.billingDetails;
                    console.log("FULL BILLING DETAILS FOLLOW");
                    console.log(billingData);
					if (billingData.success && billingData.data.data) {
						//If the charges data is not null, we will append the new data.  Otherwise
                        setChargesData(chargesData ? [...chargesData, ...billingData.data.data] : billingData.data.data);
					}
				}
			})
			.finally(() => {
				updatePendingState();
				updateLoadStatus();
			});
	}, [count]);

	console.log("//CHARGES DATA FOLLOWS//");
	console.log(chargesData);

	function loadMoreHandler() {
		const newCount = count + 10;
		setCount(newCount);
	}

	return (
		<section className="mt-4 pb-32">
			<h2 className="font-bold text-2xl">Billing Table</h2>
			{chargesData && chargesData.length > 0 && !isFirstLoad && <p>No Data Found</p>}
			{chargesData && isFirstLoad && <ChargesSkeleton />}
			{chargesData && chargesData.length > 0 && (
				<Table className="mt-4">
					{!isPending && <TableCaption>A list of your most recent transactions.</TableCaption>}
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
						{chargesData.map((data: Stripe.Charge, y: number) => (
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
			{isPending && chargesData && chargesData.length > 0 && <ChargesPartialSkeleton />}
			<Button
				onClick={loadMoreHandler}
				disabled={isPending}
			>
				Load More{isPending && <Spinner data-icon="inline-end" />}
			</Button>
		</section>
	);
}
