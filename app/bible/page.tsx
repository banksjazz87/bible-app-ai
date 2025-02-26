"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Versions from "@/app/bible/components/Versions";
import Books from "@/app/bible/components/Books";
import Options from "../ui/Options";
import { BookAndChapters } from "@/lib/definitions";
import { oldTestamentBooks, newTestamentBooks, EnglishBibleVersions } from "@/lib/bibleData";

export default function Bible() {
    const [testament, setTestament] = useState<string>('');
    const searchParams = useSearchParams();


	return (
		<div className="mt-6">
			<main>
				<form className="grid grid-flow-col grid-rows-1 gap-4">
					<Versions
						versions={EnglishBibleVersions}
						sectionTitle="Select a Bible Version"
					/>

					<Options
                        changeHandler={(value: string): void => setTestament(value)}
						sectionTitle="Old or New Testament?"
						options={[
							{ value: "old", text: "Old Testament" },
							{ value: "new", text: "New Testament" },
						]}
					/>

					{testament === "old" && (
						<Books
							books={oldTestamentBooks}
                            changeHandler={(value: string): void => {
                               const items =  oldTestamentBooks.filter((x: BookAndChapters, y: number) => {
                                    if (x.book.toLowerCase() === value) {
                                        return x;
                                    }
                               });
                                
                                console.log(value, items);
                            }}
							sectionTitle="Old Testament"
						/>
					)}

					{testament === "new" && (
						<Books
							books={newTestamentBooks}
							changeHandler={(value: string): void => console.log(value)}
							sectionTitle="New Testament"
						/>
					)}

				</form>
			</main>
		</div>
	);
}
