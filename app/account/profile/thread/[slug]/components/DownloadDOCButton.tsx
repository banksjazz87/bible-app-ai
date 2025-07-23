"use client";
import { JSX } from "react";
import { Button } from "@/components/ui/button";
import {asBlob} from "html-docx-js-typescript";
import { saveAs } from "file-saver";




type DocButtonProps = {
	fileName: string;
	htmlID: string;
};

export default function DownloadDOCButton({ fileName, htmlID }: DocButtonProps): JSX.Element {
	// async function saveAsDoc() {
	// 	const docContent = document.getElementById(htmlID) as HTMLElement;
    //     const docAsString: string = docContent.outerHTML;
        
    //     console.log(docAsString);

    //     asBlob(docAsString).then(data => {
    //         console.log("Data here ", data);
	// 		saveAs(data as Blob, `${fileName}.docx`);
    //     })
    
    // };


    const handleDownload = () => {

        const htmlContent = `
            <p>Testing 123</p>
            `;

        asBlob(htmlContent).then((docxBlob) => {
            saveAs(docxBlob as Blob, `${fileName}.docx`);
            console.log("DOCX file created successfully");
        });
    }
    

    // return <Button onClick={saveAsDoc}>Download Word Doc</Button>;
    return <Button onClick={handleDownload}>Download Word Doc</Button>;
}
