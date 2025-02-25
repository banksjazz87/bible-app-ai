'use client'

import { useSearchParams } from 'next/navigation';
import Versions from "@/app/bible/components/Versions";

export default function Bible() {
    const searchParams = useSearchParams();

    
    return (
        <div>
            <h1>This is the bible page</h1>

            <main>
                <form>
                    <Versions />
                </form>
            </main>
        </div>

    )
}