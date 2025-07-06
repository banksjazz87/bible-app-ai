import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertDateTime(timeStamp: string): string {
	const date: Date = new Date(timeStamp);
	const day: number = date.getDate();
	const month: number = date.getMonth();
	const year: number = date.getFullYear();

	return `${month + 1}/${day}/${year}`;
}
