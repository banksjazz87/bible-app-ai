"use client";

import "@mdxeditor/editor/style.css";
import { MDXEditor, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, BlockTypeSelect, CreateLink, ListsToggle, headingsPlugin} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

export default function EditorModal({ editorContent }: { editorContent: string }) {
	return (
		<MDXEditor
			markdown={editorContent}
			plugins={[
				headingsPlugin(),
				toolbarPlugin({
					toolbarClassName: "my-classname",
					toolbarContents: () => (
						<>
							<UndoRedo />
							<BoldItalicUnderlineToggles />
							<ListsToggle />
							<CreateLink />
							<BlockTypeSelect />
						</>
					),
				}),
			]}
		/>
	);
}
