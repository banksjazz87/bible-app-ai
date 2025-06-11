"use client";
import { useState, useEffect, JSX, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import next from "@/public/next.svg";
import UserAvatar from "./UserAvatar";
import { getUserDetails } from "@/lib/actions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { setLoginState } from "@/app/store/features/account/loginSlice";
import { useAppSelector, useAppDispatch, useAppStore } from "@/app/store/hooks";
import { APIResponse } from "@/lib/definitions";

type MenuItem = {
	title: string;
	hrefValue: string;
	icon?: string;
};


export default function NavBar(): JSX.Element {
	const isLoggedIn = useAppSelector(state => state.isLoggedIn.value);
	const dispatch = useAppDispatch();


	const logoutFunction = async () => {
		const logoutUser = await fetch('/account/logout/');
		const jsonData: APIResponse = await logoutUser.json();

		if (jsonData.status === 200) {
			dispatch(setLoginState(false));
		} else {
			console.warn(`The following error has occurred: ${jsonData.message}`);
		}

	}

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
		<header className="flex flex-row justify-between align-middle shadow-sm py-5 px-6 shadow-gray-400">
			<Link href="/">
				<Image
					src={next}
					width={75}
					height={75}
					alt="Temporary Image"
				/>
			</Link>

			<nav className="flex flex-row gap-4 justify-center align-middle items-center">
				{!isLoggedIn &&
					navItems.map((x: MenuItem, y: number) => (
						<Link
							className="text-sm font-medium hover:text-neutral-500"
							key={`menu_item_${y}`}
							href={x.hrefValue}
						>
							{x.title}
						</Link>
					))
				}
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
						<DropdownMenu>
							<DropdownMenuTrigger>
								<UserAvatar />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Profile</DropdownMenuItem>
								<DropdownMenuItem>Billing</DropdownMenuItem>
								<DropdownMenuItem>Subscription</DropdownMenuItem>
								<DropdownMenuItem>
									<button type="button" onClick={() => logoutFunction()}>
										Logout
									</button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</>
				)}
			</nav>
		</header>
	);
}
