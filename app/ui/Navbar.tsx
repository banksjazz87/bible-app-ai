"use client";
import { useState, useEffect, JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import next from "@/public/next.svg";
import UserAvatar from "./UserAvatar";
import { getUserDetails } from "@/lib/actions";

type MenuItem = {
	title: string;
	hrefValue: string;
	icon?: string;
};


export default function NavBar(): JSX.Element {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	useEffect((): void => {
		getUserDetails()
			.then((data) =>
				console.log(`USER DATA HERE ${data}`));
	});

	const navItems: MenuItem[] = [
		{
			title: "Home",
			hrefValue: "/",
		},
		{
			title: "Bible",
			hrefValue: "/bible",
		},
		{
			title: "Login",
			hrefValue: "/account/login",
		},
		{
			title: "Logout",
			hrefValue: "/account/logout",
		},
	];

	const loggedInMenu: MenuItem[] = [
		{
			title: "Home",
			hrefValue: "/",
		},
		{
			title: "Bible",
			hrefValue: "/bible",
		},
	];

	return (
		<header className="flex flex-row justify-between align-middle shadow-sm py-5 px-3 shadow-gray-400">
			<Link href="/">
				<Image
					src={next}
					width={75}
					height={75}
					alt="Temporary Image"
				/>
			</Link>

			<nav className="flex flex-row gap-4 justify-center align-middle">
				{!isLoggedIn &&
					navItems.map((x: MenuItem, y: number) => (
						<Link
							className="text-sm font-medium hover:text-neutral-500"
							key={`menu_item_${y}`}
							href={x.hrefValue}
						>
							{x.title}
						</Link>
					))}
				{isLoggedIn && (
					<>
						<Link
							className="text-sm font-medium hover:text-neutral-500"
							href={"/"}
						>
							Home
						</Link>
						<Link
							className="text-sm font-medium hover:text-neutral-500"
							href={"/bible"}
						>
							Bible
						</Link>
						<UserAvatar/>
					</>
				)}
			</nav>
		</header>
	);
}
