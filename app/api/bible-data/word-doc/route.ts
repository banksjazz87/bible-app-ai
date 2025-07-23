import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';   

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName") || "download";
    const htmlID = searchParams.get("htmlID") || "htmlContent";

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Generated DOCX</title>
      </head>
      <body>
        <h1>Hello, world!</h1>
        <p>This DOCX was generated in the browser using <strong>html-docx-js-typescript</strong>.</p>
      </body>
    </html>
    `;

    try {
        const docxBlob = await asBlob(htmlContent);
        saveAs(docxBlob as Blob, `${fileName}.docx`);
        console.log("DOCX file created successfully");
    } catch (error) {
        console.error("DOCX generation failed:", error);
    }

    return new Response("DOCX download initiated");
}