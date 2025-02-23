'use client'

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { BibleVersion } from "@/lib/definitions";

export default function Bible() {
    const [bibleVersions, setBibleVersions] = useState<BibleVersion[]>([]);
    const searchParams = useSearchParams();


    useEffect((): void => {
        const bibleVersions = fetch('https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/bibles.json');
        bibleVersions.then((data: Response): Promise<BibleVersion[]> => {
            return data.json();
        }).then((final: BibleVersion[]): void => {
            console.log(final);
            setBibleVersions(final);
        }).catch((error: any): void => console.error(error));
    }, []);

    
    return (
        <div>
            <h1>This is the bible page</h1>

            <main>
                
            </main>
        </div>

    )
}