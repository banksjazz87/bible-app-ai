"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

type LoginFormState = {
    error?: string;
}

export async function login(prevState: LoginFormState, formData: FormData) {
    const supabase = await createClient();
    
    const loginFormSchema = z.object({
        email: z.string().email({ message: "Please provide a valid email." }),
        password: z.string().min(12, { message: "Password must be 12 or more characters." }).max(20, { message: "Password must be fewer than 20 characters" })
    });

	// type-casting here for convenience
	// in practice, you should validate your inputss
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
    };
    
    const validData = loginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password")
    });

    if (!validData.success) {
        return {
            error: validData.error.format()
        };
    }

    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
        return { error: error.message };
    }
    

	revalidatePath("/", "layout");
	redirect("/");
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
