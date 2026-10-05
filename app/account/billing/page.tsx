"use server";

// import { getCurrentUserSubscriptionDetails } from "@/app/actions/stripe";
import { Suspense, use } from "react";
import { InvoiceSkeleton, ChargesSkeleton } from "./components/Skeletons";
import { getCustomerInvoices, listCustomerCharges } from "@/app/actions/stripe";
import InvoiceTable from "./components/InvoiceTable";
import ChargesTable from "./components/ChargesTable";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { faCalendar, faCheck, faInfo, faCreditCard, faReceipt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCurrentUserSubscriptionDetails, getSubscriptionProductDetails } from "@/app/actions/stripe";

import SmallInfoCard from "./components/SmallInfoCard";

export default async function SubscriptionPage() {
	const customerInvoices = getCustomerInvoices();
	// const customerCharges = listCustomerCharges();
	const userSubscriptions = await getCurrentUserSubscriptionDetails();
	let subscriptionInfo;
	
	if (userSubscriptions.status === 200 && userSubscriptions.data) {
		const data = userSubscriptions.data[0];
		subscriptionInfo = await getSubscriptionProductDetails(data.metadata.productID);
	}

	if (subscriptionInfo && !subscriptionInfo.success) {
		console.error("The following error occurred, ", subscriptionInfo.message);
	}

	if (subscriptionInfo && subscriptionInfo.success) {
		console.log("Subscription data here::::: ", subscriptionInfo.data);
	} 

	return (
		<main className="flex flex-col gap-6">
			<section className="mt-16 flex flex-col gap-2">
				<small>Billing</small>
				<h2 className="font-bold text-2xl">Billing Details</h2>
				<p className="text-gray-600 text-md">Manage your subscription, payment method, and view your invoices.</p>
			</section>
			<section className="grid grid-cols-3 gap-6">
				<SmallInfoCard
					header="Current Plan"
					badge={
						<Badge
							variant="outline"
							className="bg-green-200"
						>
							Active
						</Badge>
					}
					body="Pro Plan"
					footer="$5.00"
				/>
				<SmallInfoCard
					header="Next Biling Date"
					badge={
						<FontAwesomeIcon
							className="text-gray-800 p-1  bg-gray-100 rounded-sm"
							icon={faCalendar}
						/>
					}
					body="DATE HERE"
					footer="Billed Monthly"
				/>
				<SmallInfoCard
					header="Monthly Cost"
					badge={
						<FontAwesomeIcon
							className="text-gray-800 p-1  bg-gray-100 rounded-sm"
							icon={faCalendar}
						/>
					}
					body="$COST"
					footer="Next invoice: INVOICE DATE HERE"
				/>
			</section>

			{/** SUBSCRIPTION 2 Card Grid */}
			<section className="grid grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-bold">Subscription</CardTitle>
						<p className="text-sm flex self-center">Your current plan and usage.</p>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-6">
								<FontAwesomeIcon
									className="text-blue-600 p-4 text-3xl bg-blue-200 rounded-sm"
									icon={faReceipt}
								/>
								<div>
									<h3 className="text-lg font-bold">Pro Plan</h3>
									<p className="text-sm">$/month</p>
									<p className="text-sm">Features summary here</p>
								</div>
							</div>
							<Button variant="outline">Change plan</Button>
						</div>
						<hr></hr>
						<div>
							<h4 className="text-md font-bold">Plan features:</h4>
							<div className="flex flex-row gap-2 items-center">
								<FontAwesomeIcon
									icon={faCheck}
									className="text-green-600"
								/>
								<p>Feature 1</p>
							</div>
							<div className="flex flex-row gap-2 items-center">
								<FontAwesomeIcon
									icon={faCheck}
									className="text-green-600"
								/>
								<p>Feature 2</p>
							</div>
							<div className="flex flex-row gap-2 items-center">
								<FontAwesomeIcon
									icon={faCheck}
									className="text-green-600"
								/>
								<p>Feature 3</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-bold">Payment Method</CardTitle>
						<p className="text-sm flex self-center">Your default payment method.</p>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-6">
								<FontAwesomeIcon
									className="text-blue-600 p-4 text-3xl bg-blue-200 rounded-sm"
									icon={faCreditCard}
								/>
								<div>
									<h3 className="text-lg font-bold">Pro Plan</h3>
									<p className="text-sm">$/month</p>
								</div>
							</div>
							<Button variant="outline">Change plan</Button>
						</div>
					</CardContent>
					<CardFooter className="flex-col gap-6">
						<Button className="w-full py-6" variant="outline">
							<FontAwesomeIcon
								className="text-gray-600"
								icon={faPlus}
							/>
							Add payment method
						</Button>
						<Alert>
							<FontAwesomeIcon
								className="p-1 bg-blue-200 text-blue-600 rounded-full text-[12px]"
								icon={faInfo}
							/>
							<AlertTitle>Your payment method will be charged</AlertTitle>
							<AlertDescription>$ on Date</AlertDescription>
						</Alert>
					</CardFooter>
				</Card>
			</section>
			<Suspense fallback={<InvoiceSkeleton />}>
				<InvoiceTable invoices={customerInvoices} />
			</Suspense>

			<Suspense fallback={<ChargesSkeleton />}>
				<ChargesTable />
			</Suspense>
		</main>
	);
}
