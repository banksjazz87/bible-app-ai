"use client";
import { useAppSelector } from "@/app/store/hooks"


export default function TestStore() {
    const userDetails = useAppSelector((state) => state.loggedInData.email);
    return (
        <p>{userDetails}</p>
    )
}