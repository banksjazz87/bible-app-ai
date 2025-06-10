import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * This will be used to handle the logout function, when the logout page is requested.
 */
export async function GET(request: Request): Promise<Response> {
	const supabase = createClient();
	const signOut = await supabase.auth.signOut();
    const cookieStore = await cookies();
    
    console.warn(signOut);

	if (signOut.error) {
		// redirect('/error')
		return new Response(
			JSON.stringify({
				status: 400,
				message: `The following error occurred in signing out ${signOut.error}`,
			}),
			{
				status: 400,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}

	//Clear all cookies
	cookieStore.getAll().forEach((cookie) => cookieStore.delete(cookie.name));

	return new Response(
		JSON.stringify({
			status: 200,
			message: `The user has been logged out.`,
		}),
		{
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
}
