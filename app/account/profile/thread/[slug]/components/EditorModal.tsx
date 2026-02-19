"use client";

import { JSX } from "react";
import {
	MDXEditor,
	UndoRedo,
	BoldItalicUnderlineToggles,
	toolbarPlugin,
	BlockTypeSelect,
	CreateLink,
	ListsToggle,
	headingsPlugin, 
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { Button } from "@/components/ui/button";


type EditorProps = {
	editorContent: string;
	drawerDirection?: "top" | "right" | "bottom" | "left" | undefined;
	ModalTrigger: JSX.Element;
};

export default function EditorModal({ editorContent }: EditorProps): JSX.Element {
	return (
		<section className="flex flex-wrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] bg-white shadow-lg rounded-2xl border-slate-800 border">
			<div className="w-full h-[70dvh] overflow-y-auto">
				<div className="px-2 py-6 bg-primary rounded-tl-lg rounded-tr-lg relative">
					<h2 className="text-2xl font-extrabold text-white text-center">Edit Sermon</h2>
					<p className="text-white text-center">Last Edited: </p>
					<Button variant="outline" className="absolute top-6 right-12">Save</Button>
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
		</section>
	);
}
