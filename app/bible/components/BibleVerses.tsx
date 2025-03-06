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

	return (
		<div>
			{neededVerses.map(
				(x: Verses, y: number): JSX.Element => (
					<p key={`verse_item_${y}`}>{`${x.verse}. ${x.text} `}</p>
				)
			)}
		</div>
	);
}
