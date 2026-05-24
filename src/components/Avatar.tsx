type Props = {
    avatar: string
    initials: string
    name: string

}

export default function Avatar({avatar, initials, name }: Props) {
    if (avatar) {
        return (
            <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover" />
        )
    }

    return (
        <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-sm font-semibold text-violet-700 select-none">
            {initials}
        </div>
    )
}