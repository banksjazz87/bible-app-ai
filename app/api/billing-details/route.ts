import { NextResponse, NextRequest } from "next/server";
import { listCustomerCharges } from "@/app/actions/stripe";
import Stripe from "stripe";
import { ChargesNextResponse, APIResult, ChargeData } from "@/lib/definitions";

export async function GET(request: NextRequest): Promise<ChargesNextResponse> {
    try {
        
        const reqParams = request.nextUrl.searchParams;
        const count = reqParams.get('count');
        console.log(reqParams);
		const billingResults: APIResult<ChargeData> = await listCustomerCharges(Number(count));

		return NextResponse.json({ status: 200, success: true, billingDetails: billingResults});
	} catch (e: unknown) {
		return NextResponse.json({ status: 400, success: false, message: `The following error occurred ${e instanceof Error && e.message}` });
	}
}