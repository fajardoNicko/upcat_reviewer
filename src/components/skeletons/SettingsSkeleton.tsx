import { SkeletonBlock } from '../Skeletons'

export default function SettingsSkeleton() {
    return(
        <>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex iems-center justify-between">
                <div className="flex items center gap-2">
                    <SkeletonBlock className='h-4 w-20' />
                    <SkeletonBlock className='h-4 w-4' />
                    <SkeletonBlock className='h-4 w-16' />
                </div>
                <SkeletonBlock className='h-9 w-9 rounded-full' />
            </div>
            <div className="flex max-w-7xl mx-auto w-full px-5 py-8 gap-6">
                <div className="w-64 shrink-0 flex flex-cols gap-1">
                    {[...Array(4)].map((_, i) => (
                        <SkeletonBlock key={i} className='h-10 w-full rounded-xl' />
                    ))}
                </div>

                <div className="flex-1 flex flex-cols gap-4">
                    <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                        <SkeletonBlock className='h-5 w-40 mb-5' />
                        <div className="flex items-center gap-4 mb-6">
                            <SkeletonBlock className='h-9 w-9 rounded-full' />
                            <div className="flex flex-col gap-2">
                                <SkeletonBlock className='h-4 w-32' />
                                <SkeletonBlock className='h-3 w-40' />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <SkeletonBlock className='h-10 rounded-xl' />
                            <SkeletonBlock className='h-10 rounded-xl' />
                        </div>
                        <SkeletonBlock className='h-10 rounded-xl mb-3' />
                        <SkeletonBlock className='h-10 rounded-xl mb-6' />
                        <SkeletonBlock className='h-10 w-32 rounded-xl' />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}