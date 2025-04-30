"use client";

import { JSX } from "react";
import HyperLink from "@/app/ui/HyperLink";
import { requestResetPassword } from "../actions";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { APIResponse, LoginFormProps } from "@/lib/definitions";

//Define our Form schema
const resetSchema = z.object({
	email: z.string().email({ message: "Please provide a valid email." }),
});

export default function LoginForm({ responseHandler, alertMessageHandler, alertTitleHandler }: LoginFormProps): JSX.Element {
	const form = useForm<z.infer<typeof resetSchema>>({
		resolver: zodResolver(resetSchema),
		defaultValues: {
			email: ""
		},
	});

	function onSubmit(values: z.infer<typeof resetSchema>) {
        requestResetPassword(values).then((data: APIResponse): void => {
					const alertTitle: string = data.status === 200 ? "Success" : "Error Resetting account Account";
					responseHandler(data.status);
					alertMessageHandler(data.message);
					alertTitleHandler(alertTitle);
				});
	}

	return (
		<div className="border-1 border-solid border-slate-800 rounded-md w-fit mx-auto px-10 py-10 shadow-md mb-40">
			<h2 className="font-bold text-xl pb-6">Reset Password</h2>
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
					
					<Button type="submit">Submit</Button>
				</form>
			</Form>
			<div className="flex flex-col gap-1 mt-4">
				<HyperLink
					hrefValue="/account/login"
					text="Back to Login"
				/>
				<HyperLink
					hrefValue="/account/create-account"
					text="Create Account"
				/>
			</div>
		</div>
	);
}
