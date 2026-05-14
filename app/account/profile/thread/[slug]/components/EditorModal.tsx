"use client";

import { JSX, useState, useRef } from "react";
import { MDXEditor, MDXEditorMethods, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, BlockTypeSelect, CreateLink, ListsToggle, headingsPlugin } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { LLMReqObject } from "@/lib/definitions";

type EditorProps = {
	editorContent: string;
	displayedTextContent: (JSX.Element | undefined)[] | JSX.Element | JSX.Element[];
	editorHeading: string;
	editorSubHeading: string;
	saveHandler: (data: string) => void;
};

export default function EditorModal({ editorContent, displayedTextContent, editorHeading, editorSubHeading, saveHandler }: EditorProps): JSX.Element {
	const [editorIsVisible, setEditorIsVisible] = useState<boolean>(false);
	const [editorData, setEditorData] = useState<string>("");
	const ref = useRef<MDXEditorMethods>(null);
	return (
		<div
			data-html2canvas-ignore
			className="flex flex-wrap justify-start flex-row-reverse align-middle gap-0 position-relative"
		>
			<Button
				onClick={(): void => setEditorIsVisible(!editorIsVisible)}
				className="rounded-full size-9 shadow-2xl"
			>
				<FontAwesomeIcon
					icon={faPencil}
					className="size-4"
				/>
			</Button>

			{!editorIsVisible && displayedTextContent}

			{editorIsVisible && (
				<div className="flex flex-wrap bg-white shadow-lg rounded-2xl">
					<div className="w-full">
						<div className="px-2 py-6 bg-primary rounded-tl-lg rounded-tr-lg relative">
							<h2 className="text-2xl font-extrabold text-white text-center">{editorHeading}</h2>
							<p className="text-white text-center">{editorSubHeading}</p>
							<div className="flex flex-row justify-end absolute top-1/2 trasform -translate-y-1/2 right-8 gap-4">
								<Button
									variant="destructive"
									onClick={(): void => setEditorIsVisible(false)}
								>
									Cancel
								</Button>
								<Button
									variant="outline"
									onClick={(): void => {
										console.log("The save method has been executed! The current data = ", ref.current?.getMarkdown());
										ref.current?.setMarkdown(ref.current?.getMarkdown());
										saveHandler(ref.current?.getMarkdown() ? ref.current.getContentEditableHTML() : "");
									}}
								>
									Save
								</Button>
							</div>
						</div>
						<MDXEditor
							ref={ref}
							className="markdown_editor [&_h1]:text-5xl [&_h2]:text-4xl [&_h3]:text-3xl [&_h4]:text-2xl [&_h5]:text-xl [&_h6]: text-large"
							markdown={editorContent}
							onChange={console.log}
							plugins={[
								headingsPlugin(),
								toolbarPlugin({
									toolbarClassName: "md-editor",
									toolbarContents: () => (
										<>
											<UndoRedo />
											<BlockTypeSelect />
											<BoldItalicUnderlineToggles />
											<ListsToggle />
											<CreateLink />
										</>
									),
								}),
							]}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
