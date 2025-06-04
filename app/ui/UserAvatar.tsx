"use client"

import { JSX, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserAvatar(): JSX.Element {
	return (
		<div>
			<Avatar>
				<AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                    <AvatarSkeleton />
                </AvatarFallback>
			</Avatar>
		</div>
	);
}


function AvatarSkeleton() {
    return (
        <div>
            <Skeleton className="w-[32px] h-[32px] rounded-full"/>
        </div>
    )
}
