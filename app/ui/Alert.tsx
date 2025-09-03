import { JSX } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertProps } from "@/lib/definitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";


export default function Alert({
    isOpen,
	openHandler,
	closeHandler,
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
				<button
					type="button"
					className="absolute right-2 top-2 p-2 hover:text-slate-400 hover:cursor-pointer"
					onClick={() => closeHandler()}
				>
					<FontAwesomeIcon
						icon={faTimes}
					/>
				</button>
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
