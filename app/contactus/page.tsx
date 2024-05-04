import styles from '@/styles/ContactUs.module.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Navbar from "@/components/Navbar"
import { UserSession } from "@/types"
import ContactForm from '@/components/ContactForm'
import { redirect } from "next/navigation";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | WiredIn',
};

export default async function ContactUsPage() {

    const session = (await getServerSession(authOptions)) as UserSession;
    if (!session) redirect('/')

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div className={styles.container}>
                <ContactForm session={session} />
            </div>
        </>
    )
}