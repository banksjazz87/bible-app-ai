"use client";

import { JSX, useState } from "react";
import { MDXEditor, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, BlockTypeSelect, CreateLink, ListsToggle, headingsPlugin } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { Button } from "@/components/ui/button";

type EditorProps = {
	editorContent: string;
	displayedContent: (JSX.Element | undefined)[] | JSX.Element | JSX.Element[]
};

export default function EditorModal({ editorContent, displayedContent}: EditorProps): JSX.Element {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	return (
		<div>
			<Button onClick={(): void => setIsVisible(!isVisible)}>Edit</Button>

			{!isVisible && displayedContent}

			{isVisible && (
				<div className="flex flex-wrap absolute top-20 mt-10 left-7 w-[60vw] bg-white shadow-lg rounded-2xl border-slate-800 border">
					<div className="w-full h-[70dvh] overflow-y-auto">
						<div className="px-2 py-6 bg-primary rounded-tl-lg rounded-tr-lg relative">
							<h2 className="text-2xl font-extrabold text-white text-center">Edit Sermon</h2>
							<p className="text-white text-center">Last Edited: </p>
							<div className="flex flex-row justify-end absolute top-1/2 trasform -translate-y-1/2 right-8 gap-4">
								<Button
									variant="destructive"
									onClick={(): void => setIsVisible(false)}
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
									toolbarClassName: "my-classname",
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
