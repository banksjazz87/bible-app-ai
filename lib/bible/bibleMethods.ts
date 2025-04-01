//Methods used to access bible data.
import { BookAndChapters, ChapterResponse, Verses, SelectFields } from "@/lib/definitions";
import { unique } from "next/dist/build/utils";

//Get the chapters according to the book and testament that are currently selected.
export function getChapters(bible: BookAndChapters[], book: string, updateChapters: Function) {
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
		updateChapters(allChapters);
	} else {
		updateChapters([]);
	}
}

export async function retrieveBibleChapter(version: string, book: string, chapter: string): Promise<ChapterResponse | undefined> {
	const bookToLower = book.toLowerCase();
	try {
		const verses: Response = await fetch(`https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${version}/books/${bookToLower}/chapters/${chapter}.json`);
        const verseJSON: ChapterResponse = await verses.json();
		return verseJSON;
	} catch (e: any) {
		console.warn("The following error occurred ", e);
	}
}

export function convertVerseDataToOptions(verseJSON: Verses[], updateVerses: Function, updateChapter: Function): void {
	const convertedOptionData: SelectFields[] = verseJSON.map((x: Verses, y: number): SelectFields => {
		let newObj = {
			text: x.verse,
			value: x.verse,
		};
		return newObj;
	});

	//Adding a check here for duplicate verses, a few of the API responses contain duplicate verses.
	let uniqueVerses = [{text: '', value: ''}];
	for (let i = 0; i < convertedOptionData.length; i++) {
		if (convertedOptionData[i].value === "1" && i > 0) {
			break;
		}
		uniqueVerses[i] = convertedOptionData[i];
	}

	//Get unique verseJSON values.
	let uniqueVerseJSON: Verses[] = [{ book: '', chapter: '', verse: '', text: '' }];
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
	const book = books.filter((x: BookAndChapters, y: number): BookAndChapters | undefined => {
		if (x.value === value) {
			return x;
		}
	});
	return book[0].value;
}

export function getSelectTextValue(key: string, selectValues: SelectFields[], searchParamsGetter: Function): string {
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
