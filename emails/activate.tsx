import { Html, Head, Container, Link, Section, Row, Column, Text, Font } from "@react-email/components";
import * as React from "react";

export default function ActivateTemplate(params: { token: string, siteURL: string, user: string }) {

    const { token, siteURL, user = 'Test' } = params

    return (
        <Html style={mainStyle}>
            <Head>
                <Font
                    fontFamily="Montserrat"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap&format=woff2",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>

            <Section style={header}>
                <Row>
                    <Column>
                        <Link style={gradient} href={`${siteURL}`}>
                            WiredIn
                        </Link>
                    </Column>
                    <Column>
                        <Column>
                            <Link style={link} href={`${siteURL}/feed`}>
                                Feed
                            </Link>
                        </Column>
                        <Column>
                            <Link style={link} href={`${siteURL}/forums`}>
                                Forums
                            </Link>
                        </Column>
                        <Column>
                            <Link style={link} href={`${siteURL}/contracts`}>
                                Contracts
                            </Link>
                        </Column>
                        <Column>
                            <Link style={link} href={`${siteURL}/jobs`}>
                                Jobs
                            </Link>
                        </Column>
                    </Column>
                </Row>
            </Section>

            <Section style={body}>
                <Text style={textHeader}>Activate Your Account</Text>
                <Text style={bodyGreeting}>Welcome {user},</Text>
                <Text style={bodyText}>
                    <Link href={`${siteURL}/activate/${token}`}>Click Here</Link>
                    &nbsp;To Activate Your Account
                </Text>
                <Text style={bodyClosing}>Best Regards,</Text>
                <Text style={bodyClosingSender}>Support @ WiredIn</Text>
            </Section>

            <Section style={footer}>
                <Text style={fancy}>WiredIn</Text>
                <Text style={footerText}>&nbsp;by Gurkarn Dhaliwal</Text>
            </Section>

        </Html >
    );
}

type BoxSizing = 'content-box' | 'border-box';

const mainStyle = {
    fontFamily: 'Montserrat',
    boxSizing: 'border-box' as BoxSizing,
    padding: 0,
    margin: 0,
    backgroundColor: '#d9d9d9',
    height: 'fit-content',
    width: '1000px'
}

const header = {
    paddingLeft: '40px',
    backgroundColor: '#000000',
    height: '100px',
}

const gradient = {
    fontSize: '50px',
    fontWeight: 'bold',
    color: '#0096ff',
};

const link = {
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '30px',
    marginRight: '40px'
}

const body = {
    backgroundColor: '#d9d9d9',
    minHeight: '300px',
    paddingTop: '50px',
    paddingBottom: '50px',
    textAlign: 'center' as TextAlign,
    lineHeight: '100px',
}

const textHeader = {
    fontSize: '50px',
    fontWeight: 800,
    color: '#000000',
}

const bodyGreeting = {
    fontSize: '30px',
    fontWeight: 400,
    color: '#000000',
    textAlign: 'left' as TextAlign,
    paddingLeft: '150px',
    marginTop: '50px'
}

const bodyText = {
    marginTop: '50px',
    fontSize: '30px',
    fontWeight: 400,
    color: '#000000',
}

const bodyClosing = {
    fontSize: '30px',
    fontWeight: 400,
    color: '#000000',
    textAlign: 'left' as TextAlign,
    paddingLeft: '150px',
    marginTop: '50px'
}

const bodyClosingSender = {
    fontSize: '30px',
    fontWeight: 400,
    color: '#000000',
    textAlign: 'left' as TextAlign,
    paddingLeft: '250px',
}

type TextAlign = 'center' | 'left' | 'right'

const footer = {
    backgroundColor: '#000000',
    height: '100px',
    textAlign: 'center' as TextAlign,
    lineHeight: '100px',
};

const fancy = {
    fontSize: '20px',
    fontWeight: 800,
    color: '#ff00ff',
    display: 'inline-block',
};

const footerText = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#ffffff',
    display: 'inline-block',
    marginLeft: '10px',
};