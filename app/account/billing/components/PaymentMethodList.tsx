"use client";

import { use } from "react";
import { PaymentIcon } from "react-svg-credit-card-payment-icons";
import Stripe from "stripe";
import { APIResult } from "@/lib/definitions";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PaymentMethodsListProps = {
	paymentList: Promise<APIResult<Stripe.PaymentMethod[]>>
		};
export default function PaymentMethodsList({ paymentList }: PaymentMethodsListProps) {
    
    const list = use(paymentList);
  
    if (!list.success) return <></>;


    return (
        list.data.map((item: Stripe.PaymentMethod, y: number) => {
            if (item.card) {
                const card = item.card;
                return (
                <div key={`item_${y}`}>
                    <p>{card.brand}</p>
                    <p>{`Expires: ${card.exp_month}/${card.exp_year}`}</p>
                    <p>{`...${card.last4}`}</p>
                    <PaymentIcon type={"Mastercard"} format="flatRounded" width={100} />
                </div>
                )

            }
        })

        
    //      return (
    //     <>
    //         <PaymentIcon type="Visa" format="flatRounded" width={100} />
    //     </>
    // )
    )
}