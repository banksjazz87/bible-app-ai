"use client";

import { useState, useEffect, JSX, useEffectEvent } from "react";
import Books from "@/app/bible/components/Books";
import { useSearchParams } from "next/navigation";
import Options from "@/app/ui/Options";
import { SelectFields, BibleFormData, ChapterResponse, BibleFormProps, Bible, BibleAPIDataResponse, BooksObject, BookAndChapters, BibleChapterObject } from "@/lib/definitions";
import { BooksOfTheBible, EnglishBibleVersions, DefaultBibleFormData, BibleVersions } from "@/lib/bible/bibleData";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { getChapters, retrieveBibleChapter, convertVerseDataToOptions, getSelectTextValue, getBibles, getBooks } from "@/lib/bible/bibleMethods";
import { getUserData } from "@/lib/store/features/account/loginSlice";
import { useAppSelector } from "@/lib/store/hooks";

export default function BibleForm({ updateNeededChapter, submitHandler }: BibleFormProps): JSX.Element {
	const searchParams = useSearchParams();
	const form = useForm();
	const loggedInDetails = useAppSelector(getUserData);

	//Use state definitions
	const [bibleForm, setBibleForm] = useState<BibleFormData>(DefaultBibleFormData);
	const [bibleVersions, setBibleVersions] = useState<SelectFields[]>([{ value: "1", text: "1" }]);
	const [books, setBooks] = useState<SelectFields[]>([{ value: "1", text: "1"}]);
	const [viableChapters, setViableChapters] = useState<SelectFields[]>([{ value: "1", text: "1" }]);
	const [verses, setVerses] = useState<SelectFields[]>([{ text: "1", value: "1" }]);

	//Update the viable chapters when the testament or book update.
	useEffect((): void => {
		const book = bibleForm.book.toLowerCase();
		if (book.length > 0) {
			getChapters(BooksOfTheBible, book, setViableChapters);
		}
	}, [bibleForm.book]);

	//Retrieve the selected chapter, we're getting the full chapter to determine the verses that can be selected.
	useEffect((): void => {
		const allDataPresent = bibleForm.chapter.length > 0 && bibleForm.book.length > 0 && bibleForm.version.length > 0;
		if (allDataPresent) {
			retrieveBibleChapter(bibleForm.version, bibleForm.book, bibleForm.chapter)
				.then((data: ChapterResponse | undefined): void => {
					if (!data) {
						return;
					}

					console.log("Bibile CHAPTER DATA ", data);
					convertVerseDataToOptions(data.data, setVerses, updateNeededChapter);
				})
				.catch((e: unknown) => console.warn("The following error occurred while updating the verse data ", e))
				.finally(() => {
					return;
				});
		}
	}, [bibleForm]);

	const fetchBooks = (bibleVersion: string): void => {
		getBooks(bibleVersion)
			.then((data: BibleAPIDataResponse<BooksObject> | undefined) => {
				console.log("Book data here: ", data);
				if (!data) {
					console.warn("Unable to retrieve the book data.");
					return;
				}
				const booksData: SelectFields[] = data.data.map((x: BooksObject) => {
					return {
						value: x.id,
						text: x.name,
					};
				});
				setBooks(booksData);
			})
			.catch((e: unknown) => console.warn(`Error accessing the book information: ${e instanceof Error && e.message}`))
			.finally(() => {
				return;
			});
	};

	const fetchChapters = (bibleID: string, bookID: string): void => {
		getChapters(bibleID, bookID)
			.then((data: BibleAPIDataResponse<BibleChapterObject> | undefined) => {
				if (!data) {
					console.warn("Unable to retrieve the chapter data.");
					return;
				}
				const chapterData: SelectFields[] = data.data.map((x: BibleChapterObject) => {
					return {
						value: x.id,
						text: x.number,
					}
				});
				
				setViableChapters(chapterData);

			})
			.catch((e: unknown) => console.warn(`Error accessing the chapter data: ${e instanceof Error && e.message}`))
			.finally(() => {
				return
			});
	}

	const returnSearchParamValues = (key: string): string => {
		if (searchParams.has(key)) {
			return searchParams.get(key) as string;
		} else {
			return "";
		}
	};

	const updateBibleData = useEffectEvent((): void => {
		setBibleForm({
			...bibleForm,
			version: returnSearchParamValues("bible-version"),
			book: returnSearchParamValues("book"),
			chapter: returnSearchParamValues("chapter"),
			startVerse: returnSearchParamValues("startVerse"),
			endVerse: returnSearchParamValues("endVerse"),
		});
	});

	useEffect((): void => {
		const book = returnSearchParamValues("book");
		const version = returnSearchParamValues("version");
		const chapter = returnSearchParamValues("chapter");

		const allDataPresent = version.length > 0 && book.length > 0 && chapter.length > 0;
		if (allDataPresent) {
			updateBibleData();
			retrieveBibleChapter(version, book, chapter)
				.then((data: ChapterResponse | undefined): void => {
					if (data !== undefined) {
						convertVerseDataToOptions(data.data, setVerses, updateNeededChapter);
					}
				})
				.catch((e: unknown) => console.warn("The following error occurred while updating the verse data ", e));
		}
	}, []);

	//Retrieves the different bible versions
	useEffect(() => {
		async function getBibleVersionData() {
			const bibleList = await getBibles();
			const selectBibles = BibleVersions;
			if (bibleList) {
				const list: SelectFields[] = [{ value: "", text: "" }];
				const keys: string[] = [];
				bibleList.data.forEach((x: Bible) => {
					if (selectBibles.indexOf(x.abbreviation) > -1 && keys.indexOf(x.abbreviation) === -1) {
						list.push({
							value: x.id,
							text: x.name,
						});
						keys.push(x.abbreviation);
					}
				});
				list.shift();
				setBibleVersions(list);
			}
		}
		getBibleVersionData();
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
					onSubmit={form.handleSubmit(submitHandler)}
				>
					<div className="flex flex-col gap-4">
						<p>{`Max requests: ${loggedInDetails.maxRequests}`}</p>
						<h2 className="font-bold text-xl">Select your options:</h2>
						<Options
							options={bibleVersions}
							sectionTitle="Select a Bible Version"
							optionsID="version"
							changeHandler={(value: string): void => {
								selectChangeHandler("version", value);
								fetchBooks(value);
							}}
							placeholderText="Select a Bible Version"
							selectedValue={getSelectTextValue("version", EnglishBibleVersions, returnSearchParamValues)}
						/>

						{/* <Books
							books={books}
							changeHandler={(value: string): void => selectChangeHandler("book", value)}
							sectionTitle="Book"
							optionsID="book"
							placeholder="Book"
							selectedValue={getSelectTextValue("book", BooksOfTheBible, returnSearchParamValues)}
						/> */}

						<Options
							changeHandler={(value: string): void => {
								selectChangeHandler("book", value);
								fetchChapters(bibleForm.version, value);
							}
							}
							sectionTitle="Book"
							options={books}
							optionsID="book"
							placeholderText="Book"
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
