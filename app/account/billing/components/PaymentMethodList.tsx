"use client";

import { use, useEffect } from "react";
import { PaymentIcon } from "react-svg-credit-card-payment-icons";
import Stripe from "stripe";
import { APIResult } from "@/lib/definitions";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PaymentMethodsListProps = {
	paymentList: Promise<APIResult<Stripe.PaymentMethod[]>>;
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

export default function PaymentMethodsList({ paymentList }: PaymentMethodsListProps) {
    const list = use(paymentList);
    
    if (!list.success) return <></>;
    
    console.log("List here: ", list);

	return list.data.map((item: Stripe.PaymentMethod, y: number) => {
		if (item.card) {
			const card = item.card;
			return (
				<div
					className="flex flex-row gap-4 items-center shadow-2xs border rounded-2xl p-4"
					key={`item_${y}`}
				>
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
	});
}
