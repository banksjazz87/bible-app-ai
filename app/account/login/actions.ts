"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { APIResponse, APIDataResponse, LoginForm, UserData } from "@/lib/definitions";
import User from "@/lib/classes/User";

export async function login(formData: LoginForm): Promise<APIResponse | APIDataResponse<UserData>> {
	const supabase = await createClient();

	const { error, data } = await supabase.auth.signInWithPassword(formData);
	if (error) {
		return {
			status: 404,
			message: error.message,
		};
	}

	//Verify the user has user roles associated with them, if not, we will add them to the free tier.
	const user = new User();
	const userRoles = await user.getUserDetails();

	if (!userRoles) {
		return {
			status: 400,
			message: 'The user roles were unable to be retrieved'
		}
	}

	if (userRoles && userRoles.status !== 200) {
		const { error } = await supabase.from("user_roles").insert({
			user_id: data.user.id,
			super_admin: false,
			standard_tier: false,
			free_tier: true,
			email_address: data.user.email,
			premiere_tier: false,
		});

		if (error) {
			return {
				status: 400,
				message: `Unable to add the user to the user table due to the following: ${error}`,
			};
		}
	}

	revalidatePath("/");
	return {
		status: 200,
		message: `The user is verified, ${data.user.id}`,
		data: {
			email: data.user.email as string,
			id: data.user.id,
		},
	};
}
