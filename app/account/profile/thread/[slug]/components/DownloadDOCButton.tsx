"use client";
import { JSX } from "react";
import { Button } from "@/components/ui/button";
import { asBlob } from "html-docx-js-typescript";
import { saveAs } from "file-saver";

type DocButtonProps = {
	fileName: string;
	htmlID: string;
};

export default function DownloadDOCButton({ fileName, htmlID }: DocButtonProps): JSX.Element {
	const saveAsDoc = (): void => {
		const docContent = document.getElementById(htmlID) as HTMLElement;
        const docAsString: string = docContent.outerHTML;
        
        console.log(docAsString);

		asBlob(docAsString).then(data => {
			saveAs(data as Blob, `${fileName}.docx`);
		})
	};
	return <Button onClick={saveAsDoc}>Download Word Doc</Button>;
}
