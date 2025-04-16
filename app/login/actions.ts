"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { LoginForm } from "@/lib/definitions";

type LoginFormState = {
    error?: string;
}



export async function login(formData: LoginForm) {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signInWithPassword(formData);
    if (error) {
        return { error: error.message };
    }

    return { success: "This Worked and the user is verified."}

}


export async function signup(formData: FormData) {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signUp(data);

	if (error) {
		redirect("/error");
	}

	revalidatePath("/", "layout");
	redirect("/");
}
