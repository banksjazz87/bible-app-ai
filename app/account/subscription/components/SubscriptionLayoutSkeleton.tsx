"use client";
import { JSX } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableCaption, TableHeader, TableRow, TableBody, TableHead } from "@/components/ui/table";



export default function SubscriptionLayoutSkeleton(): JSX.Element {
return (
	<Skeleton>
		<Table>
			<TableCaption>Table loading...</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Subscription/Plan</TableHead>
					<TableHead>Billing Cycle</TableHead>
					<TableHead>Amount Due</TableHead>
					<TableHead>Start Date</TableHead>
					<TableHead>Renewal Date</TableHead>
					<TableHead>Canceled Date</TableHead>
					<TableHead>End Date</TableHead>
					<TableHead className="center"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow className="h-8"></TableRow>
				<TableRow className="h-8"></TableRow>
				<TableRow className="h-8"></TableRow>
				<TableRow className="h-8"></TableRow>
				<TableRow className="h-8"></TableRow>
				<TableRow className="h-8"></TableRow>
				<TableRow className="h-8"></TableRow>
				<TableRow className="h-8"></TableRow>
				<TableRow className="h-8"></TableRow>
				<TableRow className="h-8"></TableRow>
			</TableBody>
		</Table>
	</Skeleton>
);
}