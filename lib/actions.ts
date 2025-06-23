"use server";

import { createClient } from "@/app/utils/supabase/server";
import { UserResponse, SupabaseClient, PostgrestSingleResponse } from "@supabase/supabase-js";
import { APIResponse } from "./definitions";

// import { z } from "zod";

// const schema = z.object({
// 	version: z.string(),
// 	book: z.string(),
// 	chapter: z.string(),
// 	startVerse: z.string(),
// 	endVerse: z.string(),
// });

// export async function bibleFormSubmit(prevState: any, formData: FormData) {
// 	const neededValues = {
// 		version: formData.get("version"),
// 		book: formData.get("book"),
// 		chapter: formData.get("chapter"),
// 		startVerse: formData.get("startVerse"),
// 		endVerse: formData.get("endVerse"),
// 	};

// 	const validatedFields = schema.safeParse({ neededValues });

// 	if (!validatedFields.success) {
// 		return {
// 			errors: validatedFields.error.flatten().fieldErrors,
// 		};
//     } 

//     return {
//         message: "Success", 
//         data: neededValues
//     }
// }



export async function getUserDetails(): Promise<APIResponse> {
	const supabase = await createClient();
    const userData: UserResponse = await supabase.auth.getUser();
    if (userData.error) {
        return {
            status: 400,
            message: "This user is not logged"
        }
    } else {
        return {
            status: 200,
            message: "This user is logged in"
        }
    }
}
