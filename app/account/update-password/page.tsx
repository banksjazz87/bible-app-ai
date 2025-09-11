"use client";

import { JSX, useEffect, useState } from "react";
import UpdatePasswordForm from "./components/UpdatePasswordForm";
import Alert from "@/app/ui/Alert";
import { redirect } from "next/navigation";

export default function UpdatePassword(): JSX.Element {
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [response, setResponse] = useState<number | null>(null);
	const [showAlert, setShowAlert] = useState<boolean>(false);
	const [alertTitle, setAlertTitle] = useState<string>("");

	useEffect((): void => {
		if (response !== null && response !== 200) {
			setShowAlert(true);
		} else if (response !== null && response === 200) {
			setShowAlert(true);
		}
	}, [response]);

	function modalCloseHandler(): void {
		setShowAlert(false);
		setResponse(null);
	}

	function closeAndRedirect(): void {
		setShowAlert(false);
		setResponse(null);
		redirect("/account/login");
	}

	return (
		<main className="flex flex-col justify-center align-middle min-h-dvh mx-auto">
			<Alert
				isOpen={showAlert}
				openHandler={setShowAlert}
				title={alertTitle}
				description={alertMessage}
				cancelHandler={(): void => modalCloseHandler()}
				confirmHandler={(): void => closeAndRedirect()}
				closeHandler={(): void => setShowAlert(false)}
			/>
			<UpdatePasswordForm
				responseHandler={setResponse}
				alertMessageHandler={setAlertMessage}
				alertTitleHandler={setAlertTitle}
			/>
		</main>
	);
}
