"use client";

import { JSX } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAppSelector } from "@/lib/store/hooks";

type PriceCardProps = {
	title: string;
	details: string[];
	value: number;
	optionValue: string;
};

export default function PriceCard({ title, details, value, optionValue }: PriceCardProps): JSX.Element {
	const userLoggedIn = useAppSelector((state) => state.loggedInData.isLoggedIn);
	const userRole = useAppSelector((state) => state.loggedInData.userRole);
	const targetPage = userLoggedIn ? "/subscribe" : "/account/login";
	const hrefLink = `${targetPage}?option=${optionValue}`;
	const isUserTier = userRole === title.toLowerCase();

	const listItems: JSX.Element[] = details.map((x: string, y: number):JSX.Element => {
		return (
			<li
				key={`list_item_${y}`}
				className="flex flex-row gap-2 align-middle"
			>
				<div className="rounded-full h-7 w-7 flex items-center bg-neutral-900 justify-center">
					<FontAwesomeIcon
						icon={faCheck}
						className="size-4 text-white"
					/>
				</div>
				{x}
			</li>
		);
	});

	return (
		<div className={`grid-cols-1 border border-slate-800 rounded-md flex flex-col align-middle justify-between gap-10 p-12 ${isUserTier ? "bg-slate-200 opacity-95 border-slate-300 dark:bg-slate-400" : "bg-white}"}`}>
			<div className="flex flex-col gap-10">
				<div className="flex flex-col gap-1">
					<p className="text-1xl font-semibold">{title}</p>
					<p className="text-3xl font-bold">{`$${value}/Month`}</p>
				</div>

				<div>
					<ul className="text-left">{listItems}</ul>
					<input
						type="hidden"
						name="price-option"
						value={optionValue}
					/>
				</div>
			</div>

			{isUserTier ? (
				<Button
					disabled
					aria-disabled
				>
					Signup
				</Button>
			) : (
				<Link
					href={isUserTier ? "" : hrefLink}
					className="flex flex-col"
				>
					<Button>Signup</Button>
				</Link>
			)}
		</div>
	);
}
