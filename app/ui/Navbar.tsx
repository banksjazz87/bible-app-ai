'use client'

import Link from "next/link";
import Image from "next/image";
import next from "@/public/next.svg";

type MenuItem = {
	title: string;
	hrefValue: string;
	icon?: string;
};

export default function NavBar() {
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
			hrefValue: "/login",
		},
		{
			title: "Logout",
			hrefValue: "/logout",
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
				{navItems.map((x: MenuItem, y: number) => (
					<Link
						className="text-sm font-medium hover:text-neutral-500"
						key={`menu_item_${y}`}
						href={x.hrefValue}
					>
						{x.title}
					</Link>
				))}
			</nav>
		</header>
	);
}
