"use client";

import { useState, useEffect, JSX, FormEvent } from "react";
import Books from "@/app/bible/components/Books";
import { useSearchParams } from "next/navigation";
import Options from "@/app/ui/Options";
import { BookAndChapters, SelectFields, BibleFormData, Verses, ChapterResponse } from "@/lib/definitions";
import { TestamentOptions, BooksOfTheBible, EnglishBibleVersions } from "@/lib/bibleData";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

type BibleFormProps = {
	submitHandler: Function;
	updateNeededChapter: Function;
};

export default function BibleForm({ submitHandler, updateNeededChapter }: BibleFormProps): JSX.Element {
	const searchParams = useSearchParams();
	const form = useForm();

	const [bibleForm, setBibleForm] = useState<BibleFormData>({
		version: "",
		book: "",
		chapter: "",
		startVerse: "",
		endVerse: "",
	});
	const [viableChapters, setViableChapters] = useState<SelectFields[]>([{ value: "1", text: "1" }]);
	const [verses, setVerses] = useState<SelectFields[]>([
		{
			text: "1",
			value: "1",
		},
	]);

	//Get the chapters according to the book and testament that are currently selected.
	const getChapters = (bible: BookAndChapters[], book: string) => {
		const numberOfChapters: BookAndChapters[] = bible.filter((x: BookAndChapters, y: number) => {
			if (x.value === book) {
				return x;
			}
		});

		if (numberOfChapters.length > 0) {
			let allChapters = [];
			for (let i = 0; i < numberOfChapters[0].chapters; i++) {
				let currentValue = i + 1;
				let currentObj = {
					value: currentValue.toString(),
					text: currentValue.toString(),
				};
				allChapters.push(currentObj);
			}
			setViableChapters(allChapters);
		} else {
			setViableChapters([]);
		}
	};

	//Update the viable chapters when the testament or book update.
	useEffect((): void => {
		const book = bibleForm.book.toLowerCase();

		if (book.length > 0) {
			getChapters(BooksOfTheBible, book);
		}
	}, [bibleForm]);

	//Retrieve the selected chapter, we're getting the full chapter to determine the verses that can be selected.
	useEffect((): void => {
		if (bibleForm.chapter.length > 0) {
			const verses = async (): Promise<any> => await fetch(`https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${bibleForm.version}/books/${bibleForm.book.toLowerCase()}/chapters/${bibleForm.chapter}.json`);

			verses()
				.then((data: Response): Promise<ChapterResponse> => {
					return data.json();
				})
				.then((final: ChapterResponse): void => {
					const convertedOptionData: SelectFields[] = final.data.map((x: Verses, y: number): SelectFields => {
						let newObj = {
							text: x.verse,
							value: x.verse,
						};

						return newObj;
					});
					setVerses(convertedOptionData);
					updateNeededChapter(final);
				})
				.catch((error) => {
					console.warn("The following error occurred ", error);
				});
		}
	}, [bibleForm.chapter]);

	const returnSearchParamValues = (key: string): string => {
		if (searchParams.has(key)) {
			return searchParams.get(key) as string;
		} else {
			return "";
		}
	};

	const getSelectTextValue = (key: string, selectValues: SelectFields[]): string => {
		const paramValue = returnSearchParamValues(key);
		if (paramValue.length > 0) {
			const getTextValue: SelectFields[] = selectValues.filter((x: SelectFields): SelectFields | undefined => {
				if (paramValue === x.value) {
					return x;
				}
			});

			if (getTextValue.length > 0) {
				return getTextValue[0].text;
			} else {
				return "";
			}
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
	}, []);

	//Change handler for our select elements
	const selectChangeHandler = (key: string, value: string): void => {
		setBibleForm({
			...bibleForm,
			[key as keyof BibleFormData]: value,
		});
		console.log(bibleForm);
	};

	//Get the data for the selected book, this will be used to populate the chapters needed.
	const bookFilter = (books: BookAndChapters[], value: string): string => {
		const book = books.filter((x: BookAndChapters, y: number): BookAndChapters | undefined => {
			if (x.value === value) {
				return x;
			}
		});
		return book[0].value;
	};

	return (
		<div className="mt-6">
			<main>
				<Form {...form}>
					<form onSubmit={(e) => submitHandler(e)}>
						<div className="grid grid-flow-col grid-columns-3 gap-4">
							<Options
								options={EnglishBibleVersions}
								sectionTitle="Select a Bible Version"
								optionsID="bible-version"
								changeHandler={(value: string): void => selectChangeHandler("version", value)}
								placeholderText="Select a Bible Version"
								selectedValue={getSelectTextValue("bible-version", EnglishBibleVersions)}
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
								selectedValue={getSelectTextValue("book", BooksOfTheBible)}
							/>

							<Options
								changeHandler={(value: string): void => selectChangeHandler("chapter", value)}
								sectionTitle="Select Chapter"
								options={viableChapters}
								optionsID={"chapter"}
								placeholderText="Select Chapter"
								selectedValue={getSelectTextValue("chapter", viableChapters)}
							/>

							<Options
								changeHandler={(value: string): void => selectChangeHandler("startVerse", value)}
								sectionTitle="Starting Verse"
								options={verses}
								optionsID={"startVerse"}
								placeholderText="Select Starting Verse"
								selectedValue={getSelectTextValue("startVerse", verses)}
							/>

							<Options
								changeHandler={(value: string): void => selectChangeHandler("endVerse", value)}
								sectionTitle="Ending Verse"
								options={verses.slice(Number(bibleForm.startVerse) - 1)}
								optionsID={"endVerse"}
								placeholderText="Select Ending Verse"
								selectedValue={getSelectTextValue("endVerse", verses.slice(Number(bibleForm.startVerse) - 1))}
							/>
						</div>
						<input
							type="submit"
							value="Submit"
							className="bg-zinc-900 hover:bg-zinc-800 py-2 px-6 min-w-40 justify-center rounded-md text-white hover:cursor-pointer my-4"
						/>
					</form>
				</Form>
			</main>
		</div>
	);
}
