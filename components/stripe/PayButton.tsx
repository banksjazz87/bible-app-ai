import React from "react";
import { useCheckout } from "@stripe/react-stripe-js/checkout";

type CheckoutError = { message?: string } | null;

const PayButton: React.FC = () => {
	const checkoutState = useCheckout();
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<CheckoutError>(null);

	const handleClick = async () => {
		setLoading(true);
		try {
			// ensure the hook actually provides confirm; adjust per library docs
			const confirm = (checkoutState as any)?.confirm;
			if (typeof confirm !== "function") {
				throw new Error("confirm() not available from useCheckout() — check the library/docs");
			}

			const result: any = await confirm(); // replace `any` with the correct type from the lib
			if (result?.type === "error") {
				setError(result.error ?? { message: "Unknown error" });
			} else {
				setError(null);
			}
		} catch (err: any) {
			setError({ message: err?.message ?? "Unknown error" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<button
				disabled={loading}
				onClick={handleClick}
			>
				Pay
			</button>
			{error?.message && <div>{error.message}</div>}
		</div>
	);
};

export default PayButton;
