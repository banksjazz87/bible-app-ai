//Contains all of the definitions used in the app

export type BookAndChapters = {
    text: string;
    chapters: number;
    value: string;

};

export type BibleVersions = {
    value: string;
    text: string;
};

export type BooksProps = {
    books: BookAndChapters[];
    changeHandler: Function;
    sectionTitle: string;
    optionsID: string;
    placeholder: string;
    selectedValue: string;
};


export type VersionsProps = {
    versions: BibleVersions[];
    sectionTitle: string;
    optionsID: string;
    changeHandler: Function;
};

export type SelectFields = {
    value: string;
    text: string;
}

export type OptionsProps = {
    changeHandler: Function;
    sectionTitle: string;
    options: SelectFields[];
    optionsID: string;
    placeholderText: string;
    selectedValue: string;
};

export type BibleFormData = {
    version: string;
    book: string;
    chapter: string;
    startVerse: string;
    endVerse: string;
};

export type BibleFormProps = {
	submitHandler: Function;
	updateNeededChapter: Function;
};

export type Verses = {
    book: string;
    chapter: string;
    verse: string;
    text: string;
};

export type ChapterResponse = {
    data: Verses[];
};

export type LLMReqObject = {
	heading: string;
	output: string;
}

export type LoginForm = {
    email: string;
    password: string;
}

