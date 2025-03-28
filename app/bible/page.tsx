"use client";

import { useState, useEffect, JSX, FormEvent, Suspense } from "react";
import BibleForm from "./components/BibleForm";
import { useSearchParams } from "next/navigation";
import { BibleFormData, Verses } from "@/lib/definitions";
import BibleVerses from "./components/BibleVerses";
import { Button } from "@/components/ui/button";
import { DefaultBibleFormData } from "@/lib/bible/bibleData";
import OpenAI from "openai";
import AIOptions from "@/app/bible/components/AIOptions";

type LLMReqObject = {
	heading: string;
	output: string;
}


const initLLMReqAndOutput = [
	{
		heading: "What is this about?",
		output: ""
	},
	{
		heading: "Suggested Sermon",
		output: ""
	},
	{
		heading: "Discussion Questions",
		output: ""
	}
];

export default function Bible(): JSX.Element {
	return (
		<Suspense>
			<PageContent />
		</Suspense>
	);
}

function PageContent() {
	const searchParams = useSearchParams();
	const [currentChapterText, setCurrentChapterText] = useState<Verses[]>([]);
	const [showChapterText, setShowChapterText] = useState<boolean>(false);
	const [bibleData, setBibleData] = useState<BibleFormData>(DefaultBibleFormData);
	const [LLMOutput, setLLMOutput] = useState<string>('');

	const [LLMReqAndOutput, setLLMReqAndOutPut] = useState<LLMReqObject[]>(initLLMReqAndOutput)

	useEffect((): void => {
		console.log("Firing");
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
			console.log("Fired again");
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
			endVerse: formData.endVerse,
		});
	};

	const updateLLMOutputData = (output: string, index: number): void => {
		const copyOfData = LLMReqAndOutput.slice();
		copyOfData[index]['output'] = output;
		setLLMReqAndOutPut(copyOfData);
	}

	return (
		<main className="grid grid-cols-3 py-10 gap-10 relative">
			<section
				id="options_sidebar"
				className="sticky top-10 col-span-1 flex flex-col gap-4"
			>
				<BibleForm
					submitHandler={formHandler}
					updateNeededChapter={(data: Verses[]) => setCurrentChapterText(data)}
				/>

				<AIOptions
					selectedBibleData={bibleData}
					updateOutput={(output: string, index: number): void => updateLLMOutputData(output, index)}
				/>
			</section>

			{showChapterText && (
				<section className="flex flex-col gap-5 my-10 col-span-2">
					<div>
						<h2 className="uppercase font-extrabold text-3xl">{`${bibleData.book} ${bibleData.chapter}:${bibleData.startVerse} - ${bibleData.endVerse}`}</h2>

						<Button
							className="hover:cursor-pointer my-3"
							onClick={(): void =>
								setBibleData({
									...bibleData,
									startVerse: "1",
									endVerse: currentChapterText.length.toString(),
								})
							}
						>
							Read Full Chapter
						</Button>
					</div>

					<BibleVerses
						versesArray={currentChapterText}
						startVerse={bibleData.startVerse}
						endVerse={bibleData.endVerse}
					/>
					<div className="col-span-2 flex flex-col gap-5">
						{LLMReqAndOutput.map((x: LLMReqObject, y: number) => {
							if (x.output.length > 0) {
								return (
									<article key={`LLM_output_${y}`}>
										<h2 className="uppercase font-extrabold text-3xl my-5">{x.heading}</h2>
										<div
											dangerouslySetInnerHTML={{ __html: x.output }}
											className="flex flex-col gap-5"
										></div>
									</article>
								);
							}
						})}
					</div>
				</section>
			)}
		</main>
	);
}
