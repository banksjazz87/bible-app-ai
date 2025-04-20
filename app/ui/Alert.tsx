import { JSX } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type AlertProps = {
	isOpen: boolean;
	openHandler: (isOpen: boolean) => void;
	title: string;
	description: string;
	confirmText: string;
	cancelText: string;
	cancelHandler: () => void;
	confirmHandler: () => void;
};

export default function Alert({isOpen, openHandler, title, description, confirmText, cancelHandler, confirmHandler, cancelText}: AlertProps): JSX.Element {
    return (
			<AlertDialog
				open={isOpen}
				onOpenChange={openHandler}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
                    <AlertDialogCancel onClick={cancelHandler}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmHandler}>{confirmText}</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
}