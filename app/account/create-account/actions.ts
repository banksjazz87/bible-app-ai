"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { APIDataResponse } from "@/lib/definitions";

type SignUpForm = {
	email: string;
	password: string;
	verifiedPassword: string;
};

type SignUpAPIResponse = {
    status: number;
    message: string;
    data: object;
}

export async function signup(formData: SignUpForm): Promise<APIDataResponse<object>> {
	const supabase = await createClient();

	const data = {
		email: formData.email,
		password: formData.password,
		verifiedPassword: formData.verifiedPassword,
    };
    

	// const { error } = await supabase.auth.signUp(data);
	const signupResponse = await supabase.auth.signUp(data);

	// if (error) {
	if (signupResponse.error) {
		return {
			status: 404,
            message: `The following error has occurred: ${signupResponse.error}`,
            data: signupResponse
		};
    }

    if (signupResponse.data.user?.identities?.length === 0) {
        return {
            status: 404,
            message: 'The user already exists in the database, please sign in or request a password reset.',
            data: signupResponse
        }
    }

	revalidatePath("/", "layout");

	return {
		status: 200,
        message: "Your account has been successfully created.  Please check your email to validate your account.",
        data: signupResponse,
	};
}
