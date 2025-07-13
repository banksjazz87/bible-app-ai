import { createClient } from "@/utils/supabase/server";
import { ChatThread, APIDataResponse } from "@/lib/definitions";
import { NextResponse, NextRequest } from "next/server";

type SingleChatThreadResponse = {
	status: number;
	message: string;
	data: ChatThread | null;
};

// export async function GET(req: NextRequest, { params }: { params: { slug: string } }): Promise<NextResponse<SingleChatThreadResponse>> {
// 	const supabase = await createClient();
// 	const {
// 		data: { user },
// 		error,
// 	} = await supabase.auth.getUser();

// 	let responseData: APIDataResponse<ChatThread | null> = {
// 		status: 500,
// 		message: "This user is not found",
// 		data: null,
// 	};

// 	if (!error) {
//         const userId = user?.id;
//         const slug = params.slug;
//         const { data, error } = await supabase
//             .from("chat_threads")
//             .select('*')
//             .match({ user_id: userId, thread_slug: slug })

// 		if (!error) {
// 			responseData.status = 200;
// 			responseData.message = "Data has been found";
// 			responseData.data = data ? (data[0] as ChatThread) : null;
// 		} else {
// 			responseData.status = 400;
// 			responseData.message = `The following error occurred, ${error}`;
// 		}
// 	}

// 	return NextResponse.json(responseData);
// }


// export async function GET(req: NextRequest, { params }: { params: { slug: string } }): Promise<void> {
	
//     const slug = req;
//     console.log('Slug here', slug);
		
// }

export async function GET(req: NextRequest) {
    
    return NextResponse.json({
        valid: true,
        testing: true
    });
}