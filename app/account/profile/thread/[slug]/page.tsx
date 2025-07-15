import { JSX } from "react";
import { ChatThread, APIDataResponse } from "@/lib/definitions";
import { GetSingleThread } from "@/lib/data";
import { Suspense } from "react";
import { convertDateTime } from "@/lib/utils";
import { LLMReqObject } from "../../../../../lib/definitions";
import { retrieveBibleChapter } from "@/lib/bible/bibleMethods";
import BibleVerses from "@/app/bible/components/BibleVerses";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const slug = params.slug;
	const thread = await GetSingleThread(slug);
	const threadJSON: APIDataResponse<ChatThread> = await thread.json();
	const {
		thread_name,
		book,
		chapter, 
		date_created,
		start_verse,
		end_verse,
		thread_slug,
		user_notes,
		llm_notes, 
		bible_version
	} = threadJSON.data;

	const bibleText = await retrieveBibleChapter(bible_version, book, chapter);


	const date = convertDateTime(date_created);

	const LLMNotes = (llmNotes: LLMReqObject[]): (JSX.Element | undefined)[] => {
		return llmNotes.map((x: LLMReqObject, y: number): JSX.Element | undefined => {
			if (x.output.length > 0) {
				return (
					<div key={`llm_heading_${y}`}>
						<h2>{x.heading}</h2>
						<div
							className="llm_content"
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
				<h1>No threads found</h1>
			</Suspense>
		);
	}

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<main>
				<section>
					<h1>{thread_name}</h1>
					<p>{date}</p>
					<div>
						<p>{`${book} ${chapter}:${start_verse} - ${end_verse}`}</p>
						<Suspense fallback={<div><p>Loading bible data..</p></div>}>
							{bibleText && 
								<BibleVerses
								versesArray={bibleText.data}
								startVerse={start_verse}
								endVerse={end_verse}
							/>
							}
						</Suspense>
					</div>
					<div>
						<p>{`User Notes here ${user_notes}`}</p>
					</div>
					<div>{LLMNotes(llm_notes)}</div>
				</section>
			</main>
		</Suspense>
	);
}
