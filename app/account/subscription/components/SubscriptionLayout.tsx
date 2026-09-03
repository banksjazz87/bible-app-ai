"use client"

import { use, useState } from "react";
import { UserSubscriptionResponse } from "@/lib/definitions";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Stripe } from "stripe";
import { cancelSubscription, deleteSubscription } from "@/app/actions/stripe";
import { Spinner } from "@/components/ui/spinner";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import { StripeProducts } from "@/lib/constants";
import Alert from "@/app/ui/Alert";


type SubscriptionLayoutProps = {
	subscriptionData: Promise<UserSubscriptionResponse>;
};

export default function SubscriptionLayout({ subscriptionData }: SubscriptionLayoutProps) {
    const userData = use(subscriptionData);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [cancelID, setCancelID] = useState<string>('');
    const [alertIsOpen, setAlertIsOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [deleteID, setDeleteID] = useState<string>('');

    console.log('User subscription data here!!!!! ', userData);

    function cancelRequestHandler(id: string): void {
        setIsCancelling(true);
        setCancelID(id);
        setAlertIsOpen(true);
    };

    function clearCancelSubscriptionState(): void {
        setIsCancelling(false);
        setCancelID('');
        setAlertIsOpen(false);
    }

    function deleteRequestHandler(id: string): void {
        setIsDeleting(true);
        setDeleteID(id);
        setAlertIsOpen(true);
    }

    function clearDeleteRequest(): void {
        setIsDeleting(false);
        setDeleteID('');
        setAlertIsOpen(false);
    }

    async function cancelSubscriptionHandler() {
        const cancel = await cancelSubscription(cancelID);

        if (cancel.status !== 200) {
            clearCancelSubscriptionState();
            alert(`The following error occurred in canceling the subscription:  ${cancel.message}`);
        } else {
            clearCancelSubscriptionState();
            console.log(cancel.message);
        }
    }

    async function deleteSubscriptionHandler() {
        const deleted = await deleteSubscription(deleteID);

        if (deleted.status !== 200) {
            clearDeleteRequest();
            toast('Error', {
                description: `The following error occurred in deleting the subscription: ${deleted.message}`,
            });
            console.error(`The following error occurred in deleting the subscription: ${deleted.message}`);
        } else {
            clearDeleteRequest();
            toast('Success', {
                description: 'The subscription has been deleted.'
            });
        }
    }

    const getDate = (unixDate: number): string => {
        const date = new Date(unixDate * 1000);
        const formattedDate = new Intl.DateTimeFormat('en-US').format(date);
        return formattedDate;
    }

    function getNextBillingDate(unixDate: number): string {
        const date = new Date(unixDate * 1000);
        date.setMonth(date.getMonth() + 1);

        const nextMonthUnix = Math.floor(date.getTime() / 1000);
        const nextMonthDate = getDate(nextMonthUnix);

        return nextMonthDate;
    }

	return (
		<section>
			<h2>Subscription Details</h2>

			{userData.data === null && <p>No Data found</p>}

            {/**    CANCELLATION ALERT    **/}
			<Alert
				isOpen={alertIsOpen && isCancelling}
				openHandler={() => setAlertIsOpen(true)}
				closeHandler={() => setAlertIsOpen(false)}
				title="Cancel Subscription"
				description="Are you sure that you would like to cancel the subscription?"
				cancelHandler={() => setAlertIsOpen(false)}
				confirmHandler={() => cancelSubscriptionHandler()}
				confirmText="Cancel Subscription"
				cancelText="Keep Subscription"
			/>

            {/**     DELETE ALERT    **/}
			<Alert
				isOpen={alertIsOpen && isDeleting}
				openHandler={() => setAlertIsOpen(true)}
				closeHandler={() => setAlertIsOpen(false)}
				title="Delete Subscription"
				description="Are you sure that you would like to permanently delete the subscription?"
				cancelHandler={() => setAlertIsOpen(false)}
				confirmHandler={() => deleteSubscriptionHandler()}
				confirmText="Yes"
				cancelText="Cancel"
			/>

			{userData.data !== null && (
				<Table>
					<TableCaption>A list of your subscriptions.</TableCaption>
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
						{userData?.data.map((data: Stripe.Subscription, y: number) => (
							<TableRow key={`thread_num_${y}`}>
								<TableCell>{StripeProducts.get(data.items.data[0].plan.product as string)}</TableCell>
								<TableCell className="capitalize">{`${data.items.data[0].plan.interval}ly`}</TableCell>
								<TableCell>{data.items.data[0].plan.amount ? `$${data.items.data[0].plan.amount / 100}` : "$0.00"}</TableCell>
                                <TableCell>{getDate(data.start_date)}</TableCell>
                                <TableCell>{ getNextBillingDate(data.billing_cycle_anchor) }</TableCell>
                                <TableCell>{data.canceled_at ? getDate(data.canceled_at) : "-"}</TableCell>
                                <TableCell>{data.cancel_at ? getDate(data.cancel_at) : '-'}</TableCell>
								<TableCell className="capitalize"></TableCell>
								<TableCell>
									{/**    SUBSCRIPTION HAS BEEN CANCELED    **/}
									{data.canceled_at && (
										<Button
											variant="secondary"
											onClick={(): void => deleteRequestHandler(data.id)}
											disabled={isDeleting && deleteID === data.id}
										>
											{isDeleting && deleteID === data.id && <Spinner data-icon="inline-start" />}
											Delete
										</Button>
									)}

									{/**    SUBSCRIPTION HAS NOT BEEN CANCELED    **/}
									{data.canceled_at === null && (
										<Button
											variant="destructive"
											onClick={(): void => cancelRequestHandler(data.id)}
											disabled={isCancelling && cancelID === data.id}
										>
											{isCancelling && cancelID === data.id && <Spinner data-icon="inline-start" />}
											Cancel
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</section>
	);
}