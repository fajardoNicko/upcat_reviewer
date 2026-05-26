import { SkeletonBlock } from '../Skeletons'

export default function DashboardSkeletion() {
    return(
        <>
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                <SkeletonBlock className='h-4 w-32' />
                <SkeletonBlock className='h-9 w-9 rounded-full' />
            </div>

            <div className="max-w-7xl mx-auto px-5 py-8">
                <div className="flex items-center justify-between mb-7">
                    <SkeletonBlock className='h-4 w-28' />
                    <SkeletonBlock className='h-6 w-48' />
                    <SkeletonBlock className='h-9 w-9 rounded-full' />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-7">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className='bg-white dark:bg-gray-950 rounded-2xl p-4 border border-gray-100 dark:border-gray-800'>
                            <SkeletonBlock className='h-3 w-24 mb-3' />
                            <SkeletonBlock className='h-7 w-16' />
                        </div>
                    ))}
                </div>
                <SkeletonBlock className='h-3 w-16 mb-3' />

                <div className="grid grid-cols-4 gap-3 mb-7">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className='bg-white dark:bg-gray-950 rounded-2xl p-5 border border-gray-100 dark:border-gray-800'>
                            <SkeletonBlock className='h-10 w-10 rounded-xl mb-3' />
                            <SkeletonBlock className='h-5 w-32 mb-2' />
                            <SkeletonBlock className='h-3 w-24 mb-1' />
                            <SkeletonBlock className='h-3 w-20 mb-1' />
                            <SkeletonBlock className='h-1 w-full rounded-full' />
                        </div>
                    ))}
                </div>
                <SkeletonBlock className='h-3 w-40 mb-3' />
                <SkeletonBlock className='h-20 w-full rounded-2xl' />
            </div>
        </div>
        
        </>
    )
}