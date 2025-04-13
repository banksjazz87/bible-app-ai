"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { login, signup } from "./actions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const supabase = createClient();
const loginFormSchema = z.object({
    email: z.string().email({ message: "Please provide a valid email." }),
    password: z.string().min(12, { message: "Password must be 12 or more characters." }).max(20, { message: "Password must be fewer than 20 characters." })
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
	return (
		<main>
			<h1>This will be the login page</h1>

			<form>
				<label htmlFor="email">Email:</label>
				<input
					id="email"
					name="email"
					type="email"
					required
				/>
				<label htmlFor="password">Password:</label>
				<input
					id="password"
					name="password"
					type="password"
					required
				/>
				<button formAction={login}>Log in</button>
                <button formAction={signup}>Sign up</button>
			</form>
		</main>
	);
}
