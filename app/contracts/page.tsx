import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { UserSession } from "@/types";
import ContractSearch from "@/components/Contracts/ContractSearch";
import { getContractsPrisma } from "@/lib/prisma/contracts";

export default async function ContractsPage() {

    const session = (await getServerSession(authOptions)) as UserSession;
    const contracts = await getContractsPrisma(session.user.uid);

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ContractSearch contracts={contracts} user={session.user} />
            </div>
        </>
    )
}