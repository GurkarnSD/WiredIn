import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { UserSession } from "@/types";
import ContractSearch from "@/components/Contracts/ContractSearch";

export default async function ContractsPage() {

    const session = (await getServerSession(authOptions)) as UserSession;

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