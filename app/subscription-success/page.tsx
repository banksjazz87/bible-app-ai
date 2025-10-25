"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PageContent() {
	const searchParams = useSearchParams();
	const sessionID = searchParams.get("session-id");

	return (
		<section>
			<div className="product Box-root">
				<div className="description Box-root">
					<h3>Subscription to Test Plan Successful!</h3>
				</div>
			</div>
			<form
				action="/create-portal-session"
				method="POST"
			>
				<input
					type="hidden"
					id="session-id"
					name="session_id"
					value={sessionID ? sessionID : ""}
				/>
				<button
					id="checkout-and-portal-button"
					type="submit"
				>
					Manage your billing information.
				</button>
			</form>
		</section>
	);
}

export default function SubscriptionSuccessPage() {
	return (
		<Suspense fallback="<p>Loading...</p>">
			<main>
				<PageContent />
			</main>
		</Suspense>
	);
}
