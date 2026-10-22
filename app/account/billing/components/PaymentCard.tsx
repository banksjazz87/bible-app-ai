"use server";

import { PaymentIcon } from "react-svg-credit-card-payment-icons";
import Stripe from "stripe";
import { APIResult } from "@/lib/definitions";

type PaymentMethodsListProps = {
	paymentMethod: APIResult<Stripe.PaymentMethod>;
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

export default async function PaymentCard({ paymentMethod }: PaymentMethodsListProps) {
	if (!paymentMethod.success) return <p>No default payment method found.</p>;

	if (paymentMethod.data.card) {
		const card = paymentMethod.data.card;
		return (
			<div className="flex flex-row gap-4 items-center shadow-2xs border rounded-2xl p-4">
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
		);
	}
}
