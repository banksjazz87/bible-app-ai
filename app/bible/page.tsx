"use client";

import { useState, useEffect, JSX } from "react";
import Books from "@/app/bible/components/Books";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Options from "../ui/Options";
import { BookAndChapters, SelectFields, BibleForm, Verses, ChapterResponse } from "@/lib/definitions";
import { TestamentOptions, OldTestamentBooks, NewTestamentBooks, EnglishBibleVersions } from '@/lib/bibleData';

export default function Bible(): JSX.Element {
	const pathName = usePathname();
	const searchParams = useSearchParams();

	const [bibleForm, setBibleForm] = useState<BibleForm>({
		version: "",
		testament: "",
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
	const getChapters = (testament: BookAndChapters[], book: string) => {
		const numberOfChapters: BookAndChapters[] = testament.filter((x: BookAndChapters, y: number) => {
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
		const testament = bibleForm.testament;

		if (book.length > 0 && testament.length > 0) {
			if (testament === "old") {
				getChapters(OldTestamentBooks, book);
			} else {
				getChapters(NewTestamentBooks, book);
			}
		}
	}, [bibleForm]);


	//Retrieve the selected chapter, we're getting the full chapter to determine the verses that can be selected.
	useEffect((): void => {
		if (bibleForm.chapter.length > 0) {
			const verses = async(): Promise<any> =>  await fetch(`https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${bibleForm.version}/books/${bibleForm.book.toLowerCase()}/chapters/${bibleForm.chapter}.json`);

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
				})
				.catch((error) => {
					console.warn("The following error occurred ", error);
				});
		}
	}, [bibleForm.chapter]);


	const returnSearchParamValues = (key: string, selectValues: SelectFields[]): string => {
		if (searchParams.has(key)) {
			const paramValue = (searchParams.get(key) as string).toString();
			const getTextValue: SelectFields[] = selectValues.filter((x: SelectFields): SelectFields | undefined => {
				if (paramValue === x.value) {
					return x;
				}
			});

			if (getTextValue.length > 0) {
				return getTextValue[0].text;
			} else {
				return '';
			}
		} else {
			return '';
		}
	}

	useEffect((): void => {
		setBibleForm({
			...bibleForm,
			version: returnSearchParamValues("bible-version", EnglishBibleVersions),
			testament: returnSearchParamValues("testament", TestamentOptions),
			book: bibleForm.testament === 'Old' ? returnSearchParamValues("book", OldTestamentBooks) : returnSearchParamValues("book", NewTestamentBooks),
			chapter: returnSearchParamValues("chapter", viableChapters),
			startVerse: returnSearchParamValues("startVerse", verses),
			endVerse: returnSearchParamValues("endVerse", verses.slice(Number(bibleForm.startVerse) -1 )),
		});
	}, []);


	//Change handler for our select elements
	const selectChangeHandler = (key: string, value: string): void => {
		setBibleForm({
			...bibleForm,
			[key as keyof BibleForm]: value,
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
				<form>
					<div className="grid grid-flow-col grid-columns-3 gap-4">
						<Options
							options={EnglishBibleVersions}
							sectionTitle="Select a Bible Version"
							optionsID="bible-version"
							changeHandler={(value: string): void => selectChangeHandler("version", value)}
							placeholderText="Select a Bible Version"
							selectedValue={bibleForm.version}
						/>

						<Options
							changeHandler={(value: string): void => selectChangeHandler("testament", value)}
							sectionTitle="Old or New Testament?"
							options={TestamentOptions}
							optionsID={"testament"}
							placeholderText="Select Testament"
							selectedValue={bibleForm.testament}
						/>

						{bibleForm.testament === "old" && (
							<Books
								books={OldTestamentBooks}
								changeHandler={(value: string): void => {
									const bookMatch = bookFilter(OldTestamentBooks, value);
									if (bookMatch.length > 0) {
										selectChangeHandler("book", bookMatch);
									}
								}}
								sectionTitle="Old Testament Books"
								optionsID="book"
								placeholder="Book"
								selectedValue={bibleForm.book}
							/>
						)}

						{bibleForm.testament === "new" && (
							<Books
								books={NewTestamentBooks}
								changeHandler={(value: string): void => {
									const bookMatch = bookFilter(NewTestamentBooks, value);
									if (bookMatch) {
										selectChangeHandler("book", bookMatch);
									}
								}}
								sectionTitle="New Testament Books"
								optionsID="book"
								placeholder="Book"
								selectedValue={bibleForm.book}
							/>
						)}

						<Options
							changeHandler={(value: string): void => selectChangeHandler("chapter", value)}
							sectionTitle="Select Chapter"
							options={viableChapters}
							optionsID={"chapter"}
							placeholderText="Select Chapter"
							selectedValue={bibleForm.chapter}
						/>

						<Options
							changeHandler={(value: string): void => selectChangeHandler("startVerse", value)}
							sectionTitle="Starting Verse"
							options={verses}
							optionsID={"startVerse"}
							placeholderText="Select Starting Verse"
							selectedValue={bibleForm.startVerse}
						/>

						<Options
							changeHandler={(value: string): void => selectChangeHandler("endVerse", value)}
							sectionTitle="Ending Verse"
							options={verses.slice(Number(bibleForm.startVerse) - 1)}
							optionsID={"endVerse"}
							placeholderText="Select Ending Verse"
							selectedValue={bibleForm.endVerse}
						/>
					</div>
					<input
						type="submit"
						value="Submit"
						className="bg-zinc-900 hover:bg-zinc-800 py-2 px-6 min-w-40 justify-center rounded-md text-white hover:cursor-pointer my-4"
					/>
				</form>
			</main>
		</div>
	);
}
