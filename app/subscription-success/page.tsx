"use client";

import { useSearchParams } from "next/navigation";



export default function SubscriptionSuccessPage() {
    const serachParams = useSearchParams();
    const sessionID = serachParams.get('session-id');

    return (
        <section>
            <div className="product Box-root">
                <div className="description Box-root">
                    <h3>Subscription to Test Plan Successful!</h3>
                </div>
            </div>
            <form action="/create-portal-session" method="POST">
                <input
                    type="hidden"
                    id="session-id"
                    name="session_id"
                    value={sessionID ? sessionID : ''}
                />
                <button id="checkout-and-portal-button" type="submit">
                    Manage your billing information.
                </button>
            </form>
        </section>
    )
}