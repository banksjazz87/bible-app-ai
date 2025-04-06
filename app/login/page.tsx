"use client"

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Login() {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        getNotes();
    }, []);

    async function getNotes() {
        const data = await supabase.from("notes").select();
        
        console.log("HERE ", data);
    }
    return (
        <h1>This will be the login page</h1>
    )
}