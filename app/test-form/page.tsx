import { NextPage } from "next";


import CheckoutForm from "@/components/stripe/CheckoutForm";

const DonatePage: NextPage = () => {
	return (
		<main>
			<div className="page-container">
				<h1>Donate with Checkout</h1>
				<p>Donate to our project 💖</p>
				<CheckoutForm />
			</div>
		</main>
	);
};

export default DonatePage;
