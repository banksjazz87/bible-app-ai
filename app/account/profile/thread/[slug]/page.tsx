"use server";

import { JSX } from "react";
import { ChatThread, APIDataResponse, Verses, ChapterResponse } from "@/lib/definitions";
import { GetSingleThread } from "@/lib/data";
import { Suspense } from "react";
import { convertDateTime } from "@/lib/utils";
import { retrieveBibleChapter } from "@/lib/bible/bibleMethods";
import BibleVerses from "@/app/bible/components/BibleVerses";
import DownloadPDFButton from "./components/DownloadPDFButton";
import LLMNotes from "./components/LLMNotes";
import { createClient } from "@/utils/supabase/server";



const getUserID = async (): Promise<void | string> => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	
	if (!user) {
		throw new Error("No user id found");
	}
	return user.id;
};

export default async function Page(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const slug = params.slug;
	const thread = await GetSingleThread(slug);
	const threadJSON: APIDataResponse<ChatThread> = await thread.json();
	const { thread_name, book, chapter, date_created, start_verse, end_verse, user_notes, llm_notes, bible_version } = threadJSON.data;

	const bibleText = await retrieveBibleChapter(bible_version, book, chapter);
	const userID = await getUserID();

	const bibleTextString = (text: ChapterResponse | undefined): string => {
		if (text) {
			const textArray = text.data.map((bibleText: Verses) => {
				return `${bibleText.verse}. ${bibleText.text}`;
			});
			return textArray.toString();
		} else {
			return "none found";
		}
	};

	const date = convertDateTime(date_created as string);

	if (!thread) {
		return (
			<Suspense fallback={<div>Loading...</div>}>
				<h1 className="font-extrabold text-3xl">No threads found</h1>
			</Suspense>
		);
	}

	const updateNotes = async (data: string, column: string): Promise<void> => {
		const supabase = await createClient();
		const { error } = await supabase
			.from('chat_threads')
			.update({ [column]: data })
			.eq('user_id', userID)
			.eq('thread_slug', slug);
		
		if (error) {
			console.error("The following error occurred in saving the data ", error);
		} else {
			console.log("You're data has been saved.")
		}
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
						<LLMNotes
							llmData={llm_notes}
							updateHandler={updateNotes}
						/>
						<div>
							{user_notes.length > 0 && (
								<div className="flex flex-col gap-2">
									<h2 className="text-2xl font-extrabold">User Notes</h2>
									<p>{user_notes}</p>
								</div>
							)}
						</div>
					</div>
				</section>
			</main>
		</Suspense>
	);
}
