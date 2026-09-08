"use server";
import { NextResponse } from "next/server";

/**
 *
 * @param request
 * @returns {Promise<NextResponse>}
 * @description route used to update the cancellation table to keep track of which users have requested to cancel their account.
 */

export async function POST(request: Request): Promise<NextResponse> {
	const body = await request.json();
	const { user_id, cancel_requested_on, cancel_end_date } = body;
	console.log("user id = ", user_id);
	console.log("cancel requested on ", cancel_requested_on);
	console.log("cancel on ", cancel_end_date);
    console.log("body = ", body);
    
    const cancelRequestedOnDate = new Date(cancel_requested_on * 1000);
    const requestedDate = cancelRequestedOnDate.toISOString();

    const cancelOnDate = new Date(cancel_end_date * 1000);
    const endDate = cancelOnDate.toISOString();

    console.log('Cancel on Date: ', cancelOnDate.toISOString());

	const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_SUPABASE_ANON_KEY;
	const apiKey = process.env.NEXT_SUPABASE_API_KEY;

	const targetTable = "cancellations";
	const supaUrl = `${supabaseURL}/rest/v1/${targetTable}`;

	try {
		const response = await fetch(supaUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				apiKey: apiKey as string,
				Authorization: anonKey as string,
			},
			body: JSON.stringify({
				user_id: user_id,
				cancel_requested_on: requestedDate,
				cancel_end_date: endDate,
			}),
		});
        
        console.log(response);

		if (!response.ok) {
			throw new Error(`HTTP error!  Status: ${response.status}`);
		}

		return NextResponse.json({ message: "The user has been marked to be cancelled within the database." }, { status: 200 });
    } catch (e: unknown) {
		return NextResponse.json({ message: `The following error occurred in updating the cancellation table: ${e instanceof Error && e.message}` }, { status: 400 });
	}
}
