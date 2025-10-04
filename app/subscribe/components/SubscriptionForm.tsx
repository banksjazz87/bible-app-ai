"use client";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { createCheckoutSession, subscribeAction } from "../../actions/stripe";
import type Stripe from "stripe";

const SubscribeFormSchema = z.object({
	firstName: z.string({ message: "Please provide a valid name." }),
	lastName: z.string({ message: "Please provide a valid last name." }),
	email: z.string().email({ message: "Please provide a valid email." }),
	subscription: z.string(),
});

export default function SubscriptionForm() {
	const searchParams = useSearchParams();
	const preSelectedSubscription: string | null = searchParams.get("option");

	const form = useForm<z.infer<typeof SubscribeFormSchema>>({
		resolver: zodResolver(SubscribeFormSchema),
		defaultValues: {
			firstName: "Bob",
			lastName: "Dole",
			email: "bobdole@yahoo.com",
			subscription: "free",
		},
	});

	function onSubmit(values: z.infer<typeof SubscribeFormSchema>) {
		alert("Form Submitted");
	}

	const formAction = async (data: FormData): Promise<void> => {
		const uiMode = data.get("uiMode") as Stripe.Checkout.SessionCreateParams.UiMode;
		const { client_secret, url } = await createCheckoutSession(data);

		console.log("needed url = ", url);
		// window.location.assign(url as string);
	};

	return (
		<main>
			<section>
				<h1 className="font-mono font-extrabold text-5xl text-center">Subscribe</h1>
				<p className="font-mono text-l uppercase font-bold text-center pt-4">Update Your Subscription Today</p>
			</section>

			<Form {...form}>
				<form
					action={formAction}
					className="space-y-5 w-100 mx-auto"
				>
					<input
						type="hidden"
						name="uiMode"
						value="embedded"
					/>
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
								<FormLabel>Subscription</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={preSelectedSubscription ? preSelectedSubscription : field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a subscription plan" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="free">FREE</SelectItem>
										<SelectItem value="basic">Basic</SelectItem>
										<SelectItem value="premiere">Premiere</SelectItem>
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
		</main>
	);
}

