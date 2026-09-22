import { NextResponse, NextRequest } from "next/server";
import { listCustomerCharges } from "@/app/actions/stripe";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const count = data.count;
        const billingResults = await listCustomerCharges(count);

        return NextResponse.json({ success: true, billingResults });
    } catch (e: unknown) {
        return NextResponse.json({ success: false, message: `The following error occurred ${e instanceof Error && e.message}` });
    }
}