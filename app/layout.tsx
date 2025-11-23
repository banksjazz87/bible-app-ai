import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./ui/Navbar";
import StoreProvider from "./StoreProvider";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import UICheckoutForm from "@/components/stripe/UICheckoutForm";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Bible App",
	description: "Not another bible app.  Use this app to view bible verses and create sermons, using openAI.",
};


const clientSecret = fetch('/api/create-checkout-session', { method: 'POST' })
	.then((res) => res.json())
	.then((data) => data.checkoutSessionClientSecret);

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<StoreProvider>
					<NavBar />
					{children}
				</StoreProvider>
			</body>
		</html>
	);
}
