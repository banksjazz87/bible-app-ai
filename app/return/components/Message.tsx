"use client";

import { JSX, useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { loginUser } from "@/lib/store/features/account/loginSlice";

type MessageProps = {
	customerEmail: string | null | undefined;
	customerName: string | null | undefined;
};

export default function Message({ customerEmail, customerName }: MessageProps): JSX.Element {
    const dispatch = useAppDispatch();
    const [isValid, setIsValid] = useState<boolean>(false);

    //Update our redux state, as it clears after a transaction has been processed with Stripe
    useEffect(() => {
        if (customerEmail && customerName) {
            setIsValid(true);
            const userName = customerEmail.split('@')[0];
            dispatch(loginUser({
                isLoggedIn: true,
                email: customerEmail,
                userName: userName
            }));
        }
    }, []);


    if (isValid) {
        return (
            <p className="text-center">{`Thanks for your subscription to the Bible App ${customerName}!  We're so happy to have you with us.  If you would ever like to change or cancel your subscription you can do so within your account page.  Thanks again!  We're excited to have you on board.`}</p>
        )
    } else {
        return <></>
    }
}