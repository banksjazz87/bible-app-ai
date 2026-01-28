"use client";

import { use, useState } from "react";
import { ChatThread, APIDataResponse } from "@/lib/definitions";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import { convertDateTime } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type PastThreadsProps = {
	threads: Promise<APIDataResponse<ChatThread[] | null>>;
};


function PastThreads({ threads }: PastThreadsProps) {
	const pastThreads = use(threads);

	return (
		<Table>
			<TableCaption>A list of your recent threads.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Last Modified</TableHead>
					<TableHead>Date Created</TableHead>
					<TableHead>Thread Name</TableHead>
					<TableHead>Bible Selection</TableHead>
					<TableHead className="center"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{pastThreads &&
					pastThreads.data?.map((thread: ChatThread, y: number) => (
						<TableRow key={`thread_num_${y}`}>
							<TableCell>{convertDateTime(thread.last_modified as string)}</TableCell>
							<TableCell>{convertDateTime(thread.date_created as string)}</TableCell>
							<TableCell>{thread.thread_name}</TableCell>
							<TableCell className="capitalize">{`${thread.book} ${thread.chapter}:${thread.start_verse} - ${thread.end_verse}`}</TableCell>
							<TableCell>
                                <Link href={`/account/profile/thread/${thread.thread_slug}` } ><Button>View</Button></Link>
							</TableCell>
						</TableRow>
					))}
			</TableBody>
		</Table>
	);
}

function PastThreadsSkeleton() {
	return (
		<Skeleton>
			<Table>
				<TableCaption>Table loading...</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Last Modified</TableHead>
						<TableHead>Date Created</TableHead>
						<TableHead>Thread Name</TableHead>
						<TableHead>Bible Selection</TableHead>
						<TableHead className="center">View</TableHead>
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
				</TableBody>
			</Table>
		</Skeleton>
	);
}

export { PastThreads, PastThreadsSkeleton };
