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

        if (!error && data.length > 0) {
            responseData.status = 200;
            responseData.message = "Daily calls fetched successfully";
            responseData.data = data ? (data as any[]) : null;
        } else if (error) {
            responseData.status = 400;
			responseData.message = `The following error occurred, ${error.message}`;
        } else {
            // If no record exists, create one with total_requests set to 0

            // const { data, error } = await supabase.from('daily_requests').insert({ user_id: userId, total_requests: 0 });
            
            // if (error) {
            //     console.error('Error creating daily_requests record: ', error);
            // } else {
            //     responseData.status = 201;
            //     responseData.message = "Daily calls record created successfully";
            //     responseData.data = [{total_requests: 0}];
            // }
            responseData.status = 200;
            responseData.message = "No daily calls record found, initializing to 0";        
            responseData.data = [{total_requests: 0}];

        }
    } else if (error) {
        responseData.status = 400;
        responseData.message = `User is no longer Authenicated: ${error.message}`;
    }

    return NextResponse.json(responseData);
}