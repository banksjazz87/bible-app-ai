"use client";

import { JSX, useEffect, useState } from "react";
import CreateAccountForm from "./components/CreateAccountForm";
import { redirect } from "next/navigation";
import Alert from "@/app/ui/Alert";

export default function CreateAccount(): JSX.Element {
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [response, setResponse] = useState<number | null>(null);
	const [showAlert, setShowAlert] = useState<boolean>(false);
	const [alertTitle, setAlertTitle] = useState<string>("");

	useEffect((): void => {
			if (response !== null && response !== 200) {
				setShowAlert(true);
			} else if (response !== null && response === 200) {
				redirect('/bible');
			}
		}, [response]);

	return (
		<main className="flex flex-col justify-center align-middle min-h-dvh mx-auto">
			<CreateAccountForm
				responseHandler={setResponse}
				alertMessageHandler={setAlertMessage}
				alertTitleHandler={setAlertTitle}
			/>
		</main>
	);
}
