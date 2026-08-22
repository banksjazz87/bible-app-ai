"use client";

import { useEffect, useEffectEvent } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useState, use } from "react";
import { createCheckoutSession, createCustomer, searchCustomer } from "../../actions/stripe";
import { ProductResponse, SubscriptionResponse } from "@/lib/definitions";
import CheckoutForm from "@/app/checkout/components/CheckoutForm";
import { useAppSelector } from "@/lib/store/hooks";
import Link from "next/link";



const SubscribeFormSchema = z.object({
	email: z.string().email({ message: "Please provide a valid email." }),
	subscription: z.string(),
});

type SubscriptionFormProps = {
	products: Promise<ProductResponse>;
	subscriptions: Promise<SubscriptionResponse>
};



export default function SubscriptionForm({ products, subscriptions }: SubscriptionFormProps) {
	const searchParams = useSearchParams();
	const preSelectedSubscription: string = searchParams.get("option") ? searchParams.get("option") as string : "free";
	const allProducts = use(products);
	const allSubscriptions = use(subscriptions);
	const [customerId, setCustomerId] = useState<string | null>(null);
	const userEmail = useAppSelector((state) => state.loggedInData.email);

	

	const form = useForm<z.infer<typeof SubscribeFormSchema>>({
		resolver: zodResolver(SubscribeFormSchema),
		defaultValues: {
			email: userEmail ? userEmail : "",
			subscription: preSelectedSubscription
		},
	});

	const formAction = async (data: z.infer<typeof SubscribeFormSchema>): Promise<void> => {
		try {
			const customer = await searchCustomer(data, "email");
			//If the customer data came back and the data array is empty, create new customer.
			if (customer?.data.length === 0) {
				try {
					const newCustomer = await createCustomer(data);
					if (newCustomer.status === 200) {
						try {
							const customerID: string = newCustomer.customerId;
							setCustomerId(customerID);
						} catch (e: unknown) {
							console.error("The following error occurred in creating a checkout session ", e);
						}
					}
				} catch (e: unknown) {
					console.error("The following error occured while creating the customer ", e);
				}

				//This will be executed if the customer already exists
			} else {
				const customerID: string = customer?.data[0].id as string;
				setCustomerId(customerID);
			}
		} catch (e: unknown) {
			console.warn("The following error occurred while searching for the customer ", e);
		}
	};

	
	const setUserEmail = useEffectEvent((): void => {
		if(userEmail && userEmail.length > 0) {
			form.setValue("email", userEmail);
			formAction(form.getValues());
		}
	})

	useEffect(() => console.log('All products here, ', allProducts), [allProducts]);
	useEffect(() => console.log('All subscriptions here, ', allSubscriptions), [allSubscriptions]);

	useEffect(() => {
		setUserEmail();
	}, [userEmail]);

	
	const fetchClientSecret = async (): Promise<string> => {
		console.log('Fetching client is running');
		if (customerId) {
			const data = form.getValues();
			const checkoutSession = await createCheckoutSession(data, customerId);
			console.log('this is the checkout session ', checkoutSession);
			return checkoutSession.client_secret as string;
		} else {
			return "";
		}
	}

	return (
		<main>
			<section className="pt-10">
				<h1 className="font-mono font-extrabold text-5xl text-center">Subscribe</h1>
				<p className="font-mono text-l uppercase font-bold text-center pt-4">Update Your Subscription Today</p>
			</section>

			{/* if the user selects the free tier they'll have the option to either select a better plan or go back to the bible page.*/}
			{preSelectedSubscription === "free" && (
				<section className="flex-col align-middle justify-center pt-4">
					<p className="font-mono text-center pt-4">Enjoy your free subscription, if you ever want to upgrade feel free to do so by visiting our pricing page. </p>
					<div className="flex gap-4 justify-center pt-10">
						<Link href="/pricing">
							<Button>View Other Plans</Button>
						</Link>
						<Link href="/bible">
							<Button>Proceed to the Bible</Button>
						</Link>
					</div>
				</section>
			)}
			{userEmail && userEmail.length === 0 && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(() => formAction(form.getValues()))}
						className="space-y-5 w-170 mx-auto"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="Email"
											type="email"
											{...field}
											className="border-slate-600 rounded-none"
										/>
									</FormControl>
									<FormMessage className="text-red-700" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="subscription"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="hidden"
											{...field}
											value={preSelectedSubscription}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<Button type="submit">Submit</Button>
					</form>
				</Form>
			)}

			{customerId && preSelectedSubscription !== "free" && <CheckoutForm fetchClientSecret={fetchClientSecret} />}
		</main>
	);
}
