import { Lilita_One } from "next/font/google";
import { Button } from "@/components/ui/button";

export default function Subscribe() {
	return (
		<main className="flex flex-col">
			<section className="py-16">
				<h1 className="font-mono font-extrabold text-5xl text-center">Thanks for signing up!</h1>
				<p className="font-mono text-l uppercase font-bold text-center pt-4">Check out our subscription options</p>

				<div className="grid grid-cols-3 gap-4 pt-9">
					<div className="grid-cols-1 border border-slate-800 rounded-md p-2 flex flex-col gap-2 align-middle justify-between min-h-96 py-24 px-10">
						<p className="text-center text-3xl font-semibold">Free</p>
						<ul className="text-center">
							<li>Limit of 5 AI queries per day</li>
						</ul>
						<Button>Sign Up</Button>
					</div>
				</div>
			</section>
		</main>
	);
}
