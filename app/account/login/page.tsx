"use client";

import { JSX, useEffect,  useState } from "react";
import Alert from "@/app/ui/Alert";
import LoginForm from "@/app/account/login/components/LoginForm";
import { redirect } from 'next/navigation';
import { useSearchParams } from "next/navigation";


export default function Login(): JSX.Element {
	const [alertMessage, setAlertMessage] = useState<string>('');
	const [response, setResponse] = useState<number | null>(null);
	const [showAlert, setShowAlert] = useState<boolean>(false);
	const [alertTitle, setAlertTitle] = useState<string>('');

	const params = useSearchParams();
	const optionValue = params.get('option') ? params.get('option') : null;

	useEffect((): void => {
		if (response !== null && response !== 200) {
			setShowAlert(true);
		} else if (response !== null && response === 200) {
			if (optionValue) {
				redirect(`/subscribe?option=${optionValue}`);
			} else {
				redirect('/bible');
			}
		}
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
			<LoginForm 
				responseHandler={setResponse}
				alertMessageHandler={setAlertMessage}
				alertTitleHandler={setAlertTitle}
			/>
		</main>
	);
}
