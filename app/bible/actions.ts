"use server";
import { UserResponse, SupabaseClient, PostgrestSingleResponse } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { APIResponse, ChatThread } from "@/lib/definitions";

class CreateChatThread {
	threadName: string;
	chatObj: ChatThread;

	/**
	 * 
	 * @param threadName string This is the project name that will be stored.
	 * @param chatObj ChatThread the chat data.
	 * Constructor function to set out initial values.
	 */
	constructor(threadName: string, chatObj: ChatThread) {
		this.threadName = threadName;
		this.chatObj = chatObj;
	}

	/**
	 * 
	 * @param userId string 
	 * @param supabase SupabaseClient
	 * @returns boolean
	 * @description checks if the currently passed thread name already exists in the database, along with the passed userId.
	 */
	async chatExists(userId: string, supabase: SupabaseClient): Promise<Boolean> {
		const slugOfThreadName = this.createSlug(this.threadName);
		const chatData = await supabase.from("chat_threads").select().match({
			user_id: userId,
			thread_slug: slugOfThreadName,
		});

		if (chatData.data && chatData.data.length > 0) {
			return true;
		} else {
			return false;
		}
	}


	/**
	 * 
	 * @param title string
	 * @returns string, returns the slug version of the title
	 */
	createSlug(title: string): string {
		let slugOfTitle = title.toLowerCase();

		//Replace non-alphanumerical values
		slugOfTitle = slugOfTitle.replace(/[^a-zA-Z0-9 -]/g, " ");

		//Replace multiples spaces with a single hyphen
		slugOfTitle = slugOfTitle.replace(/\s+/g, '-');

		//Replace multiple hyphens with a single hyphen
		slugOfTitle = slugOfTitle.replace(/-+/g, '-');

		//Replace starting or ending hyphens with a space
		slugOfTitle = slugOfTitle.replace(/-$/, '');
		slugOfTitle = slugOfTitle.replace(/^-/, '');

		return slugOfTitle.trim();
	}

	/**
	 * 
	 * @param userId string
	 * @param supabase SupabaseClient
	 * @returns Promise<APIResponse>
	 * @description Creates and stores a new chat
	 */
	async createNewChat(userId: string, supabase: SupabaseClient): Promise<APIResponse> {
		//Add our user id here
		this.chatObj.user_id = userId;
		const title = this.chatObj.thread_name;
		this.chatObj.thread_slug = this.createSlug(title);
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


	/**
	 * 
	 * @returns Promise<APIResponse>
	 * @description Main function that's called to save the sermon data, runs checks and verifies that the chat can be stored before storing it.
	 */
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


/**
 * 
 * @param title string title of the chat thread.
 * @param data ChatThread the chat data
 * @returns Promise<APIResponse> instantiates the class and executes the main function.
 */
export async function saveSermonData(title: string, data: ChatThread): Promise<APIResponse> {
    const createThread = new CreateChatThread(title, data);
    return await createThread.saveSermonData();
}
