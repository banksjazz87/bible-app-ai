"use server";

import { JSX } from "react";
import { ChatThread, APIDataResponse } from "@/lib/definitions";
import { GetSingleThread } from "@/lib/data";
import { Suspense } from "react";
import { convertDateTime } from "@/lib/utils";
import { LLMReqObject } from "../../../../../lib/definitions";
import { retrieveBibleChapter } from "@/lib/bible/bibleMethods";
import BibleVerses from "@/app/bible/components/BibleVerses";
import { Button } from "@/components/ui/button";
import DownloadPDFButton from './components/DownloadPDFButton';
import EditorModal from "./components/EditorModal";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const slug = params.slug;
	const thread = await GetSingleThread(slug);
	const threadJSON: APIDataResponse<ChatThread> = await thread.json();
	const { thread_name, book, chapter, date_created, start_verse, end_verse, user_notes, llm_notes, bible_version } = threadJSON.data;

	const bibleText = await retrieveBibleChapter(bible_version, book, chapter);

	const date = convertDateTime(date_created as string);

	const LLMNotes = (llmNotes: LLMReqObject[]): (JSX.Element | undefined)[] => {
		return llmNotes.map((x: LLMReqObject, y: number): JSX.Element | undefined => {
			if (x.output.length > 0) {
				return (
					<div
						key={`llm_heading_${y}`}
						className="flex flex-col gap-2"
					>
						<h2 className="text-2xl font-extrabold">{x.heading}</h2>
						<div
							className="llm_content flex-col gap-4"
							dangerouslySetInnerHTML={{ __html: x.output }}
						></div>
					</div>
				);
			}
		});
	};

	if (!thread) {
		return (
			<Suspense fallback={<div>Loading...</div>}>
				<h1 className="font-extrabold text-3xl">No threads found</h1>
			</Suspense>
		);
	}

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<main>
				<section className="pt-16 pb-16">
					<div
						id="pdf-content"
						className="flex flex-col gap-2"
					>
						<div className="flex flex-col gap-2">
							<div className="flex flex-row justify-between">
								<h1 className="capitalize font-extrabold text-3xl">{thread_name}</h1>
								<div
									data-html2canvas-ignore
									className="flex flex-row gap-2"
								>
									<DownloadPDFButton
										pdfContentID={"pdf-content"}
										file={thread_name}
									/>
									<EditorModal
										editorContent={user_notes}
										drawerDirection="left"
										ModalTrigger={<Button>Edit</Button>}
									/>
								</div>
							</div>
							<p
								className="font-extrabold"
								suppressHydrationWarning
							>
								{date}
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<h2 className="capitalize font-extrabold text-2xl">{`${book} ${chapter}:${start_verse} - ${end_verse}`}</h2>
							<Suspense
								fallback={
									<div>
										<p>Loading bible data..</p>
									</div>
								}
							>
								{bibleText && (
									<BibleVerses
										versesArray={bibleText.data}
										startVerse={start_verse}
										endVerse={end_verse}
									/>
								)}
							</Suspense>
						</div>
						<div>
							{user_notes.length > 0 && (
								<div className="flex flex-col gap-2">
									<h2 className="text-2xl font-extrabold">User Notes</h2>
									<p>{user_notes}</p>
								</div>
							)}
						</div>
						<div>{LLMNotes(llm_notes)}</div>
					</div>
				</section>
			</main>
		</Suspense>
	);
}
