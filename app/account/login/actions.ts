"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { LoginForm } from "@/lib/definitions";
import { APIResponse } from "@/lib/definitions";


export async function login(formData: LoginForm): Promise<APIResponse> {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signInWithPassword(formData);
    if (error) {
		return {
			status: 404,
			message: error.message
		};
    }

	revalidatePath('/');
	return {
		status: 200,
		message: "The user is verified."
	}
}

