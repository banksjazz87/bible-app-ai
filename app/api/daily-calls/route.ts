import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { APIDataResponse } from '@/lib/definitions';



export async function GET(request: Request) {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    let responseData: APIDataResponse<any[] | null> = {
        status: 500,
        message: "This user is not found",
        data: null,
    };

    if (!error && user) {
        const userId = user.id;
        const { data, error } = await supabase.from("daily_requests").select("total_requests").eq("user_id", userId);

        if (!error) {
            responseData.status = 200;
            responseData.message = "Daily calls fetched successfully";
            responseData.data = data ? (data as any[]) : null;
        } else {
            responseData.status = 400;
            responseData.message = `The following error occurred, ${error.message}`;
        }
    } else if (error) {
        responseData.status = 400;
        responseData.message = `Error fetching user: ${error.message}`;
    }

    return NextResponse.json(responseData);
}