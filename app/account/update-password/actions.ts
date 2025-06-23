"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";

type ResetPasswordData = {
	password: string;
	verifiedPassword: string;
};

export async function resetPassword(formData: ResetPasswordData) {
	const supabase = await createClient();

	const { error } = await supabase.auth.updateUser({ password: formData.password });

	if (error) {
		return {
			status: 404,
			message: error.message,
		};
	}

	revalidatePath("/");
	return {
		status: 200,
		message: "The password has been successfully reset, please login with your new password.",
	};
}
