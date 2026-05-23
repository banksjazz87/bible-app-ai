"use client";

import { JSX, useState, useRef } from "react";
import { MDXEditor, MDXEditorMethods, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, BlockTypeSelect, CreateLink, ListsToggle, headingsPlugin } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { updateChatThreadHandler } from "../../actions";
import { LLMReqObject } from "@/lib/definitions";

type EditorProps = {
	editorContent: string;
	displayedTextContent: (JSX.Element | undefined)[] | JSX.Element | JSX.Element[];
	editorHeading: string;
	editorSubHeading: string;
	chatSlug: string;
	getNewEditorText: (content: string) => LLMReqObject[]
};

export default function EditorModal({ editorContent, displayedTextContent, editorHeading, editorSubHeading, chatSlug, getNewEditorText }: EditorProps): JSX.Element {
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
									onClick={async(): Promise<void> => {
										console.log("The save method has been executed! The current data = ", ref.current?.getMarkdown());
										ref.current?.setMarkdown(ref.current?.getMarkdown());
										const markdownData = ref.current?.getMarkdown() ? ref.current.getContentEditableHTML() : "";						
										setEditorData(markdownData);

										try {
											const columnName = editorHeading.toLowerCase().includes("llm") ? "llm_notes" : "user_notes";
											const newData: LLMReqObject[] = getNewEditorText(markdownData);
											const updateChat = await updateChatThreadHandler(newData, columnName, chatSlug);
											// const data = await updateChat.json();

											if (updateChat.status !== 200) {
												console.error('The following error: ', updateChat.message);
											}
											setEditorIsVisible(false);

										} catch (e: unknown) {
											console.error(`The following error occurred while updating the chat thread: `, e);
										}
									
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
