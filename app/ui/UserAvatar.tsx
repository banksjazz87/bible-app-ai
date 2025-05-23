"use client"

import { JSX, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserAvatar(): JSX.Element {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	return (
		<div>
			<Avatar>
				<AvatarImage src="https://github.com/shadcn.png" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
		</div>
	);
}
