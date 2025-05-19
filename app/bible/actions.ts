"use server";
import postgres from "postgres";
import { UserResponse, SupabaseClient, PostgrestSingleResponse } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { APIResponse, LLMReqObject, ChatThread } from "@/lib/definitions";

class CreateChatThread {
	threadName: string;
	chatObj: ChatThread;

	constructor(threadName: string, chatObj: ChatThread) {
		this.threadName = threadName;
		this.chatObj = chatObj;
	}

	

	async chatExists(userId: string, supabase: SupabaseClient): Promise<Boolean> {
		const chatData = await supabase.from("chat_threads").select().match({
			user_Id: userId,
			threadName: this.threadName,
		});

		if (chatData.data) {
			return true;
		} else {
			return false;
		}
	}

	async createNewChat(userId: string, supabase: SupabaseClient): Promise<APIResponse> {
		//Add our user id here
		this.chatObj.user_id = userId;
		const insert = await supabase.from("chat_threads").insert(this.chatObj);

		if (insert.status === 201) {
			return {
				status: 201,
				message: `The thread has been created.`,
			};
		} else {
			return {
				status: 500,
				message: `The following error occurred while creating the thread: ${insert.error}`,
			};
		}
	}

	async saveSermonData(): Promise<APIResponse> {
		const supabase = await createClient();
		const user: UserResponse = await supabase.auth.getUser();
		if (user.error) {
			return {
				status: 500,
				message: "The user is not currently logged in.",
			};
		}

		const chat = await this.chatExists(user.data.user.id, supabase);
		if (chat) {
			return {
				status: 500,
				message: "This chat thread already exists for this user.",
			};
		}

		const createChat: APIResponse = await this.createNewChat(user.data.user.id, supabase);
		return createChat;
	}
}

export async function saveSermonData(title: string, data: ChatThread) {
    const createThread = new CreateChatThread(title, data);
    return await createThread.saveSermonData();
}
