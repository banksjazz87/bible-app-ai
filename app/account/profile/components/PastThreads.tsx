import { useEffect, useState } from "react";
// import { GetThreads } from "@/lib/data";
import { ChatThread, APIDataResponse } from "@/lib/definitions";
import type { NextApiResponse } from 'next';


export default function PastThreads() {

    const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);

    useEffect((): void => {
        const fetchThreads = async (): Promise<Response> => {
					const data = await fetch("/account/api/profile/threads");
					return data;
				};

        fetchThreads()
            .then((data: Response) => {
                data.json();
            })
            .then((final: void) => {
                if (final.status === 200) {

                }
            })
            .catch(error => console.error(error));

    }, []);

    return (
        <p>This will be the past threads component</p>
    )
}