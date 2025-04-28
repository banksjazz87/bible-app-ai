import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";
import { APIResponse } from "@/lib/definitions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * This will be used to handle the logout function, when the logout page is requested.
 */
export async function GET(request: Request){
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    let data = {
        status: 200,
        message: 'The user has been successfully logged out.'
    }

    if (error) {
        data = {
            status: 404,
            message: error.message
        }

        redirect('/error')
    } 

    revalidatePath('/');
    redirect('/');

}