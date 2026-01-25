"use client";
import { useEffect, JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import next from "@/public/next.svg";
import UserAvatar from "./UserAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { logoutUser, loginUser } from "@/lib/store/features/account/loginSlice";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { APIResponse } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ModeToggle from "./ModeToggle";

type MenuItem = {
	title: string;
	hrefValue: string;
	icon?: string;
};


export default function NavBar(): JSX.Element {
	const isLoggedIn = useAppSelector(state => state.loggedInData.isLoggedIn);
	const dispatch = useAppDispatch();
	const router = useRouter();

	//Check the cookies, if the array of cookie values is greater than zero, we'll update the redux store to true.
	useEffect(() => {
		const cookies = document.cookie;
		const arrayOfCookies = cookies.split('; ');
		if (arrayOfCookies[0] === '') {
			dispatch(logoutUser());
		} else {
			dispatch(loginUser({
				isLoggedIn: false,
				email: null, 
				userName: null,
				userRole: null,
				maxRequests: 0
			}));
		}
	}, []);

	const logoutFunction = async () => {
		const logoutCurrentUser = await fetch('/account/logout/');
		const jsonData: APIResponse = await logoutCurrentUser.json();

		if (jsonData.status === 200) {
			dispatch(logoutUser());
			router.replace('/');
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
		}
	];
	const renderNavItems = () => navItems.map((x: MenuItem, y: number) => (
		<Link
			className="text-sm font-medium hover:text-neutral-500"
			key={`menu_item_${y}`}
			href={x.hrefValue}
		>
			{x.title}
		</Link>
	));


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
				{!isLoggedIn && (
					<>
						{renderNavItems()}
						<ModeToggle />
					</>
				)}
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

						<Link href="/pricing">
							<Button>Upgrade</Button>
						</Link>
						<ModeToggle />
						<DropdownMenu>
							<DropdownMenuTrigger>
								<UserAvatar />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>
									<Link href={"/account/profile"}>My Account</Link>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Link href="/account/profile">Profile</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>Billing</DropdownMenuItem>
								<DropdownMenuItem>Subscription</DropdownMenuItem>
								<DropdownMenuItem>
									<button
										type="button"
										onClick={() => logoutFunction()}
									>
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
