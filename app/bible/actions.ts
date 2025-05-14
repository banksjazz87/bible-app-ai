"use server";
import postgres from 'postgres';
import { UserResponse, SupabaseClient, PostgrestSingleResponse } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { APIResponse } from "@/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });


// export async function updateUserTable(userId: string, supabase: SupabaseClient) {
//     const { error } = await supabase
//         .from('chat_threads')
//         .update({thread})
// }

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

export async function saveSermonData(threadName: string): Promise<APIResponse> {
    const supabase = await createClient();
    const user: UserResponse = await supabase.auth.getUser();

    if (user.error) {
        return {
            status: 500,
            message: "The user is not currently logged in."
        }
    } else {
        chatExists(user.data.user.id, supabase, threadName)
            .then((data) => console.log(data));
        return {
            status: 300,
            message: `The user has been found and here are the details: ${user.data.user.id}`
        }
    }
}