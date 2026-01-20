import { createClient } from "@/utils/supabase/server";
import { ChatThread, APIDataResponse } from "@/lib/definitions";
import { NextResponse } from "next/server";


type ChatThreadResponse =  {
    status: number;
    message: string;
    data: ChatThread[] | null;
}

export async function GET(): Promise<NextResponse<ChatThreadResponse>> {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    const responseData: APIDataResponse<ChatThread[] | null> = {
			status: 500,
			message: "This user is not found",
			data: null,
		};

    if (!error) {
        const userId = user?.id;
        const { data, error } = await supabase
            .from('chat_threads')
            .select('*')
            .eq('user_id', userId)
            .order('last_modified', { ascending: false });

        if (!error) {
            responseData.status = 200;
            responseData.message = 'Data has been found';
            responseData.data = data ? data as ChatThread[] : null;
        } else {
            responseData.status = 400;
            responseData.message = `The following error occurred, ${error}`;
        }
    }

    return NextResponse.json(responseData);
}