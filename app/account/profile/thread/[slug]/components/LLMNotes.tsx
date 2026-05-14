"use client";

import { useState, JSX, useEffect } from "react";
import { LLMReqObject } from "@/lib/definitions";
import EditorModal from "./EditorModal";

type LLMNotesProps = {
    llmData: LLMReqObject[];
    updateHandler: (data: string, column: string) => Promise<void>
};

export default function LLMNotes({ llmData, updateHandler }: LLMNotesProps): JSX.Element {
    const [LLMData, setLLMData] = useState<LLMReqObject[]>(llmData);

	function getLLMString(heading: string, body: string): string {
		const formattedString = `<h2>${heading}</h2>\n\n ${body}`;
		return formattedString;
	}

	function llmDisplayedNotes(heading: string, body: string, id: string): JSX.Element {
		return (
			<div
				id={`llm_${id}`}
				className="flex flex-col gap-2"
				data-llm-id={id}
			>
                <h2 className="llm_heading text-2xl font-extrabold">{heading}</h2>
				<div
					className="llm_content flex-col gap-4"
					dangerouslySetInnerHTML={{ __html: body }}
				></div>
			</div>
		);
	}


    function saveHandler(index: number, editorText: string, columnName: string): void {
        const newEditorText: LLMReqObject[] = LLMData.map((x: LLMReqObject, y: number): LLMReqObject => {
            if (y === index) {
                x.heading = '';
                x.output = editorText;
            }
            return x;
        });
        setLLMData(newEditorText);
        updateHandler(editorText, columnName);
	}

	function LLMNotes(): (JSX.Element | undefined)[] {
		return llmData.map((x: LLMReqObject, y: number) => {
			if (x.output.length > 0) {
				return (
					<EditorModal
						key={`editor_modal_${y}`}
						editorContent={getLLMString(x.heading, x.output)}
						displayedTextContent={llmDisplayedNotes(x.heading, x.output, y.toString())}
						editorHeading={"Edit LLM Notes"}
						editorSubHeading={"Make changes to the LLM generated notes here."}
						saveHandler={(editorData: string, columnName: string) => saveHandler(y, editorData, columnName)}
					/>
				);
			}
		});
	}

	return <div className="llm_notes flex justify-start">{LLMNotes()}</div>;
}
