import Link from "next/link";
import { JSX } from "react";

type HyperLinkProps = {
    hrefValue: string;
    text: string;
}

export default function HyperLink({hrefValue, text}: HyperLinkProps): JSX.Element {
    return (
			<Link
				className="font-bold hover:text-gray-700"
				href={hrefValue}
			>
				{text}
			</Link>
		);
}