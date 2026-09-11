"use client";


import { JSX } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export default function BillingTable(): JSX.Element {
    return (
		<section className="mt-4">
			{<p>No Data found</p>}
				<Table>
					<TableCaption>A list of your subscriptions.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="font-bold">Subscription/Plan</TableHead>
							<TableHead className="font-bold">Billing Cycle</TableHead>
							<TableHead className="font-bold">Amount Due</TableHead>
							<TableHead className="font-bold">Start Date</TableHead>
							<TableHead className="font-bold">Renewal Date</TableHead>
							<TableHead className="font-bold">Canceled Date</TableHead>
							<TableHead className="font-bold">End Date</TableHead>
							<TableHead className="center"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
                    {/* {userData?.data.map((data: Stripe.Subscription, y: number) => (
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