"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { APIResponse } from "@/lib/definitions";

type ResetPassword = {
    email: string;
}

export async function requestResetPassword(formData: ResetPassword): Promise<APIResponse> {
    const supabase = await createClient();
    
    // const { error } = await supabase.auth.resetPasswordForEmail(formData.email, { redirectTo: '/update-password' });
    const response = await supabase.auth.resetPasswordForEmail(formData.email, { redirectTo: "/update-password" });

    console.log(response);
    if (response.error) {
        return {
            status: 404,
            message: response.error.message
        };
    }

    revalidatePath('/');
    return {
        status: 200,
        message: "Please follow the link in your email to finish resetting your password."
    }
}


