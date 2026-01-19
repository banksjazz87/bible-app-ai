"use client";

import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { JSX } from "react";

type DownloadPDFButtonProps = {
    pdfContentID: string,
    file: string
}

export default function DownloadPDFButton({ pdfContentID, file }: DownloadPDFButtonProps): JSX.Element {
	const downloadClickHandler = (pdfContentID: string, fileName: string): void => {
		const pdfContent = document.getElementById(pdfContentID) as HTMLElement;
		const doc: jsPDF = new jsPDF("p", "pt", "a4");

		doc.html(pdfContent, {
			callback: function (doc: jsPDF) {
				// doc.autoPrint({ variant: 'non-conform' });
				doc.save(`${fileName}.pdf`);
			},
			x: 10,
			y: 10,
			autoPaging: "text",
			width: 550,
			windowWidth: 700,
			margin: 20,
		});
	};

	return <Button onClick={() => downloadClickHandler(pdfContentID, file)}>Download PDF</Button>;
}