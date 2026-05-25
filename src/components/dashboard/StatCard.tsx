import { type ReactNode } from 'react'


type Props = {
    label: string
    value: number
    suffix?: string
    icon?: ReactNode
}

export default function StatCard({ label, value, suffix, icon } : Props) {
    return(
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-1">
                {label}
            </p>
            <div className="flex items-center gap-1.5">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {value}{suffix}
                </p>
                {icon && <span className="text-orange-400">{icon}</span>}
            </div>
        </div>
    )
}