const PropertyDetailsSkeleton = () => {
	return (
		<section className="py-8 sm:px-6 md:px-8 lg:p-10 flex flex-col items-center animate-pulse">
			<div className="w-full max-w-6xl mx-auto space-y-5">
				{/* title */}
				<div className="h-6 w-2/5 bg-[var(--highlight)]/30 rounded-lg ml-4 sm:ml-12 md:ml-24 lg:ml-32" />

				{/* images */}
				<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,300px))] gap-3 justify-center">
					{Array.from({ length: 3 }).map((_, idx) => (
						<div
							key={idx}
							className="w-full max-w-[300px] h-48 sm:h-52 bg-[var(--highlight)]/20 rounded-lg"
						/>
					))}
				</div>

				{/* description */}
				<div className="ml-4 sm:ml-12 md:ml-24 lg:ml-32 space-y-2 mt-6">
					<div className="h-4 w-1/5 bg-[var(--highlight)]/30 rounded" />
					<div className="h-3 w-3/5 bg-[var(--highlight)]/20 rounded" />
					<div className="h-3 w-4/5 bg-[var(--highlight)]/20 rounded" />
				</div>

				{/* amenities */}
				<div className="ml-4 sm:ml-12 md:ml-24 lg:ml-32 mt-6 space-y-2">
					<div className="h-4 w-1/4 bg-[var(--highlight)]/30 rounded" />
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="h-3 w-1/6 bg-[var(--highlight)]/20 rounded"
						/>
					))}
				</div>

				{/* type & status */}
				<div className="ml-4 sm:ml-12 md:ml-24 lg:ml-32 flex gap-3 mt-6">
					<div className="h-4 w-16 bg-[var(--highlight)]/20 rounded" />
					<div className="h-4 w-20 bg-[var(--highlight)]/20 rounded" />
				</div>

				{/* location & price */}
				<div className="ml-4 sm:ml-12 md:ml-24 lg:ml-32 mt-6 space-y-2">
					<div className="h-3 w-2/5 bg-[var(--highlight)]/20 rounded" />
					<div className="h-3 w-1/4 bg-[var(--highlight)]/20 rounded" />
				</div>

				{/* metadata */}
				<div className="ml-4 sm:ml-12 md:ml-24 lg:ml-32 mt-6 space-y-3">
					<div className="h-3 w-1/3 bg-[var(--highlight)]/20 rounded" />
					<div className="h-3 w-1/4 bg-[var(--highlight)]/20 rounded" />
				</div>

				{/* owner */}
				<div className="ml-4 sm:ml-12 md:ml-24 lg:ml-32 mt-8 space-y-3">
					<div className="h-3 w-1/6 bg-[var(--highlight)]/30 rounded" />
					<div className="flex items-center gap-5 bg-[var(--bg-light)] p-4 rounded-lg border border-[var(--highlight)]/40">
						<div className="w-12 h-12 bg-[var(--highlight)]/30 rounded-full" />
						<div className="h-4 w-1/4 bg-[var(--highlight)]/20 rounded" />
					</div>
				</div>
			</div>
		</section>
	);
};

export default PropertyDetailsSkeleton;
