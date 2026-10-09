"use server";

import { JSX } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type SmallInfoCard = {
	header: string;
	badge: JSX.Element;
	body: string;
	footer: JSX.Element | string;
};

export default async function SmallInfoCard({ header, badge, body, footer }: SmallInfoCard) {
	return (
		<Card>
			<CardHeader className="flex flex-row content-center justify-between">
				<CardTitle className="text-sm">{header}</CardTitle>
				{badge}
			</CardHeader>
			<CardContent>
				<p className="text-3xl font-bold">{body}</p>
			</CardContent>
			<CardFooter>
				{ typeof footer === "string" ? 
				<p className="text-md">{footer}</p>
				:
				footer
			}
			</CardFooter>
		</Card>
	);
}
