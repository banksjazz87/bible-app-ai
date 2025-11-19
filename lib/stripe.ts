import "server-only";
import { headers } from "next/headers";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

const testMode = true;
const apiKey = testMode ? process.env.STRIPE_TEST_PRIVATE_KEY! : process.env.STRIPE_SECRET_KEY!;

export const stripe: Stripe = new Stripe(apiKey as string, {
	typescript: true,
	apiVersion: "2025-10-29.clover",
});
