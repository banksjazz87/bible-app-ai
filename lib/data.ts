import { createClient } from "@/utils/supabase/server";
import { ChatThread, APIDataResponse } from "@/lib/definitions";
import { NextResponse } from "next/server";

export async function GetThreads() {
	const supabase = await createClient();
	const { data } = await supabase.from("chat_threads").select();

	return data;
}

export async function GetSingleThread(slugName: string) {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	let responseData: APIDataResponse<ChatThread | null> = {
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
