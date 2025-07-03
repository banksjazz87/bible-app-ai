"use client";

import { use, useState } from "react";
import { ChatThread, APIDataResponse } from "@/lib/definitions";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link  from 'next/link';

import { Button } from "@/components/ui/button";

type PastThreadsProps = {
	threads: Promise<APIDataResponse<ChatThread[] | null>>;
};

const defaultThread: ChatThread = {
	id: -1,
	date_created: "",
	last_modified: "",
	thread_name: "",
	bible_version: "",
	book: "",
	chapter: "",
	start_verse: "",
	end_verse: "",
	llm_notes: [],
	user_notes: "",
    user_id: "",
    thread_slug: ''
};

function convertDateTime(timeStamp: string): string {
	const date: Date = new Date(timeStamp);
	const day: number = date.getDate();
	const month: number = date.getMonth();
	const year: number = date.getFullYear();

	return `${month + 1}/${day}/${year}`;
}

function getSlug(title: string) {
    const urlOfTitle = title.replace(/[" ", "_", "/"]/g, "-");
    return urlOfTitle;
}

function PastThreads({ threads }: PastThreadsProps) {
	const pastThreads = use(threads);
	const [selectedForView, setSelectedForView] = useState<ChatThread>(defaultThread);

	const viewClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, threadData: ChatThread) => {
		setSelectedForView({
			...selectedForView,
			id: threadData.id,
			date_created: threadData.date_created,
			last_modified: threadData.last_modified,
			thread_name: threadData.thread_name,
			bible_version: threadData.bible_version,
			book: threadData.book,
			chapter: threadData.chapter,
			start_verse: threadData.start_verse,
			end_verse: threadData.end_verse,
			llm_notes: threadData.llm_notes,
			user_notes: threadData.user_notes,
			user_id: threadData.user_id,
		});
	};

	return (
		<Table>
			<TableCaption>A list of your recent threads.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Last Modified</TableHead>
					<TableHead>Date Created</TableHead>
					<TableHead>Thread Name</TableHead>
					<TableHead>Bible Selection</TableHead>
					<TableHead className="center">View</TableHead>
					<TableHead className="center">Download</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{pastThreads &&
					pastThreads.data?.map((thread: ChatThread, y: number) => (
						<TableRow key={`thread_num_${y}`}>
							<TableCell>{convertDateTime(thread.last_modified)}</TableCell>
							<TableCell>{convertDateTime(thread.date_created)}</TableCell>
							<TableCell>{thread.thread_name}</TableCell>
							<TableCell className="capitalize">{`${thread.book} ${thread.chapter}:${thread.start_verse} - ${thread.end_verse}`}</TableCell>
							<TableCell>
                                <Link href={`/account/profile/thread/${getSlug(thread.thread_name)}` } ><Button>View</Button></Link>
							</TableCell>
							<TableCell>
								<Button onClick={(e) => viewClickHandler(e, thread)}>Download</Button>
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
						<TableHead className="center">Download</TableHead>
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
