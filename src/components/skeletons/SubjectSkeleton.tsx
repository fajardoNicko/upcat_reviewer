import { SkeletonBlock } from '../Skeletons'

export default function SubjectSkeleton() {
    return (
        <div className="h-screen bg-gray-100 dark:bg-black flex flex-col">
            {/* Top Bar */}
            <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-4 w-20" />
                    <SkeletonBlock className="h-4 w-4" />
                    <SkeletonBlock className="h-4 w-24" />
                </div>
                <SkeletonBlock className="h-9 w-9 rounded-full" />
            </div>

            <div className="flex flex-1 max-w-7xl mx-auto w-full px-5 py-8 gap-6 overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 shrink-0 flex flex-col gap-4">
                    <SkeletonBlock className="h-3 w-16 mb-1" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i}>
                            <SkeletonBlock className="h-10 w-full rounded-xl mb-2" />
                            <div className="ml-4 flex flex-col gap-1.5">
                                {[...Array(3)].map((_, j) => (
                                    <SkeletonBlock key={j} className="h-7 w-4/5 rounded-lg" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main */}
                <div className="flex-1">
                    <div className="bg-white dark:bg-gray-950 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
                        <SkeletonBlock className="h-3 w-32 mb-6" />
                        <SkeletonBlock className="h-6 w-3/4 mb-3" />
                        <SkeletonBlock className="h-6 w-1/2 mb-8" />
                        <div className="flex flex-col gap-3">
                            {[...Array(4)].map((_, i) => (
                                <SkeletonBlock key={i} className="h-12 w-full rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}