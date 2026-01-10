"use client";

import { useState, useEffect, JSX, Suspense, useEffectEvent } from "react";
import { FieldValues } from "react-hook-form";
import BibleForm from "./components/BibleForm";
import { useSearchParams } from "next/navigation";
import { BibleFormData, Verses, LLMReqObject } from "@/lib/definitions";
import BibleVerses from "./components/BibleVerses";
import { Button } from "@/components/ui/button";
import { DefaultBibleFormData } from "@/lib/bible/bibleData";
import AIOptions from "@/app/bible/components/AIOptions";
import AIOutput from "@/app/bible/components/AIOutput";
import SaveModalForm from "./components/SaveModalForm";
import DownloadPDFButton from "../account/profile/thread/[slug]/components/DownloadPDFButton";
import Alert from "../ui/Alert";
import { useRouter } from "next/navigation";


const initLLMReqAndOutput = [
	{
		heading: "What is this about?",
		output: "",
	},
	{
		heading: "Suggested Sermon",
		output: "",
	},
	{
		heading: "Discussion Questions",
		output: "",
	},
];

export default function Bible(): JSX.Element {
	return (
		<Suspense fallback={<p>...loading</p>}>
			<PageContent />
		</Suspense>
	);
}

function PageContent() {
	const searchParams = useSearchParams();
	const [currentChapterText, setCurrentChapterText] = useState<Verses[]>([]);
	const [showChapterText, setShowChapterText] = useState<boolean>(false);
	const [bibleData, setBibleData] = useState<BibleFormData>(DefaultBibleFormData);
	const [LLMReqAndOutput, setLLMReqAndOutput] = useState<LLMReqObject[]>(initLLMReqAndOutput);
	const [LLMisLoading, setLLMisLoading] = useState<boolean>(false);
	const [showSaveForm, setShowSaveForm] = useState<boolean>(false);
	const [userRoles, setUserRoles] = useState<string>('freeTier');
	const [maxRequests, setMaxRequests] = useState<number>(5);
	const [errorMessage, setErrorMessage] = useState<string>('Testing');
	const [showAlert, setShowAlert] = useState<boolean>(false);
	const [alertTitle, setAlertTitle] = useState<string>('Error');
	const [requestStatus, setRequestStatus] = useState<number>(200);

	const router = useRouter();
	const setLLMReqInit = useEffectEvent((): void => setLLMReqAndOutput(initLLMReqAndOutput));
	const getBibleRequestData = useEffectEvent((): void => {
		const version = searchParams.get("version") as string;
		const book = searchParams.get("book") as string;
		const chapter = searchParams.get("chapter") as string;
		const startVerse = searchParams.get("startVerse") as string;
		const endVerse = searchParams.get("endVerse") as string;

		const neededValues: string[] = [version, book, chapter, startVerse, endVerse];
		let isValid = true;
		neededValues.forEach((value: string) => {
			if (value?.length === 0 || value === null) {
				isValid = false;
			}
		});

		if (isValid) {
			console.log("Fired again");
			setShowChapterText(true);
			setBibleData({
				...bibleData,
				version: version,
				book: book,
				chapter: chapter,
				startVerse: startVerse,
				endVerse: endVerse,
			});
		}
	});

	useEffect((): void => {
		getBibleRequestData();
		setLLMReqInit();
	}, []);

	useEffect((): void => {
		getBibleRequestData();
	}, []);



	//Set our userRoles and maxRequests on initial load
	useEffect((): void => {
		const fetchUserRoles = async () => {
			try {
				const response = await fetch('/api/user-roles');
				const data = await response.json();
			
				if (data.status === 200 && data.data) {
					const userData = data.data[0];
					if (userData.super_admin) {
						setUserRoles('superAdmin');
						setMaxRequests(5000);
					} else if (userData.premiere_tier) {
						setUserRoles('premiere');
						setMaxRequests(50);
					} else if (userData.standard_tier) {
						setUserRoles('standard');
						setMaxRequests(20);
					}
				} else {
					setUserRoles("freeTier");
					setMaxRequests(5);
				}
			} catch (error) {
				console.error('Error fetching user roles:', error);
			}
		};
		fetchUserRoles();
	}, []);


	const updateAlertTitle = useEffectEvent((status: number): void => {
		if (status === 401 || status === 500) {
			setAlertTitle('Invalid User')
		} else if (status === 400) {
			setAlertTitle('Server Error')
		} else if (status === 429) {
			setAlertTitle('Too Many Requests')
		}
	});

	//ADD USE EFFECT HERE TO UPDATE THE ALERT TITLE
	useEffect((): void => {
		updateAlertTitle(requestStatus);
	}, [requestStatus]);




	//ADD CODE ABOVE 
	const resetLLMData = (): void => {
		const clearedData = LLMReqAndOutput.map((x: LLMReqObject) => {
			const currentObj = {
				heading: x.heading,
				output: "",
			};

			return currentObj;
		});

		setLLMReqAndOutput(clearedData);
	};

	const formHandler = (formData: FieldValues) => {
		resetLLMData();
		setShowChapterText(true);
		setBibleData({
			...bibleData,
			version: formData.version,
			book: formData.book,
			chapter: formData.chapter,
			startVerse: formData.startVerse,
			endVerse: formData.endVerse,
		});
	};

	const updateLLMOutputData = (output: string, index: number): void => {
		const copyOfData = LLMReqAndOutput.slice();
		copyOfData[index]["output"] = output;
		setLLMReqAndOutput(copyOfData);
	};

	const loginHandler = (): void => {
		setShowAlert(!showAlert);
		router.push('/account/login');	
	}

	const singUpHandler = (): void => {
		setShowAlert(!showAlert);
		router.push('/account/create-account');
	}

	return (
		<main className="grid grid-cols-3 py-10 gap-10 relative">
			<section
				id="options_sidebar"
				className="sticky top-10 col-span-1 flex flex-col gap-4"
			>
				<BibleForm
					submitHandler={formHandler}
					updateNeededChapter={(data: Verses[]) => setCurrentChapterText(data)}
				/>

				{showChapterText && (
					<AIOptions
						selectedBibleData={bibleData}
						updateOutput={(output: string, index: number): void => updateLLMOutputData(output, index)}
						startLoading={(): void => setLLMisLoading(true)}
						stopLoading={(): void => setLLMisLoading(false)}
						userRole={userRoles}
						maxRequests={maxRequests}
						updateErrorMessage={(message: string, status: number): void => {
							setErrorMessage(message);
							setRequestStatus(status);
							setShowAlert(true);
						}}
					/>
				)}
			</section>

			{showChapterText && (
				<section className="flex flex-col gap-5 my-10 col-span-2">
					
					<Alert
						isOpen={showAlert}
						openHandler={(): void => setShowAlert(!showAlert)}
						closeHandler={(): void => setShowAlert(false)}
						title={alertTitle}
						description={errorMessage}
						cancelHandler={(): void => requestStatus === 429 ? setShowAlert(false) : singUpHandler()}
						confirmHandler={(): void => requestStatus === 429 ? router.push("/pricing") : loginHandler()}
						confirmText={requestStatus === 429 ? "Yes" : "Login"}
						cancelText={requestStatus === 429 ? "No" : "Sign Up"}
					/>
					
					<div className="flex flex-col gap-4">
						<h2 className="uppercase font-extrabold text-3xl">{`${bibleData.book} ${bibleData.chapter}:${bibleData.startVerse} - ${bibleData.endVerse}`}</h2>

						<div className="flex flex-row flex-start gap-2">
							<Button
								className="hover:cursor-pointer"
								onClick={(): void =>
									setBibleData({
										...bibleData,
										startVerse: "1",
										endVerse: currentChapterText.length.toString(),
									})
								}
							>
								Read Full Chapter
							</Button>
							<Button
								className="hover:cursor-pointer"
								onClick={(): void => setShowSaveForm(true)}
							>
								Save
							</Button>
							<DownloadPDFButton
								pdfContentID="output-content"
								file={`${bibleData.book}-${bibleData.chapter}-${bibleData.startVerse}-${bibleData.endVerse}`}
							/>
						</div>
					</div>

					<div id="output-content">
						<BibleVerses
							versesArray={currentChapterText}
							startVerse={bibleData.startVerse}
							endVerse={bibleData.endVerse}
						/>
						<AIOutput
							LLMData={LLMReqAndOutput}
							isLoading={LLMisLoading}
						/>
					</div>
				</section>
			)}

			<SaveModalForm
				isOpen={showSaveForm}
				openHandler={setShowSaveForm}
				cancelHandler={(): void => setShowSaveForm(false)}
				confirmHandler={(): void => setShowSaveForm(false)}
				currentData={{
					bibleData: bibleData,
					LLMOutput: LLMReqAndOutput,
				}}
			/>
		</main>
	);
}
