"use server";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";


export default async function Page({ searchParams }: { searchParams: Promise<{ session_id: string }> }) {
    const params = await searchParams;
    const sessionID = params.session_id;

    const sessionData: Stripe.Response<Stripe.Checkout.Session> = await stripe.checkout.sessions.retrieve(sessionID);
    const { customer, customer_details, amount_total, payment_status, invoice } = sessionData;
    const customerEmail = customer_details?.email;
    const customerName = customer_details?.name;
    const orderMessage = payment_status === "paid" ? "Thanks for Subscribing!" : "Your subscription is pending.";

    // const invoice = await stripe.invoices.createPreview({ customer: customer as string });
    const invoiceData = await stripe.invoices.retrieve(invoice as string);
    const { hosted_invoice_url, invoice_pdf } = invoiceData;
    console.log('Invoice Data here ', invoiceData);


    console.log('Data here ', sessionData);
    
    return (
			<main className="flex flex-col">
				<section className="py-16">
					<h1 className="font-mono font-extrabold text-5xl text-center">{orderMessage}</h1>
				</section>
				<section className="py-16">
					<p className="text-center">{`Thanks for your subscription to the Bible App ${customerName}!  We're so happy to have you with us.  If you would ever like to change or cancel your subscription you can do so within your account page.  Thanks again!  We're excited to have you on board.`}</p>
					<div className="flex flex-row gap-4 justify-center pt-9">
						<Button>
							<Link href="/bible">Go to App</Link>
						</Button>
						<Button>
							<Link href="/account/profile">View Account</Link>
						</Button>
						<Button>
							<Link href={invoice_pdf as string}>Download Invoice</Link>
						</Button>
					</div>
				</section>
			</main>
		);
}