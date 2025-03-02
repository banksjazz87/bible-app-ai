"use client";

import { useState, useEffect } from "react";
import Books from "@/app/bible/components/Books";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Options from "../ui/Options";
import { BookAndChapters, SelectFields } from "@/lib/definitions";
import { oldTestamentBooks, newTestamentBooks, EnglishBibleVersions } from "@/lib/bibleData";

type BibleForm = {
	version: string;
	testament: string;
	book: string;
	chapter: number;
	verse: string;
};
export default function Bible() {
	const [testament, setTestament] = useState<string>("");
	const [bibleForm, setBibleForm] = useState<BibleForm>({
		version: "",
		testament: "",
		book: "",
		chapter: -1,
		verse: "",
	});
	const [viableChapters, setViableChapters] = useState<SelectFields[]>([{ value: "1", text: "1" }]);

	//Get the chapters according to the book and testament that are currently selected.
	const getChapters = (testament: BookAndChapters[], book: string) => {
		const numberOfChapters: BookAndChapters[] = testament.filter((x: BookAndChapters, y: number) => {
			if (x.book.toLowerCase() === book) {
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
				getChapters(oldTestamentBooks, book);
			} else {
				getChapters(newTestamentBooks, book);
			}
		}
	}, [bibleForm]);

	const selectChangeHandler = (key: string, value: string): void => {
		setBibleForm({
			...bibleForm,
			[key as keyof BibleForm]: value,
		});
		console.log(bibleForm);
	};

	//Get the data for the selected book, this will be used to populate the chapters needed.
	const bookFilter = (books: BookAndChapters[], value: string): BookAndChapters[] => {
		const book = books.filter((x: BookAndChapters, y: number): BookAndChapters | undefined => {
			if (x.book.toLowerCase() === value) {
				return x;
			}
		});
		return book;
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
						/>

						<Options
							changeHandler={(value: string): void => selectChangeHandler("testament", value)}
							sectionTitle="Old or New Testament?"
							options={[
								{ value: "old", text: "Old Testament" },
								{ value: "new", text: "New Testament" },
							]}
							optionsID={testament}
							placeholderText="Select Testament"
						/>

						{bibleForm.testament === "old" && (
							<Books
								books={oldTestamentBooks}
								changeHandler={(value: string): void => {
									const bookMatch = bookFilter(oldTestamentBooks, value);
									if (bookMatch.length > 0) {
										selectChangeHandler("book", bookMatch[0].book);
									}
								}}
								sectionTitle="Old Testament Books"
								optionsID="book"
							/>
						)}

						{bibleForm.testament === "new" && (
							<Books
								books={newTestamentBooks}
								changeHandler={(value: string): void => {
									const bookMatch = bookFilter(newTestamentBooks, value);
									if (bookMatch) {
										selectChangeHandler("book", bookMatch[0].book);
									}
								}}
								sectionTitle="New Testament Books"
								optionsID="book"
							/>
						)}

						{viableChapters.length > 1 && (
							<Options
								changeHandler={(value: string): void => selectChangeHandler("chapter", value)}
								sectionTitle="Select Chapter"
								options={viableChapters}
								optionsID={testament}
								placeholderText="Select Chapter"
							/>
						)}
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
