import { JSX, Suspense } from "react";
import { LLMReqObject } from "@/lib/definitions";
import { Skeleton } from "@/components/ui/skeleton";

type AIOutputProps = {
	LLMData: LLMReqObject[];
	isLoading: boolean;
};

export default function AIOutput({ LLMData, isLoading }: AIOutputProps) {
	if (isLoading) {
		return (
			<Suspense fallback={<AIOutputSkeleton />}>
				<AIOutputSection
					LLMData={LLMData}
					isLoading={isLoading}
				/>
				<AIOutputSkeleton />
			</Suspense>
		);
	} else {
		return (
			<AIOutputSection
				LLMData={LLMData}
				isLoading={isLoading}
			/>
		);
	}
}

function AIOutputSection({ LLMData, isLoading }: AIOutputProps) {
	return (
		<section className="col-span-2 flex flex-col gap-5">
			{LLMData.map((x: LLMReqObject, y: number): JSX.Element | undefined => {
				if (x.output.length > 0) {
					return (
						<article key={`LLM_output_${y}`}>
							<h2 className="uppercase font-extrabold text-3xl my-5">{x.heading}</h2>
							<div
								dangerouslySetInnerHTML={{ __html: x.output }}
								className="flex flex-col gap-5"
							></div>
						</article>
					);
				}
			})}
		</section>
	);
}

function AIOutputSkeleton() {
	return (
		<div className="col-span-2 flex-col">
			<div className="space-y-2">
				<Skeleton className="h-4" />
				<Skeleton className="h-4" />
				<Skeleton className="h-4" />
				<Skeleton className="h-4" />
			</div>
		</div>
	);
}
