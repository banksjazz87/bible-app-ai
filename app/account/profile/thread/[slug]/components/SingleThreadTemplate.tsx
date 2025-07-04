import { createClient } from "@/utils/supabase/server";
import { ChatThread, APIDataResponse } from "@/lib/definitions";

export default async function getThreadData({ params }: { params: Promise<{ slug: string }> }) {
	const slug = await params;

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const userId = user?.id;
	const { data } = await supabase.from("chat_threads").select("*").match({ user_id: userId, thread_slug: slug });

	return (
		<>
			<h2>Test thread name</h2>

			{data?.map((x) => {
				<p>{x.thread_name}</p>;
			})}
		</>
	);
}
