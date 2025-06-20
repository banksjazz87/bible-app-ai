
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AppSidebar from "@/app/account/profile/components/AppSidebar";
import { UserResponse } from "@supabase/supabase-js";

export default function ProfilePage() {
	// const supabase = await createClient();

	// const { data, error } = await supabase.auth.getUser();
	// if (error || !data?.user) {
	// 	redirect("/login");
    // }
    
    async function isLoggedIn(): Promise<UserResponse> {
        const supabase = await createClient();
        const user = await supabase.auth.getUser();
        return user;
    }

    useEffect(() => {
        isLoggedIn().then((data) => {
            console.log(data);
        })
    })

	return <p>Hello</p>;
}
