"use client";

import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { redirect } from "next/navigation";
import AppSidebar from "@/app/account/profile/components/AppSidebar";
import { getUserDetails } from "@/app/store/features/account/loginSlice";
import { useAppSelector } from "@/app/store/hooks";

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

    const isLoggedIn = useAppSelector(getUserDetails);


	return <p>{`The user is currently logged in ${isLoggedIn}`}</p>;
}
