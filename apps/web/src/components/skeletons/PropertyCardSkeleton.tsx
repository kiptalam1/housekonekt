const PropertyCardSkeleton = () => {
	return (
		<div className="w-full max-w-[300px] h-[320px] rounded-xl shadow-lg dark:border border-[var(--border-muted)] pb-3 animate-pulse">
			<div className="w-full h-1/2 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>

			<div className="flex items-center justify-between px-3 py-2 mt-2">
				<div className="bg-gray-300 dark:bg-gray-700 w-1/2 h-5 rounded-lg"></div>
				<div className="rounded-full h-5 w-1/4 bg-gray-300 dark:bg-gray-700"></div>
			</div>

			<div className="px-3 space-y-3">
				<div className="w-1/3 h-5 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
				<div className="w-1/2 h-5 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
				<div className="w-1/3 h-5 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
				<div className="w-3/4 h-5 bg-gray-300 dark:bg-gray-700 rounded-lg mb-2"></div>
			</div>
		</div>
	);
};

export default PropertyCardSkeleton;
