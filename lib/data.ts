import { createClient } from "@/utils/supabase/server";
import { ChatThread, APIDataResponse } from "@/lib/definitions";
import { NextResponse } from "next/server";
import { UserRoles } from "@/lib/definitions";

export async function GetThreads() {
	const supabase = await createClient();
	const { data } = await supabase.from("chat_threads").select();

	return data;
}

export async function GetSingleThread(slugName: string): Promise<NextResponse> {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	const responseData: APIDataResponse<ChatThread | null> = {
		status: 500,
		message: "This user is not found",
		data: null,
	};

	if (!error) {
		const userId = user?.id;
		const { data, error } = await supabase.from("chat_threads").select("*").match({ user_id: userId, thread_slug: slugName });

		if (!error) {
			responseData.status = 200;
			responseData.message = "Data has been found";
			responseData.data = data ? (data[0] as ChatThread) : null;
		} else {
			responseData.status = 400;
			responseData.message = `The following error occurred, ${error}`;
		}
	}

	return NextResponse.json(responseData);
}


export async function GetUserRoles(userId: string): Promise<APIDataResponse<unknown[] | null>> {
	const supabase = await createClient();
	const { data, error } = await supabase.from("user_roles").select("*").eq("user_id", userId);

	if (error) {
		return {
			status: 400,
			message: `Error fetching user roles: ${error.message}`,
			data: null,
		};
	}

	return {
		status: 200,
		message: "User roles fetched successfully",
		data: data,
	};
}

export async function GetCurrentUserId(): Promise<string | null> {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		return null;
	}

	return user.id;
}

export async function IncrementDailyCalls(limit: number): Promise<NextResponse> {
	const supabase = await createClient();
	const userId = await GetCurrentUserId();
	const responseData = {
		status: 500,
		message: "This user is not found",
		data: null,			
	}

	if (!userId) {
		console.error("User is not authenticated.");
		responseData.message = "User is not authenticated.";
		responseData.status = 401;
	} 

	const { data, error } = await supabase.from("daily_requests").select("total_requests").eq("user_id", userId);

	if (error) {
		console.error("Error fetching daily requests: ", error);
		responseData.message = `Error fetching daily requests: ${error.message}`;
		responseData.status = 400;
	}

	if (data && data.length > 0) {
		const newTotal = data[0].total_requests + 1;

		if (newTotal > limit) {
			console.warn("User has exceeded their daily request limit.");
			responseData.message = "User has exceeded their daily request limit.";
			responseData.status = 429;
		}

		const currentRequests = data[0].total_requests;
		const { error: updateError } = await supabase.from("daily_requests").update({ total_requests: currentRequests + 1 }).eq("user_id", userId);

		if (updateError) {
			console.error("Error updating daily requests: ", updateError);
			responseData.message = `Error updating daily requests: ${updateError.message}`;
			responseData.status = 400;
		}

	} else {
		const { error: insertError } = await supabase.from("daily_requests").insert({ user_id: userId, total_requests: 1 });

		if (insertError) {
			console.error("Error inserting daily requests: ", insertError);
			responseData.message = `Error inserting daily requests: ${insertError.message}`;
			responseData.status = 400;
		} else {
			responseData.status = 201;
			responseData.message = "Daily requests record created successfully";
		}
	}

	return NextResponse.json(responseData);
}


export async function updateSubscription<UserRoles, K extends keyof UserRoles>(subscriptionData: {K: boolean}) {
	const responseData = {
		status: 500,
		message: '',
		data: null
	}

	try {
		const supabase = await createClient();
		const userId = await GetCurrentUserId();
		if (userId) {
			const { error } = await supabase
				.from('user_roles')
				.update({ K: subscriptionData.K })
				.eq('id', userId);

		} else {
			responseData.message = 'The user cannot be found';
			responseData.status = 404;
		}
	} catch (e: unknown) {
		responseData.message = `The following error occurred: ${e}`;
		responseData.data = null
	}

	return NextResponse.json(responseData);
}