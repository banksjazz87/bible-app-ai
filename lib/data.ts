import { createClient } from '@/utils/supabase/server';
import { ChatThread } from '@/lib/definitions';

export async function GetThreads() {
    const supabase = await createClient();
    const { data } = await supabase.from('chat_threads').select();

    return data;
}

