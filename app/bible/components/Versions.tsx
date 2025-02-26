"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { BibleVersions, VersionsProps } from "@/lib/definitions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function Versions({ versions, sectionTitle }: VersionsProps) {
	const [selectedVersion, setSelectedVersion] = useState<string>("");
	const searchParams = useSearchParams();

	const changeHandler = (value: string): void => {
		setSelectedVersion(value);
	};

	return (
		<div className="d-flex flex-col justify-start">
			<p className="pb-2">{sectionTitle}</p>
			<Select onValueChange={changeHandler}>
				<SelectTrigger className="rounded-none border-slate-600">
					<SelectValue placeholder="Select a version" />
				</SelectTrigger>
				<SelectContent>
					{versions.map((x: BibleVersions, y: number) => (
						<SelectItem
							key={`version_option_${y}`}
							value={x.value}
						>
							{x.title}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
