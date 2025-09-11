import { JSX } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { SubscriptionData } from "@/lib/definitions";


type PriceCardProps = {
    cardData: SubscriptionData;
}

export default function PriceCard({cardData}: PriceCardProps) {
    return (
			<div className="grid-cols-1 border border-slate-800 rounded-md p-2 flex flex-col gap-2 align-middle justify-between min-h-96 py-24 px-10">
				<p className="text-center text-3xl font-semibold">Free</p>
				<ul className="text-left">
					<li>Limit of 5 AI queries per day</li>
					<li>Email notifications of all future updates</li>
				</ul>
				<Button>Sign Up</Button>
			</div>
		);
}