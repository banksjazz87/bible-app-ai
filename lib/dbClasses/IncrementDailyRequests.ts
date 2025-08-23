"use server";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { GetCurrentUserId } from "../data";
import { NextResponse } from "next/server";


export default class IncrementDailyRequests {
    limit: number;
    
    constructor(limit: number) {
        this.limit = limit;
    }



    async main() {
        const supabase = await createClient();
        const userId = await GetCurrentUserId();

        const responseData = {
            status: 500,
            message: "This user is not found",
            data: null
        }

        if (!userId) {
            console.error("User is not authenticated");
            responseData.message = "User is not authenticated";
            responseData.status = 401;
        }

        const { data, error } = await supabase.from("daily_requests").select("total_requests").eq("user_id", userId);

        if (error) {
            console.error(`Error fetching daily requests: ${error}`);
            responseData.message = `Error fetching daily requests: ${error}`;
            responseData.status = 400;
        }

        if (data && data.length > 0) {
            const newTotal = data[0].total_requests + 1;

            if (newTotal > this.limit) {
                console.warn("User has exceeded their daily request limit.");
                responseData.message = "It looks like you've used up your daily tokens."
                responseData.status = 400;
            }

            const { error } = await supabase.from("daily_requests").update({ total_requests: newTotal }).eq("user_id", userId);

            if (error) {
                console.error(`Error updating daily requests: ${error}`);
                responseData.message = `Error updating the daily requests: ${error}`;
                responseData.status = 400;
            }
        } else {
            const { error } = await supabase.from("daily_requests").insert({ user_id: userId, total_requests: 1 });

            if (error) {
                console.error(`Error inserting daily requests: ${error}`);
                responseData.message = `Error inserting daily requests: ${error}`;
                responseData.status = 400;
            } else {
                responseData.status = 201;
                responseData.message = "Daily requests record created successfully";
            }
        }

        return NextResponse.json(responseData);
    }

}