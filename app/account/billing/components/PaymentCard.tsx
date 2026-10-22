"use server";

import { PaymentIcon } from "react-svg-credit-card-payment-icons";
import Stripe from "stripe";
import { APIResult } from "@/lib/definitions";
import { Button } from "@/components/ui/button";

type PaymentCardProps = {
	paymentMethod: APIResult<Stripe.PaymentMethod> | null;
};

type CardBrand = React.ComponentProps<typeof PaymentIcon>["type"];
const brandMap: Record<string, CardBrand> = {
	visa: "Visa",
	mastercard: "Mastercard",
	amex: "AmericanExpress",
	discover: "Discover",
	diners: "DinersClub",
	jcb: "Jcb",
	unionpay: "Unionpay",
};

export default async function PaymentCard({ paymentMethod }: PaymentCardProps) {
	if (!paymentMethod) return <p>Loading...</p>;

	if (!paymentMethod.success) return <p>No default payment method found.</p>;

	if (paymentMethod.data.card) {
		const card = paymentMethod.data.card;
		return (
			<div className="flex flex-row gap-4 items-center justify-between shadow-2xs border rounded-2xl p-4">
				<div className="flex flex-row gap-4 items-center">
					<PaymentIcon
						type={brandMap[card.display_brand ?? ""] ?? "Generic"}
						format="flatRounded"
						width={60}
					/>
					<div className="flex flex-col justify-items-start gap-1">
						<p className="capitalize font-bold lh">{`${card.brand} ...${card.last4}`}</p>
						<small>{`Expires: ${card.exp_month}/${card.exp_year}`}</small>
					</div>
				</div>
				<Button variant="outline">Edit</Button>
			</div>
		);
	}
}
