"use client"

import { use } from "react";
import { UserSubscriptionResponse } from "@/lib/definitions";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Stripe } from "stripe";


type SubscriptionLayoutProps = {
	subscriptionData: Promise<UserSubscriptionResponse>;
};

export default function SubscriptionLayout({ subscriptionData }: SubscriptionLayoutProps) {
    const userData = use(subscriptionData);
    console.log('User subscription data here!!!!! ', userData);

	return (
		<section>
			<h2>Subscription Details</h2>

			{userData.data === null && <p>No Data found</p>}

			{userData.data !== null && (
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
						{userData?.data.map((data: Stripe.Subscription, y: number) => (
							<TableRow key={`thread_num_${y}`}>
								{/* <TableCell>{convertDateTime(thread.last_modified as string)}</TableCell>
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
								</TableCell> */}
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</section>
	);
}