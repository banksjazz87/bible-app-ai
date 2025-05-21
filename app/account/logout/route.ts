import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * This will be used to handle the logout function, when the logout page is requested.
 */
export async function GET(request: Request){
    const supabase = createClient();
    const signOut = await supabase.auth.signOut();
    const cookieStore = await cookies();
 
    if (signOut.error) {
        redirect('/error')
    } 

    //Clear all cookies
    cookieStore.getAll().forEach((cookie) => cookieStore.delete(cookie.name));
    revalidatePath('/');
    redirect('/');
}