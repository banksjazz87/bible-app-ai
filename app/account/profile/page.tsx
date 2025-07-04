"use client";

import { getUserData } from "@/app/store/features/account/loginSlice";
import { useAppSelector } from "@/app/store/hooks";
import { PastThreads, PastThreadsSkeleton } from "./components/PastThreads";
import { Suspense } from "react";
import { ChatThread, APIDataResponse } from "@/lib/definitions";

export default function ProfilePage() {
    const loggedInDetails = useAppSelector(getUserData);
    async function getThreads():  Promise<APIDataResponse<ChatThread[] | null>>{ 
        const data = await fetch('/account/api/profile/pastThreads');
        const jsonData: APIDataResponse<ChatThread[] | null> = await data.json();
        console.log('HERE ', jsonData);
        return jsonData;
    }
    const pastThreadData = getThreads();

	return (
		<main>
			<p>{`The user is currently logged in ${loggedInDetails.isLoggedIn} and his username is ${loggedInDetails.userName}`}</p>
            <section className="mt-16 flex flex-col gap-4">
                <h2 className="font-bold text-2xl">Chat History</h2>
				<Suspense fallback={<PastThreadsSkeleton />}>
					<PastThreads threads={pastThreadData} />
				</Suspense>
			</section>
		</main>
	);
}
