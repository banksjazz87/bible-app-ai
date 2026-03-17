"use client";

import { useState, JSX } from "react";
import { LLMReqObject } from "@/lib/definitions";
import EditorModal from "./EditorModal";

type LLMNotesProps = {
	llmData: LLMReqObject[];
};

export default function LLMNotes({ llmData }: LLMNotesProps): JSX.Element {
	const [LLMData, setLLMData] = useState<LLMReqObject[]>(llmData);

	function getLLMString(heading: string, body: string): string {
		const formattedString = `${heading} \n ${body}`;
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

    function updateLLMData(index: number, bodyContent: string): void {
        console.log(bodyContent);
		setLLMData([
			...LLMData,
			LLMData[index],
			{
				heading: "",
				output: bodyContent,
			},
		]);
	}

	function saveHandler(index: number, elementID: string): void {
		updateLLMData(index, elementID);
		console.log(elementID);
		console.log("Data here: ", llmData);
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
						saveHandler={() => saveHandler(y, `llm_${y.toString()}`)}
					/>
				);
			}
		});
	}

	return <div className="llm_notes">{LLMNotes()}</div>;
}
