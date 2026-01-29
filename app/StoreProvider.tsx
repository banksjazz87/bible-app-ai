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

        const getUserRoles = (userData: UserRoles): {userRole: string, maxRequests: number} => {
            const data = {
                userRole: '',
                maxRequests: 0
            };
            
            if (userData.super_admin) {
                data.userRole = "superAdmin";
                data.maxRequests = 5000;
			} else if (userData.premiere_tier) {
                data.userRole = "premiere";
                data.maxRequests = 50;
            } else if (userData.standard_tier) {
                data.userRole = "standard";
				data.maxRequests = 20;
            } else {
                data.userRole = "free";
				data.maxRequests = 5;
            }
            
            return data;
		};

        const loadUserRoles = async () => {

			const result = await getUserDetails();
			console.warn(`The user details are the following: ${result}`);

            if (result && result.status === 200) {
                
                const { userRole, maxRequests } = getUserRoles(result.data[0]);
				storeRef.current!.dispatch(
					loginUser({
						isLoggedIn: true,
						email: result.data[0].email_address,
                        userName: result.data[0].email_address.split("@")[0],
                        userRole: userRole,
                        maxRequests: maxRequests
					})
                );
			}
		};

		loadUserRoles();
	}, []);

	return <Provider store={storeRef.current}>{children}</Provider>;
}
