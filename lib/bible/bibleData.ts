//This file will contain all of the bible data that doesn't need to be pulled from an API or database.
import { BookAndChapters, BibleVersions, SelectFields } from "@/lib/definitions";

export const TestamentOptions: SelectFields[] = [
	{ value: "old", text: "Old" },
	{ value: "new", text: "New" },
];

export const EnglishBibleVersions: SelectFields[] = [
	{ value: "en-asv", text: "American Standard Version of the Holy Bible" },
	{ value: "en-US-asvbt", text: "American Standard Version Byzantine Text with Apocrypha" },
	{ value: "en-bsb", text: "Berean Study Bible" },
	{ value: "en-engbrent", text: "Brenton English Septuagint" },
	{ value: "en-US-lxxup", text: "Brenton English Septuagint (Updated Spelling and Formatting)" },
	{ value: "en-dra", text: "Douay-Rheims American 1899" },
	{ value: "en-US-emtv", text: "English Majority Text Version" },
	{ value: "en-fbv", text: "Free Bible Version" },
	{ value: "en-gnv", text: "Geneva Bible" },
	{ value: "en-ojps", text: "JPS TaNaKH 1917" },
	{ value: "en-kjv", text: "King James Version of the Holy Bible" },
	{ value: "en-lsv", text: "Literal Standard Version" },
	{ value: "en-rv", text: "Revised Version" },
	{ value: "en-oke", text: "Targum Onkelos Etheridge" },
	{ value: "en-tcent", text: "Text-Critical English New Testament" },
	{ value: "en-t4t", text: "The Holy Bible: A Translation for Translators" },
	{ value: "en-US-f35", text: "The English New Testament According to Family 35" },
	{ value: "en-US-kjvcpb", text: "The Cambridge Paragraph Bible of the Authorized English Version" },
	{ value: "en-web", text: "World English Bible" },
	{ value: "en-webbe", text: "World English Bible British Edition" },
	{ value: "en-webus", text: "World English Bible, American English Edition, without Strong's numbers" },
	{ value: "en-wmb", text: "World Messianic Bible" },
	{ value: "en-wmbbe", text: "World Messianic Bible British Edition" },
];


export const BooksOfTheBible: BookAndChapters[] = [
	{ text: "Genesis", chapters: 50, value: "genesis" },
	{ text: "Exodus", chapters: 40, value: "exodus" },
	{ text: "Leviticus", chapters: 27, value: "leviticus" },
	{ text: "Numbers", chapters: 36, value: "numbers" },
	{ text: "Deuteronomy", chapters: 34, value: "deuteronomy" },
	{ text: "Joshua", chapters: 24, value: "joshua" },
	{ text: "Judges", chapters: 21, value: "judges" },
	{ text: "Ruth", chapters: 4, value: "ruth" },
	{ text: "1 Samuel", chapters: 31, value: "1 samuel" },
	{ text: "2 Samuel", chapters: 24, value: "2 samuel" },
	{ text: "1 Kings", chapters: 22, value: "1 kings" },
	{ text: "2 Kings", chapters: 25, value: "2 kings" },
	{ text: "1 Chronicles", chapters: 29, value: "1 chronicles" },
	{ text: "2 Chronicles", chapters: 36, value: "2 chronicles" },
	{ text: "Ezra", chapters: 10, value: "ezra" },
	{ text: "Nehemiah", chapters: 13, value: "nehemiah" },
	{ text: "Esther", chapters: 10, value: "esther" },
	{ text: "Job", chapters: 42, value: "job" },
	{ text: "Psalms", chapters: 150, value: "psalms" },
	{ text: "Proverbs", chapters: 31, value: "proverbs" },
	{ text: "Ecclesiastes", chapters: 12, value: "ecclesiastes" },
	{ text: "Song of Solomon", chapters: 8, value: "song of solomon" },
	{ text: "Isaiah", chapters: 66, value: "isaiah" },
	{ text: "Jeremiah", chapters: 52, value: "jeremiah" },
	{ text: "Lamentations", chapters: 5, value: "lamentations" },
	{ text: "Ezekiel", chapters: 48, value: "ezekiel" },
	{ text: "Daniel", chapters: 12, value: "daniel" },
	{ text: "Hosea", chapters: 14, value: "hosea" },
	{ text: "Joel", chapters: 3, value: "joel" },
	{ text: "Amos", chapters: 9, value: "amos" },
	{ text: "Obadiah", chapters: 1, value: "obadiah" },
	{ text: "Jonah", chapters: 4, value: "jonah" },
	{ text: "Micah", chapters: 7, value: "micah" },
	{ text: "Nahum", chapters: 3, value: "nahum" },
	{ text: "Habakkuk", chapters: 3, value: "habakkuk" },
	{ text: "Zephaniah", chapters: 3, value: "zephaniah" },
	{ text: "Haggai", chapters: 2, value: "haggai" },
	{ text: "Zechariah", chapters: 14, value: "zechariah" },
	{ text: "Malachi", chapters: 4, value: "malachi" },
	{ text: "--NEW TESTAMENT--", chapters: -1, value: "---" },
	{ text: "Matthew", chapters: 28, value: "matthew" },
	{ text: "Mark", chapters: 16, value: "mark" },
	{ text: "Luke", chapters: 24, value: "luke" },
	{ text: "John", chapters: 21, value: "john" },
	{ text: "Acts", chapters: 28, value: "acts" },
	{ text: "Romans", chapters: 16, value: "romans" },
	{ text: "1 Corinthians", chapters: 16, value: "1 corinthians" },
	{ text: "2 Corinthians", chapters: 13, value: "2 corinthians" },
	{ text: "Galatians", chapters: 6, value: "galatians" },
	{ text: "Ephesians", chapters: 6, value: "ephesians" },
	{ text: "Philippians", chapters: 4, value: "philippians" },
	{ text: "Colossians", chapters: 4, value: "colossians" },
	{ text: "1 Thessalonians", chapters: 5, value: "1 thessalonians" },
	{ text: "2 Thessalonians", chapters: 3, value: "2 thessalonians" },
	{ text: "1 Timothy", chapters: 6, value: "1 timothy" },
	{ text: "2 Timothy", chapters: 4, value: "2 timothy" },
	{ text: "Titus", chapters: 3, value: "titus" },
	{ text: "Philemon", chapters: 1, value: "philemon" },
	{ text: "Hebrews", chapters: 13, value: "hebrews" },
	{ text: "James", chapters: 5, value: "james" },
	{ text: "1 Peter", chapters: 5, value: "1 peter" },
	{ text: "2 Peter", chapters: 3, value: "2 peter" },
	{ text: "1 John", chapters: 5, value: "1 john" },
	{ text: "2 John", chapters: 1, value: "2 john" },
	{ text: "3 John", chapters: 1, value: "3 john" },
	{ text: "Jude", chapters: 1, value: "jude" },
	{ text: "Revelation", chapters: 22, value: "revelation" },
];

export const DefaultBibleFormData = {
	version: "",
	book: "",
	chapter: "",
	startVerse: "",
	endVerse: "",
};
