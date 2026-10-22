"use server";

// import { getCurrentUserSubscriptionDetails } from "@/app/actions/stripe";
import { Suspense } from "react";
import Link from "next/link";
import { InvoiceSkeleton, ChargesSkeleton } from "./components/Skeletons";
import { getCustomerInvoices } from "@/app/actions/stripe";
import Stripe from "stripe";
import { APIResult } from "@/lib/definitions";
import InvoiceTable from "./components/InvoiceTable";
import ChargesTable from "./components/ChargesTable";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { faCalendar, faCheck, faInfo, faCreditCard, faReceipt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCurrentUserSubscriptionDetails, getSubscriptionProductDetails, listPaymentMethods, getCustomerDetails, getPaymentMethod } from "@/app/actions/stripe";
import { formatAmountForDisplay } from "@/utils/stripe-helpers";
import SmallInfoCard from "./components/SmallInfoCard";
import PaymentMethods from "./components/PaymentMethods";
import PaymentMethodsList from "./components/PaymentMethodList";
import PaymentCard from "./components/PaymentCard";

/**
 *
 * @returns {Promise<APIResult<Stripe.Product>>}
 * @description Used to pull in the user's current billing details.
 */
async function getProductData(): Promise<APIResult<Stripe.Product & { default_price: Stripe.Price }>> {
	const userSubscriptions = await getCurrentUserSubscriptionDetails();

	console.log("SUBSCRIPTION DETAILS: ", userSubscriptions);

	//Verify the user has subscription details
	if (userSubscriptions.status === 200 && userSubscriptions.data) {
		const data = userSubscriptions.data[0];
		const subscriptionInfo = await getSubscriptionProductDetails(data.metadata.productID);
		return subscriptionInfo;
	} else {
		return {
			status: 400,
			message: `The following error occurred within retrieving the userSubscriptions, ${userSubscriptions.message}`,
			success: false,
		};
	}
}

function getNextBillingPaymentDate(endDate: number | null): string {
	if (!endDate) {
		return "";
	}

	const nextBillingDate = new Date(endDate * 1000);
	return nextBillingDate.toLocaleDateString();
}

async function getDefaultPayment(paymentID: string) {
	const defaultPayment = await getPaymentMethod(paymentID);
	return defaultPayment;
}

export default async function SubscriptionPage() {
	const customerInvoices = getCustomerInvoices();
	// const customerCharges = listCustomerCharges();
	const invoices = await getCustomerInvoices();
	const productData = await getProductData();
	const userSubscriptions = await getCurrentUserSubscriptionDetails();
	const paymentMethods = listPaymentMethods();

	console.log("Payment methods follow here: ", paymentMethods);

	console.log("Customer SUBSCRIPTION DETAILS: ", userSubscriptions);

	let userPlan: string = "";
	let billingAmount: string = "";
	let billingInterval: string = "";
	let isActive: boolean = false;
	let nextBillingDate: string = "";
	let marketingFeatures = null;
	let defaultPayment: APIResult<Stripe.PaymentMethod> | null = null;
	const currentInvoice = invoices.success ? invoices.data[0].hosted_invoice_url : null;

	console.log("PRODUCT DATA FOLLOWS HERE ", productData);

	if (productData.success) {
		userPlan = productData.data.name;
		billingAmount = formatAmountForDisplay(productData.data.default_price.unit_amount!, "USD");
		marketingFeatures = productData.data.marketing_features;
	}

	if (userSubscriptions.status === 200 && userSubscriptions.data) {
		const planDetails = userSubscriptions.data[0].items.data[0].plan;
		nextBillingDate = getNextBillingPaymentDate(userSubscriptions.data[0].items.data[0].current_period_end);
		billingInterval = planDetails.interval;
		isActive = planDetails.active;
		defaultPayment = await getDefaultPayment(typeof userSubscriptions.data[0].default_payment_method === 'string' ? userSubscriptions.data[0].default_payment_method : '');

		console.log("DEFAULT PAYMENT METHOD: ", defaultPayment);
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
							className={isActive ? "bg-green-200" : "text-white bg-red-500"}
						>
							{isActive ? "Active" : "Expired"}
						</Badge>
					}
					body={userPlan}
					footer={billingAmount}
				/>
				<SmallInfoCard
					header="Next Biling Date"
					badge={
						<FontAwesomeIcon
							className="text-gray-800 p-1  bg-gray-100 rounded-sm"
							icon={faCalendar}
						/>
					}
					body={nextBillingDate}
					footer={`Billed ${billingInterval}ly`}
				/>
				<SmallInfoCard
					header="Monthly Cost"
					badge={
						<FontAwesomeIcon
							className="text-gray-800 p-1  bg-gray-100 rounded-sm"
							icon={faCalendar}
						/>
					}
					body={billingAmount}
					footer={
						currentInvoice ? (
							<Button variant="secondary">
								<Link
									href={currentInvoice}
									target="_blank"
								>
									Most Recent Invoice
								</Link>
							</Button>
						) : (
							""
						)
					}
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
									<h3 className="text-lg font-bold">{userPlan}</h3>
									<p className="text-sm">{`${billingAmount}/${billingInterval}`}</p>
									<p className="text-sm">Features summary here</p>
								</div>
							</div>
							<Button variant="outline">
								<Link href="/pricing">Change plan</Link>
							</Button>
						</div>
						<hr></hr>
						<div>
							<h4 className="text-md font-bold">Plan features:</h4>
							{marketingFeatures &&
								marketingFeatures.map((x: Stripe.Product.MarketingFeature, y: number) => {
									return (
										<div
											key={`feature_item_${y}`}
											className="flex flex-row gap-2 items-center"
										>
											<FontAwesomeIcon
												icon={faCheck}
												className="text-green-600"
											/>
											<p>{x.name}</p>
										</div>
									);
								})}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-bold">Payment Method</CardTitle>
						<p className="text-sm flex self-center">Your default payment method.</p>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<PaymentCard paymentMethod={defaultPayment} />
					</CardContent>
					<CardFooter className="flex-col gap-6">
						<Button
							className="w-full py-6"
							variant="outline"
						>
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
							<AlertTitle>Your default payment method will be charged.</AlertTitle>
							<AlertDescription>{`${billingAmount} on ${nextBillingDate}`}</AlertDescription>
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
