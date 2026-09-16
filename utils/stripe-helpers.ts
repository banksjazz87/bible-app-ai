export function formatAmountForDisplay(amount: number, currency: string): string {
	const numberFormat = new Intl.NumberFormat(["en-US"], {
		style: "currency",
		currency: currency,
		currencyDisplay: "symbol",
	});
	return numberFormat.format(amount / 100);
}

export function formatAmountForStripe(amount: number, currency: string): number {
	const numberFormat = new Intl.NumberFormat(["en-US"], {
		style: "currency",
		currency: currency,
		currencyDisplay: "symbol",
	});
	const parts = numberFormat.formatToParts(amount);
	let zeroDecimalCurrency: boolean = true;
	for (const part of parts) {
		if (part.type === "decimal") {
			zeroDecimalCurrency = false;
		}
	}
	return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

export function getDate(unixDate: number): string {
	const date = new Date(unixDate * 1000);
	const formattedDate = new Intl.DateTimeFormat("en-US").format(date);
	return formattedDate;
}

export function getNextBillingDate(unixDate: number): string {
	const date = new Date(unixDate * 1000);
	date.setMonth(date.getMonth() + 1);

	const nextMonthUnix = Math.floor(date.getTime() / 1000);
	const nextMonthDate = getDate(nextMonthUnix);

	return nextMonthDate;
}
