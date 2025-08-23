"use server";
import { APIResponse, ChatThread } from "@/lib/definitions";
import  CreateChatThread from "@/lib/dbClasses/CreateChatThread";




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
