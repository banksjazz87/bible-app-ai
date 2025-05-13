"use server";
import postgres from 'postgres';
import { UserResponse, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { APIResponse } from "@/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
// export async function updateUserTable(userId: string, supabase: SupabaseClient) {
//     const { error } = await supabase
//         .from('chat_threads')
//         .update({thread})
// }

export async function saveSermonData(): Promise<APIResponse> {
    const supabase = await createClient();
    // console.log('HERE ', supabase);

    const user: UserResponse = await supabase.auth.getUser();
    
    if (user.error) {
        return {
            status: 500,
            message: "The user is not currently logged in."
        }
    } else {
        console.log(user);
        return {
            status: 300,
            message: `The user has been found and here are the details: ${user.data.user.id}`
        }
    }
}