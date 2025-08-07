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

export interface APIResponse {
    status: number;
    message: string;
}

export interface APIDataResponse<K> extends APIResponse {
    data: K,
}

export type UserData = {
    email: string,
    id: string
}

export type AlertProps = {
	isOpen: boolean;
	openHandler: (isOpen: boolean) => void;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	cancelHandler: () => void;
	confirmHandler: () => void;
};

export type LoginFormProps = {
    responseHandler: (statusCode: number | null) => void;
    alertMessageHandler: (message: string) => void;
    alertTitleHandler: (title: string) => void;
}

export type SaveSermonData = {
	bibleData: BibleFormData;
	LLMOutput: LLMReqObject[];
}; 

export type ChatThread = {
    id: number;
    thread_slug: string;
    date_created?: string;
    last_modified?: string;
	thread_name: string;
	bible_version: string;
	book: string;
	chapter: string;
	start_verse: string;
	end_verse: string;
	llm_notes: LLMReqObject[];
	user_notes: string;
	user_id: string;
};