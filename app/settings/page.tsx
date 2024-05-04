import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route"
import Navbar from '@/components/Navbar';
import { UserSession } from "@/types";
import Settings from "@/components/Settings";
import { redirect } from "next/navigation";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Settings | WiredIn',
};


export default async function SettingsPage() {

    const session = (await getServerSession(authOptions)) as UserSession;
    if (!session) redirect('/')

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Settings user={session.user} />
            </div>
        </>
    )
}