"use client";

import { useForm } from "react-hook-form";
import { BooksProps, BookAndChapters } from "@/lib/definitions";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCallback } from "react";

export default function Books({ books, sectionTitle, changeHandler, optionsID, placeholder, selectedValue }: BooksProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const form = useForm();

	const queryHandler = useCallback(
		(value: string): string => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(optionsID, value);
			return params.toString();
		},
		[searchParams]
	);

	return (
		<div className="d-flex flex-col gap-1 justify-start align-middle">
			<FormField
				control={form.control}
				name={optionsID}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{sectionTitle}</FormLabel>
						<Select
							onValueChange={(value): void => {
								router.push(pathname + "?" + queryHandler(value));
								changeHandler(value);
							}}
						>
							<SelectTrigger className="rounded-none border-slate-600">
								<SelectValue placeholder={selectedValue.length > 0 ? selectedValue : placeholder} />
							</SelectTrigger>
							<SelectContent>
								{books.map((x: BookAndChapters, y: number) => (
									<SelectItem
										key={`${optionsID}_${y}`}
										value={x.value}
									>
										{x.text}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormItem>
				)}
			/>
		</div>
	);
}
