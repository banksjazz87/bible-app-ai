"use client";

import { JSX } from "react";
import Link from "next/link";
import HyperLink from "@/app/ui/HyperLink";
import { signup } from "@/app/account/create-account/actions";
import { useForm, SubmitHandler } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormProps, APIResponse } from "@/lib/definitions";

const createAccountFormSchema = z
	.object({
		email: z.string().email({ message: "Please provide a valid email." }),
		password: z.string().min(12, { message: "Password must be 12 or more characters." }).max(20, { message: "Password must be fewer than 20 characters" }),
		verifiedPassword: z.string(),
	})
	.refine((data) => data.password === data.verifiedPassword, {
		message: "The password and the verified password do not match",
		path: ["verifiedPassword"],
	});

export default function CreateAccountForm({responseHandler, alertMessageHandler, alertTitleHandler}: LoginFormProps): JSX.Element {
	const form = useForm<z.infer<typeof createAccountFormSchema>>({
		resolver: zodResolver(createAccountFormSchema),
		defaultValues: {
			email: "",
			password: "",
			verifiedPassword: "",
		},
	});

	function onSubmit(values: z.infer<typeof createAccountFormSchema>) {
		signup(values).then((data: APIResponse): void => {
			responseHandler(data.status);
			const alertTitle: string = data.status === 200 ? "Success" : "Error Creating Account";
			alertTitleHandler(alertTitle);
			alertMessageHandler(data.message);
		});
	}

	return (
		<div className="border-1 border-solid border-slate-800 rounded-md w-fit mx-auto px-10 py-10 shadow-md mb-40">
			<h2 className="font-bold text-xl pb-6 capitalize">Create new account</h2>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-5 w-100 mx-auto"
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
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										placeholder="Password"
										type="password"
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
						name="verifiedPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Validate Password</FormLabel>
								<FormControl>
									<Input
										placeholder="Password"
										type="password"
										{...field}
										className="border-slate-600 rounded-none"
									/>
								</FormControl>
								<FormMessage className="text-red-700" />
							</FormItem>
						)}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
			<div className="flex flex-col gap-1 mt-4">
				<HyperLink
					hrefValue="/account/reset-password"
					text="Forgot Username or Password?"
				/>
			</div>
		</div>
	);
}
