"use client"

import { use, useState } from "react";
import { UserSubscriptionResponse } from "@/lib/definitions";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Stripe } from "stripe";
import { Spinner } from "@/components/ui/spinner";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";


type SubscriptionLayoutProps = {
	subscriptionData: Promise<UserSubscriptionResponse>;
};

export default function SubscriptionLayout({ subscriptionData }: SubscriptionLayoutProps) {
    const userData = use(subscriptionData);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [cancelID, setCancelID] = useState<string>('');
    console.log('User subscription data here!!!!! ', userData);

    const cancelHandler = (id: string) => {
        setIsCancelling(true);
        setCancelID(id);

        setTimeout(() => {
            setIsCancelling(false);
            setCancelID('');
        }, 2000);
    };

	return (
		<section>
			<h2>Subscription Details</h2>

			{userData.data === null && <p>No Data found</p>}

			{userData.data !== null && (
				<Table>
					<TableCaption>A list of your subscriptions.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Subscription/Plan</TableHead>
							<TableHead>Billing Cycle</TableHead>
							<TableHead>Amount Due</TableHead>
							<TableHead>Renewal Date</TableHead>
							<TableHead className="center"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{userData?.data.map((data: Stripe.Subscription, y: number) => (
							<TableRow key={`thread_num_${y}`}>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell className="capitalize"></TableCell>
								<TableCell>
									{/* <Button
										variant="outline"
										onClick={(): void => cancelHandler()}
										disabled={isCancelling && cancelID === thread.id}
									>
										{isCancelling && cancelID === thread.id && <Spinner data-icon="inline-start" />}
										<FontAwesomeIcon
											icon={faTrash}
											className="text-gray-700"
										/>
									</Button> */}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</section>
	);
}