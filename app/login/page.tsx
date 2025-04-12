"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { login, signup } from "./actions";

const supabase = createClient();

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
