import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route"
import Navbar from '@/components/Navbar';
import { SettingsSession, UserSession } from "@/types";
import Settings from "@/components/Settings";
import { redirect } from "next/navigation";
import { Metadata } from 'next';
import { getUserSessions } from "@/lib/prisma/user";

export const metadata: Metadata = {
    title: 'Settings | WiredIn',
};


export default async function SettingsPage() {

    const session = (await getServerSession(authOptions)) as UserSession;
    if (!session) redirect('/')

    const sessions = await getUserSessions(session.user.uid) as SettingsSession[];

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Settings user={session.user} currentSession={session.session} sessions={sessions} />
            </div>
        </>
    )
}