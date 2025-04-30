import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * This will be used to handle the logout function, when the logout page is requested.
 */
export async function GET(request: Request){
    const supabase = createClient();
    const signOut = await supabase.auth.signOut();
 
    if (signOut.error) {
        redirect('/error')
    } 

    revalidatePath('/');
    redirect('/');
}