"use client";

import PriceCard from "./components/PriceCard";
import { useRouter } from "next/navigation";



export default function Pricing() {
    const router = useRouter();

	return (
		<main className="flex flex-col">
			<section className="py-16">
				<h1 className="font-mono font-extrabold text-5xl text-center">Pricing</h1>
				<p className="font-mono text-l uppercase font-bold text-center pt-4">Check out our subscription options</p>

				<div className="grid grid-cols-3 gap-4 pt-9">
					<PriceCard
						title="Free"
						details={["Limit of 5 AI queries per day", "Email notifications of all future updates"]}
						value="free"
						hrefValue="/subscribe?option=free"
					/>
					<PriceCard
						title="$10/Month"
						details={["Limit of 20 AI queries per day", "Save Data for up to 2 Weeks", "Print PDF of notes", "Email notifications of all future updates"]}
						value="basic"
						hrefValue="/subscribe?option=basic"
					/>
					<PriceCard
						title="25/Month"
						details={["Limit of 50 AI queries per day", "Save data for life", "Print PDF of notes", "Email notifications of all future updates"]}
						value="premiere"
						hrefValue="/subscribe?option=premiere"
					/>
				</div>
			</section>
		</main>
	);
}
