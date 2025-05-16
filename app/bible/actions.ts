"use server";
import postgres from 'postgres';
import { UserResponse, SupabaseClient, PostgrestSingleResponse } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { APIResponse, LLMReqObject } from "@/lib/definitions";

type ChatThread = {
    thread_name: string;
    bible_version: string;
    book: string;
    chapter: string;
    start_verse: string;
    end_verse: string;
    llm_notes: LLMReqObject[];
    user_notes: string;
    user_id: string;
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function createNewChat(userId: string, supabase: SupabaseClient, newChatObj: ChatThread): Promise<APIResponse> {
    const insert = await supabase
        .from('chat_threads')
        .insert(newChatObj);
    
    if (insert.status === 201) {
        return {
            status: 201,
            message: `The thread has been created.`
        }
    } else {
        return {
            status: insert.status,
            message: `The following error occurred while creating the thread: ${insert.error}`
        }
    }
}

export async function chatExists(userId: string, supabase: SupabaseClient, threadName: string): Promise<Boolean> {
    const chatData = await supabase
        .from("chat_threads")
        .select()
        .match({
            user_Id: userId,
            threadName: threadName
        });

    if (chatData.data) {
        return true;
    } else {
        return false;
    }
}

export async function saveSermonData(threadName: string, chatObj: ChatThread): Promise<APIResponse> {
    const supabase = await createClient();
    const user: UserResponse = await supabase.auth.getUser();
    if (user.error) {
        return {
            status: 500,
            message: "The user is not currently logged in."
        }
    } 
    
    const chat = await chatExists(user.data.user.id, supabase, threadName);
    if (chat) {
        return {
            status: 500,
            message: "This chat thread already exists for this user."
        }
    }

    const createChat: APIResponse = await createNewChat(threadName, supabase, chatObj);
    return createChat;
}