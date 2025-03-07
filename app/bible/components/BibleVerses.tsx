"use client";
import { JSX } from "react";
import { Verses } from "@/lib/definitions";

type BibleVersesProps = {
	startVerse: string;
	endVerse: string;
	versesArray: Verses[];
};

export default function BibleVerses({ versesArray, startVerse, endVerse }: BibleVersesProps) {
	const numOfStart: number = Number(startVerse);
	const numOfEnd: number = Number(endVerse);
    const neededVerses: Verses[] = versesArray.slice(numOfStart, versesArray.length - numOfEnd);
    
    const verseConstruct = neededVerses.map((x: Verses, y: number) => {
        if (y = 0) {
            return `${x.verse}. ${x.text}`;
        } else {
            return ` ${x.verse}. ${x.text}`;
        }
    });

    const selectedVerses = verseConstruct.join();

	return (
        <>
            <p>{selectedVerses}</p>
		</>
	);
}
