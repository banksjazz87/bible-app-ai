"use client";

import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { redirect } from "next/navigation";
import { getUserData } from "@/app/store/features/account/loginSlice";
import { useAppSelector } from "@/app/store/hooks";
import PastThreads from "./components/PastThreads";

export default function ProfilePage() {
	// const supabase = await createClient();

	// const { data, error } = await supabase.auth.getUser();
	// if (error || !data?.user) {
	// 	redirect("/login");
    // }
    
    // async function isLoggedIn(): Promise<UserResponse> {
    //     const supabase = await createClient();
    //     const user = await supabase.auth.getUser();
    //     return user;
    // }


    const loggedInDetails = useAppSelector(getUserData);


    return (
        <main>
            <p>{`The user is currently logged in ${loggedInDetails.isLoggedIn} and his username is ${loggedInDetails.userName}`}</p>
            <PastThreads />
        </main>
    );
}
