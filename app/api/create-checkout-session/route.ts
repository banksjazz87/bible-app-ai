import Stripe from "stripe";
import { headers } from "next/headers";
import { redirect } from 'next/navigation';

const stripe = new Stripe(process.env.STRIPE_TEST_API_KEY!);


export async function POST(request: Request, res: Response) {
    const headersList = await headers();
    const domain = headersList.get('host');

    const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					// Provide the exact Price ID (for example, price_1234) of the product you want to sell
					price: "{{PRICE_ID}}",
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${domain}/subscribe?success=true`,
			cancel_url: `${domain}/subscribe?canceled=true`,
			automatic_tax: { enabled: true },
		});

		redirect(session.url as string);
}


export async function GET(req: Request) {
    const headersList = await headers();
    const domain = headersList.get('host');

    return new Response(`Your domain is the following: ${domain}`);
}