"use client";

import { useState, JSX } from "react";
import { LLMReqObject } from "@/lib/definitions";
import EditorModal from "./EditorModal";

type LLMNotesProps = {
	llmData: LLMReqObject[];
	chatSlug: string;
};

export default function LLMNotes({ llmData, chatSlug }: LLMNotesProps): JSX.Element {
	const [LLMData, setLLMData] = useState<LLMReqObject[]>(llmData);

	function getLLMString(heading: string, body: string): string {
		const formattedString = `<h2>${heading}</h2>\n\n ${body}`;
		return formattedString;
	}

	function llmDisplayedNotes(heading: string, body: string, isEdited: boolean, id: string): JSX.Element {
		return (
			<div
				id={`llm_${id}`}
				className="flex flex-col gap-2 w-full"
				data-llm-id={id}
			>
				{!isEdited && <h2 className="llm_heading text-2xl font-extrabold">{heading}</h2>}
				<div
					className="llm_content flex-col gap-4"
					dangerouslySetInnerHTML={{ __html: body }}
				></div>
			</div>
		);
	}


	function getNewEditorText(index: number, editorText: string): LLMReqObject[] {
		const newEditorText: LLMReqObject[] = LLMData.map((x: LLMReqObject, y: number): LLMReqObject => {
			if (y === index) {
				x.output = editorText;
				x.isEdited = true;
			}
			return x;
		});
		setLLMData(newEditorText);
		return newEditorText;
	}

	function LLMNotes(): (JSX.Element | undefined)[] {
		const notes = llmData.map((x: LLMReqObject, y: number) => {
			if (x.output.length > 0) {
				return (
					<EditorModal
						key={`editor_modal_${y}`}
						editorContent={getLLMString(x.heading, x.output)}
						displayedTextContent={llmDisplayedNotes(x.heading, x.output, x.isEdited, y.toString())}
						editorHeading={"Edit LLM Notes"}
						editorSubHeading={"Make changes to the LLM generated notes here."}
						chatSlug={chatSlug}
						getNewEditorText={(editorText: string) => getNewEditorText(y, editorText)}
					/>
				);
			}
		});
		return notes;
	}

	return <div className="llm_notes flex flex-col justify-start">{LLMNotes()}</div>;
}
