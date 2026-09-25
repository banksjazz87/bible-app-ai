"use client";

import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChargesNextResponse, ChargesResponse } from "@/lib/definitions";
import { Stripe } from "stripe";
import { getDate, getNextBillingDate, formatAmountForDisplay } from "@/utils/stripe-helpers";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { listCustomerCharges } from "@/app/actions/stripe";





// const fetchBillingDetailsAction = (count: number = 10)  => fetch(`/api/billing-details?count=${count}`);

async function fetchPastCharges(currentCount: number): Promise<ChargesResponse> {
    const fetchCharges = await fetch(`/api/billing-details?count=${currentCount}`);
    const charges = await fetchCharges.json();
    return charges;
}

export default function ChargesTable(): JSX.Element {
    const [count, setCount] = useState<number>(10);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [chargesData, setChargesData] = useState<[] | Stripe.Charge[]>([]);

    useEffect((): void => {
        fetchPastCharges(count).then((data) => {
            if (data.success && data?.billingDetails) {
                const billingData = data.billingDetails;
                if (billingData.success) setChargesData(billingData.data);
            } 
        });
    }, []);

	console.log("//CHARGES DATA FOLLOWS//");
	console.log(chargesData);

    function loadMoreHandler() {
        setIsPending(true);
        const newCount = count + 10;
        setCount(newCount);
        
        setTimeout(() => setIsPending(false), 500);
    }
   

	return (
		<section className="mt-4 pb-32">
			<h2 className="font-bold text-2xl">Billing Table</h2>
			{chargesData.length === 0 && <p>No Data Found</p>}
			{chargesData.length > 0 && (
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
			<Button onClick={loadMoreHandler}>{isPending ? 'Loading' : 'Load More'}</Button>
		</section>
	);
}
