"use client";

import { JSX } from "react";
import "@mdxeditor/editor/style.css";
import { MDXEditor, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, BlockTypeSelect, CreateLink, ListsToggle, headingsPlugin } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

type EditorProps = {
	editorContent: string;
	drawerDirection?: "top" | "right" | "bottom" | "left" | undefined;
	ModalTrigger: JSX.Element;
};

export default function EditorModal({ editorContent }: EditorProps): JSX.Element {
	return (
		<section className="flex flex-wrap absolute top-20 mt-10 left-5 w-2xl h-[80dvh] bg-white shadow-lg rounded-2xl border-slate-800 border overflow-y-auto">
			<div className="w-full">
				<div className="px-2 py-6 bg-primary rounded-tl-lg rounded-tr-lg">
					<h2 className="text-2xl font-extrabold text-white text-center">Edit Sermon</h2>
					<p className="text-white text-center">Last Edited: </p>
				</div>
				<MDXEditor
					className="[&_h1]:text-5xl [&_h2]:text-4xl [&_h3]:text-3xl [&_h4]:text-2xl [&_h5]:text-xl [&_h6]: text-large"
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
		</section>
	);
}
