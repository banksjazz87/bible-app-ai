"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/store";
import { APIDataResponse, UserRoles } from "@/lib/definitions";
import { loginUser } from "@/lib/store/features/account/loginSlice";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
	const storeRef = useRef<AppStore | null>(null);

	if (!storeRef.current) {
		storeRef.current = makeStore();
	}

	useEffect(() => {
		const getUserDetails = async (): Promise<APIDataResponse<UserRoles[]> | undefined> => {
			try {
				const response = await fetch("/api/user-roles");

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return await response.json();
			} catch (e) {
				console.warn("The following error occurred", e);
				return undefined;
			}
		};

		const loadUserRoles = async () => {
			const result = await getUserDetails();

			if (result) {
                storeRef.current!.dispatch(loginUser({
                    isLoggedIn: true,
                    email: result.data[0].email_address,
                    userName: result.data[0].email_address.split('@')[0]
                }));
			}
		};

		loadUserRoles();
	}, []);

	return <Provider store={storeRef.current}>{children}</Provider>;
}
