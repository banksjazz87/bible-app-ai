"use client";
import { useAppSelector } from "@/lib/store/hooks"


export default function TestStore() {
    const userDetails = useAppSelector((state) => state.loggedInData.email);
    return (
        <p>{`Email here , ${userDetails}`}</p>
    )
}