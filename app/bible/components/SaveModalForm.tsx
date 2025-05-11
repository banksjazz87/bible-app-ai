"use client";

import { JSX } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BibleFormData, LLMReqObject } from "@/lib/definitions";

type saveFormData = {
	bibleData: BibleFormData,
	LLMOutput: LLMReqObject[]
}

type SaveModalFormProps = {
    isOpen: boolean;
    openHandler: (isOpen: boolean) => void;
    cancelHandler: () => void;
	confirmHandler: () => void;
	currentData: saveFormData;
}

const saveFormSchema = z
    .object({
        projectTitle: z.string().min(5, { message: "Please make your title longer than 5 characters." })
    })

export default function SaveModalForm({ isOpen, openHandler, cancelHandler, confirmHandler, currentData }: SaveModalFormProps): JSX.Element {
	const form = useForm<z.infer<typeof saveFormSchema>>({
		resolver: zodResolver(saveFormSchema),
		defaultValues: {
			projectTitle: "",
		},
	});

	function onSubmit(values: z.infer<typeof saveFormSchema>) {
		console.log(`The name of this project will be ${values.projectTitle}`);
	}

	return (
		<AlertDialog
			open={isOpen}
			onOpenChange={openHandler}
		>
			<AlertDialogTrigger>Open</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Project Name</AlertDialogTitle>
					<AlertDialogDescription>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-5 w-100 mx-auto"
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
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}