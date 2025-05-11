"use client";

import { useState, useEffect, JSX, FormEvent, Suspense } from "react";
import BibleForm from "./components/BibleForm";
import { useSearchParams } from "next/navigation";
import { BibleFormData, Verses, LLMReqObject } from "@/lib/definitions";
import BibleVerses from "./components/BibleVerses";
import { Button } from "@/components/ui/button";
import { DefaultBibleFormData } from "@/lib/bible/bibleData";
import AIOptions from "@/app/bible/components/AIOptions";
import AIOutput from "@/app/bible/components/AIOutput";
import SaveModalForm from "./components/SaveModalForm";



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
		<Suspense fallback={<p>...loading</p>}>
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

	const [LLMReqAndOutput, setLLMReqAndOutPut] = useState<LLMReqObject[]>(initLLMReqAndOutput);
	const [LLMisLoading, setLLMisLoading] = useState<boolean>(false);

	const [showSaveForm, setShowSaveForm] = useState<boolean>(false);

	useEffect((): void => {
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

				{showChapterText && (
					<AIOptions
						selectedBibleData={bibleData}
						updateOutput={(output: string, index: number): void => updateLLMOutputData(output, index)}
						startLoading={(): void => setLLMisLoading(true)}
						stopLoading={(): void => setLLMisLoading(false)}
					/>
				)}
			</section>

			{showChapterText && (
				<section className="flex flex-col gap-5 my-10 col-span-2">
					<div>
						<h2 className="uppercase font-extrabold text-3xl">{`${bibleData.book} ${bibleData.chapter}:${bibleData.startVerse} - ${bibleData.endVerse}`}</h2>

						<div className="flex flex-row flex-start gap-2">
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
							<Button
								className="hover:cursor-pointer my-3"
								onClick={(): void => setShowSaveForm(true)}
							>
								Save
							</Button>
							<Button
								className="hover:cursor-pointer my-3"
								onClick={(): void => alert("This will trigger the download function")}
							>
								Download
							</Button>
						</div>
					</div>

					<BibleVerses
						versesArray={currentChapterText}
						startVerse={bibleData.startVerse}
						endVerse={bibleData.endVerse}
					/>
					<AIOutput
						LLMData={LLMReqAndOutput}
						isLoading={LLMisLoading}
					/>
				</section>
			)}

			<SaveModalForm
				isOpen={showSaveForm}
				openHandler={setShowSaveForm}
				cancelHandler={(): void => setShowSaveForm(false)}
				confirmHandler={(): void => setShowSaveForm(false)}
				currentData={{
						bibleData: bibleData,
						LLMOutput: LLMReqAndOutput
				}}
			/>
		</main>
	);
}
