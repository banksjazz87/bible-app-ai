"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { login, signup } from "./actions";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';



const supabase = createClient();

const loginFormSchema = z.object({
	email: z.string().email({ message: "Please provide a valid email." }),
	password: z.string().min(12, { message: "Password must be 12 or more characters." }).max(20, { message: "Password must be fewer than 20 characters" }),
});


export default function Login() {
    const [notes, setNotes] = useState([]);

	useEffect(() => {
		getNotes();
	}, []);

	async function getNotes() {
		const data = await supabase.from("notes").select();

		console.log("HERE ", data);
    }

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    function onSubmit(values: z.infer<typeof loginFormSchema>) {
        console.log(values);
        login(values).then((data) => console.log("Res here ", data));
    }
    

	return (
		<main className="flex flex-col justify-center align-middle min-h-dvh mx-auto">
			<div className="border-1 border-solid border-slate-800 rounded-md w-fit mx-auto px-10 py-10 shadow-md mb-40">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-100 mx-auto"
				>
					<h2 className="font-bold text-xl">Login Form</h2>
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
			</div>
		</main>
	);
}
