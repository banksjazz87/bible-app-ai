"use client";

import { JSX, useState, useRef } from "react";
import { MDXEditor, MDXEditorMethods, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, BlockTypeSelect, CreateLink, ListsToggle, listsPlugin, headingsPlugin } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { updateChatThreadHandler } from "../../actions";
import { LLMReqObject } from "@/lib/definitions";
import { marked } from 'marked'

type EditorProps = {
	editorContent: string;
	displayedTextContent: (JSX.Element | undefined)[] | JSX.Element | JSX.Element[];
	editorHeading: string;
	editorSubHeading: string;
	chatSlug: string;
	getNewEditorText: (content: string) => LLMReqObject[];
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
				<div className="flex flex-wrap bg-white shadow-lg rounded-2xl min-w-full md:min-w-4xl">
					<div className="w-full">
						<div className="grid grid-flow-row grid-cols-1 gap-4 px-2 py-6 bg-primary rounded-tl-lg rounded-tr-lg sm:grid-cols-3">
							<div className="spacer">
							</div>
							<div className="flex flex-col items-center">
								<h2 className="text-2xl font-extrabold text-white text-center">{editorHeading}</h2>
								<p className="text-white text-center">{editorSubHeading}</p>
							</div>
							<div className="flex flex-row gap-4 justify-center items-center">
								<Button
									variant="destructive"
									onClick={(): void => setEditorIsVisible(false)}
								>
									Cancel
								</Button>
								<Button
									variant="outline"
									onClick={async (): Promise<void> => {
										ref.current?.setMarkdown(ref.current?.getMarkdown());
										// const markdownData = ref.current?.getMarkdown() ? ref.current.getContentEditableHTML() : "";
										// const markdownData = ref.current?.getMarkdown() ? ref.current.getMarkdown() : "";
										const htmlData = await marked.parse(ref.current?.getMarkdown() || "Error parsing markdown");

										try {
											const columnName = editorHeading.toLowerCase().includes("llm") ? "llm_notes" : "user_notes";
											// const newData: LLMReqObject[] = getNewEditorText(markdownData);
											const newData: LLMReqObject[] = getNewEditorText(htmlData);
											const updateChat = await updateChatThreadHandler(newData, columnName, chatSlug);

											if (updateChat.status !== 200) {
												console.error("The following error: ", updateChat.message);
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
							className="markdown_editor [&_h1]:text-5xl [&_h2]:text-4xl [&_h3]:text-3xl [&_h4]:text-2xl [&_h5]:text-xl [&_h6]: text-large prose max-w-none"
							markdown={editorContent}
							onChange={console.log}
							plugins={[
								headingsPlugin(),
								listsPlugin(),
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
