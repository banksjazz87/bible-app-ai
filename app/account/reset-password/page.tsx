"use client";


import { JSX, useEffect, useState, useEffectEvent } from "react";
import ResetPasswordForm from "@/app/account/reset-password/components/ResetPasswordForm";
import Alert from "@/app/ui/Alert";

export default function Page(): JSX.Element {
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [response, setResponse] = useState<number | null>(null);
	const [showAlert, setShowAlert] = useState<boolean>(false);
	const [alertTitle, setAlertTitle] = useState<string>("");

	const updateAlertModal = useEffectEvent((response: number | null): void => {
		if (response !== null) {
			setShowAlert(true);
		}
	});

	useEffect((): void => {
		updateAlertModal(response);
	}, [response]);

	function modalCloseHandler(): void {
		setShowAlert(false);
		setResponse(null);
	}

	return (
		<main className="flex flex-col justify-center align-middle min-h-dvh mx-auto">
			<Alert
				isOpen={showAlert}
				openHandler={setShowAlert}
				title={alertTitle}
				description={alertMessage}
				cancelHandler={(): void => modalCloseHandler()}
				confirmHandler={(): void => modalCloseHandler()}
				closeHandler={(): void => setShowAlert(false)}
			/>
			<ResetPasswordForm
				responseHandler={setResponse}
				alertMessageHandler={setAlertMessage}
				alertTitleHandler={setAlertTitle}
			/>
		</main>
	);
}
