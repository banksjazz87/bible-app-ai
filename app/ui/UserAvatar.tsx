"use client"

import { JSX, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/server";


async function userIsLoggedIn(){
    const supabase = await createClient();

    try {
        const userData = await supabase.auth.getSession();
        return userData;
    } catch(e: any) {
        console.log(`The following error occurred in checking for the user, ${e}`);
    }
}
export default function UserAvatar(): JSX.Element {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect((): void => {
        userIsLoggedIn()
            .then((data) => console.log(data));
    }, []);
    
	return (
		<div>
			<Avatar>
				<AvatarImage src="https://github.com/shadcn.png" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
		</div>
	);
}
