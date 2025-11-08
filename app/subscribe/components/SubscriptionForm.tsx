"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, use } from "react";
import { createCheckoutSession, createCustomer, searchCustomer, getProducts } from "../../actions/stripe";
import { useRouter } from "next/navigation";
import { countries, states, provinces } from "@/lib/geoLocations";
import { LocationObject, ProductResponse } from "@/lib/definitions";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { CheckoutForm } from "@/components/stripe/CheckoutForm";
import UICheckoutForm from "@/components/stripe/UICheckoutForm";
import { getStripe } from "@/lib/stripe-client";
import { Stripe } from "stripe";



const SubscribeFormSchema = z.object({
	firstName: z.string({ message: "Please provide a valid name." }),
	lastName: z.string({ message: "Please provide a valid last name." }),
	streetAddress: z.string({ message: "Please provide a valid street address." }),
	city: z.string({ message: "Please provide a city name." }),
	country: z.string({ message: "Please select a country" }),
	state: z.string({ message: "Please select a valid state " }),
	zipCode: z.string({ message: "Please provide a zip codoe" }),
	email: z.string().email({ message: "Please provide a valid email." }),
	subscription: z.string(),
});

type SubscriptionFormProps = {
	products: Promise<ProductResponse>
}

export default function SubscriptionForm({ products }: SubscriptionFormProps) {
	const searchParams = useSearchParams();
	const preSelectedSubscription: string | null = searchParams.get("option");
	const router = useRouter();
	const allProducts = use(products);

	const form = useForm<z.infer<typeof SubscribeFormSchema>>({
		resolver: zodResolver(SubscribeFormSchema),
		defaultValues: {
			firstName: "Bob",
			lastName: "Dole",
			email: "bobdole@yahoo.com",
			streetAddress: "12 Mayburry Street",
			city: "Dubois",
			state: "PA",
			country: "US",
			zipCode: "15840",
			subscription: "free",
		},
	});

	const country = form.watch("country");
	const [regionOptions, setRegionOptions] = useState<LocationObject[]>([]);
	const [clientSecret, setClientSecret] = useState<string>("");
	const stripePromise = getStripe();

	useEffect((): void => {
		if (country === "US") {
			setRegionOptions(states);
			form.setValue("state", "PA");
		} else if (country === "CA") {
			setRegionOptions(provinces);
			form.setValue("state", "AB");
		} else {
			setRegionOptions([]);
			form.setValue("state", "");
		}
	}, [country, form]);

	useEffect((): void => console.log(clientSecret), [clientSecret]);


	// function onSubmit(values: z.infer<typeof SubscribeFormSchema>) {
	// 	console.log('Form submitted');
	// }

	// const formAction = async (data: z.infer<typeof SubscribeFormSchema>): Promise<void> => {
	// 	// const uiMode = data.get("uiMode") as Stripe.Checkout.SessionCreateParams.UiMode;
	// 	// const { client_secret, url } = await createCheckoutSession(data);
	// 	// console.log("needed url = ", url);

	// 	// if (url) {
	// 	// 	router.push(url);
	// 	// } else {
	// 	// 	alert("No return url provided");
	// 	// }

	// 	try {
	// 		const customer = await searchCustomer(data, "email");

	// 		//If the customer data came back and the data array is empty, create new customer.
	// 		if (customer && customer.data.length === 0) {
	// 			try {
	// 				const newCustomer = await createCustomer(data);
	// 				if (newCustomer.status === 200) {
	// 					try {
	// 						const customerID: string = newCustomer.customerId;
	// 						const checkoutSession = await createCheckoutSession(data, customerID);
	// 						console.log(checkoutSession);
	// 					} catch (e) {
	// 						console.error("The following error occurred in creating a checkout session ", e);
	// 					}
	// 				}
	// 			} catch (e: any) {
	// 				console.error("The following error occured while creating the customer ", e);
	// 			}

	// 			//This will be executed if the customer already exists
	// 		} else {
	// 			const customerID: string = customer?.data[0].id as string;
	// 			try {
	// 				const checkoutSession = await createCheckoutSession(data, customerID);
	// 				const clientSecret = checkoutSession.client_secret as string;
	// 				setClientSecret(clientSecret);
	// 				console.log(clientSecret);
	// 			} catch (e) {
	// 				console.error("The following error occurred in creating a checkout session ", e);
	// 			}
	// 		}
	// 	} catch (e: any) {
	// 		console.warn("The following error occurred while searching for the customer ", e);
	// 	}
	// };

	const locationOptions = (locations: LocationObject[]) => {
		return locations.map((x: LocationObject, y: number) => {
			return (
				<SelectItem
					key={`country_option_${y}`}
					value={x.code}
				>
					{x.name}
				</SelectItem>
			);
		});
	};

	const renderProducts = () => {
		if (allProducts.data && allProducts.data.length > 0) {
			const products: (Stripe.Price & { product: Stripe.Product})[] = allProducts.data;

			const displayProducts = products.map((x: Stripe.Price & { product: Stripe.Product }) => {
				return (
					<SelectItem key={x.product.name} value={x.id}>{x.product.name}</SelectItem>
				);
			});
			// Add a default option
			displayProducts.unshift(
				<SelectItem key="free"value="FREE">
					FREE
				</SelectItem>
			);
			return displayProducts;
		} else {
			return (
				<p>{ `The following error occurred in getting the products ${allProducts.errorMessage}`}</p>
			)
		}
	}

	return (
		<main>
			<section>
				<h1 className="font-mono font-extrabold text-5xl text-center">Subscribe</h1>
				<p className="font-mono text-l uppercase font-bold text-center pt-4">Update Your Subscription Today</p>
			</section>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(() => console.log("submitted"))}
					className="space-y-5 w-170 mx-auto"
				>
					<input
						type="hidden"
						name="lookup_key"
						value="price_1SDxaFRv9ZEy80pDmAiLFtd2"
					/>

					<div className="flex flex-col gap-2">
						<p className="font-mono text-sm font-bold text-left">Customer Name</p>
						<div className="grid grid-cols-2 gap-2">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Bob"
												type="text"
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
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Dole"
												type="text"
												{...field}
												className="border-slate-600 rounded-none"
											/>
										</FormControl>
										<FormMessage className="text-red-700" />
									</FormItem>
								)}
							/>
						</div>
					</div>

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

					<div className="flex flex-col gap-2">
						<p className="font-mono text-sm font-bold text-left">Address</p>

						<div className="grid grid-cols-2 gap-2">
							<div className="col-span-2">
								<FormField
									control={form.control}
									name="country"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Country</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={"US"}
												{...field}
											>
												<FormControl>
													<SelectTrigger className="border-slate-600 rounded-none">
														<SelectValue placeholder="Select a subscription plan" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>{locationOptions(countries)}</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="streetAddress"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Street Address</FormLabel>
										<FormControl>
											<Input
												placeholder="Street Address 1"
												type="text"
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
								name="city"
								render={({ field }) => (
									<FormItem>
										<FormLabel>City</FormLabel>
										<FormControl>
											<Input
												placeholder="City"
												type="text"
												{...field}
												className="border-slate-600 rounded-none"
											/>
										</FormControl>
										<FormMessage className="text-red-700" />
									</FormItem>
								)}
							/>

							{regionOptions.length == 0 ? (
								<FormField
									control={form.control}
									name="state"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Region</FormLabel>
											<FormControl>
												<Input
													placeholder="Region"
													type="text"
													{...field}
													className="border-slate-600 rounded-none"
												/>
											</FormControl>
											<FormMessage className="text-red-700" />
										</FormItem>
									)}
								/>
							) : (
								<FormField
									control={form.control}
									name="state"
									render={({ field }) => (
										<FormItem>
											<FormLabel>State</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={"PA"}
												{...field}
											>
												<FormControl>
													<SelectTrigger className="border-slate-600 rounded-none">
														<SelectValue placeholder="Select a subscription plan" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>{locationOptions(regionOptions)}</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
							)}

							<FormField
								control={form.control}
								name="zipCode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Zip Code</FormLabel>
										<FormControl>
											<Input
												placeholder="Zip Code"
												type="text"
												{...field}
												className="border-slate-600 rounded-none"
											/>
										</FormControl>
										<FormMessage className="text-red-700" />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<FormField
						control={form.control}
						name="subscription"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Subscription</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={preSelectedSubscription ? preSelectedSubscription : field.value}
									{...field}
								>
									<FormControl className="border-slate-600 rounded-none">
										<SelectTrigger>
											<SelectValue placeholder="Select a subscription plan" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{renderProducts()}
									</SelectContent>
								</Select>
								<FormDescription>Choose a subscription to meet your needs.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">Submit</Button>
				</form>
			</Form>

			{/* <CheckoutProvider
				stripe={stripePromise}
				options={{ clientSecret }}
			>
				<CheckoutForm />
				<UICheckoutForm />
			</CheckoutProvider> */}
		</main>
	);
}
