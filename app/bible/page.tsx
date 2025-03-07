"use client";

import { useState, useEffect, JSX, FormEvent } from "react";
import BibleForm from "./components/BibleForm";
import { BibleFormData, Verses } from "@/lib/definitions";
import BibleVerses from "./components/BibleVerses";
import { Button } from "@/components/ui/button";

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

	const formHandler = (e: FormEvent<HTMLFormElement>, formData: BibleFormData) => {
		e.preventDefault();
		console.log('HEREEE ', formData);
		setShowChapterText(true);
		setBibleData({
			...bibleData,
			version: formData.version,
			book: formData.book,
			chapter: formData.chapter,
			startVerse: formData.startVerse,
			endVerse: formData.endVerse
		});
	};

	return (
		<div className="mt-6">
			<main>
				<BibleForm
					submitHandler={formHandler}
					updateNeededChapter={(data: Verses[]) => setCurrentChapterText(data)}
				/>

				{showChapterText && (
					<section className="flex flex-col gap-5 my-10">
						<div>
							<h2 className="uppercase font-extrabold text-3xl">{`${bibleData.book} ${bibleData.chapter}:${bibleData.startVerse} - ${bibleData.endVerse}`}</h2>
							<Button
								className="hover:cursor-pointer"
							>
								Read Full Chapter
							</Button>
						</div>
						<BibleVerses
							versesArray={currentChapterText}
							startVerse={bibleData.startVerse}
							endVerse={bibleData.endVerse}
						/>
					</section>
				)}
			</main>
		</div>
	);
}
