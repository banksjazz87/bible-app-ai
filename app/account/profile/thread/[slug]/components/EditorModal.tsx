"use client";

import { JSX, useState } from "react";
import { MDXEditor, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, BlockTypeSelect, CreateLink, ListsToggle, headingsPlugin } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

type EditorProps = {
	editorContent: string;
	displayedTextContent: (JSX.Element | undefined)[] | JSX.Element | JSX.Element[];
	editorHeading: string;
	editorSubHeading: string;
};

export default function EditorModal({ editorContent, displayedTextContent, editorHeading, editorSubHeading}: EditorProps): JSX.Element {
	const [editorIsVisible, setEditorIsVisible] = useState<boolean>(false);
	return (
		<div className="flex flex-wrap justify-end align-middle gap-0">
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
								<Button variant="outline">Save</Button>
							</div>
						</div>
						<MDXEditor
							className="markdown_editor [&_h1]:text-5xl [&_h2]:text-4xl [&_h3]:text-3xl [&_h4]:text-2xl [&_h5]:text-xl [&_h6]: text-large"
							markdown={editorContent}
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
