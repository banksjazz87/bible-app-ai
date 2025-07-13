"use client";

import { JSX } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveSermonData, ChatThread } from "@/lib/definitions";
import {saveSermonData} from "@/app/bible/actions";


type SaveModalFormProps = {
	isOpen: boolean;
	openHandler: (isOpen: boolean) => void;
	cancelHandler: () => void;
	confirmHandler: () => void;
	currentData: SaveSermonData;
};

const saveFormSchema = z.object({
	projectTitle: z.string().min(5, { message: "Please make your title longer than 5 characters." }),
});

export default function SaveModalForm({ isOpen, openHandler, cancelHandler, confirmHandler, currentData }: SaveModalFormProps): JSX.Element {
	const form = useForm<z.infer<typeof saveFormSchema>>({
		resolver: zodResolver(saveFormSchema),
		defaultValues: {
			projectTitle: "",
		},
	});

	function onSubmit(values: z.infer<typeof saveFormSchema>) {
		const {
			version,
			book,
			chapter,
			startVerse,
			endVerse,

		} = currentData.bibleData;

		const newChatData: ChatThread = {
			thread_name: values.projectTitle.trim(),
			bible_version: version,
			book: book,
			chapter: chapter.toString(),
			start_verse: startVerse.toString(),
			end_verse: endVerse.toString(),
			llm_notes: currentData.LLMOutput,
			user_notes: 'Testing user notes',
			user_id: '1',
			id: 1,
			thread_slug: '',
			date_created: '', 
			last_modified: ''

		}

		saveSermonData(values.projectTitle, newChatData)
			.then(data => {
				console.log('HEREEEEE ', data);
				if (data.status === 500) {
					alert(`The following error has occurred: ${data.message}`);
				} else {
					alert('The data has been saved.');
					cancelHandler();
				}
			});
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={openHandler}
		>
			<DialogContent className="gap-2">
				<DialogHeader>
					<DialogTitle>Project Name</DialogTitle>
					<DialogDescription>Please enter a name to save the project as.</DialogDescription>
				</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-5 w-full mx-auto"
						>
							<FormField
								control={form.control}
								name="projectTitle"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder=""
												type="text"
												{...field}
												className="border-slate-600 rounded-none"
											/>
										</FormControl>
										<FormMessage className="text-red-700" />
									</FormItem>
								)}
							/>
							<Button type="submit">Submit</Button>
						</form>
					</Form>
			</DialogContent>
		</Dialog>
	);
}
