"use client";

import { getUserData } from "@/app/store/features/account/loginSlice";
import { useAppSelector } from "@/app/store/hooks";
import PastThreads from "./components/PastThreads";
import { Suspense } from "react";
import { ChatThread, APIDataResponse } from "@/lib/definitions";

export default function ProfilePage() {
    const loggedInDetails = useAppSelector(getUserData);
    async function getThreads():  Promise<APIDataResponse<ChatThread[] | null>>{ 
        const data = await fetch('/account/api/profile/threads');
        const jsonData: APIDataResponse<ChatThread[] | null> = await data.json();
        return jsonData;
    }
    const pastThreadData = getThreads().then((data) => data);

	return (
		<main>
            <p>{`The user is currently logged in ${loggedInDetails.isLoggedIn} and his username is ${loggedInDetails.userName}`}</p>
            <Suspense fallback={<div>Loading...</div>} >
                <PastThreads threads={pastThreadData} />
            </Suspense>
		</main>
	);
}
