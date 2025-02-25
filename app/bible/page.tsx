'use client'

import { useSearchParams } from 'next/navigation';
import { useState } from "react";
import Versions from "@/app/bible/components/Versions";
import Books from "@/app/bible/components/Books";
import { oldTestamentBooks, newTestamentBooks } from '@/lib/bibleData';

export default function Bible() {
    const searchParams = useSearchParams();

    
    return (
        <div>
            <h1>This is the bible page</h1>

            <main>
                <form>
                    <Versions />
                    <p>Old Testament</p>
                    <Books
                        books={oldTestamentBooks}
                        changeHandler={(value: string): void => console.log(value)}
                    />

                    <p>New Testament</p>
                    <Books
                        books={newTestamentBooks}
                        changeHandler={(value: string): void => console.log(value)}
                    />
                </form>
            </main>
        </div>

    )
}