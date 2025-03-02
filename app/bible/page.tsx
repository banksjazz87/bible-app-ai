"use client";

import { useState, useEffect } from "react";
import Books from "@/app/bible/components/Books";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Options from "../ui/Options";
import { BookAndChapters } from "@/lib/definitions";
import { oldTestamentBooks, newTestamentBooks, EnglishBibleVersions } from "@/lib/bibleData";


type BibleForm = {
	version: string;
	testament: 'old' | 'new';
	book: string;
	chapter: number;
	verse: string;
}
export default function Bible() {
	const [testament, setTestament] = useState<string>('');
	const [bibleForm, setBibleForm] = useState<BibleForm>({
		version: '',
		testament: 'old',
		book: '',
		chapter: -1,
		verse: ''

	});


	const selectChangeHandler = (key: string, value: string): void => {
		setBibleForm({
			...bibleForm,
			[key as keyof BibleForm]: value
		});
		console.log(bibleForm);
	}


	//Get the data for the selected book, this will be used to populate the chapters needed.
	const bookFilter = (books: BookAndChapters[], value: string): BookAndChapters[] => {
		const book =  books.filter((x: BookAndChapters, y: number): BookAndChapters | undefined => {
			if (x.book.toLowerCase() === value) {
				return x;
			}
		});
		return book;
	}


	return (
		<div className="mt-6">
			<main>
				<form className="grid grid-flow-col grid-columns-3 gap-4">
					<Options
						options={EnglishBibleVersions}
						sectionTitle="Select a Bible Version"
						optionsID="bible-version"
						changeHandler={(value: string): void => selectChangeHandler('version', value)}
						placeholderText="Select a Bible Version"
					/>

					<Options
                        changeHandler={(value: string): void => selectChangeHandler('testament', value)}
						sectionTitle="Old or New Testament?"
						options={[
							{ value: "old", text: "Old Testament" },
							{ value: "new", text: "New Testament" },
						]}
						optionsID={testament}
						placeholderText="Select Testament"
					/>

					{testament === "old" && (
						<Books
							books={oldTestamentBooks}
							changeHandler={(value: string): void => {
								const bookMatch = bookFilter(oldTestamentBooks, value);
								if (bookMatch.length > 0) {
									selectChangeHandler('book', bookMatch[0].book);
							   }
                            }}
							sectionTitle="Old Testament Books"
							optionsID="book"
						/>
					)}

					{testament === "new" && (
						<Books
							books={newTestamentBooks}
							changeHandler={(value: string): void => {
								const bookMatch = bookFilter(newTestamentBooks, value);
								if (bookMatch) {
									selectChangeHandler('book', bookMatch[0].book);
								}
							}}
							sectionTitle="New Testament Books"
							optionsID="book"
						/>
					)}

				</form>
			</main>
		</div>
	);
}
