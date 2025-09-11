import { Lilita_One } from "next/font/google";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function Subscribe() {
	return (
		<main className="flex flex-col">
			<section className="py-16">
				<h1 className="font-mono font-extrabold text-5xl text-center">Thanks for signing up!</h1>
				<p className="font-mono text-l uppercase font-bold text-center pt-4">Check out our subscription options</p>

				<div className="grid grid-cols-3 gap-4 pt-9">
					<div className="grid-cols-1 border border-slate-800 rounded-md p-2 flex flex-col gap-2 align-middle justify-between min-h-96 py-24 px-10">
						<p className="text-center text-3xl font-semibold">Free</p>
						<ul className="text-left">
							<li>Limit of 5 AI queries per day</li>
							<li>Email notifications of all future updates</li>
						</ul>
						<Button>Sign Up</Button>
					</div>

					<div className="grid-cols-1 border border-slate-800 rounded-md p-2 flex flex-col gap-2 align-middle justify-between min-h-96 py-24 px-10">
						<p className="text-center text-3xl font-semibold">$10/Month</p>
						<ul className="text-left">
							<li>Limit of 20 AI queries per day</li>
							<li>Save Data for up to 2 Weeks</li>
							<li>Print PDF of notes</li>
							<li>Email notifications of all future updates</li>
						</ul>
						<Button>Sign Up</Button>
					</div>

					<div className="grid-cols-1 border border-slate-800 rounded-md p-2 flex flex-col gap-2 align-middle justify-between min-h-96 py-24 px-10">
						<p className="text-center text-3xl font-semibold">$25/Month</p>
						<ul className="text-left">
                            <li className="flex flex-row gap-2 align-middle"><FontAwesomeIcon icon={faCheck} className="size-4" />Limit of 50 AI queries per day</li>
							<li>Save data for life</li>
							<li>Print PDF of notes</li>
							<li>Notifications of all future updates</li>
						</ul>
						<Button>Sign Up</Button>
					</div>
				</div>
			</section>
		</main>
	);
}
