"use client";

import { JSX, useEffect, useEffectEvent, useState } from "react";
import CreateAccountForm from "./components/CreateAccountForm";
import { redirect } from "next/navigation";
import Alert from "@/app/ui/Alert";

export default function CreateAccount(): JSX.Element {
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [response, setResponse] = useState<number | null>(null);
	const [showAlert, setShowAlert] = useState<boolean>(false);
	const [alertTitle, setAlertTitle] = useState<string>("");

	const updateAlertModal = useEffectEvent((response:number | null): void => {
		if (response !== null) {
			setShowAlert(true);
		}
	})
		
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
			<CreateAccountForm
				responseHandler={setResponse}
				alertMessageHandler={setAlertMessage}
				alertTitleHandler={setAlertTitle}
			/>
		</main>
	);
}
