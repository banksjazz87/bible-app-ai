"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Versions from "@/app/bible/components/Versions";
import Books from "@/app/bible/components/Books";
import Options from "../ui/Options";
import { oldTestamentBooks, newTestamentBooks, EnglishBibleVersions } from "@/lib/bibleData";

export default function Bible() {
	const searchParams = useSearchParams();

	return (
		<div className="mt-6">
			<main>
				<form className="grid grid-flow-col grid-rows-1 gap-4">
                    <Versions versions={EnglishBibleVersions}
                        sectionTitle="Select a Bible Version"
                    />

                    <Options
                        changeHandler={(value: string): void => console.log(value)}
                        sectionTitle="Old or New Testament?"
                        options={[
                            { value: "old", text: "Old Testament" },
                            { value: "new", text: "New Testament" }
                        ]}
                    />

					<Books
						books={oldTestamentBooks}
						changeHandler={(value: string): void => console.log(value)}
						sectionTitle="Old Testament"
					/>

					<Books
						books={newTestamentBooks}
						changeHandler={(value: string): void => console.log(value)}
						sectionTitle="New Testament"
					/>
				</form>
			</main>
		</div>
	);
}
