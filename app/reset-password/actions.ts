"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { APIResponse } from "@/lib/definitions";

type ResetPassword = {
    email: string;
}

export async function resetPassword(formData: ResetPassword): Promise<APIResponse> {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {redirectTo: '/update-password'});
    if (error) {
        return {
            status: 404,
            message: error.message
        };
    }

    revalidatePath('/');
    return {
        status: 200,
        message: "The password request has been sent."
    }
}

