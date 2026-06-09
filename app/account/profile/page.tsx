"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserData } from "@/lib/store/features/account/loginSlice";
import { useAppSelector } from "@/lib/store/hooks";
import { PastThreads, PastThreadsSkeleton } from "./components/PastThreads";
import { Suspense } from "react";
import { ChatThread, APIDataResponse } from "@/lib/definitions";

async function getThreads(): Promise<APIDataResponse<ChatThread[] | null>> {
	const data = await fetch("/account/api/profile/pastThreads");
	const jsonData: APIDataResponse<ChatThread[] | null> = await data.json();
	return jsonData;
}

export default function ProfilePage() {
	const loggedInDetails = useAppSelector(getUserData);
	const [threadData, setThreadData] = useState<APIDataResponse<ChatThread[] | null> | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const fetchThreads = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getThreads();
			setThreadData(data);
		} catch (e) {
			console.error("Failed to fetch threads:", e);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchThreads();
	}, [fetchThreads]);

	if (!loggedInDetails.isLoggedIn) {
		return (
			<main>
				<h1>{`You're currently not logged in.`}</h1>
			</main>
		);
	}

	if (loading) return <PastThreadsSkeleton />;

	return (
		<main>
			<section className="mt-16 flex flex-col gap-4">
				<h2 className="font-bold text-2xl">Chat History</h2>
				<Suspense fallback={<PastThreadsSkeleton />}>
					<PastThreads threads={threadData} onDeleteSuccess={fetchThreads} />
				</Suspense>
			</section>
		</main>
	);
}
