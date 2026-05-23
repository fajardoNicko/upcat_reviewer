type Props = {
    label: string
    value: number
    suffix?: string
}

export default function StatCard({ label, value, suffix } : Props) {
    return(
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-1">
                {label}
            </p>
            <p className="text-2xl font-semibold text-gray-900">
                {value}{suffix}
            </p>
        </div>
    )
}