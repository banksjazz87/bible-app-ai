"use client";

import { JSX } from "react";
import "@mdxeditor/editor/style.css";
import { MDXEditor, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, BlockTypeSelect, CreateLink, ListsToggle, headingsPlugin } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

type EditorProps = {
	editorContent: string;
	drawerDirection?: "top" | "right" | "bottom" | "left" | undefined;
	ModalTrigger: JSX.Element;
};

export default function EditorModal({ editorContent, drawerDirection, ModalTrigger }: EditorProps): JSX.Element {
	return (
		<div className="flex flex-wrap gap-2">
			<Drawer
				direction={drawerDirection ? drawerDirection : "right"}
			>
				<DrawerTrigger asChild>{ModalTrigger}</DrawerTrigger>
				<DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
					<DrawerHeader>
						<DrawerTitle>Edit Sermon Notes</DrawerTitle>
						<DrawerDescription>Date last edited</DrawerDescription>
					</DrawerHeader>
					<div className="overflow-y-auto px-4 z-100">
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
					<DrawerFooter>
						<Button>Submit</Button>
						<DrawerClose asChild>
							<Button variant="outline">Cancel</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
