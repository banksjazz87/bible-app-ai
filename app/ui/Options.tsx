/**Generic options component to be used when displaying non-specific options */
import { JSX } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectFields, OptionsProps } from "@/lib/definitions";



export default function Options({ changeHandler, sectionTitle, options }: OptionsProps): JSX.Element {
	return (
		<div className="d-flex flex-col justify-start">
			<p className="pb-2">{sectionTitle}</p>
			<Select onValueChange={changeHandler()}>
				<SelectTrigger className="rounded-none border-slate-600">
					<SelectValue placeholder="Select a version" />
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
