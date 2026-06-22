"use client";

import { useState } from "react";
import { ChatThread, APIDataResponse } from "@/lib/definitions";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { convertDateTime } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteChatThreadHandler } from "../actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type PastThreadsProps = {
	threads: APIDataResponse<ChatThread[] | null> | null;
	onDeleteSuccess: () => void;
};

function PastThreads({ threads, onDeleteSuccess }: PastThreadsProps) {
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [deletingThreadId, setDeletingThreadId] = useState<number | null>(null);

	/**
	 *
	 * @param threadId {number}
	 * @description method that is fired when the user clicks the trash can button to delete a thread.
	 */
	const deleteHandler = async (threadId: number): Promise<void> => {
		try {
			setIsDeleting(true);
			setDeletingThreadId(threadId);
			const result = await deleteChatThreadHandler(threadId);

			if (result.status === 200) {
				onDeleteSuccess();
			} else {
				console.error(`Failed to delete thread with id ${threadId}, status code: ${result.status}, message: ${result.message}`);
			}
		} catch (e: unknown) {
			console.error(`The following error occurred while updating the chat thread: `, e);
		} finally {
			setIsDeleting(false);
			setDeletingThreadId(null);
		}
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
					<TableHead className="center"></TableHead>
					<TableHead className="center"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{threads &&
					threads.data?.map((thread: ChatThread, y: number) => (
						<TableRow key={`thread_num_${y}`}>
							<TableCell>{convertDateTime(thread.last_modified as string)}</TableCell>
							<TableCell>{convertDateTime(thread.date_created as string)}</TableCell>
							<TableCell>{thread.thread_name}</TableCell>
							<TableCell className="capitalize">{`${thread.book} ${thread.chapter}:${thread.start_verse} - ${thread.end_verse}`}</TableCell>
							<TableCell>
								<Link href={`/account/profile/thread/${thread.thread_slug}`}>
									<Button>View</Button>
								</Link>
							</TableCell>
							<TableCell>
								<Button
									variant="outline"
									onClick={() => deleteHandler(thread.id as number)}
									disabled={isDeleting && deletingThreadId === thread.id}
								>
									{isDeleting && deletingThreadId === thread.id && <Spinner data-icon="inline-start" />}
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
