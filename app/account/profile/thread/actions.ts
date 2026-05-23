"use server"
import { updateChatThread } from "@/lib/data";
import { LLMReqObject } from "@/lib/definitions";
import { NextResponse } from "next/server";


/**
 * 
 * @param data 
 * @param column 
 * @param slug 
 * @returns NextResponse
 * @description used to update the thread data associated with the current chat thread.
 */
export async function updateChatThreadHandler(data: LLMReqObject[], column: string, slug: string): Promise<NextResponse<{
    status: number,
    message: string,
    data: null
}>> {
    return await updateChatThread(data, column, slug);
}