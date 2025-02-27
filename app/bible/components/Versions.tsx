"use client";
import { useCallback } from "react";
import { useSearchParams, usePathname, useRouter} from "next/navigation";
import { BibleVersions, VersionsProps } from "@/lib/definitions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function Versions({ versions, sectionTitle, optionsID }: VersionsProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const changeHandler = useCallback((value: string): string => {
		const params = new URLSearchParams(searchParams.toString());
		params.set(optionsID, value);
		return params.toString();
	},[searchParams]);

	return (
		<div className="d-flex flex-col justify-start">
			<p className="pb-2">{sectionTitle}</p>
			<Select onValueChange={(value): void => {
				router.push(pathname + '?' + changeHandler(value));
			}}>
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
