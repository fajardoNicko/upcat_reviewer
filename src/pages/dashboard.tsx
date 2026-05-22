import  ResumeStrip from "../components/dashboard/ResumeStrip";
import  StatCard  from "../components/dashboard/StatCard";
import  { SubjectCard }  from "../components/dashboard/SubjectCard";

export default function Dashboard() {
    return (
        <>

        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-5 py-8">
                {/* Header Part */}
                <div className="flex items-center justify-between mb-7">
                    <div>
                        <p className="text-sm text-gray-400 mb-0.5"> Good Morning!</p>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Entrance Exam Reviewer</h1>
                </div>
                <div className="w-9 rounded-full bg-violet-100 flex items-center justify-center text-sm font-semibold text-violet-700 select-none">
                    NF
                </div>
            </div>

            {/* StatCards */}
                <div className="grid grid-cols-3 gap-3 mb-7">
                   {/*
                    <StatCard label="Cards reviewed" />
                    <StatCard label="Cards to review" />
                    <StatCard label="Accuracy" />
                   */} 
                </div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-3">
                    Subjects
                </p>
                <div className="grid grid-cols-2 gap-3 mb-7">

                </div>
        </div>
        </> 
 
    )
}

