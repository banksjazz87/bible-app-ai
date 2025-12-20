"use server";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
    return (
			<main className="flex flex-col">
				<section className="py-16">
					<h1 className="font-mono font-extrabold text-5xl text-center">Thanks for your order</h1>
				</section>
				<section className="py-16">
					<div className="flex flex-row gap-4 justify-center pt-9">
						<Button>
							<Link href="/bible">Go to App</Link>
						</Button>
						<Button>
							<Link href="/account/profile">View Account</Link>
						</Button>
					</div>
				</section>
			</main>
		);
}