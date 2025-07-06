import { ChatThread, APIDataResponse } from "@/lib/definitions";
import { GetSingleThread } from "@/lib/data";
import { Suspense } from "react";
import { convertDateTime } from "@/lib/utils";

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
        llm_notes
    } = threadJSON.data;

    const date = convertDateTime(date_created);

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
                        <p>{`${book} ${chapter}:${start_verse} - ${end_verse}` }</p>
                    </div>
                </section>
			</main>
		</Suspense>
	);
}
