import "server-only";
import { headers } from "next/headers";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

const testMode = true;
const apiKey = testMode ? process.env.STRIPE_TEST_PRIVATE_KEY! : process.env.STRIPE_SECRET_KEY!;

export const stripe: Stripe = new Stripe(apiKey as string, {
	// https://github.com/stripe/stripe-node#configuration
	// appInfo: {
	// 	name: "nextjs-with-stripe-typescript-demo",
	// 	url: "https://nextjs-with-stripe-typescript-demo.vercel.app",
	// },
	typescript: true,
	apiVersion: "2025-09-30.clover"
});

export const initStripe = loadStripe(apiKey);
