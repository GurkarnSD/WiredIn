import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { UserSession } from "@/types";
import MyJobs from "@/components/Jobs/MyJobs";
import { redirect } from "next/navigation";

export default async function MyJobsPage() {

    const session = (await getServerSession(authOptions)) as UserSession;
    if (!session) redirect('/')

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <MyJobs user={session.user} />
            </div>
        </>
    )
}