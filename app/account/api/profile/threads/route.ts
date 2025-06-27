import { createClient } from "@/utils/supabase/server";


type ResponseData = {
    status: number;
    message: string;
    data: any;
}
export async function GET() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    let responseData: ResponseData = {
        status: 500,
        message: 'This user is not found',
        data: null
    }

    if (!error) {
        const userId = user?.id;
        const { data, error } = await supabase.from('chat_threads').select('*').eq('user_id', userId);

        if (!error) {
            responseData.status = 200;
            responseData.message = 'Data has been found';
            responseData.data = data;
        } else {
            responseData.status = 400;
            responseData.message = `The following error occurred, ${error}`;
        }
    }

    return Response.json(responseData);
}