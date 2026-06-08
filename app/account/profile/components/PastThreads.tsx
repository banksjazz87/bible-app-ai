"use client";

import { use } from "react";
import { ChatThread, APIDataResponse } from "@/lib/definitions";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { convertDateTime } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteChatThreadHandler } from "../actions";
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
								<Link href={`/account/profile/thread/${thread.thread_slug}`}>
									<Button>{`View ${thread.id}`}</Button>
								</Link>
							</TableCell>
							<TableCell>
								<Button
									variant="outline"
									onClick={async(): Promise<void> => {
										try {
											const deleteChat = await deleteChatThreadHandler(thread.id!);
											if (deleteChat.status !== 200) {
												console.error("The following error: ", deleteChat.message);
											} else {
												window.location.reload();
											}
										} catch (e: unknown) {
											console.error(`The following error occurred while updating the chat thread: `, e);
										}
									}}
								>
									<FontAwesomeIcon
										icon={faTrash}
										className="text-gray-700"
									/>
								</Button>
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
						<TableHead className="center"></TableHead>
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

export { PastThreads, PastThreadsSkeleton };
