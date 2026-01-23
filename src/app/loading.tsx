export default function Loading() {
    return (
        <div className="container" style={{ padding: '6rem 0' }}>
            <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
                {/* Header Skeleton */}
                <div className="space-y-4 text-center mb-12">
                    <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4 mx-auto"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-1/2 mx-auto"></div>
                </div>

                {/* Search Skeleton */}
                <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full max-w-2xl mx-auto mb-16"></div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
