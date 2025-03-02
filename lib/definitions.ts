//Contains all of the definitions used in the app

export type BookAndChapters = {
    book: string;
    chapters: number;
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
};
