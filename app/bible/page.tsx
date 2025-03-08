"use client";

import { useState, useEffect, JSX, FormEvent } from "react";
import BibleForm from "./components/BibleForm";
import { useSearchParams } from "next/navigation";
import { BibleFormData, Verses } from "@/lib/definitions";
import BibleVerses from "./components/BibleVerses";
import { Button } from "@/components/ui/button";
import { DefaultBibleFormData } from "@/lib/bible/bibleData";

export default function Bible(): JSX.Element {
	const searchParams = useSearchParams();
	const [currentChapterText, setCurrentChapterText] = useState<Verses[]>([]);
	const [showChapterText, setShowChapterText] = useState<boolean>(false);
	const [bibleData, setBibleData] = useState<BibleFormData>(DefaultBibleFormData);

	useEffect((): void => {
		console.log('Firing');
		const version = searchParams.get("version") as string;
		const book = searchParams.get("book") as string;
		const chapter = searchParams.get("chapter") as string;
		const startVerse = searchParams.get("startVerse") as string;
		const endVerse = searchParams.get("endVerse") as string;

		const neededValues: string[] = [version, book, chapter, startVerse, endVerse];
		let isValid = true;
		neededValues.forEach((value: string) => {
			if (value?.length === 0 || value === null) {
				isValid = false;
			}
		});

		if (isValid) {
			console.log('Fired again');
			setShowChapterText(true);
			setBibleData({
				...bibleData,
				version: version,
				book: book,
				chapter: chapter,
				startVerse: startVerse,
				endVerse: endVerse,
			});
		}
	}, []);

	const formHandler = (e: FormEvent<HTMLFormElement>, formData: BibleFormData) => {
		e.preventDefault();
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
								className="hover:cursor-pointer my-3"
								onClick={(): void => setBibleData({
									...bibleData, 
									startVerse: '1',
									endVerse: currentChapterText.length.toString(),
								})}
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
