import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * This will be used for the following:
 * - Update the user role
 * - Expecting to get a product_id
 * - Based on the product id we will update the user role to the latest subscription tier
 * - Send back a status 200 if all is well
 * - Send back a status 400 if something went wrong, along with an error message
 */

export async function POST(request: Request) {
	//This will need to be updated in production.
	const StripeProducts = new Map([
		["prod_TNN4hsZb9FuoVk", "Premiere"],
		["prod_TAIA5QhaUQq9JJ", "Basic"],
	]);

    const body = await request.json();
    console.log('The request body is the following ', body);
    const { productId, userId } = body;

    console.log('//');
    console.log('The user id is: ', userId);
    console.log('The product id is: ', productId);
    console.log('//');
    
    // const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // const serviceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

    // const targetTable = "user_roles";
    // const url = `${supabaseURL}/rest/v1/${targetTable}?id=eq.${userId}`;

    // console.log('the url is here: ', url);

    return NextResponse.json({ message: 'test complete' }, { status: 200 });



//     console.log('The associated product name is ', StripeProducts.get(productId));
// 	if (!StripeProducts.get(productId)) {
// 		return NextResponse.json({ error: "The purchased product cannot be found." }, { status: 400 });
//     }
    

// console.log("MADE IT BEFORE the CREATE CLIENT");
// 	const supabase = await createClient();
// 	const {
// 		data: { user },
// 		error,
// 	} = await supabase.auth.getUser();

//     if (error) {
//         console.error('Error fetching the current user: ', error.message);
// 		return NextResponse.json({ error: "Unable to find the current user." }, { status: 400 });
//     } else {
//         console.log('Current user data: ', user);
//     }

//     console.log('MADE IT PAST the CREATE CLIENT');
//     const userID = user?.id;
//     console.log('THE FOLLOWING IS THE USER ID TO UPDATE THE USER ROLE: ', userID);
// 	let updateObject = {
// 		standard_tier: false,
// 		premiere_tier: false,
// 		free_tier: true,
// 	};

// 	if (StripeProducts.get(productId) === "Premiere") {
// 		updateObject = {
// 			standard_tier: false,
// 			premiere_tier: false,
// 			free_tier: true,
// 		};
// 	} else if (StripeProducts.get(productId) === "Basic") {
// 		updateObject = {
// 			standard_tier: false,
// 			premiere_tier: false,
// 			free_tier: true,
// 		};
// 	}

// 	try {
// 		const { error } = await supabase.from("user_roles").update(updateObject).eq("user_id", userID);

// 		if (!error) {
// 			return NextResponse.json({ message: "The user role has been updated successfully" }, { status: 200 });
// 		}
// 	} catch (error: unknown) {
// 		return NextResponse.json({ message: `The following error occurred in adding the user ${error instanceof Error && error.message}` }, { status: 400 });
// 	}
}
