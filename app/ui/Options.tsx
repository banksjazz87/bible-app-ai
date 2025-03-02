/**Generic options component to be used when displaying non-specific options */
import { useState, useEffect } from "react";
import { JSX, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectFields, OptionsProps } from "@/lib/definitions";



export default function Options({ changeHandler, sectionTitle, optionsID, options, placeholderText }: OptionsProps): JSX.Element {
	const [selectedOption, setSelectedOption] = useState<string>(placeholderText)
	const path = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const queryHandler = useCallback((value: string): string => {
		const params = new URLSearchParams(searchParams.toString());
		params.set(optionsID, value);
		return params.toString();
	}, [searchParams]);

	useEffect((): void => {
		if (searchParams.has(optionsID)) {
			const selectedValue = searchParams.get(optionsID);
			setSelectedOption(selectedValue as string);
		}
	}, [searchParams]);


	return (
		<div className="d-flex flex-col justify-start">
			<p className="pb-2">{sectionTitle}</p>
			<Select onValueChange={(value) => {
				changeHandler(value);
				// router.push(path + '?' + queryHandler(value));
			}
			}>
				<SelectTrigger className="rounded-none border-slate-600">
					<SelectValue placeholder={selectedOption}  />
				</SelectTrigger>
				<SelectContent>
					{options.map((x: SelectFields, y: number) => (
						<SelectItem
							key={`version_option_${y}`}
							value={x.value}
						>
							{x.text}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
