"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { APIResponse, APIDataResponse, LoginForm, UserData } from "@/lib/definitions";


export async function login(formData: LoginForm): Promise<APIResponse | APIDataResponse<UserData>> {
    const supabase = await createClient();
    
    const { error, data } = await supabase.auth.signInWithPassword(formData);
    if (error) {
		return {
			status: 404,
			message: error.message
		};
    }

	revalidatePath('/');
	return {
		status: 200,
		message: `The user is verified, ${data.user.id}`,
		data: {
			email: data.user.email as string,
			id: data.user.id,
		}
	}
}

