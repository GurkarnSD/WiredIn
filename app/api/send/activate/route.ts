import ActivateTemplate from "@/emails/index";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = await resend.emails.send({
      from: "WiredIn <activation@wiredin.social>",
      to: body.email,
      subject: "Activate Your Account",
      react: ActivateTemplate({
        token: body.token,
        siteURL: process.env.API_URL || "",
        user: body.user,
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
