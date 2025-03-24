import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BibleFormData } from "@/lib/definitions";    

type AIOptionsProps =  {
    selectedBibleData: BibleFormData;
}

export default function AIOptions({ selectedBibleData }: AIOptionsProps) {

    const dataIsPresent = (): boolean => {
        let key: keyof typeof selectedBibleData;
        for (key in selectedBibleData) {
            if (selectedBibleData[key] === '') {
                return false;
            }
        }
        return true;
    }

    const clickHandler = (): void => {
        if (!dataIsPresent()) {
            alert('Please search before using this.');
        }
        console.log(selectedBibleData);
    }

	return (
		<div className="flex flex-col gap-4 border-slate-800 border rounded-md p-5">
			<h2 className="font-bold text-xl">Would you like some assistance?</h2>
			<Button
				variant="outline"
				onClick={() => clickHandler()}
			>
				What is this about?
			</Button>
			<Button variant="outline" onClick={() => clickHandler()}>Create a sermon.</Button>
			<Button variant="outline" onClick={() => clickHandler()}>Create discussion questions.</Button>
		</div>
	);
}