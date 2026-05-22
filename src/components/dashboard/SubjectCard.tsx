import type { subject } from "../../types/subject";


export function SubjectCard({ subject }: { subject: subject }) {
    return(
        <>
        <div className="subject-card">
            <h3>{subject.name}</h3>
            {subject.description && <p> {subject.description}</p>}
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Start Reviewing</button>
        </div>
        </>
    )
}