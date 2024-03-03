import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { UserSession } from "@/types";
import JobSearch from "@/components/Jobs/JobSearch";
import { getJobsPrisma } from "@/lib/prisma/jobs";

export default async function JobsPage() {

    const session = (await getServerSession(authOptions)) as UserSession;
    const jobs = await getJobsPrisma(session.user.uid);

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <JobSearch jobs={jobs} user={session.user} />
            </div>
        </>
    )
}