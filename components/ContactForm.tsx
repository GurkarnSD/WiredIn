'use client';
import styles from "./styles/ContactForm.module.css";
import { useState } from "react"
import { UserSession } from "@/types";
import { toast } from 'sonner'

export default function ContactForm(params: { session: UserSession }) {

    const { session } = params

    const [contactForm, setContactForm] = useState({
        name: session ? session.user.displayName : "",
        email: session ? session.user.email : "",
        message: ""
    });
    const [type, setType] = useState("General");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setContactForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError('');
        setSubmitting(true);

        const contactFormInfo = {
            name: contactForm.name,
            email: contactForm.email,
            message: contactForm.message,
            type: type
        }

        if (!contactForm.name) {
            setError('Username is required');
            setSubmitting(false);
            return;
        }

        if (!contactForm.email) {
            setError('Email is required');
            setSubmitting(false);
            return;
        }

        if (!contactForm.message) {
            setError('Message is required');
            setSubmitting(false);
            return;
        }

        const res = await fetch('/api/contactus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contactForm: contactFormInfo })
        });

        if (!res.ok) {
            throw new Error('Failed to Submit Contact Form');
        } else {
            setContactForm({
                name: session ? session.user.displayName : "",
                email: session ? session.user.email : "",
                message: ""
            });
            setType("General");
            toast.success("Contact Form Uploaded")
        }

        setSubmitting(false);

        return res.json();
    }

    return (
        <div className={styles.container}>
            <div className={styles.contactFormHeader}>
                <h1 className={styles.title}>Contact Us</h1>
                {error && <div className={styles.error}>{error}</div>}
            </div>
            <form className={styles.formBody} onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                    <div className={styles.inputTitle}>Username</div>
                    <input className={styles.input} name='name' disabled={session.user.displayName ? true : false} value={contactForm.name} onChange={handleChange} />
                </div>
                <div className={styles.inputContainer}>
                    <div className={styles.inputTitle}>Email</div>
                    <input className={styles.input} name='email' disabled={session.user.email ? true : false} value={contactForm.email} onChange={handleChange} />
                </div>
                <div className={styles.inputContainer}>
                    <div className={styles.inputTitle}>Message Type</div>
                    <span className={styles.typeButtons}>
                        <button className={`${styles.typeButton} ${type === 'General' ? styles.selectedButton : ''}`} onClick={() => setType("General")}>General</button>
                        <button className={`${styles.typeButton} ${type === 'Support' ? styles.selectedButton : ''}`} onClick={() => setType("Support")}>Support</button>
                        <button className={`${styles.typeButton} ${type === 'Bug' ? styles.selectedButton : ''}`} onClick={() => setType("Bug")}>Bug</button>
                        <button className={`${styles.typeButton} ${type === 'Feedback' ? styles.selectedButton : ''}`} onClick={() => setType("Feedback")}>Feedback</button>
                    </span>
                </div>
                <div className={styles.largeInputContainer}>
                    <div className={styles.inputTitle}>Description</div>
                    <textarea className={styles.message} aria-multiline name='message' value={contactForm.message} onChange={handleChange} />
                </div>
                <button className={styles.submit} type='submit' disabled={submitting}>Submit Form</button>
            </form>
        </div>
    )
}