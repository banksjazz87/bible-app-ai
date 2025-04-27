import type { NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function middleware(request: NextRequest) {
	if (request.nextUrl.pathname === "/account/logout") {
		const supabase = await createClient();

		const { error } = await supabase.auth.signOut();

		if (error) {
			return {
				status: 404,
				message: error.message,
			};
		}

		return NextResponse.redirect(new URL("/", request.url));
	}

	return await updateSession(request);

}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};

