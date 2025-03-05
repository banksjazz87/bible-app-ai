"use client";

import { useState, useEffect, JSX, FormEvent } from "react";
import BibleForm from "./components/BibleForm";
import { BibleFormData, Verses } from "@/lib/definitions";
import BibleVerses from "./components/BibleVerses";


export default function Bible(): JSX.Element {
	const [currentChapterText, setCurrentChapterText] = useState<Verses[]>([]);

	const formHandler = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		console.log('The form has been submitted');
	}

	return (
		<div className="mt-6">
			<main>
				<BibleForm
					submitHandler={formHandler}
					updateNeededChapter={(data: Verses[]) => setCurrentChapterText(data)}
				/>
			</main>
		</div>
	);
}
