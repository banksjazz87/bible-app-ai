"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { APIDataResponse } from "@/lib/definitions";

type SignUpForm = {
	email: string;
	password: string;
	verifiedPassword: string;
};

export async function signup(formData: SignUpForm): Promise<APIDataResponse<object>> {
	const supabase = await createClient();

	const data = {
		email: formData.email,
		password: formData.password,
		verifiedPassword: formData.verifiedPassword,
    };

	const signupResponse = await supabase.auth.signUp(data);

    //If there's an error
	if (signupResponse.error) {
		return {
			status: 500,
            message: `The following error has occurred: ${signupResponse.error}`,
            data: signupResponse
		};
    }

    //If user identity data has been retrieved
    if (signupResponse.data.user?.identities?.length === 0) {
        return {
            status: 409,
            message: 'It looks like you already have an account. Please sign in, or if you\'ve forgotten your password, you can request a new one.',
            data: signupResponse
        }
    }

    // //Set the user as a free tier member by default when creating an account
    // const { error } = await supabase
    //     .from('user_roles')
    //     .insert({
    //         user_id: signupResponse.data.user?.id,
    //         super_admin: false,
    //         standard_tier: false,
    //         free_tier: true,
    //         email_address: signupResponse.data.user?.email,
    //         premiere_tier: false,
    //     });
    
    // if (error) {
    //     console.log('Error setting user role ', error)
    //     return {
    //         status: 500, 
    //         message: "Unable to set this users user role.",
    //         data: error
    //     }
    // }

	revalidatePath("/", "layout");

	return {
		status: 200,
        message: "Your account has been successfully created.  Please check your email to validate your account.",
        data: signupResponse,
	};
}
