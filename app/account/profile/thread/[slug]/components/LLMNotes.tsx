"use client";

import { useState, JSX } from "react";
import { LLMReqObject } from "@/lib/definitions";
import EditorModal from "./EditorModal";

type LLMNotesProps = {
	llmData: LLMReqObject[];
};

export default function LLMNotes({ llmData }: LLMNotesProps): JSX.Element {
	const [data, setData] = useState<LLMReqObject[]>(llmData);

	function getLLMString(heading: string, body: string): string {
		const formattedString = `${heading} \n ${body}`;
		return formattedString;
	}

	function llmDisplayedNotes(heading: string, body: string): JSX.Element {
		return (
			<div className="flex flex-col gap-2">
				<h2 className="text-2xl font-extrabold">{heading}</h2>
				<div
					className="llm_content flex-col gap-4"
					dangerouslySetInnerHTML={{ __html: body }}
				></div>
			</div>
		);
	}

	function LLMNotes(): (JSX.Element | undefined)[] {
		return llmData.map((x: LLMReqObject, y: number) => {
			if (x.output.length > 0) {
				return (
					<EditorModal
						key={`editor_modal_${y}`}
						editorContent={getLLMString(x.heading, x.output)}
						displayedTextContent={llmDisplayedNotes(x.heading, x.output)}
						editorHeading={"Edit LLM Notes"}
						editorSubHeading={"Make changes to the LLM generated notes here."}
					/>
				);
			}
		});
	}

	return <div className="llm_notes">{LLMNotes()}</div>;
}
