"use server";

import PriceCard from "./components/PriceCard";
import { Suspense, JSX } from "react";
import { getProducts } from "../actions/stripe";


const products = await getProducts();

export default async function Pricing(): Promise<JSX.Element> {
	return (
		<Suspense fallback={pageFallBack()}>{pageContent()}</Suspense>
	);
}

const pricingDetails = new Map([
	['Free', ["Limit of 5 AI queries per day", "Email notifications of all future updates"]],
	['Basic', ["Limit of 20 AI queries per day", "Save Data for up to 2 Weeks", "Print PDF of notes", "Email notifications of all future updates"]],
	['Premiere', ["Limit of 50 AI queries per day", "Save data for life", "Print PDF of notes", "Email notifications of all future updates"]]
]);

const pageContent = (): JSX.Element => {
	console.log(products);
	const allProducts = products.data?.map((x, y) => {
		const details = pricingDetails.get(x.product.name);
		return (
			<PriceCard
				key={`price_card_${y}`}
				title={x.product.name}
				details={details ? details : []}
				value={x.product.default_price as string}
				optionValue={`${x.product.default_price as string}`}
			/>
		);
	});

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
						optionValue="free"
					/>
					{allProducts}
				</div>
			</section>
		</main>
	);
}

const pageFallBack = (): JSX.Element=> {
	return (
	<main className="flex flex-col">
		<section className="py-16">
			<h1 className="font-mono font-extrabold text-5xl text-center">Pricing</h1>
			<p className="font-mono text-l uppercase font-bold text-center pt-4">Check out our subscription options</p>

			<div className="grid grid-cols-3 gap-4 pt-9">
				<div className="grid-cols-1 border border-slate-800 rounded-md p-2 flex flex-col gap-2 align-middle justify-between min-h-96 py-24 px-10">
				</div>
			</div>
		</section>
		</main>
	);
}
