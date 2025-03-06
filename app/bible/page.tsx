"use client";

import { useState, useEffect, JSX, FormEvent } from "react";
import BibleForm from "./components/BibleForm";
import { BibleFormData, Verses } from "@/lib/definitions";
import BibleVerses from "./components/BibleVerses";
import { bibleFormSubmit } from "@/lib/actions";

export default function Bible(): JSX.Element {
	const [currentChapterText, setCurrentChapterText] = useState<Verses[]>([]);
	const [showChapterText, setShowChapterText] = useState<boolean>(false);
	const [bibleData, setBibleData] = useState<BibleFormData>({
		version: "",
		book: "",
		chapter: "",
		startVerse: "",
		endVerse: ""
	});

	const formHandler = () => {

		// setShowChapterText(true);
		console.log('HEREEEE', bibleData);
	};

	return (
		<div className="mt-6">
			<main>
				<BibleForm
					// submitHandler={formHandler}
					updateNeededChapter={(data: Verses[]) => setCurrentChapterText(data)}
				/>

				{showChapterText && (
					<BibleVerses
						versesArray={currentChapterText}
						startVerse={bibleData.startVerse}
						endVerse={bibleData.endVerse}
					/>
				)}
			</main>
		</div>
	);
}
