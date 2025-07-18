"use client";

import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { JSX } from "react";

type DownloadButtonProps = {
    pdfContentID: string,
    file: string
}

export default function DownloadButton({pdfContentID, file } : DownloadButtonProps): JSX.Element {

    const downloadClickHandler = (pdfContentID: string, fileName: string): void => {
        const pdfContent = document.getElementById(pdfContentID) as HTMLElement;
        const doc: jsPDF = new jsPDF('p', 'pt', 'a4');
    
            doc.html(pdfContent, {
                callback: function (doc: jsPDF) {
                    doc.save(`${fileName}.pdf`);
                },
                x: 10,
                y: 10,
                width: 570,
                windowWidth: 700
            });
    }
    
    return (
        <Button onClick={() => downloadClickHandler(pdfContentID, file)}>Download</Button>
    )
}