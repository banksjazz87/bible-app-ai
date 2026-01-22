import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";
import { APIDataResponse } from "@/lib/definitions";
import { UserRoles } from "@/lib/definitions";


export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    const responseData: APIDataResponse<unknown[] | null> = {
        status: 500,
        message: "This user is not found",
        data: null,
    };

    if (!error && user) {
        const userId = user.id;
        const { data, error } = await supabase.from("user_roles").select("*").eq("user_id", userId);

        if (!error) {
            responseData.status = 200;
            responseData.message = "User roles fetched successfully";
            responseData.data = data ? (data as UserRoles[]) : null;
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