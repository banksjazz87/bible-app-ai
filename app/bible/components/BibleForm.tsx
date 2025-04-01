"use client";

import { useState, useEffect, JSX, FormEvent, useActionState } from "react";
import Books from "@/app/bible/components/Books";
import { useSearchParams } from "next/navigation";
import Options from "@/app/ui/Options";
import { SelectFields, BibleFormData, Verses, ChapterResponse, BibleFormProps } from "@/lib/definitions";
import { BooksOfTheBible, EnglishBibleVersions, DefaultBibleFormData } from "@/lib/bible/bibleData";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { getChapters, retrieveBibleChapter, convertVerseDataToOptions, bookFilter, getSelectTextValue } from "@/lib/bible/bibleMethods";

export default function BibleForm({ updateNeededChapter, submitHandler }: BibleFormProps): JSX.Element {
	const searchParams = useSearchParams();
	const form = useForm();

	//Use stat definitions
	const [bibleForm, setBibleForm] = useState<BibleFormData>(DefaultBibleFormData);
	const [viableChapters, setViableChapters] = useState<SelectFields[]>([{ value: "1", text: "1" }]);
	const [verses, setVerses] = useState<SelectFields[]>([{ text: "1", value: "1" }]);

	//Update the viable chapters when the testament or book update.
	useEffect((): void => {
		const book = bibleForm.book.toLowerCase();
		if (book.length > 0) {
			getChapters(BooksOfTheBible, book, setViableChapters);
		}
	}, [bibleForm]);

	//Retrieve the selected chapter, we're getting the full chapter to determine the verses that can be selected.
	useEffect((): void => {
		const allDataPresent = bibleForm.chapter.length > 0 && bibleForm.book.length > 0 && bibleForm.version.length > 0;
		if (allDataPresent) {
			retrieveBibleChapter(bibleForm.version, bibleForm.book, bibleForm.chapter)
				.then((data: ChapterResponse | undefined): void => {
					if (data !== undefined) {
						convertVerseDataToOptions(data.data, setVerses, updateNeededChapter);
					}
				})
				.catch((e: any) => console.warn("The following error occurred while updating the verse data ", e));
		}
	}, [bibleForm]);

	const returnSearchParamValues = (key: string): string => {
		if (searchParams.has(key)) {
			return searchParams.get(key) as string;
		} else {
			return "";
		}
	};

	useEffect((): void => {
		setBibleForm({
			...bibleForm,
			version: returnSearchParamValues("bible-version"),
			book: returnSearchParamValues("book"),
			chapter: returnSearchParamValues("chapter"),
			startVerse: returnSearchParamValues("startVerse"),
			endVerse: returnSearchParamValues("endVerse"),
		});

		const book = returnSearchParamValues("book");
		const version = returnSearchParamValues("version");
		const chapter = returnSearchParamValues("chapter");

		const allDataPresent = version.length > 0 && book.length > 0 && chapter.length > 0;
		if (allDataPresent) {
			retrieveBibleChapter(version, book, chapter)
				.then((data: ChapterResponse | undefined): void => {
					if (data !== undefined) {
						convertVerseDataToOptions(data.data, setVerses, updateNeededChapter);
					}
				})
				.catch((e: any) => console.warn("The following error occurred while updating the verse data ", e));
		}
	}, []);

	//Change handler for our select elements
	const selectChangeHandler = (key: string, value: string): void => {
		setBibleForm({
			...bibleForm,
			[key as keyof BibleFormData]: value,
		});
	};

	return (
		<div className="border-slate-800 border rounded-md p-5">
			<Form {...form}>
				<form
					id="bible-form"
					onSubmit={(e: FormEvent<HTMLFormElement>): void => submitHandler(e, bibleForm)}
					method={"/bible"}
				>
					<div className="flex flex-col gap-4">
						<h2 className="font-bold text-xl">Select your options:</h2>
						<Options
							options={EnglishBibleVersions}
							sectionTitle="Select a Bible Version"
							optionsID="version"
							changeHandler={(value: string): void => selectChangeHandler("version", value)}
							placeholderText="Select a Bible Version"
							selectedValue={getSelectTextValue("version", EnglishBibleVersions, returnSearchParamValues)}
						/>

						<Books
							books={BooksOfTheBible}
							changeHandler={(value: string): void => {
								const bookMatch = bookFilter(BooksOfTheBible, value);
								if (bookMatch.length > 0) {
									selectChangeHandler("book", bookMatch);
								}
							}}
							sectionTitle="Book"
							optionsID="book"
							placeholder="Book"
							selectedValue={getSelectTextValue("book", BooksOfTheBible, returnSearchParamValues)}
						/>

						<Options
							changeHandler={(value: string): void => selectChangeHandler("chapter", value)}
							sectionTitle="Select Chapter"
							options={viableChapters}
							optionsID="chapter"
							placeholderText="Select Chapter"
							selectedValue={getSelectTextValue("chapter", viableChapters, returnSearchParamValues)}
						/>

						<Options
							changeHandler={(value: string): void => selectChangeHandler("startVerse", value)}
							sectionTitle="Starting Verse"
							options={verses}
							optionsID="startVerse"
							placeholderText="Select Starting Verse"
							selectedValue={bibleForm.startVerse}
						/>

						<Options
							changeHandler={(value: string): void => selectChangeHandler("endVerse", value)}
							sectionTitle="Ending Verse"
							options={verses.slice(Number(bibleForm.startVerse) - 1)}
							optionsID="endVerse"
							placeholderText="Select Ending Verse"
							selectedValue={bibleForm.endVerse}
						/>
					</div>
					<input
						type="submit"
						value="Submit"
						className="bg-zinc-900 hover:bg-zinc-800 py-2 px-6 min-w-40 inline-block w-auto justify-center rounded-md text-white hover:cursor-pointer my-4"
					/>
				</form>
			</Form>
		</div>
	);
}
