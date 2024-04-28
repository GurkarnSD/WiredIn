import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { UserSession } from "@/types";
import MyContracts from "@/components/Contracts/MyContracts";
import { redirect } from "next/navigation";

export default async function MyContractsPage() {

    const session = (await getServerSession(authOptions)) as UserSession;
    if (!session) redirect('/')

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <MyContracts user={session.user} />
            </div>
        </>
    )
}