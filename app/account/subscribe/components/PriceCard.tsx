import { JSX } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { SubscriptionData } from "@/lib/definitions";

type PriceCardProps = {
	title: string;
	details: string[];
    value: string;
    clickHandler: () => void;
};

export default function PriceCard({ title, details, value }: PriceCardProps) {
	const listItems = details.map((x: string, y: number) => {
		return (
			<li
				key={`list_item_${y}`}
				className="flex flex-row gap-2 align-middle"
			>
				<FontAwesomeIcon
					icon={faCheck}
					className="size-4"
				/>
				{x}
			</li>
		);
	});
	return (
		<div className="grid-cols-1 border border-slate-800 rounded-md p-2 flex flex-col gap-2 align-middle justify-between min-h-96 py-24 px-10">
			<p className="text-center text-3xl font-semibold">{title}</p>
			<ul className="text-left">{listItems}</ul>
			<input
				type="hidden"
				name="price-option"
				value={value}
			/>
			<Button>Sign Up</Button>
		</div>
	);
}
