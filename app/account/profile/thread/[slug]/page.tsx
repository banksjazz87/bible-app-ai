
import { ChatThread, APIDataResponse } from '@/lib/definitions';
import { GetSingleThread } from '@/lib/data';


export default async function Page(props: { params: Promise<{ slug: string }>}) {
    const params = await props.params;
    const slug = params.slug;
    const thread = await GetSingleThread(slug);
    const threadJSON = await thread.json();
    console.log('Thread Data here ', threadJSON);

    if (!thread) {
        return (
            <h1>No threads found</h1>
        );
    }
    return (
        <main>
            <h1>Testing 123</h1>
            <p></p>
        </main>
    );
}