import { JSX } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertProps } from "@/lib/definitions";


export default function Alert({
    isOpen,
    openHandler,
    title,
    description,
    cancelHandler,
    confirmHandler,
    confirmText = "Okay",
    cancelText = "Cancel", }: AlertProps): JSX.Element {
    
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
