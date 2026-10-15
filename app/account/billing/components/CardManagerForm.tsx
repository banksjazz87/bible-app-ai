"use client";

import { useState, FormEvent } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

export default function CardManagerForm() {
	const stripe = useStripe();
	const elements = useElements();
	const [message, setMessage] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		// Ensure Stripe dependencies have properly instantiated hooks
		if (!stripe || !elements) return;

		setIsProcessing(true);
		setMessage(null);

		// Finalize card token creation logic inside the SetupIntent
		const { error } = await stripe.confirmSetup({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/wallet/success`,
			},
		});

		if (error) {
			setMessage(error.message || "An error occurred during submission.");
		} else {
			setMessage("Card added successfully!");
		}

		setIsProcessing(false);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6"
		>
			{/* 
        Renders UI out-of-the-box:
        - Lists previously saved payment method cards containing removal options
        - Renders empty entry card configurations for additions
      */}
			<PaymentElement />

			<Button
				type="submit"
				disabled={isProcessing || !stripe || !elements}
				variant="default"
			>
				{isProcessing ? "Processing Changes..." : "Save New Payment Card"}
			</Button>

			{message && <div className="text-sm font-medium text-red-600 mt-2 bg-red-50 p-2 rounded">{message}</div>}
		</form>
	);
}
