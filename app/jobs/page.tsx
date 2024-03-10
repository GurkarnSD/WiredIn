import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { UserSession } from "@/types";
import JobSearch from "@/components/Jobs/JobSearch";

export default async function JobsPage() {

    const session = (await getServerSession(authOptions)) as UserSession;

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <JobSearch user={session.user} />
            </div>
        </>
    )
}