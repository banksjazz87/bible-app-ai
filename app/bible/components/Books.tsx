"use client";

import { BooksProps, BookAndChapters } from "@/lib/definitions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Books({ books, changeHandler }: BooksProps) {

	return (
		<Select onValueChange={(value) => changeHandler(value)}>
			<SelectTrigger className="rounded-none border-slate-600">
				<SelectValue placeholder="Select a version" />
			</SelectTrigger>
			<SelectContent>
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
	);
}
