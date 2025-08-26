"use server";
import { APIResponse, ChatThread } from "@/lib/definitions";
import CreateChatThread from "@/lib/dbClasses/CreateChatThread";
import IncrementDailyRequests from "@/lib/dbClasses/IncrementDailyRequests";
import { NextResponse } from 'next/server';




/**
 * 
 * @param title string title of the chat thread.
 * @param data ChatThread the chat data
 * @returns Promise<APIResponse> instantiates the class and executes the main function.
 */
export async function saveSermonData(title: string, data: ChatThread): Promise<APIResponse> {
    const createThread: CreateChatThread = new CreateChatThread(title, data);
    return await createThread.saveSermonData();
}

/**
 * 
 * @param limit number of daily calls permitted based on user subscription
 * @returns NextResponse with the data type of APIReponse.
 */
export async function incrementRequests(limit: number): Promise<APIResponse> {
    const increment: IncrementDailyRequests = new IncrementDailyRequests(limit);
    return await increment.main();
}