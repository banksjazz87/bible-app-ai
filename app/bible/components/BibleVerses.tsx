"use client";
import { JSX } from "react";
import { Verses } from "@/lib/definitions";

type BibleVersesProps = {
	startVerse: string;
	endVerse: string;
	versesArray: Verses[];
};

export default function BibleVerses({ versesArray, startVerse, endVerse }: BibleVersesProps): JSX.Element {
	const numOfStart: number = Number(startVerse) - 1;
	const numOfEnd: number = Number(endVerse);
	const neededVerses: Verses[] = versesArray.slice(numOfStart, numOfEnd);

	const verseConstruct = neededVerses.map((x: Verses, y: number) => {
		if (y === 0) {
			return (
				<span key={`bible_verse_${y}`}>
					<strong>{`${x.verse}.`}</strong>
					{` ${x.text}`}
				</span>
			);
		} else {
			return (
				<span key={`bible_verse_${y}`}>
					<strong>{`  ${x.verse}.`}</strong>
					{` ${x.text}`}
				</span>
			);
		}
	});

	return (
		<>
			<p>{verseConstruct}</p>
		</>
	);
}
