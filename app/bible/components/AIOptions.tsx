import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BibleFormData } from "@/lib/definitions";
import OpenAI from "openai";

type AIOptionsProps = {
	selectedBibleData: BibleFormData;
};

export default function AIOptions({ selectedBibleData }: AIOptionsProps) {
    const {
        book,
        chapter,
        startVerse,
        endVerse
    } = selectedBibleData;

    const client: OpenAI = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
    const bibleSelection = endVerse.length > 0 ? `${book} ${chapter}:${startVerse} - ${endVerse}` : `${book} ${chapter}:${startVerse}`;
    const definePrompt = `Summarize and simplify the meaning for the following bible verses ${bibleSelection}`;
    const createSermonPrompt = `Create a 20 minute sermon based on the following bible verses ${bibleSelection}`;
    const discussionPrompt = `Create 5 discussion questions that can be used in a group setting for the following bible verses ${bibleSelection}`;

	const completion = async (prompt: string): Promise<OpenAI.Chat.Completions.ChatCompletion & {_request_id?: string | null;}> =>
		await client.chat.completions.create({
			model: "gpt-4o-mini",
			store: true,
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
		});


	const dataIsPresent = (): boolean => {
		let key: keyof typeof selectedBibleData;
		for (key in selectedBibleData) {
			if (selectedBibleData[key] === "") {
				return false;
			}
		}
		return true;
	};

	const clickHandler = (prompt: string): void => {
		if (!dataIsPresent()) {
			alert("Please search before using this.");
        } else {
            completion(prompt)
                .then((data: any): void => {
                    console.log(data.choices[0].message.content);
                })
                .catch((e: any): void => console.warn(e));
        }
	};

	return (
		<div className="flex flex-col gap-4 border-slate-800 border rounded-md p-5">
			<h2 className="font-bold text-xl">Would you like some assistance?</h2>
			<Button
				variant="outline"
				onClick={() => clickHandler(definePrompt)}
			>
				What is this about?
			</Button>
			<Button
				variant="outline"
				onClick={() => clickHandler(createSermonPrompt)}
			>
				Create a sermon.
			</Button>
			<Button
				variant="outline"
				onClick={() => clickHandler(discussionPrompt)}
			>
				Create discussion questions.
			</Button>
		</div>
	);
}
