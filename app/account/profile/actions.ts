"use server"
import { deleteChatThread } from "@/lib/data";
import { LLMReqObject } from "@/lib/definitions";


/**
 * 
 * @param data 
 * @param column 
 * @param slug 
 * @returns NextResponse
 * @description used to update the thread data associated with the current chat thread.
 */
export async function deleteChatThreadHandler(id: number): Promise<{
    status: number,
    message: string,
    data: null
}> {
    return await deleteChatThread(id);
}