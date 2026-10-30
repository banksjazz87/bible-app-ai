//Methods used to access bible data.
import { BookAndChapters, ChapterResponse, Verses, SelectFields, BibleResponse, Bible, BookDataResponse } from "@/lib/definitions";

//Get the chapters according to the book and testament that are currently selected.
export function getChapters(bible: BookAndChapters[], book: string, updateChapters: (fields: SelectFields[]) => void) {
	const numberOfChapters: BookAndChapters[] = bible.filter((x: BookAndChapters) => {
		if (x.value === book) {
			return x;
		}
	});

	if (numberOfChapters.length > 0) {
		const allChapters = [];
		for (let i = 0; i < numberOfChapters[0].chapters; i++) {
			const currentValue = i + 1;
			const currentObj = {
				value: currentValue.toString(),
				text: currentValue.toString(),
			};
			allChapters.push(currentObj);
		}
		updateChapters(allChapters);
	} else {
		updateChapters([]);
	}
}

export async function getBibles(): Promise<BibleResponse<Bible[]> | undefined> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_BIBLE_URL}/bibles?language=eng`, {
			headers: {
				"api-key": `${process.env.NEXT_PUBLIC_BIBLE_API_KEY}`,
			},
		});

		if (!response.ok) throw new Error(`Response status: ${response.status}`);

		const data: BibleResponse<Bible[]> = await response.json();
		return data;
	} catch (e: unknown) {
		console.error(`${e instanceof Error && e.message} `);
	}
}

export async function retrieveBibleChapter(version: string, book: string, chapter: string): Promise<ChapterResponse | undefined> {
	const bookToLower = book.toLowerCase();
	try {
		// const verses: Response = await fetch(`https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${version}/books/${bookToLower}/chapters/${chapter}.json`);
		const verses: Response = await fetch(`${process.env.NEXT_PUBLIC_BIBLE_URL}/bibles/${version}/books/${bookToLower}/chapters/${chapter}.json`);
		const verseJSON: ChapterResponse = await verses.json();
		return verseJSON;
	} catch (e: unknown) {
		console.warn("The following error occurred ", e);
	}
}

export async function getBooks(bibleID: string): Promise<BookDataResponse | undefined> {
	const url = `${process.env.NEXT_PUBLIC_BIBLE_URL}/bibles/${bibleID}/books`;

	try {
		const response: Response = await fetch(url, {
			headers: {
				"api-key": `${process.env.NEXT_PUBLIC_BIBLE_API_KEY}`,
			},
		});
		const data: BookDataResponse = await response.json();
		return data;

	} catch (e: unknown) {
		console.warn(e instanceof Error && e.message);
	}
}

export function convertVerseDataToOptions(verseJSON: Verses[], updateVerses: (fields: SelectFields[]) => void, updateChapter: (verses: Verses[]) => void): void {
	const convertedOptionData: SelectFields[] = verseJSON.map((x: Verses): SelectFields => {
		const newObj = {
			text: x.verse,
			value: x.verse,
		};
		return newObj;
	});

	//Adding a check here for duplicate verses, a few of the API responses contain duplicate verses.
	const uniqueVerses = [{ text: "", value: "" }];
	for (let i = 0; i < convertedOptionData.length; i++) {
		if (convertedOptionData[i].value === "1" && i > 0) {
			break;
		}
		uniqueVerses[i] = convertedOptionData[i];
	}

	//Get unique verseJSON values.
	const uniqueVerseJSON: Verses[] = [{ book: "", chapter: "", verse: "", text: "" }];
	for (let i = 0; i < verseJSON.length; i++) {
		if (verseJSON[i].verse === "1" && i > 0) {
			break;
		}
		uniqueVerseJSON[i] = verseJSON[i];
	}

	updateVerses(uniqueVerses);
	updateChapter(uniqueVerseJSON);
}

export function bookFilter(books: BookAndChapters[], value: string): string {
	const book = books.filter((x: BookAndChapters): BookAndChapters | undefined => {
		if (x.value === value) {
			return x;
		}
	});
	return book[0].value;
}

export function getSelectTextValue(key: string, selectValues: SelectFields[], searchParamsGetter: (key: string) => string): string {
	const paramValue = searchParamsGetter(key);
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
}
