import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { UserSession } from "@/types";
import ContractSearch from "@/components/Contracts/ContractSearch";
import { redirect } from "next/navigation";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contracts | WiredIn',
};


export default async function ContractsPage() {

    const session = (await getServerSession(authOptions)) as UserSession;
    if (!session) redirect('/')

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ContractSearch user={session.user} />
            </div>
        </>
    )
}