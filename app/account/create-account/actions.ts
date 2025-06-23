"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";
import { APIResponse } from "@/lib/definitions";

type SignUpForm = {
    email: string;
    password: string;
    verifiedPassword: string;
}

export async function signup(formData: SignUpForm): Promise<APIResponse> {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.email,
        password: formData.password,
        verifiedPassword: formData.verifiedPassword
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        return {
            status: 404,
            message: `The following error has occurred: ${error}`,
        };
    }

    revalidatePath("/", "layout");
    
    return {
        status: 200,
        message: "Your account has been successfully created.  Please check your email to validate your account."
    }
}
