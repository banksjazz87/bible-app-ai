import { createClient } from "@/utils/supabase/server";
import { GetCurrentUserId } from "../data";
import { APIResponse } from "../definitions";

/**
 * Class used to increment the daily number of requests.
 */
export default class IncrementDailyRequests {
	limit: number;

	/**
	 *
	 * @param limit number The number of requests that can be be made for a user.
	 */
	constructor(limit: number) {
		this.limit = limit;
	}

	/**
	 *
	 * @returns the user id or null.
	 */
	async userID(): Promise<string | null> {
		const userId = await GetCurrentUserId();
		return userId;
	}

	/**
	 *
	 * @returns Promise<APIResponse> we're just returning a status and a message within the response.
	 */
	async main(): Promise<APIResponse> {
		const supabase = await createClient();
		const userId = await this.userID();

        //Set default response
		const responseData = {
			status: 500,
			message: "This user is not found",
		};

        //User not authenticated
		if (!userId) {
			console.error("User is not authenticated");
			responseData.message = "User is not authenticated";
			responseData.status = 401;
		}

        //Retrieve the data found for the current user id
		const { data, error } = await supabase.from("daily_requests").select("total_requests").eq("user_id", userId);

        //Something has gone wrong with fetching the data
		if (error) {
			console.error(`Error fetching daily requests: ${error}`);
			responseData.message = `Error fetching daily requests: ${error}`;
			responseData.status = 400;
		}

        //If data is currently present, and not empty
		if (data && data.length > 0) {
            const newTotal = data[0].total_requests + 1;
            
            console.log("HERE newTotal:", newTotal);
            console.log("HERE max: ", this.limit);
            console.log(newTotal > this.limit);

            //User has reached their daily limit
			if (newTotal > this.limit) {
				console.warn("User has exceeded their daily request limit.");
				responseData.message = "It looks like you've used up your daily tokens.";
                responseData.status = 400;
                
                return responseData;
			}

			//Update the total requests table
			const { error } = await supabase.from("daily_requests").update({ total_requests: newTotal }).eq("user_id", userId);

            //Error updating the daily_requests table
			if (error) {
				console.error(`Error updating daily requests: ${error}`);
				responseData.message = `Error updating the daily requests: ${error}`;
                responseData.status = 400;
                
            //Success updating already existing data
			} else {
				responseData.status = 201;
				responseData.message = "Daily requests record created successfully";
            }
            
        //Fires if no data was found in the table
        } else {
            
            //Set an initial value
			const { error } = await supabase.from("daily_requests").insert({ user_id: userId, total_requests: 1 });

            //Error setting value
			if (error) {
				console.error(`Error inserting daily requests: ${error}`);
				responseData.message = `Error inserting daily requests: ${error}`;
                responseData.status = 400;
                
            //Success setting initial value
			} else {
				responseData.status = 201;
				responseData.message = "Daily requests record created successfully";
			}
		}

        //Return our response
		return responseData;
	}
}
