"use client";

import { JSX } from "react";
import { useAppSelector } from "@/lib/store/hooks";


export default function PaymentDetails(): JSX.Element {
    const userEmail = useAppSelector((state) => state.loggedInData.userName);
    
    return (
        <div>
            <h1>Payment details will be listed here</h1>
            <p>{`User email is ${userEmail}`}</p>
        </div>
    )
}