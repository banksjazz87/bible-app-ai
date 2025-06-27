import { useEffect } from "react";
// import { GetThreads } from "@/lib/data";


export default function PastThreads() {
    useEffect((): void => {
        const fetchThreads = async () => {
            const data = await fetch("/account/api/profile/threads");
            return data;
        }

        fetchThreads()
            .then(data => data.json())
            .then(final => console.log(final))
            .catch(error => console.error(error));

    }, []);

    return (
        <p>This will be the past threads component</p>
    )
}