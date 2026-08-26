import { UserRoles, APIDataResponse } from "../definitions";

/**
 * Utility class set up for easy retrieval of user information.
 */

export default class User {

	async getUserDetails(): Promise<APIDataResponse<UserRoles[]> | undefined> {
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
	}

	getUserRoles(userData: UserRoles): { userRole: string; maxRequests: number } {
		const data = {
			userRole: "",
			maxRequests: 0,
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
	}

	async updateUserSubscription(userID: string, productID: string) {
		try {
			const response = await fetch("http://localhost:3000/api/update-user-roles", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ productId: productID, userId: userID }),
			});

			const finalData = await response.json();
			if (finalData.status !== 200) {
				console.error(`The following error occurred in updating the user role: ${finalData.message}`);
				return {
					status: 400,
					message: `The user has NOT been updated successfully.`
				}
			} else {
				return {
					status: 200,
					message: 'The user subscription has been updated successfully'
				}
			}
		} catch (error: unknown) {
			return {
				status: 400,
				message: `The following error occurred in making the update-user-role request: ${error instanceof Error && error.message}`
			}
		}
	}
}
