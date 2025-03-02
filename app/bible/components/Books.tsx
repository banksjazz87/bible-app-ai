"use client";

import { useState, useEffect } from "react";
import { BooksProps, BookAndChapters } from "@/lib/definitions";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback } from "react";

export default function Books({ books, sectionTitle, changeHandler, optionsID }: BooksProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const queryHandler = useCallback((value: string): string => {
		const params = new URLSearchParams(searchParams.toString());
		params.set(optionsID, value);
		return params.toString();
	}, [searchParams]);


	return (
		<div className="d-flex flex-col gap-1 justify-start align-middle">
			<p className="pb-2">{sectionTitle}</p>
			<Select
				onValueChange={(value): void => {
					router.push(pathname + "?" + queryHandler(value));
					changeHandler(value);
				}}
			>
				<SelectTrigger className="rounded-none border-slate-600">
					<SelectValue
						id="testing"
						placeholder="Select a version"
					/>
				</SelectTrigger>
				<SelectContent >
					{books.map((x: BookAndChapters, y: number) => (
						<SelectItem
							key={`book_option_${y}`}
							value={x.book.toLowerCase()}
						>
							{x.book}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
