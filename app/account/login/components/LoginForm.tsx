"use client";

import { JSX } from "react";
import HyperLink from "@/app/ui/HyperLink";
import { login } from "@/app/account/login/actions";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { APIResponse, LoginFormProps } from "@/lib/definitions";


//Define our Form schema
const loginFormSchema = z.object({
	email: z.string().email({ message: "Please provide a valid email." }),
	password: z.string().min(12, { message: "Password must be 12 or more characters." }).max(20, { message: "Password must be fewer than 20 characters" }),
});

export default function LoginForm({ responseHandler, alertMessageHandler, alertTitleHandler }: LoginFormProps): JSX.Element {

	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function onSubmit(values: z.infer<typeof loginFormSchema>) {
        login(values).then((data: APIResponse): void => {
			responseHandler(data.status);
			alertMessageHandler(data.message);
			alertTitleHandler("Error");
		});
	}

	return (
		<div className="border-1 border-solid border-slate-800 rounded-md w-fit mx-auto px-10 py-10 shadow-md mb-40">
			<h2 className="font-bold text-xl pb-6">Login Form</h2>
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
					<Button type="submit">Submit</Button>
				</form>
			</Form>
			<div className="flex flex-col gap-1 mt-4">
				<HyperLink
					hrefValue="/account/reset-password"
					text="Forgot Username or Password?"
				/>
				<HyperLink
					hrefValue="/account/create-account"
					text="Create Account"
				/>
			</div>
		</div>
	);
}
