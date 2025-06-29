"use client";

import { use } from "react";
import { ChatThread, APIDataResponse } from "@/lib/definitions";

type PastThreadsProps = {
    threads: Promise<APIDataResponse<ChatThread[] | null>>
}

export default async function PastThreads({threads}: PastThreadsProps) {
    const pastThreads = use(threads);

    return (
        <ul>
            {pastThreads && pastThreads.data?.map((thread) =>
                <li>{thread.thread_name}</li>
            )}
        </ul>
    );
}
