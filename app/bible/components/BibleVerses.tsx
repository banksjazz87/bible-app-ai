"use client";
import { JSX } from "react";
import { Verses } from "@/lib/definitions";
import DOMPurify from "dompurify";

type BibleVersesProps = {
	startVerse: string;
	endVerse: string;
	versesArray: Verses[];
	passageContent: string;
};

export default function BibleVerses({ versesArray, startVerse, endVerse, passageContent }: BibleVersesProps): JSX.Element {
	const numOfStart: number = Number(startVerse) - 1;
	const numOfEnd: number = Number(endVerse);
	const neededVerses: Verses[] = versesArray.slice(numOfStart, numOfEnd);
	const cleanPassageContent = DOMPurify.sanitize(passageContent);

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
		<div className="bible_html_content" dangerouslySetInnerHTML={{__html: cleanPassageContent}}>
			
		</div>
	);
}
