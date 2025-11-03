import React from "react";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";

const UICheckoutForm = () => {
	const checkoutState = useCheckout();
	return (
		<form>
			<PaymentElement options={{ layout: "accordion" }} />
		</form>
	);
};

export default UICheckoutForm;
