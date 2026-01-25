"use server";

import { JSX } from "react";

type MessageProps = {
	customerEmail: string | null | undefined;
	customerName: string | null | undefined;
};

export default async function Message({ customerName }: MessageProps): Promise<JSX.Element> {
    
        return (
            <p className="text-center">{`Thanks for your subscription to the Bible App ${customerName}!  We're so happy to have you with us.  If you would ever like to change or cancel your subscription you can do so within your account page.  Thanks again!  We're excited to have you on board.`}</p>
        )
    
}