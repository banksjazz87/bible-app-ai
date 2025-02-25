import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BibleVersion } from "@/lib/definitions";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


export default function Versions() {
    const [bibleVersions, setBibleVersions] = useState<BibleVersion[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<string>('');
    const searchParams = useSearchParams();

    useEffect((): void => {
        const bibleVersions = fetch("https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/bibles.json");
        bibleVersions
            .then((data: Response): Promise<BibleVersion[]> => {
                return data.json();
            })
            .then((final: BibleVersion[]): void => {    
                setBibleVersions(final);
            })
            .catch((error: any): void => console.error(error));
    }, []);


    const changeHandler = (value: string): void => {
        setSelectedVersion(value);
    }



    return (
			<Select onValueChange={changeHandler}>
				<SelectTrigger
					className="rounded-none border-slate-600"
				>
					<SelectValue placeholder="Select a version" />
				</SelectTrigger>
				<SelectContent>
					{bibleVersions.length > 1 &&
						bibleVersions.map((x: BibleVersion, y: number) => {
							if (x.language.code === "eng") {
								return (
									<SelectItem
										key={`version_option_${y}`}
										value={x.id}
									>
										{x.version}
									</SelectItem>
								);
							}
						})}
				</SelectContent>
			</Select>
		);
}