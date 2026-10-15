"use client";

import { JSX, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { getPaymentMethods, getCustomerDetails } from "@/app/actions/stripe";
import { Elements } from "@stripe/react-stripe-js";
import CardManagerForm from "./CardManagerForm";

const testMode = process.env.NEXT_PUBLIC_STRIPE_TEST_MODE;
const stripePromise = loadStripe(testMode ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLIC_KEY! : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type sessionSecret = {
	customerSessionClientSecret: string;
	clientSecret: string;
};
export default function PaymentMethods(): JSX.Element {
	const [secrets, setSecrets] = useState<sessionSecret | null>(null);

	useEffect((): void => {
		async function fetchClientSecrets() {
			try {
				const customerDetails = await getCustomerDetails();

				if (!customerDetails.success) {
					console.error(customerDetails.message);
					return;
				}

				const customerID = customerDetails.data[0].id;
				const paymentSession = await getPaymentMethods(customerID);

				if (!paymentSession.success) {
					console.error(paymentSession.message);
					return;
				}

				setSecrets(paymentSession.data);
			} catch (e: unknown) {
				console.error(`The following error occcurred while loading the wallet: ${e instanceof Error && e.message}`);
			}
		}

		fetchClientSecrets();
	}, []);

	if (!secrets) return <div>Loading card manager...</div>;

	const options = {
		clientSecret: secrets.clientSecret,
		customerSessionClientSecret: secrets.customerSessionClientSecret,
	};

	return (
		<Elements
			stripe={stripePromise}
			options={options}
		>
			<CardManagerForm />
		</Elements>
	);
}
