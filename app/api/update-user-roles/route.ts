import { NextResponse } from "next/server";

/**
 *
 * @param request The request body requires the user id as well as the product id.
 * @returns {Promise<NextResponse>}
 * @description used to update the user_roles via the supabase url, based on the most recent subscription purchase.
 */

export async function POST(request: Request): Promise<NextResponse> {
	//This will need to be updated in production.
	const StripeProducts = new Map([
		["prod_TNN4hsZb9FuoVk", "Premiere"],
		["prod_TAIA5QhaUQq9JJ", "Basic"],
	]);

	const body = await request.json();
	const { productId, userId } = body;

	const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_SUPABASE_ANON_KEY;
	const apiKey = process.env.NEXT_SUPABASE_API_KEY;

	const targetTable = "user_roles";
    const supaUrl = `${supabaseURL}/rest/v1/${targetTable}?user_id=eq.${userId}`;
    
	if (!StripeProducts.get(productId)) {
		return NextResponse.json({ message: "The purchased product cannot be found." }, { status: 400 });
	}

	let updateObject = {
		standard_tier: false,
		premiere_tier: false,
		free_tier: true,
	};

	if (StripeProducts.get(productId) === "Premiere") {
		updateObject = {
			standard_tier: false,
			premiere_tier: true,
			free_tier: false,
		};
	} else if (StripeProducts.get(productId) === "Basic") {
		updateObject = {
			standard_tier: true,
			premiere_tier: false,
			free_tier: false,
		};
	}

	try {
		const response = await fetch(supaUrl, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				apiKey: apiKey as string,
				Authorization: anonKey as string,
			},
			body: JSON.stringify(updateObject),
		});

        console.log('Response ', response);
		if (!response.ok) {
			throw new Error(`HTTP error!  Status: ${response.status}`);
		}

        return NextResponse.json({ message: "The user role has been updated upon checkout session completion" }, { status: 200 });
        
    } catch (error: unknown) {
        console.log('Error HEREEEEEE ', error);
		return NextResponse.json({ message: `The following error occurred in adding the user ${error instanceof Error && error.message}` }, { status: 400 });
	}
}
