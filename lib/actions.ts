"use server";

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
