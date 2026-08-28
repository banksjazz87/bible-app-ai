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
import { createCheckoutSession, createCustomer, searchCustomer, searchSubscriptionsByCustomerID, updateUserSubscription } from "../../actions/stripe";
import { ProductResponse } from "@/lib/definitions";
import CheckoutForm from "@/app/checkout/components/CheckoutForm";
import { useAppSelector } from "@/lib/store/hooks";
import Link from "next/link";
import HideShowEye from "@/components/ui/hide-show-eye";
import { login } from "@/app/account/login/actions";
import Alert from "@/app/ui/Alert";
import { redirect } from "next/navigation";

const SubscribeFormSchema = z.object({
	email: z.string().trim().email({ message: "Please provide a valid email." }),
	subscription: z.string(),
});

const UpdateSubscriptionFormSchema = z.object({
	email: z.string().email({ message: "Please provide a valid email." }),
	password: z.string(),
	subscription: z.string(),
});

type SubscriptionFormProps = {
	products: Promise<ProductResponse>;
};

export default function SubscriptionForm({ products }: SubscriptionFormProps) {
	const searchParams = useSearchParams();
	const [customerId, setCustomerId] = useState<string | null>(null);
	const [isNewCustomer, setIsNewCustomer] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [alertIsOpen, setAlertIsOpen] = useState<boolean>(false);

	const preSelectedSubscription: string = searchParams.get("option") ? (searchParams.get("option") as string) : "free";
	const allProducts = use(products);
	const userEmail = useAppSelector((state) => state.loggedInData.email);

	const form = useForm<z.infer<typeof SubscribeFormSchema>>({
		resolver: zodResolver(SubscribeFormSchema),
		defaultValues: {
			email: userEmail ? userEmail : "",
			subscription: preSelectedSubscription,
		},
	});

	const updateSubscriptionForm = useForm<z.infer<typeof UpdateSubscriptionFormSchema>>({
		resolver: zodResolver(UpdateSubscriptionFormSchema),
		defaultValues: {
			email: userEmail ? userEmail : "",
			password: "",
			subscription: preSelectedSubscription,
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
							setIsNewCustomer(true);
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

	const updateSubscriptionFormAction = async (data: z.infer<typeof UpdateSubscriptionFormSchema>): Promise<void> => {
		//Check for valid login credentials before processing the upgrade
		const { status, message } = await login(data);

		if (status === 404) {
			alert(message);
			return;
		}

		try {
			const customer = await searchCustomer(data, "email");
			//If the customer data came back and the data array is empty, create new customer.
			if (customer?.data.length === 0) {
				try {
					const newCustomer = await createCustomer(data);
					console.log("Creating new Customer");
					if (newCustomer.status === 200) {
						try {
							const customerID: string = newCustomer.customerId;
							setCustomerId(customerID);
							setIsNewCustomer(true);
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

				try {
					const customerSubscription = await searchSubscriptionsByCustomerID(customerID);
					const subscriptionData = "data" in customerSubscription ? customerSubscription.data : null;
					const customerError = "message" in customerSubscription ? customerSubscription.message : null;

					if (customerError) {
						throw new Error("The customer subscription was unable to be found.");
					}

					if (subscriptionData) {
						const subscriptionID: string = subscriptionData[0].id;
						const currentItemID: string = subscriptionData[0].items.data[0].id;
						const newSubscriptionPriceID: string = preSelectedSubscription;

						try {
							const { status, message } = await updateUserSubscription(subscriptionID, currentItemID, newSubscriptionPriceID);

							if (status !== 200) {
								alert(`The following error occurred in upgrading the user: ${message}`);
								return;
							}

							setAlertIsOpen(true);
						} catch (e) {
							console.error(`The folllowing error occurred in updating the subscription ${e instanceof Error && e.message}`);
						}
					}
				} catch (e) {
					console.error(`Error in accessing the user's subscription details: ${e instanceof Error && e.message}`);
				}
			}
		} catch (e: unknown) {
			console.warn("The following error occurred while searching for the customer ", e);
		}
	};

	const upgradeConfirmHandler = async (): Promise<void> => {
		const data = await fetch("/account/logout");
		const finalData = await data.json();

		if (finalData.status === 200) {
			redirect("/account/login");
		} else {
			console.error("An error occurred in logging out the user");
		}
	};

	const setUserEmail = useEffectEvent((): void => {
		if (userEmail && userEmail.length > 0) {
			form.setValue("email", userEmail);
			formAction(form.getValues());
		}
	});

	useEffect(() => {
		setUserEmail();
	}, [userEmail]);

	const fetchClientSecret = async (): Promise<string> => {
		console.log("Fetching client is running");
		if (customerId) {
			const data = form.getValues();
			const checkoutSession = await createCheckoutSession(data, customerId);
			console.log("this is the checkout session ", checkoutSession);
			return checkoutSession.client_secret as string;
		} else {
			return "";
		}
	};

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
			{userEmail?.length === 0 && (
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

			{/** NEW CUSTOMER CREATING A NEW SUBSCRIPTION */}
			{customerId && preSelectedSubscription !== "free" && isNewCustomer && <CheckoutForm fetchClientSecret={fetchClientSecret} />}

			{/** RETURNING CUSTOMER UPDATE USER SUBSCRIPTION */}
			{preSelectedSubscription !== "free" && !isNewCustomer && (
				<>
					<Alert
						isOpen={alertIsOpen}
						openHandler={() => setAlertIsOpen(!alertIsOpen)}
						closeHandler={() => setAlertIsOpen(false)}
						title="Apply Upgrade"
						description="Your upgrade is ready to be applied. Select OK to continue. You’ll be logged out and redirected to the login page. After you log back in, your upgraded account will be ready to use."
						confirmHandler={() => upgradeConfirmHandler()}
						cancelHandler={() => setAlertIsOpen(false)}
						confirmText="Ok"
						cancelText="Cancel"
					/>

					<section className="mt-4">
						<p className="text-center">To continue with your upgrade, please confirm your account by entering your email address and password.</p>
						<div className="border border-solid border-slate-800 rounded-md w-fit mx-auto px-10 py-10 shadow-md mb-40 mt-4">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(() => updateSubscriptionFormAction(updateSubscriptionForm.getValues()))}
									className="space-y-5 w-100 mx-auto"
								>
									<FormField
										control={updateSubscriptionForm.control}
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
										control={updateSubscriptionForm.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<div className="relative">
														<Input
															placeholder="Password"
															type={showPassword ? "text" : "password"}
															{...field}
															className="border-slate-600 rounded-none"
														/>
														<HideShowEye
															showPassword={showPassword}
															toggleShowPassword={(): void => setShowPassword(!showPassword)}
														/>
													</div>
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
						</div>
					</section>
				</>
			)}
		</main>
	);
}
