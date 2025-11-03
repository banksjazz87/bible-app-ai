import React from "react";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";

export default function UICheckoutForm(){
	const checkoutState = useCheckout();
	return (
		<form>
			<PaymentElement options={{ layout: "accordion" }} />
		</form>
	);
};

